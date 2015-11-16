var queryElement = document.querySelector("#query");
document.querySelector("form").addEventListener("submit", function(ev) {
  ev.preventDefault();
  if (/[^0-9\.:a-zA-Z]/.test(queryElement.value)) {
    alert("금지된 문자가 포함되어 있습니다.");
  } else if (queryElement.value.trim().length == 0) {
    alert("검색어가 비어 있거나 공백으로만 이루어져 있습니다.");
  } else {
    this.submit();
  }
})

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
var times = document.querySelectorAll("tbody tr > td:nth-child(6)");
for (var i = 0; i < times.length; i++) {
  times[i].textContent = formatDateTime(Number(times[i].textContent));
}
