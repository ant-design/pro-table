import { useState, useEffect } from 'react';

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
    manual?: boolean;
    effects?: any[];
    onLoad?: (dataSource: T['data']) => void;
  },
): UseFetchDataAction<T> => {
  const { defaultPageSize = 10, defaultCurrent = 1, onLoad = () => null } = options || {};

  const [list, setList] = useState<T['data']>(defaultData as any);
  const [loading, setLoading] = useState<boolean>(false);

  const [pageIndex, setPageIndex] = useState<number>(defaultCurrent);
  const [pageSize, setPageSize] = useState<number>(defaultPageSize);
  const [total, setTotal] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [initalComponent, setInitalComponent] = useState<boolean>(true);

  const { manual = false, effects = [] } = options || {};

  /**
   * 请求数据
   * @param isAppend 是否添加数据到后面
   */
  const fetchList = async (isAppend?: boolean) => {
    if (manual && loading) {
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
  }, [pageSize]);

  /**
   * 重置pageIndex 到 1
   */
  const resetPageIndex = () => {
    setPageIndex(1);
  };

  useEffect(() => {
    if (manual === false && initalComponent === false) {
      fetchList();
    }

    if(initalComponent){
      setInitalComponent(false);
    }
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
