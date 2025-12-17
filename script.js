// -------------------- Dynamic Product Rendering --------------------
async function loadProducts() {
  const response = await fetch('products.json');
  const products = await response.json();

  const shopGrid = document.getElementById('product-grid');
  const trendingGrid = document.getElementById('trending-grid');

  products.forEach(product => {
    if (product.stock <= 0) return; // Skip out-of-stock

    // Calculate promotion price if applicable
    let displayPrice = product.price;
    const now = new Date();
    if (product.promotions && product.promotions.length > 0) {
      product.promotions.forEach(promo => {
        const start = new Date(promo.start);
        const end = new Date(promo.end);
        if (promo.type === "sale" && now >= start && now <= end) {
          displayPrice = (product.price * (1 - promo.discount)).toFixed(2);
        }
      });
    }

    const lowStockBadge = product.stock <= 5 ? '<span class="low-stock">Low Stock!</span>' : '';

    // Product Card HTML
    const cardHTML = `
      <article class="product-card">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.title}">
          <h3>${product.title}</h3>
          <p class="price">£${displayPrice} ${lowStockBadge}</p>
        </a>
      </article>
    `;

    // Insert into shop
    shopGrid.insertAdjacentHTML('beforeend', cardHTML);

    // Insert into trending if flagged
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
