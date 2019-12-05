[中文](./README.md)

<h1 align="center">@ant-design/pro-table</h1>

<div align="center">

🏆 Use Ant Design Table like a Pro!

</div>

### Demo

[codesandbox](https://codesandbox.io/embed/dreamy-river-q7v6s?fontsize=14&hidenavigation=1&theme=dark&view=preview)

## API

pro-table is encapsulated in an antd table, supports some presets, and encapsulates some behavior. Only apis different from antd table are listed here.

### Table

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| request | a method to get the dataSource. | `(params?: {pageSize: number;current: number;[key: string]: any;}) => Promise<RequestData<T>>` | - |
| filterDate | Do some processing on the data obtained through the url. | `(data: T[]) => T[]` | - |
| defaultData | Default data array. | `T[]` | - |
| manual | Whether manual mode, you need to manually call fetch. | boolean | - |
| effects | When the dependent parameter changes, the load data is automatically removed. | `(number \| string \| boolean)[]` | [] |
| onInit | Triggered after the table data is successfully initialized, it will be triggered multiple times. | `(action: UseFetchDataAction<RequestData<T>>) => void` | [] |
| renderToolBar | Render toolbar, support for returning a dom array, will automatically increase margin-right. | `(action: UseFetchDataAction<RequestData<T>>) => React.ReactNode[]` | - |
| onLoad | Triggered after the data is loaded, it will be triggered multiple times. | `(dataSource: T[]) => void` | - |
| tableClassName | The className of the packaged table | string | - |
| tableStyle | The style of the packaged table | CSSProperties | - |
| options | table's default operation, set to false to close it | `{{ fullScreen: boolean \| function, reload: boolean \| function,setting: true }}` | `{{ fullScreen: true, reload:true,setting: true }}` |
| search | whether to search the form | boolean | true |
| momentFormat | formatting moment type | `"string" \| "number" \| false` | string |
| beforeSearchSubmit | Make some changes before searching | `(params:T)=>T` | - |

### Columns

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| renderText | Similar to table render, but must return string, if you just want to convert the enumeration, you can use this scheme | `(text: any,record: T,index: number,action: UseFetchDataAction<RequestData<T>>) => string` | - |
| render | Like table's render, the first argument becomes dom, and the fourth argument is added. | `(text: React.ReactNode,record: T,index: number,action: UseFetchDataAction<RequestData<T>>) => React.ReactNode \| React.ReactNode[]` | - |
| renderFormItem | input component for rendering query form | `(item, props: {value, onChange}) => React.ReactNode` | - |
| ellipsis | Whether to automatically abbreviate | boolean | - |
| copyable | Whether to support replication | boolean | - |
| valueEnum | The enumeration of values will automatically convert the value as a key to get the content to be displayed | {[key: string]: React.ReactNode} | - |
| valueType | Type of value | `'money' \| 'option' \| 'date' \| 'dateTime' \| 'time' \| 'text'\| 'index' \| 'indexBorder'` | 'text' |
| hideInSearch | Do not show this in the query form | boolean | - |
| hideInTable | Do not show this column in Table | boolean | - |

### valueType

- money conversion value is the amount of eg. ¥10,000.26
- date date eg. 2019-11-16
- dateTime date and time eg. 2019-11-16 12:50:00
- time time eg. 12:50:00
- option operation item, it will automatically increase marginRight, only one array is supported.
- text default value, no processing

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
        reload
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
        go home
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
