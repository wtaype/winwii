import './descubre.css';
import $ from 'jquery';
import { app } from '../../wii.js';

// 🎨 HTML
export const render = () => `
  <div class="descubre_container">
    <!-- Hero Principal -->
    <section class="desc_hero">
      <div class="hero_wrapper">
        <div class="hero_content">
          <div class="hero_badge">
            <i class="fas fa-heart"></i>
            <span>Bienvenido a ${app}</span>
          </div>
          <h1>Expresa tus sentimientos de forma única</h1>
          <p>Crea mensajes personalizados llenos de amor, amistad y emociones sinceras. Únete a miles de usuarios que ya comparten sus sentimientos de forma única.</p>
          <div class="hero_ctas">
            <a href="#/auth?mode=registro" class="btn_primary">
              <i class="fas fa-user-plus"></i>
              <span>Crear cuenta gratis</span>
            </a>
            <a href="#/ejemplos" class="btn_secondary">
              <i class="fas fa-images"></i>
              <span>Ver ejemplos</span>
            </a>
          </div>
          <div class="hero_trust">
            <div class="trust_item">
              <i class="fas fa-check-circle"></i>
              <span>100% Gratis</span>
            </div>
            <div class="trust_item">
              <i class="fas fa-shield-alt"></i>
              <span>Seguro y privado</span>
            </div>
            <div class="trust_item">
              <i class="fas fa-bolt"></i>
              <span>Fácil de usar</span>
            </div>
          </div>
        </div>
        <div class="hero_visual">
          <div class="visual_grid">
            <div class="visual_card card_1">
              <div class="card_icon amor">
                <i class="fas fa-heart"></i>
              </div>
              <h4>Mensajes de amor</h4>
              <p>Expresa tus sentimientos más profundos</p>
            </div>
            <div class="visual_card card_2">
              <div class="card_icon amistad">
                <i class="fas fa-user-friends"></i>
              </div>
              <h4>Cartas de amistad</h4>
              <p>Fortalece tus lazos de amistad</p>
            </div>
            <div class="visual_card card_3">
              <div class="card_icon especial">
                <i class="fas fa-gift"></i>
              </div>
              <h4>Momentos especiales</h4>
              <p>Celebra cada ocasión única</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Estadísticas -->
    <section class="desc_stats">
      <div class="stats_wrapper">
        <div class="stat_box">
          <div class="stat_icon">
            <i class="fas fa-users"></i>
          </div>
          <h3>1,000+</h3>
          <p>Usuarios activos</p>
        </div>
        <div class="stat_box">
          <div class="stat_icon">
            <i class="fas fa-envelope-open-text"></i>
          </div>
          <h3>5,000+</h3>
          <p>Mensajes creados</p>
        </div>
        <div class="stat_box">
          <div class="stat_icon">
            <i class="fas fa-heart"></i>
          </div>
          <h3>10,000+</h3>
          <p>Corazones compartidos</p>
        </div>
        <div class="stat_box">
          <div class="stat_icon">
            <i class="fas fa-smile-beam"></i>
          </div>
          <h3>98%</h3>
          <p>Satisfacción</p>
        </div>
      </div>
    </section>

    <!-- Características -->
    <section class="desc_features">
      <div class="features_wrapper">
        <div class="section_header">
          <h2>Todo lo que necesitas para expresar tus sentimientos</h2>
          <p>Herramientas profesionales al alcance de todos</p>
        </div>

        <div class="features_grid">
          <div class="feature_item">
            <div class="feature_icon amor">
              <i class="fas fa-heart"></i>
            </div>
            <h3>Mensajes de amor</h3>
            <p>Plantillas románticas personalizables para expresar tu amor de forma única y especial.</p>
            <ul>
              <li><i class="fas fa-check"></i> Plantillas profesionales</li>
              <li><i class="fas fa-check"></i> Totalmente personalizable</li>
              <li><i class="fas fa-check"></i> Imágenes y colores</li>
            </ul>
          </div>

          <div class="feature_item">
            <div class="feature_icon amistad">
              <i class="fas fa-user-friends"></i>
            </div>
            <h3>Cartas de amistad</h3>
            <p>Fortalece tus lazos de amistad con mensajes sinceros y llenos de cariño.</p>
            <ul>
              <li><i class="fas fa-check"></i> Diseños amigables</li>
              <li><i class="fas fa-check"></i> Textos emotivos</li>
              <li><i class="fas fa-check"></i> Fácil de compartir</li>
            </ul>
          </div>

          <div class="feature_item">
            <div class="feature_icon especial">
              <i class="fas fa-calendar-heart"></i>
            </div>
            <h3>Ocasiones especiales</h3>
            <p>Celebra cumpleaños, aniversarios y momentos únicos con mensajes personalizados.</p>
            <ul>
              <li><i class="fas fa-check"></i> Múltiples ocasiones</li>
              <li><i class="fas fa-check"></i> Diseños festivos</li>
              <li><i class="fas fa-check"></i> Animaciones incluidas</li>
            </ul>
          </div>

          <div class="feature_item">
            <div class="feature_icon declaracion">
              <i class="fas fa-comment-heart"></i>
            </div>
            <h3>Declaraciones</h3>
            <p>Atrévete a declarar tus sentimientos con mensajes auténticos y emotivos.</p>
            <ul>
              <li><i class="fas fa-check"></i> Plantillas románticas</li>
              <li><i class="fas fa-check"></i> Mensajes personales</li>
              <li><i class="fas fa-check"></i> Privado y seguro</li>
            </ul>
          </div>

          <div class="feature_item">
            <div class="feature_icon qr">
              <i class="fas fa-qrcode"></i>
            </div>
            <h3>Tarjetas QR</h3>
            <p>Crea tarjetas únicas con códigos QR personalizados para compartir tus mensajes.</p>
            <ul>
              <li><i class="fas fa-check"></i> QR personalizado</li>
              <li><i class="fas fa-check"></i> Fondos a elección</li>
              <li><i class="fas fa-check"></i> Descarga en HD</li>
            </ul>
          </div>

          <div class="feature_item">
            <div class="feature_icon compartir">
              <i class="fas fa-share-nodes"></i>
            </div>
            <h3>Fácil de compartir</h3>
            <p>Comparte tus mensajes por link, redes sociales o descárgalos como imagen.</p>
            <ul>
              <li><i class="fas fa-check"></i> Link único</li>
              <li><i class="fas fa-check"></i> Redes sociales</li>
              <li><i class="fas fa-check"></i> Descarga JPG/PNG</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Cómo funciona -->
    <section class="desc_pasos">
      <div class="pasos_wrapper">
        <div class="section_header">
          <h2>Crea tu mensaje en 3 simples pasos</h2>
          <p>Sin complicaciones, rápido y fácil</p>
        </div>

        <div class="pasos_grid">
          <div class="paso_card">
            <div class="paso_numero">1</div>
            <div class="paso_icono">
              <i class="fas fa-user-plus"></i>
            </div>
            <h3>Regístrate gratis</h3>
            <p>Crea tu cuenta en menos de 1 minuto. Solo necesitas un correo electrónico.</p>
          </div>

          <div class="paso_arrow">
            <i class="fas fa-arrow-right"></i>
          </div>

          <div class="paso_card">
            <div class="paso_numero">2</div>
            <div class="paso_icono">
              <i class="fas fa-palette"></i>
            </div>
            <h3>Personaliza</h3>
            <p>Elige plantilla, añade tu texto, imágenes, colores y emojis a tu gusto.</p>
          </div>

          <div class="paso_arrow">
            <i class="fas fa-arrow-right"></i>
          </div>

          <div class="paso_card">
            <div class="paso_numero">3</div>
            <div class="paso_icono">
              <i class="fas fa-paper-plane"></i>
            </div>
            <h3>Comparte</h3>
            <p>Envía tu mensaje por link, redes sociales o descárgalo como imagen.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonios -->
    <section class="desc_testimonios">
      <div class="testimonios_wrapper">
        <div class="section_header">
          <h2>Lo que dicen nuestros usuarios</h2>
          <p>Miles de personas ya confían en ${app}</p>
        </div>

        <div class="testimonios_grid">
          <div class="testimonio_card">
            <div class="testimonio_quote">
              <i class="fas fa-quote-left"></i>
            </div>
            <div class="testimonio_stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <p>"¡Increíble! Pude expresar mis sentimientos de una forma única y especial. Mi pareja lloró de emoción 💕"</p>
            <div class="testimonio_autor">
              <div class="autor_avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="autor_info">
                <h4>María González</h4>
                <span>Usuario desde hace 3 meses</span>
              </div>
            </div>
          </div>

          <div class="testimonio_card">
            <div class="testimonio_quote">
              <i class="fas fa-quote-left"></i>
            </div>
            <div class="testimonio_stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <p>"La mejor forma de sorprender en un aniversario. Las plantillas son hermosas y muy fáciles de personalizar"</p>
            <div class="testimonio_autor">
              <div class="autor_avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="autor_info">
                <h4>Carlos Rodríguez</h4>
                <span>Usuario desde hace 6 meses</span>
              </div>
            </div>
          </div>

          <div class="testimonio_card">
            <div class="testimonio_quote">
              <i class="fas fa-quote-left"></i>
            </div>
            <div class="testimonio_stars">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <p>"Me encanta poder crear códigos QR personalizados. Es original y muy romántico 😍"</p>
            <div class="testimonio_autor">
              <div class="autor_avatar">
                <i class="fas fa-user"></i>
              </div>
              <div class="autor_info">
                <h4>Ana López</h4>
                <span>Usuario desde hace 1 mes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final -->
    <section class="desc_cta">
      <div class="cta_wrapper">
        <div class="cta_content">
          <h2>¿Listo para expresar tus sentimientos?</h2>
          <p>Únete a miles de personas que ya usan ${app} para compartir amor y emociones</p>
          <a href="#/auth?mode=registro" class="btn_cta">
            <i class="fas fa-rocket"></i>
            <span>Comenzar ahora gratis</span>
          </a>
          <div class="cta_features">
            <div class="cta_feature">
              <i class="fas fa-check"></i>
              <span>Sin tarjeta de crédito</span>
            </div>
            <div class="cta_feature">
              <i class="fas fa-check"></i>
              <span>Sin compromiso</span>
            </div>
            <div class="cta_feature">
              <i class="fas fa-check"></i>
              <span>Cancela cuando quieras</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
`;

// 🎯 Init
export const init = () => {
  console.log(`✅ Descubre de ${app} cargado`);
  initAnimations();
};

// 🎭 Animaciones al scroll
function initAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1 }
  );

  $('.feature_item, .paso_card, .testimonio_card, .stat_box, .visual_card').each(function() {
    observer.observe(this);
  });
}

// 🧹 Cleanup
export const cleanup = () => {
  console.log('🧹 Descubre limpiado');
};