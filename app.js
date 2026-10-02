const categories = {
  kitchen: { label: 'Kitchen' },
  candlelight: { label: 'Candlelight' },
  desk: { label: 'Desk' },
  linen: { label: 'Linen' }
};

const products = [
  { id: 1, name: 'Low arc pitcher', category: 'kitchen', material: 'Stoneware · Oat', price: 58, tag: 'New', description: 'A wide, low-shouldered pitcher for water, milk or a handful of stems. The pour lip is pulled by hand, so it stops cleanly.', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80' },
  { id: 2, name: 'Morrow taper set', category: 'candlelight', material: 'Beeswax · Clay', price: 24, tag: 'Restocked', description: 'A pair of hand-dipped beeswax tapers with a small clay holder. Burns slow and smells faintly of honey.', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80' },
  { id: 3, name: 'Field notes no. 3', category: 'desk', material: 'Paper · 80 pages', price: 16, tag: '', description: 'A pocket notebook with 80 dot-grid pages and a soft card cover. Lies flat, takes fountain pen ink without bleeding.', image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=900&q=80' },
  { id: 4, name: 'Sunday table cloth', category: 'linen', material: 'Linen · Undyed', price: 82, tag: 'Limited', description: 'Heavyweight undyed linen, stonewashed so it drapes softly from the first use. Seats six comfortably.', image: 'https://images.unsplash.com/photo-1672386608328-415973e6134e?auto=format&fit=crop&w=900&q=80' },
  { id: 5, name: 'Dawn cup', category: 'kitchen', material: 'Stoneware · Moss', price: 32, tag: '', description: 'A handleless cup that holds a generous coffee and sits warm in two hands. Moss glaze, unglazed foot.', image: 'https://images.unsplash.com/photo-1525629545813-e4e7ba89e506?auto=format&fit=crop&w=900&q=80' },
  { id: 6, name: 'Brass wick trimmer', category: 'candlelight', material: 'Solid brass', price: 28, tag: '', description: 'Long-reach scissors that trim and catch the wick in one cut, for a cleaner, longer burn.', image: 'https://images.unsplash.com/photo-1537948756265-406a522f1a45?auto=format&fit=crop&w=900&q=80' }
];

const FREE_DELIVERY = 75;
const STORAGE_KEY = 'morrow-bag';
const $ = (selector, root = document) => root.querySelector(selector);
const money = (value) => `$${value.toFixed(2)}`;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;

const state = { category: 'all', sort: 'featured' };
let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return saved.filter((item) => products.some((p) => p.id === item.id) && item.quantity > 0);
  } catch {
    return [];
  }
}

function saveCart() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart.map(({ id, quantity }) => ({ id, quantity })))); } catch {}
}

/* ---------- Featured board ---------- */
const featured = products.find((p) => p.tag === 'Restocked') || products[0];
$('#board-feature').innerHTML = `
  <figure class="feature crate-${featured.category}">
    <div class="feature-media"><img src="${featured.image}" alt="${featured.name}" />${featured.tag ? `<span class="product-tag">${featured.tag}</span>` : ''}</div>
    <figcaption>
      <span class="feature-name">${featured.name}</span>
      <span class="price-sign price-sign-lg">${featured.price}</span>
      <span class="feature-description">${featured.description}</span>
      <button class="button button-sign" data-add="${featured.id}">${icon('plus')} Add to bag</button>
    </figcaption>
  </figure>`;

/* ---------- Crates (filter) ---------- */
const crates = $('#crates');
function renderCrates() {
  const entries = [['all', { label: 'All' }], ...Object.entries(categories)];
  crates.innerHTML = entries.map(([key, { label }]) => {
    const count = key === 'all' ? products.length : products.filter((p) => p.category === key).length;
    return `<button class="crate crate-${key}" data-category="${key}" aria-pressed="${state.category === key}">${label}<span>${count}</span></button>`;
  }).join('');
}
crates.addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (button) setCategory(button.dataset.category);
});

