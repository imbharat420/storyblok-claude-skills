// Collect raw values across the page for clustering. Run in page context.
(function(){
  const els = [...document.querySelectorAll('body *')].slice(0, 4000);
  const count = (m, k) => k && m.set(k, (m.get(k) || 0) + 1);
  const colours = new Map(), fonts = new Map(), sizes = new Map(), lh = new Map(), weights = new Map(), spacing = new Map(), radius = new Map(), shadows = new Map(), durations = new Map();
  els.forEach(e => { const c = getComputedStyle(e);
    [c.color, c.backgroundColor, c.borderTopColor].forEach(v => v && v !== 'rgba(0, 0, 0, 0)' && count(colours, v));
    count(fonts, c.fontFamily); count(sizes, c.fontSize); count(lh, c.lineHeight); count(weights, c.fontWeight);
    [c.paddingTop, c.paddingLeft, c.marginTop, c.gap].forEach(v => v && v !== '0px' && v !== 'normal' && count(spacing, v));
    c.borderRadius !== '0px' && count(radius, c.borderRadius); c.boxShadow !== 'none' && count(shadows, c.boxShadow);
    c.transitionDuration !== '0s' && count(durations, c.transitionDuration);
  });
  const top = (m, n = 30) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
  return JSON.stringify({ colours: top(colours, 40), fonts: top(fonts, 10), fontSizes: top(sizes, 20), lineHeights: top(lh, 20), weights: top(weights), spacing: top(spacing, 30), radius: top(radius), shadows: top(shadows), durations: top(durations) }, null, 2);
})();
