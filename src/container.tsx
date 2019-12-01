import { createContainer } from 'unstated-next';
import { useState } from 'react';
import { ProColumns } from './Table';

function useCounter<T = any>() {
  const [action, setAction] = useState({});
  const [columns, setColumns] = useState<ProColumns<T>[]>([]);
  const [columnsMap, setColumnsMap] = useState<{ [key: string]: boolean }>({});
  return { action, setAction, columns, setColumns, columnsMap, setColumnsMap };
}

const Counter = createContainer(useCounter);

export default Counter;
