import $ from 'jquery';
// === RUTA LIMPIA V11 ===
export const wiPath = {
  limpiar(ruta) {
    const base = import.meta?.env?.BASE_URL || '/';
    const guar = sessionStorage.ghPath;
    if (guar) { sessionStorage.removeItem('ghPath'); return guar.replace(/^\/wiiprime(\/v\d+)?/, '') || '/'; }
    let r = base !== '/' && ruta?.startsWith(base) ? ruta.slice(base.length - 1) || '/' : ruta || '/';
    if (r !== '/' && !r.startsWith('/')) r = '/' + r;
    return r;
  },
  poner(ruta, titulo = '') {
    history.pushState({ ruta }, titulo, ruta);
    titulo && (document.title = titulo);
  },
  params: () => Object.fromEntries(new URLSearchParams(location.search)),
  get actual() { return this.limpiar(location.pathname); }
};

// === FADE SUAVE V12 ===
export const wiFade = async (sel, html, dur = 80) => {
  const el = $(sel)[0]; if (!el) return;
  el.style.willChange = 'opacity';
  el.style.transition = `opacity ${dur}ms ease`;
  el.style.opacity = 0;
  await new Promise(r => setTimeout(r, dur));
  el.innerHTML = html;
  el.style.opacity = 1;
  await new Promise(r => setTimeout(r, dur));
  el.style.transition = ''; el.style.willChange = '';
};