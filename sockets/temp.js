'use strict';

const path = require('path');
const python = require('python-shell');
const options = {
  mode: 'text',
  scriptPath: path.join(__dirname, '..', 'python')
}

module.exports = Socket;

function Socket (io) {

  io.on('connection', function (socket) {
    socket.join('miner-monitor');
  });

  tempInterval();

  function tempInterval () {
    python.run('temp.py', options, function (err, results) {
      if (err || results.length == 0) {
        console.error(err);
        setTimeout(tempInterval, 5000);
      } else {
        var json = JSON.parse(results[0]);
        io.to('miner-monitor').emit('temp', json);
        setTimeout(tempInterval, 50);
      }
    });
  }

}
