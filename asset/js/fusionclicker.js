/* === 1. RÉCUPÉRER LES ÉLÉMENTS DU HTML === */
// On prend les 3 éléments interactifs : les deux boutons et l'affichage du score
const clickButton = document.getElementById('click-button');
const playButton = document.getElementById('play-button');
const scoreDisplay = document.getElementById('score-value');

// On récupère aussi le conteneur du score pour changer le texte "Clicks :" en "CPS :"
const scoreLabel = document.querySelector('.score-display');

/* === 2. VARIABLES DU JEU === */
let clickCount = 0;       // Compteur de clics
let gameInProgress = false; // Le jeu est-il en cours ?
const GAME_DURATION = 5;  // Durée du jeu en secondes

/* === 3. ÉTAT INITIAL === */
// On désactive le gros bouton de clic au début.
// Le joueur doit d'abord appuyer sur "PLAY".
clickButton.disabled = true;

/* === 4. FONCTIONS DU JEU === */

/**
 * Fonction appelée quand on clique sur "PLAY" ou "REJOUER"
 */
function startGame() {
    // 1. Réinitialiser les variables
    clickCount = 0;
    gameInProgress = true;

    // 2. Mettre à jour l'interface (UI)
    scoreDisplay.textContent = 0; // Remettre le score à 0
    scoreLabel.childNodes[0].nodeValue = "Clicks : "; // Rétablir le texte "Clicks : "
    
    playButton.disabled = true;    // Désactiver le bouton "PLAY"
    clickButton.disabled = false;   // Activer le bouton de clic
    playButton.textContent = "CLIQUEZ VITE !"; // Changer le texte du bouton

    // 3. Lancer le minuteur
    // À la fin du temps (ex: 5000ms), on appelle la fonction endGame
    setTimeout(endGame, GAME_DURATION * 1000); 
}

/**
 * Fonction appelée quand le joueur clique sur le gros bouton
 */
function handleUserClick() {
    // On vérifie si le jeu est bien en cours
    if (gameInProgress) {
        clickCount++; // On augmente le score
        scoreDisplay.textContent = clickCount; // On met à jour l'affichage
    }
}

/**
 * Fonction appelée par le minuteur quand le temps est écoulé
 */
function endGame() {
    // 1. Arrêter la partie
    gameInProgress = false;

    // 2. Calculer le score final (CPS)
    // toFixed(2) permet de garder 2 chiffres après la virgule
    const cps = (clickCount / GAME_DURATION).toFixed(2);

    // 3. Mettre à jour l'interface (UI)
    playButton.disabled = false;  // Réactiver le bouton "PLAY"
    clickButton.disabled = true;  // Désactiver le bouton de clic
    playButton.textContent = "REJOUER ?"; // Changer le texte

    // 4. Afficher le score final (CPS)
    scoreLabel.childNodes[0].nodeValue = `CPS (${GAME_DURATION}s) : `;
    scoreDisplay.textContent = cps;
}

/* === 5. CONNECTER LES FONCTIONS AUX BOUTONS === */

// On dit au navigateur d'appeler la fonction 'startGame' 
// quand le joueur clique sur 'playButton'
playButton.addEventListener('click', startGame);

// On dit au navigateur d'appeler la fonction 'handleUserClick' 
// quand le joueur clique sur 'clickButton'
clickButton.addEventListener('click', handleUserClick);