import './index.less';

import React, { useEffect, CSSProperties, useRef, useState, ReactNode } from 'react';
import { Table, Card, Typography, Empty, Tooltip } from 'antd';
import classNames from 'classnames';
import useMergeValue from 'use-merge-value';
import moment from 'moment';
import { ColumnProps, PaginationConfig, TableProps, TableRowSelection } from 'antd/es/table';
import useFetchData, { UseFetchDataAction, RequestData } from './useFetchData';
import Container, { ColumnsMapItem } from './container';
import IndexColumn from './component/indexColumn';
import Toolbar, { OptionsType, ToolBarProps } from './component/toolBar';
import Alert from './component/alert';
import FormSearch from './Form';
import { StatusType } from './component/status';
import { parsingText, parsingValueEnumToArray } from './component/util';

/**
 * money 金额
 * option 操作 需要返回一个数组
 * date 日期 YYYY-MM-DD
 * dateTime 日期和时间 YYYY-MM-DD HH:mm:SS
 * time: 时间 HH:mm:SS
 */
export type ProColumnsValueType =
  | 'money'
  | 'option'
  | 'date'
  | 'dateTime'
  | 'time'
  | 'text'
  | 'index'
  | 'indexBorder';

export interface ProColumns<T = unknown> extends Omit<ColumnProps<T>, 'render' | 'children'> {
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
  valueType?: ProColumnsValueType;

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
  onPostAction?: (action: {
    fetch: () => Promise<void>;
    reload: () => Promise<void>;
    fetchMore: () => void;
  }) => void;

  /**
   * 渲染操作栏
   */
  toolBarRender?: ToolBarProps<T>['toolBarRender'];

  /**
   * 数据加载完成后触发
   */
  onLoad?: (dataSource: T[]) => void;

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
  options?: {
    fullScreen: OptionsType<T>;
    reload: OptionsType<T>;
    setting: boolean;
  };
  /**
   * 是否显示搜索表单
   */
  search?: boolean;
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

  rowSelection?: TableProps<T>['rowSelection'] | false;

  style?: React.CSSProperties;
}

const mergePagination = <T extends any[], U>(
  pagination: PaginationConfig | boolean | undefined = {},
  action: UseFetchDataAction<RequestData<T>>,
): PaginationConfig | false | undefined => {
  if (pagination === false) {
    return {};
  }
  let defaultPagination: PaginationConfig | {} = pagination || {};
  const { current, pageSize } = action;
  if (pagination === true) {
    defaultPagination = {};
  }
  return {
    total: action.total,
    ...(defaultPagination as PaginationConfig),
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

      const { onChange } = pagination as PaginationConfig;
      if (onChange) {
        onChange(page, newPageSize || 10);
      }
    },
    onShowSizeChange: (page: number, showPageSize: number) => {
      action.setPageInfo({
        pageSize: showPageSize,
        page,
      });
      const { onShowSizeChange } = pagination as PaginationConfig;
      if (onShowSizeChange) {
        onShowSizeChange(page, showPageSize || 10);
      }
    },
  };
};

const moneyIntl = new Intl.NumberFormat('zh-Hans-CN', {
  currency: 'CNY',
  style: 'currency',
  minimumFractionDigits: 2,
});
/**
 * 根据不同的类型来转化数值
 * @param text
 * @param valueType
 */
const defaultRenderText = (
  text: string | number,
  valueType: ProColumnsValueType,
  index: number,
) => {
  /**
   * 如果是金额的值
   */
  if (valueType === 'money' && (text || text === 0)) {
    /**
     * 这个 api 支持三星和华为的手机
     */
    if (typeof text === 'string') {
      return moneyIntl.format(parseFloat(text));
    }
    return moneyIntl.format(text);
  }

  /**
   *如果是日期的值
   */
  if (valueType === 'date' && text) {
    return moment(text).format('YYYY-MM-DD');
  }

  /**
   *如果是日期加时间类型的值
   */
  if (valueType === 'dateTime' && text) {
    return moment(text).format('YYYY-MM-DD HH:mm:SS');
  }

  /**
   *如果是时间类型的值
   */
  if (valueType === 'time' && text) {
    return moment(text).format('HH:mm:SS');
  }

  if (valueType === 'index') {
    return <IndexColumn>{index + 1}</IndexColumn>;
  }

  if (valueType === 'indexBorder') {
    return <IndexColumn border>{index + 1}</IndexColumn>;
  }

  return text;
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
    <Tooltip
      getPopupContainer={() =>
        ((document.getElementById('ant-design-pro-table') || document.body) as any) as HTMLElement
      }
      title={text}
    >
      {dom}
    </Tooltip>
  );
};

