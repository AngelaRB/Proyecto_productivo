 window.onload = () => {
    let breaktime, worktime, restTime, timesCompleted, cyclesGoal;
    let cyclesCompleted = 0;
    let timerId = null;
    let currentTime = 1;
    let seconds = 0;

    const clock = document.getElementById("clock");
    const cyclesInput = document.getElementById("cycles-input");
    const startButton = document.getElementById("start-button");
    const cancelButton = document.getElementById("cancel-button");
    const workTimeInput = document.getElementById("work-time");
    const breakTimeInput = document.getElementById("break-time");
    const restTimeInput = document.getElementById("rest-time");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    //  Evitar valores menores a 1 en los inputs
    [workTimeInput, breakTimeInput, restTimeInput, cyclesInput].forEach(input => {
        input.addEventListener("input", () => {
            if (input.value < 1) {
                input.value = 1;
                console.warn(`El valor mínimo para "${input.id}" es 1`);
            }
        });
    });


    // Modal
    const modal = document.getElementById("confirm-modal");
    const confirmYes = document.getElementById("confirm-yes");
    const confirmNo = document.getElementById("confirm-no");

    let totalSeconds = 0;

    startButton.onclick = () => {
        if (!timerId) {
            populateVariable();
            startPomodoro();

            // 🔥 Animar aparición del botón Cancel
            cancelButton.style.display = "inline-block";
            cancelButton.classList.remove("hide-btn");
            cancelButton.classList.add("show-btn");
        }
    };

    function startPomodoro() {
        pomodoroController();
    }

    function populateVariable() {
        worktime = parseInt(workTimeInput.value);
        breaktime = parseInt(breakTimeInput.value);
        restTime = parseInt(restTimeInput.value);
        cyclesGoal = parseInt(cyclesInput.value);
        timesCompleted = 0;
        cyclesCompleted = 0;
        currentTime = worktime;
        seconds = 0;
        totalSeconds = worktime * 60;
        updateClock();
        updateProgressBar();
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
                reproducirAlarma();
                timerId = null;
                hideCancelButton();
            }
            return;
        }

        if (timesCompleted % 2 == 0) {
            currentTime = worktime;
            seconds = 0;
            totalSeconds = worktime * 60;
            timesCompleted++;
            startTimer();
        } else {
            currentTime = breaktime;
            seconds = 0;
            totalSeconds = breaktime * 60;
            timesCompleted++;
            startTimer();
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
            reproducirAlarma();
            pomodoroController();
        }
    }

    function reproducirAlarma() {
        const alarm = document.getElementById("alarm-sound");
        if (alarm) {
            alarm.currentTime = 0;
            alarm.play().catch(error => console.error("Error al reproducir:", error));
        }
    }

    function updateProgressBar() {
        const elapsedSeconds = totalSeconds - (currentTime * 60 + seconds);
        const progressPercent = (elapsedSeconds / totalSeconds) * 100;
        progressBar.style.width = `${progressPercent}%`;
        progressText.textContent = `${Math.floor(progressPercent)}%`;
    }

    // 💥 Cancelar Pomodoro con modal
    cancelButton.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    confirmYes.addEventListener("click", () => {
        clearTimeout(timerId);
        timerId = null;
        currentTime = 0;
        seconds = 0;
        updateClock();
        progressBar.style.width = "0%";
        progressText.textContent = "0%";
        modal.style.display = "none";
        hideCancelButton();
    });

    confirmNo.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // 🎬 Función para ocultar con animación
    function hideCancelButton() {
        cancelButton.classList.remove("show-btn");
        cancelButton.classList.add("hide-btn");
        setTimeout(() => {
            cancelButton.style.display = "none";
        }, 300);
    }
};


