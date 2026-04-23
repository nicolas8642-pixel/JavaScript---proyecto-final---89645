import { carrito, eliminarDelCarrito, calcularTotal } from "./main.js"

const renderCarrito = () => {
    const contenedor = document.getElementById('lista-carrito')
    contenedor.innerHTML = '' 

    carrito.forEach(item => {
        contenedor.innerHTML += `
            <div> 
                <p>${item.marca} ${item.modelo} - Cantidad: ${item.cantidad}</p>
                <p>$${item.precio * item.cantidad}</p>
                <button data-id='${item.id}' class='btn-eliminar'>Eliminar</button>
            </div>
        `
    })

    document.getElementById('total').textContent = `Total: $${calcularTotal()}`

    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            eliminarDelCarrito(Number(e.target.dataset.id))
            renderCarrito()

            Toastify({
            text: 'Se eliminó del carrito!',
            duration: 2000,
            gravity: 'top',
            position: 'left',
            close: true,
            style: {
                background: 'linear-gradient(to right, #a2a2a2, #d4dde2',
                color: '#000',
            }
        }).showToast();
        })
    })
}

renderCarrito()