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

Sweet brings the hygienic macros of languages like Scheme and Rust to JavaScript.
Macros allow you to sweeten the syntax of JavaScript and craft the language you’ve always wanted.

Install Sweet with npm:

```sh
$ npm install -g @sweet-js/cli @sweet-js/helpers
```

This globally installs the `sjs` binary, which is used to compile Sweet code.

Note that [Sweet](https://www.sweetjs.org/doc/tutorial) uses Babel as a backend. After [Sweet](https://www.sweetjs.org/doc/tutorial) has done its work of finding and expanding macros, the resulting code is run through Babel.

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

# Sweet New

Let's move on to a slightly more interesting example.
Pretend you are using an OO framework for JavaScript where instead of using `new` we want to call a `.create` method that has been monkey patched. 

```js
➜  hello-sweet.js git:(main) ✗ cat -n my-patch.js 
     1  Object.prototype.create = function (name, color, movement) {
     2    console.log(`Created ${name} with color ${color} and movement ${movement}`);
     3  };
```

Rather than manually rewrite all usages of `new` to the `create` method you could define a macro that does it for you.

```js
➜  hello-sweet.js git:(main) ✗ cat -n sweet-new.js 
     1  syntax new = function (ctx) {
     2    let ident = ctx.next().value; console.error(ident.value.token.value); // Droid
     3    let params = ctx.next().value; console.error(params.inner._tail.array.map(x => x.value.token.str || x.value.token.value)); // [ '(', 'BB-8', ',', 'orange', ',', 'rolling', ')' ]
     4    return #`${ident}.create ${params}`;
     5  };
     6
     7  require("./my-patch.js");
     8  const Droid = {};
     9
    10  new Droid('BB-8', 'orange', 'rolling');
```

```js
Droid.create('BB-8', 'orange');
```

Here you can see the `ctx` parameter to the macro provides access to syntax at the macro call-site. This parameter is an iterator called the _macro context_.

The macro context has the type:

```js
{
  next: () -> {
    done: boolean,
    value: Syntax
  }
}
```

Each call to `next` returns the successive syntax object in `value` until there is nothing left in which case `done` is set to true. Note that the context is also an iterable so you can use `for-of` and related goodies.

Note that in this example we only call `next` twice even though it looks like there is more than two bits of syntax we want to match. What gives? Well, remember that delimiters cause syntax objects to nest. So, as far as the macro context is concerned there are two syntax objects: `Droid` and a single paren delimiter syntax object containing the three syntax objects `'BB-8'`, `,`, and `'orange'`.

After grabbing both syntax objects with the macro context iterator we can stuff them into a syntax template. Syntax templates allow syntax objects to be used in interpolations so it is straightforward to get our desired result.

Here is the output of the above code:

```js
➜  hello-sweet.js git:(main) ✗ sjs sweet-new.js       
Droid
[ '(', 'BB-8', ',', 'orange', ',', 'rolling', ')' ]
require("./my-patch.js");
const Droid_6 = {};
Droid_6.create("BB-8", "orange", "rolling");
```

Execution piped to node.js:

```js
➜  hello-sweet.js git:(main) ✗ sjs sweet-new.js | node
Droid
[ '(', 'BB-8', ',', 'orange', ',', 'rolling', ')' ]
Created BB-8 with color orange and movement rolling
```

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

Here is an example of a unary operator:

```js 
➜  hello-sweet.js git:(main) ✗ cat -n unary-operator.js 
     1
     2  operator @ prefix 20 = (value) => { // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
     3    return #`Math.floor(${value})`;
     4  };
     5
     6  let a = 3.5
     7  console.log(@ a);    // 3
     8  console.log(@ 3.5);  // 3
➜  hello-sweet.js git:(main) ✗ sjs unary-operator.js | node
3
3
➜  hello-sweet.js git:(main) ✗ sjs unary-operator.js       
let a_3 = 3.5;
console.log(Math.floor(a_3));
console.log(Math.floor(3.5));
```