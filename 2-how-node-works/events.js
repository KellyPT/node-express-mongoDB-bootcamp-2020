const EventEmitter = require('events');
const http = require('http');

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
  console.log('There was a new sale');
});

myEmitter.on('newSale', () => {
  console.log('This is a new customer: Kelly');
});

myEmitter.on('newSale', (stock) => {
  console.log(`There are ${stock} items in stock`);
});

myEmitter.emit('newSale', 9);

//////////////
// another way to create an event emitter

const server = http.createServer();
server.on('request', (req, res) => {
  console.log('Request received');
  console.log(req.url);
  res.end('Request received');
});

server.on('request', (req, res) => {
  console.log('another request received');
  res.end('another request received');
});

server.on('close', () => {
  console.log('Server closed');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for requests at port 8000');
});
