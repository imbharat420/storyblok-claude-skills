// Run at state A, store result; trigger state; run again; diff keys. Replace SELECTOR.
(function(selector){
  const el = document.querySelector(selector); if(!el) return JSON.stringify({error:'not found'});
  const cs = getComputedStyle(el);
  const keys = ['position','top','height','maxWidth','width','padding','paddingTop','paddingBottom','backgroundColor','boxShadow','borderRadius','opacity','transform','backdropFilter','color','fontSize','transition'];
  const o = { scrollY, viewport: innerWidth }; keys.forEach(k => o[k] = cs[k]);
  o.classes = el.className?.toString(); o.dataAttrs = Object.fromEntries([...el.attributes].filter(a=>a.name.startsWith('data-')).map(a=>[a.name,a.value]));
  return JSON.stringify(o, null, 2);
})('SELECTOR');
