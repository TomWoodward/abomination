import { execute as innerExecute } from "./lib/execute";

export type ReturnTypes = null | string | boolean | object | Array<ReturnTypes>;
export type InputTypes = null | string | boolean | object | Array<InputTypes>;
export type Functions = {[key: string]: FnImpl}
export type FnImpl = (params: {[key: string]: InputTypes}, scope: ReturnTypes[], fns: Functions) => {value: ReturnTypes, scope: ReturnTypes[], fns: Functions}

export const execute = (value: InputTypes, scope: ReturnTypes = {}, fns: Functions = {}) => innerExecute(value, [scope], fns).value
export default execute;
