'use strict';

const inspect = require('util').inspect;
const opts = { colors: true, depth: Infinity };

const path = require('path');
const python = require('python-shell');
const options = {
  mode: 'text',
  scriptPath: path.join(__dirname, '..', 'python')
}

tempInterval();

module.exports = Socket;

function Socket (io) {
  io.on('connection', function (socket) {
    console.log(socket.id);
  });
}

function tempInterval () {
  python.run('../python/temp.py', options, function (err, results) {
    if (err || results.length == 0) {
      console.error(err);
      setTimeout(tempInterval, 5000);
    } else {
      var json = JSON.parse(results[0]);
      console.log(inspect(json, opts));
      setTimeout(tempInterval, 100);
    }
  });
}
