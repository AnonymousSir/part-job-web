console.log('--- start ---');


let arr = ['/index', '/home', '/about']
let path = '/hoe/233'

let state = arr.findIndex(i => path.includes(i))
console.log(state);
// console.log(path.includes(arr[1]));


console.log('--- end ---');