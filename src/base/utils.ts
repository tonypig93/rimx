import { is } from 'immutable';

function isNativeType(variable: any) {
  return (
    typeof variable === 'string' ||
    typeof variable === 'number' ||
    typeof variable === 'undefined' ||
    variable === null
  );
}

export function compareFn(a: any, b: any) {
  if (isNativeType(a) && isNativeType(b)) {
    return a === b;
  }
  return is(a, b);
}

export function normalizePath(path) {
  if (Array.isArray(path)) {
    return path;
  }
  if (typeof path === 'string') {
    return path.split('.');
  }
  throw new Error('invalid path type');
}

export function isPlainObject(value) {
  return (
    value && (value.constructor === Object || value.constructor === undefined)
  );
}

export function toCamelcase(value) {
  return value.replace(/-([a-z])/gi, (all, letter) => letter.toUpperCase());
}
