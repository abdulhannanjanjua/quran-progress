/* ============================================================
   Quran Progress -- a simple lesson notebook for Affan and Mashal.

   Everything is stored in this browser only, under the localStorage
   key "quranProgress". Nothing is ever sent anywhere.

   The file is organised in these sections:
     1. Data           -- load, save, defaults
     2. Small helpers  -- dates, elements, progress maths
     3. Views          -- home, student, quran, settings
     4. Dialogs        -- update position, add/edit lesson
     5. Backup         -- export JSON, import JSON, export CSV, reset
     6. Router / start
   ============================================================ */


/* ============================================================
   1. DATA
   ============================================================ */

var STORAGE_KEY = "quranProgress";

/* What a brand new, empty app looks like. */
function defaultData() {
  return {
    version: 1,
    students: {
      affan:  newStudent("Affan"),
      mashal: newStudent("Mashal")
    },
    settings: {
      lastQuranPage: QURAN_FIRST_PAGE
    },
    highlights: {}
  };
}

function newStudent(name) {
  return {
    name: name,
    currentPosition: { juz: 1, surah: 1, ayah: 1, page: QURAN_FIRST_PAGE },
    lessons: []
  };
}

/* The one copy of the data the whole app works with. */
var data = loadData();

function loadData() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    var parsed = JSON.parse(raw);
    return mergeWithDefaults(parsed);
  } catch (e) {
    console.warn("Could not read saved data, starting fresh.", e);
    return defaultData();
  }
}

/* Fills in anything a saved file is missing, so an older backup
   never breaks the app. */
function mergeWithDefaults(saved) {
  var base = defaultData();
  if (!saved || typeof saved !== "object") return base;

  ["affan", "mashal"].forEach(function (key) {
    var s = saved.students && saved.students[key];
    if (!s) return;
    if (s.name) base.students[key].name = s.name;
    if (s.currentPosition) {
      base.students[key].currentPosition = {
        juz:   Number(s.currentPosition.juz)   || 1,
        surah: Number(s.currentPosition.surah) || 1,
        ayah:  Number(s.currentPosition.ayah)  || 1,
        page:  Number(s.currentPosition.page)  || QURAN_FIRST_PAGE
      };
    }
    if (Array.isArray(s.lessons)) base.students[key].lessons = s.lessons;
  });

  if (saved.settings && saved.settings.lastQuranPage) {
    base.settings.lastQuranPage = Number(saved.settings.lastQuranPage);
  }
  if (saved.highlights && typeof saved.highlights === "object") {
    base.highlights = saved.highlights;
  }
  return base;
}

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    alert("This browser would not let the app save data. If you are using " +
          "private browsing, please switch to a normal window.");
  }
}


/* ============================================================
   2. SMALL HELPERS
   ============================================================ */

var view = document.getElementById("view");

/* Escapes text so a teacher comment can never break the page. */
function esc(text) {
  return String(text == null ? "" : text)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun",
              "Jul","Aug","Sep","Oct","Nov","Dec"];

/* "2026-09-05" -> "5 Sep 2026" */
function formatDate(iso) {
  if (!iso) return "";
  var parts = String(iso).split("-");
  if (parts.length !== 3) return iso;
  return Number(parts[2]) + " " + MONTHS[Number(parts[1]) - 1] + " " + parts[0];
}

function todayIso() {
  var d = new Date();
  var m = String(d.getMonth() + 1).padStart(2, "0");
  var day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + m + "-" + day;
}

/* Lessons sorted newest first. */
function sortedLessons(student) {
  return student.lessons.slice().sort(function (a, b) {
    if (a.date === b.date) return (b.id || 0) - (a.id || 0);
    return a.date < b.date ? 1 : -1;
  });
}

function latestLesson(student) {
  var list = sortedLessons(student);
  return list.length ? list[0] : null;
}

/* A simple, honest progress measure: how far through the 30 juz. */
function progressPercent(student) {
  var juz = student.currentPosition.juz || 1;
  return Math.round((juz / 30) * 100);
}

function progressBar(percent) {
  return '<div class="bar"><div class="bar-fill" style="width:' +
         percent + '%"></div></div>';
}

function revisionBadge(student) {
  var last = latestLesson(student);
  if (last && last.revisionRequired) {
    return '<p class="badge warn">&#9888; Revision Required</p>';
  }
  return '<p class="badge ok">&#10003; No Revision Required</p>';
}


