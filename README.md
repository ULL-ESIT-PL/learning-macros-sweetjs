## Basic points

- https://www.sweetjs.org/doc/tutorial

- Checked with node v20.5.0
  
  ```
  ➜  hello-sweet.js node --version
  v20.5.0
  ```
- Fact: The project seems to be abandoned (2017 is the date for 6 of the 7 repos). 

- Help:
  
  ```
  ➜  hello-sweet.js sjs --help
  Usage: sjs [options] files ...

  Opciones:
    -b, --no-babel  do not use babel backend
    -o, --out-file  write output to file
    -d, --out-dir   write output to directory
    -h, --help      Muestra ayuda                                        [boolean]
  ```

## Introduction

Note that [Sweet](https://www.sweetjs.org/doc/tutorial) uses Babel as a backend. After [Sweet](https://www.sweetjs.org/doc/tutorial) has done its work of finding and expanding macros, the resulting code is run through Babel.

The first three lines make up the macro definition. 
The `syntax` keyword is a bit like `let` in that it creates a new variable in the current block scope. 
Rather than create a variable for a runtime value, `syntax` creates a new variable for a **compiletime** value. 
In this case, `hi` is the variable bound to the **compiletime** function defined on the first three lines.

```js
syntax hi = function (ctx) {
  return #`console.log('hello, world!')`;
}
hi
```

**Compiletime** functions defined by syntax must return an array of syntax objects. 
You can easily create these with a *syntax template*. 
**Syntax templates** are template literals with a `\#` tag, 
which create a List 
(see the [immutable.js](https://facebook.github.io/immutable-js/docs/#/List) docs for its API) 
of syntax objects.

## Operators

In addition to the macros we've seen so far, Sweet allows you to define custom operators. Custom operators are different from macros in that you can specify the precedence and associativity but you can't match arbitrary syntax; the operator definition is invoked with fully expanded expressions for its operands.

Operators are defined via the `operator` keyword:

```js
operator >>= left 1 = (left, right) => {
  return #`${left}.then(${right})`;
};

let myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('foo');
  }, 1000);
});

myPromise >>= resp => { console.log(resp); return resp; };

//myPromise.then(resp => { console.log(resp); return resp; });
```

The associativity can be 

- either `left` or `right` for binary operators and 
- `prefix` or `postfix` for unary operators. 

The precedence is a number that specifies how tightly the operator should bind. 
The builtin operators range from a precedence of 0 to 20 and are defined [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_Precedence).

The **operator definition must return an expression**.

```js
➜  hello-sweet.js sjs operators.js 
let myPromise_4 = new Promise((resolve_5, reject_6) => {
  setTimeout(() => {
    resolve_5("foo");
  }, 1e3);
});
myPromise_4.then(resp_7 => {
  console.log(resp_7);
  return resp_7;
});
```

Execution: 

``` 
➜  hello-sweet.js sjs operators.js | node
foo
```
