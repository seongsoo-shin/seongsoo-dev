/* Seongsoo Shin — shared site script (담백 build) */
(function(){
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // ───── mobile nav drawer ─────
  var navToggle = document.querySelector('.nav-toggle');
  var navEl = document.querySelector('header.top nav.nav');
  var navMql = window.matchMedia('(max-width:780px)');
  function setNav(open){
    if (!navEl || !navToggle) return;
    navEl.classList.toggle('open', open);
    if (navMql.matches) navEl.setAttribute('aria-hidden', open ? 'false' : 'true');
    else navEl.removeAttribute('aria-hidden');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
  }
  if (navToggle && navEl){
    setNav(false);
    navToggle.addEventListener('click', function(){
      var isOpen = navEl.classList.contains('open');
      setNav(!isOpen);
    });
    // close on link click (drawer)
    navEl.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ setNav(false); });
    });
    // close on Esc
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && navEl.classList.contains('open')) setNav(false);
    });
    // close when clicking the dim backdrop (outside drawer)
    document.addEventListener('click', function(e){
      if (!navEl.classList.contains('open')) return;
      if (navEl.contains(e.target) || navToggle.contains(e.target)) return;
      setNav(false);
    });
    // close when resizing back to desktop
    var onChange = function(){ setNav(navEl.classList.contains('open') && navMql.matches); };
    if (navMql.addEventListener) navMql.addEventListener('change', onChange);
    else if (navMql.addListener) navMql.addListener(onChange);
  }

  // language toggle
  var langBtns = document.querySelectorAll('.lang-toggle button[data-set-lang]');
  function setLang(l){
    document.documentElement.setAttribute('data-lang', l);
    document.documentElement.setAttribute('lang', l === 'ko' ? 'ko' : 'en');
    langBtns.forEach(function(b){ b.classList.toggle('active', b.dataset.setLang === l); });
    try { localStorage.setItem('lang', l); } catch(e){}
  }
  langBtns.forEach(function(b){ b.addEventListener('click', function(){ setLang(b.dataset.setLang); }); });
  try {
    var saved = localStorage.getItem('lang');
    if (saved === 'ko' || saved === 'en') setLang(saved);
    else if ((navigator.language || '').toLowerCase().startsWith('ko')) setLang('ko');
  } catch(e){}

  // Gallery manifest — used by project detail pages and lightbox
  window.GALLERIES = {
    'bexco': ['../assets/projects/bexco/ko/ss-1.png','../assets/projects/bexco/ko/ss-2.png','../assets/projects/bexco/ko/ss-3.png','../assets/projects/bexco/ko/ss-4.png'],
    'bullida': ['../assets/projects/bullida/ko/ss-1.png','../assets/projects/bullida/ko/ss-2.png'],
    'cashbin': ['../assets/projects/cashbin/ko/ss-1.png','../assets/projects/cashbin/ko/ss-2.png','../assets/projects/cashbin/ko/ss-3.png'],
    'd-hub': ['../assets/projects/d-hub/ss-1.jpg','../assets/projects/d-hub/ss-2.jpg','../assets/projects/d-hub/ss-3.jpg','../assets/projects/d-hub/ss-4.jpg','../assets/projects/d-hub/ss-5.jpg','../assets/projects/d-hub/ss-6.jpg','../assets/projects/d-hub/ss-7.jpg','../assets/projects/d-hub/ss-8.jpg'],
    'dabatruck': ['../assets/projects/dabatruck/ko/ss-1.jpg','../assets/projects/dabatruck/ko/ss-2.png','../assets/projects/dabatruck/ko/ss-3.png','../assets/projects/dabatruck/ko/ss-4.png','../assets/projects/dabatruck/ko/ss-5.png','../assets/projects/dabatruck/ko/ss-6.jpg'],
    'dinx': ['../assets/projects/dinx/ss-1.png','../assets/projects/dinx/ss-2.png','../assets/projects/dinx/ss-3.png','../assets/projects/dinx/ss-4.png','../assets/projects/dinx/ss-5.png','../assets/projects/dinx/ss-6.png','../assets/projects/dinx/ss-7.png'],
    'gem-platform': ['../assets/projects/gem-platform/ss-1.jpg','../assets/projects/gem-platform/ss-2.jpg','../assets/projects/gem-platform/ss-3.jpg','../assets/projects/gem-platform/ss-4.jpg','../assets/projects/gem-platform/ss-5.jpg','../assets/projects/gem-platform/ss-6.jpg'],
    'gem-elearning': ['../assets/projects/gem-elearning/ss-1.jpg','../assets/projects/gem-elearning/ss-2.jpg','../assets/projects/gem-elearning/ss-3.jpg','../assets/projects/gem-elearning/ss-4.jpg','../assets/projects/gem-elearning/ss-5.jpg','../assets/projects/gem-elearning/ss-6.jpg','../assets/projects/gem-elearning/ss-7.jpg','../assets/projects/gem-elearning/ss-8.jpg'],
    'neurodio': ['../assets/projects/neurodio/ss-1.jpg','../assets/projects/neurodio/ss-2.jpg','../assets/projects/neurodio/ss-3.jpg','../assets/projects/neurodio/ss-4.jpg','../assets/projects/neurodio/ss-5.jpg'],
    'nmodelin': ['../assets/projects/nmodelin/onelook-official-1.png','../assets/projects/nmodelin/onelook-official-3.png','../assets/projects/nmodelin/onelook-official-2.png','../assets/teams/nmodelin/derived/20241130_131411-team.jpg','../assets/teams/nmodelin/derived/20241130_131520-team.jpg','../assets/teams/nmodelin/derived/img-2182-team.jpg','../assets/teams/nmodelin/derived/img-2141-team.jpg'],
    'nmodelin-onelook': ['../assets/projects/nmodelin/ko/onelook-ss-1.jpg','../assets/projects/nmodelin/ko/onelook-ss-2.jpg','../assets/projects/nmodelin/ko/onelook-ss-3.jpg'],
    'lesoleil-planterior': ['../assets/projects/lesoleil-planterior/ss-1.png','../assets/projects/lesoleil-planterior/ss-2.png','../assets/projects/lesoleil-planterior/ss-3.png','../assets/projects/lesoleil-planterior/ss-4.png','../assets/projects/lesoleil-planterior/ss-5.png','../assets/projects/lesoleil-planterior/ss-6.png','../assets/projects/lesoleil-planterior/ss-7.png'],
    'ranking-gg': ['../assets/projects/ranking-gg/ko/ss-1.png','../assets/projects/ranking-gg/ko/ss-2.png','../assets/projects/ranking-gg/ko/ss-3.png','../assets/projects/ranking-gg/ko/ss-4.png','../assets/projects/ranking-gg/ko/ss-5.png','../assets/projects/ranking-gg/ko/ss-6.png'],
    's-team': ['../assets/projects/s-team/ko/ss-1.png','../assets/projects/s-team/ko/ss-2.png','../assets/projects/s-team/ko/ss-3.png','../assets/projects/s-team/ko/ss-4.png','../assets/projects/s-team/ko/ss-5.png','../assets/projects/s-team/ko/ss-6.png'],
    'ulsan-bus': ['../assets/projects/ulsan-bus/ss-1.png','../assets/projects/ulsan-bus/ss-2.png','../assets/projects/ulsan-bus/ss-3.png'],
    'unibook': ['../assets/projects/unibook/ss-1.jpg','../assets/projects/unibook/ss-2.jpg','../assets/projects/unibook/ss-3.jpg','../assets/projects/unibook/ss-4.jpg','../assets/projects/unibook/ss-5.jpg','../assets/projects/unibook/ss-6.jpg','../assets/projects/unibook/ss-7.jpg','../assets/projects/unibook/ss-8.jpg'],
  };

  // lightbox (used by detail pages)
  var lb = document.getElementById('lightbox');
  if (lb){
    var lbImg = document.getElementById('lb-img');
    var lbMeta = document.getElementById('lb-meta');
    var currentGal = null, currentIdx = 0;

    // human-friendly gallery label: strip -en/-ko suffix, de-dash, title-case
    function galLabel(gal){
      if (!gal) return '';
      var base = gal.replace(/-(en|ko)$/, '').replace(/-/g, ' ');
      return base.replace(/\b\w/g, function(m){ return m.toUpperCase(); });
    }

    function openLB(gal, idx){
      currentGal = gal; currentIdx = idx;
      var arr = window.GALLERIES[gal] || [];
      lbImg.src = arr[idx] || '';
      lbMeta.textContent = galLabel(gal) + ' · ' + (idx+1) + ' / ' + arr.length;
      lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    }
    function closeLB(){
      lb.classList.remove('open'); lb.setAttribute('aria-hidden','true');
      lbImg.src=''; document.body.style.overflow='';
    }
    function step(d){
      var arr = window.GALLERIES[currentGal] || [];
      if (!arr.length) return;
      currentIdx = (currentIdx + d + arr.length) % arr.length;
      lbImg.src = arr[currentIdx];
      lbMeta.textContent = galLabel(currentGal) + ' · ' + (currentIdx+1) + ' / ' + arr.length;
    }
    document.querySelectorAll('a.shot').forEach(function(a){
      a.addEventListener('click', function(e){ e.preventDefault(); openLB(a.dataset.gal, parseInt(a.dataset.i,10) || 0); });
    });
    lb.addEventListener('click', function(e){
      if (e.target === lb || e.target === lbImg || e.target.classList.contains('lb-close')) closeLB();
    });
    var lbp = document.querySelector('.lb-prev'); if (lbp) lbp.addEventListener('click', function(e){ e.stopPropagation(); step(-1); });
    var lbn = document.querySelector('.lb-next'); if (lbn) lbn.addEventListener('click', function(e){ e.stopPropagation(); step(1); });
    document.addEventListener('keydown', function(e){
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  // reveal
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          e.target.style.opacity='1'; e.target.style.transform='none';
          io.unobserve(e.target);
        }
      });
    }, { rootMargin:'0px 0px -6% 0px', threshold:.04 });
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce){
      document.querySelectorAll('section, .tl-row, .cap, .gallery .shot, .plist a').forEach(function(el){
        el.style.opacity='0'; el.style.transform='translateY(8px)';
        el.style.transition='opacity .5s ease, transform .5s ease';
        io.observe(el);
      });
    }
  }

  // first-load screen: keep it briefly, then reveal after assets are ready.
  var loadStartedAt = (window.performance && performance.now) ? performance.now() : Date.now();
  function markLoaded(){
    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    var elapsed = now - loadStartedAt;
    var delay = Math.max(0, 520 - elapsed);
    window.setTimeout(function(){
      document.documentElement.classList.add('site-loaded');
      document.body.classList.add('page-enter');
    }, delay);
  }
  if (document.readyState === 'complete') markLoaded();
  else window.addEventListener('load', markLoaded, { once:true });
})();
