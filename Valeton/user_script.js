// fader 
document.addEventListener("DOMContentLoaded", () => {
  const tags = document.querySelectorAll(".tag");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // přestane sledovat (animace jen jednou)
      }
    });
  }, { threshold: 0.2 }); // 10 % prvku musí být vidět

  tags.forEach(tag => observer.observe(tag));
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
  const duration = 300; // délka animace v ms
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


// navbar a body height
window.addEventListener("scroll", function() {
  const navbar = document.querySelector("nav.sticky-top");
  const htmlTag = document.documentElement; // <html>
  const bodyTag = document.body;

  if (!navbar) return;

  const rect = navbar.getBoundingClientRect();
  const atTop = rect.top <= 0; // kdy je navbar na vrchu

  // Když navbar dorazí na vrchol, přidáme třídu
  htmlTag.classList.toggle("no-full-height", atTop);
  bodyTag.classList.toggle("no-full-height", atTop);
  navbar.classList.toggle("at-top", atTop);
});
