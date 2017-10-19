function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function getDate() {
  document.getElementById("time").innerHTML = "Published on " + document.lastModified;
}
