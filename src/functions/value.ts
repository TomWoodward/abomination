import { FnImpl } from '..';
import { execute } from '../lib/execute';
import { isScope } from '../lib/guards';

export const value: FnImpl = (params, scope, fns) => {
  if (!params.name) throw new Error('name is required for resolving a value');
  const name = execute(params.name, scope, fns).value;
  if (typeof name !== 'string') throw new Error('name must be a string for resolving a value');
  const parts = name.split('.');

  return {
    value: parts.reduce((result, path) => {
      if (!path) return result;
      if (isScope(result)) return result[path];
      throw new Error(`could not resolve value path "${path}" of type: ${typeof result}`);
    }, scope.find(s => !parts[0] || (isScope(s) && parts[0] in s))) || null,
    scope,
    fns,
  };
};
