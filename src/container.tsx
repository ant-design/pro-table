import { createContainer } from 'unstated-next';
import { useState } from 'react';
import { ColumnProps } from 'antd/es/table';
import { UseFetchDataAction, RequestData } from './index';

export interface ColumnsMapItem {
  fixed: 'right' | 'left' | undefined;
  show: boolean;
}

function useCounter<T = any>() {
  const [action, setAction] = useState<UseFetchDataAction<RequestData<T>>>();
  const [columns, setColumns] = useState<ColumnProps<T>[]>([]);
  const [columnsMap, setColumnsMap] = useState<{
    [key: string]: ColumnsMapItem;
  }>({});
  return { action, setAction, columns, setColumns, columnsMap, setColumnsMap };
}

const Counter = createContainer(useCounter);

export default Counter;
