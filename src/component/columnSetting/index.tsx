import React from 'react';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider/context';
import { PushpinOutlined, SettingOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons';
import { Checkbox, Popover, Tooltip } from 'antd';
import { DndProvider } from 'react-dnd';
import Backend from 'react-dnd-html5-backend';
import Container, { ColumnsMapItem } from '../../container';
import { ProColumns } from '../../Table';
import DnDItem from './DndItem';
import './index.less';
import { useDeepCompareEffect } from '../util';

interface ColumnSettingProps<T = any> {
  columns?: ProColumns<T>[];
}

const ToolTipIcon: React.FC<{
  title: string;
  columnKey: string;
  show: boolean;
  fixed: 'left' | 'right' | undefined;
}> = ({ title, show, children, columnKey, fixed }) => {
  const { columnsMap, setColumnsMap } = Container.useContainer();
  if (show) {
    return (
      <Tooltip title={title}>
        <span
          onClick={() => {
            const config = columnsMap[columnKey || ''] || {};
            const columnKeyMap = {
              ...columnsMap,
              [columnKey]: { ...config, fixed } as ColumnsMapItem,
            };
            setColumnsMap(columnKeyMap);
          }}
        >
          {children}
        </span>
      </Tooltip>
    );
  }
  return null;
};

const CheckboxListItem: React.FC<{
  columnKey: string;
  className?: string;
  title?: React.ReactNode;
  columnsMap: {
    [key: string]: ColumnsMapItem;
  };
  fixed?: boolean | 'left' | 'right';
  setColumnsMap: (map: { [key: string]: ColumnsMapItem }) => void;
}> = ({ columnKey, className, columnsMap, title, setColumnsMap, fixed }) => {
  const config = columnsMap[columnKey || 'null'] || { show: true };
  return (
    <span className={`${className}-list-item`} key={columnKey}>
      <Checkbox
        onChange={e => {
          if (columnKey) {
            const tempConfig = columnsMap[columnKey || ''] || {};
            const columnKeyMap = {
              ...columnsMap,
              [columnKey]: { ...tempConfig, show: e.target.checked } as ColumnsMapItem,
            };
            setColumnsMap(columnKeyMap);
          }
        }}
        checked={config.show !== false}
      >
        {title}
      </Checkbox>
      <span className={`${className}-list-item-option`}>
        <ToolTipIcon columnKey={columnKey} fixed="left" title="固定到左边" show={fixed !== 'left'}>
          <PushpinOutlined
            style={{
              transform: 'rotate(-90deg)',
            }}
          />
        </ToolTipIcon>
        <ToolTipIcon columnKey={columnKey} fixed={undefined} title="取消固定" show={!!fixed}>
          <VerticalAlignMiddleOutlined />
        </ToolTipIcon>
        <ToolTipIcon
          columnKey={columnKey}
          fixed="right"
          title="固定到右边"
          show={fixed !== 'right'}
        >
          <PushpinOutlined />
        </ToolTipIcon>
      </span>
    </span>
  );
};

const CheckboxList: React.FC<{
  list: ProColumns<any>[];
  className?: string;
  title: string;
  showTitle?: boolean;
}> = ({ list, className, showTitle = true, title: listTitle }) => {
  const { columnsMap, setColumnsMap, columns, setColumns } = Container.useContainer();
  const show = list && list.length > 0;

  if (!show) {
    return null;
  }
  const move = (id: string, targetIndex: number) => {
    const newColumns = [...columns];
    const findIndex = newColumns.findIndex(item => {
      const columnKey = `${item.key || ''}-${item.dataIndex || ''}`;
      return columnKey === id;
    });
    const item = { ...newColumns[findIndex] };
    newColumns.splice(findIndex, 1);
    if (targetIndex === 0) {
      newColumns.unshift(item);
    } else {
      newColumns.splice(targetIndex, 0, item);
    }
    setColumns(newColumns);
  };

  const listDom = list.map(({ key, dataIndex, title, fixed }, index) => {
    const columnKey = `${key || ''}-${dataIndex || ''}`;
    return (
      <DnDItem
        index={index}
        id={columnKey}
        key={columnKey}
        end={(id, targetIndex) => {
          move(id, targetIndex);
        }}
      >
        <CheckboxListItem
          setColumnsMap={setColumnsMap}
          columnKey={columnKey}
          columnsMap={columnsMap}
          title={title}
          fixed={fixed}
          className={className}
        />
      </DnDItem>
    );
  });
  return (
    <DndProvider backend={Backend}>
      {showTitle && <span className={`${className}-list-title`}>{listTitle}</span>}
      {listDom}
    </DndProvider>
  );
};

const GroupCheckboxList: React.FC<{
  localColumns: ProColumns<any>[];
  className?: string;
}> = ({ localColumns, className }) => {
  const rightList: ProColumns<any>[] = [];
  const leftList: ProColumns<any>[] = [];
  const list: ProColumns<any>[] = [];

  localColumns.forEach(item => {
    const { fixed } = item;
    if (fixed === 'left') {
      leftList.push(item);
      return;
    }
    if (fixed === 'right') {
      rightList.push(item);
      return;
    }
    list.push(item);
  });
  const showRight = rightList && rightList.length > 0;
  const showLeft = leftList && leftList.length > 0;
  return (
    <div className={`${className}-list`}>
      <CheckboxList title="固定在左侧" list={leftList} className={className} />
      {/* 如果没有任何固定，不需要显示title */}
      <CheckboxList
        title="不固定"
        list={list}
        showTitle={showLeft || showRight}
        className={className}
      />
      <CheckboxList title="固定在右侧" list={rightList} className={className} />
    </div>
  );
};

const ColumnSetting = <T, U = {}>(props: ColumnSettingProps<T>) => {
  const counter = Container.useContainer();
  const localColumns: ProColumns<T>[] = props.columns || counter.columns || [];
  const { columnsMap, setColumnsMap, setColumns, initialColumns } = counter;
  /**
   * 设置全部选中，或全部未选中
   * @param show
   */
  const setAllSelectAction = (show: boolean = true) => {
    const columnKeyMap = {};
    localColumns.forEach(({ key, fixed, dataIndex }) => {
      const columnKey = `${key || ''}-${dataIndex || ''}`;
      if (columnKey) {
        columnKeyMap[columnKey] = {
          show,
          fixed,
        };
      }
    });
    setColumnsMap(columnKeyMap);
  };

  useDeepCompareEffect(() => {
    setAllSelectAction();
  }, localColumns);

  const selectKeys = Object.values(columnsMap).filter(value => !value || value.show !== false);
  const indeterminate = selectKeys.length > 0 && selectKeys.length !== localColumns.length;
  return (
    <ConfigConsumer>
      {({ getPrefixCls }: ConfigConsumerProps) => {
        const className = getPrefixCls('pro-table-column-setting');
        const toolBarClassName = getPrefixCls('pro-table-toolbar');
        return (
          <Popover
            arrowPointAtCenter
            getPopupContainer={() =>
              ((document.getElementById('ant-design-pro-table') ||
                document.body) as any) as HTMLElement
            }
            title={
              <div className={`${className}-title`}>
                <Checkbox
                  indeterminate={indeterminate}
                  checked={
                    selectKeys.length === localColumns.length ||
                    Object.values(columnsMap).length === 0
                  }
                  onChange={e => {
                    if (e.target.checked) {
                      setAllSelectAction();
                    } else {
                      setAllSelectAction(false);
                    }
                  }}
                >
                  列展示
                </Checkbox>
                <a
                  onClick={() => {
                    setColumnsMap({});
                    setColumns(initialColumns.current || []);
                  }}
                >
                  重置
                </a>
              </div>
            }
            trigger="click"
            placement="bottomRight"
            content={<GroupCheckboxList className={className} localColumns={localColumns} />}
          >
            <Tooltip
              title="列设置"
              getPopupContainer={() =>
                ((document.getElementById('ant-design-pro-table') ||
                  document.body) as any) as HTMLElement
              }
            >
              <SettingOutlined
                className={`${toolBarClassName}-item-icon`}
                style={{
                  fontSize: 16,
                }}
              />
            </Tooltip>
          </Popover>
        );
      }}
    </ConfigConsumer>
  );
};

export default ColumnSetting;
