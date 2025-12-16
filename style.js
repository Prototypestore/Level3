// ==========================
// Product Data
// ==========================
const products = [
  {
    id: 1,
    name: "Web-style hooded sweatshirt",
    price: "£35",
    img: "https://www.bossjackets.com/wp-content/uploads/2023/09/Spider-Web-Fleece-Hoodie-3.jpg",
    alt: "Female web-style hooded sweatshirt"
  },
  {
    id: 2,
    name: "Plain black T-shirt",
    price: "£25",
    img: "https://tse3.mm.bing.net/th/id/OIP.gGJPehhQ3_3iAKW934eJmQHaHa?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    alt: "Male plain black T-shirt"
  },
  {
    id: 3,
    name: "Grey joggers",
    price: "£30",
    img: "https://i5.walmartimages.com/seo/Ma-Croix-Womens-Sweatpants-Skinny-Fit-Jogger-Pants-with-Pockets_439fd5ca-2316-4794-bf89-5b2678d9021a.54953153b803a16bcfe3264631b5151c.jpeg",
    alt: "Female grey joggers"
  },
  {
    id: 4,
    name: "Crowneck sweatshirt",
    price: "£35",
    img: "https://tse3.mm.bing.net/th/id/OIP.AHjTqy1ci3aE-1GuS882PAHaJ4?cb=ucfimg2&ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3",
    alt: "Male crowneck sweatshirt"
  },
  {
    id: 5,
    name: "White zip-up hooded sweatshirt",
    price: "£40",
    img: "https://i5.walmartimages.com/asr/4c65d8cd-71ab-4943-b014-517980f7c4d6_1.8be2186d1196dac143ba112e1a7113fd.jpeg",
    alt: "Female white zip-up hooded sweatshirt"
  },
  {
    id: 6,
    name: "Navy long-sleeve shirt",
    price: "£30",
    img: "https://slimages.macysassets.com/is/image/MCY/products/8/optimized/26599918_fpx.tif?op_sharpen=1&wid=700&hei=855&fit=fit,1",
    alt: "Male navy shirt"
  }
  // Add more products as needed
];

// ==========================
// Render Shop Grid
// ==========================
const shopGrid = document.querySelector(".shop .grid");
const trendingGrid = document.querySelector(".trending .grid");

function renderProducts(productsArray, container) {
  container.innerHTML = ""; // Clear existing content
  productsArray.forEach(product => {
    const article = document.createElement("article");
    article.classList.add("product");

    article.innerHTML = `
      <a href="p${product.id}.html">
        <img src="${product.img}" alt="${product.alt}">
        <h3>${product.name}</h3>
        <p>${product.price}</p>
      </a>
    `;

    container.appendChild(article);
  });
}

// Render both grids
renderProducts(products, shopGrid);
renderProducts(products.slice(0, 4), trendingGrid); // Example: show top 4 trending

// ==========================
// Optional: Slide Controls (for Deals Section)
// ==========================
const slides = document.querySelector(".deals .slides");
const prevBtn = document.querySelector(".slide-button:first-of-type");
const nextBtn = document.querySelector(".slide-button:last-of-type");

if (slides && prevBtn && nextBtn) {
  let offset = 0;

  const slideWidth = slides.children[0].getBoundingClientRect().width;

  prevBtn.addEventListener("click", () => {
    offset = offset - slideWidth < 0 ? 0 : offset - slideWidth;
    slides.style.transform = `translateX(-${offset}px)`;
  });

  nextBtn.addEventListener("click", () => {
    const maxOffset = slides.scrollWidth - slides.clientWidth;
    offset = offset + slideWidth > maxOffset ? maxOffset : offset + slideWidth;
    slides.style.transform = `translateX(-${offset}px)`;
  });
}
