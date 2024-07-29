// Variables del juego
const marco = document.getElementById('marco'); // Obtener el contenedor del juego (marco)
const puntuacionElemento = document.getElementById('puntuacion'); // Elemento HTML para la puntuación
const timon = document.getElementById('timón'); // Obtener el timón
const btnIniciar = document.getElementById('btnIniciar');
const btnPausar = document.getElementById('pausarBtn');
const btnReanudar = document.getElementById('reanudarBtn');
    let avionX = 50; // posición inicial horizontal del avión
    let avionY = 50; // posición inicial vertical del avión
    const AVION_WIDTH = 80; // ancho del avión principal (ajustado)
    const AVION_HEIGHT = 40; // alto del avión principal (ajustado)
    let avionesRivales = []; // Array para almacenar aviones rivales
    let balas = []; // Array para almacenar balas disparadas
    let velocidadAviones = 1; // Velocidad normal de los aviones rivales
    const velocidadAtaque = 0.9; // Velocidad reducida durante el ataque
    let numAvionesRivales = 4; // Número inicial de aviones rivales
    let puntuacion = 0; // Puntuación inicial
    let juegoActivo = false; // Bandera para controlar si el juego está activo
    let juegoPausado = false; // Bandera para controlar si el juego está pausado
    // Variables para el movimiento del timón
