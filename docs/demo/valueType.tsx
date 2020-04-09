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
  percent: number | string;
  createdAtRange: number[];
}
const tableListDataSource: TableListItem[] = [];

for (let i = 0; i < 20; i += 1) {
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
    percent:
      Math.random() > 0.5
        ? ((i + 1) * 10 + Math.random()).toFixed(3)
        : -((i + 1) * 10 + Math.random()).toFixed(2),
  });
}

const columns: ProColumns<TableListItem>[] = [
  {
    title: '关闭时间',
    key: 'since3',
    width: 120,
    dataIndex: 'updatedAt',
  },
  {
    title: '百分比',
    key: 'percent',
    width: 120,
    dataIndex: 'percent',
    valueType: () => ({
      type: 'percent',
    }),
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
      request={() => {
        return Promise.resolve({
          total: 200,
          data: tableListDataSource,
          success: true,
        });
      }}
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
      onSubmit={(params) => {
        // eslint-disable-next-line no-console
        console.log(params);
      }}
    />
  </>
);
