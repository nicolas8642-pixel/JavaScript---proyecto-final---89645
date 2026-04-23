import { tablasSnowboard, agregarAlCarrito, carrito} from './main.js'

let filtrosActivos = {}
let terminoBusqueda = ''  // estado de la búsqueda, independiente de los filtros dropdown


// ─────────────────────────────────────────────
//  FILTROS DROPDOWN
// ─────────────────────────────────────────────

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


// ─────────────────────────────────────────────
//  BÚSQUEDA
// ─────────────────────────────────────────────

const inputBusqueda = document.querySelector('.navbar input[type="search"]')
const btnBusqueda   = document.querySelector('.navbar .button-search')

// Tiempo real: filtra mientras el usuario escribe
inputBusqueda.addEventListener('input', (e) => {
    terminoBusqueda = e.target.value.trim().toLowerCase()
    aplicarFiltros()
})

// Al hacer click en "Search"
btnBusqueda.addEventListener('click', (e) => {
    e.preventDefault()
    terminoBusqueda = inputBusqueda.value.trim().toLowerCase()
    aplicarFiltros()
})

// Al presionar Enter dentro del input
inputBusqueda.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        terminoBusqueda = inputBusqueda.value.trim().toLowerCase()
        aplicarFiltros()
    }
})

// Si el usuario borra el input, muestra todo de nuevo (respetando filtros activos)
inputBusqueda.addEventListener('search', () => {
    terminoBusqueda = ''
    aplicarFiltros()
})



const aplicarFiltros = () => {
    tablasSnowboard.forEach(tabla => {
        const productoHTML = document.getElementById(`producto${tabla.id}`)
        if (!productoHTML) return

        let visible = true

        // ── Filtros dropdown ───────────────────────────────────────

        if (filtrosActivos.tipo) {
            if (!tabla.especialidad.toLowerCase().includes(filtrosActivos.tipo)) {
                visible = false
            }
        }

        if (filtrosActivos.perfil) {
            if (!tabla.perfil.toLowerCase().includes(filtrosActivos.perfil)) {
                visible = false
            }
        }

        if (filtrosActivos.shape) {
            if (!tabla.shape.toLowerCase().includes(filtrosActivos.shape)) {
                visible = false
            }
        }

        if (filtrosActivos.marca) {
            if (!tabla.marca.toLowerCase().includes(filtrosActivos.marca)) {
                visible = false
            }
        }

        if (filtrosActivos.medida) {
            if (filtrosActivos.medida === 'mayor' && tabla.medida <= 156) visible = false
            if (filtrosActivos.medida === 'menor' && tabla.medida  > 156) visible = false
        }

        // ── Búsqueda por texto 

        if (terminoBusqueda) {
            const coincide =
                tabla.marca.toLowerCase().includes(terminoBusqueda)  ||
                tabla.modelo.toLowerCase().includes(terminoBusqueda) ||
                String(tabla.precio).includes(terminoBusqueda)

            if (!coincide) visible = false
        }

        productoHTML.style.display = visible ? 'block' : 'none'
    })
}



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




document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-agregar')) {
        const id = Number(e.target.dataset.id)
        agregarAlCarrito(id)
        actualizarContadorCarrito()

        Toastify({
            text: 'Agregado al carrito!',
            duration: 2000,
            gravity: 'top',
            position: 'left',
            close: true,
            style: {
                background: 'linear-gradient(to right, #a2a2a2, #d4dde2',
                color: '#000',
            }
        }).showToast()
    }
})

const actualizarContadorCarrito = () => {
    const contador = document.getElementById('contador-carrito')
    if (contador) {
        const total = carrito.reduce((acc, item) => acc + item.cantidad, 0)
        contador.textContent = total
    }
}



document.addEventListener('click', (e) => {
    if (e.target.classList.contains('info-imagen')) {
        Swal.fire({})
    }
})
