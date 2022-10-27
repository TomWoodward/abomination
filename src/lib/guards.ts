import { InputTypes, ReturnTypes } from "..";

export const isFn = (input: any): input is {fn: string, with: InputTypes} & {[key: string]: InputTypes} =>
  input instanceof Object && 'fn' in input;

export const isScope = (input: any): input is {[key: string]: ReturnTypes} =>
  input instanceof Object && input.__proto__.constructor === Object;
