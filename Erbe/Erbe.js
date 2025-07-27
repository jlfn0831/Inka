
const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open"); // für die X-Animation
  nav.classList.toggle("open");       // für das Menü
});



// =====================
// Bild Overlay Öffnen
// =====================
const overlay = document.getElementById('imageOverlay');
const overlayImage = document.getElementById('overlayImage');
const overlayDescription = document.getElementById('overlayDescription');
let currentImageIndex = 0;
let overlayImages = [];

document.querySelectorAll('.click-image').forEach((img, index) => {
  overlayImages.push({
    src: img.src,
    description: img.dataset.description || ''
  });

  img.addEventListener('click', () => {
    currentImageIndex = index;
    openOverlay();
  });
});

function openOverlay() {
  const current = overlayImages[currentImageIndex];
  overlayImage.src = current.src;
  overlayDescription.textContent = current.description;
  overlay.classList.add('active');
}

function closeOverlay() {
  overlay.classList.remove('active');
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % overlayImages.length;
  openOverlay();
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + overlayImages.length) % overlayImages.length;
  openOverlay();
}


// =====================
// Kapitel Dots aktivieren
// =====================
const dots = document.querySelectorAll('.kapitel-nav .dot');
const sections = Array.from(document.querySelectorAll('section')); // NUR EINMAL DEFINIERT

const sectionToDot = {};
sections.forEach((section, index) => {
  const id = section.getAttribute('id');
  if (dots[index]) {
    sectionToDot[id] = dots[index];
  }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const sectionId = entry.target.getAttribute('id');
    const dot = sectionToDot[sectionId];

    if (entry.isIntersecting) {
      dots.forEach(d => d.classList.remove('active'));
      if (dot) dot.classList.add('active');
    }
  });
}, {
  threshold: 0.5
});

sections.forEach(section => observer.observe(section));


// =====================
// Pfeile Oben Unten für Kapitel
// =====================
const nextBtnSection = document.getElementById('nextSection');
const prevBtnSection = document.getElementById('prevSection');

// Aktuelle Section berechnen: der Abschnitt, der am meisten sichtbar ist
function getCurrentSectionIndex() {
  let maxVisible = 0;
  let currentIndex = 0;
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    if (visibleHeight > maxVisible) {
      maxVisible = visibleHeight;
      currentIndex = index;
    }
  });
  return currentIndex;
}

// Scrollen zum nächsten oder vorherigen Kapitel
function scrollToSection(offset) {
  let index = getCurrentSectionIndex() + offset;
  index = Math.max(0, Math.min(sections.length - 1, index));
  sections[index].scrollIntoView({ behavior: 'smooth' });
}

// Event-Listener für die Pfeile
nextBtnSection.addEventListener('click', () => scrollToSection(1));
prevBtnSection.addEventListener('click', () => scrollToSection(-1));


// =====================
// Sanfter Scroll zu Kapiteln bei Dots
// =====================
dots.forEach(dot => {
  dot.addEventListener('click', function() {
    const targetId = dot.getAttribute('data-target');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// =====================
// Footsteps
// =====================

gsap.timeline({
  scrollTrigger: {
    trigger: "#kapitel0",
    start: "top center",
    end: "bottom center",
    scrub: false,
  }
}).fromTo(".footstep", 
  { opacity: 0, y: 30 }, 
  { opacity: 1, y: 0, stagger: 0.6, duration: 1.8, ease: "power2.out" }
);

// =====================
// Quipu Illu K2
// =====================

gsap.from("#kapitel2 .overlap-Q", {
  scrollTrigger: {
    trigger: "#kapitel2",
    start: "top center",
    toggleActions: "play none none reverse",
  },
  opacity: 0,
  y: 50,
  duration: 1.2,
  ease: "power3.out",
});

// =====================
// Inka Trail
// =====================

const paths = document.querySelectorAll('.trail-path path');

paths.forEach((path, index) => {
  const length = path.getTotalLength();

  // Setze durchgezogenen Stil zum Start
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#kapitel3",
      start: "top center",
      toggleActions: "play none none none"
    }
  });

  // Zeichnen der Linie
  tl.to(path, {
    strokeDashoffset: 0,
    duration: 3,
    ease: "power2.out",
  });

  // Nur für die zweite Linie (index === 1) anschließend zu gestrichelt wechseln
  if (index === 1) {
    tl.to(path, {
      strokeDasharray: "8 5", // gestricheltes Muster
      duration: 0.5,
    }, "+=0.2"); // kleiner Abstand nach dem Zeichnen
  }
});

// =====================
// Kapitel 4 Zwischenelemnt
// =====================
gsap.registerPlugin(ScrollTrigger);

// Timeline für Endlosschleife
const endlessLoop = gsap.to(".line-wrapper", {
  xPercent: -50, // 50% der Breite verschieben = ein Bild
  duration: 40,  // Langsame Geschwindigkeit
  ease: "linear",
  repeat: -1,
  paused: true
});

// ScrollTrigger aktiviert die Animation nur, wenn #kapitel4 sichtbar ist
ScrollTrigger.create({
  trigger: "#kapitel4",
  start: "top bottom",
  end: "bottom top",
  onEnter: () => endlessLoop.play(),
  onEnterBack: () => endlessLoop.play(),
  onLeave: () => endlessLoop.pause(),
  onLeaveBack: () => endlessLoop.pause()
});

// =====================
// Sonne: K8
// =====================

document.addEventListener("DOMContentLoaded", () => {
  const rotatingImage = document.querySelector(".grenz-außen");

  if (rotatingImage) {
    // Startrotation mit CSS-Animation
    rotatingImage.style.animation = "rotateOnPlace 50s linear infinite";
  }
});

// =====================
// Kapitel 9: Markieren
// =====================
gsap.set("#kapitel8 .svg-markierung path", {
  strokeDasharray: 2000,
  strokeDashoffset: 2000,
  opacity: 1  // sichtbar, aber noch nicht gezeichnet
});

ScrollTrigger.create({
  trigger: "#kapitel8",
  start: "top 80%",
  onEnter: () => {
    gsap.fromTo("#kapitel8 .svg-markierung path",
      {
        strokeDashoffset: 2000,
        opacity: 1
      },
      {
        strokeDashoffset: 0,
        duration: 3,
        ease: "power2.out"
      }
    );
  },
  onLeaveBack: () => {
    gsap.set("#kapitel8 .svg-markierung path", {
      strokeDashoffset: 2000
    });
  }
});