/* ============================================================
   3. VIEWS
   ============================================================ */

function renderHome() {
  var cards = ["affan", "mashal"].map(function (key) {
    var s = data.students[key];
    var pos = s.currentPosition;
    var last = latestLesson(s);
    var pct = progressPercent(s);

    return '' +
      '<a class="card student-card" href="#/student/' + key + '">' +
        '<h2>' + esc(s.name) + '</h2>' +
        '<dl class="facts">' +
          '<div><dt>Juz</dt><dd>' + pos.juz + '</dd></div>' +
          '<div><dt>Surah</dt><dd>' + esc(getSurah(pos.surah).name) + '</dd></div>' +
          '<div><dt>Ayah</dt><dd>' + pos.ayah + '</dd></div>' +
          '<div><dt>Page</dt><dd>' + pos.page + '</dd></div>' +
          '<div><dt>Last lesson</dt><dd>' +
            (last ? formatDate(last.date) : "None yet") + '</dd></div>' +
          '<div><dt>Latest mark</dt><dd>' +
            (last ? last.mark + "/10" : "Not yet") + '</dd></div>' +
        '</dl>' +
        revisionBadge(s) +
        '<p class="progress-label">Juz ' + pos.juz + ' of 30' +
          ' &middot; Surah ' + pos.surah + ' of 114</p>' +
        progressBar(pct) +
      '</a>';
  }).join("");

  view.innerHTML =
    '<h1>Quran Progress</h1>' +
    '<div class="student-grid">' + cards + '</div>' +
    '<p class="footnote">Tap a name to add a lesson or update where they are up to.</p>';
}


function renderStudent(key) {
  var s = data.students[key];
  if (!s) { location.hash = "#/"; return; }

  var pos = s.currentPosition;
  var pct = progressPercent(s);
  var lessons = sortedLessons(s);

  var history = lessons.length
    ? lessons.map(function (l) { return lessonRow(key, l); }).join("")
    : '<p class="empty">No lessons recorded yet.</p>';

  view.innerHTML =
    '<p class="crumb"><a href="#/">&larr; Home</a></p>' +
    '<h1>' + esc(s.name) + '</h1>' +

    '<section class="card">' +
      '<h2>Current Position</h2>' +
      '<dl class="facts">' +
        '<div><dt>Juz</dt><dd>' + pos.juz + '</dd></div>' +
        '<div><dt>Surah</dt><dd>' + esc(getSurah(pos.surah).name) + '</dd></div>' +
        '<div><dt>Ayah</dt><dd>' + pos.ayah + '</dd></div>' +
        '<div><dt>Page</dt><dd>' + pos.page + '</dd></div>' +
      '</dl>' +
      revisionBadge(s) +
      '<div class="button-row">' +
        '<button class="btn-primary" data-action="update-position">Update Position</button>' +
        '<button class="btn-primary" data-action="add-lesson">+ Add Lesson</button>' +
        '<a class="btn-plain" href="#/quran?page=' + pos.page + '">Open Quran at page ' + pos.page + '</a>' +
      '</div>' +
    '</section>' +

    '<section class="card">' +
      '<h2>Progress</h2>' +
      progressBar(pct) +
      '<p class="progress-label">Juz ' + pos.juz + ' of 30 &middot; ' + pct + '%</p>' +
      '<p class="progress-label">Currently in Surah ' + pos.surah +
        ' of 114: ' + esc(getSurah(pos.surah).name) + '</p>' +
      '<p class="progress-label">' + lessons.length + ' lesson' +
        (lessons.length === 1 ? '' : 's') + ' recorded</p>' +
    '</section>' +

    '<section class="card">' +
      '<h2>Lesson History</h2>' +
      history +
    '</section>';

  view.querySelector('[data-action="update-position"]')
      .addEventListener("click", function () { openPositionModal(key); });
  view.querySelector('[data-action="add-lesson"]')
      .addEventListener("click", function () { openLessonModal(key, null); });

  Array.prototype.forEach.call(view.querySelectorAll('[data-edit]'), function (b) {
    b.addEventListener("click", function () {
      openLessonModal(key, Number(b.getAttribute("data-edit")));
    });
  });
  Array.prototype.forEach.call(view.querySelectorAll('[data-delete]'), function (b) {
    b.addEventListener("click", function () {
      deleteLesson(key, Number(b.getAttribute("data-delete")));
    });
  });
}


