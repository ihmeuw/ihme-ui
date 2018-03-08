export function wrapInArrayIfTrue(condition) {
  return value => { return condition ? [value] : value; };
}
