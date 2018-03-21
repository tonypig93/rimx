export function isPlainObject(value) {
  return (
    value && (value.constructor === Object || value.constructor === undefined)
  );
}

export function toCamelcase(value) {
  return value.replace(/-([a-z])/ig, (all, letter) => letter.toUpperCase());
}
