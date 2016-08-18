'use strict';

function changeIcon(status: string): void {
  chrome.browserAction.setIcon({
    path: {
      19: `images/icon-19${status}.png`,
      38: `images/icon-38${status}.png`
    }
  });
}

function getStatus(): boolean {
  return localStorage.getItem('vkcb_extension_status') === 'true';
}

function setStatus(status: boolean): void {
  localStorage.setItem('vkcb_extension_status', `${status}`);
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo && changeInfo.status === 'complete' && tab.url.indexOf('vk.com') > -1) {
    chrome.tabs.executeScript(tabId, {
      file: `scripts/inject.js`
    });
  }
});

// Если текущих настроек расширения не существует, то убираем глобальное отключение комментариев
if (getStatus() === undefined) {
  setStatus(false);
}

// Если комментарии выключены глобально, то меняем иконку на черную версию
if (getStatus()) {
  changeIcon('_off');
}

chrome.browserAction.onClicked.addListener((tab) => {
  if (tab.url.indexOf('vk.com') === -1) {
    return;
  }

  const status = getStatus();

  // Меняем настройки расширения
  setStatus(!status);

  // Если комментарии выключены глобально, то меняем иконку на черную версию, иначе переключаем
  // на обычную версию
  changeIcon((!status) ? '_off' : '');

  // Настройки применяются только после перезагрузки страницы, так как в DOM встраиваются
  // дополнительные элементы
  chrome.tabs.reload();
});

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.method === 'getLocalStorage') {
    sendResponse({
      globalStatus: getStatus()
    });
  }
});
