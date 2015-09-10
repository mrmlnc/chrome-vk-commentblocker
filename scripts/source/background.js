var commentState = '';

var enableComments = function() {
  if (document.getElementById('extension') == null) {
    var extensionLink = document.createElement("link");
    extensionLink.href = chrome.extension.getURL("/styles/comment_on.css");
    extensionLink.id = "extension";
    extensionLink.type = "text/css";
    extensionLink.rel = "stylesheet";
    document.getElementsByTagName('head')[0].appendChild(extensionLink);
  }
};

var disableComments = function() {
  if (document.getElementById('extension')) {
    document.getElementsByTagName('head')[0].removeChild(document.getElementById('extension'));
  }
};

var stateCommentToggle = function(tabId) {
  if (document.getElementById('extension') || commentState === 1) {
    saveStatus(0);
    commentState = 0;
    chrome.tabs.executeScript(tabId, {
      code: '(' + disableComments.toString() + ')();'
    });
  } else {
    saveStatus(1);
    commentState = 1;
    chrome.tabs.executeScript(tabId, {
      code: '(' + enableComments.toString() + ')();'
    });
  }
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  var listException = loadException().items;
  commentState = 0;
  var globalCommentState = loadStatus();

  if (changeInfo.status === 'complete' && tab.url.indexOf('vk.com/') > -1 && globalCommentState == true) {
    commentState = 1;
    chrome.tabs.executeScript(tabId, {
      code: '(' + enableComments.toString() + ')();'
    });
  }

  if (changeInfo.status === 'complete' && tab.url.indexOf('vk.com/') > -1 && listException.length !== 0 && globalCommentState != true) {
    chrome.tabs.executeScript(tabId, {
      code: '(' + disableComments.toString() + ')();'
    });

    for (var i = 0; i < listException.length; i++) {
      if (tab.url.indexOf(listException[i].url) > -1) {
        commentState = 1;
        chrome.tabs.executeScript(tabId, {
          code: '(' + enableComments.toString() + ')();'
        });
        break;
      }
    }
  }
});
