import $ from 'jquery';
import { getls, wiSmart } from './web/widev.js';
import { rutas } from './web/rutas.js';

// ── RUTAS PROFESIONAL DE ACUERDO A ROLES  ─────────────────────────────
rutas.registerAll(() => getls('wiSmile')?.rol);

rutas.register('/', (isPre = false) => {
  const u = getls('wiSmile');
  if (!u) return import('./web/todos/inicio.js');
  const map = {
    smile:   { r: '/smile',   m: () => import('./web/smile/smile.js')     },
    gestor:  { r: '/gestor',  m: () => import('./web/gestor/gestor.js')   },
    empresa: { r: '/empresa', m: () => import('./web/empresa/empresa.js') },
    admin:   { r: '/admin',   m: () => import('./web/admin/admin.js')     }
  };
  const t = map[u.rol] || map.smile;
  if (!isPre && t.r !== '/') { rutas.navigate(t.r); return t.m(); }
  return t.m();
});

import('./header.js');
rutas.init();

wiSmart({
css: [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Rubik:wght@300..900&display=swap',
],
js: [() => import('https://kit.fontawesome.com/a8c6571af4.js'), () => import('./footer.js')],
});


