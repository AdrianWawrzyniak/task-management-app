const API_URL = 'http://localhost:3000/api';


// Przełączanie między logowaniem a rejestracją
document.getElementById('show-register-btn').addEventListener('click', () => {
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('register-section').classList.remove('hidden');
});
  
document.getElementById('show-login-btn').addEventListener('click', () => {
  document.getElementById('register-section').classList.add('hidden');
  document.getElementById('login-section').classList.remove('hidden');
});
  
// Ukrycie sekcji rejestracji przy otwarciu strony
  document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('register-section').classList.add('hidden');
});
  


// Funkcja do sprawdzenia stanu zalogowania
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const isLoggedIn = !!token; // Sprawdza czy użytkownik jest zalogowany
  
    const loginSection = document.getElementById('login-section');
    const registerSection = document.getElementById('register-section');
    const tasksSection = document.getElementById('tasks-section');
    const logoutButton = document.getElementById('logout-btn');
    const newTaskBtn = document.getElementById('new-task-btn');
  
    if (isLoggedIn) {
      // zalogowany
      loginSection.classList.add('hidden');
      registerSection.classList.add('hidden');
      tasksSection.classList.remove('hidden');
      logoutButton.classList.remove('hidden');
      newTaskBtn.disabled = false; // Aktywuj przycisk "Add New Task"
    } else {
      // nie jest zalogowany
      loginSection.classList.remove('hidden');
      registerSection.classList.remove('hidden');
      tasksSection.classList.add('hidden');
      logoutButton.classList.add('hidden');
      newTaskBtn.disabled = true; // Dezaktywuj przycisk "Add New Task"
    }
  }
  
  // Wylogowanie użytkownika
  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('token'); // Usuwanie tokenu
    checkLoginStatus(); // aktualizacja widocznosci elementów
    alert('You have been logged out');
    location.reload();
  });
  
  
  // Logowanie użytkownika
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const messageDiv = document.getElementById('login-message');
  
    messageDiv.textContent = '';
    messageDiv.classList.add('hidden');
    messageDiv.classList.remove('success', 'error'); // Usuń wcześniejsze alerty
    try {
      const res = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token); // Zapisz token w localStorage
        checkLoginStatus(); // widocznosc elementow
        loadTasks(); // ladowanie zadan
      } else {
        const error = await res.json();
        messageDiv.textContent = error.message || 'Registration failed';
        messageDiv.classList.remove('hidden'); // wyświetl
        messageDiv.classList.add('error'); //usuń
        console.log('Message div after error:', messageDiv);
        document.getElementById('show-login-btn').click();
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  });
  
  // Funkcja inicjalizująca
  function initApp() {
    checkLoginStatus(); // Sprawdź stan zalogowania przy ładowaniu strony
    if (localStorage.getItem('token')) {
      loadTasks(); // Jeśli użytkownik jest zalogowany, wczytaj strone
    }
  }
  
  initApp();


// Przycisk "Add New Task"
document.getElementById('new-task-btn').addEventListener('click', () => {
  const newTaskSection = document.getElementById('new-task-section');
  if (newTaskSection.classList.contains('hidden')) {
    newTaskSection.classList.remove('hidden'); // wyświetl formularz
  } else {
    newTaskSection.classList.add('hidden'); // usuń formularz
  }
});


// Tworzenie nowego zadania
document.getElementById('new-task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-desc').value;
  const priority = document.getElementById('task-priority').value;

  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title, description, priority }),
    });

    if (res.ok) {
      alert('Task created successfully');
      loadTasks();
      document.getElementById('new-task-section').classList.add('hidden'); // Ukryj 
      document.getElementById('new-task-form').reset(); // Wyczyść 
    } else {
      alert('Failed to create task');
    }
  } catch (error) {
    console.error('Error creating task:', error);
  }
});



// rejestracja
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault(); // Zapobiega odświeżeniu strony

  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const messageDiv = document.getElementById('register-message');

  // Ukryj poprzedni komunikat
  messageDiv.textContent = '';
  messageDiv.classList.add('hidden');
  messageDiv.classList.remove('success', 'error'); // Usuń alerty

  try {
    const res = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }), // Konwertuje dane do JSON
    });

    if (res.ok) {
      // Udana rejestracja
      messageDiv.textContent = 'Registered successfully!';
      messageDiv.classList.remove('hidden'); // Pokaż 
      messageDiv.classList.add('success'); // pozytywny komunikat
      console.log('Message div after success:', messageDiv);
      setTimeout(() => {
        document.getElementById('show-login-btn').click();
      }, 2000); // 2-sekundowa pauza
    } else {
      
      
      // Nieudana rejestracja
      const error = await res.json();
      messageDiv.textContent = error.message || 'Registration failed';
      messageDiv.classList.remove('hidden'); // Pokaż komunikat
      messageDiv.classList.add('error'); // negatywny komunikat
      console.log('Message div after error:', messageDiv);
      
    }
  } catch (error) {


    // Obsługa błędów 
    console.error('Error registering:', error);
    messageDiv.textContent = 'An error occurred. Please try again.';
    messageDiv.classList.remove('hidden'); // Pokaż
    messageDiv.classList.add('error'); // negatywny komunikat
  }
});
// Wawrzyniak Adrian 155691

// funkcja od ładowania tasków
async function loadTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });

    if (res.ok) {
      const tasks = await res.json();
      const tasksTableBody = document.querySelector('#tasks-table tbody');
      tasksTableBody.innerHTML = ''; // Wyczyszczenie tabeli przed dodaniem nowych wierszy

      tasks.forEach(task => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${task.id}</td>
          <td>${task.title}</td>
          <td>${task.description || 'No description'}</td>
          <td>${task.priority}</td>
          <td>${new Date(task.createdAt).toLocaleString()}</td>
          <td>
            <button class="delete-btn" data-id="${task.id}">Delete</button>
          </td>
        `;

        tasksTableBody.appendChild(row);
      });

      // przycisk do usuwania
      setupDeleteButtons();
    } else {
      console.error('Error fetching tasks:', res.statusText);
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}

  function setupDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const taskId = e.target.getAttribute('data-id');

      if (confirm('Are you sure you want to delete this task?')) {
        try {
          const res = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });

          if (res.ok) {
            alert('Task deleted successfully');
            loadTasks(); // Odświeżenie listy
          } else {
            alert('Failed to delete task');
          }
        } catch (error) { //obsluga errorów
          console.error('Error deleting task:', error);
          alert('An error occurred while deleting the task');
        }
      }
    });
  });
}
