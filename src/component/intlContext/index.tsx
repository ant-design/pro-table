import React, { useContext } from 'react';
import zhCN from '../../locale/zh_CN';
import enUS from '../../locale/en_US';

export interface IntlType {
  locale: string;
  getMessage: (id: string, defaultMessage: string) => string;
}

function get(source: object, path: string, defaultValue?: string): string | undefined {
  // a[3].b -> a.3.b
  const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let result = source;
  let message = defaultValue;
  // eslint-disable-next-line no-restricted-syntax
  for (const p of paths) {
    message = Object(result)[p];
    result = Object(result)[p];
    if (message === undefined) {
      return defaultValue;
    }
  }
  return message;
}

/**
 * 创建一个操作函数
 * @param locale
 * @param localeMap
 */
const createIntl = (locale: string, localeMap: { [key: string]: any }): IntlType => ({
  getMessage: (id: string, defaultMessage: string) =>
    get(localeMap, id, defaultMessage) || defaultMessage,
  locale,
});

const zhCNIntl = createIntl('zh_CN', zhCN);
const enUSIntl = createIntl('en_US', enUS);

export { enUSIntl, zhCNIntl };

const IntlContext = React.createContext<IntlType>(zhCNIntl);

const { Consumer: IntlConsumer, Provider: IntlProvider } = IntlContext;

export { IntlConsumer, IntlProvider, createIntl };

export function useIntl(): IntlType {
  const intl = useContext(IntlContext);
  return intl;
}

export default IntlContext;
