// todo1: 通过枚举值或者直接获取到状态(up, down) 不需要每次都进行判断, 显示 Icon
// todo2: colors 如果传递只有一个, 且需判断是否为合法的颜色值
// todo3: 是否需要判断是合法的数字 ? Infinity -Infinity NaN

/** 获取展示符号 */
export function getSymbolByRealValue(realValue: number) {
  return realValue > 0 ? '+' : '';
}

/** 获取颜色 */
export function getColorByRealValue(realValue: number /** ,color: string */) {
  if (realValue === 0) {
    return '#595959';
  }
  return realValue > 0 ? '#ff4d4f' : '#52c41a';
}

/** 获取到最后展示的数字 */
// todo: 到底应该报错误还是应该处理掉错误 ?
export function getRealTextWithPrecision(realValue: number, precision?: number) {
  // const realPrecision = precision ? Math.abs(precision) : 0;
  if (precision && precision <= 0) {
    throw new Error('precision must be more the zero');
  }

  return precision && precision > 0 ? realValue.toFixed(precision) : realValue;
}
