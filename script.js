// === PRODUCTS DATA ===
const products = [
  { id: "p1", name: "Web-style Hoodie", price: 35, image: "https://www.bossjackets.com/wp-content/uploads/2023/09/Spider-Web-Fleece-Hoodie-3.jpg" },
  { id: "p2", name: "Plain Black T-shirt", price: 25, image: "https://tse3.mm.bing.net/th/id/OIP.gGJPehhQ3_3iAKW934eJmQHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: "p3", name: "Grey Joggers", price: 30, image: "https://i5.walmartimages.com/seo/Ma-Croix-Womens-Sweatpants-Skinny-Fit-Jogger-Pants-with-Pockets_439fd5ca-2316-4794-bf89-5b2678d9021a.54953153b803a16bcfe3264631b5151c.jpeg" }
];

// === CART ===
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const grid = document.getElementById('product-grid');
const cartItems = document.getElementById('cart-items');
const totalEl = document.getElementById('total');
const cartSection = document.getElementById('cart');

// Render products
function renderProducts(productsToRender) {
  grid.innerHTML = '';
  productsToRender.forEach(product => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <figure>
        <img src="${product.image}" alt="${product.name}">
        <figcaption>${product.name} - £${product.price}</figcaption>
      </figure>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.id));
  });
}

// Add to cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showCart();
}

// Update cart count
function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.reduce((a,b)=>a+b.qty,0);
}

// Render cart
function renderCart() {
  cartItems.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <strong>${item.name}</strong> - £${item.price} x 
      <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="qty-input">
      <button class="remove" data-id="${item.id}">Remove</button>
    `;
    cartItems.appendChild(li);
  });
  totalEl.textContent = total.toFixed(2);

  document.querySelectorAll('.qty-input').forEach(input => {
    input.addEventListener('change', e => {
      const item = cart.find(i => i.id === input.dataset.id);
      item.qty = parseInt(e.target.value);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });
  });

  document.querySelectorAll('.remove').forEach(btn => {
    btn.addEventListener('click', () => {
      cart = cart.filter(i => i.id !== btn.dataset.id);
      localStorage.setItem('cart', JSON.stringify(cart));
      renderCart();
      updateCartCount();
    });
  });
}

// Show cart
function showCart() {
  cartSection.hidden = false;
  renderCart();
}

// Close cart
document.getElementById('close-cart').addEventListener('click', () => {
  cartSection.hidden = true;
});

// Checkout placeholder
document.getElementById('checkout-btn').addEventListener('click', () => {
  alert('Checkout placeholder. Integrate Stripe or PayPal here.');
});

// Search functionality
document.getElementById('search').addEventListener('input', e => {
  const filtered = products.filter(p => p.name.toLowerCase().includes(e.target.value.toLowerCase()));
  renderProducts(filtered);
});

// Initial render
renderProducts(products);
updateCartCount();
