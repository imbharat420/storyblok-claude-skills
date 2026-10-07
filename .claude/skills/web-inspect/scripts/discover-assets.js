// Asset discovery. Optionally scope: replace document with document.querySelector('SELECTOR').
(function(root) {
  const bgs = [...root.querySelectorAll('*')].filter(el => { const b = getComputedStyle(el).backgroundImage; return b && b !== 'none'; });
  return JSON.stringify({
    images: [...root.querySelectorAll('img')].map(img => ({ src: img.currentSrc || img.src, alt: img.alt, w: img.naturalWidth, h: img.naturalHeight,
      position: getComputedStyle(img).position, zIndex: getComputedStyle(img).zIndex,
      siblingsInContainer: img.parentElement ? img.parentElement.querySelectorAll('img').length : 0 })),
    videos: [...root.querySelectorAll('video')].map(v => ({ src: v.src || v.querySelector('source')?.src, poster: v.poster, autoplay: v.autoplay, loop: v.loop, muted: v.muted })),
    backgrounds: bgs.map(el => ({ url: getComputedStyle(el).backgroundImage, el: el.tagName + '.' + (el.className?.toString().split(' ')[0] || '') })),
    inlineSvg: root.querySelectorAll('svg').length,
    iframes: [...root.querySelectorAll('iframe')].map(f => f.src),
    lottieOrCanvas: root.querySelectorAll('canvas, lottie-player, [data-lottie]').length
  }, null, 2);
})(document);