let movimientoVerticalTimon = 0;
    
    // Obtener el avión del jugador
    const avion = document.getElementById('avion');
    avion.style.left = `${avionX}px`;
    avion.style.top = `${avionY}px`;

    // Función para crear aviones rivales de forma aleatoria
    function crearAvionRival() {
        const avionRival = document.createElement('img');
        avionRival.src = 'avionrival.png'; // Imagen del avión rival
        avionRival.className = 'avion-rival';

        // Calcular una posición aleatoria lejos del avión principal
        let posicionX, posicionY;
        const margen = 100; // Margen mínimo desde el avión principal

        // Determinar el lado en el que aparecerá el avión rival
        const lado = Math.random() > 0.5 ? 'izquierda' : 'derecha';
        if (lado === 'izquierda') {
            posicionX = -AVION_WIDTH;
            posicionY = Math.random() * marco.clientHeight;
        } else {
            posicionX = marco.clientWidth;
            posicionY = Math.random() * marco.clientHeight;
        }

        avionRival.style.left = `${posicionX}px`;
        avionRival.style.top = `${posicionY}px`;

        // Agregar el avión rival al marco y al array de aviones rivales
        marco.appendChild(avionRival);
        avionesRivales.push(avionRival);
    }

    // Función para crear varios aviones rivales al inicio
    function crearAvionesRivales() {
        for (let i = 0; i < numAvionesRivales; i++) {
            crearAvionRival();
        }
    }


    crearAvionesRivales(); // Llamar a la función para crear aviones rivales al cargar la página

    // Función para mover los aviones rivales hacia el avión principal
    function moverAvionesRivales() {
        avionesRivales.forEach(avionRival => {
            if (juegoActivo && !juegoPausado) {
                // Obtener la posición actual del avión principal
                const avionPrincipalRect = avion.getBoundingClientRect();
                const avionPrincipalX = avionPrincipalRect.left + avionPrincipalRect.width / 2;
                const avionPrincipalY = avionPrincipalRect.top + avionPrincipalRect.height / 2;

                // Obtener la posición actual del avión rival
                const avionRivalRect = avionRival.getBoundingClientRect();
                const avionRivalX = avionRivalRect.left + avionRivalRect.width / 2;
                const avionRivalY = avionRivalRect.top + avionRivalRect.height / 2;

                // Calcular la dirección hacia el avión principal
                const deltaX = avionPrincipalX - avionRivalX;
                const deltaY = avionPrincipalY - avionRivalY;
                const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const dirX = deltaX / distancia;
                const dirY = deltaY / distancia;

                // Calcular la nueva posición del avión rival
                let nuevaPosX = avionRival.offsetLeft + dirX * velocidadAviones;
                let nuevaPosY = avionRival.offsetTop + dirY * velocidadAviones;

                // Verificar si el avión rival ya está muy cerca del avión principal
                if (distancia < 5) {
                    nuevaPosX = avionPrincipalX - avionRivalRect.width / 2;
                    nuevaPosY = avionPrincipalY - avionRivalRect.height / 2;
                }

                // Mover el avión rival hacia el avión principal
                avionRival.style.left = `${nuevaPosX}px`;
                avionRival.style.top = `${nuevaPosY}px`;

                // Verificar colisión con el avión principal
                if (colision(avionRival, avion)) {
                    // Reducir la velocidad al chocar
                    velocidadAviones = 0.5; // Ejemplo: velocidad reducida al chocar
                    setTimeout(() => {
                        velocidadAviones = 0.5; // Volver a la velocidad normal después de un tiempo (ejemplo)
                    }, 1000); // Ejemplo: 1000 milisegundos (1 segundo)

                    finDelJuego();
                }
            }
        });
    }


    // Función para disparar una bala en la dirección especificada
    function dispararBala(direccion) {
        const bala = document.createElement('div');
        bala.className = 'bala';

        // Determinar la posición inicial de la bala según la dirección
        switch (direccion) {
            case 'arriba':
                bala.style.left = `${avion.offsetLeft + AVION_WIDTH / 2}px`;
                bala.style.top = `${avion.offsetTop}px`;
                bala.movimientoVerticalArriba = 5; // Velocidad hacia arriba
                break;
            case 'abajo':
                bala.style.left = `${avion.offsetLeft + AVION_WIDTH / 2}px`;
                bala.style.top = `${avion.offsetTop + AVION_HEIGHT}px`;
                bala.movimientoVertical = 5; // Velocidad hacia abajo
                break;
            case 'adelante':
            default:
                bala.style.left = `${avion.offsetLeft + AVION_WIDTH}px`;
                bala.style.top = `${avion.offsetTop + AVION_HEIGHT / 2}px`;
                bala.movimientoHorizontal = 5; // Velocidad hacia adelante
                break;
        }

        marco.appendChild(bala);
        balas.push(bala);
    }
    // Obtener los botones por sus IDs
    const btnA = document.getElementById('btnA');
    const btnS = document.getElementById('btnS');
    const btnW = document.getElementById('btnW');

    // Función para parpadear el botón dado su ID
    function parpadearBoton(id) {
    const boton = document.getElementById(id);
    if (boton) {
        boton.style.opacity = '0.5'; // Reducir la opacidad
        setTimeout(() => {
        boton.style.opacity = '1'; // Restaurar la opacidad original después de 200ms
        }, 200);
    }
    }

    // Evento para detectar la pulsación de teclas en todo el documento
    document.addEventListener('keydown', event => {
    switch (event.key) {
        case 'a':
        parpadearBoton('btnA'); // Llamar a la función de parpadeo para el botón 'A'
        break;
        case 's':
        parpadearBoton('btnS'); // Llamar a la función de parpadeo para el botón 'S'
        break;
        case 'w':
        parpadearBoton('btnW'); // Llamar a la función de parpadeo para el botón 'W'
        break;
        default:
        break;
    }
    });


    // Función para mover las balas disparadas
    function moverBalas() {
        balas.forEach(bala => {
            if (juegoActivo && !juegoPausado) {
                // Mover la bala hacia adelante si se disparó con la tecla 'A'
                if (bala.movimientoHorizontal) {
                    bala.style.left = `${parseFloat(bala.style.left) + bala.movimientoHorizontal}px`;
                }

                // Mover la bala hacia abajo si se disparó con la tecla 'S'
                if (bala.movimientoVertical) {
                    bala.style.top = `${parseFloat(bala.style.top) + bala.movimientoVertical}px`;
                }

                // Mover la bala hacia arriba si se disparó con la tecla 'W'
                if (bala.movimientoVerticalArriba) {
                    bala.style.top = `${parseFloat(bala.style.top) - bala.movimientoVerticalArriba}px`;
                }

                // Eliminar la bala si sale del marco del juego
                if (parseFloat(bala.style.left) > marco.clientWidth ||
                    parseFloat(bala.style.top) > marco.clientHeight ||
                    parseFloat(bala.style.top) < 0) {
                    bala.remove();
                    balas = balas.filter(b => b !== bala); // Eliminar la bala del array de balas
                }
            }
        });
    }

    // Función para verificar colisiones entre el avión principal y los aviones rivales
    function verificarColisiones() {
        avionesRivales.forEach(avionRival => {
            balas.forEach(bala => {
                if (colision(avionRival, bala)) {
                    // Eliminar la bala y el avión rival del DOM
                    bala.remove();
                    balas = balas.filter(b => b !== bala);

                    avionRival.remove();
                    avionesRivales = avionesRivales.filter(a => a !== avionRival);

                    // Incrementar la puntuación
                    puntuacion++;
                    puntuacionElemento.textContent = `Puntuación: ${puntuacion}`;

                    // Crear un nuevo avión rival para reemplazar el eliminado
                    crearAvionRival();
                }
            });
        });
    }
    // Función para verificar colisión mejorada considerando la forma del avión
    function colision(elemento1, elemento2) {
        const rect1 = elemento1.getBoundingClientRect();
        const rect2 = elemento2.getBoundingClientRect();

        // Coordenadas de los bordes de los aviones
        const left1 = rect1.left + 20; // Ajuste para los bordes izquierdos de los aviones
        const right1 = rect1.right - 20; // Ajuste para los bordes derechos de los aviones
        const top1 = rect1.top + 10; // Ajuste para los bordes superiores de los aviones
        const bottom1 = rect1.bottom - 10; // Ajuste para los bordes inferiores de los aviones

        const left2 = rect2.left;
        const right2 = rect2.right;
        const top2 = rect2.top;
        const bottom2 = rect2.bottom;

        // Verificar colisión teniendo en cuenta las áreas de los aviones
        return !(right1 < left2 ||
            left1 > right2 ||
            bottom1 < top2 ||
            top1 > bottom2);
    }


    // Función para terminar el juego
    function finDelJuego() {
        juegoActivo = false;
        alert(`¡¡Game Over!: ${puntuacion}`);
        location.reload(); // Recargar la página para reiniciar el juego
    }
  // Función para iniciar el juego
