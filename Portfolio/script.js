const sections = document.querySelectorAll('section');
let current = sections[0]; // první sekce jako výchozí

// Nastavení počátečních pozic
sections.forEach(sec => {
  if (sec !== current) {
    sec.style.transform = 'translateX(100%)';
  } else {
    sec.style.transform = 'translateX(0)';
    sec.style.zIndex = 1;
  }
});

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.dataset.target;
    const next = document.getElementById(targetId);
    if (next === current) return;

    // ulož aktuální sekci do localStorage
    localStorage.setItem('lastSection', targetId);

    // posuň
    next.style.transform = 'translateX(100%)';
    next.style.zIndex = 2;
    void next.offsetWidth; // repaint
    next.style.transform = 'translateX(0)';

    next.addEventListener('transitionend', function handler() {
      current.style.transform = 'translateX(100%)';
      current.style.zIndex = 0;
      next.style.zIndex = 1;
      current = next;
      next.removeEventListener('transitionend', handler);
    });
  });
});

// --- NAVIGACE ---
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");
let isOpen = false;

function updateIcon() {
  menuToggle.innerHTML = isOpen
    ? '<i class="bi bi-x"></i>'
    : '<i class="bi bi-list"></i>';
}

menuToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  isOpen = !isOpen;
  nav.classList.toggle("open", isOpen);
  updateIcon();
});

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => {
    isOpen = false;
    nav.classList.remove("open");
    updateIcon();
  });
});

document.addEventListener("click", (e) => {
  if (isOpen && !nav.contains(e.target) && !menuToggle.contains(e.target)) {
    isOpen = false;
    nav.classList.remove("open");
    updateIcon();
  }
});

// chovani aktiv odkazu
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.dataset.target;
    const next = document.getElementById(targetId);

    // přepínání aktivního odkazu
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

  });
});

window.addEventListener("DOMContentLoaded", () => {
  const active = document.querySelector(".nav-link.active");
  if (!active) {
    const firstLink = document.querySelector("nav a.nav-link");
    if (firstLink) firstLink.classList.add("active");
  }
});

// --- GALERIE ---
document.addEventListener("DOMContentLoaded", () => {
  const galleries = document.querySelectorAll(".draggable-gallery");
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  const caption = document.getElementById("caption");
  const closeBtn = document.querySelector(".close");

  galleries.forEach(gallery => {
    let isDown = false;
    let startX;
    let scrollLeft;
    let moved = false;
    let lastX;
    let velocity = 0;
    let momentumID;
    let momentumActive = false;
    let preventClick = false;

    // --- DRAG START ---
    function start(x) {
      isDown = true;
      moved = false;
      preventClick = false;
      gallery.classList.add("active");
      startX = x - gallery.offsetLeft;
      scrollLeft = gallery.scrollLeft;
      velocity = 0;
      lastX = x;
      cancelMomentumScroll();
    }

    function move(x) {
      if (!isDown) return;
      const dx = x - startX;
      const walk = dx * 1.2;
      gallery.scrollLeft = scrollLeft - walk;
      velocity = x - lastX;
      lastX = x;
      if (Math.abs(dx) > 5) {
        moved = true;
        preventClick = true;
      }
    }

    function end() {
      if (!isDown) return;
      isDown = false;
      gallery.classList.remove("active");
      beginMomentumScroll();

      // drobná prodleva, aby se neaktivoval click
      if (preventClick) {
        setTimeout(() => (preventClick = false), 50);
      }
    }

    // --- MOMENTUM ---
    function beginMomentumScroll() {
      if (momentumActive) return;
      momentumActive = true;
      momentumID = requestAnimationFrame(momentumLoop);
    }

    function cancelMomentumScroll() {
      momentumActive = false;
      cancelAnimationFrame(momentumID);
    }

    function momentumLoop() {
      gallery.scrollLeft -= velocity;
      velocity *= 0.95;
      if (Math.abs(velocity) > 0.5) {
        momentumID = requestAnimationFrame(momentumLoop);
      } else {
        momentumActive = false;
      }
    }

    // --- MOUSE ---
    gallery.addEventListener("mousedown", e => {
      e.preventDefault();
      start(e.pageX);
    });
    gallery.addEventListener("mousemove", e => move(e.pageX));
    gallery.addEventListener("mouseup", end);
    gallery.addEventListener("mouseleave", end);

    // --- TOUCH ---
    gallery.addEventListener("touchstart", e => start(e.touches[0].pageX), { passive: true });
    gallery.addEventListener("touchmove", e => move(e.touches[0].pageX), { passive: true });
    gallery.addEventListener("touchend", end);

    // --- BLOKOVÁNÍ ODKAZŮ PO DRAGU ---
    gallery.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", e => {
        if (preventClick) {
          e.preventDefault();
          return false;
        }
      });
    });

    // --- image MODAL ---
    gallery.querySelectorAll("img").forEach(img => {
      img.addEventListener("click", e => {
        if (preventClick) return;

        // pokud je obrázek uvnitř odkazu, modal se nespustí
        if (img.closest("a")) return;

        modal.style.display = "block";
        modalImg.src = img.src;
        caption.textContent = img.title || img.alt || "";
      });
    });
  });

  // --- ZAVŘENÍ MODALU ---
  closeBtn.addEventListener("click", () => (modal.style.display = "none"));
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.style.display = "none";
  });
});



