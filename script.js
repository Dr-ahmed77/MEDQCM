/* ================================
   MedQCM — script.js
   ================================ */

// ══════════════════════════════════════════════
//  DATA
//  • Pour ajouter une QUESTION : copiez un bloc { q, opts, correct, exp }
//  • Pour ajouter un MODULE    : ajoutez NomModule: [ ... ] dans LESSONS
// ══════════════════════════════════════════════
const LESSONS = {

  Immunologie: [
    {
      q: "Quels sont les organes lymphoïdes primaires ?",
      opts: ["Thymus", "Rate", "Moelle osseuse", "Ganglions lymphatiques", "Plaques de Peyer"],
      correct: [0, 2],
      exp: "Les organes lymphoïdes primaires sont la moelle osseuse (maturation des LB) et le thymus (maturation des LT). La rate, les ganglions et les plaques de Peyer sont des organes secondaires."
    },
    {
      q: "Concernant les immunoglobulines, quelles affirmations sont exactes ?",
      opts: ["Les IgG traversent le placenta", "Les IgM sont les premières produites lors d'une réponse primaire", "Les IgA sont abondantes dans les sécrétions", "Les IgE sont impliquées dans l'allergie", "Les IgD activent le complément"],
      correct: [0, 1, 2, 3],
      exp: "Les IgG traversent le placenta. Les IgM sont les premières synthétisées. Les IgA dominent dans les sécrétions. Les IgE médient l'hypersensibilité de type I. Les IgD n'activent pas le complément."
    },
    {
      q: "L'hypersensibilité de type I (anaphylactique) implique :",
      opts: ["Les IgE", "Les mastocytes", "Les IgG exclusivement", "L'histamine", "Les lymphocytes T cytotoxiques"],
      correct: [0, 1, 3],
      exp: "L'hypersensibilité de type I est médiée par les IgE fixées sur les mastocytes. La dégranulation libère l'histamine. Les LT cytotoxiques sont impliqués dans le type IV."
    },
    {
      q: "Le CMH de classe II présente les antigènes aux :",
      opts: ["Lymphocytes T CD4+", "Lymphocytes T CD8+", "Lymphocytes B", "Cellules NK", "Macrophages"],
      correct: [0],
      exp: "Le CMH II présente les antigènes exogènes aux LT CD4+ (helper). Le CMH I présente aux LT CD8+ (cytotoxiques)."
    },
    {
      q: "Quels mécanismes sont impliqués dans la tolérance centrale ?",
      opts: ["Sélection positive thymique", "Sélection négative thymique", "Anergie périphérique", "Délétion clonale centrale", "Régulation par les Treg"],
      correct: [0, 1, 3],
      exp: "La tolérance centrale se fait dans le thymus : sélection positive et négative (délétion des T auto-réactifs). L'anergie et les Treg relèvent de la tolérance périphérique."
    },
    // ─── AJOUTEZ VOS QUESTIONS IMMUNOLOGIE ICI ───
    // {
    //   q: "Votre question ?",
    //   opts: ["A", "B", "C", "D", "E"],
    //   correct: [0, 1],
    //   exp: "Explication..."
    // },
  ],

  Génétique: [
    {
      q: "Concernant la mitose, quelles propositions sont correctes ?",
      opts: ["Elle produit 2 cellules filles identiques", "Elle réduit le nombre de chromosomes de moitié", "Elle comprend prophase, métaphase, anaphase, télophase", "Elle est à l'origine de la diversité génétique", "Elle maintient le nombre diploïde (2n)"],
      correct: [0, 2, 4],
      exp: "La mitose produit 2 cellules filles diploïdes identiques (2n) en 4 phases. C'est la méiose qui réduit le nombre de chromosomes et génère la diversité génétique."
    },
    {
      q: "L'hérédité autosomique récessive se caractérise par :",
      opts: ["Atteinte des deux sexes également", "Parents souvent porteurs sains", "Transmission de père en fils obligatoire", "Risque de 25% si deux parents hétérozygotes", "Saut de générations possible"],
      correct: [0, 1, 3, 4],
      exp: "L'AR touche les deux sexes. Les parents sont souvent hétérozygotes (porteurs sains). Si Aa×Aa : 25% atteints. Les sauts de génération sont possibles."
    },
    {
      q: "La trisomie 21 (syndrome de Down) est associée à :",
      opts: ["Un chromosome 21 surnuméraire", "Une translocation robertsonienne dans certains cas", "Une non-disjonction méiotique", "Une délétion chromosomique", "Un risque augmenté avec l'âge maternel"],
      correct: [0, 1, 2, 4],
      exp: "La T21 est due à un chr 21 en triple (non-disjonction méiotique dans 95% des cas). Dans 4% c'est une translocation robertsonienne t(14;21). Le risque augmente avec l'âge maternel."
    },
    {
      q: "Concernant les mutations, quelles affirmations sont vraies ?",
      opts: ["Une mutation faux-sens change un acide aminé", "Une mutation non-sens introduit un codon stop prématuré", "Une mutation silencieuse change toujours la protéine", "Les mutations frameshift décalent le cadre de lecture", "Toutes les mutations sont pathogènes"],
      correct: [0, 1, 3],
      exp: "Faux-sens : AA différent. Non-sens : codon stop prématuré. Silencieuse : même AA, pas de changement protéique. Frameshift : décalage du cadre de lecture. Toutes les mutations ne sont pas pathogènes."
    },
    {
      q: "L'hérédité liée à l'X récessive : quelles propositions sont exactes ?",
      opts: ["Les femmes conductrices transmettent le gène", "Les hommes atteints transmettent le gène à toutes leurs filles", "Un homme atteint peut transmettre à ses fils directement", "Le risque pour un fils d'une conductrice est de 50%", "Les femmes homozygotes peuvent être atteintes"],
      correct: [0, 1, 3, 4],
      exp: "Les conductrices (XᴬXᵃ) transmettent le gène. Un père atteint donne Xᵃ à toutes ses filles. Il ne transmet pas à ses fils. Risque pour fils d'une conductrice : 50%."
    },
    // ─── AJOUTEZ VOS QUESTIONS GÉNÉTIQUE ICI ───
    // {
    //   q: "Votre question ?",
    //   opts: ["A", "B", "C", "D", "E"],
    //   correct: [0],
    //   exp: "Explication..."
    // },
  ],

};

