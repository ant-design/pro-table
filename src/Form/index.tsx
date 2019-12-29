import React, { useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Input, Form, Row, Col, TimePicker, InputNumber, DatePicker, Select, Button } from 'antd';
import moment, { Moment } from 'moment';
import RcResizeObserver from 'rc-resize-observer';
import useMediaQuery from 'use-media-antd-query';
import { FormComponentProps } from 'antd/lib/form';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider';
import { parsingValueEnumToArray, useDeepCompareEffect } from '../component/util';
import { useIntl, IntlType } from '../component/intlContext';
import Container from '../container';
import { ProColumns } from '../index';
import './index.less';

const defaultColConfig = {
  lg: 8,
  md: 12,
  xxl: 6,
  xl: 8,
  sm: 12,
  xs: 24,
};

export interface SearchConfig {
  searchText?: string;
  resetText?: string;
  span?: number | typeof defaultColConfig;
  collapseRender?: (collapsed: boolean) => React.ReactNode;
}

const getOffset = (length: number, span: number = 8) => {
  const cols = 24 / span;
  return (cols - 1 - (length % cols)) * span;
};

const defaultSearch: Required<SearchConfig> = {
  searchText: '查询',
  resetText: '重置',
  span: defaultColConfig,
  collapseRender: (collapsed: boolean) => (collapsed ? '展开' : '收起'),
};

interface FormItem<T> extends FormComponentProps {
  onSubmit?: (value: T) => void;
  onReset?: () => void;
  dateFormatter?: 'string' | 'number' | false;
  search?: boolean | SearchConfig;
}

const FromInputRender: React.FC<{
  item: ProColumns<any>;
  value?: any;
  onChange?: (value: any) => void;
}> = React.forwardRef(({ item, ...rest }, ref: any) => {
  const intl = useIntl();
  /**
   * 自定义 render
   */
  if (item.renderFormItem) {
    return item.renderFormItem(item, rest) as any;
  }
  if (!item.valueType || item.valueType === 'text') {
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
  if (item.valueType === 'date') {
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

  if (item.valueType === 'dateTime') {
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
  if (item.valueType === 'time') {
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
  if (item.valueType === 'money') {
    return (
      <InputNumber
        ref={ref}
        min={0}
        formatter={value => {
          if (value) {
            return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
          }
          return '';
        }}
        parser={value => (value ? value.replace(/\$\s?|(,*)/g, '') : '')}
        placeholder={intl.getMessage('tableFrom.selectPlaceholder', '请选择')}
        precision={2}
        style={{
          width: '100%',
        }}
        {...rest}
        {...item.formItemProps}
      />
    );
  }

  return undefined;
});

const dateFormatterMap = {
  time: 'HH:mm:SS',
  date: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DD HH:mm:SS',
};

const genValue = (value: any, dateFormatter?: string | boolean, proColumnsMap?: any) => {
  const tmpValue = {};
  Object.keys(value).forEach(key => {
    const itemValue = value[key];
    if (itemValue && itemValue !== 'all') {
      if (moment.isMoment(itemValue) && dateFormatter) {
        if (dateFormatter === 'string') {
          const formatString =
            dateFormatterMap[(proColumnsMap[key || 'null'] || {}).valueType || 'dateTime'];
          tmpValue[key] = (itemValue as Moment).format(formatString || 'YYYY-MM-DD HH:mm:SS');
          return;
        }
        if (dateFormatter === 'number') {
          tmpValue[key] = (itemValue as Moment).valueOf();
          return;
        }
      }
      tmpValue[key] = itemValue;
    }
  });
  return tmpValue;
};

const getDefaultSearch = (
  search: boolean | SearchConfig | undefined,
  intl: IntlType,
): Required<SearchConfig> => {
  const config = {
    collapseRender: (collapsed: boolean) => {
      if (collapsed) {
        return intl.getMessage('tableFrom.collapsed', '展开');
      }
      return intl.getMessage('tableFrom.expand', '收起');
    },
    searchText: intl.getMessage('tableFrom.search', defaultSearch.searchText),
    resetText: intl.getMessage('tableFrom.reset', defaultSearch.resetText),
    span: defaultColConfig,
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
  form,
  onSubmit,
  dateFormatter = 'string',
  search: propsSearch,
}: FormItem<T>) => {
  const intl = useIntl();
  const searchConfig = getDefaultSearch(propsSearch, intl);
  const { span, searchText, resetText, collapseRender } = searchConfig;

  const counter = Container.useContainer();
  const [collapse, setCollapse] = useState<boolean>(true);
  const [proColumnsMap, setProColumnsMap] = useState<{
    [key: string]: ProColumns<any>;
  }>({});

  const windowSize = useMediaQuery();
  const [colSize, setColSize] = useState(getSpanConfig(span, windowSize));
  const [formHeight, setFormHeight] = useState<number>(88);
  const rowNumber = 24 / colSize || 3;

  useEffect(() => {
    setColSize(getSpanConfig(span, windowSize));
  }, [windowSize]);

  const submit = () => {
    const value = form.getFieldsValue();
    if (onSubmit) {
      onSubmit(genValue(value, dateFormatter, proColumnsMap) as T);
    }
  };

  useDeepCompareEffect(() => {
    const tempMap = {};
    counter.proColumns.forEach(item => {
      const columnsKey = item.key || item.dataIndex || 'null';
      tempMap[columnsKey] = item;
    });
    setProColumnsMap(tempMap);
  }, counter.proColumns);

  const columnsList = counter.proColumns.filter(
    item =>
      item.valueType !== 'index' &&
      item.valueType !== 'indexBorder' &&
      item.valueType !== 'option' &&
      !item.hideInSearch &&
      (item.key || item.dataIndex),
  );

  const domList = columnsList
    .filter((_, index) => (collapse ? index < (rowNumber - 1 || 1) : true))
    .map(item => (
      <Col {...span} key={item.key || item.dataIndex}>
        <Form.Item labelAlign="right" label={item.title}>
          {form.getFieldDecorator((item.key || item.dataIndex) as string, {
            initialValue: item.initialValue,
          })(<FromInputRender item={item} />)}
        </Form.Item>
      </Col>
    ));

  return (
    <ConfigConsumer>
      {({ getPrefixCls }: ConfigConsumerProps) => {
        const className = getPrefixCls('pro-table-form-search');
        return (
          <div
            className={className}
            style={{
              height: formHeight,
            }}
          >
            <RcResizeObserver onResize={({ height }) => setFormHeight(height + 32)}>
              <Form>
                <Row gutter={16} justify="end">
                  {domList}
                  <Col
                    {...span}
                    offset={getOffset(domList.length, colSize)}
                    key="option"
                    className={`${className}-option`}
                  >
                    <Form.Item>
                      <Button type="primary" htmlType="submit" onClick={() => submit()}>
                        {searchText}
                      </Button>
                      <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                          form.resetFields();
                          submit();
                        }}
                      >
                        {resetText}
                      </Button>
                      {columnsList.length > rowNumber - 1 && (
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
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </RcResizeObserver>
          </div>
        );
      }}
    </ConfigConsumer>
  );
};

export default Form.create<FormItem<any>>()(FormSearch);
