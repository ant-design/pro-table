import React from 'react';
import { Progress } from 'antd';
import moment from 'moment';
import IndexColumn from './component/indexColumn';
import { getProgressStatus } from './component/util';

/**
 * money 金额
 * option 操作 需要返回一个数组
 * date 日期 YYYY-MM-DD
 * dateRange 日期范围 YYYY-MM-DD[]
 * dateTime 日期和时间 YYYY-MM-DD HH:mm:ss
 * dateTimeRange 范围日期和时间 YYYY-MM-DD HH:mm:ss[]
 * time: 时间 HH:mm:ss
 * index：序列
 * progress: 进度条
 */
export type ProColumnsValueType =
  | 'money'
  | 'textarea'
  | 'option'
  | 'date'
  | 'dateRange'
  | 'dateTimeRange'
  | 'dateTime'
  | 'time'
  | 'text'
  | 'index'
  | 'indexBorder'
  | 'progress'
  | 'digit';

// function return type
export type ProColumnsValueObjectType = {
  type: 'progress' | 'money';
  status?: 'normal' | 'active' | 'success' | 'exception' | undefined;
  locale?: string;
};

/**
 * value type by function
 */
export type ProColumnsValueTypeFunction<T> = (
  item: T,
) => ProColumnsValueType | ProColumnsValueObjectType;

const moneyIntl = new Intl.NumberFormat('zh-Hans-CN', {
  currency: 'CNY',
  style: 'currency',
  minimumFractionDigits: 2,
});

const enMoneyIntl = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

/**
 * render valueType object
 * @param text string | number
 * @param value ProColumnsValueObjectType
 */
const defaultRenderTextByObject = (text: string | number, value: ProColumnsValueObjectType) => {
  if (value.type === 'progress') {
    return (
      <Progress
        size="small"
        percent={text as number}
        status={value.status || getProgressStatus(text as number)}
      />
    );
  }
  if (value.type === 'money') {
    // english
    if (value.locale === 'en_US') {
      return enMoneyIntl.format(text as number);
    }
    return moneyIntl.format(text as number);
  }
  return text;
};

/**
 * 根据不同的类型来转化数值
 * @param text
 * @param valueType
 */
const defaultRenderText = <T, U>(
  text: string | number | React.ReactText[],
  valueType: ProColumnsValueType | ProColumnsValueTypeFunction<T>,
  index: number,
  item?: T,
): React.ReactNode => {
  // when valueType == function
  // item always not null
  if (typeof valueType === 'function' && item) {
    const value = valueType(item);
    if (typeof value === 'string') {
      return defaultRenderText(text, valueType, index);
    }
    if (typeof value === 'object') {
      return defaultRenderTextByObject(text as string, value);
    }
  }

  /**
   * 如果是金额的值
   */
  if (valueType === 'money' && (text || text === 0)) {
    /**
     * 这个 api 支持三星和华为的手机
     */
    if (typeof text === 'string') {
      return moneyIntl.format(parseFloat(text));
    }
    return moneyIntl.format(text as number);
  }

  /**
   *如果是日期的值
   */
  if (valueType === 'date' && text) {
    return moment(text).format('YYYY-MM-DD');
  }

  /**
   *如果是日期范围的值
   */
  if (valueType === 'dateRange' && text && Array.isArray(text) && text.length === 2) {
    return (
      <div>
        <div>{moment(text[0]).format('YYYY-MM-DD')}</div>
        <div>{moment(text[1]).format('YYYY-MM-DD')}</div>
      </div>
    );
  }

  /**
   *如果是日期加时间类型的值
   */
  if (valueType === 'dateTime' && text) {
    return moment(text).format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   *如果是日期加时间类型的值的值
   */
  if (valueType === 'dateTimeRange' && text && Array.isArray(text) && text.length === 2) {
    return (
      <div>
        <div>{moment(text[0]).format('YYYY-MM-DD HH:mm:ss')}</div>
        <div>{moment(text[1]).format('YYYY-MM-DD HH:mm:ss')}</div>
      </div>
    );
  }

  /**
   *如果是时间类型的值
   */
  if (valueType === 'time' && text) {
    return moment(text).format('HH:mm:ss');
  }

  if (valueType === 'index') {
    return <IndexColumn>{index + 1}</IndexColumn>;
  }

  if (valueType === 'indexBorder') {
    return <IndexColumn border>{index + 1}</IndexColumn>;
  }

  if (valueType === 'progress') {
    return (
      <Progress size="small" percent={text as number} status={getProgressStatus(text as number)} />
    );
  }

  return text;
};

export default defaultRenderText;
