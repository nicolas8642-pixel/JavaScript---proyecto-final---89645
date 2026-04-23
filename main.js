export const tablasSnowboard = [
    { marca: 'Jones', modelo: 'Stratos', medida: 158, especialidad: 'Freeride', shape: 'Direccional', perfil: 'camber', precio: 500, id: 1 },
    { marca: 'Burton', modelo: 'Custom', medida: 155, especialidad: 'All-mountain', shape: 'Direccional', perfil: 'camber', precio: 750, id: 2 },
    { marca: 'Burton', modelo: 'Custom X', medida: 158, especialidad: 'Pista', shape: 'Direccional', perfil: 'Camber', precio: 800, id: 3 },
    { marca: 'Burton', modelo: 'Instigator', medida: 150, especialidad: 'Pista / Snowpark', shape: 'Twin-tip', perfil: 'Flat-Top', precio: 450, id: 4 },
    { marca: 'Nitro', modelo: 'Team', medida: 149, especialidad: 'Snowpark', shape: 'Twin-tip', perfil: 'Flying-V', precio: 450, id: 5 },
    { marca: 'Vio Snowboards', modelo: 'The Pineral', medida: 145, especialidad: 'All-mountain', shape: 'Twin-tip', perfil: 'Camber', precio: 250, id: 6 },
    { marca: 'Nitro', modelo: 'Ripper', medida: 145, especialidad: 'All-mountain', shape: 'Twin-tip', perfil: 'Camber', precio: 240, id: 7 },
    { marca: 'Capita', modelo: 'Dark Horse', medida: 156, especialidad: 'Snowpark', shape: 'Direccional', perfil: 'Camber', precio: 650, id: 8 },
    { marca: 'K2', modelo: 'Hypnotist', medida: 160, especialidad: 'All-mountain', shape: 'Twin-direccional', perfil: 'Camber', precio: 700, id: 9 }
]

export const carrito = JSON.parse(localStorage.getItem('carrito')) || []

const guardarCarrito = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

export const agregarAlCarrito = (id) => {
    const producto = tablasSnowboard.find((tabla) => tabla.id === id)
    if (!producto) return

    const enCarrito = carrito.find(t => t.id === id)

    if (enCarrito) {
        enCarrito.cantidad++
    } else {
        carrito.push({ ...producto, cantidad: 1 })
    }

    guardarCarrito()
}

export const eliminarDelCarrito = (id) => {
    const index = carrito.findIndex(t => t.id === id)
    if (index !== -1) carrito.splice(index, 1)
    guardarCarrito()
}

export const vaciarCarrito = () => {
    carrito.length = 0
    guardarCarrito()
}

export const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0)
}
