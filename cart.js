// ====== CART PAGE LOGIC ======
document.addEventListener("DOMContentLoaded", () => {
  const cartBody = document.getElementById("cart-items-body");
  const subtotalEl = document.getElementById("summary-subtotal");
  const totalEl = document.getElementById("summary-total");
  const updateBtn = document.querySelector(".btn-update-cart");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let editMode = false;

  // ====== CART COUNTER ======
  function updateCartCounter() {
    const counter = document.getElementById("cart-counter");
    if (!counter) return;
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    counter.textContent = totalQty;
    counter.style.display = totalQty > 0 ? "flex" : "none";
  }

  // ====== RENDER CART ======
  function renderCart() {
    cartBody.innerHTML = "";
    let subtotal = 0;

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
      updateCartCounter();
      return;
    }

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="product-info">
          <img src="${item.image}" alt="${item.name}" style="width:80px; height:auto;">
          <div>
            <strong>${item.name}</strong><br>
            <button class="remove-item" data-index="${index}">Remove</button>
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
            ${!editMode ? "disabled" : ""}
          >
        </td>
        <td>£${itemTotal.toFixed(2)}</td>
      `;
      cartBody.appendChild(row);
    });

    subtotalEl.textContent = `£${subtotal.toFixed(2)}`;
    totalEl.textContent = `£${subtotal.toFixed(2)}`;

    attachEvents();
    updateCartCounter();
  }

  // ====== EVENT HANDLERS ======
  function attachEvents() {
    // Remove item - always active
    document.querySelectorAll(".remove-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart.splice(index, 1);
        saveCart();
        renderCart();
      });
    });

    // Quantity input
    document.querySelectorAll(".cart-qty").forEach(input => {
      input.addEventListener("input", e => {
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 1) e.target.value = 1;
      });
    });
  }

  // ====== UPDATE / DONE BUTTON ======
  if (updateBtn) {
    updateBtn.addEventListener("click", () => {
      if (!editMode) {
        editMode = true;
        updateBtn.textContent = "Done";
      } else {
        document.querySelectorAll(".cart-qty").forEach(input => {
          const idx = input.dataset.index;
          cart[idx].quantity = parseInt(input.value);
        });
        saveCart();
        editMode = false;
        updateBtn.textContent = "Update Cart";
      }
      renderCart();
    });
  }

  // ====== SAVE CART ======
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Initial render
  renderCart();
  updateCartCounter();
});

// ====== CHECKOUT REDIRECT ======
document.addEventListener('DOMContentLoaded', () => {
  const checkoutBtn = document.querySelector('.btn-checkout');
  if (!checkoutBtn) return;

  checkoutBtn.addEventListener('click', () => {
    // Cart already exists in localStorage
    window.location.href = 'checkout.html';
  });
});
