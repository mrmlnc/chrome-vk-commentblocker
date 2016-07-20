'use strict';
if (!document.body.classList.contains('vkcb')) {
    document.body.classList.add('vkcb');
}
function addButtons() {
    var repliesEls = document.querySelectorAll('div.replies');
    [].forEach.call(repliesEls, function (node) {
        var linkWrapEl = node.querySelector('div.reply_link_wrap small');
        if (!linkWrapEl.querySelector('.vkcb-btn')) {
            var showEl = document.createElement('span');
            showEl.className = 'vkcb-btn';
            var iEl = document.createElement('i');
            iEl.className = 'icon';
            showEl.appendChild(iEl);
            var commentCount = node.querySelector('.wr_header');
            if (commentCount) {
                commentCount = commentCount.getAttribute('offs').replace(/[^\/]+\//, '');
            }
            else {
                commentCount = node.getElementsByClassName('reply_table').length;
            }
            var bEl = document.createElement('b');
            bEl.innerText = commentCount;
            bEl.className = 'counter';
            showEl.appendChild(bEl);
            linkWrapEl.insertBefore(showEl, linkWrapEl.firstChild);
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
