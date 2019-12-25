import React from 'react';
import { Button, Icon } from 'antd';
// eslint-disable-next-line import/no-unresolved
import ProTable, { ProColumns } from '@ant-design/pro-table';

export interface TableListItem {
  key: number;
  name: string;
  status: number;
  updatedAt: number;
  createdAt: number;
  progress: number;
  money: number;
}
const tableListDataSource: TableListItem[] = [];

const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error',
};

for (let i = 0; i < 10; i += 1) {
  tableListDataSource.push({
    key: i,
    name: `TradeCode ${i}`,
    status: valueEnum[Math.floor(Math.random() * 10) % 4],
    updatedAt: Date.now() - Math.floor(Math.random() * 1000),
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
    money: Math.floor(Math.random() * 2000) * i,
    progress: Math.ceil(Math.random() * 100),
  });
}

const columns: ProColumns<TableListItem>[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 80,
  },
  {
    title: 'border 序号',
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 80,
  },
  {
    title: '金额',
    dataIndex: 'money',
    valueType: 'money',
  },
  {
    title: '状态',
    dataIndex: 'status',
    initialValue: 'all',
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
    valueType: 'dateTime',
  },
  {
    title: '更新时间',
    key: 'since2',
    dataIndex: 'createdAt',
    valueType: 'date',
  },
  {
    title: '关闭时间',
    key: 'since2',
    dataIndex: 'updatedAt',
    valueType: 'time',
  },
  {
    title: '操作',
    key: 'option',
    valueType: 'option',
    render: () => [<a>操作</a>, <a>删除</a>],
  },
];

export default () => (
  <ProTable<TableListItem>
    columns={columns}
    request={() =>
      Promise.resolve({
        data: tableListDataSource,
        success: true,
      })
    }
    rowKey="id"
    pagination={{
      showSizeChanger: true,
    }}
    dateFormatter="string"
    headerTitle="valueType 设置"
    params={{ state: 'all' }}
    toolBarRender={() => [
      <Button key="3" type="primary">
        <Icon type="plus" />
        新建
      </Button>,
    ]}
  />
);
