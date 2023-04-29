const dbMokepon = [
    {
        "nombre": "Maremira",
        "tipo": ["Agua"],
        "hp": 100,
        "ataques": {
            "Golpe gota": 5,
            "Embestida": 10,
            "Marea": 15,
            "Lluvia": 50
        },
        "imagenes": {
            "normal": "./assets/img/agua.png",
            "batalla": "./assets/img/battle-agua.png",
        }
    },
    {
        "nombre": "Fireroar",
        "tipo": ["Fuego"],
        "hp": 100,
        "ataques": {
            "Golpe braza": 5,
            "Cola ceniza": 15,
            "Erupción": 50,
            "Mordida": 10
        },
        "imagenes": {
            "normal": "./assets/img/fuego.png",
            "batalla": "./assets/img/battle-fuego.png",
        }
    },
    {
        "nombre": "Clorofendri",
        "tipo": ["Planta"],
        "hp": 100,
        "ataques": {
            "Golpe rama": 5,
            "Azote liana": 15,
            "Hojarasca": 50,
            "Bofetada": 10
        },
        "imagenes": {
            "normal": "./assets/img/planta.png",
            "batalla": "./assets/img/battle-planta.png",
        }
    }
]

//Secciones app
const sectionMascotas = document.getElementById('mascotas');
const sectionBatalla = document.getElementById('batalla');
const sectionBatallaUI = document.getElementById('batalla-UI');
const sectionReiniciar = document.getElementById('reiniciar');
const sectionVerMapa = document.getElementById('ver-mapa')

//Contenedores
const divListaMascotas = document.getElementById('lista-mascotas');
const divAtaques = document.getElementById('ataques');
const divMensajes = document.getElementById('mensajes');

//Botones
const btnMascotaJugador = document.getElementById('btn-mascota');

//Canvas
const mapa = document.getElementById('mapa');

//Progress
const progressHpEnemigo = document.getElementById('hp-enemigo');
const progressHpJugador = document.getElementById('hp-jugador');

//Variables
let infoMokeponJugador = {};
let infoMokeponEnemigo = {};
let lienzo = mapa.getContext('2d');
let contadorHpJugador;
let contadorHpEnemigo;

class Mokepon {
    constructor(nombre, tipo, hp, ataques, imagen) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.hp = hp;
        this.ataques = ataques;
        this.x = 20;
        this.y = 30;
        this.ancho = 80;
        this.alto = 80;
        this.img = new Image();
        this.img.src = imagen;
    }
}

function iniciarJuego() {
    sectionVerMapa.style.display = 'none';
    sectionBatalla.style.display = 'none';
    sectionReiniciar.style.display= 'none';
    btnMascotaJugador.disabled = true;

    crearMascotasSeleccion();

    document.onclick = function(event) {
        if (event.target.className == "radio-mascota") {
            btnMascotaJugador.disabled = false;
        }
    };

    btnMascotaJugador.addEventListener('click', crearMapa);
}

function crearMascotasSeleccion() {
    let htmlMascota;

    dbMokepon.forEach(mascota => {
        htmlMascota = `                  
        <label class="label-mascota" for="${mascota.nombre}">
            <img src="${mascota.imagenes.normal}" alt="${mascota.nombre}">
            <span class="nombre-mascota">${mascota.nombre}</span>
            <span class="badge ${mascota.tipo}">${mascota.tipo}</span>
            <input type="radio" class="radio-mascota" name="mascota" id="${mascota.nombre}">
        </label>`

        divListaMascotas.insertAdjacentHTML('beforeend', htmlMascota);
    });

}

function crearMapa() {
    sectionMascotas.style.display = 'none';
    sectionVerMapa.style.display = 'flex';

    obtenerDatosMascotas();
}

function obtenerDatosMascotas() {
    const inputMascotaJugador = document.querySelector('#mascotas input[type="radio"]:checked');
    const inputMascotaEnemigo = document.querySelectorAll('#mascotas input[type="radio"]');

    //Extraemos del json de la info de los mokepones la info del mokepon seleccionado
    infoMokeponJugador = dbMokepon.find((elem) => elem.nombre == inputMascotaJugador.id);

    mascotaPlayerData = new Mokepon(
        infoMokeponJugador.nombre,
        infoMokeponJugador.tipo,
        infoMokeponJugador.hp,
        infoMokeponJugador.ataques,
        infoMokeponJugador.imagen);

    console.log(mascotaPlayerData);

    //Extraemos del json de mokepones la info del mokepon enemigo
    const randomIndex = aleatorio(0, inputMascotaEnemigo.length - 1);
    infoMokeponEnemigo = dbMokepon.find((elem) => elem.nombre == inputMascotaEnemigo[randomIndex].id);
}

