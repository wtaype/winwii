import './inicio.css';
import $ from 'jquery';
import { app, version, autor, link } from '../wii.js';
import { wiVista, year, wiTip, Saludar } from '../widev.js';

// ── DATA ──────────────────────────────────────────────────────
const roles = ['Organiza tu semana 📅','Tareas del día ✅','Notas profesionales 📝','Logros semanales 🏆'];

const stats = [
  { valor:7,    label:'Días planificados', sufijo:'' },
  { valor:100,  label:'Gratis',            sufijo:'%' },
  { valor:2026, label:'Actualizado',       sufijo:'' },
  { valor:24,   label:'Horas organizadas', sufijo:'h' },
];

const features = [
  { id:'horario',  icon:'fa-calendar-week', color:'#0EBEFF', nombre:'Horario',  desc:'Visualiza y gestiona tu semana completa',
    items:[{icon:'fa-clock',name:'Vista semanal',desc:'Horario día a día organizado'},{icon:'fa-plus-circle',name:'Agregar eventos',desc:'Añade tareas con hora y día'},{icon:'fa-bell',name:'Recordatorios',desc:'Nunca olvides un compromiso'}]},
  { id:'planes',   icon:'fa-list-check',    color:'#29C72E', nombre:'Planes',   desc:'Organiza tus tareas y pendientes del día',
    items:[{icon:'fa-check-square',name:'To-Do list',desc:'Lista de tareas por día'},{icon:'fa-flag',name:'Prioridades',desc:'Marca tus tareas más urgentes'},{icon:'fa-rotate',name:'Seguimiento',desc:'Controla tu progreso diario'}]},
  { id:'semanal',  icon:'fa-table-cells',   color:'#7000FF', nombre:'Semanal',  desc:'Vista global de toda tu semana en un vistazo',
    items:[{icon:'fa-table',name:'Tabla semanal',desc:'Los 7 días en una sola vista'},{icon:'fa-note-sticky',name:'Notas por día',desc:'Block de notas por jornada'},{icon:'fa-chart-bar',name:'Resumen',desc:'Estadísticas de tu semana'}]},
  { id:'abiertos', icon:'fa-folder-open',   color:'#FF5C69', nombre:'Abiertos', desc:'Proyectos y temas pendientes por cerrar',
    items:[{icon:'fa-circle-dot',name:'En progreso',desc:'Tareas que aún no terminan'},{icon:'fa-bookmark',name:'Guardados',desc:'Temas importantes marcados'},{icon:'fa-spinner',name:'Pendientes',desc:'Lo que queda por resolver'}]},
  { id:'mes',      icon:'fa-calendar-days', color:'#FFB800', nombre:'Mes',      desc:'Calendario mensual con vista de todos tus días',
    items:[{icon:'fa-calendar',name:'Vista mensual',desc:'Panorama del mes completo'},{icon:'fa-circle-check',name:'Días completados',desc:'Historial de días exitosos'},{icon:'fa-pen-to-square',name:'Planifica el mes',desc:'Agenda eventos futuros'}]},
  { id:'logros',   icon:'fa-trophy',        color:'#FF8C00', nombre:'Logros',   desc:'Celebra tu progreso y hábitos semanales',
    items:[{icon:'fa-medal',name:'Metas cumplidas',desc:'Tus logros de la semana'},{icon:'fa-fire',name:'Racha',desc:'Días consecutivos activos'},{icon:'fa-chart-line',name:'Progreso',desc:'Evolución de tus hábitos'}]},
];

const beneficios = [
  { icon:'fa-brain',       titulo:'Pensado para ti',   desc:'Diseñado como el horario de un profesional real. Dos columnas: calendario y block de notas, todo en un solo lugar.' },
  { icon:'fa-layer-group', titulo:'Todo organizado',   desc:'Horario semanal, notas por día, to-do list, proyectos abiertos y logros. Tu semana entera bajo control.' },
  { icon:'fa-rocket',      titulo:'Rápido y elegante', desc:'Interfaz limpia, responde al instante y se adapta a tu estilo con 5 temas de color distintos.' },
];

