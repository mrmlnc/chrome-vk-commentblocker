document.addEventListener('DOMContentLoaded', function() {
  var nodes = document.querySelectorAll('[data-i18n]');
  var attr = '';
  for (var i = 0; i < nodes.length; i++) {
    if (attr = nodes[i].dataset.i18n) {
      nodes[i].innerHTML = chrome.i18n.getMessage(attr);
    }
  }
});
