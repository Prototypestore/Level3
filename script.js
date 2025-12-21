// -------------------- Dynamic Product Rendering --------------------
async function loadProducts() {
  const response = await fetch('products.json');
  const products = await response.json();

  const shopGrid = document.getElementById('product-grid');
  const trendingGrid = document.getElementById('trending-grid');

  products.forEach(product => {
    // ====== SKIP OUT-OF-STOCK PRODUCTS FOR SHOP GRID ======
    const inStockVariants = product.variants.filter(v => v.stock > 0);
    if (!inStockVariants.length) return;

    // ====== CALCULATE BEST VARIANT ======
    let bestVariant = inStockVariants.find(v => v.trending) || inStockVariants[0];

    // ====== CALCULATE PROMOTION PRICE ======
    let displayPrice = bestVariant.price;
    const now = new Date();
    if (product.promotions && product.promotions.length > 0) {
      product.promotions.forEach(promo => {
        const start = new Date(promo.start);
        const end = new Date(promo.end);
        if (promo.type === "sale" && now >= start && now <= end) {
          displayPrice = (bestVariant.price * (1 - promo.discount)).toFixed(2);
        }
      });
    }

    // ====== LOW STOCK BADGE ======
    const lowStockBadge = bestVariant.stock <= 5 ? '<div class="low-stock">Low Stock!</div>' : '';

    // ====== SMART LINK TO PRODUCT PAGE WITH VARIANT ======
    const productURL = `product.html?id=${product.id}&color=${encodeURIComponent(bestVariant.color)}&size=${encodeURIComponent(bestVariant.size)}`;

    // ====== PRODUCT CARD HTML ======
    const cardHTML = `
      <article class="product-card">
        ${lowStockBadge}
        <a href="${productURL}">
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p class="price">£${displayPrice}</p>
        </a>
      </article>
    `;

    // Insert into shop grid
    shopGrid.insertAdjacentHTML('beforeend', cardHTML);

    // Insert into trending grid if flagged
    if (product.trending) {
      trendingGrid.insertAdjacentHTML('beforeend', cardHTML);
    }
  });
}

// Load products on page load
loadProducts();

// -------------------- Carousel / Slides --------------------
const track = document.getElementById('carousel-slides');
const slides = Array.from(track.children);
const slideWidth = 560;
let index = 0;

// Clone first slide for seamless loop
if (slides.length > 0) {
  const firstClone = slides[0].cloneNode(true);
  track.appendChild(firstClone);
}

function showSlide(i) {
  track.style.transition = "transform 0.5s ease";
  track.style.transform = `translateX(-${i * slideWidth}px)`;
}

// Next
document.querySelector('.slide-btn.next').addEventListener('click', () => {
  index++;
  showSlide(index);
});

// Prev
document.querySelector('.slide-btn.prev').addEventListener('click', () => {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
});

// Auto-slide
setInterval(() => {
  index++;
  showSlide(index);
}, 4000);

// Loop reset
track.addEventListener('transitionend', () => {
  if (index === slides.length) {
    track.style.transition = "none";
    index = 0;
    track.style.transform = `translateX(0px)`;
    setTimeout(() => { track.style.transition = "transform 0.5s ease"; }, 50);
  }
});

// ====== LANDING PAGE CART COUNTER ======
document.addEventListener('DOMContentLoaded', () => {
  const cartIcon = document.querySelector('.cart-icon');
  if (!cartIcon) return;

  let cartCounter = document.getElementById('cart-counter');
  if (!cartCounter) {
    cartCounter = document.createElement('div');
    cartCounter.id = 'cart-counter';
    cartIcon.style.position = 'relative';
    cartIcon.appendChild(cartCounter);

    Object.assign(cartCounter.style, {
      position: 'absolute',
      top: '-0.5rem',
      right: '-0.5rem',
      background: '#ff0000',
      color: '#fff',
      padding: '0.2rem 0.5rem',
      borderRadius: '50%',
      fontWeight: 'bold',
      fontSize: '0.75rem',
      minWidth: '1.2rem',
      height: '1.2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none',
    });
  }

  const updateCartCounter = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalProducts = cart.length; // number of unique products
    cartCounter.textContent = totalProducts;
    cartCounter.style.display = totalProducts > 0 ? 'flex' : 'none';
  };

  // Initial render
  updateCartCounter();

  // Optional: update counter if user adds/removes items from another tab
  window.addEventListener('storage', updateCartCounter);
});

// Live search focusing on categories
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();

  if (!query) {
    renderProducts(products);
    return;
  }

  // Filter products based on category match first
  const filtered = products.filter(product => 
    product.categories?.some(cat => cat.toLowerCase().includes(query))
  );

  renderProducts(filtered, query);
});

// -------------------- Hamburger --------------------
document.addEventListener('DOMContentLoaded', () => {
  const openMenuSVG = document.getElementById('open-profile-menu');
  if (openMenuSVG) {
    openMenuSVG.addEventListener('click', () => {
      // Redirect to login.html
      window.location.href = 'login.html';
    });
  }
});

