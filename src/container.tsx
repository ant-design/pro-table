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
  // 保存初始化的 columns，用于重置
  const columnsRef = useRef<ColumnProps<T>[]>();
  const [columns, setColumns] = useState<ColumnProps<T>[]>([]);
  const [proColumns, setProColumns] = useState<ProColumns<T>[]>([]);
  const [columnsMap, setColumnsMap] = useState<{
    [key: string]: ColumnsMapItem;
  }>({});
  return {
    action: actionRef,
    setAction: (newAction: UseFetchDataAction<RequestData<T>>) => {
      actionRef.current = newAction;
    },
    initialColumns: columnsRef,
    setInitialColumns: (initial: ColumnProps<T>[]) => {
      columnsRef.current = initial;
    },
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
