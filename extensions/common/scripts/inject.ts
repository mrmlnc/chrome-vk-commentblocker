'use strict';

// Because `browser` chrome and type definition does not exists
const browser = window.browser || chrome;

// If this is first launch
if (!document.body.classList.contains('vkcb')) {
  document.body.classList.add('vkcb');
}

function nodeListToElements(nodeList: NodeListOf<Element>): HTMLElement[] {
  return Array.prototype.slice.call(nodeList);
}

function createButton(post: Element, postFullLikeEl: Element): void {
  const buttonEl: HTMLAnchorElement = document.createElement('a');
  buttonEl.href = '#';
  buttonEl.classList.add('post_like', '_like_wrap', 'vkcb-btn');
  buttonEl.setAttribute('onclick', `!function(a){a.matches=a.matches||a.mozMatchesSelector||a.msMatchesSelector||a.oMatchesSelector||a.webkitMatchesSelector,a.closest=a.closest||function(a){return this?this.matches(a)?this:this.parentElement?this.parentElement.closest(a):null:null}}(Element.prototype);this.closest('.post_info').querySelector('.replies_wrap').classList.toggle('vkcb-show');return false;`);

  const buttonIconEl: HTMLPhraseElement = document.createElement('i');
  buttonIconEl.classList.add('icon');

  const commentsEl: Element = post.querySelector('.wr_header');
  let commentsCount = 0;
  if (commentsEl) {
    commentsCount = parseInt(commentsEl.getAttribute('offs').replace(/[^\/]+\//, ''), 10);
  } else {
    commentsCount = post.getElementsByClassName('reply').length;
  }

  const buttonCountEl: HTMLSpanElement = document.createElement('span');
  buttonCountEl.classList.add('post_share_count', '_count');
  buttonCountEl.textContent = commentsCount.toString();

  buttonEl.appendChild(buttonIconEl);
  buttonEl.appendChild(buttonCountEl);
  postFullLikeEl.appendChild(buttonEl);
}

function buttonController() {
  const listOfPostElements: NodeListOf<Element> = document.querySelectorAll('div.post_info');
  const postEls = nodeListToElements(listOfPostElements);
  postEls.forEach((postInfoEl: HTMLElement) => {
    const postFullLikeEl: Element = postInfoEl.querySelector('div.post_full_like_wrap');

    if (!postFullLikeEl.querySelector('.vkcb-btn')) {
      createButton(postInfoEl, postFullLikeEl);
    }
  });
}

browser.runtime.sendMessage({ method: 'getLocalStorage' }, (res) => {
  if (res && !res.globalStatus) {
    buttonController();

    const observer = new MutationObserver(() => {
      buttonController();
    });

    observer.observe(document.getElementById('content'), {
      childList: true,
      subtree: true
    });

    return;
  }

  document.body.classList.add('-global-off');
});
