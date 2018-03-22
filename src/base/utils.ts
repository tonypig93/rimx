import { is } from "immutable";

function isNativeType(variable: any) {
  return (
    typeof variable === "string" ||
    typeof variable === "number" ||
    typeof variable === "undefined" ||
    variable === null
  );
}

export function compareFn(a: any, b: any) {
  if (isNativeType(a) && isNativeType(b)) {
    return a === b;
  }
  return is(a, b);
}
