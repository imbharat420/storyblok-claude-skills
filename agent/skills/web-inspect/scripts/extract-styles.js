// Per-component extraction. Replace SELECTOR. Run in page context; capture full output.
(function(selector) {
  const el = document.querySelector(selector);
  if (!el) return JSON.stringify({ error: 'Element not found: ' + selector });
  const props = ['fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','color','textTransform','textDecoration',
    'backgroundColor','background','padding','paddingTop','paddingRight','paddingBottom','paddingLeft','margin','marginTop',
    'marginRight','marginBottom','marginLeft','width','height','maxWidth','minWidth','maxHeight','minHeight','display',
    'flexDirection','justifyContent','alignItems','gap','gridTemplateColumns','gridTemplateRows','borderRadius','border',
    'borderTop','borderBottom','borderLeft','borderRight','boxShadow','overflow','overflowX','overflowY','position','top',
    'right','bottom','left','zIndex','opacity','transform','transition','cursor','objectFit','objectPosition','mixBlendMode',
    'filter','backdropFilter','whiteSpace','textOverflow','WebkitLineClamp','scrollSnapAlign','aspectRatio'];
  const skip = new Set(['none','normal','auto','0px','rgba(0, 0, 0, 0)','']);
  const styles = e => { const cs = getComputedStyle(e), o = {}; props.forEach(p => { const v = cs[p]; if (v && !skip.has(v)) o[p] = v; }); return o; };
  const walk = (e, d) => d > 4 ? null : {
    tag: e.tagName.toLowerCase(),
    classes: (e.className?.toString() || '').split(' ').filter(Boolean).slice(0, 5).join(' '),
    role: e.getAttribute('role') || undefined, aria: e.getAttribute('aria-label') || undefined,
    text: e.childNodes.length === 1 && e.childNodes[0].nodeType === 3 ? e.textContent.trim().slice(0, 200) : null,
    styles: styles(e),
    image: e.tagName === 'IMG' ? { src: e.currentSrc || e.src, alt: e.alt, w: e.naturalWidth, h: e.naturalHeight, loading: e.loading, srcset: !!e.srcset } : null,
    childCount: e.children.length,
    children: [...e.children].slice(0, 20).map(c => walk(c, d + 1)).filter(Boolean)
  };
  return JSON.stringify({ selector, viewport: innerWidth + 'x' + innerHeight, scrollY, tree: walk(el, 0) }, null, 2);
})('SELECTOR');
