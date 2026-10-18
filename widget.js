/*  Отзывы «Антикварная столица» — блок отзывов + строка рейтинга в карточке товара.
    Стиль сайта: Montserrat, бордовый #7C0404, карточки с рамкой #EBE5E0,
    «таблички» с бордовой полосой слева (как «15+ лет на рынке»).
    Данные — один статичный reviews.json, грузится только когда нужен, кеш 6 ч.
    Виджет Яндекс Карт (официальный) грузится только по клику на вкладку.          */
(function () {
  var JSON_URL = 'https://dinyarik.github.io/oldart-reviews/reviews.json';
  var YA_ORG = '111938430078';
  var CACHE_KEY = 'oac_reviews_v1', CACHE_MS = 6 * 3600 * 1000;
  var dataPromise = null;

  function getData() {
    if (dataPromise) return dataPromise;
    try {
      var c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (c && Date.now() - c.t < CACHE_MS) return (dataPromise = Promise.resolve(c.d));
    } catch (e) {}
    dataPromise = fetch(JSON_URL).then(function (r) { return r.json(); }).then(function (d) {
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d: d })); } catch (e) {}
      return d;
    });
    return dataPromise;
  }

  var R = '#7C0404', INK = '#1A1410', TXT = '#4A3F38', MUTE = '#8A7F78', LINE = '#EBE5E0';
  var css = ''
    + '.oac-rv{font-family:Montserrat,Arial,sans-serif;color:' + INK + ';max-width:1200px;margin:0 auto;padding:0 20px;box-sizing:border-box}'
    + '.oac-rv *{box-sizing:border-box}'
    + '.oac-rv__label{display:flex;align-items:center;gap:14px;color:' + R + ';font-size:11px;letter-spacing:2.4px;text-transform:uppercase;margin-bottom:14px}'
    + '.oac-rv__label:before{content:"";width:28px;height:1px;background:' + R + '}'
    + '.oac-rv__head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;margin-bottom:34px}'
    + '.oac-rv h2{font-size:32px;font-weight:700;text-transform:uppercase;line-height:1.15;margin:0;color:' + INK + '}'
    + '.oac-rv h2 span{color:' + R + '}'
    + '.oac-rv__sub{font-size:15px;color:' + TXT + ';margin:10px 0 0}'
    + '.oac-rv__sub em{color:' + R + ';font-style:italic}'
    /* таблички рейтинга */
    + '.oac-rv__plates{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-bottom:38px}'
    + '.oac-pl{display:flex;align-items:center;gap:18px;text-decoration:none;color:' + INK + ';background:#fff;border-left:3px solid ' + R + ';box-shadow:0 8px 32px rgba(26,20,16,.10);padding:20px 22px;transition:box-shadow .25s,transform .25s}'
    + '.oac-pl:hover{box-shadow:0 10px 36px rgba(26,20,16,.18);transform:translateY(-2px)}'
    + '.oac-pl__val{font-size:38px;font-weight:400;line-height:1;letter-spacing:-.5px}'
    + '.oac-pl__stars{color:' + R + ';font-size:13px;letter-spacing:2px;margin-bottom:5px}'
    + '.oac-pl__name{font-size:11px;letter-spacing:1.6px;text-transform:uppercase;font-weight:700;color:' + INK + '}'
    + '.oac-pl__cnt{font-size:12px;color:' + MUTE + ';margin-top:3px}'
    /* вкладки */
    + '.oac-rv__tabs{display:flex;gap:8px;flex-wrap:wrap}'
    + '.oac-tab{font:700 12px/1 Montserrat,Arial,sans-serif;letter-spacing:.7px;text-transform:uppercase;border:1px solid ' + LINE + ';background:#fff;color:' + INK + ';border-radius:30px;padding:11px 18px;cursor:pointer;transition:all .2s}'
    + '.oac-tab:hover{border-color:' + R + ';color:' + R + '}'
    + '.oac-tab.is-on{background:' + R + ';border-color:' + R + ';color:#fff}'
    /* карточки отзывов */
    + '.oac-rv__list{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}'
    + '.oac-card{position:relative;background:#fff;border:1px solid ' + LINE + ';border-radius:10px;padding:26px 24px 22px;display:flex;flex-direction:column}'
    + '.oac-card:before{content:"\\201C";position:absolute;top:8px;right:20px;font:italic 64px/1 Georgia,serif;color:' + R + ';opacity:.15}'
    + '.oac-card__stars{color:' + R + ';font-size:12px;letter-spacing:2px;margin-bottom:12px}'
    + '.oac-card__text{font-size:14px;line-height:1.65;color:' + TXT + ';margin:0 0 18px;flex:1}'
    + '.oac-card__item{font-size:12px;font-style:italic;color:' + R + ';margin:0 0 16px;line-height:1.4}'
    + '.oac-card__foot{display:flex;justify-content:space-between;align-items:center;border-top:1px solid ' + LINE + ';padding-top:14px}'
    + '.oac-card__name{font-size:14px;font-weight:600;color:' + INK + '}'
    + '.oac-card__src{font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:' + MUTE + '}'
    + '.oac-rv__ya{width:100%;height:620px;border:1px solid ' + LINE + ';border-radius:10px;background:#fff}'
    + '.oac-rv__more{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-top:32px}'
    + '.oac-btn{display:inline-flex;align-items:center;gap:8px;font:700 13px/1 Montserrat,Arial,sans-serif;letter-spacing:.78px;text-transform:uppercase;text-decoration:none;border-radius:30px;padding:16px 26px;transition:all .2s}'
    + '.oac-btn_fill{background:#8B1A1A;color:#fff}.oac-btn_fill:hover{background:' + R + '}'
    + '.oac-btn_line{border:1px solid ' + R + ';color:' + R + '}.oac-btn_line:hover{background:' + R + ';color:#fff}'
    + '@media(max-width:960px){.oac-rv h2{font-size:24px}.oac-rv__head{margin-bottom:22px}'
    + '.oac-rv__plates{gap:8px;margin-bottom:24px}.oac-pl{flex-direction:column;align-items:flex-start;gap:6px;padding:14px 12px}'
    + '.oac-pl__val{font-size:28px}.oac-pl__stars{font-size:10px;letter-spacing:1px}.oac-pl__name{font-size:10px;letter-spacing:1px}.oac-pl__cnt{font-size:11px}'
    + '.oac-rv__list{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:14px;margin:0 -20px;padding:0 20px 6px}'
    + '.oac-card{flex:0 0 84%;scroll-snap-align:start}.oac-card__foot{flex-wrap:wrap;gap:4px 10px}}'
    /* строка в карточке товара */
    + '.oac-line{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin:-16px 0 28px;font:400 12px/1.4 Montserrat,Arial,sans-serif;color:' + TXT + ';text-decoration:none;cursor:pointer}'
    + '.oac-line__st{color:' + R + ';letter-spacing:1.5px}'
    + '.oac-line b{font-weight:700;color:' + INK + '}'
    + '.oac-line__sep{color:' + LINE + '}'
    + '.oac-line__all{color:' + R + ';font-weight:600;border-bottom:1px solid rgba(124,4,4,.35)}'
    + '.oac-line:hover .oac-line__all{border-bottom-color:' + R + '}'
    + '.oac-pop{position:fixed;inset:0;background:rgba(26,20,16,.5);z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px}'
    + '.oac-pop__box{position:relative;background:#fff;border-left:3px solid ' + R + ';box-shadow:0 12px 40px rgba(26,20,16,.25);max-width:540px;width:100%;max-height:86vh;overflow:auto;padding:30px 28px 26px;font-family:Montserrat,Arial,sans-serif;color:' + INK + '}'
    + '.oac-pop__x{position:absolute;top:12px;right:14px;border:0;background:none;font-size:26px;line-height:1;cursor:pointer;color:' + MUTE + '}'
    + '.oac-pop__ttl{font-size:18px;font-weight:700;text-transform:uppercase;margin:0 0 6px}.oac-pop__ttl span{color:' + R + '}'
    + '.oac-pop__rt{font-size:13px;color:' + TXT + ';margin:0 0 20px}'
    + '.oac-pop .oac-card{margin-bottom:12px;padding:20px}.oac-pop .oac-card:before{font-size:48px}';

  function addCss() {
    if (document.getElementById('oac-rv-css')) return;
    var s = document.createElement('style'); s.id = 'oac-rv-css'; s.textContent = css;
    document.head.appendChild(s);
  }
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function stars(r) { var n = Math.round(r || 0); return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n); }
  function num(r) { return (r || 0).toFixed(1).replace('.', ','); }
  function plural(n, a, b, c) { var m = n % 100, k = n % 10; return (m > 10 && m < 20) ? c : k === 1 ? a : (k > 1 && k < 5) ? b : c; }
  function otz(n) { return n + ' ' + plural(n, 'отзыв', 'отзыва', 'отзывов'); }
  function fmtDate(d) {
    var M = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    var p = (d || '').split('-'); return p.length === 3 ? (+p[2]) + ' ' + M[+p[1] - 1] + ' ' + p[0] : '';
  }
  var SRC = { avito: 'Авито', meshok: 'Мешок', yandex: 'Яндекс Карты' };

  function cardHtml(r) {
    return '<div class="oac-card"><div class="oac-card__stars">★★★★★</div>'
      + '<p class="oac-card__text">' + esc(r.text) + '</p>'
      + (r.item ? '<p class="oac-card__item">' + esc(r.item) + '</p>' : '')
      + '<div class="oac-card__foot"><span class="oac-card__name">' + esc(r.name) + '</span>'
      + '<span class="oac-card__src">' + SRC[r.src] + ' · ' + fmtDate(r.date) + '</span></div></div>';
  }
  function plateHtml(s) {
    var cnt = s.reviews_total || s.count;
    return '<a class="oac-pl" href="' + esc(s.url) + '" target="_blank" rel="noopener nofollow">'
      + '<div class="oac-pl__val">' + num(s.rating) + '</div>'
      + '<div><div class="oac-pl__stars">' + stars(s.rating) + '</div><div class="oac-pl__name">' + esc(s.name) + '</div>'
      + '<div class="oac-pl__cnt">' + otz(cnt) + ' →</div></div></a>';
  }

  /* ---------- Блок отзывов: <div id="oac-reviews"></div> ---------- */
  function renderBlock(root, d) {
    var s = d.sources, list = d.reviews || [];
    var hasMeshok = list.some(function (r) { return r.src === 'meshok'; });
    root.innerHTML = '<div class="oac-rv">'
      + '<div class="oac-rv__head"><div><div class="oac-rv__label">Нам доверяют</div>'
      + '<h2><span>Отзывы</span> покупателей</h2>'
      + '<p class="oac-rv__sub"><em>' + otz(d.total_reviews) + '</em> на Мешке, Авито и Яндекс Картах</p></div>'
      + '<div class="oac-rv__tabs"><button class="oac-tab is-on" data-f="all">Все</button>'
      + (hasMeshok ? '<button class="oac-tab" data-f="meshok">Мешок</button>' : '')
      + '<button class="oac-tab" data-f="avito">Авито</button><button class="oac-tab" data-f="yandex">Яндекс Карты</button></div></div>'
      + '<div class="oac-rv__plates">' + plateHtml(s.meshok) + plateHtml(s.avito) + plateHtml(s.yandex) + '</div>'
      + '<div class="oac-rv__body"></div>'
      + '<div class="oac-rv__more"><a class="oac-btn oac-btn_fill" href="/antique_shop">Перейти в каталог →</a></div></div>';
    var body = root.querySelector('.oac-rv__body');
    function show(f) {
      if (f === 'yandex') {
        body.innerHTML = '<iframe class="oac-rv__ya" loading="lazy" src="https://yandex.ru/maps-reviews-widget/' + YA_ORG + '?comments" title="Отзывы на Яндекс Картах"></iframe>';
        return;
      }
      var items = list.filter(function (r) { return f === 'all' || r.src === f; }).slice(0, 6);
      body.innerHTML = '<div class="oac-rv__list">' + items.map(cardHtml).join('') + '</div>';
    }
    root.querySelectorAll('.oac-tab').forEach(function (b) {
      b.addEventListener('click', function () {
        root.querySelectorAll('.oac-tab').forEach(function (x) { x.classList.toggle('is-on', x === b); });
        show(b.getAttribute('data-f'));
      });
    });
    show('all');
  }

  function initBlock() {
    var root = document.getElementById('oac-reviews');
    if (!root) return;
    var go = function () { addCss(); getData().then(function (d) { renderBlock(root, d); }).catch(function () { root.style.display = 'none'; }); };
    if (!('IntersectionObserver' in window)) return go();
    var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { io.disconnect(); go(); } }, { rootMargin: '400px' });
    io.observe(root);
  }

  /* ---------- Строка рейтинга в карточке товара (под кнопкой «Оформить заказ») ---------- */
  function popup(d) {
    var w = document.createElement('div'); w.className = 'oac-pop';
    var s = d.sources;
    w.innerHTML = '<div class="oac-pop__box"><button class="oac-pop__x" aria-label="Закрыть">×</button>'
      + '<div class="oac-pop__ttl"><span>Отзывы</span> покупателей</div>'
      + '<p class="oac-pop__rt">Мешок <b>' + num(s.meshok.rating) + '</b> · Авито <b>' + num(s.avito.rating) + '</b> · Яндекс Карты <b>' + num(s.yandex.rating) + '</b></p>'
      + (d.reviews || []).slice(0, 4).map(cardHtml).join('')
      + '<div style="text-align:center;margin-top:18px"><a class="oac-btn oac-btn_line" href="/company#reviews">Все отзывы →</a></div></div>';
    w.addEventListener('click', function (e) { if (e.target === w || e.target.classList.contains('oac-pop__x')) w.remove(); });
    document.body.appendChild(w);
  }
  function lineHtml(d) {
    var s = d.sources;
    return '<span class="oac-line__st">★★★★★</span>'
      + '<span>Мешок <b>' + num(s.meshok.rating) + '</b></span><span class="oac-line__sep">|</span>'
      + '<span>Авито <b>' + num(s.avito.rating) + '</b></span><span class="oac-line__sep">|</span>'
      + '<span>Яндекс <b>' + num(s.yandex.rating) + '</b></span>'
      + '<span class="oac-line__all">' + otz(d.total_reviews) + ' покупателей</span>';
  }
  var ANCHORS = '.t-catalog__prod-popup__btn-wrapper, .t-store__prod-popup__btn-wrapper';
  function decorate() {
    var spots = document.querySelectorAll(ANCHORS);
    if (!spots.length) return;
    spots.forEach(function (w) {
      if (w.nextElementSibling && w.nextElementSibling.classList.contains('oac-line')) return;
      var a = document.createElement('a'); a.className = 'oac-line'; a.href = '#';
      w.parentNode.insertBefore(a, w.nextSibling);  // под кнопкой, отдельной строкой
      addCss();
      getData().then(function (d) {
        a.innerHTML = lineHtml(d);
        a.addEventListener('click', function (e) { e.preventDefault(); popup(d); });
      }).catch(function () { a.remove(); });
    });
  }
  function initCards() {
    decorate();
    var t = null;
    new MutationObserver(function () { clearTimeout(t); t = setTimeout(decorate, 300); })
      .observe(document.body, { childList: true, subtree: true });
  }

  function start() { initBlock(); initCards(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
