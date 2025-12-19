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
    if (!product) return;

    const getVariant = (color, size) =>
      product.variants.find(v => v.color === color && v.size === size);

    // ====== UPDATE DOM ======
    document.querySelector(".product-title").textContent = product.title;
    document.querySelector(".product-image img").src = product.image;

    // ====== VARIANT DEFAULT ======
    if (!selectedColor || !selectedSize) {
      const v = product.variants.find(v => v.stock > 0);
      selectedColor = v.color;
      selectedSize = v.size;
    }

    // ====== PRICE / STOCK ======
    function updatePriceStock() {
      const variant = getVariant(selectedColor, selectedSize);
      if (!variant) return;

      document.querySelector(".product-price").textContent = `£${variant.price}`;
      document.getElementById("qty-value").max = variant.stock;
    }

    updatePriceStock();

    // ====== QUANTITY CONTROLS ======
    const qtyInput = document.getElementById("qty-value");
    document.getElementById("increase").onclick = () => {
      qtyInput.value = Math.min(+qtyInput.value + 1, qtyInput.max);
    };
    document.getElementById("decrease").onclick = () => {
      qtyInput.value = Math.max(+qtyInput.value - 1, 1);
    };

    // ======================================================
    // 🔒 ADD TO CART — ATTACH ONCE (THIS FIXES EVERYTHING)
    // ======================================================
    const form = document.querySelector(".product-options");

    if (form && !form.dataset.bound) {
      form.dataset.bound = "true";

      form.addEventListener("submit", e => {
        e.preventDefault();

        const quantity = parseInt(qtyInput.value) || 1;
        const key = `${productId}-${selectedColor}-${selectedSize}`;

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existing = cart.find(item => item.key === key);

        if (existing) {
          // ✅ SET quantity (NOT add)
          existing.quantity = quantity;
        } else {
          cart.push({
            key,
            id: productId,
            name: product.title,
            price: parseFloat(
              document.querySelector(".product-price").textContent.replace("£", "")
            ),
            quantity,
            image: product.image,
            color: selectedColor,
            size: selectedSize
          });
        }

        localStorage.setItem("cart", JSON.stringify(cart));
      });
    }
  })
  .catch(err => console.error(err));
