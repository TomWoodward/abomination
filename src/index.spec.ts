import { execute, FnImpl } from '.';

describe('the abomination', () => {

  it('executes a function from a json compatible object config', () => {
    const fn = {
      fn: 'concat',
      parts: ['hello', 'world'],
      delimiter: ' '
    };
    expect(execute(fn)).toBe('hello world');
  });

  it('returns an object literal', () => {
    const fn = {
      random: 'key',
      with: 'otherKey',
    };
    expect(execute(fn)).toEqual({
      random: 'key',
      with: 'otherKey',
    });
  });

  it('returns a string literal', () => {
    expect(execute('hello world')).toBe('hello world');
  });

  it('takes input', () => {
    const fn = {
      fn: 'concat',
      parts: ['hello', {fn: 'value', name: 'var'}],
      delimiter: ' '
    };
    const input = {
      var: 'world'
    };
    expect(execute(fn, input)).toBe('hello world');
  });

  it('resolves nested input', () => {
    const fn = {
      fn: 'concat',
      parts: ['hello', {fn: 'value', name: 'thing.stuff'}],
      delimiter: ' '
    };
    const input = {
      thing: {stuff: 'world'}
    };
    expect(execute(fn, input)).toBe('hello world');
  });

  it('has user defined functions', () => {
    const fn = {
      with: {
        fn: 'define',
        function: 'join-with-comma',
        body: {fn: 'concat', delimiter: ',', parts: {fn: 'param', name: 'parts'}}
      },
      fn: 'join-with-comma',
      parts: {
        fn: 'map',
        array: {fn: 'value', name: '.'},
        map: {fn: 'value', name: 'id'}
      }
    };
    const input = [{id:'first thing'}, {id: 'second thing'}];

    expect(execute(fn, input)).toBe('first thing,second thing');
  });

  it('has custom functions', () => {
    const fart: FnImpl = (_params, scope, fns) => ({value: 'farts', scope, fns});

    const fn = {
      with: [
        {
          fn: 'define',
          function: 'join-with-comma',
          body: {fn: 'concat', delimiter: ',', parts: {fn: 'param', name: 'parts'}}
        },
        {
          fn: 'define',
          variable: 'composed-thing',
          body: {fn: 'fart'}
        }
      ],
      fn: 'join-with-comma',
      parts: {
        fn: 'map',
        array: {fn: 'value', name: '.'},
        map: {fn: 'concat', parts: [{fn: 'value', name: 'id'}, {fn: 'value', name: 'composed-thing'}], delimiter: ' '}
      }
    };
    const input = [{id:'first thing'}, {id: 'second thing'}];

    expect(execute(fn, input, {fart})).toBe('first thing farts,second thing farts');
  });
});
