import React from 'react';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider/context';
import { UseFetchDataAction, RequestData } from '../../useFetchData';
import { Icon, Divider } from 'antd';
import './index.less';

export type OptionsType<T> =
  | ((e: React.MouseEvent<HTMLSpanElement>, action: UseFetchDataAction<RequestData<T>>) => void)
  | boolean;

export interface ToolBarProps<T> {
  headerTitle?: React.ReactNode;
  renderToolBar?: (action: UseFetchDataAction<RequestData<T>>) => React.ReactNode[];
  action: UseFetchDataAction<RequestData<T>>;
  options?: {
    fullscreen: OptionsType<T>;
    reload: OptionsType<T>;
    setting: OptionsType<T>;
  };
}

const renderDefaultOption = <T, U = {}>(options: ToolBarProps<T>['options'], className: string) =>
  options &&
  Object.keys(options).map(key => {
    const value = options[key];
    if (!value) {
      return null;
    }
    return <Icon key={key} type={key} className={className} onClick={value} />;
  });

const ToolBar = <T, U = {}>({
  headerTitle,
  renderToolBar,
  action,
  options = {
    fullscreen: () => action.fullscreen && action.fullscreen(),
    reload: () => action.reload(),
    setting: () => null,
  },
}: ToolBarProps<T>) => (
  <ConfigConsumer>
    {({ getPrefixCls }: ConfigConsumerProps) => {
      const tempClassName = getPrefixCls('pro-table-toolbar');
      return (
        <div className={tempClassName}>
          {headerTitle && <div className={`${tempClassName}-title`}>{headerTitle}</div>}
          <div className={`${tempClassName}-option`}>
            {renderToolBar &&
              renderToolBar(action).map((node, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className={`${tempClassName}-item`}>
                  {node}
                </div>
              ))}
            <Divider type="vertical" />
            {renderDefaultOption<T>(options, `${tempClassName}-item-icon`)}
          </div>
        </div>
      );
    }}
  </ConfigConsumer>
);

export default ToolBar;
