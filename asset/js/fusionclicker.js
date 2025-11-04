/* récup les éléments du HTML */
const clickButton = document.getElementById('click-button');
const playButton = document.getElementById('play-button');
const scoreDisplay = document.getElementById('score-value');
const scoreLabel = document.querySelector('.score-display');
const bestScoreDisplay = document.getElementById('best-score-value');
const backButton = document.getElementById('back-button');
const time5sButton = document.getElementById('time-5s');
const time10sButton = document.getElementById('time-10s');

// récup l'élément audio
const clickSound = document.getElementById('click-sound');


/* variables du jeu */
let clickCount = 0;       
let gameInProgress = false; 

// 'const' devient 'let' pour pouvoir la changer
let gameDuration = 10; // 10s par défaut (car il est 'active' dans ton HTML)

// initialisation du score à 0 -> chargé par une fonction
let bestScore = 0;


/* état de base */
clickButton.disabled = true;

// appelle une fonction pour charger le bon score (10s)
loadBestScore();


/* fonctions du jeu */


/* charge et affiche le meilleur score */
function loadBestScore() {
    // crée une clé unique
    const bestScoreKey = `fusionBestScore_${gameDuration}s`;
    
    // charge le score depuis localStorage
    bestScore = parseInt(localStorage.getItem(bestScoreKey)) || 0;
    
    // affiche le score
    bestScoreDisplay.textContent = bestScore;
}


/* met à jour la durée du jeu */
function setGameDuration(duration) {
    gameDuration = duration; // Met à jour la variable (5 ou 10)

    // met à jour le style des boutons
    if (duration === 5) {
        time5sButton.classList.add('active');
        time10sButton.classList.remove('active');
    } else {
        time10sButton.classList.add('active');
        time5sButton.classList.remove('active');
    }

    // charge le meilleur score pour cette durée la
    loadBestScore();
}

/*gère le clic sur le bouton retour */
function goBack() {
    // revenir au menu de gamefusion
    history.back();
}



 /* fonction appelée quand on clique sur "play" ou "rejouer" */
function startGame() {
    //reset les variables
    clickCount = 0;
    gameInProgress = true;

    //
    // On active le son pour le navigateur
    if (clickSound) {
        clickSound.load(); 
    }

    // MAJ de l'interface
    scoreDisplay.textContent = 0; 
    scoreLabel.childNodes[0].nodeValue = "Clicks : "; 
    
    playButton.disabled = true;    
    clickButton.disabled = false;   
    playButton.textContent = "CLIQUEZ VITE !"; 

    // désactiver les boutons de temps et retour
    time5sButton.disabled = true;
    time10sButton.disabled = true;
    backButton.disabled = true;

    /* lancer le minuteur */
    setTimeout(endGame, gameDuration * 1000); 
}


 /* fonction appelée quand on clique sur le gros bouton */
function handleUserClick() {
    if (gameInProgress) {
        clickCount++; 
        scoreDisplay.textContent = clickCount; 

        // joue le son de clic
        if (clickSound) { // vérifie si le son existe
            clickSound.currentTime = 0; // rembobine
            clickSound.play(); // joue
        }
    }
}

 /* fonction appelée par le minuteur quand le temps est écoulé */
function endGame() {
    // arrêter la partie
    gameInProgress = false;

    // MAJ de l'interface
    playButton.disabled = false;  
    clickButton.disabled = true;  
    playButton.textContent = "REJOUER ?"; 

    // réactiver les boutons de temps et retour
    time5sButton.disabled = false;
    time10sButton.disabled = false;
    backButton.disabled = false;

    // afficher le score final (nbr de clics)
    // 'GAME_DURATION' devient 'gameDuration'
    scoreLabel.childNodes[0].nodeValue = `Score (${gameDuration}s) : `;
    scoreDisplay.textContent = clickCount;

    // 4. MAJ le meilleur score
    if (clickCount > bestScore) {
        bestScore = clickCount; 
        bestScoreDisplay.textContent = bestScore; 
        
        /* sauvegarde avec la clé dynamique */
        const bestScoreKey = `fusionBestScore_${gameDuration}s`;
        localStorage.setItem(bestScoreKey, bestScore);
    }
}

/* connecter les fonctions aux boutons */
playButton.addEventListener('click', startGame);
clickButton.addEventListener('click', handleUserClick);

/* connecter les nouveaux boutons */
backButton.addEventListener('click', goBack);
time5sButton.addEventListener('click', () => setGameDuration(5));
time10sButton.addEventListener('click', () => setGameDuration(10));