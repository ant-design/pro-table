import React, { ReactNode } from 'react';
import TableStaus, { StatusType } from './status';

/**
 * 转化 text 和 valueEnum
 * 通过 type 来添加 Status
 * @param text
 * @param valueEnum
 * @param prue 纯净模式，不增加 status
 */
export const parsingText = (
  text: string | number,
  valueEnum?: {
    [key: string]:
      | {
          text: ReactNode;
          type: StatusType;
        }
      | ReactNode;
  },
  pure?: boolean,
) => {
  if (!valueEnum) {
    return text;
  }
  const domText = valueEnum[text] as {
    text: ReactNode;
    status: StatusType;
  };
  if (!domText) {
    return text;
  }

  if (domText.status) {
    if (pure) {
      return domText.text;
    }
    const { status } = domText;
    const Status = TableStaus[status || 'Init'];
    return <Status>{domText.text}</Status>;
  }
  return domText.text || domText;
};

/**
 * 把 value 的枚举转化为 数组
 * @param valueEnum
 */
export const parsingValueEnumToArray = (
  valueEnum: {
    [key: string]:
      | {
          text: ReactNode;
          type: StatusType;
        }
      | ReactNode;
  } = {},
): {
  value: string;
  text: string;
}[] =>
  Object.keys(valueEnum).map(key => {
    const value =
      (valueEnum[key] as {
        text: string;
      }) || '';

    return {
      text: ((value.text || value || '') as unknown) as string,
      value: key,
    };
  });
