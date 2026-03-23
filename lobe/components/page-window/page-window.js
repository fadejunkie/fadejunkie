/* ═══════════════════════════════════════════════════════════════════════════
   PageWindow — Standalone browser mockup widget
   Self-mounting, URL-driven, draggable. No dependencies.

   API:
     PageWindow.open(url)    — set iframe src + expand the content area
     PageWindow.setUrl(url)  — set iframe src without expanding
     PageWindow.expand()     — expand content area
     PageWindow.minimize()   — collapse content area
     PageWindow.close()      — fade out, pause, fade back in
     PageWindow.show()       — make widget visible (auto-called on first open)
     PageWindow.hide()       — hide widget entirely
     PageWindow.destroy()    — remove widget from DOM
   ═══════════════════════════════════════════════════════════════════════════ */

const PageWindow = (() => {
  // ── Build DOM ──────────────────────────────────────────────────────────

  const widget = document.createElement('div');
  widget.className = 'pw-widget';
  widget.id = 'pageWindow';

  widget.innerHTML = `
    <div class="pw-chrome" data-pw-handle>
      <div class="pw-titlebar">
        <div class="pw-traffic-lights">
          <button class="pw-dot pw-dot-close" aria-label="Close" data-pw-close></button>
          <button class="pw-dot pw-dot-minimize" aria-label="Minimize" data-pw-minimize></button>
          <button class="pw-dot pw-dot-expand" aria-label="Expand" data-pw-expand></button>
        </div>
        <div class="pw-url-bar">
          <span class="pw-lock-icon">\u{1F512}</span>
          <span class="pw-url-text" data-pw-url></span>
        </div>
      </div>
    </div>
    <div class="pw-content">
      <div class="pw-content-inner">
        <iframe class="pw-frame" data-pw-frame
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy">
        </iframe>
      </div>
    </div>
  `;

  document.body.appendChild(widget);

  // ── Refs ────────────────────────────────────────────────────────────────

  const chrome   = widget.querySelector('[data-pw-handle]');
  const frame    = widget.querySelector('[data-pw-frame]');
  const urlLabel = widget.querySelector('[data-pw-url]');

  // ── URL helpers ─────────────────────────────────────────────────────────

  function displayUrl(url) {
    try {
      const u = new URL(url);
      return u.hostname + (u.pathname !== '/' ? u.pathname : '');
    } catch {
      return url;
    }
  }

  function setUrl(url) {
    frame.src = url;
    urlLabel.textContent = displayUrl(url);
  }

  // ── Expand / Minimize ───────────────────────────────────────────────────

  function expand() {
    widget.classList.add('pw-expanded');
  }

  function minimize() {
    widget.classList.remove('pw-expanded');
  }

  // ── Show / Hide ─────────────────────────────────────────────────────────

  let shown = false;

  function show() {
    if (shown) return;
    shown = true;
    widget.classList.add('pw-visible');
  }

  function hide() {
    shown = false;
    widget.classList.remove('pw-visible');
    widget.style.opacity = '0';
    widget.style.transform = 'translateY(24px) scale(0.95)';
  }

  // ── Close (dismiss → pause → reappear) ──────────────────────────────────

  let closeAnimating = false;

  function closeWindow() {
    if (closeAnimating) return;
    closeAnimating = true;

    const fadeOut = widget.animate(
      [
        { opacity: 1, transform: 'scale(1) translateY(0)' },
        { opacity: 0, transform: 'scale(0.94) translateY(8px)' }
      ],
      { duration: 300, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
    );

    fadeOut.onfinish = () => {
      widget.style.pointerEvents = 'none';

      setTimeout(() => {
        const fadeIn = widget.animate(
          [
            { opacity: 0, transform: 'scale(0.96) translateY(6px)' },
            { opacity: 1, transform: 'scale(1) translateY(0)' }
          ],
          { duration: 400, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
        );

        fadeIn.onfinish = () => {
          widget.style.pointerEvents = '';
          fadeOut.cancel();
          fadeIn.cancel();
          closeAnimating = false;
        };
      }, 1500);
    };
  }

  // ── Traffic light buttons ───────────────────────────────────────────────

  widget.querySelector('[data-pw-close]').addEventListener('click', (e) => {
    e.stopPropagation();
    closeWindow();
  });

  widget.querySelector('[data-pw-minimize]').addEventListener('click', (e) => {
    e.stopPropagation();
    minimize();
  });

  widget.querySelector('[data-pw-expand]').addEventListener('click', (e) => {
    e.stopPropagation();
    expand();
  });

  // ── Drag ────────────────────────────────────────────────────────────────

  let dragging  = false;
  let positioned = false;
  let startX, startY, startLeft, startTop;

  function initPosition() {
    const rect = widget.getBoundingClientRect();
    widget.style.bottom = 'auto';
    widget.style.right  = 'auto';
    widget.style.top    = rect.top + 'px';
    widget.style.left   = rect.left + 'px';
    positioned = true;
  }

  chrome.addEventListener('mousedown', (e) => {
    if (e.target.closest('button')) return;
    e.preventDefault();

    if (!positioned) initPosition();

    dragging  = true;
    startX    = e.clientX;
    startY    = e.clientY;
    startLeft = parseInt(widget.style.left, 10);
    startTop  = parseInt(widget.style.top, 10);
    widget.style.transition = 'none';
    widget.style.cursor     = 'grabbing';
    chrome.style.cursor     = 'grabbing';
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    widget.style.left = (startLeft + e.clientX - startX) + 'px';
    widget.style.top  = (startTop  + e.clientY - startY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    widget.style.cursor = '';
    chrome.style.cursor = '';
  });

  // ── Destroy ─────────────────────────────────────────────────────────────

  function destroy() {
    widget.remove();
  }

  // ── Public API ──────────────────────────────────────────────────────────

  return {
    open(url) {
      setUrl(url);
      show();
      expand();
    },
    setUrl,
    expand,
    minimize,
    close: closeWindow,
    show,
    hide,
    destroy,
    /** Direct reference to the widget element */
    el: widget,
    /** Direct reference to the iframe element */
    frame,
  };
})();
