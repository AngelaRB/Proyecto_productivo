/*
const openBtn = document.getElementById('openModal');

const closeBtn = document.getElementById('closeModal');

const modal = document.getElementById('modal');

const diario = document.getElementById('diarioPage')

openBtn.addEventListener('click', () => {
    modal.classList.add('open');
} );

closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
})
*/

/* El que medio funciona, solo selecciona el último

const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const modal = document.getElementById('modal');
const ingresarBtn = document.getElementById('diarioPage');

openBtn.addEventListener('click', () => {
  modal.classList.add('open');
});

closeBtn.addEventListener('click', () => {
  modal.classList.remove('open');
});

ingresarBtn.addEventListener('click', async () => {
  const password = document.querySelector('.password-input').value;
  const diarioId = ingresarBtn.dataset.id;
  const errorMsg = document.querySelector('.error-msg');

  const response = await fetch(`/verificar_password/${diarioId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

  const data = await response.json();

  if (data.success) {
    window.location.href = `/ver_diario/${diarioId}`;
  } else {
    errorMsg.style.display = 'block';
  }
}); */

const openButtons = document.querySelectorAll('.openModal');
const modals = document.querySelectorAll('.modal');

openButtons.forEach((openBtn, index) => {
  const modal = modals[index];
  const closeBtn = modal.querySelector('.closeModal');
  const ingresarBtn = modal.querySelector('.diarioPage');

  // Abrir modal
  openBtn.addEventListener('click', () => {
    modal.classList.add('open');
  });

  // Cerrar modal
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  // Verificar contraseña
  ingresarBtn.addEventListener('click', async () => {
    const password = modal.querySelector('.password-input').value;
    const diarioId = ingresarBtn.dataset.id;
    const errorMsg = modal.querySelector('.error-msg');

    const response = await fetch(`/verificar_password/${diarioId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });

    const data = await response.json();

    if (data.success) {
      window.location.href = `/ver_diario/${diarioId}`;
    } else {
      errorMsg.style.display = 'block';
    }
  });
});

