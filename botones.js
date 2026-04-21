import { tablasSnowboard } from './main.js'

let filtrosActivos = {}

// Escucha clicks en los items de filtro (los que tienen data-filtro)
document.querySelectorAll('.dropdown-item[data-filtro]').forEach(boton => {
    boton.addEventListener('click', (e) => {
        e.preventDefault()

        const tipoFiltro = e.target.dataset.filtro
        const valor = e.target.dataset.valor

        if (!tipoFiltro || !valor) return

        filtrosActivos[tipoFiltro] = valor

        actualizarBadgesFiltros()
        aplicarFiltros()
    })
})

// Botón para limpiar todos los filtros
document.getElementById('btn-limpiar-filtros').addEventListener('click', (e) => {
    e.preventDefault()
    filtrosActivos = {}
    actualizarBadgesFiltros()
    aplicarFiltros()
})

const aplicarFiltros = () => {
    tablasSnowboard.forEach(tabla => {
        const productoHTML = document.getElementById(`producto${tabla.id}`)
        if (!productoHTML) return

        let visible = true

        // Filtro tipo (especialidad) — puede contener "/" como "Pista / Snowpark"
        if (filtrosActivos.tipo) {
            const especialidadLower = tabla.especialidad.toLowerCase()
            if (!especialidadLower.includes(filtrosActivos.tipo)) {
                visible = false
            }
        }

        // Filtro perfil
        if (filtrosActivos.perfil) {
            if (!tabla.perfil.toLowerCase().includes(filtrosActivos.perfil)) {
                visible = false
            }
        }

        // Filtro shape
        if (filtrosActivos.shape) {
            if (!tabla.shape.toLowerCase().includes(filtrosActivos.shape)) {
                visible = false
            }
        }

        // Filtro marca
        if (filtrosActivos.marca) {
            if (!tabla.marca.toLowerCase().includes(filtrosActivos.marca)) {
                visible = false
            }
        }

        // Filtro medida — comparación numérica
        if (filtrosActivos.medida) {
            if (filtrosActivos.medida === 'mayor' && tabla.medida <= 156) {
                visible = false
            }
            if (filtrosActivos.medida === 'menor' && tabla.medida > 156) {
                visible = false
            }
        }

        productoHTML.style.display = visible ? 'block' : 'none'
    })
}

// Muestra badges con los filtros activos encima de los productos
const actualizarBadgesFiltros = () => {
    const contenedor = document.getElementById('filtros-activos')
    if (!contenedor) return

    const etiquetas = {
        tipo: 'Tipo',
        perfil: 'Perfil',
        shape: 'Shape',
        marca: 'Marca',
        medida: 'Medida'
    }

    const medidaLabel = { mayor: '>156cm', menor: '≤156cm' }

    contenedor.innerHTML = ''

    Object.entries(filtrosActivos).forEach(([clave, valor]) => {
        const badge = document.createElement('span')
        badge.className = 'badge bg-secondary me-2 mb-2 p-2'
        const valorMostrado = clave === 'medida' ? medidaLabel[valor] : valor
        badge.textContent = `${etiquetas[clave]}: ${valorMostrado}`

        // Click en badge quita ese filtro
        badge.style.cursor = 'pointer'
        badge.title = 'Clic para quitar este filtro'
        badge.addEventListener('click', () => {
            delete filtrosActivos[clave]
            actualizarBadgesFiltros()
            aplicarFiltros()
        })

        contenedor.appendChild(badge)
    })
}
