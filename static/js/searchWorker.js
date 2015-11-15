onmessage = function(e) {
  var url = "/search/" + e.data;
  var xreq = new XMLHttpRequest();
  xreq.open("GET", url, false);
  xreq.send(null);
  var res = JSON.parse(xreq.responseText);
  for (var i = 0; i < res.length; i++) {
     postMessage(res[i]);
  }
  postMessage("end");
}
