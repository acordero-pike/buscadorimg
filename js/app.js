
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');

let tipo = document.querySelector('#tp');

let paginaActual = 1;
let totalPaginas;
let iteradorSiguiente;

window.onload = () => {
    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit', validarFormulario);
    paginacionDiv.addEventListener('click', direccionPaginacion);
};

function validarFormulario(e) {
    e.preventDefault();
 
    const terminoBusqueda = document.querySelector('#termino').value;

    if(terminoBusqueda === '') {
        // mensaje de error
        mostrarAlerta('Agrega un término de búsqueda');
        return;
    }

    buscarImagenes();
}


// Muestra una alerta de error o correcto
function mostrarAlerta(mensaje) {
    const alerta = document.querySelector('.bg-red-100');
    if(!alerta) {
        const alerta = document.createElement('p');

        alerta.classList.add('bg-red-100', "border-red-400", "text-red-700", "px-4", "py-3", "rounded",  "max-w-lg", "mx-auto", "mt-6", "text-center" );
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}


// Busca las imagenes en una API
function buscarImagenes() {
    const terminoBusqueda = document.querySelector('#termino').value;
    let url;
    const key = '22402537-8e51f2da18455a13978f58dc3';
   
   if(tipo=="")
   {
    url = `https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&image_type=all&per_page=30&page=${paginaActual}`;
   }else{
     url = `https://pixabay.com/api/?key=${key}&q=${terminoBusqueda}&image_type=${tipo.value}&per_page=30&page=${paginaActual}`;
   }
   console.log(url)
    fetch(url) 
        .then(respuesta => respuesta.json())
        .then( resultado => {
            totalPaginas = calcularPaginas(resultado.totalHits);

            console.log(totalPaginas);
           
            mostrarPaginacion();
            mostrarImagenes(resultado.hits);
        });


}

function mostrarImagenes(imagenes ) {

    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }

    imagenes.forEach( imagen => {

        const { likes, views, previewURL, largeImageURL } = imagen;
        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 mb-4 p-3">
                <div class="bg">
                    <img class="w-full" src=${previewURL} alt={tags} />
                    <div class="p-4">
                        <p class="card-text"><table>  <tr> <td> <img  class="icon" src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/df291ea0-7211-49f2-b19c-58ba12e57f89/d5eerek-fb6a14ac-9a63-4251-b77e-7a6b41257d56.png/v1/fill/w_900,h_838,strp/icono_like__facebook__png_by_juula3014_d5eerek-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9ODM4IiwicGF0aCI6IlwvZlwvZGYyOTFlYTAtNzIxMS00OWYyLWIxOWMtNThiYTEyZTU3Zjg5XC9kNWVlcmVrLWZiNmExNGFjLTlhNjMtNDI1MS1iNzdlLTdhNmI0MTI1N2Q1Ni5wbmciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.K8Galho0WQuRPeQcmTq1FJczWC4H3lLZ1B9xJkQZcGo"> </td>  <td>${likes} Me Gusta  </td></tr> </table></p>
                        <p class="card-text"><table>  <tr> <td> <img  class="icon" src="https://image.flaticon.com/icons/png/512/648/648227.png"> </td>  <td>${views} vistas </td></tr> </table></p>
        
                        <a href=${largeImageURL} 
                        rel="noopener noreferrer" 
                        target="_blank" class="bg-blue-800 w-full p-1 block mt-5 rounded text-center font-bold uppercase hover:bg-blue-500 text-white">Ver Imagen</a>
                    </div>
                </div>
            </div>
            `;
    });


    if(!iteradorSiguiente) {
        console.log("mostrar");
        mostrarPaginacion();
    }
 
}

function mostrarPaginacion() {
    // recorrer el iterador
    iteradorSiguiente = crearPaginacion(totalPaginas);
    console.log("cre")
    paginacionDiv.innerHTML=''
    while( true ) {
        const { value, done } = iteradorSiguiente.next();

        if(done) return;

        // Crear botón de sig
        const botonSiguiente = document.createElement('a');
        botonSiguiente.href = "#";
        botonSiguiente.dataset.pagina = value;
        botonSiguiente.textContent = value;
        botonSiguiente.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'mx-auto', 'mb-10', 'font-bold', 'uppercase', 'rounded');
        paginacionDiv.appendChild(botonSiguiente);
    }
}

function calcularPaginas(total) {
    return parseInt( Math.ceil( total / 30 ));
}


// Crear el generador
function *crearPaginacion(total) {
   
    for( let i = 1; i <= total; i++) {
        yield i;
    }
}

function direccionPaginacion(e) {
    if(e.target.classList.contains('siguiente')) {

        paginaActual= Number( e.target.dataset.pagina);
        buscarImagenes();
        formulario.scrollIntoView();
    }
}