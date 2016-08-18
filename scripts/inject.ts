'use strict';

// Если это первый запуск скрипта на странице
if (!document.body.classList.contains('vkcb')) {
  document.body.classList.add('vkcb');
}

function addButtons() {
  // Получение всех элементов-обёрток для комментариев
  const postRepliesEls = document.querySelectorAll('div.post_info');
  [].forEach.call(postRepliesEls, (node: HTMLElement) => {
    // Элемент-обёртка для служебных ссылок поста: комментировать, дата
    const postFullLikeEls = node.querySelector('div.post_full_like_wrap');

    // Если кнопки ещё не существует
    if (!postFullLikeEls.querySelector('.vkcb-btn')) {
      // Получаем идентификатор поста
      const postLikeButton = postFullLikeEls.querySelector('.post_like');
      const postId = postLikeButton.getAttribute('onmouseover').match(/\d+_\d+/)[0];

      // Создаём элемент - ссылку
      const buttonEl = document.createElement('a');
      buttonEl.href = '#';
      buttonEl.classList.add('post_like', '_like_wrap', 'vkcb-btn');
      buttonEl.setAttribute('onclick', `this.closest('.post_info').querySelector('.replies_wrap').classList.toggle('vkcb-show'); return false;`);

      // Создаём элемент для иконки
      const buttonIconEl = document.createElement('i');
      buttonIconEl.classList.add('icon');

      // Получаем количество комментариев. Если количество комментариев не указано
      // в атрибуте "offs", то вычисляем вручную
      const commentsEl = node.querySelector('.wr_header');
      let commentsCount: number = 0;
      if (commentsEl) {
        commentsCount = parseInt(commentsEl.getAttribute('offs').replace(/[^\/]+\//, ''), 10);
      } else {
        commentsCount = node.getElementsByClassName('reply').length;
      }

      // Создаём элемент для количества комментариев
      const buttonCountEl = document.createElement('span');
      buttonCountEl.classList.add('post_share_count', '_count');
      buttonCountEl.textContent = commentsCount.toString();

      // Вставляем кнопку в блок служебных ссылок поста
      buttonEl.appendChild(buttonIconEl);
      buttonEl.appendChild(buttonCountEl);
      postFullLikeEls.appendChild(buttonEl);
    }
  });
}

chrome.runtime.sendMessage({ method: 'getLocalStorage' }, (res) => {
  if (!res.globalStatus) {
    addButtons();

    // Слежение за изменением древа
    const observer = new MutationObserver(() => {
      addButtons();
    });

    observer.observe(document.getElementById('content'), {
      childList: true,
      subtree: true
    });

    return;
  }

  // Если требуется выключить все комментарии на сайте
  document.body.classList.add('-global-off');
});
