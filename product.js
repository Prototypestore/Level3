// ====== GET PRODUCT INFO FROM URL ======
const params = new URLSearchParams(window.location.search);
const productId = params.get("id") || "1";
let selectedColor = params.get("color") || null;
let selectedSize = params.get("size") || null;

// ====== FETCH PRODUCT DATA ======
fetch("products.json")
  .then(res => res.json())
  .then(products => {
    const product = products.find(p => p.id === productId);

    if (!product) {
      document.querySelector(".product-title").textContent = "Product Not Found";
      document.querySelector(".product-price").textContent = "-";
      document.querySelector(".product-image img").src = "";
      document.getElementById("product-details").textContent = "Sorry, this product does not exist.";
      document.getElementById("returns").textContent = "";
      document.querySelector(".btn-add-to-cart").disabled = true;
      return;
    }

    const getVariant = (color, size) => product.variants.find(v => v.color === color && v.size === size);

    const updateURL = () => {
      const url = new URL(window.location);
      url.searchParams.set("id", productId);
      url.searchParams.set("color", selectedColor);
      url.searchParams.set("size", selectedSize);
      window.history.replaceState({}, "", url);
    };

    const updatePriceStock = () => {
      const variant = getVariant(selectedColor, selectedSize);
      const priceEl = document.querySelector(".product-price");
      const addToCartBtn = document.querySelector(".btn-add-to-cart");

      if (!variant) {
        priceEl.textContent = "-";
        addToCartBtn.disabled = true;
        addToCartBtn.textContent = "Unavailable";
        return;
      }

      const calculatePrice = (variantPrice, promotions = []) => {
        let finalPrice = variantPrice;
        const today = new Date();

        promotions.forEach(promo => {
          if (
            promo?.type === "sale" &&
            typeof promo.discount === "number" &&
            promo.start &&
            promo.end
          ) {
            const start = new Date(promo.start);
            const end = new Date(promo.end);
            if (today >= start && today <= end) finalPrice = variantPrice * (1 - promo.discount);
          }
        });

        return finalPrice.toFixed(2);
      };

      priceEl.textContent = `£${calculatePrice(variant.price, product.promotions)}`;

      addToCartBtn.disabled = variant.stock === 0;
      addToCartBtn.textContent = variant.stock === 0 ? "Out of Stock" : "Add to Cart";

      document.querySelectorAll(".low-stock").forEach(el => el.remove());
      if (variant.stock > 0 && variant.stock <= 5) {
        const lowStockBadge = document.createElement("div");
        lowStockBadge.className = "low-stock";
        lowStockBadge.textContent = "Low Stock!";
        document.querySelector(".product-info").prepend(lowStockBadge);
      }

      const qtyInput = document.getElementById("qty-value");
      qtyInput.value = 1;
      qtyInput.max = variant.stock;

      updateQtyButtons();
      updateURL();
    };

    const updateQtyButtons = () => {
      const qtyInput = document.getElementById("qty-value");
      const decreaseBtn = document.getElementById("decrease");
      const increaseBtn = document.getElementById("increase");
      const variant = getVariant(selectedColor, selectedSize);

      const qty = parseInt(qtyInput.value);
      decreaseBtn.disabled = qty <= 1;
      increaseBtn.disabled = !variant || qty >= variant.stock;
    };

    document.querySelector(".product-title").textContent = product.title;
    document.querySelector(".product-image img").src = product.image;
    document.querySelector(".product-image img").alt = product.title;
    document.getElementById("product-details").textContent = product.details;
    document.getElementById("returns").textContent = product.returns;

    if (product.variants) {
      const colors = [...new Set(product.variants.map(v => v.color))];
      const sizes = [...new Set(product.variants.map(v => v.size))];

      const colorFieldset = document.querySelector(".color-fieldset .sizes") || document.querySelector(".color-fieldset");
      colorFieldset.innerHTML = "";
      colors.forEach(c => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="radio" name="color" value="${c}">
                           <span class="swatch ${c.toLowerCase()}" title="${c}"></span>`;
        colorFieldset.appendChild(label);
      });

      const sizeFieldset = document.querySelector(".size-fieldset .sizes");
      sizeFieldset.innerHTML = "";
      sizes.forEach(s => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="radio" name="size" value="${s}">
                           <span class="size-box">${s}</span>`;
        sizeFieldset.appendChild(label);
      });

      if (!selectedColor || !selectedSize) {
        const inStockVariants = product.variants.filter(v => v.stock > 0);
        let bestVariant = inStockVariants.find(v => v.trending) || inStockVariants.sort((a, b) => b.stock - a.stock)[0];
        selectedColor = selectedColor || bestVariant.color;
        selectedSize = selectedSize || bestVariant.size;
      }

      const refreshOptionAvailability = () => {
        document.querySelectorAll('input[name="size"]').forEach(input => {
          const variant = getVariant(selectedColor, input.value);
          input.disabled = !variant || variant.stock === 0;
          input.nextElementSibling.style.opacity = input.disabled ? 0.5 : 1;
        });
        document.querySelectorAll('input[name="color"]').forEach(input => {
          const hasStock = sizes.some(s => {
            const variant = getVariant(input.value, s);
            return variant && variant.stock > 0;
          });
          input.disabled = !hasStock;
          input.nextElementSibling.style.opacity = input.disabled ? 0.5 : 1;
        });
      };

      document.querySelector(`input[name="color"][value="${selectedColor}"]`)?.click();
      document.querySelector(`input[name="size"][value="${selectedSize}"]`)?.click();

      document.querySelectorAll('input[name="color"]').forEach(input => {
        input.addEventListener("change", e => {
          selectedColor = e.target.value;
          const firstAvailableSize = sizes.find(s => {
            const variant = getVariant(selectedColor, s);
            return variant && variant.stock > 0;
          });
          if (firstAvailableSize) {
            selectedSize = firstAvailableSize;
            document.querySelector(`input[name="size"][value="${selectedSize}"]`)?.click();
          }
          refreshOptionAvailability();
          updatePriceStock();
        });
      });

      document.querySelectorAll('input[name="size"]').forEach(input => {
        input.addEventListener("change", e => {
          selectedSize = e.target.value;
          refreshOptionAvailability();
          updatePriceStock();
        });
      });

      refreshOptionAvailability();
      updatePriceStock();
    }

    // ====== QUANTITY BUTTONS FIXED ======
    const decreaseBtn = document.getElementById("decrease");
    const increaseBtn = document.getElementById("increase");
    const qtyInput = document.getElementById("qty-value");

    decreaseBtn.addEventListener("click", () => {
      const variant = getVariant(selectedColor, selectedSize);
      qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
      if (parseInt(qtyInput.value) > variant.stock) qtyInput.value = variant.stock;
      updateQtyButtons();
    });

    increaseBtn.addEventListener("click", () => {
      const variant = getVariant(selectedColor, selectedSize);
      qtyInput.value = Math.min(variant.stock, parseInt(qtyInput.value) + 1);
      updateQtyButtons();
    });

    qtyInput.addEventListener("input", () => {
      const variant = getVariant(selectedColor, selectedSize);
      let val = parseInt(qtyInput.value);
      if (isNaN(val) || val < 1) val = 1;
      if (val > variant.stock) val = variant.stock;
      qtyInput.value = val;
      updateQtyButtons();
    });

    // ====== ACCORDION ======
    document.getElementById("btn-pro").addEventListener("click", () => {
      document.getElementById("product-details").classList.toggle("show");
    });
    document.getElementById("btn-re").addEventListener("click", () => {
      document.getElementById("returns").classList.toggle("show");
    });
  })
  .catch(err => console.error("Failed to load products.json", err));

