// Crée le modal s'il n'existe pas
function initializeModal() {
  if (!document.getElementById("videoModal")) {
    const modalHTML = `
      <div id="videoModal" class="video-modal">
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <div id="modalVideoContainer"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Fermer le modal au clic sur la croix
    document
      .querySelector(".close-modal")
      .addEventListener("click", function (e) {
        e.stopPropagation();
        closeVideoModal();
      });

    // Fermer le modal au clic en dehors
    document
      .getElementById("videoModal")
      .addEventListener("click", function (e) {
        if (e.target === this) {
          closeVideoModal();
        }
      });

    // Fermer au clic sur Echap
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        closeVideoModal();
      }
    });
  }
}

function getVideoType(url) {
  // Détecte si c'est un short ou une vidéo normale
  if (
    url.includes("instagram.com/reel/") ||
    url.includes("instagram.com/reels/")
  ) {
    return "short"; // Instagram Reels
  }
  if (url.includes("youtube.com/shorts/") || url.includes("youtu.be/shorts/")) {
    return "short"; // YouTube Shorts
  }
  if (url.includes("tiktok.com")) {
    return "short"; // TikTok
  }
  if (url.includes("snapchat.com")) {
    return "short"; // Snapchat
  }
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return "normal"; // YouTube vidéo normale
  }
  return "normal"; // Par défaut
}

function openVideoModal(url) {
  if (!url) {
    console.error("Aucune URL fournie.");
    return;
  }

  initializeModal();
  const container = document.getElementById("modalVideoContainer");
  const modal = document.getElementById("videoModal");
  const videoType = getVideoType(url);

  // Ajoute une classe au modal selon le type de vidéo
  modal.className = `video-modal video-${videoType}`;

  // Détecte le type d'URL et crée l'embed approprié
  let embedHTML = "";

  if (url.includes("instagram.com")) {
    // Pour Instagram
    const instagramId = extractInstagramId(url);
    embedHTML = `<iframe src="https://www.instagram.com/p/${instagramId}/embed/captioned/" width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
  } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
    // Pour YouTube
    const videoId = extractYoutubeId(url);
    embedHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } else if (url.includes("tiktok.com")) {
    // Pour TikTok
    const tiktokId = extractTiktokId(url);
    embedHTML = `<blockquote class="tiktok-embed" cite="${url}" data-unique-id="${tiktokId}" data-embed-version="18"><section></section></blockquote><script async src="https://www.tiktok.com/embed.js"></script>`;
  } else if (url.includes("snapchat.com")) {
    // Pour Snapchat, on ouvre le lien
    embedHTML = `<div style="text-align: center; padding: 20px;"><p>Redirection vers Snapchat...</p><a href="${url}" target="_blank" class="btn btn-primary">Ouvrir sur Snapchat</a></div>`;
  } else {
    // Par défaut, ouvre le lien
    embedHTML = `<div style="text-align: center; padding: 20px;"><a href="${url}" target="_blank" class="btn btn-primary">Ouvrir la vidéo</a></div>`;
  }

  container.innerHTML = embedHTML;
  modal.style.display = "flex";
}

function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  const container = document.getElementById("modalVideoContainer");

  if (modal) {
    // Arrête tous les iframes
    const iframes = container.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      iframe.src = iframe.src; // Recharge l'iframe avec src vide pour arrêter la lecture
    });

    // Vide le conteneur pour arrêter tout média
    container.innerHTML = "";

    // Ferme le modal
    modal.style.display = "none";
  }
}

function extractInstagramId(url) {
  const match = url.match(/\/([a-zA-Z0-9_-]+)\/?(\?|$)/);
  return match ? match[1] : null;
}

function extractYoutubeId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function extractTiktokId(url) {
  const match = url.match(/\/video\/(\d+)/);
  return match ? match[1] : null;
}

function openLink(url) {
  openVideoModal(url);
}

function affiche(detailNom, detailUrl, detailThumbnail, detailDate) {
  const rapportUX = `
    <li class="rapport" onclick="openLink('${detailUrl}')">
        <div class="links">
                <img src="${detailThumbnail}" alt="miniature vidéo">
        </div>

        <div class="infos">
            <p>
                ${detailNom}
                
            </p> 
                <div class="date">
                    ${detailDate}
                </div>
            </div>
            
        </div>
    </li>`;

  const listeUX = document.getElementById("$hp");

  listeUX.innerHTML += rapportUX;
}

fetch("/assets/data/heyPasteur.json")
  .then((response) => response.json())
  .then((data) => {
    var size = Object.keys(data).length;
    if (size > 0) {
      for (let i = 1; i <= size; i++) {
        affiche(
          data[`Video_${i}`].nom,
          data[`Video_${i}`].url,
          data[`Video_${i}`].thumbnail,
          data[`Video_${i}`].date,
        );
      }
    }
  })
  .catch((error) => console.error("Error:", error));
