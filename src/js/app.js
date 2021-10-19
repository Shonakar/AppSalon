let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function () {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    //Resalta el tab seleccionaddo
    mostrarSeccion();

    //Oculta o muestra el div seleccionado
    cambiarSeccion();

    //paginacion
    paginaAnterior();
    paginaSiguiente();

    //comprobar Paginacion
    botonesPaginador();

    //muestra resumen o mensaje de error - validacion
    mostrarResumen();

    //almacena el nombre de la cita en el obj
    nombreCita();

    //almacenar fecha
    fechaCita();

    //deshabilitar dias pasados
    deshabilitarFechaAnt();

    //almacena la hora
    horaCita();
}

function mostrarSeccion() {
    //eliminar mostrar seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');

    if (seccionAnterior) {
        seccionAnterior.classList.remove('mostrar-seccion'); //si la clase anterior existe, elimina mostrar
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    const tabAnterior = document.querySelector('.tabs .actual');
    //eliminar tab anterior
    if (tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
    //resaltar el tab
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso); //guardamos el tab que presionamos

            //llamar la seccion de mostrar
            mostrarSeccion();

            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const {
            servicios
        } = db;

        //generar HTML
        servicios.forEach(servicio => {
            const {
                id,
                nombre,
                precio
            } = servicio;

            //DOM Scripting

            //Nombre
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            //Precio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');

            //Div contenedor
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //seleccionar servicio
            servicioDiv.onclick = seleccionarServicio;


            //agregar datos al Div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            //colocar en HTML
            document.querySelector('#servicios').appendChild(servicioDiv);

        });
    } catch (error) {
        console.log(error);
    }
}

function seleccionarServicio(e) {
    let elemento;

    if (e.target.tagName === 'P') {
        elemento = e.target.parentElement; //forzar que el elemento del click sea DIV
    } else {
        elemento = e.target;
    }
    if (elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');
        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent, //Texto del primer elemento del div que agarramos
            precio: elemento.firstElementChild.nextElementSibling.textContent //nextElementSibling (El siguiente?)
        }

        agregarServicio(servicioObj);
    }

}

function eliminarServicio(idS) {
    const {
        servicios
    } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== idS); //todos los servicios que sean dif al id
    //creo que elimina reemplazando sin el que tenga el id que pasamos
    console.log(cita);
}

function agregarServicio(objS) {
    const {
        servicios
    } = cita;
    cita.servicios = [...servicios, objS]; //le agrega el servicio al arreglo de servicios
    // ... son para agregar a lo que ya tiene (Como un push)
    console.log(cita);

}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () => {
        pagina--;
        botonesPaginador();
        console.log(pagina);
    });
}

function paginaSiguiente() {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () => {
        pagina++;
        botonesPaginador();
        console.log(pagina);
    });
}


function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSiguiente = document.querySelector('#siguiente');

    if (pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); // volver a cargar resumen para verificar datos

    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar')
    }
    mostrarSeccion(); //cambia la seccion
}

function mostrarResumen() {
    //destructuring
    const {
        nombre,
        fecha,
        hora,
        servicios
    } = cita;

    //seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    //Limpiar html previo
    while (resumenDiv.firstChild) { //mientras tenga html
        resumenDiv.removeChild(resumenDiv.firstChild); //lo borramos
    }

    //validacion

    if (Object.values(cita).includes('')) { //si alguno esta vacio
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de Servicios, hora, fecha o nombre';

        noServicios.classList.add('invalidar-cita');
        //agregar a resumen
        resumenDiv.appendChild(noServicios);

        return;
    }

    //mostrar el resumen

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen Cita';



    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span>${nombre}`; //agrega el html

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span>${fecha}`; //agrega el html

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span>${hora}`; //agrega el html

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    // Iterar sobre el arreglo de servicios
    servicios.forEach(servicio => { //accedo sobre el arreglo de servicio

        const {
            nombre,
            precio
        } = servicio;
        
        const contenedorServicio = document.createElement('DIV'); //cada servicio en un div
        contenedorServicio.classList.add('contenedor-servicio'); //clase para darle estilo

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');//cortanmo el signo dolar
        cantidad += parseInt(totalServicio[1].trim());//sacamos el espacio del trim, pasamo a ent, y sumamos
        

        // Colocar texto y precio en el div
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);

    });


    resumenDiv.appendChild(headingCita)
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);
    
    const cantPagar = document.createElement('P');
    cantPagar.classList.add('total');
    cantPagar.innerHTML = `<span>Total a pagar:</span> $ ${cantidad}`;

    resumenDiv.appendChild(cantPagar);
}

function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    //se puede usar change en vez de input, actualiza cada vez que salimos del input
    nombreInput.addEventListener('input', event => { //cada vez que escribimos se va ejecutando
        const nombreTexto = event.target.value.trim(); //trim elimina espacios blancos al inicio y al final
        //console.log(nombreTexto);

        if (nombreTexto === '' || nombreTexto.length < 4) {
            mostrarAlerta('Nombre no valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if (alerta) { //si tenemos una alerta cuando pasa a estar bien, borramos la alerta
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo) {

    //Si hay una alerta, no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if (alertaPrevia) {
        return; // detengo la ejecucion del codigo, tambien la podriamos eliminar pero la crea y elimina a cada rato
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error') {
        alerta.classList.add('error');
    }

    //insertar en el form
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //eliminar alerta
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', even => {

        const dia = new Date(even.target.value).getUTCDay(); //UTCDay retorna los dia del 0 al 6, empieza en domigo

        if ([0, 6].includes(dia)) { //si seleccionamos un domigo o sabado (retorna un falso)
            even.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semanas no permitido', 'error');
        } else {
            cita.fecha = fechaInput.value;
        }
    });

}

function deshabilitarFechaAnt() {
    const inputFecha = document.querySelector('#fecha');
    const fechaActual = new Date();


    //queremos la fecha en el formato AAAA-MM-DD
    const year = fechaActual.getFullYear();
    const month = fechaActual.getMonth() + 1; //meses van de 0 a 11
    const day = fechaActual.getDate(); //para que no te hagan reservaciones para hoy ARREGLAR

    const fechaDes = `${year}-${month < 10 ? `0${month}` : month}-${day}`;
    //le hacemos un if adentro para agregarle el 0 y los meses sean ej 01, 02, tiene que tener 2 cifras
    inputFecha.min = fechaDes;
    console.log(fechaDes);
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {

        const horaCita = e.target.value;
        const hora = horaCita.split(':'); //split divide la cadena en un arreglo en donde le decimos

        if (hora[0] < 10 || hora[0] > 18) { //si no esta en el intervalo que decimos
            mostrarAlerta('Estamos disponible de 10 a 18', 'error'); //mostramos error que no esta abierto a esa hora
            setTimeout(() => {
                inputHora.value = ''; //reseteamos la hora para que no se guarde
            }, 1000);
        } else {
            cita.hora = horaCita;

            console.log(cita);
        }
    });
}