function lessonRow(key, l) {
  var surahName = getSurah(l.surah).name;
  var ayahs = (l.fromAyah === l.toAyah)
    ? String(l.fromAyah)
    : l.fromAyah + "–" + l.toAyah;

  return '' +
    '<article class="lesson">' +
      '<div class="lesson-head">' +
        '<span class="lesson-date">' + formatDate(l.date) + '</span>' +
        '<span class="lesson-mark">' + l.mark + '/10</span>' +
      '</div>' +
      '<p class="lesson-ref">' + esc(surahName) + ' ' + ayahs +
        (l.page ? ' &middot; Page ' + l.page : '') + '</p>' +
      '<p class="lesson-cat' + (l.revisionRequired ? ' warn-text' : '') + '">' +
        esc(l.category) + (l.revisionRequired ? ' &middot; revision required' : '') +
      '</p>' +
      (l.comment ? '<p class="lesson-comment">' + esc(l.comment) + '</p>' : '') +
      '<div class="lesson-actions">' +
        '<button class="btn-small" data-edit="' + l.id + '">Edit</button>' +
        '<button class="btn-small" data-delete="' + l.id + '">Delete</button>' +
      '</div>' +
    '</article>';
}


function renderSettings() {
  view.innerHTML =
    '<p class="crumb"><a href="#/">&larr; Home</a></p>' +
    '<h1>Settings</h1>' +

    '<section class="card">' +
      '<h2>Backup</h2>' +
      '<p>Lesson data is saved in this browser only. It does not travel ' +
        'between your computer and the teacher’s phone by itself. ' +
        'To move it, export a backup here and import it on the other device.</p>' +
      '<div class="button-row">' +
        '<button class="btn-primary" data-action="export">Export Backup</button>' +
        '<button class="btn-plain" data-action="export-csv">Export CSV</button>' +
      '</div>' +
    '</section>' +

    '<section class="card">' +
      '<h2>Restore</h2>' +
      '<p>Choose a backup file that was exported earlier.</p>' +
      '<input type="file" id="importFile" accept="application/json,.json">' +
    '</section>' +

    '<section class="card quiet">' +
      '<h2>Reset</h2>' +
      '<p>Deletes everything stored on this device.</p>' +
      '<button class="btn-danger" data-action="reset">Reset All Data</button>' +
    '</section>';

  view.querySelector('[data-action="export"]').addEventListener("click", exportBackup);
  view.querySelector('[data-action="export-csv"]').addEventListener("click", exportCsv);
  view.querySelector('[data-action="reset"]').addEventListener("click", resetAll);
  document.getElementById("importFile").addEventListener("change", importBackup);
}


/* ---------- Quran viewer ----------

   Each page of the Quran is a single image in the quran/ folder,
   named after its page number: quran/430.webp is page 430. The
   page numbers printed in the Quran match these numbers exactly.

   Zoom works by setting the width of the box holding the image.
   The image is width:100% inside that box, and highlights are
   positioned in percentages, so everything scales together.
*/

var quranPage = null;     // page currently on screen
var quranZoom = 100;      // 100% means "fits the width of the screen"
var highlightOn = false;  // is the highlighter switched on
var ZOOM_STEPS = [50, 75, 100, 125, 150, 200, 250, 300];

function clampPage(p) {
  p = parseInt(p, 10);
  if (isNaN(p)) p = QURAN_FIRST_PAGE;
  return Math.min(QURAN_LAST_PAGE, Math.max(1, p));
}

function pageImageUrl(p) {
  return "quran/" + String(p).padStart(3, "0") + ".webp";
}

