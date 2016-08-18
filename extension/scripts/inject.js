'use strict';
if (!document.body.classList.contains('vkcb')) {
    document.body.classList.add('vkcb');
}
function addButtons() {
    var postRepliesEls = document.querySelectorAll('div.post_info');
    [].forEach.call(postRepliesEls, function (node) {
        var postFullLikeEls = node.querySelector('div.post_full_like_wrap');
        if (!postFullLikeEls.querySelector('.vkcb-btn')) {
            var postLikeButton = postFullLikeEls.querySelector('.post_like');
            var postId = postLikeButton.getAttribute('onmouseover').match(/\d+_\d+/)[0];
            var buttonEl = document.createElement('a');
            buttonEl.href = '#';
            buttonEl.classList.add('post_like', '_like_wrap', 'vkcb-btn');
            buttonEl.setAttribute('onclick', "this.closest('.post_info').querySelector('.replies_wrap').classList.toggle('vkcb-show'); return false;");
            var buttonIconEl = document.createElement('i');
            buttonIconEl.classList.add('icon');
            var commentsEl = node.querySelector('.wr_header');
            var commentsCount = 0;
            if (commentsEl) {
                commentsCount = parseInt(commentsEl.getAttribute('offs').replace(/[^\/]+\//, ''), 10);
            }
            else {
                commentsCount = node.getElementsByClassName('reply').length;
            }
            var buttonCountEl = document.createElement('span');
            buttonCountEl.classList.add('post_share_count', '_count');
            buttonCountEl.textContent = commentsCount.toString();
            buttonEl.appendChild(buttonIconEl);
            buttonEl.appendChild(buttonCountEl);
            postFullLikeEls.appendChild(buttonEl);
        }
    });
}
chrome.runtime.sendMessage({ method: 'getLocalStorage' }, function (res) {
    if (!res.globalStatus) {
        addButtons();
        var observer = new MutationObserver(function () {
            addButtons();
        });
        observer.observe(document.getElementById('content'), {
            childList: true,
            subtree: true
        });
        return;
    }
    document.body.classList.add('-global-off');
});
