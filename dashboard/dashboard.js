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
    .then((response) => response.json())
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
  const tbody = document.getElementById("rapport-tbody");
  tbody.innerHTML = "";

  Object.keys(rapportData).forEach((key, index) => {
    const rapport = rapportData[key];
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${rapport.nom}</td>
            <td>${rapport.categorie}</td>
            <td><a href="${rapport.url}" target="_blank">Ouvrir</a></td>
            <td>${rapport.date}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editRapport('${key}')"><i class="fas fa-edit"></i> Éditer</button>
                <button class="btn btn-sm btn-danger" onclick="deleteRapport('${key}')"><i class="fas fa-trash"></i> Supprimer</button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function openRapportForm() {
  editingRapportId = null;
  document.getElementById("rapport-form").style.display = "block";
  document.getElementById("rapportFormElement").reset();
  document
    .getElementById("rapportFormElement")
    .querySelector("h5").textContent = "Nouveau Rapport";
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

  document.getElementById("rapport-form").style.display = "block";
}

function deleteRapport(key) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce rapport ?")) {
    delete rapportData[key];
    saveRapportData();
  }
}

function saveRapportData() {
  localStorage.setItem("rapportData", JSON.stringify(rapportData));

  // Tentative de sauvegarde côté serveur
  fetch("/api/save-rapport", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(rapportData),
  })
    .then((response) => response.json())
    .then((data) => {
      showAlert("Rapport sauvegardé avec succès", "success");
      loadRapportData();
    })
    .catch((error) => {
      console.log("Note: Les changements sont sauvegardés localement");
      loadRapportData();
    });
}

// ==================== VIDEO FUNCTIONS ====================

function loadVideoData() {
  fetch("../assets/data/heyPasteur.json")
    .then((response) => response.json())
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
    card.className = "col-md-6 col-lg-4 mb-4";
    card.innerHTML = `
            <div class="card">
                <img src="${video.thumbnail}" class="card-img-top" alt="${video.nom}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${video.nom}</h5>
                    <p class="card-text">
                        <small class="text-muted">${video.date}</small><br>
                        <a href="${video.url}" target="_blank">Voir la vidéo</a>
                    </p>
                    <button class="btn btn-sm btn-warning" onclick="editVideo('${key}')"><i class="fas fa-edit"></i> Éditer</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteVideo('${key}')"><i class="fas fa-trash"></i> Supprimer</button>
                </div>
            </div>
        `;
    grid.appendChild(card);
  });
}

function openVideoForm() {
  editingVideoId = null;
  document.getElementById("video-form").style.display = "block";
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

  document.getElementById("video-form").style.display = "block";
}

function deleteVideo(key) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette vidéo ?")) {
    delete videoData[key];
    saveVideoData();
  }
}

function saveVideoData() {
  localStorage.setItem("videoData", JSON.stringify(videoData));

  fetch("/api/save-video", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(videoData),
  })
    .then((response) => response.json())
    .then((data) => {
      showAlert("Vidéo sauvegardée avec succès", "success");
      loadVideoData();
    })
    .catch((error) => {
      console.log("Note: Les changements sont sauvegardés localement");
      loadVideoData();
    });
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
