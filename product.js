// Accordion toggle
document.getElementById("btn-pro").addEventListener("click", function () {
  const para = document.querySelector("#product-details");
  para.classList.toggle("show");
});

document.getElementById("btn-re").addEventListener("click", function () {
  const para = document.querySelector("#returns");
  para.classList.toggle("show");
});

// Quantity buttons
const decreaseBtn = document.getElementById("decrease");
const increaseBtn = document.getElementById("increase");
const qtyInput    = document.getElementById("qty-value");

function updateButtons() {
  decreaseBtn.disabled = parseInt(qtyInput.value) <= 1;
}

decreaseBtn.addEventListener("click", () => {
  if (parseInt(qtyInput.value) > 1) {
    qtyInput.value = parseInt(qtyInput.value) - 1;
    updateButtons();
  }
});

increaseBtn.addEventListener("click", () => {
  qtyInput.value = parseInt(qtyInput.value) + 1;
  updateButtons();
});

updateButtons();
