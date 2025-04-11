document.addEventListener("DOMContentLoaded", () => {
    // Referencias para buscar cliente: usar el nuevo id "cedula_customer"
    const buscarBtn = document.getElementById("buscar_cliente");
    const cedulaInput = document.getElementById("cedula_customer");
    const clienteBuscado = document.querySelector(".cliente_buscado");

    // Referencia al formulario de equipo
    const equipoForm = document.getElementById("equipo-form");

    // Función para mostrar el resultado del cliente en el contenedor
    const mostrarCliente = (cliente) => {
      if (!cliente || Object.keys(cliente).length === 0) {
        clienteBuscado.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
        return;
      }
      clienteBuscado.innerHTML = `
        <div class="cliente">
          <p><strong>ID:</strong> ${cliente.id_customer || ''}</p>
          <p><strong>Nombre:</strong> ${cliente.name || ''}</p>
          <p><strong>Identificación:</strong> ${cliente.cardIdentifi || ''}</p>
          <p><strong>Teléfono:</strong> ${cliente.phone || ''}</p>
          <p><strong>Correo:</strong> ${cliente.mail || ''}</p>
        </div>
      `;
    };

    // Función para mostrar errores en el contenedor de cliente
    const mostrarError = (mensaje) => {
      clienteBuscado.innerHTML = `<p style="color: red;">Error: ${mensaje}</p>`;
    };

    // Evento click para el botón Buscar cliente usando "cedula_customer"
    buscarBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevenir comportamiento por defecto
      const cedula = cedulaInput.value.trim();
      if (cedula === "") {
        mostrarError("Ingrese una cédula válida.");
        return;
      }
      // URL de la API para buscar cliente; asegúrate de que este endpoint exista
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

    // Evento submit para guardar el equipo. Se toma el id del cliente desde el input con id "id_customer"
    equipoForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Se recopilan los datos de los inputs
      const model_equip = document.getElementById("model_equip").value.trim();
      const brand_equip = document.getElementById("brand_equip").value.trim();
      const color_equip = document.getElementById("color_equip").value.trim();
      const state_equip = document.getElementById("state_equip").value.trim();
      const pass_equip = document.getElementById("pass_equip").value.trim();
      const anti_equip = document.getElementById("anti_equip").value.trim();
      const accessor_equip = document.getElementById("accessor_equip").value.trim();
      const reported_equip = document.getElementById("reported_equip").value.trim();
      const detail_phy_equip = document.getElementById("detail_phy_equip").value.trim();
      const temp_equip = document.getElementById("temp_equip").value.trim();
      const on_off_equip = document.getElementById("on_off_equip").value === "true"; // Convertir a boolean
      const cau_dam_equip = document.getElementById("cau_dam_equip").value.trim();
      const condEquip = document.getElementById("condEquip").value;
      const id_customer = parseInt(document.getElementById("id_customer").value);  // Este es el input de ID Cliente

      // Construir el payload JSON
      const payload = {
        model_equip,
        brand_equip,
        color_equip,
        state_equip,
        pass_equip,
        anti_equip,
        accessor_equip,
        reported_equip,
        detail_phy_equip,
        temp_equip,
        on_off_equip,
        cau_dam_equip,
        condEquip,
        id_customer
      };

      // URL de la API para guardar equipo
      const url = "https://sysgesbe-production.up.railway.app/api/equipment/save";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(response => {
          if (!response.ok) {
            return response.text().then(text => { throw new Error(text) });
          }
          return response.json();
        })
        .then(data => {
          // Puedes mostrar un mensaje de éxito o redirigir
          document.getElementById("mensaje").innerHTML = `<p style="color: green;">Equipo guardado con éxito, ID: ${data.id}</p>`;
          equipoForm.reset(); // Limpia el formulario
        })
        .catch(error => {
          document.getElementById("mensaje").innerHTML = `<p style="color: red;">Error al guardar el equipo: ${error.message}</p>`;
        });
    });

    // Modo oscuro
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
