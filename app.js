import { tablasSnowboard } from './main.js'
import { cargarImagenesProductos } from './pexels.js'
import './botones.js'

// Carga las imágenes desde Pexels en cuanto el DOM está listo.
// Las imágenes locales del HTML sirven como placeholder hasta que resuelve cada Promise.
document.addEventListener('DOMContentLoaded', () => {
    cargarImagenesProductos(tablasSnowboard)
})
