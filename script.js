gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, MorphSVGPlugin, DrawSVGPlugin);

const hamburger = document.querySelector(".hamburger");
const nav = document.querySelector(".nav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open"); // für die X-Animation
  nav.classList.toggle("open");       // für das Menü
});



// =========================
// Kapitel 0 – Intro Linie animieren mit DrawSVG
// =========================


// Beide Linien auf 0% setzen
gsap.set("#intro-line-yellow", { drawSVG: "0%" });
gsap.set("#intro-line-black", { drawSVG: "0%" });

// Timeline mit ScrollTrigger
ScrollTrigger.create({
  trigger: "#intro",
  start: "top center",
  once: true,
  onEnter: () => {
    const tl = gsap.timeline({ delay: 1 }); // ⏱️ Startet 2 Sekunden später

    tl.to("#intro-line-black", {
      duration: 3,
      drawSVG: "100%",
      ease: "power2.out"
    }, 0)

    .to("#intro-line-yellow", {
      duration: 3,
      drawSVG: "100%",
      ease: "power2.out"
    }, 0);
  }
});


document.querySelector(".scroll-area .arrow")?.addEventListener("click", () => {
  const triggerElement = document.querySelector("#kapitel1");
  const scrollToY = triggerElement.getBoundingClientRect().top + window.scrollY;

  gsap.to(window, {
    duration: 2,
    scrollTo: scrollToY,
    ease: "power2.inOut",
    onComplete: () => {
      // Manuell Kapitel 1 starten, weil Trigger nicht feuert
      if (!kapitel1Done) {
        console.log("Kapitel 1 manuell gestartet");
        startKapitel1Animation();
      }
    }
  });
});



/* =========================
  Kapitel Punkte
========================= */

// Zentrale Zuordnung: Kapitel zu Punkt-Index
const kapitelMap = [
  { id: "#intro", index: 0 },      
  { id: "#kapitel1", index: 0 },


  { id: "#kapitel25", index: 2 }, 
  { id: "#kapitel3", index: 2 },

  { id: "#kapitel4", index: 3 },
  { id: "#kapitel5", index: 3 },

  { id: "#kapitel5-5", index: 4 }, 
  { id: "#kapitel6", index: 4 },

  { id: "#kapitel7", index: 5 },

  { id: "#mehr-inkas", index: 6 }
];

/* ✅ Scroll zu Kapitel bei Klick auf Punkt */
document.querySelectorAll('.kapitel-nav .dot').forEach((dot, dotIndex) => {
  dot.addEventListener('click', () => {
    // Zum ersten Kapitel mit gleichem Index scrollen
    const targetKapitel = kapitelMap.find(kap => kap.index === dotIndex);
    if (targetKapitel) {
      gsap.to(window, {
        duration: 1,
        scrollTo: targetKapitel.id,
        ease: "power2.inOut"
      });
    }
  });
});

/* ✅ ScrollTrigger für Punkte aktivieren */
kapitelMap.forEach((kapitel) => {
  ScrollTrigger.create({
    trigger: kapitel.id,
    start: "top center",
    end: "bottom center",
    onEnter: () => setActiveDot(kapitel.index),
    onEnterBack: () => setActiveDot(kapitel.index)
  });
});

