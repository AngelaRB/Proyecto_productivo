document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");

    // Función para cargar todas las tareas
    function loadTasks() {
        fetch("/tasks")
            .then(res => res.json())
            .then(tasks => {
                taskList.innerHTML = ""; // limpiar lista
                tasks.forEach(task => {
                    const li = document.createElement("li");
                    li.textContent = task.title;
                    li.classList.add(task.relevance); // CSS depende de relevancia

                    // Botón editar
                    const editBtn = document.createElement("button");
                    editBtn.textContent = "Editar";
                    editBtn.onclick = () => editTask(task.id, task.title, task.relevance);

                    // Botón eliminar
                    const deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "Eliminar";
                    deleteBtn.onclick = () => deleteTask(task.id);

                    li.appendChild(editBtn);
                    li.appendChild(deleteBtn);
                    taskList.appendChild(li);
                });
            });
    }

    // Agregar tarea
    taskForm.addEventListener("submit", e => {
        e.preventDefault();
        const title = document.getElementById("taskTitle").value;
        const relevance = document.getElementById("taskRelevance").value;

        fetch("/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, relevance })
        }).then(() => {
            taskForm.reset();
            loadTasks();
        });
    });

    // Editar tarea
    function editTask(id, oldTitle, oldRelevance) {
        const newTitle = prompt("Editar tarea:", oldTitle);
        const newRelevance = prompt("Editar relevancia (baja, media, alta):", oldRelevance);

        if (newTitle && newRelevance) {
            fetch(`/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, relevance: newRelevance })
            }).then(() => loadTasks());
        }
    }

    // Eliminar tarea
    function deleteTask(id) {
        fetch(`/tasks/${id}`, { method: "DELETE" })
            .then(() => loadTasks());
    }

    // Cargar tareas al iniciar
    loadTasks();
});
