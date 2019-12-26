import React, { ReactNode, useEffect, useRef, useState } from 'react';
import isEqual from 'lodash.isequal';
import { useMediaQuery } from 'react-responsive';
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

const MediaQueryEnum = {
  xs: {
    maxWidth: 575,
    matchMedia: '(max-width: 575px)',
  },
  sm: {
    minWidth: 576,
    maxWidth: 767,
    matchMedia: '(min-width: 576px) and (max-width: 767px)',
  },
  md: {
    minWidth: 768,
    maxWidth: 991,
    matchMedia: '(min-width: 768px) and (max-width: 991px)',
  },
  lg: {
    minWidth: 992,
    maxWidth: 1199,
    matchMedia: '(min-width: 992px) and (max-width: 1199px)',
  },
  xl: {
    minWidth: 1200,
    maxWidth: 1599,
    matchMedia: '(min-width: 1200px) and (max-width: 1599px)',
  },
  xxl: {
    minWidth: 1600,
    matchMedia: '(min-width: 1600px)',
  },
};

type MediaQueryKey = keyof typeof MediaQueryEnum;

/**
 * loop query screen className
 * Array.find will throw a error
 * `Rendered more hooks than during the previous render.`
 * So should use Array.forEach
 */
const getScreenClassName = () => {
  let className: MediaQueryKey = 'md';

  const mediaQueryKey = Object.keys(MediaQueryEnum).find(key => {
    const { matchMedia } = MediaQueryEnum[key];
    if (window.matchMedia(matchMedia).matches) {
      return true;
    }
    return false;
  });
  className = (mediaQueryKey as unknown) as MediaQueryKey;
  return className;
};

export const useMedia = () => {
  const isMd = useMediaQuery(MediaQueryEnum.md);
  const isLg = useMediaQuery(MediaQueryEnum.lg);
  const isXxl = useMediaQuery(MediaQueryEnum.xxl);
  const isXl = useMediaQuery(MediaQueryEnum.xl);
  const isSm = useMediaQuery(MediaQueryEnum.sm);
  const isXs = useMediaQuery(MediaQueryEnum.xs);
  const [colSpan, setColSpan] = useState<keyof typeof MediaQueryEnum>(getScreenClassName());

  useEffect(() => {
    if (isXxl) {
      setColSpan('xxl');
      return;
    }
    if (isXl) {
      setColSpan('xl');
      return;
    }
    if (isLg) {
      setColSpan('lg');
      return;
    }
    if (isMd) {
      setColSpan('md');
      return;
    }
    if (isSm) {
      setColSpan('sm');
      return;
    }
    if (isXs) {
      setColSpan('xs');
      return;
    }
    setColSpan('md');
  }, [isMd, isLg, isXxl, isXl, isSm, isXs]);

  return colSpan;
};