function setCategory(category) {
  state.category = category;
  $('#shop').className = `shop crate-${category}${category === 'all' ? '' : ' is-filtered'}`;
  renderCrates();
  renderProducts();
}

document.querySelectorAll('[data-nav-category]').forEach((link) => {
  link.addEventListener('click', () => { setCategory(link.dataset.navCategory); closeMenu(); });
});
$('.primary-nav a[href="#shop"]:not([data-nav-category])').addEventListener('click', () => { setCategory('all'); closeMenu(); });

$('#sort').addEventListener('change', (event) => { state.sort = event.target.value; renderProducts(); });

/* ---------- Product grid ---------- */
const materialLine = (p) => {
  const label = categories[p.category].label;
  return p.material.startsWith(label) ? p.material : `${label} · ${p.material}`;
};

const grid = $('#product-grid');
function visibleProducts() {
  const list = products.filter((p) => state.category === 'all' || p.category === state.category);
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name)
  };
  return sorters[state.sort] ? [...list].sort(sorters[state.sort]) : list;
}

function renderProducts() {
  const list = visibleProducts();
  const label = state.category === 'all' ? 'pieces' : `in ${categories[state.category].label}`;
  $('#result-count').textContent = `${list.length} ${list.length === 1 && state.category === 'all' ? 'piece' : label}`;
  grid.innerHTML = list.map((p) => `
    <li class="product crate-${p.category}">
      <button class="product-media" data-view="${p.id}" aria-label="View details for ${p.name}">
        <img src="${p.image}" alt="" loading="lazy" />
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
        <span class="price-sign">${p.price}</span>
      </button>
      <div class="product-info">
        <h3><button data-view="${p.id}">${p.name}</button></h3>
        <p><span class="crate-dot"></span>${materialLine(p)}</p>
      </div>
      <button class="button button-add" data-add="${p.id}" aria-label="Add ${p.name} to bag, ${money(p.price)}">${icon('plus')} Add to bag</button>
    </li>`).join('');
}

document.addEventListener('click', (event) => {
  const add = event.target.closest('[data-add]');
  if (add) {
    const quantity = 'qty' in add.dataset ? Number($('#qv-qty').textContent) : 1;
    addToCart(Number(add.dataset.add), quantity, add);
    return;
  }
  const view = event.target.closest('[data-view]');
  if (view) openQuickView(Number(view.dataset.view));
});

/* ---------- Quick view ---------- */
const quickView = $('#quick-view');
function openQuickView(id) {
  const p = products.find((item) => item.id === id);
  $('#qv-body').innerHTML = `
    <div class="qv-media crate-${p.category}"><img src="${p.image}" alt="${p.name}" />${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}</div>
    <div class="qv-info crate-${p.category}">
      <h2 id="qv-name">${p.name}</h2>
      <p class="qv-material"><span class="crate-dot"></span>${materialLine(p)}</p>
      <span class="price-sign price-sign-lg">${p.price}</span>
      <p class="qv-description">${p.description}</p>
      <div class="qv-buy">
        <div class="stepper" role="group" aria-label="Quantity">
          <button data-step="-1" aria-label="Decrease quantity">${icon('minus')}</button>
          <span id="qv-qty" aria-live="polite">1</span>
          <button data-step="1" aria-label="Increase quantity">${icon('plus')}</button>
        </div>
        <button class="button button-sign button-wide" data-add="${p.id}" data-qty>${icon('plus')} Add to bag</button>
      </div>
      <p class="qv-note">${icon('truck')} Free delivery on orders over $${FREE_DELIVERY}</p>
    </div>`;
  quickView.showModal();
}
quickView.addEventListener('click', (event) => {
  const step = event.target.closest('[data-step]');
  if (step) {
    const qty = $('#qv-qty');
    qty.textContent = Math.min(9, Math.max(1, Number(qty.textContent) + Number(step.dataset.step)));
  }
  if (event.target.closest('[data-qv-close]') || event.target === quickView) quickView.close();
});

