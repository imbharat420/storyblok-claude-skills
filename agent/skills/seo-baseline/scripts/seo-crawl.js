JSON.stringify({
  url: location.href, title: document.title, titleLen: document.title.length,
  description: document.querySelector('meta[name="description"]')?.content || null,
  canonical: document.querySelector('link[rel="canonical"]')?.href || null,
  robotsMeta: document.querySelector('meta[name="robots"]')?.content || null,
  hreflang: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map(l => ({ lang: l.hreflang, href: l.href })),
  headings: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => h.tagName + ': ' + h.textContent.trim().slice(0, 80)),
  h1Count: document.querySelectorAll('h1').length,
  landmarks: { header: !!document.querySelector('header'), nav: !!document.querySelector('nav'), main: !!document.querySelector('main'), footer: !!document.querySelector('footer') },
  jsonLd: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => { try { const j = JSON.parse(s.textContent); return { type: j['@type'] || (j['@graph'] || []).map(g => g['@type']), ok: true }; } catch { return { ok: false }; } }),
  links: { internal: [...document.links].filter(a => a.host === location.host).length, external: [...document.links].filter(a => a.host !== location.host).length, nofollow: [...document.links].filter(a => /nofollow/.test(a.rel)).length },
  images: { total: document.images.length, missingAlt: [...document.images].filter(i => !i.alt).length, missingDims: [...document.images].filter(i => !i.getAttribute('width') || !i.getAttribute('height')).length, lazy: [...document.images].filter(i => i.loading === 'lazy').length },
  scripts: { total: document.scripts.length, external: [...document.scripts].filter(s => s.src && new URL(s.src).host !== location.host).length, blocking: [...document.scripts].filter(s => s.src && !s.async && !s.defer && !s.type?.includes('module')).length },
  fonts: [...document.querySelectorAll('link[rel="preload"][as="font"]')].length,
  lcpCandidate: (() => { const els = [...document.querySelectorAll('img,video,h1,h2,p')].filter(e => { const r = e.getBoundingClientRect(); return r.top < innerHeight && r.width * r.height > 0; }); return els.sort((a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(); return rb.width * rb.height - ra.width * ra.height; })[0]?.outerHTML.slice(0, 120) || null; })()
}, null, 2);
