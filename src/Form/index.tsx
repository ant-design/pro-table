import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Input, Form, Row, Col, TimePicker, InputNumber, DatePicker, Select, Button } from 'antd';
import moment, { Moment } from 'moment';
import RcResizeObserver from 'rc-resize-observer';
import { FormComponentProps } from 'antd/lib/form';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider';
import { parsingValueEnumToArray, useDeepCompareEffect } from '../component/util';
import Container from '../container';
import { ProColumns } from '../index';
import './index.less';

export interface SearchConfig {
  searchText?: string;
  resetText?: string;
  collapseRender?: (collapsed: boolean) => React.ReactNode;
}

const defaultSearch: Required<SearchConfig> = {
  searchText: '查询',
  resetText: '重置',
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
        <Select placeholder="请选择" ref={ref} {...rest} {...item.formItemProps}>
          {parsingValueEnumToArray(valueEnum).map(({ value, text }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </Select>
      );
    }
    return <Input placeholder="请输入" {...rest} {...item.formItemProps} />;
  }
  if (item.valueType === 'date') {
    return (
      <DatePicker
        ref={ref}
        placeholder="请选择"
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
        placeholder="请选择"
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
        placeholder="请选择"
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
        placeholder="请输入"
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

const getDefaultSearch = (search?: boolean | SearchConfig): Required<SearchConfig> => {
  if (search === undefined || search === true) {
    return defaultSearch;
  }
  return { ...defaultSearch, ...search } as Required<SearchConfig>;
};

const FormSearch = <T, U = {}>({
  form,
  onSubmit,
  dateFormatter = 'string',
  search: propsSearch,
}: FormItem<T>) => {
  const counter = Container.useContainer();
  const [collapse, setCollapse] = useState<boolean>(true);
  const [proColumnsMap, setProColumnsMap] = useState<{
    [key: string]: ProColumns<any>;
  }>({});
  const [formHeight, setFormHeight] = useState<number>(88);

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
    .filter((_, index) => (collapse ? index < 2 : true))
    .map(item => (
      <Col span={8} key={item.key || item.dataIndex}>
        <Form.Item label={item.title}>
          {form.getFieldDecorator((item.key || item.dataIndex) as string, {
            initialValue: item.initialValue,
          })(<FromInputRender item={item} />)}
        </Form.Item>
      </Col>
    ));

  const defaultSearchConfig = getDefaultSearch(propsSearch);

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
              <Form layout="inline">
                <Row gutter={16} justify="end">
                  {domList}
                  <Col
                    span={8}
                    offset={(2 - (domList.length % 3)) * 8}
                    key="option"
                    className={`${className}-option`}
                  >
                    <Form.Item>
                      <Button type="primary" htmlType="submit" onClick={() => submit()}>
                        {defaultSearchConfig.searchText}
                      </Button>
                      <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                          form.resetFields();
                          submit();
                        }}
                      >
                        {defaultSearchConfig.resetText}
                      </Button>
                      {columnsList.length > 2 && (
                        <a
                          style={{ marginLeft: 8 }}
                          onClick={() => {
                            setCollapse(!collapse);
                          }}
                        >
                          {defaultSearchConfig.collapseRender &&
                            defaultSearchConfig.collapseRender(collapse)}
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
