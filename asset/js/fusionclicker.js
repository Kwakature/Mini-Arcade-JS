/* === 1. RÉCUPÉRER LES ÉLÉMENTS DU HTML === */
const clickButton = document.getElementById('click-button');
const playButton = document.getElementById('play-button');
const scoreDisplay = document.getElementById('score-value');
const scoreLabel = document.querySelector('.score-display');
const bestScoreDisplay = document.getElementById('best-score-value');

// <-- NOUVEAU : Récupérer les nouveaux boutons
const backButton = document.getElementById('back-button');
const time5sButton = document.getElementById('time-5s');
const time10sButton = document.getElementById('time-10s');


/* === 2. VARIABLES DU JEU === */
let clickCount = 0;       
let gameInProgress = false; 

// <-- MODIFIÉ : 'const' devient 'let' pour pouvoir la changer
let gameDuration = 10; // 10s par défaut (car il est 'active' dans ton HTML)

// <-- MODIFIÉ : On initialise le score à 0. Il sera chargé par une fonction.
let bestScore = 0;


/* === 3. ÉTAT INITIAL === */
clickButton.disabled = true;

// <-- MODIFIÉ : On appelle une fonction pour charger le bon score (celui de 10s)
loadBestScore();


/* === 4. FONCTIONS DU JEU === */

/**
 * NOUVELLE FONCTION : Charge et affiche le meilleur score
 */
function loadBestScore() {
    // Crée une clé unique (ex: "fusionBestScore_5s" ou "fusionBestScore_10s")
    const bestScoreKey = `fusionBestScore_${gameDuration}s`;
    
    // Charge le score depuis localStorage
    bestScore = parseInt(localStorage.getItem(bestScoreKey)) || 0;
    
    // Affiche le score
    bestScoreDisplay.textContent = bestScore;
}

/**
 * NOUVELLE FONCTION : Met à jour la durée du jeu
 */
function setGameDuration(duration) {
    gameDuration = duration; // Met à jour la variable (5 ou 10)

    // Met à jour le style des boutons
    if (duration === 5) {
        time5sButton.classList.add('active');
        time10sButton.classList.remove('active');
    } else {
        time10sButton.classList.add('active');
        time5sButton.classList.remove('active');
    }

    // Charge le meilleur score pour cette durée
    loadBestScore();
}

/**
 * NOUVELLE FONCTION : Gère le clic sur le bouton retour
 */
function goBack() {
    // Action simple : revenir à la page précédente (comme la flèche du navigateur)
    // Si tu veux aller à une page précise (ex: "index.html"), change la ligne :
    // window.location.href = "index.html"; 
    history.back();
}


/**
 * Fonction appelée quand on clique sur "PLAY" ou "REJOUER"
 */
function startGame() {
    // 1. Réinitialiser les variables
    clickCount = 0;
    gameInProgress = true;

    // 2. Mettre à jour l'interface (UI)
    scoreDisplay.textContent = 0; 
    scoreLabel.childNodes[0].nodeValue = "Clicks : "; 
    
    playButton.disabled = true;    
    clickButton.disabled = false;   
    playButton.textContent = "CLIQUEZ VITE !"; 

    // <-- NOUVEAU : Désactiver les boutons de temps et retour
    time5sButton.disabled = true;
    time10sButton.disabled = true;
    backButton.disabled = true;

    // 3. Lancer le minuteur
    // MODIFIÉ : utilise la variable 'gameDuration'
    setTimeout(endGame, gameDuration * 1000); 
}

/**
 * Fonction appelée quand le joueur clique sur le gros bouton
 */
function handleUserClick() {
    if (gameInProgress) {
        clickCount++; 
        scoreDisplay.textContent = clickCount; 
    }
}

/**
 * Fonction appelée par le minuteur quand le temps est écoulé
 */
function endGame() {
    // 1. Arrêter la partie
    gameInProgress = false;

    // 2. Mettre à jour l'interface (UI)
    playButton.disabled = false;  
    clickButton.disabled = true;  
    playButton.textContent = "REJOUER ?"; 

    // <-- NOUVEAU : Réactiver les boutons de temps et retour
    time5sButton.disabled = false;
    time10sButton.disabled = false;
    backButton.disabled = false;

    // 3. Afficher le score final (le nombre de clics)
    // MODIFIÉ : 'GAME_DURATION' devient 'gameDuration'
    scoreLabel.childNodes[0].nodeValue = `Score (${gameDuration}s) : `;
    scoreDisplay.textContent = clickCount;

    // 4. Mettre à jour le meilleur score
    if (clickCount > bestScore) {
        bestScore = clickCount; 
        bestScoreDisplay.textContent = bestScore; 
        
        // <-- MODIFIÉ : Sauvegarde avec la clé dynamique
        const bestScoreKey = `fusionBestScore_${gameDuration}s`;
        localStorage.setItem(bestScoreKey, bestScore);
    }
}

/* === 5. CONNECTER LES FONCTIONS AUX BOUTONS === */
playButton.addEventListener('click', startGame);
clickButton.addEventListener('click', handleUserClick);

// <-- NOUVEAU : Connecter les nouveaux boutons
backButton.addEventListener('click', goBack);
time5sButton.addEventListener('click', () => setGameDuration(5));
time10sButton.addEventListener('click', () => setGameDuration(10));