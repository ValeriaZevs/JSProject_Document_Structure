
(function () {
  'use strict';

  var opened = null;

  function hideTooltip() {
    if (!opened) return;
    if (opened.el && opened.el.parentNode) {
      opened.el.parentNode.removeChild(opened.el);
    }
    opened = null;
  }

  function buildTooltip(text) {
    var el = document.createElement('div');
    el.className = 'tooltip tooltip_active';
    el.textContent = text;
    el.style.left = '-9999px'; // при создании ставим за пределы экрана, чтобы корректно измерить размер
    el.style.top = '-9999px';
    return el;
  }

  function placeTooltip(tt, anchor, position) {
    var rect = anchor.getBoundingClientRect();
    var pageX = window.pageXOffset || document.documentElement.scrollLeft || 0;
    var pageY = window.pageYOffset || document.documentElement.scrollTop || 0;

    var w = tt.offsetWidth;
    var h = tt.offsetHeight;

    var left = 0;
    var top = 0;

    switch (position) {
      case 'top':
        left = rect.left + pageX + (rect.width - w) / 2;
        top  = rect.top  + pageY - h - 8;
        break;
      case 'right':
        left = rect.right + pageX + 8;
        top  = rect.top   + pageY + (rect.height - h) / 2;
        break;
      case 'left':
        left = rect.left + pageX - w - 8;
        top  = rect.top  + pageY + (rect.height - h) / 2;
        break;
      default: 
        left = rect.left + pageX + (rect.width - w) / 2;
        top  = rect.bottom + pageY + 8;
    }

    if (left < 8) left = 8;
    if (top  < 8) top  = 8;

    tt.style.left = left + 'px';
    tt.style.top  = top  + 'px';
  }

  function showTooltip(anchor) {
    var text = anchor.getAttribute('title') || '';
    var position = anchor.getAttribute('data-position') || 'bottom';

    var tip = buildTooltip(text);
    document.body.appendChild(tip);

    placeTooltip(tip, anchor, position);

    opened = { el: tip, anchor: anchor };
  }

  document.addEventListener('click', function (e) {
    var node = e.target;

    while (node && node !== document && (!node.className || node.className.indexOf('has-tooltip') === -1)) {
      node = node.parentNode;
    }

    if (!node || node === document) {
      hideTooltip();
      return;
    }

    e.preventDefault(); 

    if (opened && opened.anchor === node) {
      hideTooltip();
      return;
    }

    hideTooltip();
    showTooltip(node);
  });

  function reposition() {
    if (!opened) return;
    var pos = opened.anchor.getAttribute('data-position') || 'bottom';
    placeTooltip(opened.el, opened.anchor, pos);
  }
  window.addEventListener('scroll', reposition, { passive: true });
  window.addEventListener('resize', reposition);
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) hideTooltip();
  });
})();
