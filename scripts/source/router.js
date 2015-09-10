document.addEventListener("DOMContentLoaded", function() {
  var option = document.getElementById('goToOption');
  var addExceptionPopup = document.getElementById('addExceptionPopup');
  var toggleComment = document.getElementById('toggleComment');
  var url = '';
  var title = '';
  var tabId = '';

  option.addEventListener('click', function() {
    window.open(chrome.extension.getURL('options.html'));
  });

  chrome.tabs.query({
    currentWindow: true,
    active: true
  }, function(tabs) {
    var tabUrl;
    if (tabs[0].url.indexOf('://vk.com/') > -1) {
      tabId = tabs[0].id;
      tabUrl = new URL(tabs[0].url);
      title = tabs[0].title;
      url = tabUrl.pathname;
    } else {
      addExceptionPopup.disabled = true;
    }
  });

  addExceptionPopup.addEventListener('click', function() {
    var data;
    data = {
      title: title,
      url: url
    };
    localStorage['vkCommentBlockerTemp'] = JSON.stringify(data);
    window.open(chrome.extension.getURL('options.html'));
  });

  return toggleComment.addEventListener('click', function() {
    chrome.extension.getBackgroundPage().stateCommentToggle(tabId);
  });
});
