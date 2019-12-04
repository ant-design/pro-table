[English](./README.en_US.md)

<h1 align="center">@ant-design/pro-table</h1>

<div align="center">

🏆 Use Ant Design Table like a Pro!

</div>

### Demo

[codesandbox](https://codesandbox.io/embed/dreamy-river-q7v6s?fontsize=14&hidenavigation=1&theme=dark&view=preview)

## API

pro-table 在 antd 的 table 上进行了一层封装，支持了一些预设，并且封装了一些行为。这里只列出与 antd table 不同的 api。

### Table

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| request | 一个获得 dataSource 的方法 | `(params?: {pageSize: number;current: number;[key: string]: any;}) => Promise<RequestData<T>>` | - |
| filterDate | 对通过 url 获取的数据进行一些处理 | `(data: T[]) => T[]` | - |
| defaultData | 默认的数据 | `T[]` | - |
| manual | 是否手动模式 | boolean | - |
| effects | 依赖的参数改变时，会自动去 load 数据 | `(number \| string \| boolean)[]` | [] |
| onInit | 表格的数据初始化成功之后触发，会多次触发。 | `(action: UseFetchDataAction<RequestData<T>>) => void` | [] |
| renderToolBar | 渲染工具栏，支持返回一个 dom 数组，会自动增加 margin-right | `(action: UseFetchDataAction<RequestData<T>>) => React.ReactNode[]` | - |
| onLoad | 数据加载完成后触发,会多次触发 | `(dataSource: T[]) => void` | - |
| tableClassName | 封装的 table 的 className | string | - |
| tableStyle | 封装的 table 的 style | CSSProperties | - |
| options | table 的默认操作，设置为 false 可以关闭它 | `{{ fullScreen: boolean | function, reload: boolean | function,setting: true }}` | `{{ fullScreen: true, reload:true,setting: true }}` | - |
| search | 是否搜索表单 | boolean | true |

### Columns

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| renderText | 类似 table 的 render，但是必须返回 string，如果只是希望转化枚举，可以使用 valueEnum | `(text: any,record: T,index: number,action: UseFetchDataAction<RequestData<T>>) => string` | - |
| render | 类似 table 的 render，第一个参数变成了 dom,增加了第四个参数 action | `(text: React.ReactNode,record: T,index: number,action: UseFetchDataAction<RequestData<T>>) => React.ReactNode \| React.ReactNode[]` | - |
| renderFormItem | 渲染查询表单的输入组件 | `(item,props:{value,onChange}) => React.ReactNode` | - |
| ellipsis | 是否自动缩略 | boolean | - |
| copyable | 是否支持复制 | boolean | - |
| valueEnum | 值的枚举，会自动转化把值当成 key 来取出要显示的内容 | {[key:string]: React.ReactNode} | - |
| valueType | 值的类型 | `'money' \| 'option' \| 'date' \| 'dateTime' \| 'time' \| 'text'\| 'index' \| 'indexBorder'` | 'text' |

### valueType

- money 转化值为金额 eg. ¥10,000.26
- date 日期 eg. 2019-11-16
- dateTime 日期和时间 eg. 2019-11-16 12:50:00
- time 时间 eg. 12:50:00
- option 操作项，会自动增加 marginRight，只支持一个数组
- text 默认值，不做任何处理
- index 序号列
- indexBorder 带 border 的序号列

## Usage

```bash
npm install @ant-design/pro-table
# or
yarn add @ant-design/pro-table
```

```tsx
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

## LICENSE

MIT
