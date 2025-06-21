document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const mensaje = document.getElementById('mensaje');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener valores
    const name = document.getElementById('nombre').value.trim();
    const cardIdentifi = document.getElementById('identificacion').value.trim();
    const phone = document.getElementById('telefono').value.trim();
    const mail = document.getElementById('correo').value.trim();

    // Validaciones mínimas (no vacíos)
    if (!name || !cardIdentifi || !phone || !mail) {
      mensaje.textContent = 'Todos los campos son obligatorios.';
      mensaje.style.color = 'red';
      return;
    }

    try {
      // Verificar si la identificación ya existe
      const checkResponse = await fetch(`https://backend.int-solutionstec.com/api/customer/find/${cardIdentifi}`);

      if (checkResponse.ok) {
        mensaje.textContent = 'La identificación ya está registrada.';
        mensaje.style.color = 'red';
        return;
      } else if (checkResponse.status !== 404) {
        mensaje.textContent = 'Error al validar la identificación.';
        mensaje.style.color = 'red';
        return;
      }
    } catch (error) {
      console.error('Error al conectar con la API de validación:', error);
      mensaje.textContent = 'Error en la conexión con la API de validación.';
      mensaje.style.color = 'red';
      return;
    }

    // Enviar datos
    const payload = { name, cardIdentifi, mail, phone };

    try {
      const response = await fetch('https://backend.int-solutionstec.com/api/customer/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        mensaje.textContent = 'Cliente agregado correctamente.';
        mensaje.style.color = 'green';
        form.reset();
      } else {
        mensaje.textContent = 'El cliente ya existe.';
        mensaje.style.color = 'red';
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      mensaje.textContent = 'Error en la conexión con la API.';
      mensaje.style.color = 'red';
    }
  });

  // Modo oscuro
  const btnDarkMode = document.getElementById("btn-dark-mode");

  if (localStorage.getItem("dark-mode") === "enabled") {
    document.body.classList.add("dark-mode");
    btnDarkMode.textContent = "☀️";
  }

  btnDarkMode.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    localStorage.setItem("dark-mode", isDark ? "enabled" : "disabled");
    btnDarkMode.textContent = isDark ? "☀️" : "🌑";
  });
});
