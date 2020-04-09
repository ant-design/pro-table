import React from 'react';
import classnames from 'classnames';
import { DownOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Button } from 'antd';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider/context';
import './index.less';

export interface DropdownProps {
  className?: string;
  style?: React.CSSProperties;
  menus?: {
    name: React.ReactNode;
    key: string;
  }[];
  onSelect?: (key: string) => void;
}

/**
 * 默认的 index 列容器，提供一个好看的 index
 * @param param0
 */
const DropdownButton: React.FC<DropdownProps> = ({
  children,
  menus = [],
  onSelect,
  className,
  style,
}) => (
  <ConfigConsumer>
    {({ getPrefixCls }: ConfigConsumerProps) => {
      const tempClassName = getPrefixCls('pro-table-dropdown');
      const menu = (
        <Menu onClick={(params) => onSelect && onSelect(params.key)}>
          {menus.map((item) => (
            <Menu.Item key={item.key}>{item.name}</Menu.Item>
          ))}
        </Menu>
      );
      return (
        <Dropdown overlay={menu} className={classnames(tempClassName, className)}>
          <Button style={style}>
            {children} <DownOutlined />
          </Button>
        </Dropdown>
      );
    }}
  </ConfigConsumer>
);

const TableDropdown: React.FC<DropdownProps> & { Button: typeof DropdownButton } = ({
  className: propsClassName,
  style,
  onSelect,
  menus = [],
}) => (
  <ConfigConsumer>
    {({ getPrefixCls }: ConfigConsumerProps) => {
      const className = getPrefixCls('pro-table-dropdown');
      const menu = (
        <Menu onClick={(params) => onSelect && onSelect(params.key)}>
          {menus.map((item) => (
            <Menu.Item key={item.key}>{item.name}</Menu.Item>
          ))}
        </Menu>
      );
      return (
        <Dropdown overlay={menu} className={classnames(className, propsClassName)}>
          <a style={style}>
            <EllipsisOutlined />
          </a>
        </Dropdown>
      );
    }}
  </ConfigConsumer>
);

TableDropdown.Button = DropdownButton;

export default TableDropdown;
