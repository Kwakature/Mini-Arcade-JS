const retour = document.querySelector(".retour");
const ciseau = document.querySelector(".ciseau");
const feuille = document.querySelector(".feuille");
const pierre = document.querySelector(".pierre");
const play = document.querySelector(".play");
const choixBot = document.querySelector(".choix_bot");

let choixJoueur = document.querySelector(".choix_joueur");
let selectJoueur = null;
let selectBot = null;
let intervaleID = null; // MODIFIÉ: Initialisé à null
let compteur = 0; // MODIFIÉ: Renommé de 'nombre' à 'compteur' pour plus de clarté

const elements = ["F", "P", "C"];
let indexActuel = 0; // MODIFIÉ: Renommé de 'index' pour éviter confusion

// MODIFIÉ: Fonction qui affiche une image dans la zone du bot
function affichageBot(lettre) {
  choixBot.innerHTML = `<img
            class="img_jeu_selected"
            src="./../asset/img/${lettre}.png"
            alt="image de ${
              lettre === "C" ? "ciseau" : lettre === "F" ? "feuille" : "pierre"
            }"
          />`;
}

// MODIFIÉ: Nouvelle fonction pour gérer le défilement des images
function demarrerDefilement() {
  compteur = 0;
  indexActuel = 0;

  // Affiche immédiatement la première image
  affichageBot(elements[indexActuel]);

  // MODIFIÉ: Crée un intervalle qui change l'image toutes les 200ms
  intervaleID = setInterval(() => {
    compteur++;
    indexActuel = compteur % elements.length; // Cycle à travers les 3 éléments
    affichageBot(elements[indexActuel]);

    // MODIFIÉ: Arrête après 3 secondes (15 changements × 200ms = 3000ms)
    if (compteur >= 15) {
      clearInterval(intervaleID);
      intervaleID = null;

      // MODIFIÉ: Sélectionne aléatoirement le choix final du bot
      const choixFinalIndex = Math.floor(Math.random() * elements.length);
      selectBot = elements[choixFinalIndex];
      affichageBot(selectBot);

      // MODIFIÉ: Calcule et affiche le résultat si le joueur a déjà choisi
      if (selectJoueur) {
        afficherResultat();
      }
    }
  }, 200); // Change l'image toutes les 200ms
}

// MODIFIÉ: Nouvelle fonction pour déterminer et afficher le résultat
function afficherResultat() {
  const resultGame = document.querySelector(".result_game");
  let resultat = "";

  // Logique du jeu Pierre-Feuille-Ciseaux
  if (selectJoueur === selectBot) {
    resultat = "ÉGALITÉ !";
  } else if (
    (selectJoueur === "P" && selectBot === "C") ||
    (selectJoueur === "C" && selectBot === "F") ||
    (selectJoueur === "F" && selectBot === "P")
  ) {
    resultat = "VICTOIRE !";
  } else {
    resultat = "DÉFAITE !";
  }

  // Affiche le résultat avec style
  resultGame.innerHTML = `<h2 style="color: #ff8800; font-size: 48px; text-shadow: 0 0 20px #ff8800;">${resultat}</h2>`;
}

// Événements pour les choix du joueur
ciseau.addEventListener("click", () => {
  choixJoueur.innerHTML = `<img
            class="img_jeu_selected"
            src="./../asset/img/C.png"
            alt="image de ciseau"
          />`;
  selectJoueur = "C";
});

feuille.addEventListener("click", () => {
  choixJoueur.innerHTML = `<img
            src="./../asset/img/F.png"
            alt="image de feuille"
            class="img_jeu_selected"
          />`;
  selectJoueur = "F";
});

pierre.addEventListener("click", () => {
  choixJoueur.innerHTML = `<img
            class="img_jeu_selected"
            src="./../asset/img/P.png"
            alt="image de pierre"
          />`;
  selectJoueur = "P";
});

retour.addEventListener("click", () => {
  window.location.href = "./../../index.html";
});

// MODIFIÉ: Correction majeure - utilise une fonction callback au lieu d'appeler directement
play.addEventListener("click", () => {
  // Empêche de lancer un nouveau défilement si un est déjà en cours
  if (intervaleID) {
    return;
  }

  // Vérifie que le joueur a fait un choix
  if (!selectJoueur) {
    alert("Veuillez d'abord choisir Pierre, Feuille ou Ciseau !");
    return;
  }

  // Réinitialise le résultat précédent
  document.querySelector(".result_game").innerHTML = "";

  // Démarre le défilement
  demarrerDefilement();
});
