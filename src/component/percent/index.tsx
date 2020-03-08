import React, { Fragment, ReactNode } from 'react';
import tonumber from 'lodash.tonumber';

import { getColorByRealValue, getSymbolByRealValue, getRealTextWithPrecision } from './util';

export interface PercentPropInt {
  prefix?: ReactNode;
  suffix?: ReactNode;
  value?: number | string;
  precision?: number;
  // colors?: string[];
  showSymbol?: boolean;
}

const Percent: React.SFC<PercentPropInt> = ({
  value,
  prefix,
  suffix = '%',
  showSymbol,
  precision = 2,
}) => {
  const realValue =
    typeof value === 'string' && value.includes('%')
      ? tonumber(value.replace('%', ''))
      : Number(value);

  return (
    <span style={{ color: getColorByRealValue(realValue) }}>
      {prefix && <span>{prefix}</span>}
      {showSymbol && !prefix && <Fragment>{getSymbolByRealValue(realValue)}&nbsp;</Fragment>}
      {getRealTextWithPrecision(realValue, precision)}
      {suffix && suffix}
    </span>
  );
};

export default Percent;
