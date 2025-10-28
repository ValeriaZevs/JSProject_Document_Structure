(function () {
  'use strict';

  var cartList = document.querySelector('.cart__products');
  if (!cartList) return;

  document.addEventListener('click', function (e) {
    var target = e.target.nodeType === 3 ? e.target.parentNode : e.target;

    if (target.closest && (target.closest('.product__quantity-control_inc') || target.closest('.product__quantity-control_dec'))) {
      var product = target.closest('.product');
      if (!product) return;

      var valueEl = product.querySelector('.product__quantity-value');
      var val = parseInt(valueEl.textContent, 10) || 1;

      if (target.closest('.product__quantity-control_inc')) {
        val += 1;
      } else {
        val = Math.max(1, val - 1);
      }
      valueEl.textContent = val;
      return;
    }

    if (target.closest && target.closest('.product__add')) {
      e.preventDefault();

      var card = target.closest('.product');
      if (!card) return;

      var id  = card.getAttribute('data-id');
      var qty = parseInt(card.querySelector('.product__quantity-value').textContent, 10) || 1;
      var img = card.querySelector('.product__image');
      var src = img ? img.getAttribute('src') : '';

      var exist = cartList.querySelector('.cart__product[data-id="' + id + '"]');
      if (exist) {
        var countEl = exist.querySelector('.cart__product-count');
        var cur = parseInt(countEl.textContent, 10) || 0;
        countEl.textContent = cur + qty;
      } else {
        var item = document.createElement('div');
        item.className = 'cart__product';
        item.setAttribute('data-id', id);

        var pic = document.createElement('img');
        pic.className = 'cart__product-image';
        pic.setAttribute('src', src);

        var count = document.createElement('div');
        count.className = 'cart__product-count';
        count.textContent = qty;

        item.appendChild(pic);
        item.appendChild(count);
        cartList.appendChild(item);
      }

      card.querySelector('.product__quantity-value').textContent = 1;
    }
  });
})();
