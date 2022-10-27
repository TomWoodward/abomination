import { FnImpl, Functions, ReturnTypes } from '..';
import { execute } from '../lib/execute';

export const define: FnImpl = (params, scope, fns) => {
  if (!!params['function'] === !!params['variable']) throw new Error('define requires either function or variable name');
  if (!params['body']) throw new Error('define requires a body');

  const functionName = params['function'] && execute(params['function'], scope, fns).value;
  if (functionName && typeof functionName !== 'string') throw new Error('function must be a string for define');
  const variableName = params['variable'] && execute(params['variable'], scope, fns).value;
  if (variableName && typeof variableName !== 'string') throw new Error('variable must be a string for define');

  const newFns: Functions = functionName ? {
    ...fns,
    [functionName]: (innerParams, innerScope, innerFns) => {
      return execute(params['body'], innerScope, {
        ...innerFns,
        param: ({name}, paramsScope, paramsFns) => {
          if (!name) throw new Error('name is required for resolving a parameter');
          if (typeof name !== 'string') throw new Error('name must be a string for resolving a value');
          return {value: execute(innerParams[name], paramsScope, paramsFns).value, scope: paramsScope, fns: paramsFns};
        }
      });
    }
  } : fns;

  const [scopeHead, ...scopeTail] = scope;
  const newScope: ReturnTypes[] = variableName
    ? [scopeHead, {[variableName]: execute(params['body'], scope, fns).value}, ...scopeTail]
    : scope;

  return {
    value: null,
    scope: newScope,
    fns: newFns,
  };
};
