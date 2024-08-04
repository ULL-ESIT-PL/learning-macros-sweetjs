
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