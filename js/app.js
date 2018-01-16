(function () {
  'use strict';

  var socket = io.connect();

  socket.on('temp', function (data) {
    console.log({
      temp: parseFloat(data.temp).toFixed(2),
      humidity: parseFloat(data.humidity).toFixed(2)
    });
  });

})();