const diasPreview   = ['Lun','Mar','Mié','Jue','Vie'];
const tareasPreview = [
  { done:true,  txt:'Reunión equipo 9am' },
  { done:true,  txt:'Revisar propuesta'  },
  { done:false, txt:'Entrega informe',  color:'#FFB800' },
  { done:false, txt:'Llamada cliente',  color:'#bbb'    },
];

// ── PLANTILLAS ────────────────────────────────────────────────
const tplStat = s => `
  <div class="ini_stat">
    <div class="ini_stat_n" data-target="${s.valor}" data-sufijo="${s.sufijo}">0</div>
    <div class="ini_stat_l">${s.label}</div>
  </div>`;

const tplDia = (d,i) => `
  <div class="ini_prev_day${i===1?' active':''}">
    <span class="ini_prev_day_n">${d}</span>
    <div class="ini_prev_dots">
      <span class="ini_dot" style="background:#0EBEFF"></span>
      ${i<3?'<span class="ini_dot" style="background:#29C72E"></span>':''}
      ${i===1?'<span class="ini_dot" style="background:#FF5C69"></span>':''}
    </div>
  </div>`;

const tplTarea = t => `
  <div class="ini_prev_task${t.done?'':' pending'}">
    <i class="fas ${t.done?'fa-check-circle':'fa-circle'}" style="color:${t.done?'#29C72E':t.color}"></i>
    ${t.txt}
  </div>`;

const tplFeature = f => `
  <div class="ini_cat_card" style="--cc:${f.color}">
    <div class="ini_cat_bar"></div>
    <div class="ini_cat_top">
      <div class="ini_cat_ico"><i class="fas ${f.icon}"></i></div>
      <div class="ini_cat_info"><h3>${f.nombre}</h3><p>${f.desc}</p></div>
    </div>
    <ul class="ini_cat_tools">
      ${f.items.map(it=>`
        <li><a href="/${f.id}" class="ini_tool_a">
          <i class="fas ${it.icon}"></i>
          <div><strong>${it.name}</strong><span>${it.desc}</span></div>
          <i class="fas fa-arrow-right ini_ext"></i>
        </a></li>`).join('')}
    </ul>
  </div>`;

const tplBeneficio = (b,i) => `
  <div class="ini_about_card" style="--d:${i*.15}s">
    <div class="ini_card_ico"><i class="fas ${b.icon}"></i></div>
    <h3>${b.titulo}</h3>
    <p>${b.desc}</p>
  </div>`;