function iniciarJuego() {
    if (juegoActivo) return; // Prevenir múltiples inicios
 juegoActivo = true;
    puntuacion = 0;
    puntuacionElemento.textContent = `Puntuación: ${puntuacion}`;
    velocidadAviones = 1; // Reiniciar la velocidad de los aviones rivales
 // Ocultar el botón de iniciar
 btnIniciar.style.display = 'none';
    // Limpiar aviones rivales y balas existentes
    avionesRivales.forEach(avionRival => avionRival.remove());
    avionesRivales = [];
    balas.forEach(bala => bala.remove());
    balas = [];

    // Crear aviones rivales iniciales
    crearAvionesRivales();

    // Iniciar el ciclo de actualización del juego
    requestAnimationFrame(actualizarJuego);
}

// Función para actualizar el juego en cada frame
function actualizarJuego() {
    if (juegoActivo && !juegoPausado) {
        moverAvionesRivales();
        moverBalas();
        verificarColisiones();

        // Continuar el ciclo de actualización
        requestAnimationFrame(actualizarJuego);
    }
}

// Función para pausar el juego
function pausarJuego() {
    if (juegoActivo && !juegoPausado) {
        juegoPausado = true;
        btnPausar.style.display = 'none'; // Ocultar botón de pausar
        btnReanudar.style.display = 'inline'; // Mostrar botón de reanudar
    }
}

// Función para reanudar el juego
function reanudarJuego() {
    if (juegoActivo && juegoPausado) {
        juegoPausado = false;
        btnPausar.style.display = 'inline'; // Mostrar botón de pausar
        btnReanudar.style.display = 'none'; // Ocultar botón de reanudar
        requestAnimationFrame(actualizarJuego); // Continuar el ciclo de actualización
    }
}

// Añadir eventos a los botones
btnIniciar.addEventListener('click', () => {
    parpadearBoton('btnIniciar');
    iniciarJuego();
});

btnPausar.addEventListener('click', () => {
    parpadearBoton('pausarBtn');
    pausarJuego();
});

