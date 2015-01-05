document.addEventListener "DOMContentLoaded", ->
  addException = document.getElementById('addExceptionModal')
  exportListException = document.getElementById('exportListException')
  importListException = document.getElementById('importListException')
  importFileListException = document.getElementById('importFileListException')
  modal = document.getElementById('modalAddingException')
  noExceptionMessage = document.getElementById('optionsWelcome')
  exceptionTable = document.getElementById('exceptionTable')
  title = document.getElementsByName('exception_title')[0]
  url = document.getElementsByName('exception_url')[0]
  errorMessage = document.getElementById('errorMessage')

  #
  # Event -> Click Add Exception
  #
  addException.addEventListener 'click', ->
    modal.style.display = 'block'
    return

  #
  # Event -> Click Export List
  #
  exportListException.addEventListener 'click', ->
    options.listExport(@)
    return

  #
  # Event -> Click Import List
  #
  importListException.addEventListener 'click', (event) ->
    options.listImport(event)
    return

  #
  # Event -> Click Modal Cancel
  #
  modal.querySelector('button[data-tools="cancel"]').addEventListener 'click', ->
    modal.style.display = 'none'
    errorMessage.style.display = 'none'
    title.value = ''
    url.value = '/'
    return

  #
  # Event -> Click Modal Add Exception
  #
  modal.querySelector('button[data-tools="add"]').addEventListener 'click', ->
    options.save(title, url)
    return

  #
  # Initialization Buttons Remove Exception
  #
  initRemoveButtons = ->
    buttons = document.querySelectorAll('button[data-tools="remove"]')

    for i in [0...buttons.length]
      buttons[i].onclick = (e) ->
        options.remove(@.dataset.id - 1) if confirm chrome.i18n.getMessage('exception_remove_confirm')
        return
    return

  #
  # Handle File Select
  #
  handleFileSelect = (event) ->
    file = event.target.files[0]

    if file
      saveListException(file)
      location.reload()
    return

  #
  # Options (load, view, save, remove, listExport, listImport)
  #
  options =
    load: ->
      if localStorage['vkCommentBlocker']
        data = loadException()
        options.view(data)
      else
        noExceptionMessage.style.display = 'block'
        exceptionTable.style.display = 'none'

      if localStorage['vkCommentBlockerTemp']
        temp = JSON.parse(localStorage['vkCommentBlockerTemp'])
        title.value = temp.title
        url.value = temp.url
        addException.click()
        localStorage.removeItem('vkCommentBlockerTemp')
      return

    view: (data) ->
      content = viewException(data)
      tbody = exceptionTable.querySelector('tbody')
      exceptionTable.replaceChild(content, tbody)
      initRemoveButtons()
      return

    save: (title, url) ->
      if title.value isnt '' and url.value isnt ''
        if saveException(title.value, url.value)
          alert chrome.i18n.getMessage('exception_exists')
          modal.querySelector('button[data-tools="cancel"]').click()
        else
          location.reload()
      else
        errorMessage.style.display = 'block'
      return

    remove: (id) ->
      removeException(id)
      location.reload()
      return

    listExport: (link) ->
      json = JSON.stringify(loadException())
      blob = new Blob([json],
        type: "application/json"
      )
      link.href = URL.createObjectURL(blob)
      return

    listImport: ->
      importFileListException.click()
      importFileListException.addEventListener "change", handleFileSelect, false
      return

  options.load()
  return
