chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo && changeInfo.status === 'complete' && tab.url.indexOf('://vk.com/') > -1) {
    chrome.tabs.executeScript({
      file: 'scripts/inject.js'
    });
  }
});
