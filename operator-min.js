
operator @ left 20 = (left, right) => { // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence
  return #`Math.min(${left}, ${right})`;
};


console.log( 3 @ 2 - 1);  // 1
console.log( 3 @ 4 <= 3); // true