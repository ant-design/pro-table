import React, { useState, useEffect } from 'react';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider/context';
import { Checkbox, Popover, Icon } from 'antd';
import Container from '../../container';
import { ProColumns } from '../../Table';
import './index.less';

interface ColumnSettingProps<T = any> {
  columns?: ProColumns<T>[];
}

const ColumnSetting = <T, U = {}>(props: ColumnSettingProps<T>) => {
  const counter = Container.useContainer();
  const localColumns: ProColumns<T>[] = props.columns || counter.columns || [];

  const [columnsObject, setColumnsObject] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const columnKeyMap = {};
    localColumns.forEach(({ key, dataIndex }) => {
      const columnKey = `${key || ''}-${dataIndex || ''}`;
      if (columnKey) {
        columnKeyMap[columnKey] = true;
      }
    });
    setColumnsObject(columnKeyMap);
  }, [localColumns.toString()]);
  const selectKeys = Object.values(columnsObject).filter(value => value);
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
                  const columnKeyMap = { ...columnsObject };
                  columnKeyMap[columnKey || ''] = e.target.checked;
                  setColumnsObject(columnKeyMap);
                }
              }}
              key={columnKey}
              checked={columnsObject[columnKey || 'null']}
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
              >
                列展示
              </Checkbox>
            }
            placement="bottomRight"
            content={<div className={`${className}-list`}>{list}</div>}
          >
            <Icon
              type="setting"
              className={`${toolBarClassName}-item-icon`}
              style={{
                fontSize: 16,
              }}
            />
          </Popover>
        );
      }}
    </ConfigConsumer>
  );
};

export default ColumnSetting;
