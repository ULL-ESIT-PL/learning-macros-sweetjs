syntax new = function (ctx) {
  let ident = ctx.next().value; console.error(ident.value.token.value); // Droid
  let params = ctx.next().value; console.error(params.inner._tail.array.map(x => x.value.token.str || x.value.token.value)); // [ '(', 'BB-8', ',', 'orange', ',', 'rolling', ')' ]
  return #`${ident}.create ${params}`;
};

require("./my-patch.js");
const Droid = {};

new Droid('BB-8', 'orange', 'rolling');