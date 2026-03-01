// ── IMAGE PROTECTION — Ryan Muratore Photography ──
(function() {
  function protect() {
    // Disable right-click on all images
    document.querySelectorAll('img').forEach(function(img) {
      img.addEventListener('contextmenu', function(e) { e.preventDefault(); });
      img.addEventListener('dragstart', function(e) { e.preventDefault(); });
      img.style.userSelect = 'none';
      img.style.webkitUserSelect = 'none';
      img.setAttribute('draggable', 'false');
    });

    // Disable right-click on gallery/portfolio containers
    var selectors = ['.gallery-col', '.portfolio-col', '.print-card', '.wp2-slide', '.hero-img', '.viewer', '.product-img', '.masonry', 'figure'];
    selectors.forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el) {
        el.addEventListener('contextmenu', function(e) { e.preventDefault(); });
      });
    });

    // Intercept copy — replace with copyright notice
    document.addEventListener('copy', function(e) {
      if (e.target && e.target.tagName === 'IMG') {
        e.preventDefault();
        if (e.clipboardData) e.clipboardData.setData('text/plain', '© Ryan Muratore Photography — All rights reserved. ryanmuratore.com');
      }
    });

    // Add watermark overlay to every gallery image
    document.querySelectorAll('.gallery-col img, .portfolio-col img, .print-card img').forEach(function(img) {
      var parent = img.parentElement;
      if (parent && !parent.querySelector('.wm-badge')) {
        var pos = window.getComputedStyle(parent).position;
        if (pos === 'static') parent.style.position = 'relative';

        // Tiled diagonal watermark
        var wm = document.createElement('div');
        wm.className = 'wm-badge';
        wm.style.cssText = [
          'position:absolute', 'inset:0', 'z-index:5', 'pointer-events:none',
          'background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='120'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' transform='rotate(-30 110 60)' font-family='Georgia,serif' font-size='11' fill='rgba(255,255,255,0.2)' letter-spacing='2'%3E%C2%A9 Ryan Muratore%3C/text%3E%3C/svg%3E")',
          'background-repeat:repeat'
        ].join(';');
        parent.appendChild(wm);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', protect);
  } else {
    protect();
  }

  // Re-run after any dynamic content loads (filtered gallery, lazy images etc)
  var lastRun = 0;
  var mo = new MutationObserver(function() {
    var now = Date.now();
    if (now - lastRun > 800) { lastRun = now; protect(); }
  });
  mo.observe(document.body, { childList: true, subtree: true });
})();
