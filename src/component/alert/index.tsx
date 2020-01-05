import React from 'react';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider/context';
import { Alert } from 'antd';
import './index.less';
import { useIntl } from '../intlContext';

interface TableAlertProps<T> {
  selectedRowKeys: (number | string)[];
  selectedRows: T[];
  alertIInfoRender?:
    | ((selectedRowKeys: (number | string)[], selectedRows: T[]) => React.ReactNode)
    | false;
  onCleanSelected: () => void;
}

const TableAlert = <T, U = {}>({
  selectedRowKeys = [],
  onCleanSelected,
  selectedRows = [],
  alertIInfoRender = () => (
    <span>
      已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
    </span>
  ),
}: TableAlertProps<T>) => {
  const intl = useIntl();
  return (
    <ConfigConsumer>
      {({ getPrefixCls }: ConfigConsumerProps) => {
        const className = getPrefixCls('pro-table-alert');
        if (alertIInfoRender === false) {
          return null;
        }
        const dom = alertIInfoRender(selectedRowKeys, selectedRows);
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
                    <a onClick={onCleanSelected}>{intl.getMessage('alert.clear', '清空')}</a>
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
};

export default TableAlert;
