window.onload = () => {

    let breaktime;
    let worktime; 
    let restTime;
    let timesCompleted;
    let cyclesGoal;
    let cyclesCompleted = 0;

    let timerId = null; 

    function pomodoroController() {
        if (isRestTime()) {
            cyclesCompleted++;
            if (!goalReached()) {
                currentTime = restTime;
                startTimer();
                timesCompleted = 0;
            } else {
                console.log("¡Se acabó el pomodoro!");
            }
            return;
        }

        if (timesCompleted % 2 == 0) {
            currentTime = worktime;
            timesCompleted++;
            startTimer();
            console.log("¡Hora de trabajar! Ciclo: " + timesCompleted);
        } else {
            currentTime = breaktime;
            timesCompleted++;
            startTimer();
            console.log("Hora de descansar 😌 Ciclo: " + timesCompleted);
        }
    }

    function isRestTime() {
        return timesCompleted == 7;
    }

    function goalReached() {
        return cyclesGoal == cyclesCompleted;
    }

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
    }

    let clockminutes;
    let clockseconds;

    function updateClock() {
        clockminutes = formatnumbers(currentTime);
        clockseconds = formatnumbers(seconds);
        clock.innerHTML = clockminutes + ":" + clockseconds;
    }

    function formatnumbers(time) {
        return time < 10 ? "0" + time : time;
    }

    let currentTime = 1;
    let seconds = 0;


    function startTimer() {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(timer, 1000);
    }

    function timer() {
        if (currentTime > 0 || seconds > 0) {
            if (seconds == 0) {
                seconds = 59;
                currentTime--;
            } else {
                seconds--;
            }
            updateClock();
            timerId = setTimeout(timer, 1000);
        } else {
            pomodoroController();
            console.log("El temporizador terminó");
        }
    }
};
