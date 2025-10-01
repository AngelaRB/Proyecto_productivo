/*

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

*/