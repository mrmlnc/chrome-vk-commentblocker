function changeIcon(status = '') {
  chrome.browserAction.setIcon({
    path: {
      19: `images/icon-19${status}.png`,
      38: `images/icon-38${status}.png`
    }
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo && changeInfo.status === 'complete' && tab.url.indexOf('://vk.com/') > -1) {
    chrome.tabs.executeScript({
      file: 'scripts/inject.js'
    });
  }
});

// Если текущих настроек расширения не существует, то отключаем глобальное
// отключение комментариев
if (localStorage.vkcbStatus === undefined) {
  localStorage.vkcbStatus = false;
}

// Если комментарии выключены глобально, то меняем иконку на черную версию
if (localStorage.vkcbStatus === 'true') {
  changeIcon('_off');
}

chrome.browserAction.onClicked.addListener((tab) => {
  if (tab.url.indexOf('://vk.com/') > -1) {
    // Меняем настройки расширения
    localStorage.vkcbStatus = !JSON.parse(localStorage.vkcbStatus);

    // Если комментарии выключены глобально, то меняем иконку на черную версию,
    // иначе переключаем иконку на обычную версию
    changeIcon((localStorage.vkcbStatus === 'true') ? '_off' : '');

    // Настройки применяются только после перезагрузки страницы, так как в
    // DOM встраиваются дополнительные элементы
    chrome.tabs.reload();
  }
});

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.method === 'getLocalStorage') {
    sendResponse({
      globalStatus: localStorage.vkcbStatus
    });
  }
});