/* ✅ Aktivieren des Punktes */
function setActiveDot(index) {
  document.querySelectorAll('.kapitel-nav .dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

/* ✅ Auf Seite laden richtigen Punkt prüfen */
window.addEventListener("load", () => {
  kapitelMap.forEach((kapitel) => {
    const el = document.querySelector(kapitel.id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const inViewport = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
      if (inViewport) {
        setActiveDot(kapitel.index);
      }
    }
  });
});

// ================================
// Kapitel 1 – ohne Pin, ohne Scroll-Verlängerung
// ================================

let kapitel1Done = false;
let kapitel1Started = false;

function initKapitel1() {
  const kapitel1 = document.querySelector("#kapitel1");

  ScrollTrigger.create({
    trigger: kapitel1,
    start: "top 80%",
    once: true,
    onEnter: () => {
      if (!kapitel1Started) {
        kapitel1Started = true;
        startKapitel1Animation();
      }
    }
  });
}

function startKapitel1Animation() {
  const tl = gsap.timeline();

  tl.to(".heading", { opacity: 1, duration: 0.6 })
    .to(".subtitle", { opacity: 1, duration: 0.6 }, "-=0.3")
    .to(".timer", {
      opacity: 1,
      duration: 0.4,
      onStart: () => {
        document.getElementById("timer").textContent = "2015";
        gsap.set(".timer", {
          textShadow: "0 4px 4px rgba(154, 82, 30, 0.7)"
        });
      }
    })
    .to({}, { duration: 0.3 }) // kurze Pause
    .add(() => startCountdown());
}

function startCountdown() {
  const timerEl = document.getElementById("timer");
  let year = 2015;
  const target = 1200;
  const step = 25;
  const duration = 3; // Sekunden (schneller)
  const steps = Math.floor((year - target) / step);
  const stepTime = (duration * 1000) / steps;

  const overlay = document.querySelector(".gradient-overlay");
  overlay?.classList.add("active");

  let currentStep = 0;
  let previousYear = year;

  const interval = setInterval(() => {
    currentStep++;
    year -= step;

    if (year < target || currentStep >= steps) {
      year = target;
    }

    // Nur setzen, wenn sich die Zahl ändert
    if (year !== previousYear) {
      timerEl.textContent = year;
      previousYear = year;
    }

    if (year <= target) {
      clearInterval(interval);

      gsap.delayedCall(0.5, () => {
        // Timer-Effekt zurücksetzen
        gsap.set(".timer", {
          textShadow: "0 4px 4px rgba(154, 82, 30, 0.7)"
        });

        // Overlay ausblenden
        if (overlay) {
          gsap.to(overlay, {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
              overlay.style.animation = "none";
              overlay.classList.remove("active");
            }
          });
        }

        showFinalText();
      });
    }
  }, stepTime);
}

function showFinalText() {
  gsap.to(".final-text", {
    opacity: 1,
    duration: 0.8,
    onComplete: () => {
      kapitel1Done = true;
      console.log("Kapitel 1 abgeschlossen");

      const kapitel1 = document.querySelector("#kapitel1");
      const rect = kapitel1.getBoundingClientRect();
      const partlyVisible = rect.bottom > 0 && rect.top < window.innerHeight;

      if (partlyVisible) {
        gsap.to(window, {
          duration: 1.2,
          delay: 0.8,
          scrollTo: "#kapitel15",
          ease: "power2.inOut"
        });
      } else {
        console.log("Kein Auto-Scroll – Kapitel 1 nicht mehr sichtbar");
      }
    }
  });
}

window.addEventListener("load", () => {
  setTimeout(initKapitel1, 100);
});



// =========================
// KAPITEL 1.5 – Komplett ohne Animationen oder Pinning
// =========================

const textBlocks15 = document.querySelectorAll(".kapitel15-text");
const heading15 = document.querySelector(".kapitel15-heading");

// Inhalte sofort sichtbar machen
heading15.style.opacity = "1";
heading15.style.transform = "translateY(0)";
textBlocks15.forEach((el) => {
  el.style.opacity = "1";
  el.style.transform = "translateY(0)";
});


// =========================
// KAPITEL 2
// =========================

// ✅ Texte + Outlines
const texte = [
  {
    oben: "Der Sonnengott Inti sandte seinen Sohn Manco Cápac und seine Tochter Mama Ocllo auf die Erde.",
    unten: "Ihre Aufgabe war es, den Menschen Kultur und Ordnung zu bringen und ein neues Reich zu gründen."
  },
  {
    oben: "Die beiden tauchten aus dem heiligen Titicacasee auf.",
    unten: "In ihren Händen trugen sie einen goldenen Stab, den sie als göttliches Werkzeug erhalten hatten."
  },
  {
    oben: "Sie wanderten durch das weite Andenland, auf der Suche nach dem Ort, an dem sich der Stab mühelos in die Erde senken würde.",
    unten: "Der Ort, an dem sich der Stab in die Erde senkte, galt als von Inti auserwählt – dort sollte das neue Reich erblühen."
  },
  {
    oben: "Schließlich versank der Stab sanft im Boden eines fruchtbaren Tals.",
    unten: "Dort gründeten sie Cusco, das spirituelle und politische Zentrum des späteren Inka-Reiches."
  }
];

const outlinePaths = [
  "M100,20 A80,80 0 1,1 99,20 Z",
  "M20,20 L180,20 L180,180 L20,180 Z",
  "M100,20 L180,180 L20,180 Z",
  "M100,20 L120,100 L180,100 L130,140 L150,200 L100,160 L50,200 L70,140 L20,100 L80,100 Z"
];

// ✅ DOM-Elemente holen
const morphPath = document.getElementById('morph-path');
const morphContainer = document.querySelector('.morph-container');
const illus = document.querySelectorAll('.illu-1, .illu-2, .illu-3, .illu-4');
const illu1Rand = document.querySelector('.illu-rand');

const textOben = document.getElementById('text-oben-content');
const textUnten = document.getElementById('text-unten-content');

// ✅ Illu Sichtbarkeit steuern
function showIllu(index) {
  illus.forEach((illu, i) => {
    illu.classList.toggle('active', i === index);
  });
}

// ✅ Startzustand
textOben.innerHTML = `<span>${texte[0].oben}</span>`;
textUnten.innerHTML = `<span>${texte[0].unten}</span>`;
gsap.set(morphPath, { morphSVG: outlinePaths[0] });
showIllu(0);

// ✅ Rotation nur bei Illu 1
const rotation = gsap.to(illu1Rand, {
  rotation: 360,
  repeat: -1,
  ease: "linear",
  duration: 20,
  paused: false
});

// ✅ SplitText initialisieren
let splitOben = new SplitText(textOben.querySelector("span"), { type: "words,chars" });
let splitUnten = new SplitText(textUnten.querySelector("span"), { type: "words,chars" });

// ✅ Master Timeline für ScrollTrigger
const master = gsap.timeline({
  scrollTrigger: {
    trigger: "#kapitel2",
    start: "top top",
    end: "+=4000",
    scrub: true,
    pin: true
  }
});

// ✅ Durch alle Textabschnitte gehen
texte.forEach((text, index) => {
  const tl = gsap.timeline();

  if (index !== 0) {
    tl.to(splitOben.chars, { opacity: 0, y: -30, stagger: 0.01, duration: 0.3 });
    tl.to(splitUnten.chars, { opacity: 0, y: -30, stagger: 0.01, duration: 0.3 }, "<");
    tl.to(morphContainer, { opacity: 1, duration: 0.4 });
    tl.to(morphPath, { morphSVG: outlinePaths[index], duration: 1 });
    tl.to(morphContainer, { opacity: 0, duration: 0.4 });
    if (index === 1) tl.add(() => rotation.pause());
  }

  // ✅ Textwechsel + neue SplitText Instanz + Animation
  tl.add(() => {
    textOben.innerHTML = `<span>${text.oben}</span>`;
    textUnten.innerHTML = `<span>${text.unten}</span>`;

    splitOben.revert();
    splitUnten.revert();

    splitOben = new SplitText(textOben.querySelector("span"), { type: "words,chars" });
    splitUnten = new SplitText(textUnten.querySelector("span"), { type: "words,chars" });

    showIllu(index);
    if (index === 0) rotation.play();
  });

  // ✅ Animationsreihenfolge: ZUERST oben, dann unten
  tl.from(splitOben.chars, {
    opacity: 0,
    y: 30,
    stagger: 0.02,
    duration: 0.6,
    ease: "power2.out"
  });

  tl.from(splitUnten.chars, {
    opacity: 0,
    y: 30,
    stagger: 0.02,
    duration: 0.6,
    ease: "power2.out"
  });

  master.add(tl);
});

// Punkt 2 aktiv für Kapitel 15 und 2
ScrollTrigger.create({
  trigger: "#kapitel15",
  start: "top center",
  endTrigger: "#kapitel2",
  end: "bottom center",
  onEnter: () => setActiveDot(1),
  onEnterBack: () => setActiveDot(1)
});



// =========================
// KAPITEL 2.5 – Ohne Animationen, SplitText und Pinning
// =========================

const textBlocks25 = document.querySelectorAll("#kapitel25 .kapitel25-text");
const heading25 = document.querySelector("#kapitel25 .kapitel25-heading");
const infoButton = document.querySelector('#kapitel25 .info-button');
const infoBox = document.querySelector('#kapitel25 .info-box');

// Info-Box toggle
infoButton.addEventListener('click', () => {
  infoBox.classList.toggle('active');
});

// Inhalte direkt sichtbar machen
heading25.style.opacity = "1";
heading25.style.transform = "translateY(0)";
textBlocks25.forEach((el) => {
  el.style.opacity = "1";
  el.style.transform = "translateY(0)";
});

/* =========================
   KAPITEL 3 – Horizontale Timeline mit Punkten + Segment-Hover
========================= */
ScrollTrigger.matchMedia({
  "(min-width: 768px)": function () {
    const timelineTrack = document.querySelector(".timeline-track");
    const timelineItems = document.querySelectorAll(".timeline-item");

    // Start: 1. König (Index 0)
    const startItem = timelineItems[0];
    const startOffset =
      startItem.offsetLeft -
      window.innerWidth / 2 +
      startItem.offsetWidth / 2 -
      130;

    // Ende: letzter König (Index 6 bei 7 Königen), etwas früher stoppen
    const endItem = timelineItems[timelineItems.length - 1];
    const endOffset =
      endItem.offsetLeft -
      window.innerWidth / 2 +
      endItem.offsetWidth / 2 -
      1136;

    const scrollDistance = endOffset - startOffset;

    // Startposition setzen
    gsap.set(timelineTrack, {
      x: -startOffset,
    });

    // Scroll-Animation
    gsap.to(timelineTrack, {
      x: -endOffset,
      ease: "none",
      scrollTrigger: {
        trigger: "#kapitel3",
        start: "top top",
        end: "+=" + scrollDistance,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Alle Könige sofort sichtbar
    timelineItems.forEach((item) => {
      item.classList.add("visible");
    });

    // === SEGMENTE ERZEUGEN ===
    const container = document.querySelector(".timeline-container");

    for (let i = 0; i < timelineItems.length - 1; i++) {
      const current = timelineItems[i];
      const next = timelineItems[i + 1];

      const currentRect = current.getBoundingClientRect();
      const nextRect = next.getBoundingClientRect();

      const segment = document.createElement("div");
      segment.classList.add("timeline-segment");

      // Position relativ zur Container-Linie berechnen
      const left =
        current.offsetLeft +
        current.offsetWidth / 2 +
        (next.offsetLeft - current.offsetLeft - current.offsetWidth) / 2;

      const width = next.offsetLeft - current.offsetLeft;

      segment.style.left = `${left}px`;
      segment.style.width = `${width}px`;

      container.appendChild(segment);

      // Optional: Interaktion bei Hover
      segment.addEventListener("mouseenter", () => {
        segment.classList.add("active");
      });
      segment.addEventListener("mouseleave", () => {
        segment.classList.remove("active");
      });
    }
  },
});



// =========================
// KAPITEL 4 – Ohne Animationen, statisch
// =========================

const textBlocks4 = document.querySelectorAll("#kapitel4 .kapitel4-text");
const heading4 = document.querySelector("#kapitel4 .kapitel4-heading");

// Inhalte direkt sichtbar machen
heading4.style.opacity = "1";
heading4.style.transform = "translateY(0)";
textBlocks4.forEach((el) => {
  el.style.opacity = "1";
  el.style.transform = "translateY(0)";
});

/* =========================
   KAPITEL 5 – Text und Bild sanft von der Seite
========================= */

document.querySelectorAll('#kapitel5 .panel').forEach((panel) => {
  const text = panel.querySelector('.text');
  const illu = panel.querySelector('.illu');

  // Prüfen, ob der Text rechtsbündig ist (right-align), sonst linksbündig
  const textRightAlign = text.classList.contains('right-align');

  // Richtungen:
  // Wenn Text rechtsbündig -> Text von links außen, Illu von rechts außen
  // Wenn Text linksbündig -> Text von rechts außen, Illu von links außen
  const textFromX = textRightAlign ? -200 : 200;
  const illuFromX = textRightAlign ? 200 : -200;

  // Startpositionen setzen
  gsap.set(text, { x: textFromX, opacity: 0 });
  gsap.set(illu, { x: illuFromX, opacity: 0 });

  ScrollTrigger.create({
    trigger: panel,
    start: "top 80%",
    end: "bottom 60%",
    onEnter: () => {
      gsap.to(text, {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
      });
      gsap.to(illu, {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out"
      });
    },
    onLeaveBack: () => {
      gsap.to(text, {
        x: textFromX,
        opacity: 0,
        duration: 0.6,
        ease: "power2.in"
      });
      gsap.to(illu, {
        x: illuFromX,
        opacity: 0,
        duration: 0.6,
        ease: "power2.in"
      });
    }
  });
});

/* =========================
   KAPITEL 5.5 – Statischer Text (Dot 5)
========================= */

ScrollTrigger.create({
  trigger: "#kapitel5-5",
  start: "top 75%",
  onEnter: () => {
    const heading = document.querySelector("#kapitel5-5 .kapitel55-heading");
    const textBlocks = document.querySelectorAll("#kapitel5-5 .kapitel55-text");

    heading.style.opacity = "1";
    heading.style.transform = "translateY(0)";
    textBlocks.forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }
});

// =========================
// KAPITEL 6 – Der Bürgerkrieg (ohne Pinning, mit SplitText, Auto-Scroll zu Kapitel 6.5)
// =========================

let kapitel6Done = false;

function initKapitel6() {
  const kapitel6 = document.querySelector("#kapitel6");

  const kapitel6Top = kapitel6.offsetTop;
  const kapitel6Bottom = kapitel6Top + kapitel6.offsetHeight;

  // Wenn Nutzer Kapitel 6 überspringt
  if (window.scrollY > kapitel6Bottom) {
    console.log("Kapitel 6 wurde übersprungen – zeige statisch ohne Animation");

    gsap.set(".kapitel6-heading", { opacity: 1, y: 0 });
    gsap.set(".kapitel6-text .text-block", { opacity: 1 });
    gsap.set(".kapitel6-illu", { autoAlpha: 0, x: -100 });

    const illus = document.querySelectorAll(".kapitel6-illu");
    const lastIllu = illus[illus.length - 1];
    if (lastIllu) {
      gsap.set(lastIllu, { autoAlpha: 1, x: 0 });
    }

    kapitel6Done = true;
    return;
  }

  // Wenn Nutzer im Kapitel bleibt → Animation starten
  const observer = ScrollTrigger.create({
    trigger: kapitel6,
    start: "top center",
    once: true,
    onEnter: () => {
      if (!kapitel6Done) {
        console.log("Kapitel 6 startet");
        startKapitel6Animation();
      }
    }
  });
}

function startKapitel6Animation() {
  const heading = document.querySelector(".kapitel6-heading");
  const textBlocks = document.querySelectorAll(".kapitel6-text .text-block");
  const illus = document.querySelectorAll(".kapitel6-illu");

  gsap.set(heading, { opacity: 0, y: 50 });
  gsap.set(textBlocks, { opacity: 0 });
  gsap.set(illus, { autoAlpha: 0, x: 100 });

  const splitTextArray = Array.from(textBlocks).map(
    block => new SplitText(block, { type: "words,chars" })
  );

  const tl = gsap.timeline();

  // Schnellere Dauerwerte
  tl.to(heading, { opacity: 1, y: 0, duration: 0.6 });

  splitTextArray.forEach((split, index) => {
    const block = textBlocks[index];
    const illu = illus[index];

    tl.to(illu, { autoAlpha: 1, x: 0, duration: 0.6 });
    tl.to(block, { opacity: 1, duration: 0.2 });
    tl.from(split.chars, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      stagger: 0.015
    });

    // Vorherige Illustration ausblenden (außer letzte)
    if (index < illus.length - 1) {
      tl.to(illu, { autoAlpha: 0, x: -100, duration: 0.6 });
    }
  });

  // Kapitel fertig + Auto-Scroll zu #kapitel65
  tl.call(() => {
    kapitel6Done = true;
    console.log("Kapitel 6 abgeschlossen");

    const nextSection = document.querySelector("#kapitel65");
    if (nextSection) {
      gsap.to(window, {
        scrollTo: { y: nextSection, offsetY: 0 },
        duration: 1.2,
        ease: "power2.inOut"
      });
    }
  });
}

// Initialisierung nach Seitenladezeit
window.addEventListener("load", () => {
  setTimeout(() => {
    initKapitel6();
  }, 100);
});

/* =========================
   KAPITEL 65
========================= */
function initKapitel65() {
  const kapitel65 = document.querySelector("#kapitel65");
  const textBlocks = kapitel65.querySelectorAll(".kapitel65-text");

  // Startzustand für alle Textblöcke
  textBlocks.forEach((block) => {
    gsap.set(block, { opacity: 0, y: 40 });
  });

  ScrollTrigger.create({
    trigger: kapitel65,
    start: "top 80%",
    end: "bottom 60%",
    once: false,
    onEnter: () => {
      const tl = gsap.timeline();

      textBlocks.forEach((block, index) => {
        const split = new SplitText(block, { type: "words,chars" });

        tl.to(block, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out"
        });

        tl.from(split.chars, {
          opacity: 0,
          y: 10,
          duration: 0.4,
          stagger: 0.006,
          ease: "power2.out"
        }, "<"); // "<" bedeutet gleichzeitig mit vorherigem Block starten
      });
    },
    onLeaveBack: () => {
      // Wenn man zurückscrollt – alle Blöcke zurücksetzen
      textBlocks.forEach((block) => {
        gsap.to(block, {
          opacity: 0,
          y: 40,
          duration: 0.4,
          ease: "power2.in"
        });
      });
    }
  });
}

// Initialisierung
window.addEventListener("load", () => {
  setTimeout(() => {
    initKapitel65();
  }, 100);
});


/* =========================
   KAPITEL 7 – Blöcke + Texte animiert (Dot 6)
========================= */
// Kapitel 7 Animationen optimiert
document.querySelectorAll(".kapitel7-block").forEach((block) => {
  const fromLeft = block.querySelector(".from-left");
  const fromRight = block.querySelector(".from-right");

  // Startpositionen setzen
  gsap.set(fromLeft, { x: -100, opacity: 0 });
  gsap.set(fromRight, { x: 100, opacity: 0 });

  // Timeline für diesen Block
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: block,
      start: "top 80%",
      end: "top 40%",
      toggleActions: "play none none reverse",
      // markers: true, // Zum Debuggen aktivieren
    }
  });

  // Animationen in Reihenfolge
  tl.to(fromLeft, {
    x: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  }, 0);

  tl.to(fromRight, {
    x: 0,
    opacity: 1,
    duration: 0.8,
    ease: "power2.out"
  }, 0.2);
});
