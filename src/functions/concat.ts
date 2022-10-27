import { FnImpl } from "..";
import { execute } from "../lib/execute";

export const concat: FnImpl = (params, scope, fns) => {
  if (!params.parts) throw new Error('parts is required for concat');
  const parts = execute(params.parts, scope, fns).value;
  if (!(parts instanceof Array)) throw new Error('parts must be an array for concat');
  parts.forEach(part => {
    if (typeof part !== 'string') throw new Error('concat parts must be strings');
  });

  const delimiter = params.delimiter ? execute(params.delimiter, scope, fns).value : '';
  if (typeof delimiter !== 'string') throw new Error('concat delimiter must be a string')

  return {
    value: parts.join(delimiter),
    scope,
    fns,
  }
};
