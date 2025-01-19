function openLink(url) {
  if (url) {
    const newWindow = window.open(url, "_blank");

    // Vérifie si la fenêtre a été bloquée ou non
    if ( !newWindow || newWindow.closed || typeof newWindow.closed === "undefined" ) {
      // Alternative pour iOS si window.open est bloqué
      window.location.href = url;
    }
  } else {
    console.error("Aucune URL fournie.");
  }
}

function affiche(detailNom, detailCategorie, detailUrl, detailDate) {
  const rapportUX = `
    <li class="rapport" onclick="openLink('${detailUrl}')">
        <div class="links">
                <img src="/assets/img/pdf-icons.png" alt="telecharger">
        </div>

        <div class="infos">
            <p>
                ${detailNom}
                
            </p> 
            <div class="detail">
                    <b>${detailCategorie}</b>
                </div> 
                <div class="date">
                    ${detailDate}
                </div>
            </div>
            
        </div>
    </li>`;

  const listeUX = document.getElementById("$liste");

  listeUX.innerHTML += rapportUX;
}

// function rapportUX(detailNom, detailUrl) {
//         // Création de l'élément li
//     const liElement = document.createElement('li');
//     liElement.classList.add('rapport'); // Ajout de la classe "rapport" à l'élément li

//     // Création de la div avec la classe "links"
//     const linksDiv = document.createElement('div');
//     linksDiv.classList.add('links'); // Ajout de la classe "links" à la div

//     // Création du lien
//     const lien = document.createElement('a');
//     lien.setAttribute('target', '_blank');
//     lien.setAttribute('href', `${detailUrl}`);

//     // Création de l'image
//     const image = document.createElement('img');
//     image.setAttribute('src', '/icons8-pdf-50.png');
//     image.setAttribute('alt', 'telecharger');

//     // Ajout de l'image au lien
//     lien.appendChild(image);

//     // Ajout du lien à la div "links"
//     linksDiv.appendChild(lien);

//     // Création de la div avec la classe "infos"
//     const infosDiv = document.createElement('div');
//     infosDiv.classList.add('infos'); // Ajout de la classe "infos" à la div

//     // Création du paragraphe pour le nom du fichier
//     const nomFichierParagraphe = document.createElement('p');
//     nomFichierParagraphe.textContent = `${detailNom}`;

//     // Création de la div avec la classe "date"
//     const dateDiv = document.createElement('div');
//     dateDiv.classList.add('date'); // Ajout de la classe "date" à la div
//     dateDiv.textContent = '11 - 08 - 2022';

//     // Ajout du paragraphe et de la div date à la div "infos"
//     infosDiv.appendChild(nomFichierParagraphe);
//     infosDiv.appendChild(dateDiv);

//     // Ajout des div "links" et "infos" à l'élément li
//     liElement.appendChild(linksDiv);
//     liElement.appendChild(infosDiv);

//     // Ajout de l'élément li au document
//     document.getElementById('$liste').appendChild(liElement);
// }

fetch("/assets/data/rapport.json")
  .then((response) => response.json())
  .then((data) => {
    var size = Object.keys(data).length;
    if (size > 0) {
      for (let i = 1; i <= size; i++) {
        affiche(
          data[`Rapport_${i}`].nom,
          data[`Rapport_${i}`].categorie,
          data[`Rapport_${i}`].url,
          data[`Rapport_${i}`].date
        );
      }
    }
    // else{
    //     affiche(data.Rapport_1.nom,data.Rapport_1.url,data.Rapport_1.date);
    // }
  })
  .catch((error) => console.error("Error:", error));
