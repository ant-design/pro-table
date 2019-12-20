import { useState, useEffect, useRef } from 'react';

const usePrevious = <T, U = T>(state: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = state;
  });

  return ref.current;
};

export interface RequestData<T> {
  data: T[];
  success?: boolean;
  total?: number;
}
export interface UseFetchDataAction<T extends RequestData<any>> {
  dataSource: T['data'] | T;
  loading: boolean;
  hasMore: boolean;
  current: number;
  pageSize: number;
  total: number;
  fetch: () => Promise<void>;
  reload: () => Promise<void>;
  fetchMore: () => void;
  fullScreen?: () => void;
  resetPageIndex: () => void;
  setCurrent: (current: number) => void;
  setPageSize: (pageSize: number) => void;
  restColumnsConfig?: () => void;
}

const useFetchData = <T extends RequestData<any>, U = {}>(
  getData: (params: { pageSize: number; current: number }) => Promise<T>,
  defaultData?: Partial<T['data']>,
  options?: {
    defaultCurrent?: number;
    defaultPageSize?: number;
    effects?: any[];
    onLoad?: (dataSource: T['data']) => void;
  },
): UseFetchDataAction<T> => {
  const { defaultPageSize = 10, defaultCurrent = 1, onLoad = () => null } = options || {};

  const [list, setList] = useState<T['data']>(defaultData as any);
  const [loading, setLoading] = useState<boolean>(false);

  const [pageIndex, setPageIndex] = useState<number>(defaultCurrent || 1);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [total, setTotal] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // pre state
  const prePage = usePrevious(pageIndex);
  const prePageSize = usePrevious(pageSize);

  const { effects = [] } = options || {};

  /**
   * 请求数据
   * @param isAppend 是否添加数据到后面
   */
  const fetchList = async (isAppend?: boolean) => {
    if (loading) {
      return;
    }
    setLoading(true);
    const { data, success, total: dataTotal = 0 } =
      (await getData({
        current: pageIndex,
        pageSize,
      })) || {};
    if (success !== false) {
      if (isAppend && list) {
        setList([...list, ...data]);
      } else {
        setList(data);
      }
      if (dataTotal !== total) {
        setTotal(dataTotal);
      }

      // 判断是否可以继续翻页
      setHasMore(dataTotal > pageSize * pageIndex);
    }
    setLoading(false);
    if (onLoad) {
      onLoad(data);
    }
  };

  const fetchMore = () => {
    // 如果没有更多的就忽略掉
    if (hasMore) {
      setPageIndex(pageIndex + 1);
    }
  };

  /**
   * pageIndex 改变的时候自动刷新
   */
  useEffect(() => {
    // 如果上次的页码为空或者两次页码等于是没必要查询的
    // 如果 pageSize 发生变化是需要查询的，所以又加了 prePageSize
    if ((!prePage || prePage === pageIndex) && (!prePageSize || prePageSize === pageSize)) {
      return;
    }
    // 如果 list 的长度大于 pageSize 的长度
    // 说明是一个假分页
    // (pageIndex - 1 || 1) 至少要第一页
    // 在第一页大于 10
    // 第二页也应该是大于 10
    if (pageIndex !== undefined && list.length <= pageSize) {
      fetchList();
    }
  }, [pageIndex]);

  // pageSize 修改后返回第一页
  useEffect(() => {
    setPageIndex(1);
    if (prePage === 1) {
      fetchList();
    }
  }, [pageSize]);

  /**
   * 重置pageIndex 到 1
   */
  const resetPageIndex = () => {
    setPageIndex(1);
  };

  useEffect(() => {
    fetchList();
  }, effects);

  return {
    dataSource: list,
    loading,
    fetch: fetchList,
    reload: fetchList,
    fetchMore,
    total,
    hasMore,
    resetPageIndex,
    current: pageIndex,
    pageSize,
    setCurrent: setPageIndex,
    setPageSize,
  };
};

export default useFetchData;
