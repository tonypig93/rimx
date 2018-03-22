import { is } from "immutable";

function isNativeType(variable) {
  return (
    typeof variable === "string" ||
    typeof variable === "number" ||
    typeof variable === "undefined" ||
    variable === null
  );
}

export function compareFn(a, b) {
  if (isNativeType(a) && isNativeType(b)) {
    return a === b;
  }
  return is(a, b);
}
