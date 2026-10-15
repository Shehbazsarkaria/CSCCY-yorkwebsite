(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* scroll ruler: ticks follow the page, label shows the offset in hex */
  var label = document.querySelector('.ruler span');
  function ruler() {
    var s = Math.round(window.scrollY);
    document.documentElement.style.setProperty('--y', s + 'px');
    if (label) label.textContent = '0x' + s.toString(16).toUpperCase().padStart(4, '0');
  }
  addEventListener('scroll', ruler, { passive: true });
  ruler();

  /* tagline: starts as ROT13, each letter counts back down the alphabet to plain text */
  var tag = document.getElementById('tag');
  if (!tag || reduce) return;
  var plain = tag.textContent, busy = false;
  tag.setAttribute('aria-label', plain);
  tag.title = 'Click to decrypt again';

  function shift(ch, k) {
    var c = ch.charCodeAt(0), base = c >= 97 && c <= 122 ? 97 : c >= 65 && c <= 90 ? 65 : 0;
    return base ? String.fromCharCode((c - base + k) % 26 + base) : ch;
  }
  function frame(f) {
    var out = '';
    for (var i = 0; i < plain.length; i++) {
      var k = Math.max(0, Math.min(13, Math.round(13 - (f - i * 0.6))));
      out += shift(plain[i], k);
    }
    return out;
  }
  function run() {
    if (busy) return;
    busy = true;
    var f = 0, end = 13 + plain.length * 0.6;
    tag.textContent = frame(0);
    (function tick() {
      tag.textContent = frame(f);
      f += 1;
      if (f <= end) setTimeout(tick, 45);
      else { tag.textContent = plain; busy = false; }
    })();
  }
  tag.textContent = frame(0);
  setTimeout(run, 600);
  tag.addEventListener('click', run);
})();
