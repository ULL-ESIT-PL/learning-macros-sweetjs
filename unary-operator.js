
operator @ prefix 20 = (value) => { // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
  return #`Math.floor(${value})`;
};

let a = 3.5
console.log(@ a);    // 3
console.log(@ 3.5);  // 3
