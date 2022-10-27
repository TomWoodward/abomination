# An Abomination

a language for manipulating data written in json

## design goals

### function definitions must be JSON compatible

function definitions are passed as javascript objects, but all data types used in the configs
are JSON compatible. the expectation is that the javascript object could have come from `JSON.parse`.

### all function inputs can be more functions

its functions all the way down bud.

### JSON compatible primitives are recognized as literals

except for objects, which are literals if they don't have a `fn` key in them. if they have a `fn` key
they're function definitions and will be executed.


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

retrieves a value from scope. can retrieve nested values using dot notation.

### concat

input:
- `array`: an array of strings to concatenate
- `delimiter` (optional): delimiter to put between the parts, default: ''

concatenates a list of strings into one string.

### map

input:
- `array`: an array of stuff to map
- `map`: the function to map. inside this function the scope is the array item. parent scopes are still accessible.

maps a list of things into a list of different things.

### define

input:
- `variable` (optional): variable name to define (must provide either variable or function name)
- `function` (optional): function name to define (must provide either variable or function name)
- `body`: the variable value or function definition

defines a variable or function. returns null. functions have a `with` reserved key to put definitions in. values defined
in a `with` affect all sub-scopes, values and function definitions can be overwritten by sub-scopes.
