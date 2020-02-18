import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import ProTable, { ProColumns } from '@ant-design/pro-table';

const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error',
};

export interface TableListItem {
  key: number;
  name: string;
  status: string;
  updatedAt: number;
  createdAt: number;
  progress: number;
  money: number;
  createdAtRange: number[];
}
const tableListDataSource: TableListItem[] = [];

for (let i = 0; i < 10; i += 1) {
  tableListDataSource.push({
    key: i,
    name: `TradeCode ${i}`,
    status: valueEnum[Math.floor(Math.random() * 10) % 4],
    updatedAt: Date.now() - Math.floor(Math.random() * 1000),
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
    createdAtRange: [
      Date.now() - Math.floor(Math.random() * 2000),
      Date.now() - Math.floor(Math.random() * 2000),
    ],
    money: Math.floor(Math.random() * 2000) * i,
    progress: Math.ceil(Math.random() * 100) + 1,
  });
}

const columns: ProColumns<TableListItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 72,
  },
  {
    title: 'border 序号',
    dataIndex: 'index',
    key: 'indexBorder',
    valueType: 'indexBorder',
    width: 72,
  },
  {
    title: '金额',
    dataIndex: 'money',
    valueType: 'money',
    width: 150,
  },
  {
    title: '数字',
    dataIndex: 'money',
    key: 'digit',
    valueType: 'digit',
    width: 150,
  },
  {
    title: '状态',
    dataIndex: 'status',
    initialValue: 'all',
    width: 100,
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      close: { text: '关闭', status: 'Default' },
      running: { text: '运行中', status: 'Processing' },
      online: { text: '已上线', status: 'Success' },
      error: { text: '异常', status: 'Error' },
    },
  },
  {
    title: '创建时间',
    key: 'since',
    dataIndex: 'createdAt',
    width: 200,
    valueType: 'dateTime',
  },
  {
    title: '日期区间',
    key: 'dateRange',
    dataIndex: 'createdAtRange',
    width: 200,
    valueType: 'dateRange',
  },
  {
    title: '时间区间',
    key: 'dateTimeRange',
    dataIndex: 'createdAtRange',
    width: 200,
    valueType: 'dateTimeRange',
  },
  {
    title: '进度',
    key: 'progress',
    dataIndex: 'progress',
    valueType: item => ({
      type: 'progress',
      status: item.status !== 'error' ? 'active' : 'exception',
    }),
    width: 200,
  },
  {
    title: '更新时间',
    key: 'since2',
    width: 120,
    dataIndex: 'createdAt',
    valueType: 'date',
  },
  {
    title: '关闭时间',
    key: 'since3',
    width: 120,
    dataIndex: 'updatedAt',
    valueType: 'time',
  },
  {
    title: '操作',
    key: 'option',
    width: 120,
    valueType: 'option',
    render: () => [<a>操作</a>, <a>删除</a>],
  },
];

export default () => (
  <>
    <ProTable<TableListItem>
      columns={columns}
      request={() =>
        Promise.resolve({
          data: tableListDataSource,
          success: true,
        })
      }
      rowKey="key"
      pagination={{
        showSizeChanger: true,
      }}
      scroll={{
        x: columns.length * 120,
      }}
      dateFormatter="string"
      headerTitle="valueType 设置"
      toolBarRender={() => [
        <Button key="3" type="primary">
          <PlusOutlined />
          新建
        </Button>,
      ]}
    />
    <ProTable<TableListItem>
      style={{
        maxWidth: 500,
      }}
      type="form"
      columns={columns}
      onSubmit={params => {
        // eslint-disable-next-line no-console
        console.log(params);
      }}
    />
  </>
);
