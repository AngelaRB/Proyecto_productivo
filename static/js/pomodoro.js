 window.onload = () => {
    let breaktime, worktime, restTime, cyclesGoal;
    let cyclesCompleted = 0;
    let timerId = null;
    let currentTime = 0;
    let seconds = 0;
    let totalSeconds = 0;
    let isWorking = true;

    const clock = document.getElementById("clock");
    const cyclesInput = document.getElementById("cycles-input");
    const startButton = document.getElementById("start-button");
    const workTimeInput = document.getElementById("work-time");
    const breakTimeInput = document.getElementById("break-time");
    const restTimeInput = document.getElementById("rest-time");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    // Nuevo: estado visible en la UI (colocar este elemento en el HTML)
    // <p id="status-text"></p>
    const statusText = document.getElementById("status-text");

    // Referencia al audio (usa la etiqueta <audio id="alarm-sound"...> en tu HTML)
    const alarmEl = document.getElementById("alarm-sound");

    // Evitar valores menores a 1
    [workTimeInput, breakTimeInput, restTimeInput, cyclesInput].forEach(input => {
        input.addEventListener("input", () => {
            if (input.value < 1) input.value = 1;
        });
    });

    // IMPORTANTE: desbloquear audio con la primera interacción (click en Start).
    // Algunos navegadores bloquean la reproducción hasta que el usuario interactúe.
    startButton.addEventListener("click", () => {
        // Si no hay instancia de audio, intenta 'despertarla' con un play() breve.
        if (alarmEl) {
            // play & immediately pause to satisfy la política de interacción en algunos navegadores
            alarmEl.play().then(() => {
                alarmEl.pause();
                alarmEl.currentTime = 0;
            }).catch(() => {
                // si falla, no pasa nada: el audio se intentará reproducir cuando corresponda
            });
        }
    }, { once: true }); // solo la primera vez

    startButton.onclick = () => {
        if (!timerId) {
            populateVariables();
            startPomodoro();
        }
    };

    function populateVariables() {
        worktime = parseInt(workTimeInput.value);
        breaktime = parseInt(breakTimeInput.value);
        restTime = parseInt(restTimeInput.value);
        cyclesGoal = parseInt(cyclesInput.value);
        cyclesCompleted = 0;
        isWorking = true;
        currentTime = worktime;
        seconds = 0;
        totalSeconds = worktime * 60;
        updateClock();
        updateProgressBar();
        statusText && (statusText.textContent = "En trabajo");
    }

    function startPomodoro() {
        startTimer();
    }

    function startTimer() {
        if (timerId) clearTimeout(timerId);
        updateClock();
        updateProgressBar();
        timerId = setTimeout(timer, 1000);
    }

    function timer() {
        if (currentTime > 0 || seconds > 0) {
            if (seconds === 0) {
                seconds = 59;
                currentTime--;
            } else {
                seconds--;
            }
            updateClock();
            updateProgressBar();
            timerId = setTimeout(timer, 1000);
        } else {
            // terminó un segmento (trabajo o descanso)
            reproducirAlarma();

            if (isWorking) {
                // terminó trabajo
                cyclesCompleted++;
                statusText && (statusText.textContent = `¡Pomodoro ${cyclesCompleted} completado!`);
                if (cyclesCompleted % 4 === 0) {
                    // descanso largo
                    iniciarDescanso(restTime);
                    statusText && (statusText.textContent = "Descanso largo");
                } else {
                    // descanso corto
                    iniciarDescanso(breaktime);
                    statusText && (statusText.textContent = "Descanso corto");
                }

            } else {
                // terminó descanso
                if (cyclesCompleted >= cyclesGoal) {
                    // **YA NO se usa alert**: mostramos en la UI y detenemos el pomodoro.
                    finalizarPomodoroUI();
                    return;
                }
                iniciarTrabajo();
                statusText && (statusText.textContent = "De nuevo al trabajo");
            }
        }
    }

    function iniciarTrabajo() {
        isWorking = true;
        currentTime = worktime;
        seconds = 0;
        totalSeconds = worktime * 60;
        // breve retraso para que el usuario vea el cambio (opcional)
        setTimeout(() => startTimer(), 250);
    }

    function iniciarDescanso(tiempo) {
        isWorking = false;
        currentTime = tiempo;
        seconds = 0;
        totalSeconds = tiempo * 60;
        setTimeout(() => startTimer(), 250);
    }

    function finalizarPomodoroUI() {
        clearTimeout(timerId);
        timerId = null;
        // Mensaje visible dentro de la UI (no alert)
        if (statusText) {
            statusText.textContent = "🎉 Pomodoro completado";
        } else {
            console.log("Pomodoro completado");
        }
        // Reiniciar barra y reloj a 0:00 o al tiempo de trabajo según prefieras
        currentTime = 0;
        seconds = 0;
        updateClock();
        progressBar.style.width = "0%";
        progressText.textContent = "100%";
        // Intenta reproducir alarma final (otra vez por seguridad)
        reproducirAlarma();
        // vibración si soporta
        if (navigator.vibrate) navigator.vibrate(500);
    }

    function updateClock() {
        let min = formatnumbers(currentTime);
        let sec = formatnumbers(seconds);
        clock.textContent = `${min}:${sec}`;
    }

    function formatnumbers(time) {
        return time < 10 ? "0" + time : time;
    }

    function updateProgressBar() {
        // evita división por cero
        if (!totalSeconds || totalSeconds === 0) {
            progressBar.style.width = "0%";
            progressText.textContent = "0%";
            return;
        }
        const elapsedSeconds = totalSeconds - (currentTime * 60 + seconds);
        const progressPercent = Math.max(0, Math.min(100, (elapsedSeconds / totalSeconds) * 100));
        progressBar.style.width = `${progressPercent}%`;
        progressText.textContent = `${Math.floor(progressPercent)}%`;
    }

    function reproducirAlarma() {
        if (!alarmEl) return;
        // Reproducir y capturar rechazo (policy/autoplay)
        alarmEl.currentTime = 0;
        const playPromise = alarmEl.play();
        if (playPromise !== undefined) {
            playPromise.catch(err => {
                // Si falla (autoplay), intentaremos reproducir en el siguiente click del usuario
                console.warn("No se pudo reproducir la alarma automáticamente:", err);
            });
        }
        // intentar vibrar (si aplica)
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
};
