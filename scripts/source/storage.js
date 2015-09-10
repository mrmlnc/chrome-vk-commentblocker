var loadException = function() {
  return (localStorage['vkCommentBlocker'] ? JSON.parse(localStorage['vkCommentBlocker']) : JSON.parse('{"items":[]}'));
};

var viewException = function(data) {
  var tbody = document.createElement('tbody');

  for (var i = 0; i < data['items'].length; i++) {
    var item = data['items'][i];
    var row = tbody.insertRow(0);
    row.insertCell(0).innerHTML = i + 1;
    row.insertCell(1).innerHTML = item.title;
    row.insertCell(2).innerHTML = item.url;
    row.insertCell(3).innerHTML = '<button type="button" class="btn btn-remove" data-tools="remove" data-id=' + (i + 1) + '>' + chrome.i18n.getMessage('exception_remove') + '</button>';
    tbody.appendChild(row);
  }

  return tbody;
};

var saveException = function(title, url) {
  if (localStorage['vkCommentBlocker']) {
    var data = loadException();
    for (var i = 0; i < data['items'].length; i++) {
      var dataUrl = data['items'][i].url;
      if (dataUrl.indexOf(url) > -1) {
        return true;
      }
    }
  } else {
    data = JSON.parse('{"items":[]}');
  }

  data['items'].push({
    title: title,
    url: url
  });

  localStorage['vkCommentBlocker'] = JSON.stringify(data);
};

var saveListException = function(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    var text;
    text = reader.result;
    localStorage['vkCommentBlocker'] = text;
  };

  reader.readAsText(file);
};

var removeException = function(id) {
  var data = loadException();
  data['items'].splice(id, 1);

  if (data['items'].length === 0) {
    localStorage.clear();
  } else {
    localStorage['vkCommentBlocker'] = JSON.stringify(data);
  }
};

var loadStatus = function() {
  return localStorage['vkCommentBlocker_state'];
};

var saveStatus = function(state) {
  localStorage['vkCommentBlocker_state'] = state;
};
