import React, { useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { FormComponentProps, FormItemProps, FormProps } from '@ant-design/compatible/es/form';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Row, Col, TimePicker, InputNumber, DatePicker, Select, Button } from 'antd';
import moment, { Moment } from 'moment';
import RcResizeObserver from 'rc-resize-observer';
import useMediaQuery from 'use-media-antd-query';
import useMergeValue from 'use-merge-value';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider';
import classNames from 'classnames';

import { parsingValueEnumToArray, useDeepCompareEffect, genColumnKey } from '../component/util';
import { ProColumnsValueTypeFunction } from '../defaultRender';
import { useIntl, IntlType } from '../component/intlContext';
import Container from '../container';
import { ProColumns, ProColumnsValueType } from '../index';
import './index.less';

const defaultColConfig = {
  lg: 8,
  md: 12,
  xxl: 6,
  xl: 8,
  sm: 12,
  xs: 24,
};
const defaultFromColConfig = {
  lg: 24,
  md: 24,
  xxl: 24,
  xl: 24,
  sm: 24,
  xs: 24,
};

export interface SearchConfig {
  searchText?: string;
  resetText?: string;
  span?: number | typeof defaultColConfig;
  collapseRender?: (collapsed: boolean) => React.ReactNode;
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  submitText?: string;
}

const getOffset = (length: number, span: number = 8) => {
  const cols = 24 / span;
  return (cols - 1 - (length % cols)) * span;
};

const defaultSearch: SearchConfig = {
  searchText: '查询',
  resetText: '重置',
  span: defaultColConfig,
  collapseRender: (collapsed: boolean) => (collapsed ? '展开' : '收起'),
};

export interface TableFormItem<T> extends Omit<FormItemProps, 'children'> {
  onSubmit?: (value: T) => void;
  onReset?: () => void;
  formConfig?: Omit<FormProps, 'form'>;
  type?: 'form' | 'list' | 'table' | 'cardList' | undefined;
  dateFormatter?: 'string' | 'number' | false;
  search?: boolean | SearchConfig;
  form: FormComponentProps['form'];
  formRef?:
    | React.MutableRefObject<FormComponentProps['form'] | undefined>
    | ((actionRef: FormComponentProps['form']) => void);
}

