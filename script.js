/* ================================
   MedQCM — script.js
   ================================ */

// ── DATA ──────────────────────────────────────
const LESSONS = {
  Immunologie: [
    {
      q: "Which of the following are classic modifiable risk factors for coronary artery disease?",
      opts: ["Hypertension", "Hypercholesterolaemia", "Low BMI", "Diabetes mellitus", "Smoking"],
      correct: [0, 1, 3, 4],
      exp: "The five major modifiable CAD risk factors are hypertension, dyslipidaemia, diabetes, smoking, and obesity. Low BMI and regular exercise are protective, not risk factors."
    },
    {
      q: "Regarding acute STEMI management, which statements are correct?",
      opts: ["Primary PCI preferred if available within 120 min", "Aspirin is contraindicated acutely", "ST elevation ≥1 mm in ≥2 contiguous limb leads", "New LBBB may be STEMI equivalent", "Troponin elevation confirms myocardial necrosis"],
      correct: [0, 2, 3, 4],
      exp: "Primary PCI is gold standard if door-to-balloon ≤120 min. Aspirin 300 mg is given immediately. New LBBB is treated as STEMI equivalent. Troponin rise confirms necrosis."
    },
    {
      q: "Which drugs are first-line in heart failure with reduced ejection fraction (HFrEF)?",
      opts: ["ACE inhibitor / ARNi", "Beta-blocker", "Loop diuretic (first-line)", "Aldosterone antagonist", "Digoxin (first-line)"],
      correct: [0, 1, 3],
      exp: "Proven mortality benefit in HFrEF: ACE-i/ARNi, beta-blockers, and aldosterone antagonists. Loop diuretics relieve symptoms but don't reduce mortality. Digoxin is adjunct only."
    },
    {
      q: "Signs of severe aortic stenosis include:",
      opts: ["Peak jet velocity > 4 m/s", "Valve area < 1 cm²", "Wide pulse pressure", "Mean gradient > 40 mmHg", "Soft or absent A2"],
      correct: [0, 1, 3, 4],
      exp: "Severe AS: velocity >4 m/s, area <1 cm², mean gradient >40 mmHg, soft/absent A2. Wide pulse pressure is characteristic of aortic REGURGITATION, not stenosis."
    }
  ],
  Génitique: [
    {
      q: "Which spirometric findings indicate obstructive lung disease?",
      opts: ["FEV1/FVC < 0.70", "Increased total lung capacity", "Reduced FVC only", "Elevated residual volume", "Reduced DLCO in emphysema"],
      correct: [0, 1, 3, 4],
      exp: "Obstruction: FEV1/FVC <0.70, TLC and RV elevated (air trapping). DLCO reduced in emphysema. Reduced FVC alone suggests restriction."
    },
    {
      q: "Regarding pulmonary embolism diagnosis and management:",
      opts: ["D-dimer rules out PE in low-probability patients", "CTPA is the imaging gold standard", "S1Q3T3 on ECG is pathognomonic", "Heparin must overlap warfarin ≥5 days", "Elevated troponin signals RV injury"],
      correct: [0, 1, 3, 4],
      exp: "D-dimer is highly sensitive (good rule-out). CTPA is gold standard. S1Q3T3 suggests but is NOT pathognomonic. Heparin-warfarin overlap ≥5 days. Troponin rise = RV injury."
    },
    {
      q: "Common community-acquired pneumonia (CAP) pathogens include:",
      opts: ["Streptococcus pneumoniae", "Mycoplasma pneumoniae", "Pseudomonas aeruginosa", "Haemophilus influenzae", "Legionella pneumophila"],
      correct: [0, 1, 3, 4],
      exp: "S. pneumoniae is the most common CAP pathogen. Atypicals (Mycoplasma, Legionella) and H. influenzae are common. Pseudomonas typically causes nosocomial pneumonia."
    }
  ],
};

// ── CONSTANTS ─────────────────────────────────
const LETTERS      = ["A","B","C","D","E"];
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
    o.frequency.setValueAtTime(880, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.06);
    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    o.start(); o.stop(ctx.currentTime + 0.09);
  } catch(e) {}
}

function playSuccess() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784].forEach((freq, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + i*0.1);
      g.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i*0.1 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i*0.1 + 0.2);
      o.start(ctx.currentTime + i*0.1);
      o.stop(ctx.currentTime + i*0.1 + 0.22);
    });
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
  toastTimer = setTimeout(() => t.classList.remove("show"), 2500);
}

