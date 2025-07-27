const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open"); // für die X-Animation
  nav.classList.toggle("open");       // für das Menü
});

/*
document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(ScrollTrigger);

  // Hamburger-Menü
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    nav.classList.toggle("open");
  });

  // Slide-in-Animation für alle panel-pair
  document.querySelectorAll(".panel-pair").forEach((pair) => {
    gsap.from(pair, {
      scrollTrigger: {
        trigger: pair,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      x: 100,
      duration: 1,
      ease: "power3.out",
    });
  });

  // Bestehende Animation der einzelnen .panel-Elemente
  const panels = document.querySelectorAll(".panel");
  panels.forEach((panel) => {
    const text = panel.querySelector(".text");
    const image = panel.querySelector(".illu");

    if (!text || !image) return;

    const isTextLeft = text.classList.contains("left");
    const isTextRight = text.classList.contains("right");

    let textFromX = isTextLeft ? "-100%" : isTextRight ? "100%" : "0%";
    let imageFromX = isTextLeft ? "100%" : isTextRight ? "-100%" : "0%";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: panel,
        start: "top 80%",
        end: "bottom 60%",
        toggleActions: "play none none reverse"
      }
    });

    tl.from(text, {
      x: textFromX,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    tl.from(image, {
      x: imageFromX,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.8");
  });
});

*/