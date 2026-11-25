// Lightweight text-scramble animation used by Hero.jsx
export function scrambleTo(el, targetText, { duration = 0.9 } = {}) {
  try {
    if (!el) return;
    const chars = '!<>-_\\/[]{}—=+*^?#________'.split('');
    const len = Math.max(0, targetText ? targetText.length : 0);
    if (len === 0) {
      el.textContent = targetText || '';
      return;
    }

    const start = performance.now();
    const dur = Math.max(0.02, duration) * 1000;

    let rafId;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      let out = '';
      for (let i = 0; i < len; i += 1) {
        const revealPoint = (i + 1) / len;
        if (t >= revealPoint) out += targetText[i];
        else out += chars[(Math.random() * chars.length) | 0];
      }
      el.textContent = out;
      if (t < 1) rafId = requestAnimationFrame(tick);
      else el.textContent = targetText;
    };

    rafId = requestAnimationFrame(tick);

    // return a cleanup function in case caller wants to cancel
    return () => { if (rafId) cancelAnimationFrame(rafId); };
  } catch (err) {
    if (el) el.textContent = targetText || '';
  }
}

export default scrambleTo;
