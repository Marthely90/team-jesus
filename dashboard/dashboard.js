let rapportData = {};
let videoData = {};
let editingRapportId = null;
let editingVideoId = null;

// Initialisation
document.addEventListener("DOMContentLoaded", function () {
  loadRapportData();
  loadVideoData();
  setupFormListeners();
  displayUserInfo();
});

// ==================== RAPPORT FUNCTIONS ====================

function loadRapportData() {
  fetch("../assets/data/rapport.json")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load rapport data");
      return response.json();
    })
    .then((data) => {
      rapportData = data;
      displayRapportTable();
    })
    .catch((error) => {
      console.error("Error loading rapport data:", error);
      const stored = localStorage.getItem("rapportData");
      if (stored) {
        rapportData = JSON.parse(stored);
        displayRapportTable();
      }
    });
}

function displayRapportTable() {
  const list = document.getElementById("rapport-list");
  list.innerHTML = "";

  Object.keys(rapportData).forEach((key) => {
    const rapport = rapportData[key];
    const item = document.createElement("div");
    item.className = "rapport-item";
    item.innerHTML = `
      <div class="rapport-item-content">
        <div class="rapport-info">
          <h6 class="rapport-name">${rapport.nom}</h6>
          <span class="rapport-category">${rapport.categorie}</span>
          <small class="rapport-date">${rapport.date}</small>
        </div>
        <div class="rapport-actions">
          <a href="${rapport.url}" target="_blank" class="btn btn-sm btn-outline-primary"><i class="fas fa-external-link-alt"></i> Ouvrir</a>
          <button class="btn btn-sm btn-warning" onclick="editRapport('${key}')"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-danger" onclick="deleteRapport('${key}')"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;
    list.appendChild(item);
  });
}

function openRapportForm() {
  editingRapportId = null;
  const form = document.getElementById("rapport-form");
  const formTitle = form.querySelector("h5");
  if (formTitle) {
    formTitle.textContent = "Nouveau Rapport";
  }
  form.style.display = "block";
  document.getElementById("rapportFormElement").reset();
}

function closeRapportForm() {
  document.getElementById("rapport-form").style.display = "none";
  editingRapportId = null;
}

function editRapport(key) {
  const rapport = rapportData[key];
  editingRapportId = key;

  document.getElementById("rapport-nom").value = rapport.nom;
  document.getElementById("rapport-categorie").value = rapport.categorie;
  document.getElementById("rapport-url").value = rapport.url;
  document.getElementById("rapport-date").value = rapport.date;

  const form = document.getElementById("rapport-form");
  const formTitle = form.querySelector("h5");
  if (formTitle) {
    formTitle.textContent = "Modifier le Rapport";
  }
  form.style.display = "block";
}

function deleteRapport(key) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce rapport ?")) {
    delete rapportData[key];
    saveRapportData();
  }
}

function saveRapportData() {
  localStorage.setItem("rapportData", JSON.stringify(rapportData));
  displayRapportTable();
}

// ==================== VIDEO FUNCTIONS ====================

function loadVideoData() {
  fetch("../assets/data/heyPasteur.json")
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load video data");
      return response.json();
    })
    .then((data) => {
      videoData = data;
      displayVideoGrid();
    })
    .catch((error) => {
      console.error("Error loading video data:", error);
      const stored = localStorage.getItem("videoData");
      if (stored) {
        videoData = JSON.parse(stored);
        displayVideoGrid();
      }
    });
}

function displayVideoGrid() {
  const grid = document.getElementById("video-grid");
  grid.innerHTML = "";

  Object.keys(videoData).forEach((key) => {
    const video = videoData[key];
    const card = document.createElement("div");
    card.className = "col-12 mb-4";
    card.innerHTML = `
            <div class="card card-horizontal">
                <div class="card-horizontal-img">
                    <img src="${video.thumbnail}" class="card-img-horizontal" alt="${video.nom}">
                </div>
                <div class="card-body card-body-horizontal">
                    <h5 class="card-title">${video.nom}</h5>
                    <p class="card-text">
                        <small class="text-muted">${video.date}</small><br>
                        <a href="${video.url}" target="_blank" class="btn btn-sm btn-outline-primary mt-2"><i class="fas fa-play"></i> Voir la vidéo</a>
                    </p>
                </div>
                <div class="card-actions-horizontal">
                    <button class="btn btn-sm btn-warning" onclick="editVideo('${key}')" title="Éditer"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVideo('${key}')" title="Supprimer"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    grid.appendChild(card);
  });
}

