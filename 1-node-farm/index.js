const fs = require('fs');

// Blocking, synchronous code
// const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textInput);

// const textOutput = `This is what we know about avocado: ${textInput}.\nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOutput);
// console.log("File written!");

// Non-blocking, asynchronous code
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  if (err) {
    return console.log('ERROR!'); // run this by feeding a wrong file name
  }
  console.log('Data1:', data1);

  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    console.log('Data2:', data2);

    fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
      console.log('Data3:', data3);
      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
        console.log('Your file has been written!');
      });
    });
  });
});

console.log('will read this file'); // this will run first