// ── RENDER ────────────────────────────────────────────────────
export const render = () => `
<div class="ini_wrap">

  <!-- ===== HERO ===== -->
  <section class="ini_hero">
    <div class="ini_hero_content">

      <div class="ini_saludo" style="--d:0s">
        <span>${Saludar()} Bienvenido!</span><span class="ini_wave">👋</span>
      </div>

      <h1 class="ini_titulo" style="--d:.18s">
        Organiza tu semana <span class="ini_grad">como un profesional</span>
      </h1>

      <div class="ini_roles" style="--d:.36s">
        ${roles.map((r,i)=>`<span class="ini_role${i===0?' active':''}">${r}</span>`).join('')}
      </div>

      <p class="ini_sub" style="--d:.54s">
        Gestiona tu horario, tareas y notas diarias con un planificador inteligente.
        Calendario semanal, block de notas y to-do list en un solo lugar. 100% gratis.
      </p>

      <div class="ini_stats" id="in_stats" style="--d:.72s">
        ${stats.map(tplStat).join('')}
      </div>

      <div class="ini_btns" style="--d:.9s">
        <a href="/horario" class="ini_btn_p"><i class="fas fa-calendar-week"></i> Ver mi semana</a>
        <a href="/semanal" class="ini_btn_s"><i class="fas fa-table-cells"></i> Vista semanal</a>
      </div>

    </div>

    <!-- Derecha: preview -->
    <div class="ini_hero_visual">
      <div class="ini_planner_preview" style="--d:.3s">
        <div class="ini_prev_header">
          <i class="fas fa-calendar"></i>
          <span>Semana del ${new Date().toLocaleDateString('es-PE',{day:'2-digit',month:'short'})}</span>
          <span class="ini_prev_badge"><i class="fas fa-circle"></i> Hoy</span>
        </div>
        <div class="ini_prev_cols">
          <div class="ini_prev_left">${diasPreview.map(tplDia).join('')}</div>
          <div class="ini_prev_right">
            <div class="ini_prev_note_title"><i class="fas fa-note-sticky"></i> Notas del día</div>
            ${tareasPreview.map(tplTarea).join('')}
            <div class="ini_prev_add"><i class="fas fa-plus"></i> Agregar tarea...</div>
          </div>
        </div>
      </div>
      <div class="ini_ftech ini_ft1" style="--d:.5s"  ${wiTip('Horario semanal')}><i class="fas fa-calendar-week"></i></div>
      <div class="ini_ftech ini_ft2" style="--d:.65s" ${wiTip('To-Do list')}><i class="fas fa-list-check"></i></div>
      <div class="ini_ftech ini_ft3" style="--d:.8s"  ${wiTip('Notas diarias')}><i class="fas fa-note-sticky"></i></div>
      <div class="ini_ftech ini_ft4" style="--d:.95s" ${wiTip('Tus logros')}><i class="fas fa-trophy"></i></div>
    </div>
  </section>

  <!-- ===== FUNCIONALIDADES ===== -->
  <section class="ini_cats_sec">
    <div class="ini_sec_head">
      <h2 class="ini_sec_tit">Todo lo que <span class="ini_grad">necesitas</span></h2>
      <div class="ini_sec_line"></div>
      <p class="ini_sec_desc">6 módulos diseñados para que nunca pierdas el control de tu semana</p>
    </div>
    <div class="ini_cats_grid">${features.map(tplFeature).join('')}</div>
  </section>

  <!-- ===== ¿POR QUÉ? ===== -->
  <section class="ini_about_sec">
    <div class="ini_sec_head">
      <h2 class="ini_sec_tit">¿Por qué <span class="ini_grad">${app}?</span></h2>
      <div class="ini_sec_line"></div>
    </div>
    <div class="ini_about_grid">${beneficios.map(tplBeneficio).join('')}</div>
  </section>

  <!-- ===== CTA ===== -->
  <section class="ini_cta_sec">
    <div class="ini_cta_wrap">
      <i class="fas fa-calendar-check ini_cta_ico"></i>
      <h2>¿Listo para organizar tu semana?</h2>
      <p>Empieza ahora, es completamente gratis</p>
      <div class="ini_cta_chips">
        ${features.map(f=>`<a href="/${f.id}" class="ini_chip" style="--cc:${f.color}" ${wiTip(f.desc)}><i class="fas ${f.icon}"></i> ${f.nombre}</a>`).join('')}
      </div>
      <p class="ini_cta_autor">Creado con ❤️ por <a href="${link}" target="_blank" rel="noopener">${autor}</a> · ${version} © ${year()}</p>
    </div>
  </section>

</div>`;

// ── INIT ──────────────────────────────────────────────────────
export const init = () => {

  // Roles rotantes
  let ri = 0;
  const $r = $('.ini_role');
  setInterval(() => { $r.removeClass('active'); $r.eq(ri = (ri+1) % $r.length).addClass('active'); }, 2800);

  // Stats contador — al entrar en viewport
  wiVista('#in_stats', () => {
    $('.ini_stat_n').each(function() {
      const $n = $(this), obj = +$n.data('target'), suf = $n.data('sufijo') || '';
      let v = 0;
      const t = setInterval(() => {
        v += obj / 50;
        if (v >= obj) { $n.text(obj + suf); clearInterval(t); }
        else $n.text(Math.floor(v));
      }, 28);
    });
  });

  // Scroll animations
  wiVista('.ini_cat_card',   null, { anim:'wi_fadeUp', stagger:80  });
  wiVista('.ini_about_card', null, { anim:'wi_fadeUp', stagger:140 });
  wiVista('.ini_cta_wrap',   null, { anim:'wi_fadeUp' });

  console.log(`📅 ${app} ${version} · Inicio OK`);
};

export const cleanup = () => console.log('🧹 Inicio limpiado');