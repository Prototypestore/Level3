// ====== DYNAMIC PRODUCT DATA ====== //
const products = {
  1: {
    title: "Web Style Hooded Sweatshirt",
    price: "£35",
    image: "https://www.bossjackets.com/wp-content/uploads/2023/09/Spider-Web-Fleece-Hoodie-3.jpg",
    description: `Elevate your everyday look with the Aleo Code Beige Streetwear Hoodie, a perfect blend of comfort and urban edge. Crafted from soft, breathable fabric, this sweatshirt delivers a relaxed fit that moves effortlessly with you, while its neutral beige tone makes it a versatile staple for layering or standing out with minimalist style.`
  },
  2: {
    title: "Classic Streetwear Jacket",
    price: "£50",
    image: "https://example.com/img2.jpg",
    description: `A timeless streetwear jacket designed for comfort and style. Perfect for layering, lightweight yet durable, with a modern cut that suits every outfit.`
  },
  3: {
    title: "Premium Joggers",
    price: "£40",
    image: "https://example.com/img3.jpg",
    description: `Soft, breathable, and stylish joggers for everyday comfort. Ideal for both lounging and casual outings.`
  }
};

// ====== READ PRODUCT ID FROM URL ====== //
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id") || "1"; // default to 1 if no id provided
const product = products[productId];

// ====== POPULATE PRODUCT DETAILS ====== //
if (product) {
  document.querySelector(".product-title").textContent = product.title;
  document.querySelector(".product-price").textContent = product.price;
  document.querySelector(".product-image img").src = product.image;
  document.querySelector(".product-image img").alt = product.title;
  document.getElementById("product-details").textContent = product.description;
} else {
  document.querySelector(".product-title").textContent = "Product Not Found";
  document.querySelector(".product-price").textContent = "-";
  document.querySelector(".product-image img").src = "";
  document.getElementById("product-details").textContent = "Sorry, this product does not exist.";
}

// ====== ACCORDION TOGGLE ====== //
document.getElementById("btn-pro").addEventListener("click", function () {
  const para = document.querySelector("#product-details");
  para.classList.toggle("show");
});

document.getElementById("btn-re").addEventListener("click", function () {
  const para = document.querySelector("#returns");
  para.classList.toggle("show");
});

// ====== QUANTITY BUTTONS ====== //
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
