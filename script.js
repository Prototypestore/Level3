// -------------------- Dynamic Product Rendering --------------------
async function loadProducts() {
  const response = await fetch('products.json');
  const products = await response.json();

  const shopGrid = document.getElementById('product-grid');
  const trendingGrid = document.getElementById('trending-grid');

  products.forEach(product => {
    const inStockVariants = product.variants.filter(v => v.stock > 0);
    if (!inStockVariants.length) return;

    let bestVariant = inStockVariants.find(v => v.trending) || inStockVariants[0];

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

    const lowStockBadge = bestVariant.stock <= 5 ? '<div class="low-stock">Low Stock!</div>' : '';

    const productURL = `product.html?id=${product.id}&color=${encodeURIComponent(bestVariant.color)}&size=${encodeURIComponent(bestVariant.size)}`;

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

    shopGrid.insertAdjacentHTML('beforeend', cardHTML);

    if (product.trending) {
      trendingGrid.insertAdjacentHTML('beforeend', cardHTML);
    }
  });
}

loadProducts();

// -------------------- Carousel / Slides --------------------
const track = document.getElementById('carousel-slides');
const slides = Array.from(track.children);
const slideWidth = 560;
let index = 0;

if (slides.length > 0) {
  const firstClone = slides[0].cloneNode(true);
  track.appendChild(firstClone);
}

function showSlide(i) {
  track.style.transition = "transform 0.5s ease";
  track.style.transform = `translateX(-${i * slideWidth}px)`;
}

document.querySelector('.slide-btn.next').addEventListener('click', () => {
  index++;
  showSlide(index);
});

document.querySelector('.slide-btn.prev').addEventListener('click', () => {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
});

setInterval(() => {
  index++;
  showSlide(index);
}, 4000);

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
    const totalProducts = cart.length;
    cartCounter.textContent = totalProducts;
    cartCounter.style.display = totalProducts > 0 ? 'flex' : 'none';
  };

  updateCartCounter();
  window.addEventListener('storage', updateCartCounter);
});

// -------------------- Live Product Search + Filter --------------------
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector('input[name="query"]');
  const shopGrid = document.getElementById("product-grid");
  const filterSelect = document.getElementById("filter-select"); // Dropdown to filter: all/trending/categories

  let products = [];

  async function loadAllProducts() {
    const res = await fetch("products.json");
    products = await res.json();
    renderProducts(products);
  }

  loadAllProducts();

  function renderProducts(list, query = "") {
    shopGrid.innerHTML = "";
    const q = query.toLowerCase();

    list.forEach(product => {
      const inStockVariants = product.variants.filter(v => v.stock > 0);
      if (!inStockVariants.length) return;

      const bestVariant = inStockVariants.find(v => v.trending) || inStockVariants[0];
      const displayPrice = bestVariant.price.toFixed(2);

      let titleHTML = product.title;
      if (q && product.title.toLowerCase().includes(q)) {
        const regex = new RegExp(`(${query})`, "gi");
        titleHTML = product.title.replace(regex, '<mark>$1</mark>');
      }

      const cardHTML = `
        <article class="product-card">
          <a href="product.html?id=${product.id}&color=${encodeURIComponent(bestVariant.color)}&size=${encodeURIComponent(bestVariant.size)}">
            <img src="${product.image}" alt="${product.title}">
            <h3>${titleHTML}</h3>
            <p class="price">£${displayPrice}</p>
          </a>
        </article>
      `;
      shopGrid.insertAdjacentHTML("beforeend", cardHTML);
    });

    if (list.length === 0) {
      shopGrid.innerHTML = `<p class="no-results">No products match your search/filter.</p>`;
    }
  }

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const filter = filterSelect.value;

    let filtered = [...products];

    if (query) {
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) ||
        (product.categories && product.categories.some(cat => cat.toLowerCase().includes(query)))
      );
    }

    if (filter === "trending") {
      filtered = filtered.filter(product => product.trending);
    } else if (filter !== "all") {
      // Assume filter value matches category name
      filtered = filtered.filter(product => product.categories && product.categories.includes(filter));
    }

    renderProducts(filtered, query);
  }

  searchInput.addEventListener("input", applyFilters);
  filterSelect.addEventListener("change", applyFilters);
});
