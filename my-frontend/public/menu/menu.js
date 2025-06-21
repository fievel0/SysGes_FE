// script.js

document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // MODO OSCURO/CLARO
  // ==========================
  const btnDarkMode = document.getElementById("btn-dark-mode");
  const body = document.body;

  // Carga preferencia previa
  if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
    if (btnDarkMode) btnDarkMode.textContent = "☀️";
  }

  // Toggle modo
  if (btnDarkMode) {
    btnDarkMode.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      if (body.classList.contains("dark-mode")) {
        localStorage.setItem("dark-mode", "enabled");
        btnDarkMode.textContent = "☀️";
      } else {
        localStorage.setItem("dark-mode", "disabled");
        btnDarkMode.textContent = "🌑";
      }
    });
  }

  // ==========================
  // PROCESO DE LOGIN
  // ==========================
  const btnIniciar = document.querySelector(".btn-iniciar");
  const mensajeDiv = document.getElementById("mensaje");

  if (btnIniciar) {
    btnIniciar.addEventListener("click", () => {
      const email = document.getElementById("correo").value.trim();
      const password = document.getElementById("contraseña").value.trim();

      if (!email || !password) {
        mostrarMensaje("Por favor, ingresa correo y contraseña.", "red");
        return;
      }

      const datos = { email, password };

      fetch("https://backend.int-solutionstec.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      })
      .then(response => {
        if (!response.ok) {
          // Intentamos leer un mensaje de error detallado del servidor
          return response.json()
            .then(err => {
              const msg = err.message || "Credenciales inválidas";
              throw new Error(msg);
            })
            .catch(() => {
              // Si no viene JSON, lanzamos un mensaje genérico
              throw new Error("Credenciales inválidas");
            });
        }
        return response.json();
      })
      .then(data => {
        // Almacenar token y userId
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        mostrarMensaje("Inicio de sesión exitoso.", "green");

        // Redirigir tras breve pausa
        setTimeout(() => {
          window.location.href = "../menu/menu.html";
        }, 500);
      })
      .catch(error => {
        // Distinguir error de red de error de credenciales
        if (error.message === "Failed to fetch") {
          mostrarMensaje("No se pudo conectar al servidor.", "red");
        } else {
          mostrarMensaje(error.message, "red");
        }
      });
    });
  }

  // ==========================
  // FUNCIÓN PARA MOSTRAR MENSAJES
  // ==========================
  function mostrarMensaje(msg, color) {
    mensajeDiv.textContent = msg;
    mensajeDiv.style.color = color;
    mensajeDiv.style.fontSize = "1.1em";
    mensajeDiv.style.marginBottom = "1rem";
  }
});
// ==========================
// AYUDA DEL SISTEMA
// ==========================
function mostrarAyuda() {
  const modal = document.getElementById("modalAyuda");
  modal.style.display = "flex";
}

function cerrarAyuda() {
  const modal = document.getElementById("modalAyuda");
  modal.style.display = "none";
}

// Cierra si el usuario hace clic fuera del contenido
window.addEventListener("click", function(event) {
  const modal = document.getElementById("modalAyuda");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
