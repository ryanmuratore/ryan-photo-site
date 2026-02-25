// ── CART SYSTEM ──
// Shared cart logic used across all pages

const Cart = {
  get() {
    try { return JSON.parse(localStorage.getItem('rm_cart') || '[]'); }
    catch { return []; }
  },
  save(items) {
    localStorage.setItem('rm_cart', JSON.stringify(items));
    Cart.update();
  },
  add(item) {
    const items = Cart.get();
    // Check if same item+options already in cart
    const existing = items.find(i => i.id === item.id && i.options === item.options);
    if (existing) { existing.qty += 1; }
    else { items.push({ ...item, qty: 1 }); }
    Cart.save(items);
    Cart.flash();
  },
  remove(index) {
    const items = Cart.get();
    items.splice(index, 1);
    Cart.save(items);
    Cart.renderDropdown();
  },
  total() {
    return Cart.get().reduce((sum, i) => sum + i.price * i.qty, 0);
  },
  count() {
    return Cart.get().reduce((sum, i) => sum + i.qty, 0);
  },
  update() {
    const countEl = document.getElementById('cart-count');
    const totalEl = document.getElementById('cart-total');
    const count = Cart.count();
    if (countEl) countEl.textContent = count > 0 ? count : '';
    if (countEl) countEl.style.display = count > 0 ? 'flex' : 'none';
    if (totalEl) totalEl.textContent = count > 0 ? '$' + Cart.total().toFixed(2) : '';
    Cart.renderDropdown();
  },
  flash() {
    const btn = document.getElementById('cart-btn');
    if (!btn) return;
    btn.classList.add('cart-flash');
    setTimeout(() => btn.classList.remove('cart-flash'), 600);
    Cart.update();
  },
  renderDropdown() {
    const dropdown = document.getElementById('cart-dropdown');
    if (!dropdown) return;
    const items = Cart.get();
    if (items.length === 0) {
      dropdown.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
      return;
    }
    let html = '<div class="cart-items">';
    items.forEach((item, i) => {
      html += `
        <div class="cart-item">
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-opts">${item.options || ''}</p>
          </div>
          <div class="cart-item-right">
            <span class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</span>
            <button class="cart-remove" onclick="Cart.remove(${i})">✕</button>
          </div>
        </div>`;
    });
    html += '</div>';
    html += `<div class="cart-footer">
      <div class="cart-subtotal">
        <span>Subtotal</span>
        <span>$${Cart.total().toFixed(2)}</span>
      </div>
      <button class="cart-checkout-btn" disabled>Checkout — Coming Soon</button>
    </div>`;
    dropdown.innerHTML = html;
  },
  toggleDropdown() {
    const dropdown = document.getElementById('cart-dropdown');
    if (!dropdown) return;
    const isOpen = dropdown.classList.contains('open');
    dropdown.classList.toggle('open', !isOpen);
    Cart.renderDropdown();
    if (!isOpen) {
      setTimeout(() => {
        document.addEventListener('click', Cart.closeOnOutsideClick, { once: true });
      }, 10);
    }
  },
  closeOnOutsideClick(e) {
    const dropdown = document.getElementById('cart-dropdown');
    const btn = document.getElementById('cart-btn');
    if (dropdown && !dropdown.contains(e.target) && btn && !btn.contains(e.target)) {
      dropdown.classList.remove('open');
    } else if (dropdown && dropdown.classList.contains('open')) {
      document.addEventListener('click', Cart.closeOnOutsideClick, { once: true });
    }
  }
};

document.addEventListener('DOMContentLoaded', () => Cart.update());
