const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 1; // if we don't set the size of the thread pool, the 4 crypto processes below will take up 4 pools and happen at the same time

setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test-file.txt', () => {
  console.log('I/O finished');
  console.log('------------');

  setTimeout(() => console.log('Timer 2 finished'), 0);
  setTimeout(() => console.log('Timer 3 finished'), 300);
  setImmediate(() => console.log('Immediate 1 finished'));

  process.nextTick(() => console.log('Process.nextTick'));

  crypto.pbkdf2('password', 'salt', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'salt password encrypted');
  });

  crypto.pbkdf2('password', 'sugar', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'sugar password encrypted');
  });

  crypto.pbkdf2('password', 'pepper', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'pepper password encrypted');
  });

  crypto.pbkdf2('password', 'chilli', 10000, 1024, 'sha512', () => {
    console.log(Date.now() - start, 'chilli assword encrypted');
  });
});

console.log('Hello from top level code');
