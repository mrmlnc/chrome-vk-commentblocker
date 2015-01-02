document.addEventListener "DOMContentLoaded", ->
  option = document.getElementById('goToOption')
  addExceptionPopup = document.getElementById('addExceptionPopup')
  url = ''
  title = ''

  #
  # Event -> Click Option
  #
  option.addEventListener 'click', ->
    window.open(chrome.extension.getURL('options.html'));
    return

  #
  # Query Title & URL
  #
  chrome.tabs.query
    currentWindow: true
    active: true
  , (tabs) ->
    if tabs[0].url.indexOf('http://vk.com/') is -1
      addExceptionPopup.disabled = true
    else
      tabUrl = new URL(tabs[0].url)
      title = tabs[0].title
      url = tabUrl.pathname
    return

  #
  # Adding Exception
  #
  addExceptionPopup.addEventListener 'click', ->
    data =
      title: title
      url: url

    localStorage['vkCommentBlockerTemp'] = JSON.stringify(data)
    window.open(chrome.extension.getURL('options.html'));
    return
  return
