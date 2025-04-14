document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del DOM
  const btnID = document.getElementById("btnID");
  const inputField = document.querySelector(".CampoBuscar input");
  const resultContainer = document.querySelector(".result-container");
  const form = document.getElementById("CampoBuscar1");
  const btnBorrar = document.getElementById("btnBorrar");
  const btnActualizar = document.getElementById("btnActualizar");

  // Referencias a elementos del modal de confirmación
  const modalConfirm = document.getElementById("modalConfirm");
  const confirmYes = document.getElementById("confirmYes");
  const confirmNo = document.getElementById("confirmNo");

  let pendingDeleteId = null;
  let searchedId = null; // Variable para guardar el número ingresado en la búsqueda

  // Función para quitar la clase "active" (en este caso solo btnID)
  const clearSelected = () => {
    btnID.classList.remove("active");
  };

  // Función para limpiar el campo de entrada y resultados
  const clearData = () => {
    inputField.value = "";
    resultContainer.innerHTML = "";
    searchedId = null;
  };

  // Función para mostrar el resultado formateado en inputs para edición
  const showResult = (order) => {
    if (!order || Object.keys(order).length === 0) {
      resultContainer.innerHTML = `<p style="color: red;">No se encontró información.</p>`;
      return;
    }
    // Se mostrará únicamente la información necesaria, marcando como readonly los campos que no se pueden modificar
    resultContainer.innerHTML = `
      <div class="order">
        <h3>Datos de la Orden</h3>
        <p><strong>ID Orden:</strong> <input type="text" id="editId" value="${order.id_order || ''}" readonly></p>
        <p><strong>Fecha de Creación:</strong> <input type="text" id="editCreateDate" value="${order.create_date || ''}" readonly></p>
        <p><strong>Fecha Límite:</strong> <input type="text" id="editDeadline" value="${order.deadline || ''}"></p>
        <p><strong>Total a Pagar:</strong> <input type="text" id="editTotPay" value="${order.tot_pay || ''}"></p>
        <p><strong>Detalles Adicionales:</strong> <input type="text" id="editAdditDetails" value="${order.addit_details || ''}"></p>
        
        <h3>Datos del Cliente</h3>
        <p><strong>ID Cliente:</strong> <input type="text" id="editCustomerId" value="${order.customer?.id_customer || ''}" readonly></p>
        <p><strong>Nombre:</strong> <input type="text" id="editCustomerName" value="${order.customer?.name || ''}" readonly></p>
        <p><strong>Cédula:</strong> <input type="text" id="editCardIdentifi" value="${order.customer?.cardIdentifi || ''}" readonly></p>
        <p><strong>Teléfono:</strong> <input type="text" id="editCustomerPhone" value="${order.customer?.phone || ''}" readonly></p>
        <p><strong>Correo:</strong> <input type="text" id="editCustomerMail" value="${order.customer?.mail || ''}" readonly></p>
        
        <h3>Datos del Equipo</h3>
        <p><strong>ID Equipo:</strong> <input type="text" id="editEquipId" value="${order.equipment?.id_equip || ''}" readonly></p>
        <p><strong>Modelo:</strong> <input type="text" id="editModelEquip" value="${order.equipment?.model_equip || ''}" readonly></p>
        <p><strong>Marca:</strong> <input type="text" id="editBrandEquip" value="${order.equipment?.brand_equip || ''}" readonly></p>
        <p><strong>Color:</strong> <input type="text" id="editColorEquip" value="${order.equipment?.color_equip || ''}" readonly></p>
        <p><strong>Estado:</strong> <input type="text" id="editStateEquip" value="${order.equipment?.state_equip || ''}" readonly></p>
        <p><strong>Contraseña:</strong> <input type="text" id="contraseña" value="${order.equipment?.pass_equip || ''}" readonly></p>
        <p><strong>Antivirus:</strong> <input type="text" id="editAntiEquip" value="${order.equipment?.anti_equip || ''}" readonly></p>
        <p><strong>Accesorios:</strong> <input type="text" id="editAccessorEquip" value="${order.equipment?.accessor_equip || ''}" readonly></p>
        <p><strong>Detalles Físicos:</strong> <input type="text" id="editOtherEquip" value="${order.equipment?.detail_phy_equip || ''}" readonly></p>
        <p><strong>Temperatura:</strong> <input type="text" id="editTempEquip" value="${order.equipment?.temp_equip || ''}" readonly></p>
        <p><strong>Encendido/Apagado:</strong> <input type="text" id="editOnOffEquip" value="${order.equipment?.on_off_equip ? 'Encendido' : 'Apagado'}" readonly></p>
        <p><strong>Causa del daño:</strong> <input type="text" id="editCauDamEquip" value="${order.equipment?.cau_dam_equip || ''}" readonly></p>
        <p><strong>Condición del Equipo:</strong> <input type="text" id="editCondEquip" value="${order.equipment?.condEquip || ''}" readonly></p>
        
        <h3>Datos del Pago (primer pago)</h3>
        <p><strong>ID Pago:</strong> <input type="text" id="editPayId" value="${order.payments && order.payments.length > 0 ? order.payments[0].id_pay : ''}" readonly></p>
        <p><strong>Fecha Pago:</strong> <input type="text" id="editDatePay" value="${order.payments && order.payments.length > 0 ? order.payments[0].date_pay : ''}" readonly></p>
        <p><strong>Monto Pagado:</strong> <input type="text" id="editMoneyPay" value="${order.payments && order.payments.length > 0 ? order.payments[0].money_pay : ''}" readonly></p>
        <p><strong>Monto Banco:</strong> <input type="text" id="editMoneyBPay" value="${order.payments && order.payments.length > 0 ? order.payments[0].money_b_pay : ''}" readonly></p>
        
        <h3>Datos del Empleado</h3>
        <p><strong>ID Empleado:</strong> <input type="text" id="editEmployeeId" value="${order.employee?.idEmployee || ''}" readonly></p>
        <p><strong>Nombre Empleado:</strong> <input type="text" id="editEmployeeName" value="${order.employee?.nameEmployee || ''}" readonly></p>
      </div>
    `;
  };

  // Función para mostrar errores
  const showError = (error) => {
    resultContainer.innerHTML = `<p style="color: red;">Error: ${error}</p>`;
  };

  // Activar la búsqueda por ID
  btnID.addEventListener("click", () => {
    clearSelected();
    btnID.classList.add("active");
    clearData();
  });

  // Evento submit del formulario: realiza la búsqueda por ID
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!btnID.classList.contains("active")) {
      showError("Por favor, selecciona la opción de búsqueda por ID");
      return;
    }
    const valor = inputField.value.trim();
    if (valor === "") {
      showError("Por favor ingresa un valor para la búsqueda");
      return;
    }
    // Se asigna el número buscado a la variable global searchedId
    searchedId = valor;
    const url = `https://sysgesbe-production.up.railway.app/api/ord_rep/find/${valor}`;
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("La información no existe");
        }
        return response.json();
      })
      .then(data => {
        showResult(data);
      })
      .catch(error => {
        showError(error.message);
      });
  });

  // Evento para el botón Borrar: muestra el modal de confirmación
  btnBorrar.addEventListener("click", () => {
    if (!btnID.classList.contains("active")) {
      showError("Para borrar, selecciona la opción ID");
      return;
    }
    const valor = inputField.value.trim();
    if (valor === "") {
      showError("Por favor ingresa el ID para borrar");
      return;
    }
    pendingDeleteId = valor;
    modalConfirm.classList.remove("hidden");
  });

  // Evento para confirmar el borrado
  confirmYes.addEventListener("click", () => {
    if (!pendingDeleteId) return;
    const url = `https://sysgesbe-production.up.railway.app/api/ord_rep/delete/${pendingDeleteId}`;
    fetch(url, { method: "DELETE" })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al borrar el registro");
        }
        return response.text();
      })
      .then(() => {
        inputField.value = "";
        resultContainer.innerHTML = `<p style="color: green;">Registro Eliminado</p>`;
        pendingDeleteId = null;
        modalConfirm.classList.add("hidden");
      })
      .catch(error => {
        showError(error.message);
        pendingDeleteId = null;
        modalConfirm.classList.add("hidden");
      });
  });

  // Evento para cancelar el borrado
  confirmNo.addEventListener("click", () => {
    pendingDeleteId = null;
    modalConfirm.classList.add("hidden");
  });

  // Evento para el botón Actualizar
  btnActualizar.addEventListener("click", () => {
    if (!btnID.classList.contains("active")) {
      showError("Para actualizar, selecciona la opción ID");
      return;
    }
    // Verificar que se haya realizado una búsqueda previa
    if (!searchedId) {
      showError("No hay registro para actualizar. Realiza una búsqueda primero.");
      return;
    }

    // Solo se leen los valores permitidos para actualizar
    const deadline = document.getElementById("editDeadline").value.trim();
    const tot_pay = document.getElementById("editTotPay").value.trim();
    const addit_details = document.getElementById("editAdditDetails").value.trim();

    // Se toman los IDs de las relaciones (de los inputs readonly)
    const customer = {
      id_customer: document.getElementById("editCustomerId").value.trim()
    };
    const equipment = {
      id_equip: document.getElementById("editEquipId").value.trim()
    };
    const employee = {
      idEmployee: document.getElementById("editEmployeeId").value.trim()
    };

    // Construcción del payload con solo los campos actualizables
    const payload = { deadline, tot_pay, addit_details, customer, equipment, employee };

    // Construir la URL de actualización utilizando el número buscado
    const url = `https://sysgesbe-production.up.railway.app/api/ord_rep/update/${searchedId}`;

    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Error al actualizar el registro");
        }
        return response.text();
      })
      .then(() => {
        resultContainer.innerHTML = `<p style="color: green;">Registro Actualizado</p>`;
        setTimeout(() => {
          clearData();
        }, 3000);
      })
      .catch(error => {
        showError(error.message);
      });
  });
  function generarWord() {
    // Usar variables globales para rellenar el contenido
    const fechaOrden = new Date().toLocaleDateString();
    const idCliente = selectedCustomer ? selectedCustomer.id_customer : "__________________";
    const nombreCliente = selectedCustomer ? selectedCustomer.name : "__________________";
    const telefono = selectedCustomer ? selectedCustomer.phone : "__________________";
    const identificacion = selectedCustomer ? selectedCustomer.cardIdentifi : "__________________";
    const mail = selectedCustomer ? selectedCustomer.mail : "__________________";
    
    //Variables para Empleado
    const idEmpleado = selectedEmployee ? selectedEmployee.idEmployee : "__________________";
    const nombreEmpleado = selectedEmployee ? selectedEmployee.nameEmployee : "__________________";
    const positionEmployee = selectedEmployee ? selectedEmployee.positionEmployee : "__________________";
    const cedEmployee  = selectedEmployee ? selectedEmployee. cedEmployee: "__________________";
    const telEmpployee  = selectedEmployee ? selectedEmployee.telEmpployee : "__________________";
    const dirEmpployee  = selectedEmployee ? selectedEmployee.dirEmployee : "__________________";


    // Variables para el equipo
    //Variables fuera de la tabla
    const IDEquipo = selectedEquipment ? selectedEquipment.id_equip : "__________________";
    const modeloEquipo = selectedEquipment ? selectedEquipment.model_equip : "__________________";
    const MarcaEquipo = selectedEquipment ? selectedEquipment.brand_equip : "__________________";
    const detalleEquipo = selectedEquipment ? selectedEquipment.detail_phy_equip : "__________________";
    const estadoEquipo = selectedEquipment ? selectedEquipment.state_equip : "__________________";
    //Variables dentro de la tabla sobre el equipo
    const encendido = selectedEquipment ? (selectedEquipment.on_off_equip ? "Encendido" : "Apagado") : "__________________";
    const color = selectedEquipment ? selectedEquipment.color_equip : "__________________";
    const contraseña = selectedEquipment ? selectedEquipment.pass_equip : "__________________";
    const antiguedad = selectedEquipment ? selectedEquipment.anti_equip : "__________________";
    const accesorios = selectedEquipment ? selectedEquipment.accessor_equip : "__________________";
    const Reporte = selectedEquipment ? selectedEquipment.reported_equip : "__________________";
    const temperatura = selectedEquipment ? selectedEquipment.temp_equip : "__________________";
    const daño_causado = selectedEquipment ? selectedEquipment.cau_dam_equip : "__________________";
    const condicion = selectedEquipment ? selectedEquipment.condEquip : "__________________";

    //Variables para la orden de pago 
    const idOrden = selectedOrden ? selectedOrden.orderId : "Valor por defecto";
    const fechaRecepcion = selectedOrden ? selectedOrden.create_date : "Valor por defecto";
    const fechaEntrega = selectedOrden ? selectedOrden.deadline : "Valor por defecto";
    const totalPagoo = selectedOrden ? selectedOrden.tot_pay : "Valor por defecto";
    const DetallesAdicionales = selectedOrden ? selectedOrden.addit_details : "Valor por defecto";

    //Variables para el pago
    const idPago = selectedPayment ? selectedPayment.id_pay : "Valor por defecto";
    const fechaDelPago = selectedPayment ? selectedPayment.date_pay : "Valor por defecto";
    const saldoDelPago = selectedPayment ? selectedPayment.money_pay : "Valor por defecto";
    const abonoDelPago = selectedPayment ? selectedPayment.money_b_pay : "Valor por defecto";
    const TotaldePagooo = Number(selectedPayment.order_tot_pay) - Number(selectedPayment.money_b_pay);



 


    
    
    // Contenido HTML del Word con estilos y la información combinada
  // Contenido HTML del Word con estilos y la información combinada
  const contenido = `
  <html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word" 
      xmlns="http://www.w3.org/TR/REC-html40">
  <head>
    <meta charset="utf-8">
    <style>
      @page { margin: 10mm; }
      body { 
        font-family: Arial, sans-serif; 
        padding: 10px; 
        font-size: 9px;
        line-height: 1.2;
      }
      hr {
        border: none;
        border-top: 1px solid #000;
        margin: 5px 0;
      }
      /* Reducimos ligeramente el margen superior para datos en la misma fila */
      .datos-row {
        display: flex;
        justify-content: space-between;
        margin-top: 5px;
      }
      .datos-col {
        width: 48%;
      }
      table {
        border-collapse: collapse;
        margin-top: 5px;
        font-size: 10px; /* Tamaño de letra aumentado */
        width: 100%;     /* Ocupa el 100% del ancho */
      }
      th, td {
        border: 1px solid black;
        padding: 3px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
      .separador {
        margin-top: 5px; /* Se reduce el espacio superior para unir secciones */
      }
      .info-final {
        margin-top: 10px;
        width: 100%;
        display: table;
      }
      .info-final > div {
        display: table-cell;
        vertical-align: top;
      }
      .info-final .izq { text-align: left; }
      .info-final .der { text-align: right; margin-top: -5px; }
      .alerta {
        background-color: #d3d3d3;
        padding: 5px;
        margin-top: 5px;
        font-size: 8px;
      }
      .tablas-lado {
        display: flex;
        justify-content: space-between;
        gap: 10px;
      }
      .tabla-pequena {
        flex: 1;
        max-width: 48%;
      }
      .tabla-pequena table {
        width: auto;
      }
      .tabla-pequena p {
        text-align: center;
        margin: 0 0 5px;
      }
      .encabezadoo{
        text-align: center;
        margin-bottom: 5px;
      }
      /* Se agrega una clase para “ID Equipo” y se reduce el margen superior */
      .info-equipo-inicial {
        margin-top: -5px;
      }
      /* Para la cabecera de la tabla “Información del Equipo” */
      .titulo-info-equipo {
        margin-bottom: 2px;
        font-weight: bold;
      }
      /* Para subir el bloque de Observaciones junto al título */
      .observaciones {
        margin-top: 0;
      }
      /* Estilo para el logo */
      .Logo {
        height: 50px; /* Ajusta la altura según lo pequeño que necesites */
        width: auto;
      }
      /* Contenedor del logo y encabezado */
      .header-container {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
      }
      .header-text {
        flex: 1;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="header-container">
      <div class="header-text">
        <h3 style="margin: 2px;">Orden de Trabajo</h3>
        <h4 style="margin: 2px;">INT-SOLUTIONS</h4>
        <h6 style="margin: 2px;">PIO XII Y AMALIA URÍGÜEN, DIAGONAL A LA ESCUELA DE MONJAS ELENA ENRÍQUEZ</h6>
      </div>
    </div>
    <hr>
  
    <div class="info-equipo-inicial">
      ID Orden de Pago: ${idOrden} <br>
      FECHA: ${fechaOrden}
    </div>
    
    <p>
      <strong>ID Equipo:</strong> ${id_equip}  <br>
      <strong>Modelo:</strong> ${modeloEquipo}  <br>
      <strong>Marca:</strong> ${MarcaEquipo}  <br>
      <strong>Detalle:</strong> ${detalleEquipo}  <br>
      <strong>Estado:</strong> ${estadoEquipo}  
    </p>
  
    <!-- Datos del Cliente y Empleado en la misma fila -->
    <div class="datos-row">
      <div class="datos-col">
        <strong>Datos Cliente</strong> <br>
        <strong>Cliente:</strong> <strong>ID:</strong> ${idCliente} | <strong>Nombre:</strong> ${nombreCliente} <br>
        <strong>Identificación:</strong> ${identificacion}<br>
        <strong>Teléfono:</strong> ${telefono}<br>
        <strong>Correo:</strong> ${mail}<br>
      </div>
      <div class="datos-col">
        <strong>Datos Empleado</strong><br>
        <strong>Empleado:</strong> <strong>ID:</strong> ${idEmpleado} | <strong>Nombre:</strong> ${nombreEmpleado} <br>
        <strong>Teléfono:</strong> ${telEmpployee}<br>
      </div>
    </div>
  
    <!-- Sección de Información del Equipo con título más cerca de la tabla -->
    <div class="titulo-info-equipo">
      <p class="titulo-info-equipo">Información del Equipo</p>
      <table>
        <tr>
          <td><strong>Encendido/Apagado</strong></td>
          <td>${encendido}</td>
        </tr>
        <tr>
          <td><strong>Color</strong></td>
          <td>${color}</td>
        </tr>
        <tr>
          <td><strong>Contraseña</strong></td>
          <td>${contraseña}</td>
        </tr>
        <tr>
          <td><strong>Antigüedad</strong></td>
          <td>${antiguedad}</td>
        </tr>
        <tr>
          <td><strong>Accesorios</strong></td>
          <td>${accesorios}</td>
        </tr>
        <tr>
          <td><strong>Reporte</strong></td>
          <td>${Reporte}</td>
        </tr>
        <tr>
          <td><strong>Temperatura</strong></td>
          <td>${temperatura}</td>
        </tr>
        <tr>
          <td><strong>Daño</strong></td>
          <td>${daño_causado}</td>
        </tr>
        <tr>
          <td><strong>Condición</strong></td>
          <td>${condicion}</td>
        </tr>
      </table>
    </div>
    <br> 
  
    <strong>Orden de Pago</strong> <br>
    <strong>Fecha de Recepción: </strong>${fechaRecepcion}  <br>
    <strong>Fecha de Entrega: </strong>${fechaEntrega}  <br>
    <strong>Detalles Adicionales: </strong>${DetallesAdicionales}  <br>
    <strong>Total de Pago: </strong>${totalPagoo}  <br>
    <br>
  
    <strong>Información de Pago</strong> <br>
    <strong>Fecha del Pago: </strong>${fechaDelPago}  <br>
    <strong>Saldo del Pago: </strong>${saldoDelPago}  <br>
    <strong>Abono del Pago: </strong>${abonoDelPago}  <br>
    <strong>Total del Pago: </strong>${TotaldePagooo}  <br>
    <br>
  
    <div class="seccion-info">
      <p>
        <strong>Fabián Paucar</strong><br>
        TÉCNICO<br>
        Telf: 0984523160
      </p>
    </div>
  
    <div class="seccion-info">
      <p>
        <strong>Cliente</strong><br>
        CI: ${identificacion}
      </p>
    </div>
  
    <!-- Sección de Observaciones con ajuste para el texto "No se da garantía" -->
    <div class="separador observaciones">
      
      <p>
      <strong>OBSERVACIONES:</strong> <br>
        No se da garantía de ningún tipo cuando se reciben los equipos apagados.<br>
        Todo equipo se toma con riesgo, puesto que por una pieza reparada se puede dañar otra por la manipulación o por el daño obtenido del uso.<br>
        No hay garantía de displays. Es responsabilidad del cliente comprobar la mercadería, puesto que una vez salida del establecimiento, el cliente puede ocasionar algún daño.<br>
        El establecimiento no se responsabiliza por equipos reportados o robados. En caso de que vengan las autoridades y sean confiscados, NO HAY GARANTÍA DE NINGÚN TIPO EN EQUIPOS MOJADOS, TORCIDOS O FISURADOS. Cualquier dispositivo con estas características será recibido bajo el riesgo del cliente.<br>
        Al firmar este documento, el cliente acepta todas las condiciones y observaciones que se estipulan en el mismo.<br>
        Se cobrará 5 dólares por la revisión, sirva o no el dispositivo.
      </p>
      <div class="alerta">
        PASADO 3 MESES DESDE LA RECEPCIÓN DEL EQUIPO, SI NO ES RETIRADO, SE PROCEDERÁ A REMATAR EL DISPOSITIVO SIN OPCIÓN A RECLAMOS.
      </div>
    </div>
  </body>
</html>

  `;
  


    // Generación del archivo Word
    const blob = new Blob([contenido], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "OrdenDeTrabajo.doc";
    a.click();
    URL.revokeObjectURL(url);


  }
  
  // Asignar el evento al botón (asegúrate de que el elemento con id "generarDocBtn" exista)
  document.getElementById("btnDescargar").addEventListener("click", generarWord);
  const btnDarkMode = document.getElementById("btn-dark-mode");

    // Aplicar el modo oscuro si estaba activado
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
