'use strict';

const inspect = require('util').inspect;
const opts = { colors: true, depth: Infinity };
const fs = require('fs');

if (!fs.existsSync('./config.json')) {
  console.log(inspect({ "Error": "config.json missing, see README.md for setup instructions." }, opts));
  process.exit();
}

const config = require('./config.json');
const PORT = config.PORT;
const MONGODB_URI = config.MONGODB_URI;

const express = require("express");
const http = require('http');
const socket_io = require('socket.io');
const bodyParser = require('body-parser');
const logger = require('morgan');
const debug = require('debug')('http');
const path = require('path');
const os = require('os');
const python = require('python-shell');
const ifaces = os.networkInterfaces();
const mongoose = require('mongoose');

//routes
const index = require('./routes/index');
//const api = require('./routes/api');

//sockets
const temp = require('./sockets/temp');

Object.keys(ifaces).forEach((ifname) => {
  var alias = 0;
  ifaces[ifname].forEach((iface) => {
    if (ifname == 'wlan0' || 'eth0') {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }
      if (alias == 0) {
        var pythonOptions = {
          mode: 'text',
          scriptPath: path.join(__dirname, 'python'),
          args: ['--string ' + iface.address]
        };
        python.run('ip.py', pythonOptions, (err, results) => {
          mongoose.Promise = global.Promise;
          const promise = mongoose.connect(MONGODB_URI, { useMongoClient: true });
          promise.then(go, fail);
        });
      }
      ++alias;
    }
  });
});

function go (db) {
  console.log(inspect({"MongoDB connected on port": db.port }, opts));

  const app = express();

  app.use(logger('dev'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'pug');
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ type: 'application/json'}));
  app.use(express.static(path.join(__dirname, 'www')));
  app.use('/', index);
  //app.use('/api', api);

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.status(500).json({
      message: err.message,
      error: {}
    });
  });

  // HTTP setup

  const server = http.createServer(app);

  server.on('error', onError);
  server.on('listening', onListening);

  server.listen(PORT, function () {
    console.log(inspect({ "Listening on port": PORT }, opts));
  });

  const io = socket_io.listen(server);

  //Build Sockets
  temp(io);

  //private functions

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof PORT === 'string'
      ? 'Pipe ' + PORT
      : 'Port ' + PORT;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'PORT ' + addr.PORT;
    debug('Listening on ' + bind);
  }


}

function fail (err) {
  console.log(inspect(db, opts));
}
