/**
 * Timestamp Microservice
 * JSON parameterised time in unix and natural language
 *
 * Ashen Gunaratne
 * mail@ashenm.ml
 *
 */

const express = require('express');
const app = express();

// static files
app.use(express.static('public'));

// timestamp microservice
app.all('/:time', (request, response) => {

  let date;

  // process as natural language if non numeric
  // character included else fallback to unix
  (/\D/.test(request.params.time))
    ? date = new Date(request.params.time)
    : date = new Date(parseInt(request.params.time, 10) * 1000);

  (date.toString() === 'Invalid Date')
    ? response.json({
        unix: null,
        natural: null
      })
    : response.json({
        unix: date.getTime() / 1000,
        natural: date.toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: '2-digit'})
      });

});

app.listen(process.env.PORT || 8080);
