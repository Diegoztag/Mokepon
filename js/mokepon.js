function iniciarJuego() {
    let btnMascotaJugador = document.getElementById('btn_mascota');
    btnMascotaJugador.disabled = true;

    document.addEventListener("click", function(event){
        if (event.target.className == "sel-mascota"){
            btnMascotaJugador.disabled = false;
        }
    }, false);

    btnMascotaJugador.addEventListener('click', seleccionMascotaJugador);
}

function seleccionMascotaJugador(){
    let inputMascotaJugador = document.querySelector('#seleccion_mascota input[type="radio"]:checked');
    let spanMascotaJugador = document.getElementById('mascota-jugador');

    spanMascotaJugador.innerHTML = capitalize(inputMascotaJugador.id);

    seleccionMascotaEnemigo();
}

function seleccionMascotaEnemigo(){
    let inputMascotaEnemigo = document.querySelectorAll('#seleccion_mascota input[type="radio"]');
    let spanMascotaEnemigo = document.getElementById('mascota-enemigo');

    spanMascotaEnemigo.innerHTML = capitalize(inputMascotaEnemigo[aleatorio(1,6) - 1].id);
}

function aleatorio(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function capitalize(string){
    return string[0].toUpperCase() + string.substring(1);
}

iniciarJuego();
