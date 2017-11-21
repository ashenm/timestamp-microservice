/**
 * Timestamp Microservice
 * JSON parameterised time in unix and natural language
 *
 * Ashen Gunaratne
 * mail@ashenm.ml
 *
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

http.createServer((request, response) => {

  // only allow GET requests
  if (!/GET/.test(request.method)) {
    response.writeHead(405, {'Content-Type': 'text/plain'});
    response.end(response.statusMessage);
    return;
  }

  // index
  if (/^\/$/.test(request.url)) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream(path.join(__dirname, 'public', 'index.html')).pipe(response);
    return;
  }

  // favicon
  if (/^\/favicon\.ico$/.test(request.url)) {
    response.writeHead(404);
    response.end(null);
    return;
  }

  let date;

  // extract input
  const input = decodeURIComponent(request.url.replace(/^\//, ''));

  // process as natural language if non numeric
  // character included else fallback to unix
  /\D/.test(input)
    ? date = new Date(input)
    : date = new Date(parseInt(input, 10) * 1000);

  date.toString() === 'Invalid Date'
    ? (response.end(JSON.stringify({unix: null, natural: null})),
        response.writeHead(400, {'Content-Type': 'application/json'}))
    : (response.end(JSON.stringify({unix: date.getTime() / 1000, natural: date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: '2-digit'})})),
        response.writeHead(200, {'Content-Type': 'application/json'}));

}).listen(process.env.PORT || 8080);