function renderQuran() {
  // #/quran?page=430 opens straight at that page.
  var asked = location.hash.match(/[?&]page=(\d+)/);
  quranPage = clampPage(asked ? asked[1] : (quranPage || data.settings.lastQuranPage));
  // Tidy "#/quran?page=430" back to "#/quran" so a later refresh reopens
  // whichever page the teacher actually ended on.
  if (asked && window.history && history.replaceState) {
    history.replaceState(null, "", "#/quran");
  }

  view.innerHTML =
    '<p class="crumb"><a href="#/">&larr; Home</a></p>' +
    '<h1>Quran</h1>' +

    '<div class="toolbar">' +
      '<div class="tb-group">' +
        '<button class="btn-small" id="prevPage">&lsaquo; Prev</button>' +
        '<input type="number" id="pageInput" min="1" max="' + QURAN_LAST_PAGE + '" ' +
          'inputmode="numeric" aria-label="Page number">' +
        '<span class="tb-text">of ' + QURAN_LAST_PAGE + '</span>' +
        '<button class="btn-small" id="nextPage">Next &rsaquo;</button>' +
      '</div>' +
      '<div class="tb-group">' +
        '<button class="btn-small" id="zoomOut">&minus; Zoom</button>' +
        '<button class="btn-small" id="zoomReset"><span id="zoomLabel">100%</span></button>' +
        '<button class="btn-small" id="zoomIn">+ Zoom</button>' +
      '</div>' +
      '<div class="tb-group">' +
        '<button class="btn-small" id="hlToggle">Highlighter: Off</button>' +
        '<button class="btn-small" id="hlClear">Clear Highlights</button>' +
      '</div>' +
    '</div>' +

    '<div class="page-wrap" id="pageWrap">' +
      '<div class="page-stage" id="pageStage">' +
        '<img id="pageImg" alt="Quran page ' + quranPage + '">' +
        '<div class="hl-layer" id="hlLayer"></div>' +
      '</div>' +
    '</div>' +

    '<p class="footnote" id="quranHint">' +
      'Switch the highlighter on, then drag across a line to mark it. ' +
      'Tap a highlight to remove it. Highlights are saved on this device only.' +
    '</p>';

  document.getElementById("prevPage").addEventListener("click", function () { goToPage(quranPage - 1); });
  document.getElementById("nextPage").addEventListener("click", function () { goToPage(quranPage + 1); });
  document.getElementById("pageInput").addEventListener("change", function () {
    goToPage(this.value);
  });
  document.getElementById("zoomIn").addEventListener("click", function () { stepZoom(1); });
  document.getElementById("zoomOut").addEventListener("click", function () { stepZoom(-1); });
  document.getElementById("zoomReset").addEventListener("click", function () {
    quranZoom = 100; applyZoom();
  });
  document.getElementById("hlToggle").addEventListener("click", toggleHighlighter);
  document.getElementById("hlClear").addEventListener("click", clearPageHighlights);

  setUpHighlightDragging();
  showPage(quranPage);
  applyZoom();
  updateHighlighterButton();

  window.addEventListener("resize", applyZoom);
}

function showPage(p) {
  quranPage = clampPage(p);
  var img = document.getElementById("pageImg");
  if (!img) return;

  img.src = pageImageUrl(quranPage);
  img.alt = "Quran page " + quranPage;
  document.getElementById("pageInput").value = quranPage;

  data.settings.lastQuranPage = quranPage;
  saveData();

  drawHighlights();

  // Fetch the neighbouring pages quietly so turning the page feels instant.
  [quranPage + 1, quranPage - 1].forEach(function (n) {
    if (n >= 1 && n <= QURAN_LAST_PAGE) new Image().src = pageImageUrl(n);
  });
}

function goToPage(p) {
  showPage(p);
  var wrap = document.getElementById("pageWrap");
  if (wrap) wrap.scrollTop = 0;
  window.scrollTo(0, 0);
}

function stepZoom(direction) {
  var i = ZOOM_STEPS.indexOf(quranZoom);
  if (i === -1) i = 2;
  i = Math.min(ZOOM_STEPS.length - 1, Math.max(0, i + direction));
  quranZoom = ZOOM_STEPS[i];
  applyZoom();
}

/* 100% = the page fits the width of its container. */
function applyZoom() {
  var wrap = document.getElementById("pageWrap");
  var stage = document.getElementById("pageStage");
  if (!wrap || !stage) return;
  stage.style.width = Math.round(wrap.clientWidth * quranZoom / 100) + "px";
  var label = document.getElementById("zoomLabel");
  if (label) label.textContent = quranZoom + "%";
}


/* ---------- Highlighter ----------

   A highlight is stored as four fractions of the page, so it stays
   in the right place at any zoom level and on any screen:
     { x: 0.08, y: 0.42, w: 0.84, h: 0.05 }
*/

function pageHighlights() {
  if (!data.highlights[quranPage]) data.highlights[quranPage] = [];
  return data.highlights[quranPage];
}

