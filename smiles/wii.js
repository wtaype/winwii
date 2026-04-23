// INFORMACIÓN DEL APP 
export let id = 'winwii'
export let app = 'Winwii'
export let lanzamiento = 2026;
export let ipdev = import.meta.env.VITE_DEV;
export let by = '@wilder.taype';
export let linkme = 'https://wtaype.github.io/';
export let version = 'v19';

/** ACTUALIZACIÓN PRINCIPAL ONE DEV [MAIN] (1)
git add . ; git commit -m "Actualizacion Principal v19.10.10" ; git push origin main

//  Actualizar versiones de seguridad [TAG NUEVO] (2)
git tag v19 -m "Version v19" ; git push origin v19

// Actualizar versiones de seguridad [TAG REMPLAZO] (3)
git tag -d v19 ; git tag v19 -m "Version v19 actualizada" ; git push origin v19 --force

// Actualizar versiones de seguridad [ELIMINAR CARPETA - ARCHIVO ONLINE] (4)
git rm --cached skills-lock.json ; git commit -m "Archivo Eliminado" ; git push origin main
git rm -r --cached .claude/ ; git commit -m "Carpeta Eliminada" ; git push origin main


 ACTUALIZACION TAG[END] */

