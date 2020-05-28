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
    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);
    await writeFilePromise('dog-img.txt', res.body.messsage);
    console.log('Dog image saved to file!');
  } catch (err) {
    console.log(err);
  }
};

getDogPic();

// Solution with Promises
readFilePromise(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);

    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);

    return writeFilePromise('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Dog image was saved to file!');
  })
  .catch((err) => {
    console.log(err);
  });
