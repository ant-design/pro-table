import './index.less';

import React, { useEffect, CSSProperties, useRef, useState, ReactNode } from 'react';
import { Table, ConfigProvider, Card, Typography, Empty, Tooltip } from 'antd';
import classNames from 'classnames';
import useMergeValue from 'use-merge-value';
import { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table';
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

type TableRowSelection = TableProps<any>['rowSelection'];

export interface ActionType {
  reload: () => void;
  fetchMore: () => void;
  reset: () => void;
}

export interface ColumnsState {
  show?: boolean;
  fixed?: 'right' | 'left' | undefined;
}

export interface ProColumns<T = unknown>
  extends Omit<ColumnsType<T>[number], 'render' | 'children'> {
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
  ) => string;

  /**
   * 自定义搜索 form 的输入
   */
  renderFormItem?: (
    item: ProColumns<T>,
    config: { value?: any; onChange?: (value: any) => void },
  ) => React.ReactNode;

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

  children?: ProColumns<T>[];

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
   * from 的排序
   */
  order?: number;
}

export interface ProTableProps<T> extends Omit<TableProps<T>, 'columns' | 'rowSelection'> {
  columns?: ProColumns<T>[];
  params?: { [key: string]: any };

  columnsStateMap?: {
    [key: string]: ColumnsState;
  };
  onColumnsStateChange?: (map: { [key: string]: ColumnsState }) => void;

  onSizeChange?: (size: DensitySize) => void;

  /**
   * 一个获得 dataSource 的方法
   */
  request?: (params?: {
    pageSize?: number;
    current?: number;
    [key: string]: any;
  }) => Promise<RequestData<T>>;
  /**
   * 一个获得 dataSource 的方法
   */
  url?: (params?: {
    pageSize: number;
    current: number;
    [key: string]: any;
  }) => Promise<RequestData<T>>;
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
  options?: OptionConfig<T>;
  /**
   * 是否显示搜索表单
   */
  search?: boolean | SearchConfig;
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
  tableAlertRender?: (keys: (string | number)[], rows: T[]) => React.ReactNode;
  /**
   * 自定义 table 的 alert 的操作
   * 设置或者返回false 即可关闭
   */
  tableAlertOptionRender?:
    | ((props: { intl: IntlType; onCleanSelected: () => void }) => React.ReactNode)
    | false;
  rowSelection?: TableProps<T>['rowSelection'] | false;

  style?: React.CSSProperties;
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
        onChange(page, newPageSize || 10);
      }
    },
    onShowSizeChange: (page: number, showPageSize: number) => {
      action.setPageInfo({
        pageSize: showPageSize,
        page,
      });
      const { onShowSizeChange } = pagination as TablePaginationConfig;
      if (onShowSizeChange) {
        onShowSizeChange(page, showPageSize || 10);
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
      <Typography.Text
        style={{
          width: (item.width as number) - 32,
        }}
        copyable={item.copyable}
        ellipsis={item.ellipsis}
      >
        {dom}
      </Typography.Text>
    );
  }
  return dom;
};

