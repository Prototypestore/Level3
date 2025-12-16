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
      return;
    }

    // ====== UPDATE PRODUCT DOM ====== //
    document.querySelector(".product-title").textContent = product.title;
    document.querySelector(".product-price").textContent = product.price;
    const img = document.querySelector(".product-image img");
    img.src = product.image;
    img.alt = product.title;
    document.getElementById("product-details").textContent = product.details;
    document.getElementById("returns").textContent = product.returns;

    // Optional: you could dynamically create color/size options if included in JSON
  })
  .catch((err) => {
    console.error("Failed to load products.json", err);
  });

// ====== ACCORDION TOGGLE ====== //
document.getElementById("btn-pro").addEventListener("click", () => {
  document.getElementById("product-details").classList.toggle("show");
});

document.getElementById("btn-re").addEventListener("click", () => {
  document.getElementById("returns").classList.toggle("show");
});

// ====== QUANTITY BUTTONS ====== //
const decreaseBtn = document.getElementById("decrease");
const increaseBtn = document.getElementById("increase");
const qtyInput = document.getElementById("qty-value");

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
