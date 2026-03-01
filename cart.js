// ── CART SYSTEM ──
(function() {
  // Inject cart styles once
  if (!document.getElementById('cart-styles')) {
    var style = document.createElement('style');
    style.id = 'cart-styles';
    style.textContent = [
      '#cart-dropdown { position: absolute; top: calc(100% + 1px); right: 3rem; width: 320px; background: #faf6f0; border: 1px solid #ddd0bc; box-shadow: 0 16px 48px rgba(0,0,0,0.1); z-index: 300; display: none; font-family: "Tenor Sans", sans-serif; }',
      '#cart-dropdown.open { display: block; }',
      '.cart-empty { padding: 1.6rem; font-size: 0.75rem; color: #a8896a; text-align: center; letter-spacing: 0.1em; }',
      '.cart-items { max-height: 300px; overflow-y: auto; }',
      '.cart-item { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; padding: 1rem 1.2rem; border-bottom: 1px solid #f0e9de; }',
      '.cart-item-info { flex: 1; min-width: 0; }',
      '.cart-item-name { font-size: 0.78rem; color: #4e3820; letter-spacing: 0.04em; margin-bottom: 0.2rem; }',
      '.cart-item-opts { font-size: 0.65rem; color: #a8896a; letter-spacing: 0.06em; line-height: 1.5; white-space: normal; }',
      '.cart-item-right { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; flex-shrink: 0; }',
      '.cart-item-price { font-size: 0.82rem; color: #7a5c3a; letter-spacing: 0.04em; white-space: nowrap; }',
      '.cart-remove { background: none; border: none; cursor: pointer; color: #c4a882; font-size: 0.7rem; line-height: 1; padding: 0.1rem 0.2rem; transition: color 0.2s; }',
      '.cart-remove:hover { color: #4e3820; }',
      '.cart-footer { padding: 1rem 1.2rem; border-top: 1px solid #ddd0bc; }',
      '.cart-subtotal { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.9rem; }',
      '.cart-subtotal span:first-child { font-size: 0.58rem; letter-spacing: 0.28em; text-transform: uppercase; color: #c4a882; }',
      '.cart-subtotal span:last-child { font-family: "Playfair Display", serif; font-size: 1.2rem; font-weight: 300; color: #4e3820; }',
      '.cart-checkout-btn { width: 100%; padding: 0.9rem; background: #4e3820; color: #faf6f0; border: none; font-family: "Tenor Sans", sans-serif; font-size: 0.6rem; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; transition: background 0.25s; }',
      '.cart-checkout-btn:hover:not(:disabled) { background: #7a5c3a; }',
      '.cart-checkout-btn:disabled { background: #c4a882; cursor: default; opacity: 0.7; }',
      '#cart-btn { background: none; border: none; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; color: #a8896a; padding: 0; transition: color 0.2s; font-family: "Tenor Sans", sans-serif; }',
      '#cart-btn:hover { color: #4e3820; }',
      '#cart-btn svg { width: 18px; height: 18px; stroke: currentColor; fill: none; stroke-width: 1.5; }',
      '#cart-count { font-size: 0.62rem; letter-spacing: 0.05em; }',
      '#cart-total { font-size: 0.65rem; letter-spacing: 0.05em; }'
    ].join('\n');
    document.head.appendChild(style);
  }
})();

var Cart = {
  get: function() {
    try { return JSON.parse(localStorage.getItem('rm_cart') || '[]'); }
    catch(e) { return []; }
  },
  save: function(items) {
    localStorage.setItem('rm_cart', JSON.stringify(items));
    Cart.update();
  },
  add: function(item) {
    var items = Cart.get();
    var existing = null;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === item.id && items[i].options === item.options) { existing = items[i]; break; }
    }
    if (existing) { existing.qty += 1; }
    else { items.push({ id: item.id, name: item.name, options: item.options, price: item.price, qty: 1 }); }
    Cart.save(items);
    Cart.flash();
    // Auto-open dropdown briefly
    var dd = document.getElementById('cart-dropdown');
    if (dd && !dd.classList.contains('open')) {
      dd.classList.add('open');
      Cart.renderDropdown();
      setTimeout(function() {
        document.addEventListener('click', Cart.closeOnOutsideClick, { once: true });
      }, 10);
    }
  },
  remove: function(index) {
    var items = Cart.get();
    items.splice(index, 1);
    Cart.save(items);
    Cart.renderDropdown();
  },
  total: function() {
    return Cart.get().reduce(function(sum, i) { return sum + i.price * i.qty; }, 0);
  },
  count: function() {
    return Cart.get().reduce(function(sum, i) { return sum + i.qty; }, 0);
  },
  update: function() {
    var countEl = document.getElementById('cart-count');
    var totalEl = document.getElementById('cart-total');
    var count = Cart.count();
    if (countEl) countEl.textContent = count > 0 ? '(' + count + ')' : '';
    if (totalEl) totalEl.textContent = count > 0 ? '$' + Cart.total().toFixed(0) : '';
    Cart.renderDropdown();
  },
  flash: function() {
    var btn = document.getElementById('cart-btn');
    if (btn) { btn.style.color = '#4e3820'; setTimeout(function() { btn.style.color = ''; }, 500); }
    Cart.update();
  },
  renderDropdown: function() {
    var dropdown = document.getElementById('cart-dropdown');
    if (!dropdown) return;
    var items = Cart.get();
    if (items.length === 0) {
      dropdown.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
      return;
    }
    var html = '<div class="cart-items">';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      html += '<div class="cart-item">' +
              '<div class="cart-item-info">' +
              '<p class="cart-item-name">' + item.name + '</p>' +
              '<p class="cart-item-opts">' + (item.options || '') + '</p>' +
              '</div>' +
              '<div class="cart-item-right">' +
              '<span class="cart-item-price">$' + (item.price * item.qty).toFixed(0) + '</span>' +
              '<button class="cart-remove" onclick="Cart.remove(' + i + ')">&times;</button>' +
              '</div></div>';
    }
    html += '</div>';
    html += '<div class="cart-footer">' +
            '<div class="cart-subtotal">' +
            '<span>Subtotal</span>' +
            '<span>$' + Cart.total().toFixed(0) + '</span>' +
            '</div>' +
            '<button class="cart-checkout-btn" disabled>Checkout &mdash; Coming Soon</button>' +
            '</div>';
    dropdown.innerHTML = html;
  },
  toggleDropdown: function() {
    var dropdown = document.getElementById('cart-dropdown');
    if (!dropdown) return;
    var isOpen = dropdown.classList.contains('open');
    if (isOpen) {
      dropdown.classList.remove('open');
    } else {
      dropdown.classList.add('open');
      Cart.renderDropdown();
      setTimeout(function() {
        document.addEventListener('click', Cart.closeOnOutsideClick, { once: true });
      }, 10);
    }
  },
  closeOnOutsideClick: function(e) {
    var dropdown = document.getElementById('cart-dropdown');
    var btn = document.getElementById('cart-btn');
    if (dropdown && !dropdown.contains(e.target) && btn && !btn.contains(e.target)) {
      dropdown.classList.remove('open');
    } else if (dropdown && dropdown.classList.contains('open')) {
      document.addEventListener('click', Cart.closeOnOutsideClick, { once: true });
    }
  }
};

document.addEventListener('DOMContentLoaded', function() { Cart.update(); });
