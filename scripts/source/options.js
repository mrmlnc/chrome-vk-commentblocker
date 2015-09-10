document.addEventListener("DOMContentLoaded", function() {
  var addException = document.getElementById('addExceptionModal');
  var exportListException = document.getElementById('exportListException');
  var importListException = document.getElementById('importListException');
  var importFileListException = document.getElementById('importFileListException');
  var modal = document.getElementById('modalAddingException');
  var noExceptionMessage = document.getElementById('optionsWelcome');
  var exceptionTable = document.getElementById('exceptionTable');
  var title = document.getElementsByName('exception_title')[0];
  var url = document.getElementsByName('exception_url')[0];
  var errorMessage = document.getElementById('errorMessage');

  addException.addEventListener('click', function() {
    modal.style.display = 'block';
  });

  exportListException.addEventListener('click', function() {
    options.listExport(this);
  });

  importListException.addEventListener('click', function(event) {
    options.listImport(event);
  });

  modal.querySelector('button[data-tools="cancel"]').addEventListener('click', function() {
    modal.style.display = 'none';
    errorMessage.style.display = 'none';
    title.value = '';
    url.value = '/';
  });

  modal.querySelector('button[data-tools="add"]').addEventListener('click', function() {
    options.save(title, url);
  });

  var initRemoveButtons = function() {
    var buttons = document.querySelectorAll('button[data-tools="remove"]');

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].onclick = function(e) {
        if (confirm(chrome.i18n.getMessage('exception_remove_confirm'))) {
          options.remove(this.dataset.id - 1);
        }
      };
    }
  };

  var handleFileSelect = function(event) {
    var file = event.target.files[0];

    if (file) {
      saveListException(file);
      location.reload();
    }
  };

  var options = {
    load: function() {
      if (localStorage['vkCommentBlocker']) {
        var data = loadException();
        options.view(data);
      } else {
        noExceptionMessage.style.display = 'block';
        exceptionTable.style.display = 'none';
      }
      if (localStorage['vkCommentBlockerTemp']) {
        var temp = JSON.parse(localStorage['vkCommentBlockerTemp']);
        title.value = temp.title;
        url.value = temp.url;
        addException.click();
        localStorage.removeItem('vkCommentBlockerTemp');
      }
    },
    view: function(data) {
      var content = viewException(data);
      var tbody = exceptionTable.querySelector('tbody');
      exceptionTable.replaceChild(content, tbody);

      initRemoveButtons();
    },
    save: function(title, url) {
      if (title.value !== '' && url.value !== '') {
        if (saveException(title.value, url.value)) {
          alert(chrome.i18n.getMessage('exception_exists'));
          modal.querySelector('button[data-tools="cancel"]').click();
        } else {
          location.reload();
        }
      } else {
        errorMessage.style.display = 'block';
      }
    },
    remove: function(id) {
      removeException(id);
      location.reload();
    },
    listExport: function(link) {
      var json = JSON.stringify(loadException());
      var blob = new Blob([json], {
        type: "application/json"
      });

      link.href = URL.createObjectURL(blob);
    },
    listImport: function() {
      importFileListException.click();
      importFileListException.addEventListener("change", handleFileSelect, false);
    }
  };

  options.load();
});
