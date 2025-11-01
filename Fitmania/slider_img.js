
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('galleryWrapper');
  const track = document.getElementById('galleryTrack');
  const slides = Array.from(track.querySelectorAll('.gallery-slide'));
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const dotsContainer = document.getElementById('galleryDots');

  const lightbox = document.getElementById('galleryLightbox');
  const lightboxImg = document.getElementById('galleryLightboxImg');
  const lightboxCaption = document.getElementById('galleryCaption');
  const lightboxClose = document.getElementById('galleryClose');
  const lightboxPrev = document.getElementById('galleryPrevBtn');
  const lightboxNext = document.getElementById('galleryNextBtn');

  let index = 0;
  let visible = 2;
  let slideW = 0;

  // drag/swipe
  let isDragging = false;
  let startX = 0;
  let currentX = 0;
  let startTranslate = 0;
  let justDragged = false;

  const images = Array.from(document.querySelectorAll('.gallery-zoomable'));
  let currentLightboxIndex = 0;

  // --- SLIDER ---
  function calcVisible(){ return window.innerWidth >= 768 ? 2 : 1; }

  function layout(){
    visible = Math.min(calcVisible(), slides.length);
    const wrapperW = wrapper.offsetWidth;
    slideW = wrapperW / visible;
    slides.forEach(sl => sl.style.width = Math.round(slideW) + 'px');

    const maxIndex = Math.max(0, slides.length - visible);
    index = Math.min(index, maxIndex);

    track.style.transition = 'transform 0.3s ease';
    track.style.transform = `translateX(${-index * slideW}px)`;
    updateDots();
  }

  function updateDots(){
    dotsContainer.innerHTML = "";
    const total = Math.max(1, slides.length - visible + 1);
    for(let i=0;i<total;i++){
      const dot = document.createElement('div');
      dot.className = "gallery-dot" + (i===index ? " active" : "");
      dot.addEventListener('click', ()=>{ index = i; layout(); });
      dotsContainer.appendChild(dot);
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', () => {
    index = Math.max(0, index - 1); layout();
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    index = Math.min(slides.length - visible, index + 1); layout();
  });

  // --- DRAG / SWIPE ---
  function dragStart(clientX) {
    isDragging = true;
    startX = clientX;
    currentX = startX;
    startTranslate = -index * slideW;
    track.style.transition = 'none';
    track.classList.add('grabbing');
  }
  function dragMove(clientX) {
    if (!isDragging) return;
    currentX = clientX;
    const dx = currentX - startX;
    track.style.transform = `translateX(${ startTranslate + dx }px)`;
  }
  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove('grabbing');
    track.style.transition = 'transform 0.3s ease';

    const dx = currentX - startX;
    const threshold = Math.max(40, slideW * 0.15);
    if (dx > threshold) index = Math.max(0, index - 1);
    else if (dx < -threshold) index = Math.min(slides.length - visible, index + 1);

    if (Math.abs(dx) > 5) {
      justDragged = true;
      setTimeout(()=> justDragged = false, 50);
    }
    layout();
  }

  // touch
  wrapper.addEventListener('touchstart', e => { if(e.touches.length===1) dragStart(e.touches[0].clientX); }, {passive:true});
  wrapper.addEventListener('touchmove', e => { if(e.touches.length===1) dragMove(e.touches[0].clientX); }, {passive:true});
  wrapper.addEventListener('touchend', dragEnd);

  // mouse
  wrapper.addEventListener('mousedown', e => { if(e.button===0) { dragStart(e.clientX); e.preventDefault(); }});
  window.addEventListener('mousemove', e => dragMove(e.clientX));
  window.addEventListener('mouseup', dragEnd);

  // disable native image drag
  track.querySelectorAll('img').forEach(img => img.setAttribute('draggable','false'));

  // --- LIGHTBOX ---
  function openLightbox(i){
    currentLightboxIndex = i;
    const img = images[i];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || '';
    lightboxCaption.textContent = img.alt || '';
    lightbox.classList.remove('d-none');
    lightbox.classList.add('show');
  }
  function closeLightboxFn(){
    lightbox.classList.remove('show');
    setTimeout(()=> lightbox.classList.add('d-none'), 200);
  }
  function showPrev(){ openLightbox((currentLightboxIndex - 1 + images.length) % images.length); }
  function showNext(){ openLightbox((currentLightboxIndex + 1) % images.length); }

  images.forEach((img,i)=>{
    img.addEventListener('click', e=>{
      if (justDragged) { e.stopImmediatePropagation(); return; }
      openLightbox(i);
    });
  });

  lightboxClose.addEventListener('click', closeLightboxFn);
  lightbox.addEventListener('click', e=>{ if(e.target===lightbox) closeLightboxFn(); });
  lightboxPrev.addEventListener('click', e=>{ e.stopPropagation(); showPrev(); });
  lightboxNext.addEventListener('click', e=>{ e.stopPropagation(); showNext(); });
  document.addEventListener('keydown', e=>{
    if(lightbox.classList.contains('show')){
      if(e.key==='Escape') closeLightboxFn();
      if(e.key==='ArrowLeft') showPrev();
      if(e.key==='ArrowRight') showNext();
    }
  });

  // init
  window.addEventListener('resize', () => { clearTimeout(window._galleryResizeTimer); window._galleryResizeTimer = setTimeout(layout, 100); });
  window.addEventListener('load', layout);
  layout();
});

