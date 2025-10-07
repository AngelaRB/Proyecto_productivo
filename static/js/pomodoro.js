 window.onload = () => {

    let breaktime;
    let worktime; 
    let restTime;
    let timesCompleted;
    let cyclesGoal;
    let cyclesCompleted = 0;

    let timerId = null; 
    let currentTime = 1;
    let seconds = 0;

    let clock = document.getElementById("clock");
    let cyclesInput = document.getElementById("cycles-input");
    let startButton = document.getElementById("start-button");
    let workTimeInput = document.getElementById("work-time");
    let breakTimeInput = document.getElementById("break-time");
    let restTimeInput = document.getElementById("rest-time");

    // 🎯 Elementos para la barra de progreso
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    // Tiempo total actual (en segundos)
    let totalSeconds = 0;

    startButton.onclick = () => {
        if (!timerId) {
            populateVariable();
            startPomodoro();
        }
    };

    function startPomodoro() {
        console.log("Empezó el pomodoro");
        pomodoroController();
    }

    function populateVariable() {
        console.log("Variables cargadas");
        worktime = parseInt(workTimeInput.value);
        breaktime = parseInt(breakTimeInput.value);
        restTime = parseInt(restTimeInput.value);
        cyclesGoal = parseInt(cyclesInput.value);
        timesCompleted = 0;
        cyclesCompleted = 0;
        currentTime = worktime;
        seconds = 0;

        totalSeconds = worktime * 60; // tiempo total inicial
        updateClock();
        updateProgressBar(); // inicializar barra
    }

    function pomodoroController() {
        if (isRestTime()) {
            cyclesCompleted++;
            if (!goalReached()) {
                currentTime = restTime;
                seconds = 0;
                totalSeconds = restTime * 60;
                startTimer();
                timesCompleted = 0;
            } else {
                console.log("¡Se acabó el pomodoro!");
                reproducirAlarma();
                timerId = null;
            }
            return;
        }

        if (timesCompleted % 2 == 0) {
            currentTime = worktime;
            seconds = 0;
            totalSeconds = worktime * 60;
            timesCompleted++;
            startTimer();
            console.log("¡Hora de trabajar! Ciclo: " + timesCompleted);
        } else {
            currentTime = breaktime;
            seconds = 0;
            totalSeconds = breaktime * 60;
            timesCompleted++;
            startTimer();
            console.log("Hora de descansar 😌 Ciclo: " + timesCompleted);
        }
    }

    function isRestTime() {
        return timesCompleted === 8;
    }

    function goalReached() {
        return cyclesGoal === cyclesCompleted;
    }

    function updateClock() {
        let clockminutes = formatnumbers(currentTime);
        let clockseconds = formatnumbers(seconds);
        clock.innerHTML = clockminutes + ":" + clockseconds;
    }

    function formatnumbers(time) {
        return time < 10 ? "0" + time : time;
    }

    function startTimer() {
        if (timerId) {
            clearTimeout(timerId);
        }
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
            reproducirAlarma();
            pomodoroController();
            console.log("El temporizador terminó");
        }
    }

    // 🔔 FUNCIÓN DE ALARMA
    function reproducirAlarma() {
        const alarm = document.getElementById("alarm-sound");
        if (alarm) {
            alarm.currentTime = 0;
            alarm.play().catch(error => {
                console.error("Error al reproducir el sonido:", error);
            });
        } else {
            console.warn("No se encontró el elemento de sonido de alarma.");
        }
    }

    // 📊 FUNCIÓN PARA ACTUALIZAR LA BARRA DE PROGRESO
    function updateProgressBar() {
        const elapsedSeconds = totalSeconds - (currentTime * 60 + seconds);
        const progressPercent = (elapsedSeconds / totalSeconds) * 100;

        progressBar.style.width = `${progressPercent}%`;
        progressText.textContent = `${Math.floor(progressPercent)}%`;
    }
};
