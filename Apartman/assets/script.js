// fader
document.addEventListener("DOMContentLoaded", () => {
  const tags = document.querySelectorAll(".fader");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // přestane sledovat (animace jen jednou)
      }
    });
  }, { threshold: 0.2 }); // 10 % prvku musí být vidět

  tags.forEach(fader => observer.observe(fader));
});


// Get the button
let mybutton = document.getElementById("btn-back-to-top");

// Show the button when user scrolls down 20px
window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 20 ||
    document.documentElement.scrollTop > 20
  ) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// Smooth scroll to top when clicked
mybutton.addEventListener("click", backToTop);

function backToTop() {
  const start = window.scrollY;
  const duration = 500; // délka animace v ms
  const startTime = performance.now();

  function animateScroll(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // easeOutCubic pro příjemnější zpomalení
    const ease = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, start * (1 - ease));

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }

  requestAnimationFrame(animateScroll);
}

// header
window.addEventListener("scroll", function () {
  const header = document.querySelector(".shadow-sm");
  const scrolled = window.scrollY > 1;

  // Přidá sticky a druhou třídu, pokud scrolled = true, jinak je odebere
  header.classList.toggle("shadow-none", scrolled);
  header.classList.toggle("border-bottom", scrolled);
});



// rezervační formulář kontrola
 const fromDateInput = document.getElementById("fromDate");
    const toDateInput = document.getElementById("toDate");
    const errorMsg = document.getElementById("errorMsg");

    // Nastavit dnešní datum jako minimum
    const today = new Date().toISOString().split("T")[0];
    fromDateInput.setAttribute("min", today);
    toDateInput.setAttribute("min", today);

    // Když se změní datum "od"
    fromDateInput.addEventListener("change", function() {
      const fromDate = new Date(this.value);

      if (isNaN(fromDate)) return;

      // Minimálně +2 dny
      const minToDate = new Date(fromDate);
      minToDate.setDate(minToDate.getDate() + 2);

      const minToDateStr = minToDate.toISOString().split("T")[0];
      toDateInput.setAttribute("min", minToDateStr);

      // Pokud je už vybrané datum "do" menší než povolené, přenastav ho
      if (new Date(toDateInput.value) < minToDate) {
        toDateInput.value = minToDateStr;
      }
    });

    // Kontrola při odeslání formuláře
    document.getElementById("rezervaceForm").addEventListener("submit", function(event) {
      const fromDate = new Date(fromDateInput.value);
      const toDate = new Date(toDateInput.value);

      const diffTime = toDate - fromDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays < 2) {
        event.preventDefault();
        errorMsg.style.display = "block";
      } else {
        errorMsg.style.display = "none";
      }
    });


