(function () {
  'use strict';

  var socket = io.connect();

  socket.emit('join');

  socket.on('temp', function (data) {
    console.log(data);
  });

})();
