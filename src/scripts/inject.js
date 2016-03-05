// Если это первый запуск скрипта на странице
if (!document.body.classList.contains('vkcb')) {
  document.body.classList.add('vkcb');
}

function addButton() {
  // Получение всех элементов-обёрток для комментариев
  const repliesEls = document.querySelectorAll('div.replies');
  [].forEach.call(repliesEls, (node) => {
    // Элемент-обёртка для служебных ссылок поста: комментировать, дата
    const linkWrapEl = node.querySelector('div.reply_link_wrap small');

    // Если кнопки ещё не существует
    if (!linkWrapEl.querySelector('.vkcb-btn')) {
      // Создаём элемент - ссылку
      const showEl = document.createElement('span');
      showEl.className = 'vkcb-btn';

      // Создаём элемент для иконки
      const iEl = document.createElement('i');
      iEl.className = 'icon';
      showEl.appendChild(iEl);

      // Получаем количество комментариев. Если количество комментариев
      // не указано в атрибуте "offs", то вычисляем вручную
      let commentCount = node.querySelector('.wr_header');
      if (commentCount) {
        commentCount = commentCount.getAttribute('offs').replace(/[^\/]+\//, '');
      } else {
        commentCount = node.getElementsByClassName('reply_table').length;
      }

      // Создаём элемент для количества комментариев
      const bEl = document.createElement('b');
      bEl.innerText = commentCount;
      bEl.className = 'desc';
      showEl.appendChild(bEl);

      // Вставляем кнопку в блок служебных ссылок поста
      linkWrapEl.insertBefore(showEl, linkWrapEl.firstChild);
    }
  });
}

// первый запуск
addButton();

// Слежение за изменением древа
const observer = new MutationObserver(() => {
  addButton();
});

observer.observe(document.getElementById('content'), {
  childList: true,
  subtree: true
});
