import { execute, FnImpl } from ".";

describe('the abomination', () => {

  it('executes a function from a json compatible object config', () => {
    expect(execute({
      fn: 'concat',
      parts: ['hello', 'world'],
      delimiter: ' '
    })).toBe('hello world')
  });

  it('returns an object literal', () => {
    expect(execute({
      random: 'key',
      with: 'otherKey',
    })).toEqual({
      random: 'key',
      with: 'otherKey',
    });
  });

  it('returns a string literal', () => {
    expect(execute('hello world')).toBe('hello world');
  });

  it('takes input', () => {
    expect(execute({
      fn: 'concat',
      parts: ['hello', {fn: 'value', name: 'var'}],
      delimiter: ' '
    }, {var: 'world'})).toBe('hello world')
  });

  it('has user defined functions', () => {
    expect(execute(
      {
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
      },
      [{id:'first thing'}, {id: 'second thing'}]
    )).toBe('first thing,second thing');
  })

  it('has custom functions', () => {
    const fart: FnImpl = (_params, scope, fns) => ({value: 'farts', scope, fns});

    expect(execute(
      {
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
      },
      [{id:'first thing'}, {id: 'second thing'}],
      {fart}
    )).toBe('first thing farts,second thing farts');
  })
});
