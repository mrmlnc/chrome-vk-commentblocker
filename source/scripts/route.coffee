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
    if tabs[0].url.indexOf('://vk.com/') > -1
      tabUrl = new URL(tabs[0].url)
      title = tabs[0].title
      url = tabUrl.pathname
    else
      addExceptionPopup.disabled = true
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
