var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./db.db");
var request = require('request');

db.exec("BEGIN TRANSACTION;" +
  "CREATE TABLE IF NOT EXISTS vpns (HostName,IP TEXT,Score INTEGER,Ping INTEGER,Speed INTEGER,CountryLong,CountryShort,NumVpnSessions,Uptime,TotalUsers,TotalTraffic,LogType,Operator,Message,OpenVPN_ConfigData_Base64, archivedAt);" +
  "CREATE TABLE IF NOT EXISTS resLog (hasError, resCode, timestamp);" +
  "CREATE INDEX IF NOT EXISTS vpnIPIndex ON vpns(IP);" +
  "CREATE INDEX IF NOT EXISTS vpntsIndex ON vpns(archivedAt);" +
  "COMMIT TRANSACTION;" +
  "ANALYZE vpns;",
  function(err) {
    if (err) throw err;
  });

var insertLogQuery = db.prepare("INSERT INTO resLog (hasError, resCode, timestamp) VALUES (?, ?, ?)");

function insertLog(hasError, resCode, timestamp, callback) {
  insertLogQuery.run(hasError, resCode, timestamp, callback);
}

function insertVPNItems(arrs, timestamp) {
  db.parallelize(function() {
    for (var arr of arrs) {
      arr.push(timestamp);
      db.run("INSERT INTO vpns (HostName,IP,Score,Ping,Speed,CountryLong,CountryShort,NumVpnSessions,Uptime,TotalUsers,TotalTraffic,LogType,Operator,Message,OpenVPN_ConfigData_Base64, archivedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", arr);
    }
  })
}
exports.parseCSVAndInsert = function() {
  var url = "http://www.vpngate.net/api/iphone/";
  var now = Date.now();
  request(url, function(err, response, body) {
    if (err) {
      console.log("Error");
      insertLog(true, 0, now, this.parseCSVAndInsert);
    } else {
      insertLog(false, response.statusCode, now, this.parseCSVAndInsert);
      if (response.statusCode != 200) {
        console.log("Not 200 : " + response.statusCode);
        return;
      }
      var lines = body.split("\n");
      var items = [];
      for (var v of lines) {
        if (v.startsWith("*") || v.startsWith("#")) continue;
        if (v.trim().length == 0) continue;
        items.push(v.split(","));
      }
      console.log(`${items.length} items inserted`);
      insertVPNItems(items, now)
    }
  })
}
exports.searchByIP = function(ip, callback) {
  var obj = [];
  db.each("SELECT HostName, CountryLong, Uptime, Operator, Message, archivedAt FROM vpns WHERE IP = ?", ip, function(err, row) {
    if (err) throw err;
    obj.push(row);
  }, function(err) {
    callback(obj);
  })
}
