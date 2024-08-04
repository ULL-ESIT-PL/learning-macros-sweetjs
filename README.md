## Basic points

- https://www.sweetjs.org/doc/tutorial

```
➜  hello-sweet.js node --version
v20.5.0
```

- The project seems to be abandoned (2017 is the date for 6 of the 7 repos). 

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
➜  hello-sweet.js sjs operators.js | node
foo
```