

const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const emptyMessage = document.getElementById("empty-message");
const dateInput = document.getElementById("date-input");

//  Formatear fecha de "YYYY-MM-DD" → "DD/MM/YYYY"
function formatDate(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${d}/${m}/${y}`;
}

// ---------------- FUNCIONES ----------------

// Agregar tarea
function addTask() {
  const task = inputBox.value.trim();
  const deadline = dateInput.value; // Fecha seleccionada (puede estar vacía)

  if (!task) {
    alert("Debes escribir una tarea");
    return;
  }

  // Crear el elemento de lista
  const li = document.createElement("li");

  // Contenedor principal de la tarea
  const tareaDiv = document.createElement("div");
  tareaDiv.className = "tarea-texto";
  tareaDiv.textContent = task;
  li.appendChild(tareaDiv);

  // Mostrar la fecha debajo, si existe
  if (deadline) {
    const fechaDiv = document.createElement("div");
    fechaDiv.className = "fecha-limite";
    fechaDiv.innerHTML = `
      <div style="display:flex; align-items:center; gap:6px; margin-top:4px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
          viewBox="0 0 20 20">
          <path fill="#007BFF" d="M10 2a8 8 0 1 0 8 8a8.01 8.01 0 0 0-8-8Zm0 14.5A6.5 6.5 0 1 1 16.5 10A6.507 6.507 0 0 1 10 16.5Zm.5-6.5V6h-1v5h4v-1h-3Z"/>
        </svg>
        <span>${formatDate(deadline)}</span>
      </div>
    `;
    li.appendChild(fechaDiv);
  }

  // Botón eliminar
  const span = document.createElement("span");
  span.textContent = "\u00d7";
  span.classList.add("delete-btn");
  li.appendChild(span);

  // Agregar a la lista
  listContainer.appendChild(li);

  // Limpiar campos
  inputBox.value = "";
  dateInput.value = "";

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

  if (target.tagName === "LI") {
    target.classList.toggle("checked");
  }

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
