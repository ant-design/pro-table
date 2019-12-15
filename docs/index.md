---
title: 介绍
order: 10
---

<h1 align="center">@ant-design/pro-table</h1>

<div align="center">

🏆 Use Ant Design Table like a Pro!

</div>

## Usage

```bash
npm install @ant-design/pro-table
# or
yarn add @ant-design/pro-table
```

```tsx | pure
import ProTable, { ProColumns } from '@ant-design/pro-table';

const columns: ProColumns[] = [
  {
    title: 'Name',
    dataIndex: 'name',
    copyable: true,
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'date',
    dataIndex: 'date',
    valueType: 'date',
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
    ],
  },
];

export default () => (
  <ProTable
    size="small"
    columns={columns}
    url={request}
    rowKey="key"
    params={{ keyword }}
    renderToolBar={action => [
      <Input.Search
        style={{
          width: 200,
        }}
        onSearch={value => setKeyword(value)}
      />,
      <Button
        onClick={() => {
          action.reload();
        }}
        type="primary"
        style={{
          marginRight: 8,
        }}
      >
        刷新
      </Button>,
      <Button
        onClick={() => {
          action.resetPageIndex();
        }}
        type="default"
        style={{
          marginRight: 8,
        }}
      >
        回到第一页
      </Button>,
    ]}
    pagination={{
      defaultCurrent: 10,
    }}
  />
);
```
