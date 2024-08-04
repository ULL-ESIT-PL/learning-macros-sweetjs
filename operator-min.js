
operator @ right 10 = (left, right) => {
  return #`Math.min(${left}, ${right})`;
};


console.log( 3 @ 2); // 2
console.log( 3 @ 4); // 3