function drawHighlights() {
  var layer = document.getElementById("hlLayer");
  if (!layer) return;
  layer.innerHTML = pageHighlights().map(function (h, i) {
    return '<div class="hl" data-index="' + i + '" style="left:' + (h.x * 100) +
           '%;top:' + (h.y * 100) + '%;width:' + (h.w * 100) +
           '%;height:' + (h.h * 100) + '%"></div>';
  }).join("");
}

function toggleHighlighter() {
  highlightOn = !highlightOn;
  updateHighlighterButton();
}

function updateHighlighterButton() {
  var btn = document.getElementById("hlToggle");
  var layer = document.getElementById("hlLayer");
  if (!btn || !layer) return;
  btn.textContent = "Highlighter: " + (highlightOn ? "On" : "Off");
  btn.classList.toggle("on", highlightOn);
  layer.classList.toggle("active", highlightOn);
}

function clearPageHighlights() {
  if (!pageHighlights().length) return;
  if (!confirm("Remove all highlights from page " + quranPage + "?")) return;
  delete data.highlights[quranPage];
  saveData();
  drawHighlights();
}

function setUpHighlightDragging() {
  var layer = document.getElementById("hlLayer");
  var startX = 0, startY = 0, preview = null, dragging = false;

  // Where the pointer is, as a fraction of the page (0 to 1).
  function point(e) {
    var box = layer.getBoundingClientRect();
    return {
      x: Math.min(1, Math.max(0, (e.clientX - box.left) / box.width)),
      y: Math.min(1, Math.max(0, (e.clientY - box.top) / box.height))
    };
  }

  layer.addEventListener("pointerdown", function (e) {
    if (!highlightOn) return;
    e.preventDefault();
    layer.setPointerCapture(e.pointerId);
    var p = point(e);
    startX = p.x; startY = p.y;
    dragging = true;
    preview = document.createElement("div");
    preview.className = "hl preview";
    layer.appendChild(preview);
  });

  layer.addEventListener("pointermove", function (e) {
    if (!dragging || !preview) return;
    var p = point(e);
    var box = rectFrom(startX, startY, p.x, p.y);
    preview.style.left = (box.x * 100) + "%";
    preview.style.top = (box.y * 100) + "%";
    preview.style.width = (box.w * 100) + "%";
    preview.style.height = (box.h * 100) + "%";
  });

  function finish(e) {
    if (!dragging) return;
    dragging = false;
    if (preview) { preview.remove(); preview = null; }

    var p = point(e);
    var box = rectFrom(startX, startY, p.x, p.y);

    // A tap rather than a drag: remove the highlight under the finger.
    if (box.w < 0.02 && box.h < 0.01) {
      var list = pageHighlights();
      for (var i = list.length - 1; i >= 0; i--) {
        var h = list[i];
        if (p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h) {
          list.splice(i, 1);
          saveData();
          drawHighlights();
          return;
        }
      }
      return;
    }

    // Very thin drags are almost certainly meant as a whole line.
    if (box.h < 0.012) { box.h = 0.028; }

    pageHighlights().push(box);
    saveData();
    drawHighlights();
  }

  layer.addEventListener("pointerup", finish);
  layer.addEventListener("pointercancel", function () {
    dragging = false;
    if (preview) { preview.remove(); preview = null; }
  });
}

function rectFrom(x1, y1, x2, y2) {
  return {
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    w: Math.abs(x2 - x1),
    h: Math.abs(y2 - y1)
  };
}


/* ============================================================
   4. DIALOGS
   ============================================================ */

var positionModal = document.getElementById("positionModal");
var lessonModal   = document.getElementById("lessonModal");
var currentKey = null;      // which student the open dialog belongs to
var editingLessonId = null; // null when adding a new lesson

/* Fill a <select> with the 114 surahs. */
function fillSurahOptions(select) {
  var html = "";
  for (var i = 0; i < SURAHS.length; i++) {
    html += '<option value="' + SURAHS[i].n + '">' + SURAHS[i].n + '. ' +
            esc(SURAHS[i].name) + '</option>';
  }
  select.innerHTML = html;
}

function fillJuzOptions(select) {
  var html = "";
  for (var j = 1; j <= 30; j++) html += '<option value="' + j + '">Juz ' + j + '</option>';
  select.innerHTML = html;
}

