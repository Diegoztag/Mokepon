let dbMokepon = [
    {
        "nombre": "Maremira",
        "tipo": ["Agua"],
        "hp": 100,
        "ataques": {
            "Golpe gota": 5,
            "Marea": 15,
            "Lluvia": 50
        }
    },
    {
        "nombre": "Clorofendri",
        "tipo": ["Planta"],
        "hp": 100,
        "ataques": {
            "Golpe rama": 5,
            "Azote liana": 15,
            "Hojarasca": 50
        }
    },
    {
        "nombre": "Fireroar",
        "tipo": ["Fuego"],
        "hp": 100,
        "ataques": {
            "Golpe braza": 5,
            "Cola ceniza": 15,
            "Erupción": 50
        }
    }
]
let infoMokeponJugador = {};
let infoMokeponEnemigo = {};
let contadorHpJugador;
let contadorHpEnemigo;

function iniciarJuego() {
    let btnMascotaJugador = document.getElementById('btn-mascota');
    let divBatalla = document.getElementById('body-batalla');
    let btnReiniciar = document.getElementById('reiniciar')

    divBatalla.style.display = 'none';
    btnReiniciar.style.display= 'none';
    btnMascotaJugador.disabled = true;

    //addEventListener dinamico se crea a como se necesite
    document.addEventListener("click", function(event){
        if (event.target.className == "radio-mascota"){
            btnMascotaJugador.disabled = false;
        }
    }, false);

    btnMascotaJugador.addEventListener('click', seleccionMascotaJugador);
}

function seleccionMascotaJugador() {
    let inputMascotaJugador = document.querySelector('#seleccion-mascota input[type="radio"]:checked');
    let spanMascotaJugador = document.getElementById('batalla-nombre-jugador');

    spanMascotaJugador.textContent = capitalize(inputMascotaJugador.id);
    crearMensaje(`Seleccionaste a <strong>${spanMascotaJugador.textContent}</strong>`);
    //Extraemos del json de la info de los mokepones la info del mokepon seleccionado
    infoMokeponJugador = dbMokepon.find(elem => elem.nombre == spanMascotaJugador.textContent);

    escenaBatalla();
}

function escenaBatalla() {
    let divBatalla = document.getElementById('body-batalla');
    let sectionMascota = document.getElementById('seleccion-mascota');

    sectionMascota.style.display = 'none';
    divBatalla.style.display = 'block';

    mostrarBtnAtaquesJugador();
    seleccionMascotaEnemigo();
    iniciarBatalla();
}

function mostrarBtnAtaquesJugador() {
    let parentBtnAtaques = document.querySelector('#seccion-ataques');
    let btnAtaques = document.querySelector('#seccion-ataques button');
    //Elimina botones de ataque creados para crear los del nuevo mokepon seleccionado
    btnAtaques ? eliminarNodosDom(parentBtnAtaques) : false;

    //Se crea los botones dinamicamente dependiendo de los ataques que tenga el mokepon seleccionado
    for (const ataque in infoMokeponJugador.ataques) {
        let btnAtaque = document.createElement('button');
        btnAtaque.textContent = ataque;
        btnAtaque.className = "ataque-jugador";
        btnAtaque.id = ataque.replace(' ','-')
        parentBtnAtaques.appendChild(btnAtaque);
    }
}

function seleccionMascotaEnemigo() {
    let inputMascotaEnemigo = document.querySelectorAll('#seleccion-mascota input[type="radio"]');
    let spanMascotaEnemigo = document.getElementById('batalla-nombre-enemigo');

    spanMascotaEnemigo.textContent = capitalize(inputMascotaEnemigo[aleatorio(1,3) - 1].id);
    crearMensaje(`Tu enemigo seleccionó a <strong>${spanMascotaEnemigo.textContent}</strong>`);

    //Extraemos del json de mokepones la info del mokepon enemigo
    infoMokeponEnemigo = dbMokepon.find(elem => elem.nombre == spanMascotaEnemigo.textContent);
}

