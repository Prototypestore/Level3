// ====== GET PRODUCT ID FROM URL ====== //
const params = new URLSearchParams(window.location.search);
const productId = params.get("id") || "1"; // default to 1 if no id

// ====== FETCH PRODUCT DATA FROM JSON ====== //
fetch("products.json")
  .then((res) => res.json())
  .then((products) => {
    const product = products.find((p) => p.id === productId);

    if (!product) {
      document.querySelector(".product-title").textContent = "Product Not Found";
      document.querySelector(".product-price").textContent = "-";
      document.querySelector(".product-image img").src = "";
      document.getElementById("product-details").textContent = "Sorry, this product does not exist.";
      document.getElementById("returns").textContent = "";
      document.querySelector(".btn-add-to-cart").disabled = true;
      return;
    }

    // ====== CALCULATE PROMOTION PRICE ====== //
    let displayPrice = product.price;
    const today = new Date();

    if (product.promotions && product.promotions.length > 0) {
      product.promotions.forEach((promo) => {
        const start = new Date(promo.start);
        const end = new Date(promo.end);
        if (today >= start && today <= end) {
          if (promo.type === "sale" && promo.discount) {
            displayPrice = (product.price * (1 - promo.discount)).toFixed(2);
          }
        }
      });
    }

    // ====== UPDATE PRODUCT DOM ====== //
    document.querySelector(".product-title").textContent = product.title;
    document.querySelector(".product-price").textContent = `£${displayPrice}`;
    const img = document.querySelector(".product-image img");
    img.src = product.image;
    img.alt = product.title;

    document.getElementById("product-details").textContent = product.details;
    document.getElementById("returns").textContent = product.returns;

    // ====== STOCK HANDLING ====== //
    const addToCartBtn = document.querySelector(".btn-add-to-cart");
    if (product.stock === 0) {
      addToCartBtn.disabled = true;
      addToCartBtn.textContent = "Out of Stock";
      document.querySelector(".product-price").textContent += " (Out of Stock)";
    } else if (product.stock <= 5) {
      const lowStockBadge = document.createElement("div");
      lowStockBadge.className = "low-stock";
      lowStockBadge.textContent = "Low Stock!";
      document.querySelector(".product-info").prepend(lowStockBadge);
    }

    // ====== QUANTITY BUTTONS ====== //
    const decreaseBtn = document.getElementById("decrease");
    const increaseBtn = document.getElementById("increase");
    const qtyInput = document.getElementById("qty-value");

    function updateButtons() {
      const qty = parseInt(qtyInput.value);
      decreaseBtn.disabled = qty <= 1;
      increaseBtn.disabled = qty >= product.stock;
    }

    decreaseBtn.addEventListener("click", () => {
      let qty = parseInt(qtyInput.value);
      if (qty > 1) qtyInput.value = qty - 1;
      updateButtons();
    });

    increaseBtn.addEventListener("click", () => {
      let qty = parseInt(qtyInput.value);
      if (qty < product.stock) qtyInput.value = qty + 1;
      updateButtons();
    });

    qtyInput.addEventListener("input", () => {
      let qty = parseInt(qtyInput.value);
      if (isNaN(qty) || qty < 1) qtyInput.value = 1;
      else if (qty > product.stock) qtyInput.value = product.stock;
      updateButtons();
    });

    updateButtons();

    // ====== ACCORDION TOGGLE ====== //
    document.getElementById("btn-pro").addEventListener("click", () => {
      document.getElementById("product-details").classList.toggle("show");
    });

    document.getElementById("btn-re").addEventListener("click", () => {
      document.getElementById("returns").classList.toggle("show");
    });

    // ====== DYNAMIC VARIANTS (OPTIONAL) ====== //
    if (product.variants) {
      const colorFieldset = document.querySelector(".color-fieldset .sizes") || document.querySelector(".color-fieldset");
      colorFieldset.innerHTML = ""; // Clear existing
      product.variants.color.forEach((c) => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="radio" name="color" value="${c}">
                           <span class="swatch ${c.toLowerCase()}" title="${c}"></span>`;
        colorFieldset.appendChild(label);
      });

      const sizeFieldset = document.querySelector(".size-fieldset .sizes");
      sizeFieldset.innerHTML = "";
      product.variants.size.forEach((s) => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="radio" name="size" value="${s}">
                           <span class="size-box">${s}</span>`;
        sizeFieldset.appendChild(label);
      });
    }

  })
  .catch((err) => {
    console.error("Failed to load products.json", err);
  });