btnReanudar.addEventListener('click', () => {
    parpadearBoton('reanudarBtn');
    reanudarJuego();
});
// Función para mover el timón hacia arriba o abajo con las teclas de flechas
function moverTimon(event) {
    const movVertical = 5; // Cantidad de píxeles a mover (ajustado a 5)
    const limiteArriba = 0;
    const limiteAbajo = marco.clientHeight - timon.clientHeight;

    switch (event.key) {
        case 'ArrowUp':
            // Mover hacia arriba si no se excede el límite
            movimientoVerticalTimon = Math.max(-movVertical, movimientoVerticalTimon - movVertical);
            break;
        case 'ArrowDown':
            // Mover hacia abajo si no se excede el límite
            movimientoVerticalTimon = Math.min(movVertical, movimientoVerticalTimon + movVertical);
            break;
        default:
            break;
    }
    if (!juegoPausado) {
        const movVertical = 5; // Ajuste la cantidad de píxeles a mover según sea necesario
        const limiteArriba = 0;
        const limiteAbajo = marco.clientHeight - timon.clientHeight;

        // Obtener la posición actual del toque
        const touchY = event.touches[0].clientY;

        // Calcular la diferencia con la posición inicial del toque
        const deltaY = touchY - touchStartY;

        // Mover el avión según la dirección del deslizamiento
        avionY += deltaY / 10; // Ajuste la velocidad de movimiento según sea necesario

        // Actualizar la posición del avión del jugador
        avion.style.top = `${avionY}px`;

        // Actualizar la posición inicial del toque para el próximo movimiento
        touchStartY = touchY;

        event.preventDefault(); // Prevenir el desplazamiento predeterminado de la página
    }
    // Aplicar la transformación al timón
    timon.style.transform = `translateY(${movimientoVerticalTimon}px)`;
}
// Evento para manejar el movimiento del timón con las teclas de flecha
document.addEventListener('keydown', moverTimon);

// Llamar a la función para mover los aviones rivales y las balas continuamente
function juegoLoop() {
    if (juegoActivo) {
        moverAvionesRivales();
        moverBalas();
        requestAnimationFrame(juegoLoop);
    }
}

