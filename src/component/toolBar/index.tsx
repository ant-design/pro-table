import React from 'react';
import { Icon, Divider, Tooltip } from 'antd';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider/context';
import ColumnSetting from '../columnSetting';

import { UseFetchDataAction, RequestData } from '../../useFetchData';

import './index.less';

export type OptionsType<T = unknown> =
  | ((e: React.MouseEvent<HTMLSpanElement>, action: UseFetchDataAction<RequestData<T>>) => void)
  | boolean;

export interface ToolBarProps<T = unknown> {
  headerTitle?: React.ReactNode;
  renderToolBar?: (action: UseFetchDataAction<RequestData<T>>) => React.ReactNode[];
  action: UseFetchDataAction<RequestData<T>>;
  options?: {
    fullScreen: OptionsType<T>;
    reload: OptionsType<T>;
    setting: boolean;
  };
}

const buttonText = {
  fullScreen: {
    text: '全屏',
    icon: <Icon type="fullscreen" />,
  },
  reload: {
    text: '刷新',
    icon: <Icon type="reload" />,
  },
  setting: {
    text: '列设置',
    icon: <Icon type="setting" />,
  },
};

/**
 * 渲染默认的 工具栏
 * @param options
 * @param className
 */
const renderDefaultOption = <T, U = {}>(
  options: ToolBarProps<T>['options'],
  className: string,
  defaultOptions: {
    fullScreen: OptionsType<T>;
    reload: OptionsType<T>;
    setting: OptionsType<T>;
  },
) =>
  options &&
  Object.keys(options)
    .map((key, index) => {
      const value = options[key];
      if (!value) {
        return null;
      }
      if (key === 'setting') {
        return <ColumnSetting key={key} />;
      }
      const optionItem = buttonText[key];
      if (optionItem) {
        return (
          <span
            key={key}
            style={{
              marginLeft: index === 0 ? 8 : 16,
            }}
            className={className}
            onClick={value === true ? defaultOptions[key] : value}
          >
            <Tooltip title={optionItem.text}>{optionItem.icon}</Tooltip>
          </span>
        );
      }
      return null;
    })
    .filter(item => item);

const ToolBar = <T, U = {}>({
  headerTitle,
  renderToolBar,
  action,
  options = {
    fullScreen: () => action.fullScreen && action.fullScreen(),
    reload: () => action.reload(),
    setting: true,
  },
}: ToolBarProps<T>) => (
  <ConfigConsumer>
    {({ getPrefixCls }: ConfigConsumerProps) => {
      const tempClassName = getPrefixCls('pro-table-toolbar');
      const optionDom =
        renderDefaultOption<T>(options, `${tempClassName}-item-icon`, {
          fullScreen: () => action.fullScreen && action.fullScreen(),
          reload: () => action.reload(),
          setting: true,
        }) || [];
      return (
        <div className={tempClassName}>
          {headerTitle && <div className={`${tempClassName}-title`}>{headerTitle}</div>}
          <div className={`${tempClassName}-option`}>
            {renderToolBar &&
              renderToolBar(action).map((node, index) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  className={`${tempClassName}-item`}
                >
                  {node}
                </div>
              ))}
            {optionDom.length > 0 && <Divider type="vertical" />}
            {optionDom}
          </div>
        </div>
      );
    }}
  </ConfigConsumer>
);

export default ToolBar;
