# 此仓库已废弃

**重要：** 此仓库后续不再维护，也不再接受更多的特性更新。`ant-design/pro-table` 将会迁移至 `ant-design/pro-components` 仓库进行后续的维护，访问 https://procomponents.ant.design/table 了解更多。此变更不影响继续使用 `@ant-design/pro-table` 这个 npm 包名安装使用此组件。


[English](./README.en_US.md)

<h1 align="center">@ant-design/pro-table</h1>

<div align="center">

🏆 Use Ant Design Table like a Pro!

</div>

### Demo

[codesandbox](https://codesandbox.io/embed/dreamy-river-q7v6s?fontsize=14&hidenavigation=1&theme=dark&view=preview)

## API

pro-table 在 antd 的 table 上进行了一层封装，支持了一些预设，并且封装了一些行为。这里只列出与 antd table 不同的 api。

## Table

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| request | 一个获得 dataSource 的方法 | `(params?: {pageSize: number;current: number;[key: string]: any;}) => Promise<RequestData<T>>` | - |
| postData | 对通过 url 获取的数据进行一些处理 | `(data: T[]) => T[]` | - |
| defaultData | 默认的数据 | `T[]` | - |
| actionRef | get table action | `React.MutableRefObject<ActionType> \| ((actionRef: ActionType) => void)` | - |
| toolBarRender | 渲染工具栏，支持返回一个 dom 数组，会自动增加 margin-right | `(action: UseFetchDataAction<RequestData<T>>) => React.ReactNode[]` | - |
| onLoad | 数据加载完成后触发,会多次触发 | `(dataSource: T[]) => void` | - |
| onRequestError | 数据加载失败时触发 | `(e: Error) => void` | - |
| tableClassName | 封装的 table 的 className | string | - |
| tableStyle | 封装的 table 的 style | CSSProperties | - |
| headerTitle | 左上角的 title | React.ReactNode | - |
| options | table 的工具栏，设置为 false 可以关闭它 | `{{ fullScreen: boolean \| function, reload: boolean \| function,setting: true }}` | `{ fullScreen: true, reload:true, setting: true}` |
| search | 是否显示搜索表单，传入对象时为搜索表单的配置 | [search config](#search) | true |
| dateFormatter | moment 的格式化方式 | `"string" \| "number" \| false` | string |
| beforeSearchSubmit | 搜索之前进行一些修改 | `(params:T)=>T` | - |
| onSizeChange | table 尺寸发生改变 | `(size: 'default' | 'middle' | 'small' | undefined) => void` | - |
| columnsStateMap | columns 的状态枚举 | `{[key: string]: { show:boolean, fixed: "right"|"left"} }` | - |
| onColumnsStateChange | columns 状态发生改变 | `(props: {[key: string]: { show:boolean, fixed: "right"|"left"} }) => void` | - |
| type | pro-table 类型 | `"form"` | - |
| form | antd form 的配置 | `FormProps` | - |

### search

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| searchText | 查询按钮的文本 | string | 查询 |
| resetText | 重置按钮的文本 | string | 重置 |
| submitText | 提交按钮的文本 | string | 提交 |
| collapseRender | 收起按钮的 render | `(collapsed: boolean,showCollapseButton?: boolean,) => React.ReactNode` | - |
| collapsed | 是否收起 | boolean | - |
| onCollapse | 收起按钮的事件 | `(collapsed: boolean) => void;` | - |
| optionRender | 操作栏的 render | `(( searchConfig: Omit<SearchConfig, 'optionRender'>, props: Omit<FormOptionProps, 'searchConfig'>, ) => React.ReactNode) \| false;` | - |

## Columns

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| renderText | 类似 table 的 render，但是必须返回 string，如果只是希望转化枚举，可以使用 [valueEnum](#valueEnum) | `(text: any,record: T,index: number,action: UseFetchDataAction<RequestData<T>>) => string` | - |
| render | 类似 table 的 render，第一个参数变成了 dom,增加了第四个参数 action | `(text: React.ReactNode,record: T,index: number,action: UseFetchDataAction<RequestData<T>>) => React.ReactNode \| React.ReactNode[]` | - |
| renderFormItem | 渲染查询表单的输入组件 | `(item,props:{value,onChange}) => React.ReactNode` | - |
| ellipsis | 是否自动缩略 | boolean | - |
| copyable | 是否支持复制 | boolean | - |
| valueEnum | 值的枚举，会自动转化把值当成 key 来取出要显示的内容 | [valueEnum](#valueEnum) | - |
| valueType | 值的类型 | `'money' \| 'option' \| 'date' \| 'dateTime' \| 'time' \| 'text'\| 'index' \| 'indexBorder'` | 'text' |
| hideInSearch | 在查询表单中不展示此项 | boolean | - |
| hideInTable | 在 Table 中不展示此列 | boolean | - |
| hideInForm | 在 Form 模式下 中不展示此列 | boolean | - |
| filters | 表头的筛选菜单项，当值为 true 时，自动使用 valueEnum 生成 | `boolean \| object[]` | false |
| order | 决定在 查询表单中的顺序，越大越在前面 | number | - |
| formItemProps | 查询表单的 props，会透传给表单项 | `{ [prop: string]: any }` | - |

### ActionType

有些时候我们要触发 table 的 reload 等操作，action 可以帮助我们做到这一点。

```tsx | pure
interface ActionType {
  reload: () => void;
  fetchMore: () => void;
  reset: () => void;
  reloadAndRest: () => void;
}

const ref = useRef<ActionType>();

<ProTable actionRef={ref} />;

// 刷新
ref.current.reload();

// 重置所有项并刷新
ref.current.reloadAndRest();

// 加载更多
ref.current.fetchMore();

// 重置到默认值
ref.current.reset();

// 清空选中项
ref.current.clearSelected();
```

## valueType

现在支持的值如下

| 类型 | 描述 | 示例 |
| --- | --- | --- |
| money | 转化值为金额 | ¥10,000.26 |
| date | 日期 | 2019-11-16 |
| dateRange | 日期区间 | 2019-11-16 2019-11-18 |
| dateTime | 日期和时间 | 2019-11-16 12:50:00 |
| dateTimeRange | 日期和时间区间 | 2019-11-16 12:50:00 2019-11-18 12:50:00 |
| time | 时间 | 12:50:00 |
| option | 操作项，会自动增加 marginRight，只支持一个数组,表单中会自动忽略 | `[<a>操作a</a>,<a>操作b</a>]` |
| text | 默认值，不做任何处理 | - |
| textarea | 与 text 相同， form 转化时会转为 textarea 组件 | - |
| index | 序号列 | - |
| indexBorder | 带 border 的序号列 | - |
| progress | 进度条 | - |
| digit | 单纯的数字，form 转化时会转为 inputNumber | - |

## valueEnum

当前列值的枚举

```typescript | pure
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
import React, { useState } from 'react';
import ProTable, { ProColumns } from '@ant-design/pro-table';
import { Input, Button } from 'antd';

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

export default () => {
  const [keywords, setKeywords] = useState('');
  return (
    <ProTable<{}, { keywords: string }>
      size="small"
      columns={columns}
      request={() => ({
        data: [
          {
            name: 'Jack',
            age: 12,
            date: '2020-01-02',
          },
        ],
        success: true,
      })}
      rowKey="name"
      params={{ keywords }}
      toolBarRender={(action) => [
        <Input.Search
          style={{
            width: 200,
          }}
          onSearch={(value) => setKeywords(value)}
        />,
      ]}
      pagination={{
        defaultCurrent: 10,
      }}
    />
  );
};
```

## LICENSE

MIT
