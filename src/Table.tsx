import './index.less';

import React, { useEffect, CSSProperties, useRef, useState, ReactNode } from 'react';
import { Table, ConfigProvider, Card, Space, Typography, Empty, Tooltip } from 'antd';
import classNames from 'classnames';
import useMergeValue from 'use-merge-value';
import { stringify } from 'use-json-comparison';
import { ColumnsType, TablePaginationConfig, TableProps, ColumnType } from 'antd/es/table';
import { FormItemProps, FormProps, FormInstance } from 'antd/es/form';
import { ConfigConsumer, ConfigConsumerProps } from 'antd/lib/config-provider';

import { IntlProvider, IntlConsumer, IntlType } from './component/intlContext';
import useFetchData, { UseFetchDataAction, RequestData } from './useFetchData';
import Container from './container';
import Toolbar, { OptionConfig, ToolBarProps } from './component/toolBar';
import Alert from './component/alert';
import FormSearch, { SearchConfig, TableFormItem } from './Form';
import { StatusType } from './component/status';

import get, {
  parsingText,
  parsingValueEnumToArray,
  checkUndefinedOrNull,
  useDeepCompareEffect,
  genColumnKey,
} from './component/util';
import defaultRenderText, {
  ProColumnsValueType,
  ProColumnsValueTypeFunction,
} from './defaultRender';
import { DensitySize } from './component/toolBar/DensityIcon';
import ErrorBoundary from './component/ErrorBoundary';

type TableRowSelection = TableProps<any>['rowSelection'];

export interface ActionType {
  reload: (resetPageIndex?: boolean) => void;
  fetchMore: () => void;
  reset: () => void;
  clearSelected: () => void;
}

export interface ColumnsState {
  show?: boolean;
  fixed?: 'right' | 'left' | undefined;
}

export interface ProColumnType<T = unknown>
  extends Omit<ColumnType<T>, 'render' | 'children'>,
  Partial<Omit<FormItemProps, 'children'>> {
  index?: number;
  /**
   * 自定义 render
   */
  render?: (
    text: React.ReactNode,
    record: T,
    index: number,
    action: UseFetchDataAction<RequestData<T>>,
  ) => React.ReactNode | React.ReactNode[];

  /**
   * 自定义 render，但是需要返回 string
   */
  renderText?: (
    text: any,
    record: T,
    index: number,
    action: UseFetchDataAction<RequestData<T>>,
  ) => any;

  /**
   * 自定义搜索 form 的输入
   */
  renderFormItem?: (
    item: ProColumns<T>,
    config: {
      value?: any;
      onChange?: (value: any) => void;
      type: ProTableTypes;
      defaultRender: (newItem: ProColumns<any>) => JSX.Element | null;
    },
    form: Omit<FormInstance, 'scrollToField' | '__INTERNAL__'>,
  ) => JSX.Element | false | null;

  /**
   * 搜索表单的 props
   */
  formItemProps?: { [prop: string]: any };

  /**
   * 搜索表单的默认值
   */
  initialValue?: any;

  /**
   * 是否缩略
   */
  ellipsis?: boolean;
  /**
   * 是否拷贝
   */
  copyable?: boolean;

  /**
   * 值的类型
   */
  valueType?: ProColumnsValueType | ProColumnsValueTypeFunction<T>;

  /**
   * 值的枚举，如果存在枚举，Search 中会生成 select
   */
  valueEnum?: {
    [key: string]:
    | {
      text: ReactNode;
      status: StatusType;
    }
    | ReactNode;
  };

  /**
   * 在查询表单中隐藏
   */
  hideInSearch?: boolean;

  /**
   * 在 table 中隐藏
   */
  hideInTable?: boolean;

  /**
   * 在新建表单中删除
   */
  hideInForm?: boolean;

  /**
   * form 的排序
   */
  order?: number;
}

export interface ProColumnGroupType<RecordType> extends ProColumnType<RecordType> {
  children: ProColumns<RecordType>;
}

export type ProColumns<T> = ProColumnGroupType<T> | ProColumnType<T>;

