/* Szymon Czapliński — wspólny skrypt dla wszystkich podstron */
(function () {
  var EMAIL = 'szymonczaplinski7@gmail.com';
  var lang = 'pl';

  /* ---------- język PL / EN (zapamiętywany między podstronami) ---------- */
  function setLang(l) {
    lang = l;
    document.documentElement.lang = l;
    document.querySelectorAll('[data-' + l + ']').forEach(function (el) {
      el.innerHTML = el.getAttribute('data-' + l);
    });
    document.querySelectorAll('[data-' + l + '-label]').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-' + l + '-label'));
    });
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset.lang === l);
    });
    try { localStorage.setItem('lang', l); } catch (e) {}
  }
  window.setLang = setLang;
  document.querySelectorAll('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });
  try { var saved = localStorage.getItem('lang'); if (saved === 'en') setLang('en'); } catch (e) {}

  /* ---------- menu na telefonie ---------- */
  var burger = document.querySelector('.hamburger');
  var menu = document.getElementById('mobileMenu');
  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- okno odtwarzania: YouTube albo własny plik mp4 ---------- */
  var lb = document.getElementById('lightbox');
  var lbScreen = lb ? lb.querySelector('.lightbox-screen') : null;
  function openLightbox(opts) {
    if (!lb) return;
    if (opts.yt) {
      lbScreen.innerHTML = '<iframe src="https://www.youtube.com/embed/' + opts.yt +
        '?autoplay=1&playsinline=1&rel=0" title="Wideo" allow="autoplay; encrypted-media" allowfullscreen></iframe>';
    } else {
      lbScreen.innerHTML = '<video src="' + opts.video + '" controls autoplay playsinline></video>';
    }
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
    var reel = document.getElementById('reelVideo');
    if (reel) reel.pause();
  }
  function closeLightbox() {
    if (!lb) return;
    lbScreen.innerHTML = '';
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('[data-yt],[data-video]').forEach(function (el) {
    el.addEventListener('click', function () {
      openLightbox({ yt: el.dataset.yt, video: el.dataset.video });
    });
  });
  if (lb) {
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLightbox(); });

  /* ---------- "Najnowsza realizacja" z dźwiękiem (podstrona UGC) ---------- */
  var reel = document.getElementById('reelVideo');
  var soundBtn = document.getElementById('soundBtn');
  if (reel && soundBtn) {
    var label = soundBtn.querySelector('span');
    var icon = document.getElementById('soundIcon');
    soundBtn.addEventListener('click', function () {
      reel.muted = !reel.muted;
      if (!reel.muted) reel.play().catch(function () {});
      var on = !reel.muted;
      label.setAttribute('data-pl', on ? 'Wycisz' : 'Dźwięk');
      label.setAttribute('data-en', on ? 'Mute' : 'Sound');
      label.textContent = label.getAttribute('data-' + lang);
      icon.innerHTML = on
        ? '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4zM14 3.2v2.1a6.7 6.7 0 010 13.4v2.1a8.8 8.8 0 000-17.6z"/>'
        : '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 00-2.5-4v8a4.5 4.5 0 002.5-4z"/>';
    });
    reel.addEventListener('error', function () { soundBtn.style.display = 'none'; });
  }

  /* ---------- filmy w tle: pauza poza ekranem i przy "ogranicz animacje" ---------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bgVideos = document.querySelectorAll('video[data-autoplay]');
  if (reduce) {
    bgVideos.forEach(function (v) { v.pause(); });
  } else if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { if (v.paused && v.muted) v.play().catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.15 });
    bgVideos.forEach(function (v) { obs.observe(v); });
  } else {
    bgVideos.forEach(function (v) { v.play().catch(function () {}); });
  }

  /* ---------- kopiowanie maila ---------- */
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var done = function () {
        var old = btn.innerHTML;
        btn.textContent = lang === 'pl' ? 'Skopiowano ✓' : 'Copied ✓';
        setTimeout(function () { btn.innerHTML = btn.getAttribute('data-' + lang) || old; }, 1800);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(done, function () {});
    });
  });
})();
