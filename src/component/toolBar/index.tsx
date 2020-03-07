import React from 'react';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Divider, Tooltip } from 'antd';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider/context';
import ColumnSetting from '../columnSetting';
import { useIntl, IntlType } from '../intlContext';
import { UseFetchDataAction, RequestData } from '../../useFetchData';

import './index.less';
import FullScreenIcon from './FullscreenIcon';
import DensityIcon from './DensityIcon';

export interface OptionConfig<T> {
  density: boolean;
  fullScreen: OptionsType<T>;
  reload: OptionsType<T>;
  setting: boolean;
}

export type OptionsType<T = unknown> =
  | ((e: React.MouseEvent<HTMLSpanElement>, action: UseFetchDataAction<RequestData<T>>) => void)
  | boolean;

export interface ToolBarProps<T = unknown> {
  headerTitle?: React.ReactNode;
  toolBarRender?: (
    action: UseFetchDataAction<RequestData<T>>,
    rows: {
      selectedRowKeys?: (string | number)[];
      selectedRows?: T[];
    },
  ) => React.ReactNode[];
  action: UseFetchDataAction<RequestData<T>>;
  options?: OptionConfig<T> | false;
  selectedRowKeys?: (string | number)[];
  selectedRows?: T[];
  className?: string;
}

const getButtonText = <T, U = {}>({
  intl,
}: OptionConfig<T> & {
  intl: IntlType;
}) => ({
  fullScreen: {
    text: intl.getMessage('tableToolBar.fullScreen', '全屏'),
    icon: <FullScreenIcon />,
  },
  reload: {
    text: intl.getMessage('tableToolBar.reload', '刷新'),
    icon: <ReloadOutlined />,
  },
  setting: {
    text: intl.getMessage('tableToolBar.columnSetting', '列设置'),
    icon: <SettingOutlined />,
  },
  density: {
    text: intl.getMessage('tableToolBar.density', '表格密度'),
    icon: <DensityIcon />,
  },
});

/**
 * 渲染默认的 工具栏
 * @param options
 * @param className
 */
const renderDefaultOption = <T, U = {}>(
  options: ToolBarProps<T>['options'],
  className: string,
  defaultOptions: OptionConfig<T> & {
    intl: IntlType;
  },
) =>
  options &&
  Object.keys(options)
    .filter(item => item)
    .map((key, index) => {
      const value = options[key];
      if (!value) {
        return null;
      }
      if (key === 'setting') {
        return <ColumnSetting key={key} />;
      }
      if (key === 'fullScreen') {
        return (
          <span
            key={key}
            style={{
              marginLeft: index === 0 ? 8 : 16,
            }}
            className={className}
            onClick={value === true ? defaultOptions[key] : value}
          >
            <FullScreenIcon />
          </span>
        );
      }
      const optionItem = getButtonText<T>(defaultOptions)[key];
      if (optionItem) {
        return (
          <span
            key={key}
            style={{
              marginLeft: index === 0 ? 8 : 16,
            }}
            className={className}
            onClick={() => {
              if (value && defaultOptions[key] !== true) {
                if (value !== true) {
                  value();
                  return;
                }
                defaultOptions[key]();
              }
            }}
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
  toolBarRender,
  action,
  options = {
    density: true,
    fullScreen: () => action.fullScreen && action.fullScreen(),
    reload: () => action.reload(),
    setting: true,
  },
  selectedRowKeys,
  selectedRows,
  className,
}: ToolBarProps<T>) => {
  const intl = useIntl();
  const optionDom =
    renderDefaultOption<T>(options, `${className}-item-icon`, {
      fullScreen: () => action.fullScreen && action.fullScreen(),
      reload: () => action.reload(),
      density: true,
      setting: true,
      intl,
    }) || [];
  // 操作列表
  const actions = toolBarRender ? toolBarRender(action, { selectedRowKeys, selectedRows }) : [];

  return (
    <div className={className}>
      <div className={`${className}-title`}>{headerTitle}</div>
      <div className={`${className}-option`}>
        {actions
          .filter(item => item)
          .map((node, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={`${className}-item`}
            >
              {node}
            </div>
          ))}
        <div className={`${className}-default-option`}>
          {optionDom.length > 0 && actions.length > 0 && <Divider type="vertical" />}
          {optionDom}
        </div>
      </div>
    </div>
  );
};

const WarpToolBar = <T, U = {}>(props: ToolBarProps<T>) => (
  <ConfigConsumer>
    {({ getPrefixCls }: ConfigConsumerProps) => {
      const className = getPrefixCls('pro-table-toolbar');
      return <ToolBar className={className} {...props} />;
    }}
  </ConfigConsumer>
);

export default WarpToolBar;