const genCopyable = (dom: React.ReactNode, item: ProColumns<any>) => {
  if (item.copyable || item.ellipsis) {
    return (
      <Typography.Text
        style={{
          width: item.width,
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
  if (!action) {
    return null;
  }

  const renderTextStr = renderText(parsingText(text, valueEnum), row, index, action);
  const textDom = defaultRenderText(renderTextStr, item.valueType || 'text', index);

  const dom: React.ReactNode = genEllipsis(genCopyable(textDom, item), item, text);

  if (item.render) {
    const renderDom = item.render(dom, row, index, action);
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
  return (dom as React.ReactNode) || null;
};

const genColumnList = <T, U = {}>(
  columns: ProColumns<T>[],
  action: UseFetchDataAction<RequestData<T>>,
  map: {
    [key: string]: ColumnsMapItem;
  },
): ColumnProps<T>[] =>
  columns
    .map((item, columnsIndex) => {
      const { key, dataIndex } = item;
      const columnKey = `${key || ''}-${dataIndex || ''}`;
      const config = map[columnKey] || { fixed: item.fixed };
      return {
        onFilter: (value: string, record: T) => {
          const itemValue = String(record[item.dataIndex || ''] || '') as string;
          return String(itemValue) === String(value);
        },
        index: columnsIndex,
        filters: parsingValueEnumToArray(item.valueEnum),
        ...item,
        fixed: config.fixed,
        width: item.width || (item.fixed ? 200 : undefined),
        children: item.children ? genColumnList(item.children, action, map) : undefined,
        ellipsis: false,
        render: (text: any, row: T, index: number) => (
          <ColumRender<T> item={item} text={text} row={row} index={index} />
        ),
      };
    })
    .filter(item => !item.hideInTable);

/**
 * 🏆 Use Ant Design Table like a Pro!
 * 更快 更好 更方便
 * @param props
 */
const ProTable = <T, U = {}>(props: ProTableProps<T>) => {
  const {
    request,
    className: propsClassName,
    params = {},
    defaultData = [],
    headerTitle,
    postData,
    pagination: propsPagination,
    onPostAction,
    columns: propsColumns = [],
    toolBarRender = () => [],
    onLoad,
    style,
    tableStyle,
    tableClassName,
    url,
    options,
    search = true,
    rowSelection: propsRowSelection = false,
    beforeSearchSubmit = (searchParams: any) => searchParams,
    tableAlertRender,
    ...reset
  } = props;

  const [formSearch, setFormSearch] = useState<{}>({});

  /**
   * 需要初始化 不然默认可能报错
   */
  const { defaultCurrent, defaultPageSize } =
    typeof propsPagination === 'object'
      ? (propsPagination as PaginationConfig)
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
      const msg = await tempRequest({ current, pageSize, ...params, ...formSearch });
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
      effects: [
        Object.values(params)
          .filter(item => item)
          .join('-'),
        Object.values(formSearch)
          .filter(item => item)
          .join('-'),
      ],
    },
  );

  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onPostAction) {
      onPostAction({
        reload: action.reload,
        fetch: action.fetch,
        fetchMore: action.fetchMore,
      });
    }
  }, [
    action.pageSize,
    action.current,
    action.total,
    Object.values(params)
      .filter(item => item)
      .join('-'),
    Object.values(formSearch)
      .filter(item => item)
      .join('-'),
  ]);

  useEffect(() => {
    action.fullScreen = () => {
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

  const pagination = mergePagination<T[], {}>(propsPagination, action);

  const className = classNames('ant-pro-table', propsClassName);
  const counter = Container.useContainer();
  /**
   *  保存一下 propsColumns
   *  生成 from 需要用
   */
  useEffect(() => {
    counter.setAction(action);
    counter.setProColumns(propsColumns);
  }, [JSON.stringify(propsColumns)]);

  const tableColumn = genColumnList<T>(propsColumns, action, counter.columnsMap);

  /**
   * tableColumn 变化的时候更新一下，这个参数将会用于渲染
   */
  useEffect(() => {
    if (tableColumn && tableColumn.length > 0) {
      counter.setColumns(tableColumn);
    }
  }, [JSON.stringify(tableColumn)]);

  const [selectedRowKeys, setSelectedRowKeys] = useMergeValue<string[] | number[]>([], {
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

  const rowSelection: TableRowSelection<T> = {
    selectedRowKeys,
    ...propsRowSelection,
    onChange: (keys, rows) => {
      if (propsRowSelection && propsRowSelection.onChange) {
        propsRowSelection.onChange(keys, rows);
      }
      setSelectedRowKeys(keys);
    },
  };

  if (counter.columns.length < 1) {
    return <Empty />;
  }

  return (
    <div className={className} id="ant-design-pro-table" style={style} ref={rootRef}>
      {search && (
        <FormSearch
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
        <Toolbar<T>
          options={options}
          headerTitle={headerTitle}
          action={action}
          selectedRows={selectedRows}
          selectedRowKeys={selectedRowKeys}
          toolBarRender={toolBarRender}
        />
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
            renderInfo={tableAlertRender}
          />
        )}
        <Table
          {...reset}
          rowSelection={propsRowSelection === false ? undefined : rowSelection}
          className={tableClassName}
          style={tableStyle}
          columns={counter.columns.filter(item => {
            // 删掉不应该显示的
            const { key, dataIndex } = item;
            const columnKey = `${key || ''}-${dataIndex || ''}`;
            const config = counter.columnsMap[columnKey];
            if (config && config.show === false) {
              return false;
            }
            return true;
          })}
          loading={action.loading}
          dataSource={action.dataSource as T[]}
          pagination={pagination}
        />
      </Card>
    </div>
  );
};

/**
 * 🏆 Use Ant Design Table like a Pro!
 * 更快 更好 更方便
 * @param props
 */
const ProviderWarp = <T, U = {}>(props: ProTableProps<T>) => (
  <Container.Provider>
    <ProTable {...props} />
  </Container.Provider>
);

export default ProviderWarp;
