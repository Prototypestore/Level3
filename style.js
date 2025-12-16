// ==========================
// Product Data
// ==========================
const products = [
  {
    id: 1,
    name: "Web-style hooded sweatshirt",
    price: "£35",
    img: "https://www.bossjackets.com/wp-content/uploads/2023/09/Spider-Web-Fleece-Hoodie-3.jpg",
    alt: "Female web-style hooded sweatshirt",
    colors: ["beige", "white", "black", "brown"],
    sizes: ["S", "M", "L", "XL"],
    description: "Every thread tells a story. Crafted for comfort and style."
  },
  {
    id: 2,
    name: "Plain black T-shirt",
    price: "£25",
    img: "https://tse3.mm.bing.net/th/id/OIP.gGJPehhQ3_3iAKW934eJmQHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    alt: "Male plain black T-shirt",
    colors: ["black", "white"],
    sizes: ["S", "M", "L", "XL"],
    description: "Minimalist design with maximum comfort."
  },
  {
    id: 3,
    name: "Grey joggers",
    price: "£30",
    img: "https://i5.walmartimages.com/seo/Ma-Croix-Womens-Sweatpants-Skinny-Fit-Jogger-Pants-with-Pockets_439fd5ca-2316-4794-bf89-5b2678d9021a.54953153b803a16bcfe3264631b5151c.jpeg",
    alt: "Female grey joggers",
    colors: ["grey", "black"],
    sizes: ["S", "M", "L"],
    description: "Soft, flexible and perfect for every day."
  }
  // Add more products as needed
];

// ==========================
// Render Shop & Trending Grids
// ==========================
const shopGrid = document.querySelector(".shop .grid");
const trendingGrid = document.querySelector(".trending .grid");

function renderProducts(productsArray, container) {
  container.innerHTML = ""; // Clear container
  productsArray.forEach(product => {
    const article = document.createElement("article");
    article.classList.add("product");
    article.innerHTML = `
      <a href="product.html?id=${product.id}">
        <img src="${product.img}" alt="${product.alt}">
        <h3>${product.name}</h3>
        <p>${product.price}</p>
      </a>
    `;
    container.appendChild(article);
  });
}

// Render both grids
if (shopGrid) renderProducts(products, shopGrid);
if (trendingGrid) renderProducts(products.slice(0, 4), trendingGrid);

// ==========================
// Slide Controls for Deals Section
// ==========================
const slides = document.querySelector(".deals .slides");
const prevBtn = document.querySelector(".slide-button:first-of-type");
const nextBtn = document.querySelector(".slide-button:last-of-type");

if (slides && prevBtn && nextBtn) {
  let offset = 0;
  const slideWidth = slides.children[0].getBoundingClientRect().width;

  prevBtn.addEventListener("click", () => {
    offset = offset - slideWidth < 0 ? 0 : offset - slideWidth;
    slides.style.transform = `translateX(-${offset}px)`;
  });

  nextBtn.addEventListener("click", () => {
    const maxOffset = slides.scrollWidth - slides.clientWidth;
    offset = offset + slideWidth > maxOffset ? maxOffset : offset + slideWidth;
    slides.style.transform = `translateX(-${offset}px)`;
  });
}

// ==========================
// Render Product Detail Page Dynamically
// ==========================
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

if (productId) {
  const product = products.find(p => p.id == productId);
  if (product) {
    // Main container
    const main = document.querySelector("main");
    main.innerHTML = `
      <article class="parent">
        <div class="img">
          <img src="${product.img}" alt="${product.alt}">
        </div>
        <div class="info">
          <h1>${product.name}</h1>
          <p class="price">${product.price}</p>
          <div class="star">
            <!-- Example star SVG -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="gold">
              <polygon points="10,1 12,7 18,7 13,11 15,17 10,13 5,17 7,11 2,7 8,7"/>
            </svg>
          </div>

          <fieldset class="fieldset2 f1">
            <legend>Color</legend>
            ${product.colors.map((color, i) => `
              <label>
                <input type="radio" name="color" value="${color}" ${i===0?'checked':''}>
                <span class="swatch ${color}"></span>
              </label>
            `).join("")}
          </fieldset>

          <fieldset class="fieldset2 f2">
            <legend>Size</legend>
            <div class="size">
              ${product.sizes.map((size, i) => `
                <label>
                  <input type="radio" name="size" value="${size}" ${i===0?'checked':''}>
                  <span class="size-box">${size}</span>
                </label>
              `).join("")}
            </div>
          </fieldset>

          <div class="quantity">
            <button type="button" class="qty-btn" id="decrease">-</button>
            <input type="number" id="qty-value" value="1" min="1">
            <button type="button" class="qty-btn" id="increase">+</button>
          </div>

          <div class="action">
            <form>
              <button type="submit">Add to Cart</button>
            </form>
            <div>
              <h2>Product Info <span id="btn-pro">+</span></h2>
              <p>${product.description}</p>
            </div>
            <div>
              <h2>Delivery Info <span id="btn-re">+</span></h2>
              <p>Free shipping on orders over £120. 3-5 business days delivery.</p>
            </div>
            <p id="styles">See similar styles</p>
          </div>
        </div>
      </article>
    `;

    // ==========================
    // Quantity Buttons
    // ==========================
    const qtyInput = document.getElementById("qty-value");
    document.getElementById("increase").addEventListener("click", () => {
      qtyInput.value = parseInt(qtyInput.value) + 1;
    });
    document.getElementById("decrease").addEventListener("click", () => {
      if (parseInt(qtyInput.value) > 1) qtyInput.value = parseInt(qtyInput.value) - 1;
    });

    // ==========================
    // Accordion Toggle
    // ==========================
    document.querySelectorAll(".action > div").forEach(section => {
      const header = section.querySelector("h2");
      const content = section.querySelector("p");
      const toggleBtn = header.querySelector("span");

      header.addEventListener("click", () => {
        content.classList.toggle("show");
        toggleBtn.textContent = toggleBtn.textContent === "+" ? "-" : "+";
      });
    });
  }
}
