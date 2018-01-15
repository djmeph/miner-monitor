'use strict';
module.exports = Module;

function Module (req, res, next) {

  try {

    req.data = {
      title: "Miner Monitor"
    };
    return next();

  } catch (err) { fail(err); }

  function fail (err) {
    req.data = { error: err };
    return next();
  }

}
