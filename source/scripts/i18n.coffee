document.addEventListener "DOMContentLoaded", ->
  nodes = document.querySelectorAll('[data-i18n]')
  for i in [0...nodes.length]
    nodes[i].innerHTML = chrome.i18n.getMessage(attr) if attr = nodes[i].dataset.i18n
  return