// Iniciar el bucle del juego
juegoLoop();

    // Función para comprobar la colisión entre dos elementos
    function colision(elemento1, elemento2) {
        const rect1 = elemento1.getBoundingClientRect();
        const rect2 = elemento2.getBoundingClientRect();

        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    // Evento para el botón de pausar
    document.getElementById('pausarBtn').addEventListener('click', () => {
        if (!juegoPausado) {
            juegoPausado = true;
            avionesRivales.forEach(avionRival => {
                avionRival.style.animationPlayState = 'paused'; // Pausar la animación de los aviones rivales
            });
            avion.style.animationPlayState = 'paused'; // Pausar la animación del avión del jugador
        }
    });

    // Evento para el botón de reanudar
    document.getElementById('reanudarBtn').addEventListener('click', () => {
        if (juegoPausado) {
            juegoPausado = false;
            avionesRivales.forEach(avionRival => {
                avionRival.style.animationPlayState = 'running'; // Reanudar la animación de los aviones rivales
            });
            avion.style.animationPlayState = 'running'; // Reanudar la animación del avión del jugador
            juego(); // Llamar a la función juego para continuar el juego desde donde se dejó
        }
    });

    // Función principal para el juego
    function juego() {
        if (juegoActivo && !juegoPausado) {
            moverAvionesRivales();
            moverBalas();
            verificarColisiones();
            requestAnimationFrame(juego); // Continuar el ciclo del juego
        }
    }

    juego(); // Iniciar el juego

    document.addEventListener('keydown', event => {
        if (!juegoPausado) {
            switch (event.key) {
                case 'ArrowUp':
                    avionY -= 10;
                    timon.style.transform = 'rotate(-15deg)'; // Girar el timón hacia arriba
                    break;
                case 'ArrowDown':
                    avionY += 10;
                    timon.style.transform = 'rotate(15deg)'; // Girar el timón hacia abajo
                    break;
                case 'ArrowLeft':
                    avionX -= 10;
                    timon.style.transform = 'rotate(-30deg)'; // Girar el timón hacia la izquierda
                    break;
                case 'ArrowRight':
                    avionX += 10;
                    timon.style.transform = 'rotate(30deg)'; // Girar el timón hacia la derecha
                    break;
                case 'a':
                    dispararBala('adelante'); // Disparar bala hacia adelante
                    break;
                case 's':
                    dispararBala('abajo'); // Disparar bala hacia abajo
                    break;
                case 'w':
                    dispararBala('arriba'); // Disparar bala hacia arriba
                    break;
            }

            // Actualizar la posición del avión del jugador
            avion.style.left = `${avionX}px`;
            avion.style.top = `${avionY}px`;
        }
    });

    // Restaurar la posición del timón cuando se suelta la tecla
    document.addEventListener('keyup', event => {
        if (!juegoPausado && event.key.includes('Arrow')) {
            timon.style.transform = 'rotate(0deg)'; // Restaurar la posición normal del timón
        }
    });

    // Evento para disparar una bala al presionar la tecla 'Space'
    document.addEventListener('keyup', event => {
        if (!juegoPausado && event.key.includes('Arrow')) {
            timon.style.transform = 'rotate(0deg)'; // Restaurar la posición normal del timón
        }
    });

    // Variables para almacenar las posiciones táctiles iniciales
    let touchStartX = 0;
    let touchStartY = 0;

    // Manejador de eventos para iniciar el movimiento con un toque
    document.addEventListener('touchstart', event => {
        if (!juegoPausado) {
            // Obtener la posición inicial del toque
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        }
    });

    // Manejador de eventos para mover el avión y disparar balas con un deslizamiento
    document.addEventListener('touchmove', event => {
        document.addEventListener('touchmove', moverTimon);
        if (!juegoPausado) {
            // Obtener la posición actual del toque
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;

            // Calcular la diferencia entre la posición inicial y actual
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;

            // Mover el avión según la dirección del deslizamiento
            avionX += deltaX / 10; // Ajustar la velocidad de movimiento
            avionY += deltaY / 10; // Ajustar la velocidad de movimiento

            // Actualizar la posición del avión del jugador
            avion.style.left = `${avionX}px`;
            avion.style.top = `${avionY}px`;

            // Actualizar la posición inicial del toque para el próximo movimiento
            touchStartX = touchX;
            touchStartY = touchY;

            event.preventDefault(); // Prevenir el desplazamiento predeterminado de la página
        }
    });


    // Manejador de eventos para finalizar el movimiento
    document.addEventListener('touchend', event => {
        // Restaurar la posición inicial del timón al finalizar el toque (opcional)
        // timon.style.transform = 'translate(0, 0)';
    });

    // Función para disparar balas al tocar los botones A, S, W
    btnA.addEventListener('touchstart', event => {
        if (!juegoPausado) {
            dispararBala('adelante');
            parpadearBoton('btnA');
            event.preventDefault(); // Prevenir el comportamiento predeterminado del botón
        }
    });


    btnS.addEventListener('touchstart', event => {
        if (!juegoPausado) {
            dispararBala('abajo');
            parpadearBoton('btnS');
            event.preventDefault(); // Prevenir el comportamiento predeterminado del botón
        }
    });

    btnW.addEventListener('touchstart', event => {
        if (!juegoPausado) {
            dispararBala('arriba');
            parpadearBoton('btnW');
            event.preventDefault(); // Prevenir el comportamiento predeterminado del botón
        }
    });
    // Manejador de eventos para mover el timón con un deslizamiento táctil (opcional)
    document.addEventListener('touchmove', event => {
        if (!juegoPausado) {
            // Obtener la posición actual del toque
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;

            // Calcular la diferencia entre la posición inicial y actual
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;

            // Calcular el ángulo de rotación del timón
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            // Aplicar la rotación al timón (ajusta según tu diseño)
            timon.style.transform = `rotate(${angle}deg)`;

            // Actualizar la posición inicial del toque para el próximo movimiento
            touchStartX = touchX;
            touchStartY = touchY;

            event.preventDefault(); // Prevenir el desplazamiento predeterminado de la página
        }
        
    });
