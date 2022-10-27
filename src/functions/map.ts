import { FnImpl } from "..";
import { execute } from "../lib/execute";

export const map: FnImpl = (params, scope, fns) => {
  if (!params.array) throw new Error('array is required for mapping')
  const array = execute(params.array, scope, fns).value;
  if (!(array instanceof Array)) throw new Error('array must be an array for mapping');
  if (!params.map) throw new Error('map is required for mapping')

  return {
    value: array.map(item => execute(params.map, [item, ...scope], fns).value),
    scope,
    fns,
  }
};
