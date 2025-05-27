document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const btnID = document.getElementById("btnID");
  const btnCedula = document.getElementById("btnCedula");
  const inputField = document.querySelector(".CampoBuscar input");
  const resultContainer = document.querySelector(".result-container");
  const form = document.getElementById("CampoBuscar1");
  const btnBorrarGlobal = document.getElementById("btnBorrar");
  const btnActualizarGlobal = document.getElementById("btnActualizar");

  // Contenedor de paginación
  const paginationContainer = document.createElement("div");
  paginationContainer.id = "pagination";
  resultContainer.parentNode.insertBefore(paginationContainer, resultContainer.nextSibling);

  // Variables para paginación en búsqueda por ID Dueño
  let filteredEquipments = [];
  const itemsPerPage = 12; // Puedes ajustar este valor
  let currentPage = 1;

  // Flag para distinguir modo de búsqueda: true si es búsqueda por dueño
  let searchByOwner = false;

  // Función para mostrar mensajes globales (verde para éxito, rojo para error)
  const showGlobalMessage = (msg, color) => {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("global-message");
    messageDiv.innerHTML = `<p style="color:${color}; margin: 0;">${msg}</p>`;
    resultContainer.parentNode.insertBefore(messageDiv, resultContainer);
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  };

  // Función para quitar la clase "active" de ambos botones
  const clearSelected = () => {
    btnID.classList.remove("active");
    btnCedula.classList.remove("active");
  };

  // Función para limpiar el campo y resultados
  const clearData = () => {
    inputField.value = "";
    resultContainer.innerHTML = "";
    paginationContainer.innerHTML = "";
  };

  /**
   * Función para generar el HTML de un equipo.
   * Si showActions es true, se incluyen botones inline para borrar y actualizar.
   */
  const renderEquipment = (equipment, showActions = false) => {
    return `
      <div class="equipment">
        <p><strong>ID:</strong> <input type="text" class="equip-id" value="${equipment.id_equip || ''}" readonly></p>
        <p><strong>Modelo:</strong> <input type="text" class="equip-model" value="${equipment.model_equip || ''}"></p>
        <p><strong>Marca:</strong> <input type="text" class="equip-brand" value="${equipment.brand_equip || ''}"></p>
        <p><strong>Color:</strong> <input type="text" class="equip-color" value="${equipment.color_equip || ''}"></p>
        <p><strong>Estado del Equipo:</strong> <input type="text" class="equip-state" value="${equipment.state_equip || ''}"></p>
        <p><strong>Clave del Equipo:</strong> <input type="text" class="equip-pass" value="${equipment.pass_equip || ''}"></p>
        <p><strong>Antigüedad:</strong> <input type="text" class="equip-antivirus" value="${equipment.anti_equip || ''}"></p>
        <p><strong>Accesorios:</strong> <input type="text" class="equip-accessories" value="${equipment.accessor_equip || ''}"></p>
        <p><strong>Reporte:</strong> <input type="text" class="equip-report" value="${equipment.reported_equip || ''}"></p>
        <p><strong>Detalles Físicos:</strong> <input type="text" class="equip-detail" value="${equipment.detail_phy_equip || ''}"></p>
        <p><strong>Temperatura:</strong> <input type="text" class="equip-temp" value="${equipment.temp_equip || ''}"></p>
        <p><strong>Encendido/Apagado:</strong> <input type="text" class="equip-onoff" value="${equipment.on_off_equip ? 'Encendido' : 'Apagado'}" readonly></p>
        <p><strong>Causa del Daño:</strong> <input type="text" class="equip-causa" value="${equipment.cau_dam_equip || ''}"></p>
        <p><strong>Condición del Equipo:</strong>
          <select class="equip-cond">
            <option value="ENTREGADO_REPARADO" ${equipment.condEquip === 'ENTREGADO_REPARADO' ? 'selected' : ''}>ENTREGADO REPARADO</option>
            <option value="ENTREGADO_SIN_REPARACION" ${equipment.condEquip === 'ENTREGADO_SIN_REPARACION' ? 'selected' : ''}>ENTREGADO SIN REPARACION</option>
            <option value="EN_REPARACION" ${equipment.condEquip === 'EN_REPARACION' ? 'selected' : ''}>EN REPARACION</option>
            <option value="ALMACENADO_SIN_REPARACION" ${equipment.condEquip === 'ALMACENADO_SIN_REPARACION' ? 'selected' : ''}>ALMACENADO SIN REPARACION</option>
            <option value="CHATARRIZADO" ${equipment.condEquip === 'CHATARRIZADO' ? 'selected' : ''}>CHATARRIZADO</option>
          </select>
        </p>
        <!-- Sección para búsqueda de cliente (HTML similar a tu ejemplo) -->
        <p>
          <label for="id_customer">Cédula Cliente:</label>
          <div class="cliente-container">
            <input type="number" class="equip-cedula" name="id_customer" required>
            <button type="button" class="buscar_cliente buscar-btn">Buscar</button>
          </div>
          <div class="cliente_buscado"></div>
        </p>
        <p><strong>ID Cliente:</strong> <input type="text" class="equip-idcustomer" value="${equipment.id_customer || ''}" ></p>
        <p><strong>Nombre Cliente:</strong> <input type="text" class="equip-name" value="${equipment.name || ''}" ></p>
        ${
          showActions
            ? `<div class="equipment-actions">
                 <button type="button" class="Borrar">Borrar</button>
                 <button type="button" class="Actualizar">Actualizar</button>
               </div>`
            : ""
        }
      </div>
    `;
  };

  // Función para adjuntar el listener al botón buscar cliente dentro de una tarjeta
  const attachBuscarClienteListener = (container) => {
    const btnBuscarCliente = container.querySelector(".buscar_cliente");
    if (btnBuscarCliente) {
      btnBuscarCliente.addEventListener("click", (e) => {
        e.preventDefault();
        const cedulaInput = container.querySelector(".equip-cedula");
        const cedula = cedulaInput.value.trim();
        const clienteBuscado = container.querySelector(".cliente_buscado");
        if (!cedula) {
          clienteBuscado.innerHTML = `<p style="color:red;">Ingrese un ID válido.</p>`;
          return;
        }
        const url = `https://backend.int-solutionstec.com/api/customer/cedula/${cedula}`;
        fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error("No se encontró el cliente");
            }
            return response.json();
          })
          .then(cliente => {
            clienteBuscado.innerHTML = `
              <div class="cliente">
                <p><strong>ID:</strong> ${cliente.id_customer || ''}</p>
                <p><strong>Nombre:</strong> ${cliente.name || ''}</p>
                <p><strong>Identificación:</strong> ${cliente.cardIdentifi || ''}</p>
                <p><strong>Teléfono:</strong> ${cliente.phone || ''}</p>
                <p><strong>Correo:</strong> ${cliente.mail || ''}</p>
              </div>
            `;
          })
          .catch(error => {
            clienteBuscado.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
          });
      });
    }
  };

  // Función para mostrar un equipo individual (búsqueda por ID Equipo)
  const showEquipment = (equipment) => {
    if (!equipment || Object.keys(equipment).length === 0) {
      resultContainer.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
      return;
    }
    // Se genera el HTML (sin botones inline para borrar/actualizar)
    resultContainer.innerHTML = renderEquipment(equipment, false);
    // Adjuntar el listener para el botón Buscar en este equipo
    const equipmentDiv = resultContainer.querySelector(".equipment");
    if (equipmentDiv) {
      attachBuscarClienteListener(equipmentDiv);
    }
  };

  // Función para extraer los datos de un equipo desde un contenedor específico
  const getEquipmentDataFromCard = (equipmentDiv) => {
    if (!equipmentDiv) return null;
    return {
      id_equip: equipmentDiv.querySelector(".equip-id")?.value,
      model_equip: equipmentDiv.querySelector(".equip-model")?.value,
      brand_equip: equipmentDiv.querySelector(".equip-brand")?.value,
      color_equip: equipmentDiv.querySelector(".equip-color")?.value,
      state_equip: equipmentDiv.querySelector(".equip-state")?.value,
      pass_equip: equipmentDiv.querySelector(".equip-pass")?.value,
      anti_equip: equipmentDiv.querySelector(".equip-antivirus")?.value,
      accessor_equip: equipmentDiv.querySelector(".equip-accessories")?.value,
      reported_equip: equipmentDiv.querySelector(".equip-report")?.value,
      detail_phy_equip: equipmentDiv.querySelector(".equip-detail")?.value,
      temp_equip: equipmentDiv.querySelector(".equip-temp")?.value,
      on_off_equip: equipmentDiv.querySelector(".equip-onoff")?.value === "Encendido",
      cau_dam_equip: equipmentDiv.querySelector(".equip-causa")?.value,
      condEquip: equipmentDiv.querySelector(".equip-cond")?.value,
      cedula_cliente: equipmentDiv.querySelector(".equip-cedula")?.value,
      id_customer: equipmentDiv.querySelector(".equip-idcustomer")?.value,
      name: equipmentDiv.querySelector(".equip-name")?.value
    };
  };

  // Función para renderizar la página con equipos (búsqueda por ID Dueño)
  function renderPage() {
    resultContainer.innerHTML = "";
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageEquipments = filteredEquipments.slice(startIndex, endIndex);

    const gridContainer = document.createElement("div");
    gridContainer.style.gap = "10px";
    if (pageEquipments.length === 1) {
      gridContainer.style.display = "flex";
      gridContainer.style.justifyContent = "center";
    } else if (pageEquipments.length === 2) {
      gridContainer.style.display = "grid";
      gridContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
    } else {
      gridContainer.style.display = "grid";
      gridContainer.style.gridTemplateColumns = "repeat(3, 1fr)";
    }

    pageEquipments.forEach(equip => {
      const equipHTML = renderEquipment(equip, true);
      const equipDiv = document.createElement("div");
      equipDiv.innerHTML = equipHTML;

      // Adjuntar el listener de búsqueda para la cédula del cliente
      attachBuscarClienteListener(equipDiv);

      // Evento para el botón Borrar (inline)
      const btnDelete = equipDiv.querySelector(".Borrar");
      if (btnDelete) {
        btnDelete.addEventListener("click", () => {
          const equipmentId = equipDiv.querySelector(".equip-id")?.value;
          if (!equipmentId) return;
          const deleteUrl = `https://backend.int-solutionstec.com/api/equipment/delete/${equipmentId}`;
          fetch(deleteUrl, { method: "DELETE" })
            .then(response => {
              if (!response.ok) {
                throw new Error("Error al eliminar el equipo");
              }
              return response.text();
            })
            .then(() => {
              showGlobalMessage(`Equipo con ID ${equipmentId} eliminado correctamente.`, "green");
              equipDiv.remove();
            })
            .catch(error => {
              showGlobalMessage(`Error: ${error.message}`, "red");
            });
        });
      }

      // Evento para el botón Actualizar (inline)
      const btnUpdate = equipDiv.querySelector(".Actualizar");
      if (btnUpdate) {
        btnUpdate.addEventListener("click", () => {
          const equipmentData = getEquipmentDataFromCard(equipDiv);
          if (!equipmentData || !equipmentData.id_equip) {
            showGlobalMessage("No se encontró el equipo para actualizar", "red");
            return;
          }
          const updateUrl = `https://backend.int-solutionstec.com/api/equipment/update/${equipmentData.id_equip}`;
          fetch(updateUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(equipmentData)
          })
            .then(response => {
              if (!response.ok) {
                throw new Error("Error al actualizar el equipo");
              }
              return response.text();
            })
            .then(() => {
              showGlobalMessage(`Equipo con ID ${equipmentData.id_equip} actualizado correctamente.`, "green");
            })
            .catch(error => {
              showGlobalMessage(`Error: ${error.message}`, "red");
            });
        });
      }

      gridContainer.appendChild(equipDiv);
    });

    resultContainer.appendChild(gridContainer);
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

  // Eventos para seleccionar el tipo de búsqueda
  btnID.addEventListener("click", () => {
    clearSelected();
    btnID.classList.add("active");
    clearData();
    searchByOwner = false;
    btnBorrarGlobal.style.display = "inline-block";
    btnActualizarGlobal.style.display = "inline-block";
  });

  btnCedula.addEventListener("click", () => {
    clearSelected();
    btnCedula.classList.add("active");
    clearData();
    searchByOwner = true;
    btnBorrarGlobal.style.display = "none";
    btnActualizarGlobal.style.display = "none";
  });

  // Evento submit del formulario: búsqueda según opción activa
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!btnID.classList.contains("active") && !btnCedula.classList.contains("active")) {
      resultContainer.innerHTML = `<p style="color:red;">Por favor, selecciona una opción de búsqueda (ID o ID Dueño)</p>`;
      return;
    }
    const valor = inputField.value.trim();
    if (valor === "") {
      resultContainer.innerHTML = `<p style="color:red;">Por favor ingresa un valor para la búsqueda</p>`;
      return;
    }
    // Búsqueda por ID Equipo
    if (btnID.classList.contains("active")) {
      const url = `https://backend.int-solutionstec.com/api/equipment/find/${valor}`;
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error("La información no existe");
          }
          return response.json();
        })
        .then(data => {
          showEquipment(data);
        })
        .catch(error => {
          resultContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        });
    }
    // Búsqueda por ID Dueño
    else if (btnCedula.classList.contains("active")) {
      fetch("https://backend.int-solutionstec.com/api/equipment/findAll")
        .then(response => {
          if (!response.ok) {
            throw new Error("Error en la solicitud");
          }
          return response.json();
        })
        .then(data => {
          filteredEquipments = data.filter(equip => equip.id_customer == valor);
          if (filteredEquipments.length === 0) {
            resultContainer.innerHTML = `<p style="color:red;">No se encontraron equipos para este cliente.</p>`;
            paginationContainer.innerHTML = "";
          } else {
            showPaginatedEquipments();
          }
        })
        .catch(error => {
          resultContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        });
    }
  });

  // Eventos globales para Borrar y Actualizar (búsqueda por ID Equipo)
  btnBorrarGlobal.addEventListener("click", () => {
    if (!btnID.classList.contains("active")) {
      resultContainer.innerHTML = `<p style="color:red;">La opción Borrar sólo funciona en la búsqueda por ID Equipo</p>`;
      return;
    }
    const equipmentId = resultContainer.querySelector(".equip-id")?.value || inputField.value.trim();
    if (!equipmentId) {
      resultContainer.innerHTML = `<p style="color:red;">No se encontró el ID del equipo para borrar</p>`;
      return;
    }
    const deleteUrl = `https://backend.int-solutionstec.com/api/equipment/delete/${equipmentId}`;
    fetch(deleteUrl, { method: "DELETE" })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al eliminar el equipo");
        }
        return response.text();
      })
      .then(() => {
        showGlobalMessage(`Equipo con ID ${equipmentId} eliminado correctamente.`, "green");
        setTimeout(() => { clearData(); }, 3000);
      })
      .catch(error => {
        resultContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
      });
  });

  btnActualizarGlobal.addEventListener("click", () => {
    if (!btnID.classList.contains("active")) {
      resultContainer.innerHTML = `<p style="color:red;">La opción Actualizar sólo funciona en la búsqueda por ID Equipo</p>`;
      return;
    }
    const equipmentData = getEquipmentDataFromCard(document.querySelector(".equipment"));
    if (!equipmentData || !equipmentData.id_equip) {
      resultContainer.innerHTML = `<p style="color:red;">No se encontró el equipo para actualizar</p>`;
      return;
    }
    const updateUrl = `https://backend.int-solutionstec.com/api/equipment/update/${equipmentData.id_equip}`;
    fetch(updateUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(equipmentData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al actualizar el equipo");
        }
        return response.text();
      })
      .then(() => {
        showGlobalMessage(`Equipo con ID ${equipmentData.id_equip} actualizado correctamente.`, "green");
      })
      .catch(error => {
        resultContainer.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
      });
  });

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