// ── CONSTANTS ─────────────────────────────────
const LETTERS      = ["A","B","C","D","E"];
const GIFS = {
  correct: "https://media.giphy.com/media/JRQwUPUyyw69LENPFx/giphy.gif",
  partial: "https://media.giphy.com/media/mvnCob7ltFFLhP7Bgk/giphy.gif",
  wrong:   "https://media.giphy.com/media/EVRFXLkjI5QsZm0iNR/giphy.gif"
};

function showGif(type) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:9999;
    display:flex; align-items:center; justify-content:center;
    background:rgba(0,0,0,0.5); animation: fadeIn 0.2s ease;
  `;
  overlay.innerHTML = `<img src="${GIFS[type]}" style="width:280px; border-radius:16px;">`;
  overlay.onclick = () => overlay.remove();
  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), 2500);
}
const LESSON_NAMES = Object.keys(LESSONS);

// ── STATE ──────────────────────────────────────
let lessonIdx = 0;
let qIdx      = 0;
let selected  = [];
let revealed  = false;
let flashMode = false;
let fcFlipped = false;
let score     = 0;
let answered  = new Set();

// ── SOUND ──────────────────────────────────────
function playTick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.setValueAtTime(900, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.07);
    g.gain.setValueAtTime(0.06, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    o.start(); o.stop(ctx.currentTime + 0.09);
  } catch(e) {}
}

// ── HELPERS ────────────────────────────────────
function questions() { return LESSONS[LESSON_NAMES[lessonIdx]]; }
function question()  { return questions()[qIdx]; }
function pad(n)      { return n < 10 ? "0" + n : "" + n; }

let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

// ── LESSON TABS ────────────────────────────────
function buildTabs() {
  const container = document.getElementById("lessonTabs");
  container.innerHTML = "";
  LESSON_NAMES.forEach((name, i) => {
    const btn = document.createElement("button");
    btn.className = "lesson-tab" + (i === lessonIdx ? " active" : "");
    btn.textContent = name;
    btn.onclick = () => switchLesson(i);
    container.appendChild(btn);
  });
}

// ── BUG FIX 1 : switch lesson resets TOUT ─────
function switchLesson(i) {
  lessonIdx = i;
  qIdx      = 0;
  selected  = [];
  revealed  = false;       // ← reset revealed
  flashMode = false;       // ← reset mode flashcard aussi
  fcFlipped = false;
  score     = 0;
  answered  = new Set();

  // reset UI flashcard button
  document.getElementById("btnFlashcard").classList.remove("active");
  document.getElementById("qcmMode").classList.add("active");
  document.getElementById("flashMode").classList.remove("active");

  buildTabs();
  updateScore();
  renderQCM();             // ← force QCM render immédiatement
}

// ── PROGRESS ──────────────────────────────────
function updateProgress() {
  const qs  = questions();
  const pct = ((qIdx + 1) / qs.length) * 100;
  document.getElementById("progressFill").style.width  = pct + "%";
  document.getElementById("progressLabel").textContent = `${qIdx + 1} / ${qs.length}`;
}

// ── SCORE ─────────────────────────────────────
function updateScore() {
  document.getElementById("scoreVal").textContent = score;
  document.getElementById("totalVal").textContent = answered.size;
}

// ── DOTS ──────────────────────────────────────
function buildDots(containerId, count, current, clickFn) {
  const c = document.getElementById(containerId);
  c.innerHTML = "";
  const max = Math.min(count, 15);
  for (let i = 0; i < max; i++) {
    const d = document.createElement("div");
    d.className = "dot" + (i === current ? " active" : "");
    d.onclick = () => clickFn(i);
    c.appendChild(d);
  }
}

// ── QCM RENDER ────────────────────────────────
function renderQCM() {
  const q = question();

  // BUG FIX 2 : on force le re-render complet de la carte
  // en recréant le contenu — plus de state "bloqué"
  document.getElementById("qNum").textContent  = pad(qIdx + 1);
  document.getElementById("qText").textContent = q.q;

  const list = document.getElementById("optionsList");
  list.innerHTML = "";
  q.opts.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "opt";
    if (revealed) {
      if (q.correct.includes(i))     div.classList.add("correct");
      else if (selected.includes(i)) div.classList.add("wrong");
    } else if (selected.includes(i)) div.classList.add("selected");

    div.innerHTML = `<div class="opt-letter">${LETTERS[i]}</div><div class="opt-text">${opt}</div>`;
    div.onclick = () => {
      if (revealed) return;
      playTick();
      if (selected.includes(i)) selected = selected.filter(x => x !== i);
      else selected.push(i);
      renderQCM();
    };
    list.appendChild(div);
  });

  // Reveal panel
  const panel = document.getElementById("revealPanel");
  const btn   = document.getElementById("btnReveal");

  // BUG FIX 2 suite : reset panel à chaque render
  if (revealed) {
    panel.classList.add("open");
    btn.classList.add("hidden");
    document.getElementById("correctLetters").innerHTML =
      q.correct.map(i => `<span>${LETTERS[i]}</span>`).join("");
    document.getElementById("explanation").textContent = q.exp;
  } else {
    panel.classList.remove("open");
    btn.classList.remove("hidden");
    document.getElementById("correctLetters").innerHTML = "";
    document.getElementById("explanation").textContent  = "";
  }

  document.getElementById("prevBtn").disabled = qIdx === 0;
  document.getElementById("nextBtn").disabled = qIdx === questions().length - 1;

  buildDots("dots", questions().length, qIdx, (i) => {
    qIdx = i; selected = []; revealed = false; renderQCM(); updateProgress();
  });

  updateProgress();
}

// ── FLASHCARD RENDER ──────────────────────────
// BUG FIX 3 : flashcard indépendant par module
function renderFlashcard() {
  const q = question();

  document.getElementById("fcQ").textContent   = q.q;
  document.getElementById("fcAns").textContent = q.correct.map(i => q.opts[i]).join(" — ");
  document.getElementById("fcExp").textContent = q.exp;

  // reset flip à chaque nouvelle carte / nouveau module
  const fc = document.getElementById("fc");
  fc.classList.remove("flipped");
  fcFlipped = false;

  document.getElementById("fcPrev").disabled = qIdx === 0;
  document.getElementById("fcNext").disabled = qIdx === questions().length - 1;

  buildDots("fcDots", questions().length, qIdx, (i) => {
    qIdx = i; renderFlashcard(); updateProgress();
  });

  updateProgress();
}

// ── RENDER ────────────────────────────────────
function render() {
  buildTabs();
  updateScore();
  if (flashMode) renderFlashcard();
  else           renderQCM();
}

// ── EVENTS ────────────────────────────────────

// Show answer
document.getElementById("btnReveal").onclick = () => {
  revealed = true;
  const key = `${lessonIdx}-${qIdx}`;
  if (!answered.has(key)) {
    answered.add(key);
    const q = question();
    const isRight = q.correct.slice().sort().join() === selected.slice().sort().join();
    if (isRight) {
  score++;
  showGif("correct");
} else {
  const hasAnySel  = selected.length > 0;
  const hasSomeRight = selected.some(i => q.correct.includes(i));
  if (hasAnySel && hasSomeRight) showGif("partial");
  else showGif("wrong");
}
    updateScore();
  }
  renderQCM();
};

// QCM nav
document.getElementById("prevBtn").onclick = () => {
  if (qIdx > 0) {
    qIdx--; selected = []; revealed = false;
    renderQCM(); updateProgress();
  }
};
document.getElementById("nextBtn").onclick = () => {
  if (qIdx < questions().length - 1) {
    qIdx++; selected = []; revealed = false;
    renderQCM(); updateProgress();
  }
};

// Flashcard flip
document.getElementById("fc").onclick = () => {
  playTick();
  fcFlipped = !fcFlipped;
  document.getElementById("fc").classList.toggle("flipped", fcFlipped);
};

// Flashcard nav
document.getElementById("fcPrev").onclick = () => {
  if (qIdx > 0) { qIdx--; renderFlashcard(); }
};
document.getElementById("fcNext").onclick = () => {
  if (qIdx < questions().length - 1) { qIdx++; renderFlashcard(); }
};

// Toggle flashcard mode
document.getElementById("btnFlashcard").onclick = () => {
  flashMode = !flashMode;
  fcFlipped = false;
  document.getElementById("btnFlashcard").classList.toggle("active", flashMode);
  document.getElementById("qcmMode").classList.toggle("active",  !flashMode);
  document.getElementById("flashMode").classList.toggle("active",  flashMode);
  if (flashMode) renderFlashcard();
  else           renderQCM();
};

// Save
document.getElementById("btnSave").onclick = () => {
  localStorage.setItem("medqcm_save", JSON.stringify({
    lessonIdx, qIdx, score, answered: [...answered]
  }));
  showToast("✓  Progression sauvegardée");
};

// ── LOAD SAVE ─────────────────────────────────
function loadSave() {
  try {
    const raw = localStorage.getItem("medqcm_save");
    if (!raw) return;
    const s = JSON.parse(raw);
    lessonIdx = s.lessonIdx ?? 0;
    qIdx      = s.qIdx      ?? 0;
    score     = s.score     ?? 0;
    answered  = new Set(s.answered ?? []);
  } catch(e) {}
}

// ── INIT ──────────────────────────────────────
loadSave();
render();
