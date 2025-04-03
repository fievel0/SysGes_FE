document.addEventListener("DOMContentLoaded", () => {
    // ==========================
    // MODO OSCURO/CLARO
    // ==========================

    // Obtiene el botón de modo oscuro del HTML
    const btnDarkMode = document.getElementById("btn-dark-mode");
    
    // Verifica si hay una preferencia guardada en localStorage
    if (localStorage.getItem("dark-mode") === "enabled") {
        document.body.classList.add("dark-mode");
        if(btnDarkMode) btnDarkMode.textContent = "☀️";
    }
    // Si el botón existe, agrega el evento de alternar entre modo oscuro/claro
    if (btnDarkMode) {
        btnDarkMode.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("dark-mode", "enabled");
                btnDarkMode.textContent = "☀️"; // Indica que ahora se muestra modo oscuro, presionar para modo claro
            } else {
                localStorage.setItem("dark-mode", "disabled");
                btnDarkMode.textContent = "🌑"; // Indica modo claro, presionar para modo oscuro
            }
        });
    }
    
    // ==========================
    // PROCESO DE LOGIN
    // ==========================

    // Obtiene el botón de inicio de sesión y el contenedor de mensajes
    const btnIniciar = document.querySelector(".btn-iniciar");
    const mensajeDiv = document.getElementById("mensaje");
   
    // Evento de clic en el botón de inicio de sesión
    btnIniciar.addEventListener("click", () => {
        // Obtiene los valores ingresados por el usuario
        const email = document.getElementById("correo").value;
        const password = document.getElementById("contraseña").value;

        // Validar que los campos no estén vacíos
        if (!email || !password) {
            mostrarMensaje("Por favor, ingresa correo y contraseña.", "red");
            return;
        }

        // Crea el objeto con los datos de inicio de sesión
        const datos = { email, password };

        // Realiza la petición POST al backend para autenticar al usuario
        fetch("http://localhost:5432/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos) // Convierte los datos a formato JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Credenciales inválidas"); // Lanza un error si la respuesta no es exitosa
            }
            return response.json(); // Convierte la respuesta a JSON
        })
        .then(data => {
            // Guarda el token y el ID del usuario en localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.userId);

            // Muestra un mensaje de éxito
            mostrarMensaje("Inicio de sesión exitoso.", "green");

            // Redirige al menú principal 
            setTimeout(() => {
                window.location.href = "../public/menu/menu.html";
            }, 500);
        })
        .catch(error => {
            // Muestra un mensaje de error si ocurre un problema
            mostrarMensaje(error.message, "red");
        });
    });
    // ==========================
    // FUNCIÓN PARA MOSTRAR MENSAJES
    // ==========================
    // Función para mostrar mensajes en el contenedor #mensaje
    function mostrarMensaje(msg, color) {
        mensajeDiv.textContent = msg;
        mensajeDiv.style.color = color;
        mensajeDiv.style.fontSize = "1.2em";
        mensajeDiv.style.marginBottom = "10px";
    }
});
