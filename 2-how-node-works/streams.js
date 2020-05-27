const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // Solution 1 without streams. Drawback: Node will have to load the entire file into the memory before sending out a http response with file's data. If the file is big / tons of requests hitting the server, the server will quickly run out of resources (app might crash here)
  // fs.readFile('test-file.txt', (err, data) => {
  //   if (err) {
  //     console.log(err);
  //   }
  //   res.end(data);
  // });
  // Solution 2 with stream! create a readable stream. Drawback: could create a back-pressure problem (readable stream happens much faster than response/writeable stream)
  // const readable = fs.createReadStream('testtt-file.txt');
  // readable.on('data', (chunk) => {
  //   res.write(chunk);
  // });
  // readable.on('end', () => {
  //   res.end(); // we already sent all data by chunks above
  // });
  // readable.on('error', (err) => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('File not found');
  // });
  // Solution 3: use both readable stream and writeable stream with pipe
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(res); // automatically solve back-pressure problem
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening...');
});
