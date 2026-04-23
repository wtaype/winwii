import $ from 'jquery';
import { app } from '../wii.js';
import { Notificacion, wiPath, wiFade } from './widev.js';

// ── NAV — Config visual por rol ────────────────────────────────────────────────
export const NAV = {
  todos: {
    winav: [
      { href: '/',         page: 'inicio',    ico: 'fa-house',         txt: 'Inicio'    },
      { href: '/extraer',  page: 'extraer',   ico: 'fa-icons',         txt: 'Extraer'   },
      { href: '/emojis',   page: 'emojis',    ico: 'fa-palette',       txt: 'Emojis'    },
      { href: '/diario',   page: 'diario',    ico: 'fa-list-check',    txt: 'Diario'    },
      { href: '/semanal',  page: 'semanal',   ico: 'fa-table-cells',   txt: 'Semanal'   },
      { href: '/mensual',  page: 'mensual',   ico: 'fa-calendar-days', txt: 'Mensual'   },
      { href: '/planificar', page: 'planificar', ico: 'fa-folder-open', txt: 'Planificar' },
      { href: '/acerca',   page: 'acerca',    ico: 'fa-circle-info',   txt: 'Acerca'    },
    ],
    nvrig: [
      { href: '/descubre', page: 'descubre', ico: 'fa-gauge',       txt: 'Descubre'  },
      { isBtn: true, cls: 'bt_auth registrar', ico: 'fa-user-plus',   txt: 'Registrar' },
      { isBtn: true, cls: 'bt_auth login',     ico: 'fa-sign-in-alt', txt: 'Login'     },
    ]
  },
  smile: {
    winav: [
      { href: '/smile',    page: 'smile',    ico: 'fa-house',         txt: 'Inicio'    },
      { href: '/extraer',  page: 'extraer',   ico: 'fa-icons',         txt: 'Extraer'   },
      { href: '/emojis',   page: 'emojis',    ico: 'fa-palette',       txt: 'Emojis'    },
      { href: '/diario',   page: 'diario',    ico: 'fa-list-check',    txt: 'Diario'    },
      { href: '/semanal',  page: 'semanal',   ico: 'fa-table-cells',   txt: 'Semanal'   },
      { href: '/mensual',  page: 'mensual',   ico: 'fa-calendar-days', txt: 'Mensual'   },
      { href: '/planificar', page: 'planificar', ico: 'fa-folder-open', txt: 'Planificar' },
      { href: '/acerca',   page: 'acerca',    ico: 'fa-circle-info',   txt: 'Acerca'    },
    ],
    nvrig: [
      { href: '/win',      page: 'win',      ico: 'fa-pen-to-square', txt: 'Win'       },
      { href: '/notas',    page: 'notas',    ico: 'fa-note-sticky',   txt: 'Notas'     },
      { href: '/mensajes', page: 'mensajes', ico: 'fa-comments', txt: 'Mensajes' },
      { isPerfil: true }, { isSalir: true }
    ]
  },
  gestor: {
    winav: [
      { href: '/gestor',         page: 'gestor',         ico: 'fa-house',              txt: 'Inicio'         },
    ],
    nvrig: [
      { href: '/mensajes', page: 'mensajes', ico: 'fa-comments', txt: 'Mensajes' },
      { isPerfil: true }, { isSalir: true }
    ]
  },
  empresa: {
    winav: [
      { href: '/empresa',      page: 'empresa',      ico: 'fa-building',    txt: 'Panel'        },
    ],
    nvrig: [
      { href: '/mensajes', page: 'mensajes', ico: 'fa-comments', txt: 'Mensajes' },
      { isPerfil: true }, { isSalir: true }
    ]
  },
  admin: {
    winav: [
      { href: '/admin',    page: 'admin',    ico: 'fa-globe',        txt: 'Plataforma' },
      { href: '/usuarios', page: 'usuarios', ico: 'fa-users',        txt: 'Usuarios'   },
      { href: '/permisos', page: 'permisos', ico: 'fa-user-shield',  txt: 'Permisos'   },
      { href: '/sistema',  page: 'sistema',  ico: 'fa-database',     txt: 'Sistema'    },
    ],
    nvrig: [
      { href: '/mensajes', page: 'mensajes', ico: 'fa-comments', txt: 'Mensajes' },
      { isPerfil: true }, { isSalir: true }
    ]
  }
};

