// Run in page context via browser tool. Returns JSON string.
JSON.stringify({
  title: document.title,
  meta: Object.fromEntries([...document.querySelectorAll('meta[name],meta[property]')].map(m => [m.getAttribute('name') || m.getAttribute('property'), m.content])),
  favicons: [...document.querySelectorAll('link[rel*="icon"]')].map(l => ({ href: l.href, sizes: l.sizes?.toString() })),
  fontLinks: [...document.querySelectorAll('link[href*="fonts."]')].map(l => l.href),
  fontsUsed: [...new Set([...document.querySelectorAll('h1,h2,h3,h4,h5,h6,p,a,button,li,span,label,input')].map(e => getComputedStyle(e).fontFamily + ' | ' + getComputedStyle(e).fontWeight))],
  colours: [...new Set([...document.querySelectorAll('*')].slice(0, 3000).flatMap(e => { const c = getComputedStyle(e); return [c.color, c.backgroundColor, c.borderColor]; }).filter(v => v && v !== 'rgba(0, 0, 0, 0)'))],
  framework: {
    next: !!window.__NEXT_DATA__ || !!document.querySelector('script[src*="/_next/"]'),
    nuxt: !!window.__NUXT__, angular: !!document.querySelector('[ng-version]'),
    react: !!document.querySelector('[data-reactroot]') || Object.keys(window).some(k => k.startsWith('__REACT')),
    storyblok: !!document.querySelector('script[src*="storyblok"]') || !!window.storyblok || !!window.StoryblokBridge,
    gtm: !!document.querySelector('script[src*="googletagmanager"]'),
    tailwind: [...document.querySelectorAll('[class]')].slice(0, 300).some(e => /\b(flex|grid|px-\d|py-\d|text-\w+|bg-\w+)\b/.test(e.className)),
  },
  scrollLibs: { lenis: !!document.querySelector('.lenis'), locomotive: !!document.querySelector('[data-scroll-container],.locomotive-scroll') },
  scrollSnap: [...document.querySelectorAll('*')].slice(0, 2000).filter(e => getComputedStyle(e).scrollSnapType !== 'none').length,
  breakpointsHint: [...document.styleSheets].flatMap(s => { try { return [...s.cssRules]; } catch { return []; } }).filter(r => r.media).map(r => r.media.mediaText).filter((v, i, a) => a.indexOf(v) === i).slice(0, 30),
  counts: { img: document.images.length, video: document.querySelectorAll('video').length, svg: document.querySelectorAll('svg').length, form: document.forms.length, iframe: document.querySelectorAll('iframe').length }
}, null, 2);
