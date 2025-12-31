// Gestion de l'authentification

let users = [];

// Charger les utilisateurs depuis le JSON
function loadUsers() {
  fetch("../assets/data/users.json")
    .then((response) => response.json())
    .then((data) => {
      users = data.users;
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des utilisateurs:", error);
      // Utiliser les utilisateurs par défaut
      users = [
        // { username: 'admin', password: 'admin123' },
        // { username: 'manager', password: 'manager456' }
      ];
    });
}

// Vérifier l'authentification au chargement de la page
document.addEventListener("DOMContentLoaded", function () {
  loadUsers();

  // Si on est sur la page de login
  if (document.getElementById("loginForm")) {
    setupLoginForm();
  } else {
    // Si on est sur le dashboard, vérifier si connecté
    checkAuth();
  }
});

// Configuration du formulaire de login
function setupLoginForm() {
  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    handleLogin();
  });
}

// Gérer la connexion
function handleLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Vérifier les identifiants
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Sauvegarde de la session
    sessionStorage.setItem("isAuthenticated", "true");
    sessionStorage.setItem("currentUser", username);

    // Redirection vers le dashboard
    window.location.href = "index.html";
  } else {
    // Afficher l'erreur
    const errorDiv = document.getElementById("errorMessage");
    errorDiv.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
    errorDiv.style.display = "block";

    // Effacer l'erreur après 3 secondes
    setTimeout(() => {
      errorDiv.style.display = "none";
    }, 3000);
  }
}

// Vérifier l'authentification
function checkAuth() {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated");

  if (!isAuthenticated) {
    // Rediriger vers la page de login
    window.location.href = "login.html";
  }
}

// Déconnexion
function logout() {
  sessionStorage.removeItem("isAuthenticated");
  sessionStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Obtenir l'utilisateur actuel
function getCurrentUser() {
  return sessionStorage.getItem("currentUser");
}