/* ---------- Cart ---------- */
const scrim = $('#scrim');
const cartPanel = $('#cart-panel');
const bagButton = $('#open-cart');
let lastFocus = null;

function addToCart(id, quantity, source) {
  const product = products.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.quantity = Math.min(99, existing.quantity + quantity);
  else cart.push({ id, quantity });
  saveCart();
  flyToBag(source, product);
  if (quickView.open) quickView.close();
  renderCart();
  if (cartPanel.hidden) showToast(`${quantity > 1 ? `${quantity} × ` : ''}${product.name} added`, { label: 'View bag', action: openCart });
}

function flyToBag(source, product) {
  bagButton.classList.remove('bump');
  void bagButton.offsetWidth;
  bagButton.classList.add('bump');
  if (reduceMotion.matches || !source) return;
  const from = (source.closest('.product, .feature, .qv-body')?.querySelector('img') || source).getBoundingClientRect();
  const to = bagButton.getBoundingClientRect();
  const ghost = document.createElement('img');
  ghost.src = product.image;
  ghost.alt = '';
  ghost.className = 'fly';
  const size = 72;
  Object.assign(ghost.style, { width: `${size}px`, height: `${size}px`, left: `${from.left + from.width / 2 - size / 2}px`, top: `${from.top + from.height / 2 - size / 2}px` });
  document.body.append(ghost);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  ghost.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.6}px, ${dy * 0.6 - 60}px) scale(.7)`, opacity: 1, offset: 0.6 },
    { transform: `translate(${dx}px, ${dy}px) scale(.2)`, opacity: 0.2 }
  ], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' }).onfinish = () => ghost.remove();
}

function changeQuantity(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter((entry) => entry.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  const lines = cart.map((item) => ({ ...products.find((p) => p.id === item.id), quantity: item.quantity }));
  const count = lines.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = lines.reduce((sum, item) => sum + item.price * item.quantity, 0);

  document.querySelectorAll('.cart-count').forEach((el) => { el.textContent = count; });
  bagButton.classList.toggle('has-items', count > 0);
  bagButton.setAttribute('aria-label', `Open bag, ${count} ${count === 1 ? 'item' : 'items'}`);
  $('#panel-count').textContent = `(${count})`;

  const remaining = FREE_DELIVERY - subtotal;
  $('#shipping-text').innerHTML = !count
    ? `Free delivery on orders over <strong>$${FREE_DELIVERY}</strong>`
    : remaining > 0
      ? `You're <strong>${money(remaining)}</strong> away from free delivery`
      : `<strong>Free delivery unlocked.</strong> Nice haul.`;
  $('#meter').setAttribute('aria-valuenow', Math.min(subtotal, FREE_DELIVERY));
  $('#meter-fill').style.transform = `scaleX(${Math.min(subtotal / FREE_DELIVERY, 1)})`;
  $('#shipping-meter').classList.toggle('done', remaining <= 0 && count > 0);

  $('#cart-empty').hidden = count > 0;
  $('#cart-footer').hidden = count === 0;
  $('#subtotal').textContent = money(subtotal);
  $('#cart-items').innerHTML = lines.map((item) => `
    <li class="cart-row">
      <div class="cart-thumb crate-${item.category}"><img src="${item.image}" alt="" /></div>
      <div class="cart-line">
        <h3>${item.name}</h3>
        <p>${item.material}</p>
        <div class="stepper stepper-sm" role="group" aria-label="Quantity of ${item.name}">
          <button data-change="-1" data-id="${item.id}" aria-label="Remove one ${item.name}">${icon('minus')}</button>
          <span>${item.quantity}</span>
          <button data-change="1" data-id="${item.id}" aria-label="Add one ${item.name}">${icon('plus')}</button>
        </div>
      </div>
      <div class="cart-side">
        <strong>${money(item.price * item.quantity)}</strong>
        <button class="remove" data-remove="${item.id}" aria-label="Remove ${item.name} from bag">${icon('trash')}<span>Remove</span></button>
      </div>
    </li>`).join('');
}