// ── RUTAS — Fuente única de verdad ─────────────────────────────────────────────
// roles: null = público · ['rol',...] = protegido · area = subcarpeta en web/
export const RUTAS = [
  // PÚBLICAS — web/todos/
  { path: '/inicio',     area: 'todos/' },
  { path: '/acerca',     area: 'todos/' },
  { path: '/login',      area: 'todos/' },
  { path: '/descubre',   area: 'todos/' },
  // productividad
  { path: '/extraer',    area: 'todos/' },
  { path: '/emojis',     area: 'todos/' },
  { path: '/planificar', area: 'todos/' },
  { path: '/diario',     area: 'todos/' },
  { path: '/semanal',    area: 'todos/' },
  { path: '/mensual',    area: 'todos/' },
  { path: '/mes',        area: 'todos/' },
  { path: '/horario',    area: 'todos/' },
  { path: '/tareas',     area: 'todos/' },
  { path: '/planes',     area: 'todos/' },
  { path: '/logros',     area: 'todos/' },
  { path: '/tools',      area: 'todos/' },
  { path: '/online',     area: 'todos/' },
  { path: '/preview',    area: 'todos/' },
  { path: '/scrum',      area: 'todos/' },

  // SMILE — web/smile/ (autenticadas)
  { path: '/smile',    area: 'smile/', roles: ['smile','gestor','admin','empresa'] },
  { path: '/win',      area: 'smile/', roles: ['smile','gestor','admin','empresa'] },
  { path: '/notas',    area: 'smile/', roles: ['smile','gestor','admin','empresa'] },
  { path: '/milab',    area: 'smile/', roles: ['smile','gestor','admin','empresa'] },
  { path: '/agregar',  area: 'smile/', roles: ['smile','gestor','admin','empresa'] },
  { path: '/perfil',   area: 'smile/', roles: ['smile','gestor','admin','empresa'] },
  { path: '/mensajes', area: 'smile/', roles: ['smile','gestor','admin','empresa'] },

  // GESTOR — web/gestor/ (pending: misclases, alumnos, calificaciones, buscar)
  { path: '/gestor', area: 'gestor/', roles: ['gestor','admin','empresa'] },

  // EMPRESA — web/empresa/ (pending: equipos, empleados, reportes, certificados)
  { path: '/empresa', area: 'empresa/', roles: ['empresa','admin'] },

  // ADMIN — web/admin/
  { path: '/admin',    area: 'admin/', roles: ['admin'] },
  { path: '/usuarios', area: 'admin/', roles: ['admin'] },
  { path: '/permisos', area: 'admin/', roles: ['admin'] },
  { path: '/sistema',  area: 'admin/', roles: ['admin'] },

];

// ── GLOB — Vite mapea todos los módulos en build time ─────────────────────────
// rutas.js está en smiles/web/ → las áreas (todos/, smile/, etc.) son relativas a aquí
const MODS = import.meta.glob('./**/*.js');
const mod$ = (area, page) => MODS[`./${area}${page}.js`];

// ── MOTOR ──────────────────────────────────────────────────────────────────────
class WiRutas {
  constructor() {
    this.rutas     = {};
    this.modActual = null;
    this.cargand   = false;
    this.precach   = new Set();
    this.HOME      = 'inicio';
    this.main      = '#wimain';
  }

  register(ruta, mod) { this.rutas[ruta] = mod; }

