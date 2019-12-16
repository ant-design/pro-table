---
title: API
---

# API

pro-table 在 antd 的 table 上进行了一层封装，支持了一些预设，并且封装了一些行为。这里只列出与 antd table 不同的 api。

## Table

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| request | 一个获得 dataSource 的方法 | `(params?: {pageSize: number;current: number;[key: string]: any;}) => Promise<RequestData<T>>` | - |
| filterData | 对通过 url 获取的数据进行一些处理 | `(data: T[]) => T[]` | - |
| defaultData | 默认的数据 | `T[]` | - |
| manual | 是否手动模式 | boolean | - |
| effects | 依赖的参数改变时，会自动去 load 数据 | `(number \| string \| boolean)[]` | [] |
| onInit | 表格的数据初始化成功之后触发，会多次触发。 | `(action: UseFetchDataAction<RequestData<T>>) => void` | [] |
| renderToolBar | 渲染工具栏，支持返回一个 dom 数组，会自动增加 margin-right | `(action: UseFetchDataAction<RequestData<T>>) => React.ReactNode[]` | - |
| onLoad | 数据加载完成后触发,会多次触发 | `(dataSource: T[]) => void` | - |
| tableClassName | 封装的 table 的 className | string | - |
| tableStyle | 封装的 table 的 style | CSSProperties | - |
| options | table 的默认操作，设置为 false 可以关闭它 | `{{ fullScreen: boolean \| function, reload: boolean \| function,setting: true }}` | `{ fullScreen: true, reload:true , setting: true }` |
| search | 是否显示搜索表单 | boolean | true |
| momentFormat | moment 的格式化方式 | `"string" \| "number" \| false` | string |
| beforeSearchSubmit | 搜索之前进行一些修改 | `(params:T)=>T` | - |

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

## valueType

- money 转化值为金额 eg. ¥10,000.26
- date 日期 eg. 2019-11-16
- dateTime 日期和时间 eg. 2019-11-16 12:50:00
- time 时间 eg. 12:50:00
- option 操作项，会自动增加 marginRight，只支持一个数组
- text 默认值，不做任何处理
- index 序号列
- indexBorder 带 border 的序号列

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
