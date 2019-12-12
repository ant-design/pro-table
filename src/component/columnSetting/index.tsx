import React, { useEffect } from 'react';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider/context';
import { Checkbox, Popover, Icon, Tooltip } from 'antd';
import Container, { ColumnsMapItem } from '../../container';
import { ProColumns } from '../../Table';
import './index.less';

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

const CheckboxList: React.FC<{
  localColumns: ProColumns<any>[];
  className?: string;
}> = ({ localColumns, className }) => {
  const { columnsMap, setColumnsMap } = Container.useContainer();
  const rightList: React.ReactNode[] = [];
  const leftList: React.ReactNode[] = [];
  const list: React.ReactNode[] = [];

  localColumns.forEach(({ title, key, dataIndex, fixed }) => {
    const columnKey = `${key || ''}-${dataIndex || ''}`;
    const config = columnsMap[columnKey || 'null'] || { show: true };

    const dom = (
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
          <ToolTipIcon
            columnKey={columnKey}
            fixed="left"
            title="固定到左边"
            show={fixed !== 'left'}
          >
            <Icon
              type="pushpin"
              style={{
                transform: 'rotate(-90deg)',
              }}
            />
          </ToolTipIcon>
          <ToolTipIcon columnKey={columnKey} fixed={undefined} title="取消固定" show={!!fixed}>
            <Icon type="vertical-align-middle" />
          </ToolTipIcon>
          <ToolTipIcon
            columnKey={columnKey}
            fixed="right"
            title="固定到右边"
            show={fixed !== 'right'}
          >
            <Icon type="pushpin" />
          </ToolTipIcon>
        </span>
      </span>
    );
    if (fixed === 'left') {
      leftList.push(dom);
      return;
    }
    if (fixed === 'right') {
      rightList.push(dom);
      return;
    }
    list.push(dom);
  });

  const showLeft = leftList && leftList.length > 0;
  const showRight = rightList && rightList.length > 0;

  return (
    <div className={`${className}-list`}>
      {showLeft && <span className={`${className}-list-title`}>固定在左侧</span>}
      {leftList}
      {/* 如果没有任何固定，不需要显示title */}
      {list && list.length > 0 && (showLeft || showRight) && (
        <span className={`${className}-list-title`}>不固定</span>
      )}
      {list}
      {showRight && <span className={`${className}-list-title`}>固定在右侧</span>}
      {rightList}
    </div>
  );
};

const ColumnSetting = <T, U = {}>(props: ColumnSettingProps<T>) => {
  const counter = Container.useContainer();
  const localColumns: ProColumns<T>[] = props.columns || counter.columns || [];
  const { columnsMap, setColumnsMap } = counter;

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

  useEffect(() => {
    setAllSelectAction();
  }, [JSON.stringify(localColumns)]);

  useEffect(() => {
    // 将方法赋值
    if (counter.action) {
      counter.action.restColumnsConfig = () => {
        setColumnsMap({});
      };
    }
  }, []);

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
              ((document.fullscreenElement || document.body) as any) as HTMLElement
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
                  }}
                >
                  重置
                </a>
              </div>
            }
            trigger="click"
            placement="bottomRight"
            content={<CheckboxList className={className} localColumns={localColumns} />}
          >
            <Tooltip title="列设置">
              <Icon
                type="setting"
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