  // Registra rutas con manejo inteligente de paths duplicados:
  // Si una ruta existe en público Y en área protegida, se crea un handler unificado
  // que sirve el módulo protegido si el rol aplica, si no el público.
  registerAll(getRol) {
    const pub  = {};  // path → imp()   (rutas públicas)
    const priv = {};  // path → [{ roles, imp }]  (rutas protegidas)

    RUTAS.forEach(({ path, area, roles = null, mod }) => {
      const page = mod ?? path.slice(1);
      const imp  = mod$(area, page);
      if (!imp) { console.warn(`[ruta] no encontrado: ../web/${area}${page}.js`); return; }
      if (roles === null) {
        pub[path] = imp;
      } else {
        (priv[path] = priv[path] || []).push({ roles, imp });
      }
    });

    const noAuth = () => Promise.resolve({
      render: () => '',
      init:   () => setTimeout(() => this.navigate('/login'), 0)
    });

    const allPaths = new Set([...Object.keys(pub), ...Object.keys(priv)]);
    allPaths.forEach(path => {
      const pubImp    = pub[path];
      const privList  = priv[path] || [];

      if (!privList.length) {
        // Solo pública
        this.register(path, pubImp);
      } else if (!pubImp) {
        // Solo protegida
        this.register(path, () => {
          const rol   = getRol?.();
          const entry = privList.find(e => e.roles.includes(rol));
          return entry ? entry.imp() : noAuth();
        });
      } else {
        // Pública + protegida: el rol decide cuál sirve
        this.register(path, () => {
          const rol   = getRol?.();
          const entry = privList.find(e => e.roles.includes(rol));
          return entry ? entry.imp() : pubImp();
        });
      }
    });
  }

  async navigate(ruta, historial = true) {
    if (this.cargand) return;
    this.cargand = true;
    let norm = wiPath.limpiar(ruta);
    if (norm === '/') norm = `/${this.HOME}`;
    const cargar = this.rutas[norm] ?? mod$('todos/', '404');
    try {
      this.modActual?.cleanup?.();
      const mod    = typeof cargar === 'function' ? await cargar() : cargar;
      if (typeof cargar === 'function') this.rutas[norm] = mod;
      const html   = await mod.render();
      const titulo = `${norm.slice(1).replace(/^\w/, c => c.toUpperCase()) || 'Inicio'} - ${app}`;
      this.marcarNav(norm);
      await wiFade(this.main, html);
      window.scrollTo(0, 0);
      document.title = titulo;
      mod.init?.();
      if (historial) wiPath.poner(norm === `/${this.HOME}` ? '/' : norm, titulo);
      this.modActual = mod;
      // Prefetch inicio tras carga inicial para tenerlo listo
      if (norm !== `/${this.HOME}`) setTimeout(() => this.prefetch('/'), 800);
    } catch (err) {
      Notificacion('Error en la ruta');
      console.error('[ruta] navigate:', err);
    } finally {
      this.cargand = false;
    }
  }

  marcarNav(norm) {
    const pag = norm.slice(1) || this.HOME;
    $('.nv_item').removeClass('active');
    $(`.nv_item[data-page="${pag}"]`).addClass('active');
  }

  async prefetch(ruta) {
    let norm = wiPath.limpiar(ruta);
    if (norm === '/') norm = `/${this.HOME}`;
    if (this.precach.has(norm) || typeof this.rutas[norm] !== 'function') return;
    try { this.rutas[norm] = await this.rutas[norm](); this.precach.add(norm); }
    catch { console.warn('[ruta] prefetch:', norm); }
  }

  init() {
    const rActual = wiPath.actual === '/' ? `/${this.HOME}` : wiPath.limpiar(wiPath.actual);
    this.marcarNav(rActual);

    $(document)
      .on('click', '.nv_item', (e) => {
        e.preventDefault();
        const pag = $(e.currentTarget).data('page');
        this.navigate(pag === this.HOME ? '/' : `/${pag}`);
      })
      .on('mouseenter', '.nv_item[data-page]', (e) => {
        const pag = $(e.currentTarget).data('page');
        this.prefetch(pag === this.HOME ? '/' : `/${pag}`);
      });

    window.addEventListener('popstate', (e) =>
      this.navigate(e.state?.ruta || wiPath.actual, false)
    );
    this.navigate(wiPath.actual, false);
  }
}

export const rutas = new WiRutas();