// table 支持的变形，还未完全支持完毕
export type ProTableTypes = 'form' | 'list' | 'table' | 'cardList' | undefined;

export interface ProTableProps<T, U extends { [key: string]: any }>
  extends Omit<TableProps<T>, 'columns' | 'rowSelection'> {
  columns?: ProColumns<T>[];

  params?: U;

  columnsStateMap?: {
    [key: string]: ColumnsState;
  };

  onColumnsStateChange?: (map: { [key: string]: ColumnsState }) => void;

  onSizeChange?: (size: DensitySize) => void;

  /**
   * 一个获得 dataSource 的方法
   */
  request?: (
    params?: U & {
      pageSize?: number;
      current?: number;
    },
  ) => Promise<RequestData<T>>;

  /**
   * 对数据进行一些处理
   */
  postData?: (data: any[]) => any[];
  /**
   * 默认的数据
   */
  defaultData?: T[];

  /**
   * 初始化的参数，可以操作 table
   */
  actionRef?: React.MutableRefObject<ActionType | undefined> | ((actionRef: ActionType) => void);
  formRef?: TableFormItem<T>['formRef'];
  /**
   * 渲染操作栏
   */
  toolBarRender?: ToolBarProps<T>['toolBarRender'] | false;

  /**
   * 数据加载完成后触发
   */
  onLoad?: (dataSource: T[]) => void;

  /**
   * 数据加载失败时触发
   */
  onRequestError?: (e: Error) => void;

  /**
   * 给封装的 table 的 className
   */
  tableClassName?: string;

  /**
   * 给封装的 table 的 style
   */
  tableStyle?: CSSProperties;

  /**
   * 左上角的 title
   */
  headerTitle?: React.ReactNode;

  /**
   * 默认的操作栏配置
   */
  options?: OptionConfig<T> | false;
  /**
   * 是否显示搜索表单
   */
  search?: boolean | SearchConfig;

  /**
   * type="form" 和 搜索表单 的 Form 配置
   * 基本配置与 antd Form 相同
   *  但是劫持了 form 的配置
   */
  form?: Omit<FormProps, 'form'>;
  /**
   * 如何格式化日期
   * 暂时只支持 moment
   * string 会格式化为 YYYY-DD-MM
   * number 代表时间戳
   */
  dateFormatter?: 'string' | 'number' | false;
  /**
   * 格式化搜索表单提交数据
   */
  beforeSearchSubmit?: (params: Partial<T>) => Partial<T>;
  /**
   * 自定义 table 的 alert
   * 设置或者返回false 即可关闭
   */
  tableAlertRender?:
  | ((props: {
    intl: IntlType;
    selectedRowKeys: (string | number)[];
    selectedRows: T[];
  }) => React.ReactNode)
  | false;
  /**
   * 自定义 table 的 alert 的操作
   * 设置或者返回false 即可关闭
   */
  tableAlertOptionRender?:
  | ((props: { intl: IntlType; onCleanSelected: () => void }) => React.ReactNode)
  | false;

  rowSelection?: TableProps<T>['rowSelection'] | false;

  style?: React.CSSProperties;

  /**
   * 支持 ProTable 的类型
   */
  type?: ProTableTypes;

  /**
   * 提交表单时触发
   */
  onSubmit?: (params: U) => void;

  /**
   * 重置表单时触发
   */
  onReset?: () => void;
}

