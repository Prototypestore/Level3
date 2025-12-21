// checkout.js
document.addEventListener("DOMContentLoaded", () => {
  const summaryContainer = document.querySelector(".checkout-summary");

  if (!summaryContainer) return;

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Clear existing content (if any)
  summaryContainer.innerHTML = `<h2>Order Summary</h2>`;

  let subtotal = 0;

  if (cart.length === 0) {
    summaryContainer.innerHTML += `<p style="text-align:center; padding:2rem;">Your cart is empty.</p>`;
    summaryContainer.innerHTML += `<div class="summary-item total">Total: £0.00</div>`;
    return;
  }

  // Loop through cart items
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("summary-item");
    itemDiv.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <span>£${itemTotal.toFixed(2)}</span>
    `;
    summaryContainer.appendChild(itemDiv);
  });

  // Subtotal
  const subtotalDiv = document.createElement("div");
  subtotalDiv.classList.add("summary-item");
  subtotalDiv.innerHTML = `<span>Subtotal</span><span>£${subtotal.toFixed(2)}</span>`;
  summaryContainer.appendChild(subtotalDiv);

  // Total (if you want, you can add tax/shipping later)
  const totalDiv = document.createElement("div");
  totalDiv.classList.add("summary-item", "total");
  totalDiv.innerHTML = `<span>Total</span><span>£${subtotal.toFixed(2)}</span>`;
  summaryContainer.appendChild(totalDiv);
});

// Redirect back-arrow SVG to home page
const backArrow = document.getElementById('back-arrow');

if (backArrow) {
  backArrow.addEventListener('click', () => {
    window.location.href = 'index.html'; // Redirect to home page
  });
}
