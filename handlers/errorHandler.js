var fs = require("fs");

function getRandomString(length, callback) {
  var crypto = require('crypto');
  crypto.randomBytes(length, function(ex, buf) {
    callback(buf.toString("hex"));
  })
}
module.exports = function(err, req, res, next) {
  getRandomString(10, function(rndString) {
    var now = Date.now();
    var logFilePath = "./errors/" + now + "-" + rndString + ".log";
    fs.writeFile(logFilePath, JSON.stringify(err) + "\n" + err.message + "\n" + err.stack, {
      encoding: 'utf8',
      flag: 'w+'
    }, function(err) {
      if (err) throw err;
      console.log("Error Detected, see " + logFilePath);
      res.status(500);
      res.render('error', {
        identifical: rndString,
        timestamp: now
      });
    })
  });
}
