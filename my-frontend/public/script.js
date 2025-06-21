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
      const emailInput = document.getElementById("correo");
      const passwordInput = document.getElementById("contraseña");
      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      // Validación vacíos
      if (!email || !password) {
        mostrarMensaje("Por favor, ingresa correo y contraseña.", "red");

        // Animación de sacudida (shake)
        if (!email) emailInput.classList.add("shake");
        if (!password) passwordInput.classList.add("shake");

        setTimeout(() => {
          emailInput.classList.remove("shake");
          passwordInput.classList.remove("shake");
        }, 1000);

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
          return response.json()
            .then(err => {
              const msg = err.message || "Credenciales inválidas";
              throw new Error(msg);
            })
            .catch(() => {
              throw new Error("Credenciales inválidas");
            });
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        mostrarMensaje("Inicio de sesión exitoso.", "green");

        setTimeout(() => {
          window.location.href = "../menu/menu.html";
        }, 500);
      })
      .catch(error => {
        const passwordInput = document.getElementById("contraseña");

        if (error.message === "Failed to fetch") {
          mostrarMensaje("No se pudo conectar al servidor.", "red");
        } else {
          mostrarMensaje(error.message, "red");

          // Sacudir campo de contraseña si hay error
          passwordInput.classList.add("shake");
          setTimeout(() => {
            passwordInput.classList.remove("shake");
          }, 1000);
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
