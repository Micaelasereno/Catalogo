let categorias = [];
let marcas = {};

const select = document.getElementById('categoriaSelect');
const container = document.getElementById('productosContainer');
const footerLogo = document.getElementById('logoMarca');
const defaultCategoria = "aros";

// 1. Cargar marcas
async function cargarMarcas() {
    const res = await fetch('marcas.json');
    marcas = await res.json();
}

// 2. Cargar categorías
async function cargarCategorias() {
    const res = await fetch('categorias.json');
    categorias = await res.json();

    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.nombre;
        select.appendChild(option);
    });

    select.value = defaultCategoria;
    cambiarCategoria(defaultCategoria);
}

async function cambiarCategoria(categoriaId) {
    const categoria = categorias.find(c => c.id === categoriaId);
    if (!categoria) return;

    aplicarEstilosMarca(marcas[categoria.marca]);
    await cargarProductos(categoriaId);
}

function aplicarEstilosMarca(marca) {
    document.body.style.backgroundColor = marca.colores.fondo;
    document.documentElement.style.setProperty('--color-primario', marca.colores.primario);
    document.documentElement.style.setProperty('--color-texto', marca.colores.texto);
    footerLogo.src = marca.logo;
    footerLogo.alt = marca.nombre;
}

async function cargarProductos(categoriaId) {
    container.innerHTML = '';
    try {
        const res = await fetch(`${categoriaId}/manifest.json`);
        const files = await res.json();

        files.forEach(file => {
            const div = document.createElement('div');
            div.classList.add('producto');

            const img = document.createElement('img');
            img.src = `${categoriaId}/${file}`;
            img.alt = file;

            const titulo = document.createElement('h3');
            titulo.textContent = file.replace(/\.[^/.]+$/, "");

            div.appendChild(img);
            div.appendChild(titulo);

            div.addEventListener('click', () => {
                const imagenURL = img.src;
                const mensaje = `Hola! Estoy interesado en este producto:\nNombre: ${titulo.textContent}\nImagen: ${imagenURL}`;
                const url = `https://wa.me/5493513595792?text=${encodeURIComponent(mensaje)}`;
                window.open(url, '_blank');
            });


            container.appendChild(div);
        });
    } catch (error) {
        container.innerHTML = "<p>Error al cargar los productos.</p>";
    }
}

select.addEventListener('change', () => cambiarCategoria(select.value));

// Inicialización
(async () => {
    await cargarMarcas();
    await cargarCategorias();
})();