function fillMarkOptions(select) {
  var html = "";
  for (var m = 10; m >= 0; m--) html += '<option value="' + m + '">' + m + '/10</option>';
  select.innerHTML = html;
}

fillSurahOptions(document.getElementById("positionSurah"));
fillSurahOptions(document.getElementById("lessonSurah"));
fillJuzOptions(document.getElementById("positionJuz"));
fillMarkOptions(document.getElementById("lessonMark"));

function openModal(el) {
  el.hidden = false;
  document.body.classList.add("modal-open");
}
function closeModal(el) {
  el.hidden = true;
  document.body.classList.remove("modal-open");
}

/* Cancel buttons and clicking the dark background both close a dialog. */
Array.prototype.forEach.call(document.querySelectorAll(".modal-backdrop"), function (back) {
  back.addEventListener("click", function (e) {
    if (e.target === back || e.target.hasAttribute("data-close")) closeModal(back);
  });
});
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeModal(positionModal);
    closeModal(lessonModal);
  }
});


/* ---------- Update position ---------- */

var positionForm = document.getElementById("positionForm");

function openPositionModal(key) {
  currentKey = key;
  var pos = data.students[key].currentPosition;
  positionForm.surah.value = pos.surah;
  positionForm.ayah.value = pos.ayah;
  positionForm.page.value = pos.page;
  positionForm.juz.value = pos.juz;
  openModal(positionModal);
}

/* Keep the juz in step with the surah and ayah as they are typed. */
function syncPositionJuz() {
  var surah = Number(positionForm.surah.value);
  var ayah = Number(positionForm.ayah.value) || 1;
  positionForm.juz.value = juzFor(surah, ayah);
}
positionForm.surah.addEventListener("change", syncPositionJuz);
positionForm.ayah.addEventListener("input", syncPositionJuz);

positionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var s = data.students[currentKey];
  s.currentPosition = {
    juz:   Number(positionForm.juz.value),
    surah: Number(positionForm.surah.value),
    ayah:  Number(positionForm.ayah.value),
    page:  Number(positionForm.page.value)
  };
  saveData();
  closeModal(positionModal);
  render();
});


/* ---------- Add / edit lesson ---------- */

var lessonForm = document.getElementById("lessonForm");

function openLessonModal(key, lessonId) {
  currentKey = key;
  editingLessonId = lessonId;

  var student = data.students[key];
  document.getElementById("lessonTitle").textContent =
    lessonId ? "Edit Lesson" : "Add Lesson";

  if (lessonId) {
    var l = student.lessons.filter(function (x) { return x.id === lessonId; })[0];
    if (!l) return;
    lessonForm.date.value = l.date;
    lessonForm.surah.value = l.surah;
    lessonForm.fromAyah.value = l.fromAyah;
    lessonForm.toAyah.value = l.toAyah;
    lessonForm.page.value = l.page || "";
    lessonForm.mark.value = l.mark;
    lessonForm.category.value = l.category;
    lessonForm.comment.value = l.comment || "";
    lessonForm.revisionRequired.checked = !!l.revisionRequired;
    lessonForm.updatePosition.checked = false;
  } else {
    var pos = student.currentPosition;
    lessonForm.date.value = todayIso();
    lessonForm.surah.value = pos.surah;
    lessonForm.fromAyah.value = pos.ayah;
    lessonForm.toAyah.value = pos.ayah;
    lessonForm.page.value = pos.page;
    lessonForm.mark.value = 10;
    lessonForm.category.value = "Excellent";
    lessonForm.comment.value = "";
    lessonForm.revisionRequired.checked = false;
    lessonForm.updatePosition.checked = true;
  }
  openModal(lessonModal);
}

/* Suggest a category from the mark. The teacher can still change it. */
lessonForm.mark.addEventListener("change", function () {
  var m = Number(lessonForm.mark.value);
  lessonForm.category.value = m >= 9 ? "Excellent" : (m >= 7 ? "Good" : "Needs Revision");
  lessonForm.revisionRequired.checked = m < 7;
});