function openVideoForm() {
  editingVideoId = null;
  const form = document.getElementById("video-form");
  const formTitle = form.querySelector("h5");
  if (formTitle) {
    formTitle.textContent = "Nouvelle Vidéo";
  }
  form.style.display = "block";
  document.getElementById("videoFormElement").reset();
}

function closeVideoForm() {
  document.getElementById("video-form").style.display = "none";
  editingVideoId = null;
}

function editVideo(key) {
  const video = videoData[key];
  editingVideoId = key;

  document.getElementById("video-nom").value = video.nom;
  document.getElementById("video-url").value = video.url;
  document.getElementById("video-thumbnail").value = video.thumbnail;
  document.getElementById("video-date").value = video.date;

  const form = document.getElementById("video-form");
  const formTitle = form.querySelector("h5");
  if (formTitle) {
    formTitle.textContent = "Modifier la Vidéo";
  }
  form.style.display = "block";
}

function deleteVideo(key) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) {
    delete videoData[key];
    saveVideoData();
  }
}

function saveVideoData() {
  localStorage.setItem("videoData", JSON.stringify(videoData));
  displayVideoGrid();
}

// ==================== FORM LISTENERS ====================

function setupFormListeners() {
  document
    .getElementById("rapportFormElement")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const nom = document.getElementById("rapport-nom").value;
      const categorie = document.getElementById("rapport-categorie").value;
      const url = document.getElementById("rapport-url").value;
      const date = document.getElementById("rapport-date").value;

      if (!nom || !categorie || !url || !date) {
        alert("Tous les champs sont obligatoires");
        return;
      }

      if (editingRapportId) {
        rapportData[editingRapportId] = { nom, categorie, url, date };
      } else {
        const nextId =
          Math.max(
            ...Object.keys(rapportData).map(
              (k) => parseInt(k.split("_")[1]) || 0
            )
          ) + 1;
        rapportData[`Rapport_${nextId}`] = { nom, categorie, url, date };
      }

      saveRapportData();
      closeRapportForm();
    });

  document
    .getElementById("videoFormElement")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const nom = document.getElementById("video-nom").value;
      const url = document.getElementById("video-url").value;
      const thumbnail = document.getElementById("video-thumbnail").value;
      const date = document.getElementById("video-date").value;

      if (!nom || !url || !thumbnail || !date) {
        alert("Tous les champs sont obligatoires");
        return;
      }

      if (editingVideoId) {
        videoData[editingVideoId] = { nom, url, thumbnail, date };
      } else {
        const nextId =
          Math.max(
            ...Object.keys(videoData).map((k) => parseInt(k.split("_")[1]) || 0)
          ) + 1;
        videoData[`Video_${nextId}`] = { nom, url, thumbnail, date };
      }

      saveVideoData();
      closeVideoForm();
    });
}

// ==================== TAB SWITCHING ====================

function switchTab(tab) {
  document.querySelectorAll(".tab-content").forEach((el) => {
    el.style.display = "none";
  });
  document.getElementById(tab + "-tab").style.display = "block";
}

// ==================== UTILITIES ====================

function showAlert(message, type = "success") {
  const alertDiv = document.createElement("div");
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

  const container = document.querySelector(".container-fluid");
  container.insertBefore(alertDiv, container.firstChild);

  setTimeout(() => alertDiv.remove(), 3000);
}

// ==================== USER INFO ====================

function displayUserInfo() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const userInfo = document.getElementById("userInfo");
    userInfo.textContent = `👤 ${currentUser}`;
  }
}
