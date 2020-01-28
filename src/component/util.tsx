import React, { ReactNode, useEffect, useRef, ReactText } from 'react';
import isEqual from 'lodash.isequal';
import { DataIndex } from 'rc-table/lib/interface';
import TableStatus, { StatusType } from './status';

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
    const Status = TableStatus[status || 'Init'];
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

/**
 * 检查值是否存在
 * 为了 避开 0 和 false
 * @param value
 */
export const checkUndefinedOrNull = (value: any) => value !== undefined && value !== null;

function deepCompareEquals(a: any, b: any) {
  return isEqual(a, b);
}

function useDeepCompareMemoize(value: any) {
  const ref = useRef();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier
  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffect(effect: React.EffectCallback, dependencies?: Object) {
  useEffect(effect, useDeepCompareMemoize(dependencies));
}

export function getProgressStatus(text: number): 'success' | 'exception' | 'normal' | 'active' {
  if (typeof text !== 'number') {
    return 'exception';
  }
  if (text === 100) {
    return 'success';
  }
  if (text < 100) {
    return 'active';
  }

  // magic
  if (text < 0) {
    return 'exception';
  }
  return 'normal';
}

/**
 *  根据 key 和 dataIndex 生成唯一 id
 * @param key
 * @param dataIndex
 */
export const genColumnKey = (key?: React.ReactText | undefined, dataIndex?: DataIndex) => {
  if (key) {
    return key;
  }
  if (!key && dataIndex) {
    if (Array.isArray(dataIndex)) {
      return dataIndex.join('-');
    }
    return dataIndex;
  }
  return undefined;
};

export default function get(entity: any, path: ReactText | ReactText[]) {
  let tempPath: ReactText[] = [''];
  if (typeof path === 'string') {
    if (path.includes('.')) {
      tempPath = path.split('.');
    } else {
      tempPath = [path];
    }
  }
  if (Array.isArray(path)) {
    tempPath = path;
  }
  let current = entity;

  for (let i = 0; i < tempPath.length; i += 1) {
    if (current === null || current === undefined) {
      return undefined;
    }

    current = current[tempPath[i]];
  }

  return current;
}
