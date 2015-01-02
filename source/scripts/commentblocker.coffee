#
# Toggle Comment (Show|Hide)
#
enableComments = ->
  if not document.getElementById("extension")?
    extensionLink = document.createElement("link")
    extensionLink.href = chrome.extension.getURL("/styles/commentblocker_on.css")
    extensionLink.id = "extension"
    extensionLink.type = "text/css"
    extensionLink.rel = "stylesheet"
    document.getElementsByTagName("head")[0].appendChild(extensionLink)
  return

disableComments = ->
  if document.getElementById("extension")
    document.getElementsByTagName("head")[0].removeChild(document.getElementById("extension"))
  return

#
# Event -> Update Tab
#
chrome.tabs.onUpdated.addListener (tabId, changeInfo, tab) ->
  dataException = loadException()
  listException = dataException['items']

  if changeInfo and changeInfo.status is 'complete' and tab.url.indexOf('://vk.com/') > -1 and listException.length isnt 0
    chrome.tabs.executeScript tabId,
      code: '(' + disableComments.toString() + ')();'

    for i in [0..listException.length - 1]
      if tab.url.indexOf(listException[i].url) > -1
        chrome.tabs.executeScript tabId,
          code: '(' + enableComments.toString() + ')();'
        break
  return
