'use strict';

// Because `browser` chrome and type definition does not exists
const browser = window.browser || chrome;

function changeExtensionIcon(extStatus: string): void {
  browser.browserAction.setIcon({
    path: {
      16: `images/icon-16-${extStatus}.png`,
      19: `images/icon-19-${extStatus}.png`,
      20: `images/icon-20-${extStatus}.png`,
      32: `images/icon-32-${extStatus}.png`,
      38: `images/icon-38-${extStatus}.png`,
      40: `images/icon-30-${extStatus}.png`
    }
  });
}

function getExtensionStatus(): boolean {
  return localStorage.getItem('vkcb_extension_status') === 'true';
}

function setExtensionStatus(status: boolean): void {
  localStorage.setItem('vkcb_extension_status', `${status}`);
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo && changeInfo.status === 'complete' && tab.url.indexOf('vk.com') !== -1) {
    browser.tabs.executeScript(tabId, { file: `scripts/inject.js` });
  }
});

if (getExtensionStatus() === undefined) {
  setExtensionStatus(false);
}

if (getExtensionStatus()) {
  changeExtensionIcon('-off');
}

console.log(browser.browserAction.onClicked);
browser.browserAction.onClicked.addListener((tab) => {
  console.log(123);
  if (tab.url.indexOf('vk.com') === -1) {
    return;
  }

  const status = getExtensionStatus();

  setExtensionStatus(!status);

  changeExtensionIcon((!status) ? '-off' : '');

  browser.tabs.executeScript(tab.id, { code: 'console.log(true)' });
});

browser.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.method === 'getLocalStorage') {
    sendResponse({
      globalStatus: getExtensionStatus()
    });
  }
});
