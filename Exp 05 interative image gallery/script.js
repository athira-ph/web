const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const slideCount = document.querySelector("#slide-count");
const previousButton = document.querySelector("#previous-button");
const nextButton = document.querySelector("#next-button");
const closeButton = document.querySelector("#close-button");
const autoplayButton = document.querySelector("#autoplay-button");

let currentIndex = 0;
let autoplayTimer;
let lastFocusedElement;

function showImage(index) {
  currentIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentIndex];
  const image = item.querySelector("img");
  const caption = item.querySelector(".photo-caption");

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = caption.lastElementChild.textContent;
  slideCount.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(galleryItems.length).padStart(2, "0")}`;
}

function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  showImage(index);
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-lightbox");
  closeButton.focus();
}

function stopSlideshow() {
  window.clearInterval(autoplayTimer);
  autoplayTimer = undefined;
  autoplayButton.textContent = "Start slideshow ↗";
  autoplayButton.setAttribute("aria-pressed", "false");
}

function closeLightbox() {
  stopSlideshow();
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-lightbox");
  lastFocusedElement?.focus();
}

galleryItems.forEach((item) => {
  item.addEventListener("click", () => openLightbox(Number(item.dataset.index)));
});

previousButton.addEventListener("click", () => showImage(currentIndex - 1));
nextButton.addEventListener("click", () => showImage(currentIndex + 1));
closeButton.addEventListener("click", closeLightbox);

autoplayButton.addEventListener("click", () => {
  if (autoplayTimer) {
    stopSlideshow();
    return;
  }

  autoplayButton.textContent = "Pause slideshow";
  autoplayButton.setAttribute("aria-pressed", "true");
  autoplayTimer = window.setInterval(() => showImage(currentIndex + 1), 3000);
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("is-open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowLeft") {
    showImage(currentIndex - 1);
  } else if (event.key === "ArrowRight") {
    showImage(currentIndex + 1);
  }
});
