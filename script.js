// Carousel
const track = document.querySelector(".carousel-track");
const slides = Array.from(track.children);
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const slideWidth = slides[0].getBoundingClientRect().width + 24; // margin

let index = 0;

function updateCarousel() {
  track.style.transform = `translateX(-${index * slideWidth}px)`;
}

nextBtn.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  updateCarousel();
});

prevBtn.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  updateCarousel();
});

// Auto-slide
setInterval(() => {
  index = (index + 1) % slides.length;
  updateCarousel();
}, 4000);
