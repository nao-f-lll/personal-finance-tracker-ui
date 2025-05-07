function login() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const user = usernameInput.value.trim();
    const pass = passwordInput.value;
  
    if (user === 'admin' && pass === '1234') {
      localStorage.setItem('loggedIn', 'true');
      showApp();
    } else {
      alert('Credenciales inválidas');
  
      // Limpiar contraseña y volver a enfocar
      passwordInput.value = '';
      passwordInput.focus();
  
      // NO deshabilitar nada ni tocar el display
    }
  }
  
  
  function handleSubmit(e) {
    e.preventDefault(); 
    login();
  }
  
  function showApp() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('main-app').style.display = 'flex';
    navigateTo('home.html');
  }
  
  function checkLogin() {
    localStorage.removeItem('loggedIn'); // <-- fuerza logout al iniciar
  
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('main-app').style.display = 'none';
  
    const usernameInput = document.getElementById('username');
    if (usernameInput) usernameInput.focus();
  }
  

  
  // ---------- NAVEGACIÓN ENTRE PÁGINAS ----------
  function navigateTo(page) {
    fetch(page)
      .then(response => response.text())
      .then(html => {
        document.getElementById('content').innerHTML = html;
  
        if (page === 'home.html') {
          initHome();
        }
      });
  }
  
  // ---------- HOME ----------
  function initHome() {
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpenses = 0;
    let transactions = [];
  
    function updateUI() {
      document.getElementById('total-balance').textContent = `€${totalBalance.toFixed(2)}`;
      document.getElementById('total-income').textContent = `€${totalIncome.toFixed(2)}`;
      document.getElementById('total-expenses').textContent = `€${totalExpenses.toFixed(2)}`;
  
      const transactionsList = document.getElementById('transactions-list');
      transactionsList.innerHTML = '';
      transactions.forEach(tx => {
        const li = document.createElement('li');
        li.textContent = `${tx.type} de €${tx.amount.toFixed(2)} el ${tx.date}`;
        transactionsList.appendChild(li);
      });
  
      updateChart();
    }
  
    function addIncome() {
      const amount = prompt('Introduce ingreso:');
      if (amount && !isNaN(amount)) {
        totalIncome += +amount;
        totalBalance += +amount;
        transactions.push({ type: 'Ingreso', amount: +amount, date: new Date().toLocaleString() });
        updateUI();
      }
    }
  
    function addExpense() {
      const amount = prompt('Introduce gasto:');
      if (amount && !isNaN(amount)) {
        totalExpenses += +amount;
        totalBalance -= +amount;
        transactions.push({ type: 'Gasto', amount: +amount, date: new Date().toLocaleString() });
        updateUI();
      }
    }
  
    function updateChart() {
      const ctx = document.getElementById('financeChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Ingresos', 'Gastos'],
          datasets: [{
            data: [totalIncome, totalExpenses],
            backgroundColor: ['#28a745', '#dc3545']
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  
    // Exponer para botones
    window.addIncome = addIncome;
    window.addExpense = addExpense;
  
    updateUI();
  }
  
  // ---------- AL CARGAR ----------
  window.onload = checkLogin;
  