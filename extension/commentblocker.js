// Toggle Comments
var toggleComments = function() {
  var extensionLink;

  (document.getElementById("extension") == null) ?
    (
      extensionLink = document.createElement("link"),
      extensionLink.href = chrome.extension.getURL("/commentblocker_on.min.css"),
      extensionLink.id = "extension",
      extensionLink.type = "text/css",
      extensionLink.rel = "stylesheet",
      document.getElementsByTagName("head")[0].appendChild(extensionLink)
    )
  : (document.getElementsByTagName("head")[0].removeChild(document.getElementById("extension")))
}

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(tab.id, {
    code: "(" + toggleComments.toString() + ")();"
  });
});
