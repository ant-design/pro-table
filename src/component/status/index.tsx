import React, { CSSProperties } from 'react';
import { Badge } from 'antd';
import './index.less';

interface StatusProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * 快捷操作，用于快速的展示一个状态
 */
const Status: {
  success: React.FC<StatusProps>;
  error: React.FC<StatusProps>;
  processing: React.FC<StatusProps>;
  default: React.FC<StatusProps>;
  warning: React.FC<StatusProps>;
} = {
  success: ({ children }) => <Badge status="success" text={children} />,
  error: ({ children }) => <Badge status="error" text={children} />,
  default: ({ children }) => <Badge status="default" text={children} />,
  processing: ({ children }) => <Badge status="processing" text={children} />,
  warning: ({ children }) => <Badge status="warning" text={children} />,
};

export type StatusType = keyof typeof Status;

export default Status;
export const Color: React.FC<StatusProps & { color: string }> = ({ color, children }) => (
  <Badge color={color} text={children} />
);
