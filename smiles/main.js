import $ from 'jquery';
import { getls, wiSmart} from './widev.js';
import { rutas } from './rutas/ruta.js';

['inicio','acerca'].forEach(pg => rutas.register(`/${pg}`, () => import(`./web/${pg}.js`)));
['extraer','planificar','emojis','diario','semanal','mensual','tools','online','preview',,'horario','tareas','planes','semanal','mes','logros'].forEach(pg => rutas.register(`/${pg}`, () => import(`./web/todos/${pg}.js`)));
['descubre','login','smile','perfil', 'notas','mensajes'].forEach(pg => rutas.register(`/${pg}`, () => import(`./web/smile/${pg}.js`)));
import('./header.js');
rutas.init();

wiSmart({
css: [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap',
  'https://fonts.googleapis.com/css2?family=Rubik:wght@300..900&display=swap',
],
js: [() => import('https://kit.fontawesome.com/a8c6571af4.js'), () => import('./footer.js')],
});


