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
        updateClock();
    }

    function pomodoroController() {
        // Un ciclo pomodoro: trabajo-descanso x4, luego descanso largo
        // timesCompleted: 0=trabajo, 1=descanso, 2=trabajo, 3=descanso, 4=trabajo, 5=descanso, 6=trabajo, 7=descanso largo
        if (isRestTime()) {
            cyclesCompleted++;
            if (!goalReached()) {
                currentTime = restTime;
                seconds = 0;
                startTimer();
                timesCompleted = 0;
            } else {
                console.log("¡Se acabó el pomodoro!");
                reproducirAlarma(); // 🔔 Alarma al terminar ciclo completo
                timerId = null;
            }
            return;
        }

        if (timesCompleted % 2 == 0) {
            currentTime = worktime;
            seconds = 0;
            timesCompleted++;
            startTimer();
            console.log("¡Hora de trabajar! Ciclo: " + timesCompleted);
        } else {
            currentTime = breaktime;
            seconds = 0;
            timesCompleted++;
            startTimer();
            console.log("Hora de descansar 😌 Ciclo: " + timesCompleted);
        }
    }

    function isRestTime() {
        // Un ciclo completo son 8 etapas (4 trabajo + 4 descanso)
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
            timerId = setTimeout(timer, 1000);
        } else {
            reproducirAlarma(); // 🔔 Alarma al terminar cada etapa
            pomodoroController();
            console.log("El temporizador terminó");
        }
    }

    // 🔔 FUNCIÓN DE ALARMA
    function reproducirAlarma() {
        const alarm = document.getElementById("alarm-sound");
        if (alarm) {
            alarm.currentTime = 0; // Reinicia el sonido
            alarm.play().catch(error => {
                console.error("Error al reproducir el sonido:", error);
            });
        } else {
            console.warn("No se encontró el elemento de sonido de alarma.");
        }
    }
};