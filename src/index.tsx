import ProTable, { ProColumns, ActionType, ProTableProps, ColumnsState } from './Table';
import IndexColumn from './component/indexColumn';
import { RequestData } from './useFetchData';
import TableDropdown from './component/dropdown';
import TableStatus from './component/status';
import {
  IntlProvider,
  IntlConsumer,
  createIntl,
  IntlType,
  zhCNIntl,
  enUSIntl,
  viVNIntl,
  itITIntl,
  jaJPIntl,
  esESIntl,
  ruRUIntl,
  msMYIntl,
} from './component/intlContext';
import Search from './Form';
import defaultRenderText, { ProColumnsValueType } from './defaultRender';

export {
  ProColumns,
  ProColumnsValueType,
  ProTableProps,
  IndexColumn,
  ActionType,
  RequestData,
  TableDropdown,
  TableStatus,
  Search,
  IntlProvider,
  IntlConsumer,
  IntlType,
  zhCNIntl,
  defaultRenderText,
  createIntl,
  enUSIntl,
  viVNIntl,
  itITIntl,
  jaJPIntl,
  esESIntl,
  ruRUIntl,
  msMYIntl,
  ColumnsState,
};

export default ProTable;
