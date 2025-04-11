document.addEventListener("DOMContentLoaded", () => {
  // --- Funcionalidad para buscar el cliente ---
  const buscarBtn = document.getElementById("buscar_cedula_cliente");
  const cedulaInput = document.getElementById("cedula_cliente");
  const clienteBuscado = document.querySelector(".cliente_buscado");

  // Función para mostrar la información del cliente
  const mostrarCliente = (cliente) => {
    if (!cliente || Object.keys(cliente).length === 0) {
      if (clienteBuscado) {
        clienteBuscado.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
      }
      return;
    }
    if (clienteBuscado) {
      clienteBuscado.innerHTML = `
        <div class="cliente">
          <p><strong>ID:</strong> ${cliente.id_customer || ''}</p>
          <p><strong>Nombre:</strong> ${cliente.name || ''}</p>
          <p><strong>Identificación:</strong> ${cliente.cardIdentifi || ''}</p>
          <p><strong>Teléfono:</strong> ${cliente.phone || ''}</p>
          <p><strong>Correo:</strong> ${cliente.mail || ''}</p>
        </div>
      `;
    }
  };

  // Función para mostrar errores
  const mostrarError = (mensaje) => {
    if (clienteBuscado) {
      clienteBuscado.innerHTML = `<p style="color: red;">Error: ${mensaje}</p>`;
    }
  };

  // Evento click para el botón de búsqueda del cliente
  buscarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const cedula = cedulaInput.value.trim();
    if (cedula === "") {
      mostrarError("Ingrese una cédula válida.");
      return;
    }
    // URL de la API para buscar el cliente mediante cédula
    const url = `https://sysgesbe-production.up.railway.app/api/customer/cedula/${cedula}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("No se encontró el cliente");
        }
        return response.json();
      })
      .then(data => {
        mostrarCliente(data);
      })
      .catch(error => {
        mostrarError(error.message);
      });
  });

  // --- Funcionalidad para guardar la orden ---
  const form = document.querySelector("form");
  const mensajeDiv = document.getElementById("mensaje");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Obtener los valores de los inputs
    const create_date = document.getElementById("fechaRecepcion").value;
    const deadline = document.getElementById("fechaEntrega").value;
    const tot_pay = parseFloat(document.getElementById("totalPago").value);
    const addit_details = document.getElementById("detalles").value;
    const id_customer = parseInt(document.getElementById("idCliente").value);
    const id_equip = parseInt(document.getElementById("idEquipo").value);
    const idEmployee = parseInt(document.getElementById("idEmpleado").value);

    // Crear el objeto con la estructura JSON requerida
    const ordenData = {
      create_date: create_date,
      deadline: deadline,
      tot_pay: tot_pay,
      addit_details: addit_details,
      customer: { id_customer: id_customer },
      equipment: { id_equip: id_equip },
      employee: { idEmployee: idEmployee }
    };

    // Enviar datos mediante POST a la URL indicada
    fetch("https://sysgesbe-production.up.railway.app/api/ord_rep/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(ordenData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return response.text();
      })
      .then(data => {
        console.log("Orden guardada:", data);
        mensajeDiv.innerText = "Orden guardada correctamente";
      })
      .catch(error => {
        console.error("Error al guardar la orden:", error);
        mensajeDiv.innerText = "Error al guardar la orden, revise los ID";
      });
  });

  // --- Modo oscuro ---
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
});
