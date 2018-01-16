(function () {
  'use strict';

  var socket = io.connect();

  socket.on('temp', function (data) {
    console.log(data);
  });

})();