function iniciarBatalla() {
    let progressHpEnemigo = document.getElementById('hp-enemigo');
    let progressHpJugador = document.getElementById('hp-jugador');

    contadorHpEnemigo = infoMokeponEnemigo.hp;
    contadorHpJugador = infoMokeponJugador.hp;

    progressHpEnemigo.value = contadorHpEnemigo;
    progressHpJugador.value = contadorHpJugador;

    crearMensaje(`Inicia la batalla...`);

    ataqueJugador();
}

function ataqueJugador() {
    //addEventListener dinamico se crea a necesidad al presionar boton ataque
    document.addEventListener("click", function(event){
        if (event.target.className == "ataque-jugador"){
            let progressHpEnemigo = document.getElementById('hp-enemigo');
            let nombreAtaque = event.target.textContent;
            let btnAtaques = document.querySelector('#seccion-ataques').childNodes;
            let valorAtaque;

            //Se obtiene el valor del ataque que selecciono el jugador
            for (let ataque in infoMokeponJugador.ataques) {
                ataque == nombreAtaque ? valorAtaque = infoMokeponJugador.ataques[nombreAtaque] : false;
            }
            crearMensaje(`Usaste <strong>${nombreAtaque}</strong> contra el enemigo`);
            contadorHpEnemigo -= valorAtaque;

            //Si el contador disminuye de 0 saltara el mensaje de enemigo derrotado de lo contrario muestra el hp restante
            if(contadorHpEnemigo > 0) {
                progressHpEnemigo.value = contadorHpEnemigo;
            } else {
                crearMensaje(`<strong>El enemigo ha sido derrotado</strong>`);
                progressHpEnemigo.value = 0;
                //Al derrotar al enemigo se desactivan los botones de ataque
                btnAtaques.forEach(btn => {
                    btn.disabled = true;
                });
            }
            resultado(contadorHpEnemigo, contadorHpJugador);

            if (contadorHpEnemigo > 0){
                ataqueEnemigo();
            }
        }
    }, false);
}

function ataqueEnemigo() {
    let btnAtaques = document.querySelector('#seccion-ataques').childNodes;
    let progressHpJugador = document.getElementById('hp-jugador');
    let arrAtaques = [];
    let valoraleatorio = aleatorio(1,3) -1;

    //Se convierte el objeto de ataques a array para poder seleccionar su indice aleatoriamente
    for (var i in infoMokeponEnemigo.ataques) {
        arrAtaques.push(i);
    }

    for (var index in infoMokeponEnemigo.ataques) {
        if(index === arrAtaques[valoraleatorio]){
            crearMensaje(`Tu enemigo uso <strong>${index}</strong>`);
            contadorHpJugador -= infoMokeponEnemigo.ataques[index];
        }
    }

    //Si el contador disminuye de 0 saltara el mensaje de jugador derrotado de lo contrario muestra el hp restante
    if(contadorHpJugador > 0) {
        progressHpJugador.value = contadorHpJugador;
    } else {
        crearMensaje(`<strong>Tu mascota fue derrotada</strong>`);
        progressHpJugador.value = 0;
        //Al derrotar al enemigo se desactivan los botones de ataque
        btnAtaques.forEach(btn => {
            btn.disabled = true;
        });
    }
    resultado();
}

function resultado(){
    let btnReiniciar = document.getElementById('reiniciar');

    if(contadorHpEnemigo <= 0 ){
        crearMensaje(`Haz GANADO!! 🎉`);
        btnReiniciar.style.display = 'block';
    }

    if(contadorHpJugador <= 0) {
        crearMensaje(`Haz PERDIDO!! 💀`);
        btnReiniciar.style.display = 'block';
    }


    btnReiniciar.addEventListener('click', reiniciar);
}

function aleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function capitalize(string){
    return string[0].toUpperCase() + string.substring(1);
}

function eliminarNodosDom(parent){
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function crearMensaje(mensaje) {
    let mensajes = document.querySelector('#seccion-mensajes');
    let parrafo =  document.querySelector('#seccion-mensajes p');
    let pMensaje = document.createElement('p');
    
    document.querySelector('#seccion-mensajes p') ? mensajes.replaceChild(pMensaje, parrafo) :  mensajes.appendChild(pMensaje);
    pMensaje.innerHTML = mensaje;
}

function reiniciar() {
    location.reload();
}

iniciarJuego();