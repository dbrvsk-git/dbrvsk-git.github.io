(function(document, history, location) {
  var HISTORY_SUPPORT = !!(history && history.pushState);

  var anchorScrolls = {
    ANCHOR_REGEX: /^#[^ ]+$/,
    OFFSET_HEIGHT_PX: 60,

    /**
     * Establish events, and fix initial scroll position if a hash is provided.
     */
    init: function() {
      this.scrollToCurrent();
      window.addEventListener('hashchange', this.scrollToCurrent.bind(this));
      document.body.addEventListener('click', this.delegateAnchors.bind(this));
    },

    /**
     * Return the offset amount to deduct from the normal scroll position.
     * Modify as appropriate to allow for dynamic calculations
     */
    getFixedOffset: function() {
      return this.OFFSET_HEIGHT_PX;
    },

    /**
     * If the provided href is an anchor which resolves to an element on the
     * page, scroll to it.
     * @param  {String} href
     * @return {Boolean} - Was the href an anchor.
     */
    scrollIfAnchor: function(href, pushToHistory) {
      var match, rect, anchorOffset;

      if(!this.ANCHOR_REGEX.test(href)) {
        return false;
      }

      match = document.getElementById(href.slice(1));

      if(match) {
        rect = match.getBoundingClientRect();
        anchorOffset = window.pageYOffset + rect.top - this.getFixedOffset();
        window.scrollTo(window.pageXOffset, anchorOffset);

        // Add the state to history as-per normal anchor links
        if(HISTORY_SUPPORT && pushToHistory) {
          history.pushState({}, document.title, location.pathname + href);
        }
      }

      return !!match;
    },

    /**
     * Attempt to scroll to the current location's hash.
     */
    scrollToCurrent: function() {
      this.scrollIfAnchor(window.location.hash);
    },

    /**
     * If the click event's target was an anchor, fix the scroll position.
     */
    delegateAnchors: function(e) {
      var elem = e.target;

      if(
        elem.nodeName === 'A' &&
        this.scrollIfAnchor(elem.getAttribute('href'), true)
      ) {
        e.preventDefault();
      }
    }
  };

  window.addEventListener(
    'DOMContentLoaded', anchorScrolls.init.bind(anchorScrolls)
  );
})(window.document, window.history, window.location);



// navbar white

window.addEventListener("scroll", function () {
  const header = document.querySelector(".opacity-100");
  const scrolled = window.scrollY > 1;

  // Přidá sticky a druhou třídu, pokud scrolled = true, jinak je odebere
  header.classList.toggle("bg-white", scrolled);
});


// fader objekt
document.addEventListener("DOMContentLoaded", () => {
  const tags = document.querySelectorAll(".tag");

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // přestane sledovat (animace jen jednou)
      }
    });
  }, { threshold: 0.1 }); // 10 % prvku musí být vidět

  tags.forEach(tag => observer.observe(tag));
});
