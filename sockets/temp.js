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
    if (err) {
      console.error(err);
      setTimeout(tempInterval, 5000);
    } else {
      console.log(inspect(results, opts));
      setTimeout(tempInterval, 500);
    }
  });
}
