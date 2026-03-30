// INFORMACIÓN DEL APP 
export let id = 'winwii'
export let app = 'Winwii'
export let lanzamiento = 2026;
export let ipdev = import.meta.env.VITE_DEV;
export let autor = '@wilder.taype';
export let link = 'https://wtaype.github.io/';
export let version = 'v16';

/** Actualizar main luego esto, pero si es mucho, solo esto. (1)
git tag v16 -m "Version v16" ; git push origin v16 

//  ACTUALIZACIÓN PRINCIPAL ONE DEV [START] (2)
git add . ; git commit -m "Actualizacion Principal v16.10.10" ; git push origin main

// En caso de emergencia, para actualizar el Tag existente. (3)
git tag -d v16 ; git tag v16 -m "Version v16 actualizada" ; git push origin v16 --force
 ACTUALIZACION TAG[END]  */ 

