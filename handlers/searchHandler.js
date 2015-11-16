var db;
exports.setDatabase = function(val) {
  db = val;
}

function isBadQuery(val) {
  return /[^0-9\.:a-zA-Z]/.test(val);
}

function searchFunc(query, callback) {
  if (isBadQuery(query)) {
    throw new error("Unvalid characters in query");
  } else {
    db.searchByIP(query, callback);
  }
}
exports.jsonHandler = function(req, res) {
  searchFunc(req.params[0], function(rows) {
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(rows));
  });
}
exports.htmlHandler = function(req, res) {
  searchFunc(req.query["q"], function(rows) {
    res.render('searchMain', {
      result: rows
    });
  })
}
