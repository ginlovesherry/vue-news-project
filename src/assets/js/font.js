/*(function(doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (clientWidth >= 640) {
                clientWidth = 640;
            };
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);*/
function reset() {
    var html = document.getElementsByTagName('html')[0];
    var w = document.documentElement.clientWidth || document.body.clientWidth;
    html.style.fontSize = w / 640 * 100 + 'px';
    window.onresize = function() {
        reset();
    }
}
reset();