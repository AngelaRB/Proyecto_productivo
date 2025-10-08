

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const emptyMessage = document.getElementById("empty-message");

// ---------------- FUNCIONES ----------------

// Agregar tarea
function addTask() {
  const task = inputBox.value.trim();

  if (!task) {
    alert("Debes escribir una tarea");
    return;
  }

  const li = document.createElement("li");
  li.textContent = task;

  const span = document.createElement("span");
  span.textContent = "\u00d7";
  span.classList.add("delete-btn");
  li.appendChild(span);

  listContainer.appendChild(li);
  inputBox.value = "";

  saveData();
  showMessage();
}

// Delegación de eventos: marcar como hecho o eliminar
listContainer.addEventListener("click", (e) => {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    saveData();
  } else if (e.target.classList.contains("delete-btn")) {
    e.target.parentElement.remove();
    saveData();
    showMessage();
  }
});

// Mostrar u ocultar el mensaje de lista vacía
function showMessage() {
  emptyMessage.style.display =
  listContainer.querySelectorAll("li").length === 0 ? "block" : "none";

}

// Guardar tareas en localStorage
function saveData() {
  localStorage.setItem("data", listContainer.innerHTML);
}

// Recuperar tareas guardadas
function showTask() {
  const saved = localStorage.getItem("data");
  if (saved) {
    listContainer.innerHTML = saved;
  }
  showMessage();
}

// Enter = agregar tarea
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTask();
  }
});

// Inicializar  
showTask();

// Delegación de eventos: detectar clics dentro del contenedor
listContainer.addEventListener("click", (e) => {
  const target = e.target;

  // Si hace clic en la tarea → marcar o desmarcar como hecha
  if (target.tagName === "LI") {
    target.classList.toggle("checked");
  }

  // Si hace clic en el botón de eliminar (la ×)
  if (target.classList.contains("delete-btn")) {
    target.parentElement.remove();
  }

  showMessage();
});

// Mostrar mensaje si no hay tareas
function showMessage() {
  const tareas = listContainer.querySelectorAll("li:not(#empty-message)");
  const mensaje = document.getElementById("empty-message");

  if (tareas.length === 0) {
    if (!mensaje) {
      const msg = document.createElement("li");
      msg.id = "empty-message";
      msg.textContent = "¡No tienes tareas pendientes!";
      listContainer.appendChild(msg);
    }
  } else if (mensaje) {
    mensaje.remove();
  }
}
