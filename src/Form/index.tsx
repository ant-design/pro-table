import React, { useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Input, Form, Row, Col, TimePicker, InputNumber, DatePicker, Select, Button } from 'antd';
import moment, { Moment } from 'moment';
import RcResizeObserver from 'rc-resize-observer';
import { FormComponentProps } from 'antd/lib/form';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider';
import { parsingValueEnumToArray } from '../component/util';
import Container from '../container';
import { ProColumns } from '../index';
import './index.less';

interface FormItem<T> extends FormComponentProps {
  onSubmit?: (value: T) => void;
  onReset?: () => void;
  dateFormatter?: 'string' | 'number' | false;
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
        <Select placeholder="请选择" ref={ref} {...rest}>
          <Select.Option key="all" value="all">
            全部
          </Select.Option>
          {parsingValueEnumToArray(valueEnum).map(({ value, text }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </Select>
      );
    }
    return <Input placeholder="请输入" {...rest} />;
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

const FormSearch = <T, U = {}>({ form, onSubmit, dateFormatter = 'string' }: FormItem<T>) => {
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

  useEffect(() => {
    const tempMap = {};
    counter.proColumns.forEach(item => {
      const columnsKey = item.key || item.dataIndex || 'null';
      tempMap[columnsKey] = item;
    });
    setProColumnsMap(tempMap);
  }, [JSON.stringify(counter.proColumns)]);

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
                    <Button type="primary" htmlType="submit" onClick={() => submit()}>
                      搜索
                    </Button>
                    <Button
                      style={{ marginLeft: 8 }}
                      onClick={() => {
                        form.resetFields();
                        submit();
                      }}
                    >
                      重置
                    </Button>
                    {columnsList.length > 2 && (
                      <a
                        style={{ marginLeft: 8 }}
                        onClick={() => {
                          setCollapse(!collapse);
                        }}
                      >
                        {collapse ? '展开' : '收起'}{' '}
                        <DownOutlined
                          style={{
                            transition: '0.3s all',
                            transform: `rotate(${collapse ? 0 : 0.5}turn)`,
                          }}
                        />
                      </a>
                    )}
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
