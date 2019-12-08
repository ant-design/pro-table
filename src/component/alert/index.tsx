import React from 'react';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider/context';
import { Alert } from 'antd';
import './index.less';

interface TableAlertProps<T> {
  selectedRowKeys: (number | string)[];
  selectedRows: T[];
  renderInfo?:
    | ((selectedRowKeys: (number | string)[], selectedRows: T[]) => React.ReactNode)
    | false;
  onCleanSelected: () => void;
}

const TableAlert = <T, U = {}>({
  selectedRowKeys = [],
  onCleanSelected,
  selectedRows = [],
  renderInfo = () => (
    <span>
      已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
    </span>
  ),
}: TableAlertProps<T>) => (
  <ConfigConsumer>
    {({ getPrefixCls }: ConfigConsumerProps) => {
      const className = getPrefixCls('pro-table-alert');
      if (renderInfo === false) {
        return null;
      }
      const dom = renderInfo(selectedRowKeys, selectedRows);
      if (dom === false) {
        return null;
      }
      return (
        <div className={className}>
          <Alert
            message={
              <div className={`${className}-info`}>
                <div className={`${className}-info-content`}>{dom}</div>
                <div className={`${className}-info-option`}>
                  <a onClick={onCleanSelected}>清空</a>
                </div>
              </div>
            }
            type="info"
            showIcon
          />
        </div>
      );
    }}
  </ConfigConsumer>
);

export default TableAlert;
