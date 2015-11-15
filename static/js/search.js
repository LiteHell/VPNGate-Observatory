String.prototype.format = function() {
  var newstr = this;
  for (var i = 0; i < arguments.length; i++) {
    var b = '{' + i + '}';
    var a = arguments[i];
    while (newstr.indexOf(b) != -1) newstr = newstr.replace(b, a);
  }
  return newstr;
}

function formatDateTime(t) {
  var d = new Date(t);
  return '{0}년 {1}월 {2}일 {7}요일 {6} {3}시 {4}분 {5}초'.format(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours() - (d.getHours() > 12 ? 12 : 0), d.getMinutes(), d.getSeconds(), d.getHours() > 12 ? '오후' : '오전', (['일', '월', '화', '수', '목', '금', '토'])[d.getDay()]);
}
document.querySelector("button#search").addEventListener("click", function() {
  document.querySelector("#resultDiv").style.display = '';
  document.querySelector("#processing").style.display = '';
  document.querySelector("table#result").style.display = 'none';
  var table = document.querySelector("table#result > tbody");
  var worker = new Worker("/s/js/searchWorker.js");
  table.innerHTML = '';
  worker.onmessage = function(e) {
    var v = e.data;
    if (v == "end") {
      document.querySelector("#processing").style.display = 'none';
      document.querySelector("table#result").style.display = '';
      return;
    }
    var tr = document.createElement("tr");
    var names = ["HostName", "CountryLong", "Uptime", "Operator", "Message", "archivedAt"];
    for (var i = 0; i < names.length; i++) {
      var td = document.createElement("td");
      td.textContent = i == names.length - 1 ? formatDateTime(Number(v["archivedAt"])) : v[names[i]];
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  worker.postMessage(document.querySelector("#query").value)
})
