// ─────────────────────────────────────────────
//  pexels.js  –  Pexels API helper
//  • Caché en localStorage (TTL: 7 días)
//  • Una imagen por producto, query por marca + modelo + "snowboard"
//  • Fallback a imagen placeholder si la API falla
// ─────────────────────────────────────────────

const PEXELS_API_KEY = 'nKCy1daQsxxxxF8FyBmV98i5e84pS59hlbiswlsVmFQr4JJxXMnOWjvT' 
const CACHE_PREFIX   = 'pexels_img_'
const CACHE_TTL_MS   = 7 * 24 * 60 * 60 * 1000  // 7 días
const FALLBACK_IMG   = 'https://placehold.co/600x400/5c7e8f/ffffff?text=Snowboard'

/**
 * Devuelve la URL de imagen para un producto.
 * Primero revisa el caché; si no existe o expiró, llama a la API.
 *
 * @param {string} marca
 * @param {string} modelo
 * @returns {Promise<string>} URL de la imagen
 */
export const obtenerImagenProducto = async (marca, modelo) => {
    const cacheKey = `${CACHE_PREFIX}${marca}_${modelo}`.toLowerCase().replace(/\s+/g, '_')

    // ── Revisar caché ──────────────────────────────────────────────
    try {
        const cached = localStorage.getItem(cacheKey)
        if (cached) {
            const { url, timestamp } = JSON.parse(cached)
            if (Date.now() - timestamp < CACHE_TTL_MS) {
                return url
            }
        }
    } catch {
        // caché corrupta, la ignoramos
    }

    // ── Llamada a la API ───────────────────────────────────────────
    try {
        const query    = encodeURIComponent(`${marca} ${modelo} snowboard`)
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${query}&per_page=1&orientation=landscape`,
            { headers: { Authorization: PEXELS_API_KEY } }
        )

        if (!response.ok) throw new Error(`Pexels API error: ${response.status}`)

        const data = await response.json()

        const url = data.photos?.[0]?.src?.large ?? FALLBACK_IMG

        // Guardar en caché
        localStorage.setItem(cacheKey, JSON.stringify({ url, timestamp: Date.now() }))

        return url

    } catch (error) {
        console.warn(`[Pexels] No se pudo obtener imagen para "${marca} ${modelo}":`, error.message)
        return FALLBACK_IMG
    }
}

/**
 * Carga las imágenes de todos los productos en paralelo
 * y actualiza el DOM cuando cada una resuelve.
 *
 * @param {Array<{id: number, marca: string, modelo: string}>} productos
 */
export const cargarImagenesProductos = async (productos) => {
    const promesas = productos.map(async ({ id, marca, modelo }) => {
        const imgEl = document.querySelector(`#producto${id} .card-img-top`)
        if (!imgEl) return

        // Skeleton mientras carga
        imgEl.style.opacity = '0.4'
        imgEl.style.transition = 'opacity 0.4s ease'

        const url = await obtenerImagenProducto(marca, modelo)

        imgEl.src = url
        imgEl.alt = `${marca} - ${modelo}`
        imgEl.onload  = () => { imgEl.style.opacity = '1' }
        imgEl.onerror = () => { imgEl.src = FALLBACK_IMG; imgEl.style.opacity = '1' }
    })

    await Promise.allSettled(promesas)
}
