import React, { useEffect } from 'react';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider/context';
import { Checkbox, Popover, Icon, Tooltip } from 'antd';
import Container from '../../container';
import { ProColumns } from '../../Table';
import './index.less';

interface ColumnSettingProps<T = any> {
  columns?: ProColumns<T>[];
}

const ColumnSetting = <T, U = {}>(props: ColumnSettingProps<T>) => {
  const counter = Container.useContainer();
  const localColumns: ProColumns<T>[] = props.columns || counter.columns || [];

  const { columnsMap, setColumnsMap } = counter;

  const selectAll = () => {
    const columnKeyMap = {};
    localColumns.forEach(({ key, dataIndex }) => {
      const columnKey = `${key || ''}-${dataIndex || ''}`;
      if (columnKey) {
        columnKeyMap[columnKey] = true;
      }
    });
    setColumnsMap(columnKeyMap);
  };

  useEffect(() => {
    selectAll();
  }, [localColumns.toString()]);

  const selectKeys = Object.values(columnsMap).filter(value => value);
  const indeterminate = selectKeys.length > 0 && selectKeys.length !== localColumns.length;

  return (
    <ConfigConsumer>
      {({ getPrefixCls }: ConfigConsumerProps) => {
        const className = getPrefixCls('pro-table-column-setting');
        const toolBarClassName = getPrefixCls('pro-table-toolbar');
        const list = localColumns.map(({ title, key, dataIndex }) => {
          const columnKey = `${key || ''}-${dataIndex || ''}`;
          return (
            <Checkbox
              onChange={e => {
                if (columnKey) {
                  const columnKeyMap = { ...columnsMap };
                  columnKeyMap[columnKey || ''] = e.target.checked;
                  setColumnsMap(columnKeyMap);
                }
              }}
              key={columnKey}
              checked={columnsMap[columnKey || 'null']}
            >
              {title}
            </Checkbox>
          );
        });
        return (
          <Popover
            title={
              <Checkbox
                indeterminate={indeterminate}
                checked={selectKeys.length === localColumns.length}
                onChange={e => {
                  if (e.target.checked) {
                    selectAll();
                  } else {
                    setColumnsMap({});
                  }
                }}
              >
                列展示
              </Checkbox>
            }
            trigger="click"
            placement="bottomRight"
            content={<div className={`${className}-list`}>{list}</div>}
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
