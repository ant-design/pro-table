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
| postData | Do some processing on the data obtained through the url. | `(data: T[]) => T[]` | - |
| defaultData | Default data array. | `T[]` | - |
| actionRef | Triggered after the table data is successfully initialized, it will be triggered multiple times. | `React.MutableRefObject<ActionType> \| ((actionRef: ActionType) => void)` | [] |
| toolBarRender | Render toolbar, support for returning a dom array, will automatically increase margin-right. | `(action: UseFetchDataAction<RequestData<T>>) => React.ReactNode[]` | - |
| onLoad | Triggered after the data is loaded, it will be triggered multiple times. | `(dataSource: T[]) => void` | - |
| onRequestError | Triggered when fetching data failed | `(e: Error) => void` | - |
| tableClassName | The className of the packaged table | string | - |
| tableStyle | The style of the packaged table | CSSProperties | - |
| options | table's default operation, set to false to close it | `{{ fullScreen: boolean \| function, reload: boolean \| function,setting: true }}` | `{{ fullScreen: true, reload:true,setting: true }}` |
| search | Whether to search the form. It can also be a query form config when passing an object. | `boolean \| { span?: number \| DefaultColConfig,searchText?: string, resetText?: string, collapseRender?: (collapsed: boolean) => React.ReactNode, collapsed:boolean, onCollapse: (collapsed:boolean)=> void }` | true |
| dateFormatter | formatting moment type | `"string" \| "number" \| false` | string |
| beforeSearchSubmit | Make some changes before searching | `(params:T)=>T` | - |
| onSizeChange | table size changes | `(size: 'default' | 'middle' | 'small' | undefined) => void` | - |
| columnsStateMap | columns status | `{[key: string]: { show:boolean, fixed: "right"|"left"} }` | - |
| onColumnsStateChange | columns status changed | `(props: {[key: string]: { show:boolean, fixed: "right"|"left"} }) => void` | - |

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
| formItemProps | Props passed into query form item | `{ [prop: string]: any }` | - |

### ActionType

Sometimes we need to trigger the reload of the table and other actions, and actions can help us do this.

```tsx
interface ActionType {
  reload: () => void;
  fetchMore: () => void;
  reset: () => void;
}

const ref = useRef<ActionType>();

<ProTable actionRef={ref} />;

// Load more
ref.reload();

// 加载更多
ref.fetchMore();

// Reset to reset value
ref.reset();
```

### valueType

- money conversion value is the amount of eg. ¥10,000.26
- date date eg. 2019-11-16
- dateTime date and time eg. 2019-11-16 12:50:00
- time time eg. 12:50:00
- option operation item, it will automatically increase marginRight, only one array is supported.
- text default value, no processing

### valueEnums

```typescript
interface IValueEnum {
  [key: string]:
    | React.ReactNode
    | {
        text: React.ReactNode;
        status: 'Success' | 'Error' | 'Processing' | 'Warning' | 'Default';
      };
}
```

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
    ],
  },
];

export default () => (
  <ProTable
    size="small"
    columns={columns}
    url={request}
    rowKey="key"
    params={{}}
    toolBarRender={action => [
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
    ]}
  />
);
```

## LICENSE

MIT