lessonForm.addEventListener("submit", function (e) {
  e.preventDefault();

  var from = Number(lessonForm.fromAyah.value);
  var to = Number(lessonForm.toAyah.value);
  if (to < from) {
    alert("“To Ayah” cannot be smaller than “From Ayah”.");
    return;
  }

  var student = data.students[currentKey];
  var lesson = {
    id: editingLessonId || Date.now(),
    date: lessonForm.date.value,
    surah: Number(lessonForm.surah.value),
    fromAyah: from,
    toAyah: to,
    page: Number(lessonForm.page.value) || null,
    mark: Number(lessonForm.mark.value),
    category: lessonForm.category.value,
    comment: lessonForm.comment.value.trim(),
    revisionRequired: lessonForm.revisionRequired.checked
  };

  if (editingLessonId) {
    student.lessons = student.lessons.map(function (l) {
      return l.id === editingLessonId ? lesson : l;
    });
  } else {
    student.lessons.push(lesson);
  }

  if (lessonForm.updatePosition.checked) {
    student.currentPosition = {
      juz:   juzFor(lesson.surah, lesson.toAyah),
      surah: lesson.surah,
      ayah:  lesson.toAyah,
      page:  lesson.page || student.currentPosition.page
    };
  }

  saveData();
  closeModal(lessonModal);
  render();
});


function deleteLesson(key, lessonId) {
  var student = data.students[key];
  var l = student.lessons.filter(function (x) { return x.id === lessonId; })[0];
  if (!l) return;
  var label = formatDate(l.date) + " — " + getSurah(l.surah).name;
  if (!confirm("Delete the lesson from " + label + "? This cannot be undone.")) return;
  student.lessons = student.lessons.filter(function (x) { return x.id !== lessonId; });
  saveData();
  render();
}


/* ============================================================
   5. BACKUP AND RESET
   ============================================================ */

function downloadFile(filename, text, mime) {
  var blob = new Blob([text], { type: mime });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

function exportBackup() {
  downloadFile("quran-progress-backup-" + todayIso() + ".json",
               JSON.stringify(data, null, 2),
               "application/json");
}

function exportCsv() {
  var rows = [["Student","Date","Surah","From Ayah","To Ayah","Page",
               "Mark","Category","Revision Required","Comment"]];
  ["affan", "mashal"].forEach(function (key) {
    sortedLessons(data.students[key]).forEach(function (l) {
      rows.push([
        data.students[key].name, l.date, getSurah(l.surah).name,
        l.fromAyah, l.toAyah, l.page || "", l.mark + "/10", l.category,
        l.revisionRequired ? "Yes" : "No", l.comment || ""
      ]);
    });
  });
  var csv = rows.map(function (r) {
    return r.map(function (cell) {
      return '"' + String(cell).replace(/"/g, '""') + '"';
    }).join(",");
  }).join("\r\n");
  downloadFile("quran-progress-lessons-" + todayIso() + ".csv", csv, "text/csv");
}

function importBackup(e) {
  var file = e.target.files && e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function () {
    var incoming;
    try {
      incoming = JSON.parse(reader.result);
    } catch (err) {
      alert("That file could not be read. Please choose a backup file " +
            "exported from this app.");
      e.target.value = "";
      return;
    }
    if (!incoming || !incoming.students) {
      alert("That file does not look like a Quran Progress backup.");
      e.target.value = "";
      return;
    }
    if (!confirm("Importing this backup will replace the current data. Continue?")) {
      e.target.value = "";
      return;
    }
    data = mergeWithDefaults(incoming);
    saveData();
    e.target.value = "";
    alert("Backup restored.");
    location.hash = "#/";
    render();
  };
  reader.readAsText(file);
}

function resetAll() {
  if (!confirm("This will permanently delete all Affan and Mashal lesson " +
               "records from this device. Are you sure?")) return;
  if (!confirm("Last check: delete everything on this device?")) return;
  data = defaultData();
  saveData();
  location.hash = "#/";
  render();
}


/* ============================================================
   6. ROUTER
   ============================================================ */

function render() {
  var hash = location.hash.replace(/^#\/?/, "");
  var path = hash.split("?")[0];

  if (path.indexOf("student/") === 0) {
    renderStudent(path.slice("student/".length));
  } else if (path === "quran") {
    renderQuran();
  } else if (path === "settings") {
    renderSettings();
  } else {
    renderHome();
  }

  // Show which nav link is active.
  Array.prototype.forEach.call(document.querySelectorAll(".nav a"), function (a) {
    a.classList.toggle("active", a.getAttribute("data-nav") === path);
  });
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", render);
render();
