// ====== CART PAGE LOGIC ======
document.addEventListener("DOMContentLoaded", () => {
  const cartBody = document.getElementById("cart-items-body");
  const subtotalEl = document.getElementById("summary-subtotal");
  const totalEl = document.getElementById("summary-total");
  const updateBtn = document.querySelector(".btn-update-cart");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let editMode = false; // track if user can edit

  // ====== CART COUNTER ======
  function updateCartCounter() {
    let counter = document.getElementById("cart-counter");
    if (!counter) {
      counter = document.createElement("div");
      counter.id = "cart-counter";
      document.body.appendChild(counter);

      Object.assign(counter.style, {
        position: "fixed",
        top: "1rem",
        right: "1rem",
        background: "#ff0000",
        color: "#fff",
        padding: "0.25rem 0.5rem",
        borderRadius: "50%",
        fontWeight: "bold",
        fontSize: "0.9rem",
        minWidth: "1.5rem",
        height: "1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      });
    }

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
          <img src="${item.image}" alt="${item.name}">
          <div>
            <strong>${item.name}</strong><br>

            <label>
              Color:
              <select class="cart-color" data-index="${index}" ${!editMode ? "disabled" : ""}>
                <option value="${item.color}" selected>${item.color}</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Green">Green</option>
              </select>
            </label>
            <br>

            <label>
              Size:
              <select class="cart-size" data-index="${index}" ${!editMode ? "disabled" : ""}>
                <option value="${item.size}" selected>${item.size}</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </label>
            <br>

            <button class="remove-item" data-index="${index}" ${!editMode ? "disabled" : ""}>Remove</button>
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
    // Remove item
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
        // Enter edit mode
        editMode = true;
        updateBtn.textContent = "Done";
      } else {
        // Save changes and exit edit mode
        document.querySelectorAll(".cart-qty").forEach(input => {
          const idx = input.dataset.index;
          cart[idx].quantity = parseInt(input.value);
        });

        document.querySelectorAll(".cart-color").forEach(select => {
          const idx = select.dataset.index;
          cart[idx].color = select.value;
        });

        document.querySelectorAll(".cart-size").forEach(select => {
          const idx = select.dataset.index;
          cart[idx].size = select.value;
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
});
