const fs = require('fs');
const http = require('http');
const url = require('url');

///////////////////////////////////////
// FILES

// Blocking, synchronous code
// const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textInput);

// const textOutput = `This is what we know about avocado: ${textInput}.\nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOutput);
// console.log("File written!");

// Non-blocking, asynchronous code
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) {
//     return console.log('ERROR!'); // run this by feeding a wrong file name
//   }
//   console.log('Data1:', data1);

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log('Data2:', data2);

//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//       console.log('Data3:', data3);
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', (err) => {
//         console.log('Your file has been written!');
//       });
//     });
//   });
// });

// console.log('will read this file'); // this will run first

///////////////////////////////////////
// SERVER
const replaceTemplate = (template, productData) => {
  let output = template.replace(/{%PRODUCT_NAME%}/g, productData.productName);
  output = output.replace(/{%IMAGE%}/g, productData.image);
  output = output.replace(/{%PRODUCT_QUANTITY%}/g, productData.quantity);

  output = output.replace(/{%PRODUCT_PRICE%}/g, productData.price);
  output = output.replace(/{%PRODUCT_ID%}/g, productData.id);
  output = output.replace(/{%PRODUCT_ORIGIN%}/g, productData.from);
  output = output.replace(/{%PRODUCT_NUTRIENTS%}/g, productData.nutrients);
  output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, productData.description);

  if (!productData.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  }

  return output;
};

// this reading function will only execute once at the start of the application. therefore we don't need async code here.
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  // overview page
  if (pathName === '/' || pathName === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');

    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardHtml);

    res.end(output);

    // product page
  } else if (pathName === '/product') {
    res.end('This is product detail page!');

    // api
  } else if (pathName === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // not found
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello world'
    });
    res.end('<h1>Not found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
