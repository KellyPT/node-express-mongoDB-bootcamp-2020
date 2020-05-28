const fs = require('fs');
const superagent = require('superagent');

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) {
        reject('File not found');
      }
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) {
        reject('Cannot write file');
      }
      resolve('success');
    });
  });
};

// Solution with async-await, try-catch
const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);
    const promiseRes1 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const promiseRes2 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const promiseRes3 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const allResponses = await Promise.all([
      promiseRes1,
      promiseRes2,
      promiseRes3
    ]);

    console.log('number of img links', allResponses.length);

    const images = allResponses.map((res) => res.body.message).join('\n');
    await writeFilePromise('dog-img.txt', images);
    console.log('Dog images saved to file!');
  } catch (err) {
    throw err;
  }
  return '2.COMPLETED: IMAGE READY';
};

// how to return values from async-await with then-catch
// Solution 1:
// getDogPic()
//   .then((x) => console.log(x))
//   .catch((err) => {
//     console.log('ERROR!', err);
//   });
// Solution 2: IIFE with async-await so that we don't have to declare a new function name
(async () => {
  try {
    console.log('1.START: Will get dog pics from API');
    const result = await getDogPic(); // await keyword here will make sure the promise is fulfilled before the app moves to the next line of code
    // getDogPic(); // this will happen after 2 console.log statements! because Node will execute top-level code first while waiting for Promises to be completed
    console.log(result); // log out the return value of the promise
    console.log('3.END: Done with getting dog pics');
  } catch (err) {
    console.log('ERROR!', err);
  }
})();

// Solution with Promises
// readFilePromise(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);

//     return writeFilePromise('dog-img.txt', res.body.message);
//   })
//   .then(() => {
//     console.log('Dog image was saved to file!');
//   })
//   .catch((err) => {
//     console.log(err);
//   });
