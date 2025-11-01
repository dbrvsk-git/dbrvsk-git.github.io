const wrapper = document.body;
const sections = [...document.querySelectorAll(".section")];
const closeButtons = [...document.querySelectorAll(".close-section")];
const expandedClass = "is-expanded";
const hasExpandedClass = "has-expanded-item";

sections.forEach(section => {
  section.addEventListener("click", () => {
    if(section.classList.contains(expandedClass)) return;
    section.classList.add(expandedClass);
    wrapper.classList.add(hasExpandedClass);
  });
});

closeButtons.forEach(button => {
  button.addEventListener("click", e => {
    e.stopPropagation();
    const section = button.parentElement;
    if(!section.classList.contains(expandedClass)) return;
    section.classList.remove(expandedClass);
    wrapper.classList.remove(hasExpandedClass);
  });
});


//lightbox
const images = document.querySelectorAll('.column img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close');

images.forEach(img => {
  img.addEventListener('click', () => {
    lightbox.style.display = 'flex';
    lightboxImg.src = img.src;
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});

// kurzor
const cursor = document.getElementById('cursor');

// Nejprve zkontrolujeme, zda nejde o dotykové zařízení
if (!('ontouchstart' in window || navigator.maxTouchPoints > 0)) {

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  const speed = 0.1;
  let isMouseActive = false;

  // Na začátku kurzor skrytý
  cursor.style.opacity = 0;
  cursor.style.transition = 'opacity 0.3s ease';

  // Sleduj pohyb myši
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isMouseActive) {
      isMouseActive = true;
      cursor.style.opacity = 1; // zobraz kurzor
    }
  });

  // Skryj kolečko, když myš opustí okno
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = 0;
    isMouseActive = false;
  });

  // Zobraz kolečko, když se myš vrátí do okna
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = 1;
    isMouseActive = true;
  });

  // Animace kurzoru s lehkým zpožděním
  function animateCursor() {
    if (isMouseActive) {
      currentX += (mouseX - currentX) * speed;
      currentY += (mouseY - currentY) * speed;
      cursor.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
    }
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

} else {
  // Pokud je dotykové zařízení → kurzor se skryje úplně
  cursor.style.display = 'none';
}
