
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('sliderWrapper');
  const track = document.getElementById('sliderTrack');
  const slides = track ? Array.from(track.querySelectorAll('.slide')) : [];
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!wrapper || !track || slides.length === 0) return;

  let index = 0;
  let visible = 1;
  let slideW = 0;

  // drag/swipe state
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  function calcVisible(){ return window.innerWidth >= 768 ? 3 : 1; }

  function layout(){
    visible = Math.min(calcVisible(), slides.length);
    const wrapperW = wrapper.offsetWidth;
    slideW = wrapperW / visible;

    slides.forEach(sl => sl.style.width = Math.round(slideW) + 'px');

    const maxIndex = Math.max(0, slides.length - visible);
    if (index > maxIndex) index = maxIndex;
    if (index < 0) index = 0;

    track.style.transition = 'transform 0.3s ease';
    track.style.transform = `translateX(${-index * slideW}px)`;
  }

  // šipky
  if (prevBtn) prevBtn.addEventListener('click', () => {
    index = Math.max(0, index - 1);
    layout();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    index = Math.min(slides.length - visible, index + 1);
    layout();
  });

  // --- DRAG / SWIPE společně ---
  function dragStart(clientX) {
    startX = clientX;
    currentX = startX;
    isDragging = true;
    track.style.transition = 'none';
    track.style.cursor = 'grabbing';
  }
  function dragMove(clientX) {
    if (!isDragging) return;
    currentX = clientX;
    const dx = currentX - startX;
    track.style.transform = `translateX(${ -index * slideW + dx }px)`;
  }
  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.cursor = 'grab';
    const dx = currentX - startX;
    const threshold = Math.max(30, slideW * 0.2);

    if (dx > threshold) index = Math.max(0, index - 1);
    else if (dx < -threshold) index = Math.min(slides.length - visible, index + 1);

    layout();
  }

  // touch events
  wrapper.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) dragStart(e.touches[0].clientX);
  }, { passive: true });
  wrapper.addEventListener('touchmove', (e) => {
    if (e.touches.length === 1) dragMove(e.touches[0].clientX);
  }, { passive: true });
  wrapper.addEventListener('touchend', dragEnd);

  // mouse events
  wrapper.addEventListener('mousedown', (e) => {
    if (e.button === 0) dragStart(e.clientX);
  });
  window.addEventListener('mousemove', (e) => dragMove(e.clientX));
  window.addEventListener('mouseup', dragEnd);

  // init + resize
  let rt;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layout, 100); });
  window.addEventListener('load', layout);
  layout();
});