const FromInputRender: React.FC<{
  item: ProColumns<any>;
  value?: any;
  type: 'form' | 'list' | 'table' | 'cardList' | undefined;
  onChange?: (value: any) => void;
}> = React.forwardRef(({ item, ...rest }, ref: any) => {
  const { valueType } = item;
  const intl = useIntl();
  /**
   * 自定义 render
   */
  if (item.renderFormItem) {
    return item.renderFormItem(item, rest) as any;
  }
  if (!valueType || valueType === 'text') {
    const { valueEnum } = item;
    if (valueEnum) {
      return (
        <Select
          placeholder={intl.getMessage('tableFrom.selectPlaceholder', '请选择')}
          ref={ref}
          {...rest}
          {...item.formItemProps}
        >
          {parsingValueEnumToArray(valueEnum).map(({ value, text }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </Select>
      );
    }
    return (
      <Input
        placeholder={intl.getMessage('tableFrom.inputPlaceholder', '请输入')}
        {...rest}
        {...item.formItemProps}
      />
    );
  }
  if (valueType === 'date') {
    return (
      <DatePicker
        ref={ref}
        placeholder={intl.getMessage('tableFrom.selectPlaceholder', '请选择')}
        style={{
          width: '100%',
        }}
        {...rest}
        {...item.formItemProps}
      />
    );
  }

  if (valueType === 'dateTime') {
    return (
      <DatePicker
        showTime
        ref={ref}
        placeholder={intl.getMessage('tableFrom.selectPlaceholder', '请选择')}
        style={{
          width: '100%',
        }}
        {...rest}
        {...item.formItemProps}
      />
    );
  }

  if (valueType === 'dateRange') {
    return (
      <DatePicker.RangePicker
        ref={ref}
        placeholder={[
          intl.getMessage('tableFrom.selectPlaceholder', '请选择'),
          intl.getMessage('tableFrom.selectPlaceholder', '请选择'),
        ]}
        style={{
          width: '100%',
        }}
        {...rest}
        {...item.formItemProps}
      />
    );
  }
  if (valueType === 'dateTimeRange') {
    return (
      <DatePicker.RangePicker
        ref={ref}
        showTime
        placeholder={[
          intl.getMessage('tableFrom.selectPlaceholder', '请选择'),
          intl.getMessage('tableFrom.selectPlaceholder', '请选择'),
        ]}
        style={{
          width: '100%',
        }}
        {...rest}
        {...item.formItemProps}
      />
    );
  }

  if (valueType === 'time') {
    return (
      <TimePicker
        ref={ref}
        placeholder={intl.getMessage('tableFrom.selectPlaceholder', '请选择')}
        style={{
          width: '100%',
        }}
        {...rest}
        {...item.formItemProps}
      />
    );
  }
  if (valueType === 'digit') {
    return (
      <InputNumber
        ref={ref}
        placeholder={intl.getMessage('tableFrom.inputPlaceholder', '请输入')}
        style={{
          width: '100%',
        }}
        {...rest}
        {...item.formItemProps}
      />
    );
  }
  if (valueType === 'money') {
    return (
      <InputNumber
        ref={ref}
        min={0}
        precision={2}
        formatter={value => {
          if (value) {
            return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
          return '';
        }}
        parser={value => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
        placeholder={intl.getMessage('tableFrom.inputPlaceholder', '请输入')}
        style={{
          width: '100%',
        }}
        {...rest}
        {...item.formItemProps}
      />
    );
  }
  if (valueType === 'textarea' && rest.type === 'form') {
    return (
      <Input.TextArea
        placeholder={intl.getMessage('tableFrom.inputPlaceholder', '请输入')}
        ref={ref}
        {...rest}
        {...item.formItemProps}
      />
    );
  }
  return (
    <Input
      placeholder={intl.getMessage('tableFrom.inputPlaceholder', '请输入')}
      ref={ref}
      {...rest}
      {...item.formItemProps}
    />
  );
});

const dateFormatterMap = {
  time: 'HH:mm:ss',
  date: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DD HH:mm:ss',
};

/**
 * 判断 DataType 是不是日期类型
 * @param type
 */
const isDateValueType = (type: ProColumnsValueType | ProColumnsValueTypeFunction<any>) => {
  let valueType: ProColumnsValueType = type as ProColumnsValueType;
  if (typeof type === 'function') {
    // 如果是 object 说明是进度条，直接返回 false
    if (typeof type({}) === 'object') {
      return false;
    }
    valueType = type({}) as ProColumnsValueType;
  }
  const dateTypes = ['date', 'dateRange', 'dateTimeRange', 'dateTime', 'time'];
  return dateTypes.includes(valueType);
};

/**
 * 这里主要是来转化一下数据
 * 将 moment 转化为 string
 * 将 all 默认删除
 * @param value
 * @param dateFormatter
 * @param proColumnsMap
 */
const conversionValue = (
  value: any,
  dateFormatter: string | boolean,
  proColumnsMap: { [key: string]: ProColumns<any> },
) => {
  const tmpValue = {};

  Object.keys(value).forEach(key => {
    const column = proColumnsMap[key || 'null'] || {};
    const valueType = column.valueType || 'text';
    const itemValue = value[key];

    // 如果值是 "all"，或者不存在直接删除
    // 下拉框里选 all，会删除
    if (!itemValue || (itemValue === 'all' && column.valueEnum)) {
      return;
    }

    // 如果是日期，再处理这些
    if (!isDateValueType(valueType)) {
      tmpValue[key] = itemValue;
      return;
    }

    // 如果是 moment 的对象的处理方式
    // 如果执行到这里，肯定是 ['date', 'dateRange', 'dateTimeRange', 'dateTime', 'time'] 之一
    if (moment.isMoment(itemValue) && dateFormatter) {
      if (dateFormatter === 'string') {
        const formatString = dateFormatterMap[valueType as 'dateTime'];
        tmpValue[key] = (itemValue as Moment).format(formatString || 'YYYY-MM-DD HH:mm:ss');
        return;
      }
      if (dateFormatter === 'number') {
        tmpValue[key] = (itemValue as Moment).valueOf();
        return;
      }
    }

    // 这里是日期数组
    if (Array.isArray(itemValue) && itemValue.length === 2 && dateFormatter) {
      if (dateFormatter === 'string') {
        const formatString = dateFormatterMap[valueType as 'dateTime'];
        tmpValue[key] = [
          moment(itemValue[0] as Moment).format(formatString || 'YYYY-MM-DD HH:mm:ss'),
          moment(itemValue[1] as Moment).format(formatString || 'YYYY-MM-DD HH:mm:ss'),
        ];
        return;
      }
      if (dateFormatter === 'number') {
        tmpValue[key] = [
          moment(itemValue[0] as Moment).valueOf(),
          moment(itemValue[1] as Moment).valueOf(),
        ];
      }
    }
  });
  return tmpValue;
};

const getDefaultSearch = (
  search: boolean | SearchConfig | undefined,
  intl: IntlType,
  isFrom: boolean,
): SearchConfig => {
  const config = {
    collapseRender: (collapsed: boolean) => {
      if (collapsed) {
        return intl.getMessage('tableFrom.collapsed', '展开');
      }
      return intl.getMessage('tableFrom.expand', '收起');
    },
    searchText: intl.getMessage('tableFrom.search', defaultSearch.searchText || '查询'),
    resetText: intl.getMessage('tableFrom.reset', defaultSearch.resetText || '重置'),
    submitText: intl.getMessage('tableFrom.submit', defaultSearch.resetText || '提交'),
    span: isFrom ? defaultFromColConfig : defaultColConfig,
  };

  if (search === undefined || search === true) {
    return config;
  }

  return { ...config, ...search } as Required<SearchConfig>;
};

const getSpanConfig = (
  span: number | typeof defaultColConfig,
  size: keyof typeof defaultColConfig,
): number => {
  if (typeof span === 'number') {
    return span;
  }
  const config = {
    ...defaultColConfig,
    ...span,
  };
  return config[size];
};

const FormSearch = <T, U = {}>({
  onSubmit,
  formRef,
  dateFormatter = 'string',
  search: propsSearch,
  type,
  form,
  formConfig = {},
}: TableFormItem<T>) => {
  const intl = useIntl();
  const searchConfig = getDefaultSearch(propsSearch, intl, type === 'form');
  const { span, searchText, submitText, resetText, collapseRender } = searchConfig;

  const counter = Container.useContainer();
  const [collapse, setCollapse] = useMergeValue<boolean>(true, {
    value: searchConfig.collapsed,
    onChange: searchConfig.onCollapse,
  });
  const [proColumnsMap, setProColumnsMap] = useState<{
    [key: string]: ProColumns<any>;
  }>({});

  const windowSize = useMediaQuery();
  const [colSize, setColSize] = useState(getSpanConfig(span || 8, windowSize));
  const [formHeight, setFormHeight] = useState<number | undefined>(88);
  const rowNumber = 24 / colSize || 3;

  const isForm = type === 'form';

  /**
   *提交表单，根据两种模式不同，方法不相同
   */
  const submit = async () => {
    // 如果不是表单模式，不用进行验证
    if (!isForm) {
      const value = form.getFieldsValue();
      if (onSubmit) {
        onSubmit(conversionValue(value, dateFormatter, proColumnsMap) as T);
      }
      return;
    }
    try {
      form.validateFields((error, values) => {
        if (onSubmit && !error) {
          onSubmit(conversionValue(values, dateFormatter, proColumnsMap) as T);
        }
      });
    } catch (error) {
      // console.log(error)
    }
  };

  useEffect(() => {
    if (!formRef) {
      return;
    }
    if (typeof formRef === 'function') {
      formRef(form);
    }
    if (formRef && typeof formRef !== 'function') {
      // eslint-disable-next-line no-param-reassign
      formRef.current = {
        ...form,
      };
    }
  }, []);

  useEffect(() => {
    setColSize(getSpanConfig(span || 8, windowSize));
  }, [windowSize]);

  useDeepCompareEffect(() => {
    const tempMap = {};
    counter.proColumns.forEach(item => {
      tempMap[genColumnKey(item.key, item.dataIndex) || 'null'] = item;
    });
    setProColumnsMap(tempMap);
  }, counter.proColumns);

  const columnsList = counter.proColumns
    .filter(item => {
      const { valueType } = item;
      if (item.hideInSearch && type !== 'form') {
        return false;
      }
      if (type === 'form' && item.hideInForm) {
        return false;
      }
      if (
        valueType !== 'index' &&
        valueType !== 'indexBorder' &&
        valueType !== 'option' &&
        (item.key || item.dataIndex)
      ) {
        return true;
      }
      return false;
    })
    .sort((a, b) => {
      if (a && b) {
        return (b.order || 0) - (a.order || 0);
      }
      if (a && a.order) {
        return -1;
      }
      if (b && b.order) {
        return 1;
      }
      return 0;
    });
  const colConfig = typeof span === 'number' ? { span } : span;

  const domList = columnsList
    .filter((_, index) => (collapse && type !== 'form' ? index < (rowNumber - 1 || 1) : true))
    .map(item => {
      const { valueType, dataIndex, ...rest } = item;
      const key = genColumnKey(rest.key, dataIndex);
      return (
        <Col {...colConfig} key={key}>
          <Form.Item labelAlign="right" label={item.title} {...(isForm && rest)}>
            {form.getFieldDecorator(`${key}`, {
              initialValue: item.initialValue,
            })(<FromInputRender item={item} type={type} />)}
          </Form.Item>
        </Col>
      );
    });

  return (
    <ConfigConsumer>
      {({ getPrefixCls }: ConfigConsumerProps) => {
        const className = getPrefixCls('pro-table-search');
        const formClassName = getPrefixCls('pro-table-form');
        return (
          <div
            className={classNames(className, {
              [formClassName]: isForm,
            })}
            style={
              isForm
                ? undefined
                : {
                    height: formHeight,
                  }
            }
          >
            <RcResizeObserver
              onResize={({ height }) => {
                if (type === 'form') {
                  return;
                }
                setFormHeight(height + 24);
              }}
            >
              <div>
                <Form {...formConfig} form={form}>
                  <Row gutter={16} justify="end">
                    {domList}
                    <Col
                      {...colConfig}
                      offset={getOffset(domList.length, colSize)}
                      key="option"
                      className={classNames(`${className}-option`, {
                        [`${className}-form-option`]: isForm,
                      })}
                    >
                      <Form.Item label={isForm && ' '}>
                        <>
                          <Button type="primary" htmlType="submit" onClick={() => submit()}>
                            {isForm ? submitText : searchText}
                          </Button>
                          <Button
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                              form.resetFields();
                              if (!isForm) {
                                submit();
                              }
                            }}
                          >
                            {resetText}
                          </Button>
                          {!isForm && columnsList.length > rowNumber - 1 && (
                            <a
                              style={{ marginLeft: 8 }}
                              onClick={() => {
                                setCollapse(!collapse);
                              }}
                            >
                              {collapseRender && collapseRender(collapse)}
                              <DownOutlined
                                style={{
                                  marginLeft: '0.5em',
                                  transition: '0.3s all',
                                  transform: `rotate(${collapse ? 0 : 0.5}turn)`,
                                }}
                              />
                            </a>
                          )}
                        </>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </RcResizeObserver>
          </div>
        );
      }}
    </ConfigConsumer>
  );
};

export default Form.create<TableFormItem<any>>()(FormSearch);
