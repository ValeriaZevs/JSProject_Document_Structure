(() => {
  'use strict';

  let opened = null; 

  function hideTooltip() {
    if (!opened) return;
    opened.el.remove();
    opened = null;
  }

  function buildTooltip(text) {
    const el = document.createElement('div');
    el.className = 'tooltip'; 
    el.textContent = text;
    return el;
  }

  function placeTooltip(tt, anchor, position) {
    const rect = anchor.getBoundingClientRect();
    const pageX = window.pageXOffset || document.documentElement.scrollLeft || 0;
    const pageY = window.pageYOffset || document.documentElement.scrollTop  || 0;

    document.body.appendChild(tt);
    const w = tt.offsetWidth;
    const h = tt.offsetHeight;

    let left = 0;
    let top  = 0;

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
      default: // bottom
        left = rect.left + pageX + (rect.width - w) / 2;
        top  = rect.bottom + pageY + 8;
    }

    if (left < 8) left = 8;
    if (top  < 8) top  = 8;

    tt.style.left = `${left}px`;
    tt.style.top  = `${top}px`;
  }

  function showTooltip(anchor) {
    const text = anchor.getAttribute('title') || '';
    const position = anchor.getAttribute('data-position') || 'bottom';

    const tip = buildTooltip(text);
    placeTooltip(tip, anchor, position);

    tip.classList.add('tooltip_active');
    opened = { el: tip, anchor };
  }

  document.addEventListener('click', (e) => {
    let node = e.target;
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
    const pos = opened.anchor.getAttribute('data-position') || 'bottom';
    placeTooltip(opened.el, opened.anchor, pos);
  }
  window.addEventListener('scroll', reposition, { passive: true });
  window.addEventListener('resize', reposition);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideTooltip();
  });
})();
