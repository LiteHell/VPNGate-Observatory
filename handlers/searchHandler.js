var db;
exports.setDatabase = function(val) {
  db = val;
}
exports.handler = function(req, res) {
  var query = req.params[0];
  if (/[^0-9\.:a-zA-Z]/.test(query)) {
    throw new error("Unvalid characters in query");
  } else {
    db.searchByIP(query, function(rows) {
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(rows));
    });
  }
}