const mergePagination = <T extends any[], U>(
  pagination: TablePaginationConfig | boolean | undefined = {},
  action: UseFetchDataAction<RequestData<T>>,
): TablePaginationConfig | false | undefined => {
  if (pagination === false) {
    return {};
  }
  let defaultPagination: TablePaginationConfig | {} = pagination || {};
  const { current, pageSize } = action;
  if (pagination === true) {
    defaultPagination = {};
  }
  return {
    showTotal: (all, range) => `第 ${range[0]}-${range[1]} 条/总共 ${all} 条`,
    showSizeChanger: true,
    total: action.total,
    ...(defaultPagination as TablePaginationConfig),
    current,
    pageSize,
    onChange: (page: number, newPageSize?: number) => {
      // pageSize 改变之后就没必要切换页码
      if (newPageSize !== pageSize && current !== page) {
        action.setPageInfo({ pageSize, page });
      } else {
        if (newPageSize !== pageSize) {
          action.setPageInfo({ pageSize });
        }
        if (current !== page) {
          action.setPageInfo({ page });
        }
      }

      const { onChange } = pagination as TablePaginationConfig;
      if (onChange) {
        onChange(page, newPageSize || 20);
      }
    },

    onShowSizeChange: (page: number, showPageSize: number) => {
      action.setPageInfo({
        pageSize: showPageSize,
        page,
      });
      const { onShowSizeChange } = pagination as TablePaginationConfig;
      if (onShowSizeChange) {
        onShowSizeChange(page, showPageSize || 20);
      }
    },
  };
};

interface ColumRenderInterface<T> {
  item: ProColumns<T>;
  text: any;
  row: T;
  index: number;
}

/**
 * 生成 Ellipsis 的 tooltip
 * @param dom
 * @param item
 * @param text
 */
const genEllipsis = (dom: React.ReactNode, item: ProColumns<any>, text: string) => {
  if (!item.ellipsis) {
    return dom;
  }
  return (
    <Tooltip title={text}>
      <div>{dom}</div>
    </Tooltip>
  );
};

const genCopyable = (dom: React.ReactNode, item: ProColumns<any>) => {
  if (item.copyable || item.ellipsis) {
    return (
      <Typography.Paragraph
        style={{
          width: item.width && (item.width as number) - 32,
          margin: 0,
          padding: 0,
        }}
        copyable={item.copyable}
        ellipsis={item.ellipsis}
      >
        {dom}
      </Typography.Paragraph>
    );
  }
  return dom;
};

/**
 * 这个组件负责单元格的具体渲染
 * @param param0
 */
const columRender = <T, U = any>({ item, text, row, index }: ColumRenderInterface<T>): any => {
  const counter = Container.useContainer();
  const { action } = counter;
  const { renderText = (val: any) => val, valueEnum = {} } = item;
  if (!action.current) {
    return null;
  }

  const renderTextStr = renderText(parsingText(text, valueEnum), row, index, action.current);
  const textDom = defaultRenderText<T, {}>(renderTextStr, item.valueType || 'text', index, row);

  const dom: React.ReactNode = genEllipsis(
    genCopyable(textDom, item),
    item,
    renderText(parsingText(text, valueEnum, true), row, index, action.current),
  );

  if (item.render) {
    const renderDom = item.render(dom, row, index, action.current);

    // 如果是合并单元格的，直接返回对象
    if (
      renderDom &&
      typeof renderDom === 'object' &&
      (renderDom as { props: { colSpan: number } }).props &&
      (renderDom as { props: { colSpan: number } }).props.colSpan
    ) {
      return renderDom;
    }

    if (renderDom && item.valueType === 'option' && Array.isArray(renderDom)) {
      return <Space>{renderDom}</Space>;
    }
    return renderDom as React.ReactNode;
  }
  return checkUndefinedOrNull(dom) ? dom : null;
};

const genColumnList = <T, U = {}>(
  columns: ProColumns<T>[],
  map: {
    [key: string]: ColumnsState;
  },
): (ColumnsType<T>[number] & { index?: number })[] =>
  (columns
    .map((item, columnsIndex) => {
      const { key, dataIndex } = item;
      const columnKey = genColumnKey(key, dataIndex, columnsIndex);
      const config = columnKey ? map[columnKey] || { fixed: item.fixed } : { fixed: item.fixed };
      const tempColumns = {
        onFilter: (value: string, record: T) => {
          let recordElement = get(record, item.dataIndex || '');
          if (typeof recordElement === 'number') {
            recordElement = recordElement.toString();
          }
          const itemValue = String(recordElement || '') as string;
          return String(itemValue) === String(value);
        },
        index: columnsIndex,
        filters: parsingValueEnumToArray(item.valueEnum).filter(
          (valueItem) => valueItem && valueItem.value !== 'all',
        ),
        ...item,
        ellipsis: false,
        fixed: config.fixed,
        width: item.width || (item.fixed ? 200 : undefined),
        // @ts-ignore
        children: item.children ? genColumnList(item.children, map) : undefined,
        render: (text: any, row: T, index: number) => columRender<T>({ item, text, row, index }),
      };
      if (!tempColumns.children || !tempColumns.children.length) {
        delete tempColumns.children;
      }
      if (!tempColumns.dataIndex) {
        delete tempColumns.dataIndex;
      }
      if (!tempColumns.filters || !tempColumns.filters.length) {
        delete tempColumns.filters;
      }
      return tempColumns;
    })
    .filter((item) => !item.hideInTable) as unknown) as ColumnsType<T>[number] &
  {
    index?: number;
  }[];