$('#cart-items').addEventListener('click', (event) => {
  const change = event.target.closest('[data-change]');
  if (change) return changeQuantity(Number(change.dataset.id), Number(change.dataset.change));
  const remove = event.target.closest('[data-remove]');
  if (remove) {
    const id = Number(remove.dataset.remove);
    const removed = cart.find((item) => item.id === id);
    cart = cart.filter((item) => item.id !== id);
    saveCart();
    renderCart();
    $('.panel-head .icon-button').focus();
    showToast(`${products.find((p) => p.id === id).name} removed`, { label: 'Undo', action: () => { cart.push(removed); saveCart(); renderCart(); } });
  }
});

function openCart() {
  lastFocus = document.activeElement;
  toast.classList.remove('show');
  scrim.hidden = false;
  cartPanel.hidden = false;
  requestAnimationFrame(() => { scrim.classList.add('visible'); cartPanel.classList.add('open'); });
  bagButton.setAttribute('aria-expanded', 'true');
  document.body.classList.add('locked');
  setTimeout(() => $('.panel-head .icon-button').focus(), 50);
}

function closeCart() {
  if (cartPanel.hidden) return;
  scrim.classList.remove('visible');
  cartPanel.classList.remove('open');
  bagButton.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('locked');
  setTimeout(() => { scrim.hidden = true; cartPanel.hidden = true; }, 300);
  lastFocus?.focus();
}

bagButton.addEventListener('click', openCart);
scrim.addEventListener('click', closeCart);
cartPanel.addEventListener('click', (event) => { if (event.target.closest('[data-close]')) closeCart(); });
cartPanel.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const focusable = [...cartPanel.querySelectorAll('button:not([hidden]), a[href]')].filter((el) => el.offsetParent);
  const first = focusable[0], last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) { last.focus(); event.preventDefault(); }
  else if (!event.shiftKey && document.activeElement === last) { first.focus(); event.preventDefault(); }
});
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeCart(); closeMenu(); } });

$('#checkout').addEventListener('click', () => showToast('Checkout is a demo — no payment is taken.'));

/* ---------- Auth dialog ---------- */
const authPanel = $('#auth-panel');
$('#open-auth').onclick = () => authPanel.showModal();
authPanel.addEventListener('click', (event) => {
  if (event.target.closest('[data-auth-close]') || event.target === authPanel) authPanel.close();
});
$('#email-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const input = $('#email-input');
  const error = $('#email-error');
  if (!input.value.trim() || !input.checkValidity()) {
    error.textContent = 'Enter an email address like name@example.com.';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }
  error.textContent = '';
  input.removeAttribute('aria-invalid');
  authPanel.close();
  showToast('Email sign-in is a demo — use Google to sign in for real.');
});

/* ---------- Header: menu, announcement ---------- */
const menuButton = $('#open-menu');
const header = $('#site-header');
function closeMenu() {
  header.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menuButton.setAttribute('aria-expanded', String(open));
});

try { if (localStorage.getItem('morrow-announcement') === 'closed') $('#announcement').hidden = true; } catch {}
$('#close-announcement').addEventListener('click', () => {
  $('#announcement').hidden = true;
  try { localStorage.setItem('morrow-announcement', 'closed'); } catch {}
});

/* ---------- Toast ---------- */
const toast = $('#toast');
let toastTimer;
function showToast(message, action) {
  clearTimeout(toastTimer);
  toast.innerHTML = '';
  const text = document.createElement('span');
  text.textContent = message;
  toast.append(text);
  if (action) {
    const button = document.createElement('button');
    button.textContent = action.label;
    button.onclick = () => { toast.classList.remove('show'); action.action(); };
    toast.append(button);
  }
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), action ? 4500 : 2800);
}

renderCrates();
renderProducts();
renderCart();
