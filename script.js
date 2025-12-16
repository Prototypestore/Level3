const track = document.querySelector('.slides');
const slides = Array.from(track.children);
const slideWidth = 560;
let index = 0;

// Clone first slide for seamless loop
const firstClone = slides[0].cloneNode(true);
track.appendChild(firstClone);

function showSlide(i) {
  track.style.transition = "transform 0.5s ease";
  track.style.transform = `translateX(-${i * slideWidth}px)`;
}

// Next
document.querySelector('.slide-btn.next').addEventListener('click', () => {
  index++;
  showSlide(index);
});

// Prev
document.querySelector('.slide-btn.prev').addEventListener('click', () => {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
});

// Auto-slide
setInterval(() => {
  index++;
  showSlide(index);
}, 4000);

// Loop reset
track.addEventListener('transitionend', () => {
  if (index === slides.length) {
    track.style.transition = "none";
    index = 0;
    track.style.transform = `translateX(0px)`;
    setTimeout(() => { track.style.transition = "transform 0.5s ease"; }, 50);
  }
});