/**
 * 🏆 Use Ant Design Table like a Pro!
 * 更快 更好 更方便
 * @param props
 */
const ProTable = <T extends {}, U extends object>(
  props: ProTableProps<T, U> & {
    defaultClassName: string;
  },
) => {
  const {
    request,
    className: propsClassName,
    params = {},
    defaultData = [],
    headerTitle,
    postData,
    pagination: propsPagination,
    actionRef,
    columns: propsColumns = [],
    toolBarRender = () => [],
    onLoad,
    onRequestError,
    style,
    tableStyle,
    tableClassName,
    columnsStateMap,
    onColumnsStateChange,
    options,
    search = true,
    rowSelection: propsRowSelection = false,
    beforeSearchSubmit = (searchParams: Partial<U>) => searchParams,
    tableAlertRender,
    defaultClassName,
    formRef,
    type = 'table',
    onReset = () => { },
    ...rest
  } = props;

  const [selectedRowKeys, setSelectedRowKeys] = useMergeValue<React.ReactText[]>([], {
    value: propsRowSelection ? propsRowSelection.selectedRowKeys : undefined,
  });
  const [formSearch, setFormSearch] = useState<{}>({});
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [dataSource, setDataSource] = useState<T[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const fullScreen = useRef<() => void>();

  /**
   * 需要初始化 不然默认可能报错
   * 这里取了 defaultCurrent 和 current
   * 为了保证不会重复刷新
   */
  const fetchPagination =
    typeof propsPagination === 'object'
      ? (propsPagination as TablePaginationConfig)
      : { defaultCurrent: 1, defaultPageSize: 20, pageSize: 20, current: 1 };

  const action = useFetchData(
    async ({ pageSize, current }) => {
      if (!request) {
        return {
          data: props.dataSource || [],
          success: true,
        } as RequestData<T>;
      }
      const msg = await request({ current, pageSize, ...formSearch, ...params } as U);
      if (postData) {
        return { ...msg, data: postData(msg.data) };
      }
      return msg;
    },
    defaultData,
    {
      defaultCurrent: fetchPagination.current || fetchPagination.defaultCurrent,
      defaultPageSize: fetchPagination.pageSize || fetchPagination.defaultPageSize,
      onLoad,
      onRequestError,
      effects: [stringify(params), stringify(formSearch)],
    },
  );

  useEffect(() => {
    fullScreen.current = () => {
      if (!rootRef.current || !document.fullscreenEnabled) {
        return;
      }
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        rootRef.current.requestFullscreen();
      }
    };
  }, [rootRef.current]);

  action.fullScreen = fullScreen.current;

  const pagination = propsPagination !== false && mergePagination<T[], {}>(propsPagination, action);

  const counter = Container.useContainer();

  const onCleanSelected = () => {
    if (propsRowSelection && propsRowSelection.onChange) {
      propsRowSelection.onChange([], []);
    }
    setSelectedRowKeys([]);
    setSelectedRows([]);
  };

  useEffect(() => {
    // 数据源更新时 取消所有选中项
    onCleanSelected();
    setDataSource(request ? (action.dataSource as T[]) : props.dataSource || []);
  }, [props.dataSource, action.dataSource]);

  /**
   *  保存一下 propsColumns
   *  生成 form 需要用
   */
  useDeepCompareEffect(() => {
    counter.setProColumns(propsColumns);
  }, [propsColumns]);

  counter.setAction(action);

  /**
   * 这里生成action的映射，保证 action 总是使用的最新
   * 只需要渲染一次即可
   */
  useEffect(() => {
    const userAction: ActionType = {
      reload: async (resetPageIndex?: boolean) => {
        const {
          action: { current },
        } = counter;
        if (!current) {
          return;
        }
        // reload 之后大概率会切换数据，清空一下选择。
        setSelectedRowKeys([]);
        // 如果为 true，回到第一页
        if (resetPageIndex) {
          await current.resetPageIndex();
        }

        await current.reload();
      },
      fetchMore: async () => {
        const {
          action: { current },
        } = counter;
        if (!current) {
          return;
        }
        await current.fetchMore();
      },
      reset: () => {
        const {
          action: { current },
        } = counter;
        if (!current) {
          return;
        }
        current.reset();
      },
      clearSelected: onCleanSelected,
    };
    if (actionRef && typeof actionRef === 'function') {
      actionRef(userAction);
    }
    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = userAction;
    }
  }, []);

  /**
   * Table Column 变化的时候更新一下，这个参数将会用于渲染
   */
  useDeepCompareEffect(() => {
    const tableColumn = genColumnList<T>(propsColumns, counter.columnsMap);
    if (tableColumn && tableColumn.length > 0) {
      counter.setColumns(tableColumn);
      // 重新生成key的字符串用于排序
      counter.setSortKeyColumns(
        tableColumn.map((item, index) => {
          const key =
            genColumnKey(item.key, (item as ProColumnType).dataIndex, index) || `${index}`;
          return `${key}_${item.index}`;
        }),
      );
    }
  }, [propsColumns]);

  /**
   * 这里主要是为了排序，为了保证更新及时，每次都重新计算
   */
  useDeepCompareEffect(() => {
    const keys = counter.sortKeyColumns.join(',');
    let tableColumn = genColumnList<T>(propsColumns, counter.columnsMap);
    if (keys.length > 0) {
      // 用于可视化的排序
      tableColumn = tableColumn.sort((a, b) => {
        const { fixed: aFixed, index: aIndex } = a;
        const { fixed: bFixed, index: bIndex } = b;
        if (
          (aFixed === 'left' && bFixed !== 'left') ||
          (bFixed === 'right' && aFixed !== 'right')
        ) {
          return -2;
        }
        if (
          (bFixed === 'left' && aFixed !== 'left') ||
          (aFixed === 'right' && bFixed !== 'right')
        ) {
          return 2;
        }
        // 如果没有index，在 dataIndex 或者 key 不存在的时候他会报错
        const aKey = `${genColumnKey(a.key, (a as ProColumnType).dataIndex, aIndex)}_${aIndex}`;
        const bKey = `${genColumnKey(b.key, (b as ProColumnType).dataIndex, bIndex)}_${bIndex}`;
        return keys.indexOf(aKey) - keys.indexOf(bKey);
      });
    }
    if (tableColumn && tableColumn.length > 0) {
      counter.setColumns(tableColumn);
    }
  }, [counter.columnsMap, counter.sortKeyColumns.join('-')]);

  /**
   * 同步 Pagination，支持受控的 页码 和 pageSize
   */
  useDeepCompareEffect(() => {
    if (propsPagination && propsPagination.current && propsPagination.pageSize) {
      action.setPageInfo({
        pageSize: propsPagination.pageSize,
        page: propsPagination.current,
      });
    }
  }, [propsPagination]);

  // 映射 selectedRowKeys 与 selectedRow
  useEffect(() => {
    if (action.loading !== false || propsRowSelection === false) {
      return;
    }
    const tableKey = rest.rowKey;

    // dataSource maybe is a null
    // eg: api has 404 error
    const selectedRow = Array.isArray(dataSource)
      ? dataSource.filter((item, index) => {
        if (!tableKey) {
          return (selectedRowKeys as any).includes(index);
        }
        if (typeof tableKey === 'function') {
          const key = tableKey(item, index);
          return (selectedRowKeys as any).includes(key);
        }
        return (selectedRowKeys as any).includes(item[tableKey]);
      })
      : [];

    setSelectedRows(selectedRow);
  }, [selectedRowKeys.join('-'), action.loading, propsRowSelection === false]);

  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    ...propsRowSelection,
    onChange: (keys, rows) => {
      if (propsRowSelection && propsRowSelection.onChange) {
        propsRowSelection.onChange(keys, rows);
      }
      setSelectedRowKeys(keys);
    },
  };

  useEffect(() => {
    counter.setTableSize(rest.size || 'middle');
  }, [rest.size]);

  if (counter.columns.length < 1) {
    return (
      <Card bordered={false} bodyStyle={{ padding: 50 }}>
        <Empty />
      </Card>
    );
  }

  const className = classNames(defaultClassName, propsClassName);
  return (
    <ConfigProvider
      getPopupContainer={() => ((rootRef.current || document.body) as any) as HTMLElement}
    >
      <div className={className} id="ant-design-pro-table" style={style} ref={rootRef}>
        {(search || type === 'form') && (
          <FormSearch<U>
            {...rest}
            type={props.type}
            formRef={formRef}
            onSubmit={(value) => {
              if (type !== 'form') {
                setFormSearch(
                  beforeSearchSubmit({
                    ...value,
                    _timestamp: Date.now(),
                  }),
                );
                // back first page
                action.resetPageIndex();
              }

              if (props.onSubmit) {
                props.onSubmit(value);
              }
            }}
            onReset={() => {
              setFormSearch(beforeSearchSubmit({}));
              // back first page
              action.resetPageIndex();
              onReset();
            }}
            dateFormatter={rest.dateFormatter}
            search={search}
          />
        )}

        {type !== 'form' && (
          <Card
            bordered={false}
            style={{
              height: '100%',
            }}
            bodyStyle={{
              padding: 0,
            }}
          >
            {toolBarRender !== false && (options !== false || headerTitle || toolBarRender) && (
              // if options= false & headerTitle=== false, hide Toolbar
              <Toolbar<T>
                options={options}
                headerTitle={headerTitle}
                action={action}
                selectedRows={selectedRows}
                selectedRowKeys={selectedRowKeys}
                toolBarRender={toolBarRender}
              />
            )}
            {propsRowSelection !== false && (
              <Alert<T>
                selectedRowKeys={selectedRowKeys}
                selectedRows={selectedRows}
                onCleanSelected={onCleanSelected}
                alertOptionRender={rest.tableAlertOptionRender}
                alertInfoRender={tableAlertRender}
              />
            )}
            <Table<T>
              {...rest}
              size={counter.tableSize}
              rowSelection={propsRowSelection === false ? undefined : rowSelection}
              className={tableClassName}
              style={tableStyle}
              columns={counter.columns.filter((item) => {
                // 删掉不应该显示的
                const { key, dataIndex } = item;
                const columnKey = genColumnKey(key, dataIndex);
                if (!columnKey) {
                  return true;
                }
                const config = counter.columnsMap[columnKey];
                if (config && config.show === false) {
                  return false;
                }
                return true;
              })}
              loading={action.loading || props.loading}
              dataSource={dataSource}
              pagination={pagination}
            />
          </Card>
        )}
      </div>
    </ConfigProvider>
  );
};

/**
 * 🏆 Use Ant Design Table like a Pro!
 * 更快 更好 更方便
 * @param props
 */
const ProviderWarp = <T, U extends { [key: string]: any } = {}>(props: ProTableProps<T, U>) => (
  <Container.Provider initialState={props}>
    <ConfigConsumer>
      {({ getPrefixCls }: ConfigConsumerProps) => (
        <IntlConsumer>
          {(value) => (
            <IntlProvider value={value}>
              <ErrorBoundary>
                <ProTable defaultClassName={getPrefixCls('pro-table')} {...props} />
              </ErrorBoundary>
            </IntlProvider>
          )}
        </IntlConsumer>
      )}
    </ConfigConsumer>
  </Container.Provider>
);

export default ProviderWarp;
