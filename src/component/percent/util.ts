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
export function getRealTextWithPrecision(realValue: number, precision: number = 2) {
  if (precision && precision <= 0) {
    throw new Error('precision must be more the zero');
  }

  return precision && precision > 0 ? realValue.toFixed(precision) : realValue;
}
