// ====== CART PAGE LOGIC ======
document.addEventListener("DOMContentLoaded", () => {
  const cartBody = document.getElementById("cart-items-body");
  const subtotalEl = document.getElementById("summary-subtotal");
  const totalEl = document.getElementById("summary-total");

  // Get cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ====== RENDER CART ======
  function renderCart() {
    cartBody.innerHTML = "";
    let subtotal = 0;

    // Empty cart state
    if (cart.length === 0) {
      cartBody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center; padding:2rem;">
            Your cart is empty.
          </td>
        </tr>
      `;
      subtotalEl.textContent = "£0.00";
      totalEl.textContent = "£0.00";
      return;
    }

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="product-info">
          <img src="${item.image}" alt="${item.name}">
          <div>
            <strong>${item.name}</strong><br>
            <small>${item.color} · ${item.size}</small><br>
            <button class="remove-item" data-index="${index}">
              Remove
            </button>
          </div>
        </td>

        <td>£${item.price.toFixed(2)}</td>

        <td>
          <input
            type="number"
            min="1"
            value="${item.quantity}"
            data-index="${index}"
            class="cart-qty"
          >
        </td>

        <td>£${itemTotal.toFixed(2)}</td>
      `;

      cartBody.appendChild(row);
    });

    subtotalEl.textContent = `£${subtotal.toFixed(2)}`;
    totalEl.textContent = `£${subtotal.toFixed(2)}`;

    attachEvents();
  }

  // ====== EVENT HANDLERS ======
  function attachEvents() {
    // Remove item
    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart.splice(index, 1);
        saveCart();
        renderCart();
      });
    });

    // Update quantity
    document.querySelectorAll(".cart-qty").forEach(input => {
      input.addEventListener("change", () => {
        const index = input.dataset.index;
        let value = parseInt(input.value);

        if (isNaN(value) || value < 1) value = 1;
        input.value = value;

        cart[index].quantity = value;
        saveCart();
        renderCart();
      });
    });
  }

  // ====== SAVE CART ======
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Initial render
  renderCart();
});