// ── LESSON TABS ────────────────────────────────
function buildTabs() {
  const container = document.getElementById("lessonTabs");
  container.innerHTML = "";
  LESSON_NAMES.forEach((name, i) => {
    const btn = document.createElement("button");
    btn.className = "lesson-tab" + (i === lessonIdx ? " active" : "");
    btn.textContent = name;
    btn.onclick = () => {
      lessonIdx = i; qIdx = 0; selected = []; answered = new Set(); score = 0;
      revealed = false;
      buildTabs();
      render();
    };
    container.appendChild(btn);
  });
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
  if (!c) return;
  c.innerHTML = "";
  const max = Math.min(count, 20);
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

  document.getElementById("qNum").textContent  = pad(qIdx + 1);
  document.getElementById("qText").textContent = q.q;

  // Animate card
  const card = document.getElementById("qcmCard");
  card.style.animation = 'none';
  card.offsetHeight; // reflow
  card.style.animation = '';

  // Options
  const list = document.getElementById("optionsList");
  list.innerHTML = "";
  q.opts.forEach((opt, i) => {
    const div = document.createElement("div");
    div.className = "opt";
    div.style.animationDelay = (i * 0.04) + 's';

    if (revealed) {
      if (q.correct.includes(i))        div.classList.add("correct");
      else if (selected.includes(i))    div.classList.add("wrong");
    } else if (selected.includes(i))    div.classList.add("selected");

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
  if (revealed) {
    panel.classList.add("open");
    btn.classList.add("hidden");
    const cl = document.getElementById("correctLetters");
    cl.innerHTML = q.correct.map(i => `<span>${LETTERS[i]}</span>`).join("");
    document.getElementById("explanation").textContent = q.exp;
  } else {
    panel.classList.remove("open");
    btn.classList.remove("hidden");
  }

  // Nav
  document.getElementById("prevBtn").disabled = qIdx === 0;
  document.getElementById("nextBtn").disabled = qIdx === questions().length - 1;

  buildDots("dots", questions().length, qIdx, (i) => {
    qIdx = i; selected = []; revealed = false; renderQCM(); updateProgress();
  });

  updateProgress();
}

// ── FLASHCARD RENDER ──────────────────────────
function renderFlashcard() {
  const q = question();
  document.getElementById("fcQ").textContent   = q.q;
  document.getElementById("fcAns").textContent = q.correct.map(i => q.opts[i]).join(" · ");
  document.getElementById("fcExp").textContent = q.exp;

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

// ── MODE TOGGLE ───────────────────────────────
function setMode(isFlash) {
  flashMode = isFlash;
  document.getElementById("btnQCM").classList.toggle("active", !isFlash);
  document.getElementById("btnFlashcard").classList.toggle("active", isFlash);
  document.getElementById("qcmMode").classList.toggle("active", !isFlash);
  document.getElementById("flashMode").classList.toggle("active",  isFlash);
  if (isFlash) renderFlashcard();
  else         { revealed = false; renderQCM(); }
}

// ── EVENTS ────────────────────────────────────
document.getElementById("btnReveal").onclick = () => {
  revealed = true;
  const key = `${lessonIdx}-${qIdx}`;
  if (!answered.has(key)) {
    answered.add(key);
    const q = question();
    const isRight = q.correct.slice().sort().join() === selected.slice().sort().join();
    if (isRight) { score++; playSuccess(); }
    updateScore();
  }
  renderQCM();
};

document.getElementById("prevBtn").onclick = () => {
  if (qIdx > 0) { qIdx--; selected = []; revealed = false; renderQCM(); updateProgress(); }
};
document.getElementById("nextBtn").onclick = () => {
  if (qIdx < questions().length - 1) { qIdx++; selected = []; revealed = false; renderQCM(); updateProgress(); }
};

document.getElementById("fc").onclick = () => {
  playTick();
  fcFlipped = !fcFlipped;
  document.getElementById("fc").classList.toggle("flipped", fcFlipped);
};

document.getElementById("fcPrev").onclick = () => {
  if (qIdx > 0) { qIdx--; renderFlashcard(); updateProgress(); }
};
document.getElementById("fcNext").onclick = () => {
  if (qIdx < questions().length - 1) { qIdx++; renderFlashcard(); updateProgress(); }
};

document.getElementById("btnQCM").onclick      = () => setMode(false);
document.getElementById("btnFlashcard").onclick = () => setMode(true);

document.getElementById("btnSave").onclick = () => {
  localStorage.setItem("medqcm_save", JSON.stringify({
    lessonIdx, qIdx, score, answered: [...answered]
  }));
  showToast("✓  Progress saved");
};

// ── KEYBOARD SHORTCUTS ────────────────────────
document.addEventListener("keydown", e => {
  if (e.target.tagName === "INPUT") return;
  if (!flashMode) {
    if (e.key === "ArrowRight" && qIdx < questions().length - 1) {
      qIdx++; selected = []; revealed = false; renderQCM(); updateProgress();
    }
    if (e.key === "ArrowLeft" && qIdx > 0) {
      qIdx--; selected = []; revealed = false; renderQCM(); updateProgress();
    }
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!revealed) document.getElementById("btnReveal").click();
    }
    // A-E shortcuts
    const idx = ["a","b","c","d","e"].indexOf(e.key.toLowerCase());
    if (idx !== -1 && idx < question().opts.length && !revealed) {
      playTick();
      if (selected.includes(idx)) selected = selected.filter(x => x !== idx);
      else selected.push(idx);
      renderQCM();
    }
  } else {
    if (e.key === "ArrowRight" && qIdx < questions().length - 1) {
      qIdx++; renderFlashcard(); updateProgress();
    }
    if (e.key === "ArrowLeft" && qIdx > 0) {
      qIdx--; renderFlashcard(); updateProgress();
    }
    if (e.key === " ") {
      e.preventDefault();
      document.getElementById("fc").click();
    }
  }
});

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
buildTabs();
renderQCM();
updateScore();
