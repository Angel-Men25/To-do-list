// VARIABLES
const formulario = document.querySelector('#formulario');
const mensajeError = document.querySelector('#mensaje-error');
const inputTarea = document.querySelector('.input__tarea');

const contenedorTareas = document.querySelector('#lista-tareas');

const total = document.querySelector('#total');
const completadas = document.querySelector('#completadas');

let tareas = [];

// EVENT LISTENERS
cargarEventListeners();

function cargarEventListeners() {
    formulario.addEventListener('submit', validarFormulario);

    document.addEventListener('DOMContentLoaded', () => {
        tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        agregarHTML();
    })

    contenedorTareas.addEventListener('click', eliminarTarea);
    
    contenedorTareas.addEventListener('click', completarTarea);
}


// FUNCIONES
function validarFormulario(e) {
    e.preventDefault();
    const tarea = document.querySelector('#tarea').value;
    if (!tarea.trim()) {
        mostrarMensajeError();
        return;
    }

    const tareaObj = {
        id: Date.now(),
        tarea,
        estado: false
    }

    tareas = [...tareas, tareaObj]
    agregarHTML();

    formulario.reset();
}

function agregarHTML() {

    const totalTareas = tareas.length;
    const tareasCompletadas = tareas.filter(tarea => tarea.estado !== false);

    limpiarHTML();

    tareas.forEach(tarea => {
        const tareaItem = document.createElement('div');
        tareaItem.classList.add('item-tarea');
        tareaItem.innerHTML = `
            ${ tarea.estado ? (
                `<p class="completada">${tarea.tarea}</p>`
            ) : (
                `<p>${tarea.tarea}</p>`
            ) }
            <div class="botones">
                <button class="eliminar" data-id="${tarea.id}">
                    X
                </button>
                <button class="completar" data-id="${tarea.id}">
                    ?
                </button>
            </div>
        `
        contenedorTareas.appendChild(tareaItem)
    });

    total.innerHTML = `Total tareas: ${totalTareas}`;
    completadas.innerHTML = `Completadas: ${tareasCompletadas.length}`;

    sincronizarLocalStorage();
}

function sincronizarLocalStorage() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
}

function eliminarTarea(e) {
    if (e.target.classList.contains('eliminar')) {
        const tareaID = parseInt(e.target.getAttribute('data-id'));
        tareas = tareas.filter(tarea => tarea.id !== tareaID);
        agregarHTML();
    }
}

function completarTarea(e) {
    if (e.target.classList.contains('completar')) {
        const tareaID = parseInt(e.target.getAttribute('data-id'));
        
        const newTask = tareas.map(tarea => {
            if (tarea.id === tareaID) {
                tarea.estado = !tarea.estado;
                return tarea;
            } else {
                return tarea;
            }
        })
        tareas = newTask;
        // console.log(tareas);
        agregarHTML();
    }
}

function limpiarHTML() {
    while (contenedorTareas.firstChild) {
        contenedorTareas.removeChild(contenedorTareas.firstChild)
    }
}

function mostrarMensajeError() {
    mensajeError.classList.add('mensaje-error-active');
    inputTarea.classList.add('input__tarea-error');
    setTimeout(() => {
        mensajeError.classList.remove('mensaje-error-active');
        inputTarea.classList.remove('input__tarea-error');
    }, 3000);
}