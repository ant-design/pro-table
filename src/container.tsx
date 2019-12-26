import { createContainer } from 'unstated-next';
import { useState, useRef } from 'react';
import { ColumnProps } from 'antd/es/table';
import { RequestData, ProColumns } from './index';
import { UseFetchDataAction } from './useFetchData';

export interface ColumnsMapItem {
  fixed: 'right' | 'left' | undefined;
  show: boolean;
}

function useCounter<T = any>() {
  const actionRef = useRef<UseFetchDataAction<RequestData<T>>>();
  const [columns, setColumns] = useState<ColumnProps<T>[]>([]);
  // 用于排序的数组
  const [sortKeyColumns, setSortKeyColumns] = useState<string[]>([]);
  const [proColumns, setProColumns] = useState<ProColumns<T>[]>([]);
  const [columnsMap, setColumnsMap] = useState<{
    [key: string]: ColumnsMapItem;
  }>({});
  return {
    action: actionRef,
    setAction: (newAction: UseFetchDataAction<RequestData<T>>) => {
      actionRef.current = newAction;
    },
    sortKeyColumns,
    setSortKeyColumns,
    columns,
    setColumns,
    columnsMap,
    setColumnsMap,
    proColumns,
    setProColumns,
  };
}

const Counter = createContainer(useCounter);

export default Counter;