// TextScramble

    const randomString = (n, r='') => {
      while (n--) r += String.fromCharCode((r=Math.random()*62|0, r+=r>9?(r<36?55:61):48));
      return r;
    };

    const unscramble = (el) => {
      const chars = [...el.dataset.scramble];
      const tot = chars.length;
      
      let iteration = 0;
      let ch = 0;
      let solved = "";
      
      el._itv = setInterval(() => {
        if (iteration > 2) {
          iteration = 0;
          solved += chars[ch];
          ch += 1;
        }
        
        el.textContent = randomString(tot - ch, solved);
        
        if (ch === tot) {
          clearInterval(el._itv);
        }
        iteration += 1;
      }, 30);
    };

    const scramble = (el) => {
      clearInterval(el._itv);
      el.textContent = randomString([...el.dataset.scramble].length);
    };

    // funkce pro spuštění animace při načtení
    const scrambler = (el, delay = 0) => {
      scramble(el);
      // malá prodleva mezi elementy pro hezčí efekt
      setTimeout(() => unscramble(el), delay);
    };

    // spustí se po načtení stránky
    window.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[data-scramble]").forEach((el, i) => {
        scrambler(el, i * 400); // animace po sobě (0.8s rozestup)
      });
    });


// e-mail
document.querySelector("#contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("inputEmail");
  const message = document.getElementById("inputMessage");

  // Reset předchozích chyb
  email.classList.remove("is-invalid");
  message.classList.remove("is-invalid");

  let valid = true;

  // Kontrola e-mailu
  if (!email.value.trim() || !email.checkValidity()) {
    valid = false;
    email.classList.add("is-invalid");
  }

  // Kontrola zprávy
  if (!message.value.trim()) {
    valid = false;
    message.classList.add("is-invalid");
  }

  // Pokud validace neprojde → neodesílat
  if (!valid) return;

  // Odeslání formuláře přes fetch
  const formData = new FormData(e.target);
  try {
    const response = await fetch("send.php", {
      method: "POST",
      body: formData
    });
    const text = await response.text();

    if (text.trim() === "success") {
      alert("✅ Děkuji! Zpráva byla úspěšně odeslána.");
     
 // ... a proto smazani textu ve formularich
      e.target.reset(); 
      
    } else {
      alert("❌ Omlouvám se, ale nastala chyba při odesílání.");
    }
  } catch (err) {
    alert("⚠️ Došlo k chybě při odesílání formuláře.");
  }
});
