import React from 'react';
import moment from 'moment';
import { ProColumns, TableStatus, TableDropdown } from '../../src';

const data: {
  key: string | number;
  name: string;
  age: string | number;
  address: string;
  money: number;
  date: number;
}[] = [];
for (let i = 0; i < 46; i += 1) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 10 + i,
    money: parseFloat((10000.26 * (i + 1)).toFixed(2)),
    date: moment('2019-11-16 12:50:26').valueOf() + i * 1000 * 60 * 2,
    address: `London, Park Lane no. ${i}`,
  });
}

export const columns: ProColumns[] = [
  {
    title: '序号',
    dataIndex: 'index',
    valueType: 'index',
    width: 72,
  },
  {
    title: '边框序号',
    dataIndex: 'indexBorder',
    valueType: 'indexBorder',
    width: 72,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    copyable: true,
  },
  {
    title: 'sex',
    dataIndex: 'sex',
    copyable: true,
    valueEnum: {
      man: '男',
      woman: '女',
    },
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    ellipsis: true,
    width: 100,
  },
  {
    title: 'money',
    dataIndex: 'money',
    valueType: 'money',
  },
  {
    title: 'date',
    key: 'date',
    dataIndex: 'date',
    valueType: 'date',
  },
  {
    title: 'dateTime',
    key: 'dateTime',
    dataIndex: 'date',
    valueType: 'dateTime',
  },
  {
    title: 'time',
    key: 'time',
    dataIndex: 'date',
    valueType: 'time',
  },
  {
    title: '状态',
    dataIndex: 'status',
    render: () => (
      <div>
        <TableStatus.Success>上线成功</TableStatus.Success>
        <br />
        <TableStatus.Error>上线失败</TableStatus.Error>
        <br />
        <TableStatus.Processing>正在部署</TableStatus.Processing>
        <br />
        <TableStatus.Default>正在初始化</TableStatus.Default>
      </div>
    ),
  },
  {
    title: 'option',
    valueType: 'option',
    dataIndex: 'id',
    render: (text, row, index, action) => [
      <a
        onClick={() => {
          window.alert('确认删除？');
          action.reload();
        }}
      >
        delete
      </a>,
      <a
        onClick={() => {
          window.alert('确认刷新？');
          action.reload();
        }}
      >
        reload
      </a>,
      <TableDropdown
        onSelect={(key) => window.alert(key)}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export const request = (): Promise<{
  data: {
    key: string | number;
    name: string;
    age: string | number;
    address: string;
  }[];
  success: true;
}> =>
  Promise.resolve({
    data,
    success: true,
  });
