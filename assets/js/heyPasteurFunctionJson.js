function openLink(url) {
  if (url) {
    const newWindow = window.open(url, "_blank");

    // Vérifie si la fenêtre a été bloquée ou non
    if (
      !newWindow ||
      newWindow.closed ||
      typeof newWindow.closed === "undefined"
    ) {
      // Alternative pour iOS si window.open est bloqué
      window.location.href = url;
    }
  } else {
    console.error("Aucune URL fournie.");
  }
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
          data[`Video_${i}`].date
        );
      }
    }
  })
  .catch((error) => console.error("Error:", error));
