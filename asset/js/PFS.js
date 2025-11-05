const retour = document.querySelector(".retour");
const ciseau = document.querySelector(".ciseau");
const feuille = document.querySelector(".feuille");
const pierre = document.querySelector(".pierre");
let choixJoueur = document.querySelector(".choix_joueur");

ciseau.addEventListener("click", () => {
  choixJoueur.innerHTML = `<img
            class="img_jeu"
            src="./../asset/img/ciseau.png"
            alt="image de ciseau"
          />`;
});

feuille.addEventListener("click", () => {
  choixJoueur.innerHTML = `<img
            src="./../asset/img/feuille.png"
            alt="image de feuille"
            class="img_jeu"
          />`;
});
pierre.addEventListener("click", () => {
  choixJoueur.innerHTML = `<img
            class="img_jeu"
            src="./../asset/img/pierre.png"
            alt="image de pierre"
          />`;
});

retour.addEventListener("click", () => {
  window.location.href = "./../../index.html";
});
