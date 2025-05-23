document.addEventListener("DOMContentLoaded", () => {
  // ============================
  // Funcionalidad para buscar el cliente
  // ============================
  const buscarBtnCliente = document.getElementById("buscar_cedula_cliente");
  const cedulaInputCliente = document.getElementById("cedula_cliente");
  const clienteBuscado = document.querySelector(".cliente_buscado");

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

  const mostrarErrorCliente = (mensaje) => {
    if (clienteBuscado) {
      clienteBuscado.innerHTML = `<p style="color: red;">Error: ${mensaje}</p>`;
    }
  };

  buscarBtnCliente.addEventListener("click", (e) => {
    e.preventDefault();
    const cedula = cedulaInputCliente.value.trim();
    if (cedula === "") {
      mostrarErrorCliente("Ingrese una cédula válida.");
      return;
    }
    // URL de la API para buscar el cliente mediante cédula
    const url = `https://backend.int-solutionstec.com/api/customer/cedula/${cedula}`;
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
        mostrarErrorCliente(error.message);
      });
  });

  // ============================
  // Funcionalidad para buscar empleado por Cédula (método agregado)
  // ============================
  const buscarBtnEmpleado = document.getElementById("buscar_cedula_empleado");
  const cedulaInputEmpleado = document.getElementById("cedula_empleado");
  const empleadoResultContainer = document.querySelector(".result-containerr");

  const mostrarEmpleado = (empleado) => {
    if (!empleado || Object.keys(empleado).length === 0) {
      empleadoResultContainer.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
      return;
    }
    empleadoResultContainer.innerHTML = `
      <div class="empleado">
        <p><strong>ID:</strong> ${empleado.idEmployee || ''}</p>
        <p><strong>Nombre:</strong> ${empleado.nameEmployee || ''}</p>
        <p><strong>Cargo:</strong> ${empleado.positionEmployee || ''}</p>
        <p><strong>Cédula:</strong> ${empleado.cedEmployee || ''}</p>
        <p><strong>Dirección:</strong> ${empleado.dirEmployee || ''}</p>
        <p><strong>Teléfono:</strong> ${empleado.telEmpployee || ''}</p>
      </div>
    `;
  };

  const mostrarErrorEmpleado = (mensaje) => {
    empleadoResultContainer.innerHTML = `<p style="color: red;">Error: ${mensaje}</p>`;
  };

  buscarBtnEmpleado.addEventListener("click", (e) => {
    e.preventDefault();
    const cedula = cedulaInputEmpleado.value.trim();
    if (cedula === "") {
      mostrarErrorEmpleado("Ingrese una cédula válida.");
      return;
    }
    // URL de la API para buscar el empleado mediante cédula
    const url = `https://backend.int-solutionstec.com/api/employee/cedula/${cedula}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("No se encontró el empleado");
        }
        return response.json();
      })
      .then(data => {
        mostrarEmpleado(data);
      })
      .catch(error => {
        mostrarErrorEmpleado(error.message);
      });
  });

  // ============================
  // Funcionalidad para buscar equipos por ID Cliente (ID Dueño)
  // ============================
  const buscarEquiposBtn = document.getElementById("buscar_id_cliente");
  const idClienteInput = document.getElementById("idCliente");
  const resultContainer = document.querySelector(".result-container");

  // Se crea el contenedor de paginación y se coloca justo después del resultContainer
  const paginationContainer = document.createElement("div");
  paginationContainer.id = "pagination";
  resultContainer.parentNode.insertBefore(paginationContainer, resultContainer.nextSibling);

  // Variables para la paginación
  let filteredEquipments = [];
  const itemsPerPage = 12;
  let currentPage = 1;

  const renderEquipment = (equipment) => {
    return `
      <div class="equipment">
        <p><strong>ID:</strong> ${equipment.id_equip || ''}</p>
        <p><strong>Modelo:</strong> ${equipment.model_equip || ''}</p>
        <p><strong>Marca:</strong> ${equipment.brand_equip || ''}</p>
      </div>
    `;
  };

  function renderPage() {
    resultContainer.innerHTML = "";
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageEquipments = filteredEquipments.slice(startIndex, endIndex);

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";

    pageEquipments.forEach(equip => {
      container.innerHTML += renderEquipment(equip);
    });

    resultContainer.appendChild(container);
  }

  function renderPaginationControls() {
    paginationContainer.innerHTML = "";
    const totalPages = Math.ceil(filteredEquipments.length / itemsPerPage);
    if (totalPages <= 1) return;

    const styleButton = (btn) => {
      btn.style.margin = "0 5px";
      btn.style.padding = "8px 12px";
      btn.style.backgroundColor = "rgb(103, 93, 45)";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.borderRadius = "5px";
      btn.style.cursor = "pointer";
      btn.addEventListener("mouseenter", () => { btn.style.backgroundColor = "rgb(93, 83, 35)"; });
      btn.addEventListener("mouseleave", () => { btn.style.backgroundColor = "rgb(103, 93, 45)"; });
    };

    if (currentPage > 1) {
      const prevButton = document.createElement("button");
      prevButton.textContent = "Anterior";
      styleButton(prevButton);
      prevButton.addEventListener("click", () => {
        currentPage--;
        renderPage();
        renderPaginationControls();
      });
      paginationContainer.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      styleButton(btn);
      if (i === currentPage) btn.disabled = true;
      btn.addEventListener("click", () => {
        currentPage = i;
        renderPage();
        renderPaginationControls();
      });
      paginationContainer.appendChild(btn);
    }

    if (currentPage < totalPages) {
      const nextButton = document.createElement("button");
      nextButton.textContent = "Siguiente";
      styleButton(nextButton);
      nextButton.addEventListener("click", () => {
        currentPage++;
        renderPage();
        renderPaginationControls();
      });
      paginationContainer.appendChild(nextButton);
    }
  }

  function showPaginatedEquipments() {
    currentPage = 1;
    renderPage();
    renderPaginationControls();
  }

  buscarEquiposBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const idCliente = idClienteInput.value.trim();
    if (idCliente === "") {
      resultContainer.innerHTML = `<p style="color:red;">Por favor, ingrese un ID Cliente válido.</p>`;
      paginationContainer.innerHTML = "";
      return;
    }
    fetch("https://backend.int-solutionstec.com/api/equipment/findAll")
      .then(response => {
        if (!response.ok) {
          throw new Error("Error en la solicitud de equipos");
        }
        return response.json();
      })
      .then(data => {
        filteredEquipments = data.filter(equip => equip.id_customer == idCliente);
        if (filteredEquipments.length === 0) {
          resultContainer.innerHTML = `<p style="color:red;">No se encontraron equipos para este cliente.</p>`;
          paginationContainer.innerHTML = "";
        } else {
          showPaginatedEquipments();
        }
      })
      .catch(error => {
        resultContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        paginationContainer.innerHTML = "";
      });
  });

  // ============================
  // Funcionalidad para guardar la orden
  // ============================
  const formOrden = document.querySelector("form");
  const mensajeDiv = document.getElementById("mensaje");

  formOrden.addEventListener("submit", (event) => {
    event.preventDefault();

    // Obtención de valores de inputs
    const create_date = document.getElementById("fechaRecepcion").value;
    const deadline = document.getElementById("fechaEntrega").value;
    const tot_pay = parseFloat(document.getElementById("totalPago").value);
    const addit_details = document.getElementById("detalles").value;
    const id_customer = parseInt(document.getElementById("idCliente").value);
    const id_equip = parseInt(document.getElementById("idEquipo").value);
    const idEmployee = parseInt(document.getElementById("idEmpleado").value);

    // Construcción del objeto con la estructura JSON requerida
    const ordenData = {
      create_date: create_date,
      deadline: deadline,
      tot_pay: tot_pay,
      addit_details: addit_details,
      customer: { id_customer: id_customer },
      equipment: { id_equip: id_equip },
      employee: { idEmployee: idEmployee }
    };

    fetch("https://backend.int-solutionstec.com/api/ord_rep/save", {
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

  // ============================
  // Funcionalidad para el Modo Oscuro
  // ============================
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
