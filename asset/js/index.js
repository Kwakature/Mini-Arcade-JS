// Attend que le contenu HTML de la page soit entièrement chargé
document.addEventListener("DOMContentLoaded", function () {
  // Utilise fetch pour récupérer le fichier header.html
  fetch("/html/header.html")
    .then((response) => {
      // Vérifie si la requête a réussi
      if (!response.ok) {
        throw new Error("Erreur réseau lors de la récupération du header");
      }
      // Renvoie le contenu du fichier sous forme de texte
      return response.text();
    })
    .then((data) => {
      // Sélectionne l'élément conteneur et y insère le HTML récupéré
      document.querySelector("#header-placeholder").innerHTML = data;
    })
    .catch((error) => {
      // Affiche une erreur dans la console si quelque chose se passe mal
      console.error("Erreur lors du chargement du header:", error);
      // Optionnel : affiche un message à l'utilisateur
      document.querySelector("#header-placeholder").innerHTML =
        "<p>Impossible de charger l'en-tête.</p>";
    });
});


