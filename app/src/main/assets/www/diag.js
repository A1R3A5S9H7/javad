/* Aria Edit — lag diagnostic (opt-in). Open from Profile > "ابزار تشخیص لگ".
 * Shows live FPS and lets you switch heavy layers off one at a time to see which one hurts scrolling.
 * Nothing here runs unless the panel is open; it changes no saved data. */
(function () {
  'use strict';
  var panel = null, raf = 0, frames = 0, worst = 0, last = 0, t0 = 0, fpsEl, worstEl;
  var flags = { gl: false, p: false, flat: false, fx: false };
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function apply() {
    window.__DBG_OFF_GL = flags.gl; window.__DBG_OFF_P = flags.p;
    var gl = document.getElementById('threeScene'), pc = document.getElementById('bgParticles');
    if (gl) gl.style.display = flags.gl ? 'none' : ''; if (pc) pc.style.display = flags.p ? 'none' : '';
    document.documentElement.classList.toggle('dbg-flat', flags.flat);
    document.documentElement.classList.toggle('dbg-nofx', flags.fx);
  }
  function loop(now) {
    frames++; if (last) worst = Math.max(worst, now - last); last = now;
    if (now - t0 >= 1000) { fpsEl.textContent = frames; worstEl.textContent = Math.round(worst); frames = 0; worst = 0; t0 = now; }
    raf = requestAnimationFrame(loop);
  }
  function open() {
    if (panel) return;
    panel = el('div', 'dg-panel');
    var head = el('div', 'dg-head'); head.append(el('b', null, 'FPS: '), fpsEl = el('span', null, '–'), el('span', null, '   بدترین فریم (ms): '), worstEl = el('span', null, '–'));
    panel.appendChild(head);
    [['gl', 'پس‌زمینه‌ی سه‌بعدی (WebGL)'], ['p', 'ذرات پس‌زمینه'], ['flat', 'لایه‌های سه‌بعدی کارت‌ها'], ['fx', 'سایه‌ها و درخشش‌ها']].forEach(function (o) {
      var b = el('button', 'dg-btn', o[1] + ': روشن'); b.type = 'button';
      b.onclick = function () { flags[o[0]] = !flags[o[0]]; b.textContent = o[1] + ': ' + (flags[o[0]] ? 'خاموش' : 'روشن'); b.classList.toggle('off', flags[o[0]]); apply(); };
      panel.appendChild(b);
    });
    var close = el('button', 'dg-btn dg-close', 'بستن و برگرداندن همه‌چیز'); close.type = 'button'; close.onclick = shut; panel.appendChild(close);
    document.body.appendChild(panel); frames = 0; worst = 0; last = 0; t0 = performance.now(); raf = requestAnimationFrame(loop);
  }
  function shut() { cancelAnimationFrame(raf); flags = { gl: false, p: false, flat: false, fx: false }; apply(); if (panel) panel.remove(); panel = null; }
  function card() {
    var v = document.getElementById('view-profile'); if (!v) return;
    var c = el('div', 'card'); c.appendChild(el('div', 'section-title', 'ابزار تشخیص لگ'));
    c.appendChild(el('p', 'au-sub', 'برای پیدا کردن علت لگ: پنل را باز کن، اسکرول کن و ببین هر بار با خاموش کردن کدام گزینه FPS بالا می‌رود.'));
    var b = el('button', 'ghost-btn', 'باز کردن پنل تشخیص'); b.type = 'button'; b.onclick = open; c.appendChild(b); v.appendChild(c);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', card); else card();
})();
