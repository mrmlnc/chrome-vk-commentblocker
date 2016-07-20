'use strict';
function changeIcon(status) {
    chrome.browserAction.setIcon({
        path: {
            19: "images/icon-19" + status + ".png",
            38: "images/icon-38" + status + ".png"
        }
    });
}
function getStatus() {
    return localStorage.getItem('vkcb_extension_status') === 'true';
}
function setStatus(status) {
    localStorage.setItem('vkcb_extension_status', "" + status);
}
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo && changeInfo.status === 'complete' && tab.url.indexOf('vk.com') > -1) {
        var version = 'new';
        if (tab.url.indexOf('//vk.com') > -1) {
            version = 'old';
        }
        chrome.tabs.executeScript(tabId, {
            file: "scripts/inject-" + version + ".js"
        });
    }
});
if (getStatus() === undefined) {
    setStatus(false);
}
if (getStatus()) {
    changeIcon('_off');
}
chrome.browserAction.onClicked.addListener(function (tab) {
    if (tab.url.indexOf('vk.com') === -1) {
        return;
    }
    var status = getStatus();
    setStatus(!status);
    changeIcon((!status) ? '_off' : '');
    chrome.tabs.reload();
});
chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    if (req.method === 'getLocalStorage') {
        sendResponse({
            globalStatus: getStatus()
        });
    }
});