const ColumRender = <T, U = any>({ item, text, row, index }: ColumRenderInterface<T>): any => {
  const counter = Container.useContainer();
  const { action } = counter;
  const { renderText = (val: any) => val, valueEnum = {} } = item;
  if (!action.current) {
    return null;
  }

  const renderTextStr = renderText(parsingText(text, valueEnum), row, index, action.current);
  const textDom = defaultRenderText<T, {}>(renderTextStr, item.valueType || 'text', index, row);

  const dom: React.ReactNode = genEllipsis(genCopyable(textDom, item), item, text);

  if (item.render) {
    const renderDom = item.render(dom, row, index, action.current);
    if (renderDom && item.valueType === 'option' && Array.isArray(renderDom)) {
      return (
        <div className="ant-pro-table-option-cell">
          {renderDom.map((optionDom, domIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <div className="ant-pro-table-option-cell-item" key={`${index}-${domIndex}`}>
              {optionDom}
            </div>
          ))}
        </div>
      );
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
  columns
    .map((item, columnsIndex) => {
      const { key, dataIndex } = item;
      const columnKey = genColumnKey(key, dataIndex);
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
          valueItem => valueItem && valueItem.value !== 'all',
        ),
        ...item,
        ellipsis: false,
        fixed: config.fixed,
        width: item.width || (item.fixed ? 200 : undefined),
        children: item.children ? genColumnList(item.children, map) : undefined,
        render: (text: any, row: T, index: number) => (
          <ColumRender<T> item={item} text={text} row={row} index={index} />
        ),
      };
      if (!tempColumns.children || !tempColumns.children.length) {
        delete tempColumns.children;
      }
      if (!tempColumns.filters || !tempColumns.filters.length) {
        delete tempColumns.filters;
      }
      return tempColumns;
    })
    .filter(item => !item.hideInTable);

/**
 * 🏆 Use Ant Design Table like a Pro!
 * 更快 更好 更方便
 * @param props
 */
const ProTable = <T extends {}, U = {}>(
  props: ProTableProps<T> & {
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
    url,
    columnsStateMap,
    onColumnsStateChange,
    options,
    search = true,
    rowSelection: propsRowSelection = false,
    beforeSearchSubmit = (searchParams: Partial<U>) => searchParams,
    tableAlertRender,
    defaultClassName,
    formRef,
    ...reset
  } = props;

  const [formSearch, setFormSearch] = useState<{}>({});

  /**
   * 需要初始化 不然默认可能报错
   */
  const { defaultCurrent, defaultPageSize } =
    typeof propsPagination === 'object'
      ? (propsPagination as TablePaginationConfig)
      : { defaultCurrent: 1, defaultPageSize: 10 };

  const action = useFetchData(
    async ({ pageSize, current }) => {
      const tempRequest = request || url;
      if (!tempRequest) {
        return {
          data: props.dataSource || [],
          success: true,
        } as RequestData<T>;
      }
      const msg = await tempRequest({ current, pageSize, ...formSearch, ...params });
      if (postData) {
        return { ...msg, data: postData(msg.data) };
      }
      return msg;
    },
    defaultData,
    {
      defaultCurrent,
      defaultPageSize,
      onLoad,
      onRequestError,
      effects: [
          params,
          formSearch
      ],
    },
  );

  const rootRef = useRef<HTMLDivElement>(null);

  const fullScreen = useRef<() => void>();
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

  /**
   *  保存一下 propsColumns
   *  生成 from 需要用
   */
  useDeepCompareEffect(() => {
    counter.setProColumns(propsColumns);
  }, propsColumns);

  counter.setAction(action);

  useEffect(() => {
    const userAction: ActionType = {
      reload: async () => {
        const {
          action: { current },
        } = counter;
        if (!current) {
          return;
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
    };
    if (actionRef && typeof actionRef === 'function') {
      actionRef(userAction);
    }
    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = userAction;
    }
  }, []);

  /**
   * tableColumn 变化的时候更新一下，这个参数将会用于渲染
   */
  useDeepCompareEffect(() => {
    const keys = counter.sortKeyColumns.join('-');
    let tableColumn = genColumnList<T>(propsColumns, counter.columnsMap);
    if (keys.length > 0) {
      // 用于可视化的排序
      tableColumn = tableColumn.sort((a, b) => {
        // 如果没有index，在 dataIndex 或者 key 不存在的时候他会报错
        const aKey = `${genColumnKey(a.key, a.dataIndex) || a.index}`;
        const bKey = `${genColumnKey(b.key, b.dataIndex) || b.index}`;
        return keys.indexOf(aKey) - keys.indexOf(bKey);
      });
    }
    if (tableColumn && tableColumn.length > 0) {
      counter.setColumns(tableColumn);
      if (keys.length < 1) {
        counter.setSortKeyColumns(
          tableColumn.map((item, index) => genColumnKey(item.key, item.dataIndex) || `${index}`),
        );
      }
    }
  }, [propsColumns, counter.columnsMap, counter.sortKeyColumns.join('-')]);

  const [selectedRowKeys, setSelectedRowKeys] = useMergeValue<React.ReactText[]>([], {
    value: propsRowSelection ? propsRowSelection.selectedRowKeys : undefined,
  });
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  // 映射 selectedRowKeys 与 selectedRow
  useEffect(() => {
    if (action.loading !== false || propsRowSelection === false) {
      return;
    }
    const tableKey = reset.rowKey;
    setSelectedRows(
      ((action.dataSource as T[]) || []).filter((item, index) => {
        if (!tableKey) {
          return (selectedRowKeys as any).includes(index);
        }
        if (typeof tableKey === 'function') {
          const key = tableKey(item, index);
          return (selectedRowKeys as any).includes(key);
        }
        return (selectedRowKeys as any).includes(item[tableKey]);
      }),
    );
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
    counter.setTableSize(reset.size || 'large');
  }, [reset.size]);

  if (counter.columns.length < 1) {
    return <Empty />;
  }

  const className = classNames(defaultClassName, propsClassName);
  return (
    <ConfigProvider
      getPopupContainer={() => ((rootRef.current || document.body) as any) as HTMLElement}
    >
      <div className={className} id="ant-design-pro-table" style={style} ref={rootRef}>
        {search && (
          <FormSearch<U>
            formRef={formRef}
            onSubmit={value => {
              setFormSearch(beforeSearchSubmit(value));
              // back first page
              action.resetPageIndex();
            }}
            onReset={() => {
              setFormSearch(beforeSearchSubmit({}));
              // back first page
              action.resetPageIndex();
            }}
            dateFormatter={reset.dateFormatter}
            search={search}
          />
        )}
        <Card
          bordered={false}
          style={{
            height: '100%',
          }}
          bodyStyle={{
            padding: 0,
          }}
        >
          {toolBarRender !== false && (
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
              onCleanSelected={() => {
                if (propsRowSelection && propsRowSelection.onChange) {
                  propsRowSelection.onChange([], []);
                }
                setSelectedRowKeys([]);
                setSelectedRows([]);
              }}
              alertOptionRender={reset.tableAlertOptionRender}
              alertIInfoRender={tableAlertRender}
            />
          )}
          <Table<T>
            {...reset}
            size={counter.tableSize}
            rowSelection={propsRowSelection === false ? undefined : rowSelection}
            className={tableClassName}
            style={tableStyle}
            columns={counter.columns.filter(item => {
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
            dataSource={request || url ? (action.dataSource as T[]) : reset.dataSource}
            pagination={pagination}
          />
        </Card>
      </div>
    </ConfigProvider>
  );
};

/**
 * 🏆 Use Ant Design Table like a Pro!
 * 更快 更好 更方便
 * @param props
 */
const ProviderWarp = <T, U = {}>(props: ProTableProps<T>) => (
  <Container.Provider initialState={props}>
    <ConfigConsumer>
      {({ getPrefixCls }: ConfigConsumerProps) => (
        <IntlConsumer>
          {value => (
            <IntlProvider value={value}>
              <ProTable defaultClassName={getPrefixCls('pro-table')} {...props} />
            </IntlProvider>
          )}
        </IntlConsumer>
      )}
    </ConfigConsumer>
  </Container.Provider>
);

export default ProviderWarp;
