// ======================= GSAP-PLUGINS REGISTRIEREN =======================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ======================= HAMBURGER-MENÜ =======================
const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  nav.classList.toggle("open");
});


// ======================= KAPITEL-DOTS =======================
// ======================= KAPITEL-DOTS =======================
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const dots = document.querySelectorAll(".kapitel-nav .dot");

// Klick-Funktion: Scrollt zum Zielkapitel
dots.forEach(dot => {
  dot.addEventListener("click", (e) => {
    e.preventDefault(); // Wichtig, falls Link
    const targetId = dot.getAttribute("data-target");
    const target = document.querySelector(targetId);

    if (target) {
      gsap.to(window, {
        duration: 1,
        scrollTo: targetId,
        ease: "power2.out"
      });
    }
  });
});

// Aktivierung beim Scrollen
document.querySelectorAll("section[id^='kapitel']").forEach((section) => {
  const sectionId = section.getAttribute("id");

  ScrollTrigger.create({
    trigger: section,
    start: "top center",
    end: "bottom center",
    onEnter: () => activateDot(sectionId),
    onEnterBack: () => activateDot(sectionId),
  });
});

// Dot aktivieren
function activateDot(sectionId) {
  dots.forEach(dot => {
    dot.classList.toggle("active", dot.dataset.target === `#${sectionId}`);
  });
}


// ======================= STERNE ERZEUGEN =======================
const starContainer = document.querySelector("#kapitel4 .background-stars");
const numberOfStars = 300;

for (let i = 0; i < numberOfStars; i++) {
  const star = document.createElement("div");
  star.classList.add("star");

  star.style.top = `${Math.random() * 100}%`;
  star.style.left = `${Math.random() * 100}%`;

  const size = Math.random() * 2 + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;

  star.style.animationDelay = `${Math.random() * 4}s`;
  star.style.animationDuration = `${2 + Math.random() * 4}s`;

  star.dataset.speed = 0.2 + Math.random() * 0.5;

  star.style.boxShadow = `0 0 ${2 + Math.random() * 6}px rgba(255,255,255,0.3)`;

  starContainer.appendChild(star);
}

// ======================= PARALLAX MIT MAUSBEWEGUNG =======================
document.addEventListener("mousemove", (e) => {
  const stars = document.querySelectorAll("#kapitel4 .star");
  const { innerWidth, innerHeight } = window;

  const offsetX = (e.clientX / innerWidth - 0.5) * 2;
  const offsetY = (e.clientY / innerHeight - 0.5) * 2;

  stars.forEach(star => {
    const speed = parseFloat(star.dataset.speed) || 0.3;
    const x = offsetX * 30 * speed;
    const y = offsetY * 30 * speed;
    star.style.transform = `translate(${x}px, ${y}px)`;
  });
});

// ======================= BODY-FARBE BEI SCROLLEN =======================
ScrollTrigger.create({
  trigger: "#kapitel4",
  start: "top center",
  end: "bottom center",
  onEnter: () =>
    gsap.to("body", {
      duration: 0.5,
      onStart: () => {
        document.body.style.backgroundImage =
          "linear-gradient(to right, #0a001f 0%, #3b0066 50%, #0a001f 100%)";
      },
    }),
  onEnterBack: () =>
    gsap.to("body", {
      duration: 0.5,
      onStart: () => {
        document.body.style.backgroundImage =
          "linear-gradient(to right, #0a001f 0%, #3b0066 50%, #0a001f 100%)";
      },
    }),
  onLeave: () =>
    gsap.to("body", {
      duration: 0.5,
      onStart: () => {
        document.body.style.backgroundImage = "";
      },
    }),
  onLeaveBack: () =>
    gsap.to("body", {
      duration: 0.5,
      onStart: () => {
        document.body.style.backgroundImage = "";
      },
    }),
});
