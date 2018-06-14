export function isPlainObject(value) {
  return (
    value && (value.constructor === Object || value.constructor === undefined)
  );
}

export function toCamelcase(value) {
  return value.replace(/-([a-z])/ig, (all, letter) => letter.toUpperCase());
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