// ====== ADD TO CART (PATCHED) ======
document.addEventListener('DOMContentLoaded', () => {
  const addToCartForm = document.querySelector('.product-options');
  const cartIcon = document.querySelector('.cart-icon');
  if (!addToCartForm || !cartIcon) return;

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
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCounter.textContent = totalQty;
    cartCounter.style.display = totalQty > 0 ? 'flex' : 'none';
  };

  updateCartCounter();

  addToCartForm.addEventListener('submit', e => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    if (!productId) return;

    const productName = document.querySelector('.product-title')?.textContent.trim();
    const productPrice = parseFloat(
      document.querySelector('.product-price')?.textContent.replace('£', '')
    );
    const productImage = document.querySelector('.product-image img')?.src;
    const selectedColor = document.querySelector('input[name="color"]:checked')?.value;
    const selectedSize = document.querySelector('input[name="size"]:checked')?.value;
    const quantity = parseInt(document.getElementById('qty-value')?.value) || 1;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemKey = `${productId}-${selectedColor}-${selectedSize}`;

    const existingItemIndex = cart.findIndex(item => item.key === itemKey);
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity = quantity;
    } else {
      cart.push({
        key: itemKey,
        id: productId,
        name: productName,
        price: productPrice,
        quantity,
        image: productImage,
        color: selectedColor,
        size: selectedSize
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
  });
});
