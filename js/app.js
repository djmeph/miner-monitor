(function ($) {
  'use strict';

  $('#temp').html('0.0');
  $('#humidity').html('0.0');

  var socket = io.connect();

  socket.on('temp', function (data) {
    $('#temp').html(parseFloat(data.temp).toFixed(1));
    $('#humidity').html(parseFloat(data.humidity).toFixed(1));
  });

})(jQuery);
