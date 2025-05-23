document.addEventListener("DOMContentLoaded", () => {
    // ==========================
    // MODO OSCURO/CLARO
    // ==========================
    const btnDarkMode = document.getElementById("btn-dark-mode");
    if (localStorage.getItem("dark-mode") === "enabled") {
        document.body.classList.add("dark-mode");
        if (btnDarkMode) btnDarkMode.textContent = "☀️";
    }
    if (btnDarkMode) {
        btnDarkMode.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
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
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);
            mostrarMensaje("Inicio de sesión exitoso.", "green");
            setTimeout(() => {
                window.location.href = "../menu/menu.html";
            }, 500);
        })
        .catch(error => {
            // Diferenciamos error de red de otro tipo de error
            if (error.message === "Failed to fetch") {
                mostrarMensaje("No se pudo conectar a la base de datos.", "red");
            } else {
                mostrarMensaje(error.message, "red");
            }
        });
    });

    // ==========================
    // FUNCIÓN PARA MOSTRAR MENSAJES
    // ==========================
    function mostrarMensaje(msg, color) {
        mensajeDiv.textContent = msg;
        mensajeDiv.style.color = color;
        mensajeDiv.style.fontSize = "1.2em";
        mensajeDiv.style.marginBottom = "10px";
    }
});
