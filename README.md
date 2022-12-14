# An Abomination

a language written in JSON for manipulating data.

## design goals

### function definitions must be JSON compatible

function definitions are passed as javascript objects, but all data types used in the definitions
are JSON compatible. the expectation is that the definition could have come from `JSON.parse`.

### all function inputs can be more functions

its functions all the way down bud.

### JSON compatible data is recognized as literal

except for objects, which are literals if they don't have a `fn` key in them. if they have a `fn` key
they're function definitions and will be executed.

### function execution is safe

A function definition loaded from an external source can be executed with a reasonable
expectation of safety. Execution cannot access environment, pollute prototypes, or make network requests
unless explicitly allowed.

## examples

see [integration tests](./src/index.spec.ts) for more examples.


concatenate strings:
```
const fn = {
  fn: 'concat',
  parts: ['hello', {fn: 'value', name: 'thing.stuff'}],
  delimiter: ' '
}
const input = {
  thing: {stuff: 'world'}
}
// returns 'hello world'
execute(fn, input))
```


map array, extract value, join using user defined function:
```
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
}
const input = [{id: 'first thing'}, {id: 'second thing'}];

// returns 'first thing,second thing'
execute(fn, input));
```

## standard functions

### value

input:
- `name`: the name of the value to retrieve

retrieves a value from scope. can retrieve nested values using dot notation. the name `.` matches the entire current scope.
parent scopes can be accessed, if a value name isn't found in the current scope it'll look higher up.

### concat

input:
- `array`: an array of strings to concatenate
- `delimiter` (optional): delimiter to put between the parts, default: ''

concatenates a list of strings into one string.

### map

input:
- `array`: an array of stuff to map
- `map`: the function to map. inside this function the scope is the array item.

maps a list of things into a list of different things.

### define

input:
- `variable` (optional): variable name to define (must provide either variable or function name)
- `function` (optional): function name to define (must provide either variable or function name)
- `body`: the variable value or function definition

defines a variable or function. returns null. functions have a `with` reserved key to put definitions in. values defined
in a `with` affect all sub-scopes, values and function definitions can be overwritten by sub-scopes. function definitions
have access to a `param` function which retrieves a parameter from the function usage.