function dibujarMascota() {
    lienzo.drawImage(imagenMascota, 20, 40, 100, 100);
}

function moverMascota() {

}

// SECCION DE BATALLA
function iniciarBatalla() {
    sectionVerMapa.style.display = 'none';
    sectionBatalla.style.display = 'block';

    crearEscenaBatalla();
}

function crearEscenaBatalla() {
    let uiPlayers = `
        <div id="info-enemigo" class="info-mascota">
            <span>${infoMokeponEnemigo.nombre}</span>
            <progress max="100" value="" id="hp-enemigo"></progress>
        </div>

        <img id="img-enemigo" src="${infoMokeponEnemigo.imagenes.normal}" alt="">

        <img id="img-enemigo" src="${infoMokeponJugador.imagenes.batalla}" alt="">

        <div id="info-enemigo" class="info-mascota">
            <span>${infoMokeponJugador.nombre}</span>
            <progress max="100" value="" id="hp-jugador"></progress>
        </div>
    `;

    sectionBatallaUI.innerHTML = uiPlayers;

    contadorHpEnemigo = infoMokeponEnemigo.hp;
    contadorHpJugador = infoMokeponJugador.hp;
    
    document.getElementById('hp-enemigo').value = contadorHpEnemigo;
    document.getElementById('hp-jugador').value = contadorHpJugador;
    
    crearBtnAtaquesJugador();

    crearMensaje(`Inicia la batalla...`);
    crearMensaje(`Seleccionaste a <strong>${infoMokeponJugador.nombre}</strong>`);
    crearMensaje(`Tu enemigo seleccionó a <strong>${infoMokeponEnemigo.nombre}</strong>`);

    ataqueJugador();
}

function crearBtnAtaquesJugador() {
    //Se crea los botones dinamicamente dependiendo de los ataques que tenga el mokepon seleccionado
    for (const ataque in infoMokeponJugador.ataques) {
        let htmlAtaque = `<button class="ataque-jugador" id="${ataque}">${ataque}</button>`;

        divAtaques.innerHTML += htmlAtaque;
    }
}

function ataqueJugador() {
    const progressHpEnemigo = document.getElementById('hp-enemigo');
    //addEventListener dinamico se crea a necesidad al presionar boton ataque
    document.addEventListener("click", function(event){
        if (event.target.className == "ataque-jugador"){
            let nombreAtaque = event.target.textContent;
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
                ataqueEnemigo();
            } else {
                progressHpEnemigo.value = 0;
                crearMensaje(`<strong>El enemigo ha sido derrotado</strong>`);
                resultado();
                //Al derrotar al enemigo se desactivan los botones de ataque
                divAtaques.childNodes.forEach(btn => {
                    btn.disabled = true;
                });
            }
        }
    }, false);
}

function ataqueEnemigo() {
    const progressHpJugador = document.getElementById('hp-jugador');
    let arrAtaques = [];
    let valoraleatorio = aleatorio(1,3) -1;

    // Se convierte el objeto de ataques a array para poder seleccionar su indice aleatoriamente
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
        progressHpJugador.value = 0;
        crearMensaje(`<strong>Tu mascota fue derrotada</strong>`);
        resultado();
        //Al derrotar al enemigo se desactivan los botones de ataque
        divAtaques.childNodes.forEach(btn => {
            btn.disabled = true;
        });
    }
}

function resultado(){
    if(contadorHpEnemigo <= 0 ){
        crearMensaje(`Haz GANADO!! 🎉`);
        sectionReiniciar.style.display = 'block';
    }

    if(contadorHpJugador <= 0) {
        crearMensaje(`Haz PERDIDO!! 💀`);
        sectionReiniciar.style.display = 'block';
    }

    sectionReiniciar.addEventListener('click', reiniciar);
}

function aleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function crearMensaje(string) {
    divMensajes.innerHTML = `<p>${string}</p>`;
}

function reiniciar() {
    location.reload();
}

iniciarJuego();