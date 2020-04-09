---
title: 批量操作
order: 6
sidemenu: false
nav:
  title: 批量操作
  order: 5
---

# 批量操作

与 antd 相同，批量操作需要设置 `rowSelection` 来开启，与 antd 不同的是，pro-table 提供了一个 alert 用于承载一些信息。你可以通过 `tableAlertRender` 来对它进行自定义。设置或者返回 false 即可关闭。

## 相关 API

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| tableAlertRender | 渲染 alert，当配置 `rowSelection`打开。 | `(keys:string[],rows:T[]) => React.ReactNode[]` | `已选择 ${selectedRowKeys.length} 项` |
| rowSelection | 表格行是否可选择，[配置项](https://ant.design/components/table-cn/#rowSelection) | object | false |

## Demo

<code src="./demo/batchOption.tsx" />
