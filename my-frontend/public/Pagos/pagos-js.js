document.addEventListener('DOMContentLoaded', () => {
  const contenedorDatos = document.getElementById('contenedorDatos');
  const paginationContainer = document.getElementById('pagination');
  const mostrarOpciones = document.getElementById('mostrarOpciones');
  const itemsPerPage = 12;
  let currentPage = 1;
  let payments = [];
  let orders = [];

  // Primero, obtenemos tanto pagos como órdenes
  Promise.all([
    fetch('https://sysgesbe-production.up.railway.app/api/payments/findAll').then(res => res.json()),
    fetch('https://sysgesbe-production.up.railway.app/api/ord_rep/findAll').then(res => res.json())
  ])
  .then(([paymentsData, ordersData]) => {
    payments = paymentsData;
    orders = ordersData;

    if (mostrarOpciones && mostrarOpciones.value === 'todos') {
      showAllPayments();
    } else {
      currentPage = 1;
      showPaginatedPayments();
    }
  })
  .catch(error => {
    console.error('Error al obtener datos:', error);
  });

  if (mostrarOpciones) {
    mostrarOpciones.addEventListener('change', (event) => {
      if (event.target.value === 'todos') {
        showAllPayments();
      } else {
        currentPage = 1;
        showPaginatedPayments();
      }
    });
  }

  function getOrderDetails(orderId) {
    const order = orders.find(o => o.id_order === orderId);
    if (!order) return '';
    return `
      <p><strong>Total de pago:</strong> ${order.tot_pay}</p>
      <p><strong>Cliente:</strong> ID ${order.customer.id_customer} | Nombre: ${order.customer.name}</p>
      <p><strong>Equipo:</strong> ID ${order.equipment.id_equip} | Modelo: ${order.equipment.model_equip} | Estado: ${order.equipment.on_off_equip ? 'Encendido' : 'Apagado'}</p>
      <p><strong>Empleado:</strong> ID ${order.employee.idEmployee} | Nombre: ${order.employee.nameEmployee}</p>
    `;
  }

  function showAllPayments() {
    contenedorDatos.innerHTML = '';
    payments.forEach(payment => {
      const paymentDiv = document.createElement('div');
      paymentDiv.classList.add('customer');
      paymentDiv.innerHTML = `
        <p><strong>ID Pago:</strong> ${payment.id_pay}</p>
        <p><strong>Fecha de Pago:</strong> ${payment.date_pay}</p>
        <p><strong>Saldo:</strong> ${payment.money_pay}</p>
        <p><strong>Abono:</strong> ${payment.money_b_pay}</p>
        <p><strong>ID Orden:</strong> ${payment.order_id}</p>
        ${getOrderDetails(payment.order_id)}
      `;
      contenedorDatos.appendChild(paymentDiv);
    });
    paginationContainer.innerHTML = '';
  }

  function showPaginatedPayments() {
    renderPage();
    renderPaginationControls();
  }

  function renderPage() {
    contenedorDatos.innerHTML = '';
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pagePayments = payments.slice(startIndex, endIndex);

    pagePayments.forEach(payment => {
      const paymentDiv = document.createElement('div');
      paymentDiv.classList.add('customer');
      paymentDiv.innerHTML = `
        <p><strong>ID Pago:</strong> ${payment.id_pay}</p>
        <p><strong>Fecha de Pago:</strong> ${payment.date_pay}</p>
        <p><strong>Saldo:</strong> ${payment.money_pay}</p>
        <p><strong>Abono:</strong> ${payment.money_b_pay}</p>
        <p><strong>ID Orden:</strong> ${payment.order_id}</p>
        ${getOrderDetails(payment.order_id)}
      `;
      contenedorDatos.appendChild(paymentDiv);
    });
  }

  function renderPaginationControls() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(payments.length / itemsPerPage);
    if (totalPages <= 1) return;

    if (currentPage > 1) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Anterior';
      prevButton.addEventListener('click', () => {
        currentPage--;
        renderPage();
        renderPaginationControls();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginationContainer.appendChild(prevButton);
    }

    let startPage, endPage;
    if (totalPages <= 3) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage === 1) {
        startPage = 1;
        endPage = 3;
      } else if (currentPage === totalPages) {
        startPage = totalPages - 2;
        endPage = totalPages;
      } else {
        startPage = currentPage - 1;
        endPage = currentPage + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      if (i === currentPage) {
        pageButton.disabled = true;
      }
      pageButton.addEventListener('click', () => {
        currentPage = i;
        renderPage();
        renderPaginationControls();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginationContainer.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
      const nextButton = document.createElement('button');
      nextButton.textContent = 'Siguiente';
      nextButton.addEventListener('click', () => {
        currentPage++;
        renderPage();
        renderPaginationControls();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      paginationContainer.appendChild(nextButton);
    }
  }

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
