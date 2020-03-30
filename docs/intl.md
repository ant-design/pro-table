---
title: 国际化
order: 8
sidemenu: false
nav:
  title: 国际化
  order: 2
---

# 国际化

ProTable 内置了国际化的支持，作为一个文本量比较少的组件，我们可以自行实现国际化，成本也很低。

## 代码示例

全量的文本

```typescript | prue
const enLocale = {
  tableFrom: {
    search: 'Query',
    reset: 'Reset',
    submit: 'Submit',
    collapsed: 'Expand',
    expand: 'Collapse',
    inputPlaceholder: 'Please enter',
    selectPlaceholder: 'Please select',
  },
  alert: {
    clear: 'Clear',
  },
  tableToolBar: {
    leftPin: 'Pin to left',
    rightPin: 'Pin to right',
    noPin: 'Unpinned',
    leftFixedTitle: 'Fixed the left',
    rightFixedTitle: 'Fixed the right',
    noFixedTitle: 'Not Fixed',
    reset: 'Reset',
    columnDisplay: 'Column Display',
    columnSetting: 'Settings',
    fullScreen: 'Full Screen',
    exitFullScreen: 'Exit Full Screen',
    reload: 'Refresh',
    density: 'Density',
    densityDefault: 'Default',
    densityLarger: 'Larger',
    densityMiddle: 'Middle',
    densitySmall: 'Compact',
  },
};

// 生成 intl 对象
const enUSIntl = createIntl('en_US', enUS);

// 使用
<IntlProvider value={enUSIntl}>
  <ProTable />
</IntlProvider>;
```

# Demo 列表

### English

<code src="./example/english.tsx" />

### Italiano

<code src="./example/italian.tsx" />

### Tiếng Việt

<code src="./example/vietnamese.tsx" />

### 日本語

<code src="./example/japanese.tsx" />

### Русский

<code src="./example/russian.tsx" />

## Malay

<code src="./example/malay.tsx" />
