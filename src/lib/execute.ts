import { FnImpl, Functions, InputTypes, ReturnTypes } from '..';
import * as functions from '../functions';
import { isFn } from './guards';

export const execute = (value: InputTypes, scope: ReturnTypes[], fns: Functions): {value: ReturnTypes; scope: ReturnTypes[]; fns: Functions} => {
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) {
    return {value, scope, fns};
  }
  if (value instanceof Array) {
    return {value: value.map(entry => execute(entry, scope, fns).value), scope, fns};
  }
  if (isFn(value)) {
    const {fn, with: withParam, ...params} = value;
    const withStuff = withParam ? withParam instanceof Array ? withParam : [withParam] : [];
    const {scope: resolvedScope, fns: resolvedFns} = withStuff.reduce((result: ReturnType<FnImpl>, withThing) => {
      return execute(withThing, result.scope, result.fns);
    }, {scope, fns: {...(functions as Functions), ...fns}} as ReturnType<FnImpl>);
    
    if (!(fn in resolvedFns)) throw new Error(`${fn} is not defined`);

    return resolvedFns[fn](params, resolvedScope, resolvedFns);
  }
  if (value instanceof Object) {
    return {value: Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, execute(entry, scope, fns).value])
    ), scope, fns};
  }

  throw new Error(`unrecognized function component type: ${typeof value}`);
};
