const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const siteHeader = document.querySelector(".site-header");
const heroSlides = document.querySelectorAll(".hero-slide");
const highlightsHeroSlides = document.querySelectorAll(".highlights-hero-slide");
const carousels = document.querySelectorAll("[data-carousel]");
const floorplanTabs = document.querySelectorAll(".floorplans-tab");
const floorplanPanels = document.querySelectorAll(".floorplans-panel");
const highlightTabs = document.querySelectorAll(".highlights-spec-tab");
const highlightPanels = document.querySelectorAll("[data-highlight-panel]");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (heroSlides.length > 1) {
  let activeSlide = 0;

  window.setInterval(() => {
    heroSlides[activeSlide].classList.remove("is-active");
    activeSlide = (activeSlide + 1) % heroSlides.length;
    heroSlides[activeSlide].classList.add("is-active");
  }, 5000);
}

if (highlightsHeroSlides.length > 1) {
  let activeHighlightSlide = 0;

  window.setInterval(() => {
    highlightsHeroSlides[activeHighlightSlide].classList.remove("is-active");
    activeHighlightSlide = (activeHighlightSlide + 1) % highlightsHeroSlides.length;
    highlightsHeroSlides[activeHighlightSlide].classList.add("is-active");
  }, 4200);
}

if (carousels.length) {
  carousels.forEach((carousel) => {
    const track = carousel.querySelector("[data-carousel-track]");
    const prev = carousel.querySelector("[data-carousel-prev]");
    const next = carousel.querySelector("[data-carousel-next]");
    const shouldAutoplay = carousel.hasAttribute("data-carousel-autoplay");
    const isPersistentAutoplay = carousel.hasAttribute("data-carousel-persistent");
    const autoplayInterval = Number.parseInt(
      carousel.getAttribute("data-carousel-interval") || "2800",
      10,
    );
    let autoplayId = null;

    if (!track) {
      return;
    }

    const getStep = () => {
      const firstCard = track.firstElementChild;
      if (!firstCard) {
        return track.clientWidth * 0.85;
      }

      const styles = window.getComputedStyle(track);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");
      return firstCard.getBoundingClientRect().width + gap;
    };

    const moveTrack = (direction) => {
      const maxScrollLeft = Math.max(track.scrollWidth - track.clientWidth, 0);
      const nextLeft = Math.min(
        Math.max(track.scrollLeft + getStep() * direction, 0),
        maxScrollLeft,
      );

      track.scrollTo({ left: nextLeft, behavior: "smooth" });
    };

    prev?.addEventListener("click", () => {
      moveTrack(-1);
    });

    next?.addEventListener("click", () => {
      moveTrack(1);
    });

    if (shouldAutoplay) {
      const play = () => {
        if (autoplayId !== null) {
          return;
        }

        autoplayId = window.setInterval(() => {
          const maxScrollLeft = track.scrollWidth - track.clientWidth;
          if (track.scrollLeft >= maxScrollLeft - 4) {
            track.scrollTo({ left: 0, behavior: "smooth" });
            return;
          }

          moveTrack(1);
        }, autoplayInterval);
      };

      const stop = () => {
        if (autoplayId !== null) {
          window.clearInterval(autoplayId);
          autoplayId = null;
        }
      };

      play();

      if (!isPersistentAutoplay) {
        carousel.addEventListener("mouseenter", stop);
        carousel.addEventListener("mouseleave", play);
        carousel.addEventListener("focusin", stop);
        carousel.addEventListener("focusout", play);
      }
    }
  });
}

const updateHeroProgress = () => {
  if (!siteHeader) {
    return;
  }

  if (document.body.classList.contains("inner-page")) {
    document.documentElement.style.setProperty("--hero-progress", "1");
    return;
  }

  if (window.innerWidth <= 820) {
    document.documentElement.style.setProperty("--hero-progress", "1");
    return;
  }

  const progress = Math.min(window.scrollY / 260, 1);
  document.documentElement.style.setProperty("--hero-progress", progress.toFixed(3));
};

updateHeroProgress();
window.addEventListener("scroll", updateHeroProgress, { passive: true });
window.addEventListener("resize", updateHeroProgress);

if (floorplanTabs.length && floorplanPanels.length) {
  floorplanTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.target;

      floorplanTabs.forEach((item) => {
        item.classList.remove("is-active");
        item.setAttribute("aria-selected", "false");
      });

      floorplanPanels.forEach((panel) => {
        panel.classList.remove("is-active");
        panel.hidden = panel.id !== targetId;
      });

      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");

      const activePanel = document.getElementById(targetId);
      if (activePanel) {
        activePanel.classList.add("is-active");
        activePanel.hidden = false;
      }
    });
  });
}

if (highlightTabs.length && highlightPanels.length) {
  const activateHighlightPanel = (targetId) => {
    highlightTabs.forEach((tab) => {
      const isActive = tab.dataset.highlightTarget === targetId;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));

      if (isActive) {
        tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    });

    highlightPanels.forEach((panel) => {
      const isActive = panel.id === targetId;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  };

  highlightTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      activateHighlightPanel(tab.dataset.highlightTarget);
    });
  });
}
