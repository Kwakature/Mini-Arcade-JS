const case1 = document.querySelector(".case1");
const case2 = document.querySelector(".case2");
const case3 = document.querySelector(".case3");
const case4 = document.querySelector(".case4");
const case5 = document.querySelector(".case5");
const case6 = document.querySelector(".case6");
const case7 = document.querySelector(".case7");
const case8 = document.querySelector(".case8");
const case9 = document.querySelector(".case9");
const returnButton = document.querySelector(".return_button");
const buttonReset = document.querySelector(".button_reset");
const affplayer1 = document.querySelector(".player1");
const affplayer2 = document.querySelector(".player2");
const score1 = document.querySelector(".score_player1");
const score2 = document.querySelector(".score_player2");
const titlepage = document.querySelector(".game-title");

/* ====== AJOUT: Variables pour le mode de jeu ====== */
const radioPvP = document.querySelector('input[value="pvp"]');
const radioPvC = document.querySelector('input[value="pvc"]');
const scorePlayer2Text = document.querySelector(".score_player2_text");
let isPlayingVsComputer = false; // Mode de jeu: false = PvP, true = PvC
/* ====== FIN AJOUT ====== */

let player1 = true;
let player2 = false;
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

// Combinaisons gagnantes
const winningCombinations = [
  [0, 1, 2], // ligne 1
  [3, 4, 5], // ligne 2
  [6, 7, 8], // ligne 3
  [0, 3, 6], // colonne 1
  [1, 4, 7], // colonne 2
  [2, 5, 8], // colonne 3
  [0, 4, 8], // diagonale 1
  [2, 4, 6], // diagonale 2
];

/* ====== AJOUT: Écouteurs pour les boutons radio ====== */
// Changement de mode de jeu quand on clique sur les boutons radio
radioPvP.addEventListener("change", () => {
  if (radioPvP.checked) {
    isPlayingVsComputer = false;
    updatePlayerLabels(); // Met à jour les textes "JOUEUR 2"
    init(); // Réinitialise le jeu
    resetScore(); // Réinitialise les scores
    titlepage.innerHTML = `TIC TAC TOE`;
  }
});

radioPvC.addEventListener("change", () => {
  if (radioPvC.checked) {
    isPlayingVsComputer = true;
    updatePlayerLabels(); // Met à jour les textes "ROBOT"
    init(); // Réinitialise le jeu
    resetScore(); // Réinitialise les scores
    titlepage.innerHTML = `TIC TAC TOE`;
  }
});

// Fonction pour mettre à jour les labels des joueurs selon le mode
function updatePlayerLabels() {
  if (isPlayingVsComputer) {
    affplayer2.innerHTML = "ROBOT<br />O";
    scorePlayer2Text.innerHTML =
      'Score robot : <span class="score_player2">0</span>';
    score2.innerHTML = scorePlayer2;
  } else {
    affplayer2.innerHTML = "JOUEUR 2<br />O";
    scorePlayer2Text.innerHTML =
      'Score joueur 2 : <span class="score_player2">0</span>';
    score2.innerHTML = scorePlayer2;
  }
}
/* ====== FIN AJOUT ====== */

function addImg(caseSelect, img) {
  const caseNumber = parseInt(caseSelect, 10);

  // Vérifier si la case est déjà occupée
  if (gameBoard[caseNumber] !== "" || !gameActive) {
    return;
  }

  // Mettre à jour le tableau de jeu
  gameBoard[caseNumber] = player1 ? "X" : "O";

  switch (caseNumber) {
    case 0:
      case1.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      selectImgInvers();
      break;
    case 1:
      case2.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      selectImgInvers();
      break;
    case 2:
      case3.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      selectImgInvers();
      break;
    case 3:
      case4.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      selectImgInvers();
      break;
    case 4:
      case5.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      selectImgInvers();
      break;
    case 5:
      case6.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      selectImgInvers();
      break;
    case 6:
      case7.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      selectImgInvers();
      break;
    case 7:
      case8.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      selectImgInvers();
      break;
    case 8:
      case9.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      selectImgInvers();
      break;
    default:
      console.log("erreur");
  }

  // Vérifier s'il y a un gagnant ou match nul
  checkWinner();
  winnerMessage();

  /* ====== AJOUT: Si c'est le tour du robot et que le jeu est actif ====== */
  // Le robot joue automatiquement après un court délai
  if (isPlayingVsComputer && player2 && gameActive) {
    setTimeout(() => {
      computerMove();
    }, 500); // Délai de 500ms pour rendre le jeu plus naturel
  }
  /* ====== FIN AJOUT ====== */
}

function selectImgInvers() {
  if (player1 == true) {
    player1 = false;
    player2 = true;
    affplayer2.classList.add("active");
    affplayer1.classList.remove("active");
  } else {
    player1 = true;
    player2 = false;
    affplayer2.classList.remove("active");
    affplayer1.classList.add("active");
  }
}

function checkWinner() {
  let roundWon = false;

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (
      gameBoard[a] !== "" &&
      gameBoard[a] === gameBoard[b] &&
      gameBoard[a] === gameBoard[c]
    ) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    /* ====== MODIFICATION: Adaptation du texte selon le mode de jeu ====== */
    const winner = player1
      ? isPlayingVsComputer
        ? "Robot (O)"
        : "Joueur 2 (O)"
      : "Joueur 1 (X)";
    /* ====== FIN MODIFICATION ====== */

    setTimeout(() => {
      alert(`${winner} a gagné ! 🎉`);
      resetGame();
      if (winner == "Joueur 1 (X)") {
        scorePlayer1 = scorePlayer1 + 1;
        score1.innerHTML = scorePlayer1;
      } else {
        scorePlayer2 = scorePlayer2 + 1;
        score2.innerHTML = scorePlayer2;
      }
      winnerMessage();
    }, 100);
    gameActive = false;
    return;
  }

  // Vérifier s'il y a match nul
  if (!gameBoard.includes("")) {
    setTimeout(() => {
      alert("Match nul ! 🤝");
      resetGame();
    }, 100);
    gameActive = false;
    return;
  }
}

function winnerMessage() {
  /* ====== MODIFICATION: Adaptation du message selon le mode de jeu ====== */
  if (scorePlayer1 == 3) {
    titlepage.innerHTML = `Joueur 1 a Gagné 🏆 <p>: ${scorePlayer1} : ${scorePlayer2} :</p>`;
  } else if (scorePlayer2 == 3) {
    const winnerName = isPlayingVsComputer ? "Robot" : "Joueur 2";
    titlepage.innerHTML = `${winnerName} a Gagné 🏆 <p>: ${scorePlayer1} : ${scorePlayer2} :</p>`;
  }
  /* ====== FIN MODIFICATION ====== */
}

function resetGame() {
  if (Math.random() < 0.5) {
    player1 = true;
    player2 = false;
  } else {
    player1 = false;
    player2 = true;
  }
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  selectImgInvers();

  // Nettoyer toutes les cases
  case1.innerHTML = "";
  case2.innerHTML = "";
  case3.innerHTML = "";
  case4.innerHTML = "";
  case5.innerHTML = "";
  case6.innerHTML = "";
  case7.innerHTML = "";
  case8.innerHTML = "";
  case9.innerHTML = "";

  /* ====== AJOUT: Si le robot commence, il joue automatiquement ====== */
  if (isPlayingVsComputer && player2 && gameActive) {
    setTimeout(() => {
      computerMove();
    }, 800);
  }
  /* ====== FIN AJOUT ====== */
}

function resetScore() {
  scorePlayer1 = 0;
  scorePlayer2 = 0;
  score1.innerHTML = scorePlayer1;
  score2.innerHTML = scorePlayer2;
}

/* ====== AJOUT: Logique de l'IA du robot ====== */
// Fonction principale qui gère le coup du robot
function computerMove() {
  if (!gameActive) return;

  // 1. Essayer de gagner en un coup
  const winMove = findWinningMove("O");
  if (winMove !== -1) {
    makeComputerMove(winMove);
    return;
  }

  // 2. Bloquer le joueur s'il peut gagner au prochain tour
  const blockMove = findWinningMove("X");
  if (blockMove !== -1) {
    makeComputerMove(blockMove);
    return;
  }

  // 3. Prendre le centre si disponible (stratégie classique)
  if (gameBoard[4] === "") {
    makeComputerMove(4);
    return;
  }

  // 4. Prendre un coin disponible
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((pos) => gameBoard[pos] === "");
  if (availableCorners.length > 0) {
    const randomCorner =
      availableCorners[Math.floor(Math.random() * availableCorners.length)];
    makeComputerMove(randomCorner);
    return;
  }

  // 5. Prendre n'importe quelle case disponible
  const availableMoves = gameBoard
    .map((cell, index) => (cell === "" ? index : null))
    .filter((index) => index !== null);

  if (availableMoves.length > 0) {
    const randomMove =
      availableMoves[Math.floor(Math.random() * availableMoves.length)];
    makeComputerMove(randomMove);
  }
}

// Fonction qui trouve un coup gagnant pour un symbole donné (X ou O)
function findWinningMove(symbol) {
  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    const cells = [gameBoard[a], gameBoard[b], gameBoard[c]];

    // Si deux cases contiennent le symbole et la troisième est vide
    const symbolCount = cells.filter((cell) => cell === symbol).length;
    const emptyCount = cells.filter((cell) => cell === "").length;

    if (symbolCount === 2 && emptyCount === 1) {
      // Retourner l'index de la case vide
      if (gameBoard[a] === "") return a;
      if (gameBoard[b] === "") return b;
      if (gameBoard[c] === "") return c;
    }
  }
  return -1; // Aucun coup gagnant trouvé
}

// Fonction qui exécute le coup du robot à une position donnée
function makeComputerMove(position) {
  const img = "rond.png"; // Le robot joue toujours avec O
  addImg(position.toString(), img);
}
/* ====== FIN AJOUT ====== */

// Event listeners pour les cases
case1.addEventListener("click", () => {
  /* ====== MODIFICATION: Empêcher le joueur de cliquer pendant le tour du robot ====== */
  if (isPlayingVsComputer && player2) return;
  /* ====== FIN MODIFICATION ====== */
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case1.dataset.case, img);
});

case2.addEventListener("click", () => {
  if (isPlayingVsComputer && player2) return;
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case2.dataset.case, img);
});

case3.addEventListener("click", () => {
  if (isPlayingVsComputer && player2) return;
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case3.dataset.case, img);
});

case4.addEventListener("click", () => {
  if (isPlayingVsComputer && player2) return;
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case4.dataset.case, img);
});

case5.addEventListener("click", () => {
  if (isPlayingVsComputer && player2) return;
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case5.dataset.case, img);
});

case6.addEventListener("click", () => {
  if (isPlayingVsComputer && player2) return;
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case6.dataset.case, img);
});

case7.addEventListener("click", () => {
  if (isPlayingVsComputer && player2) return;
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case7.dataset.case, img);
});

case8.addEventListener("click", () => {
  if (isPlayingVsComputer && player2) return;
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case8.dataset.case, img);
});

case9.addEventListener("click", () => {
  if (isPlayingVsComputer && player2) return;
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case9.dataset.case, img);
});

// Bouton retour pour réinitialiser
returnButton.addEventListener("click", () => {
  window.location.href = "./../../index.html";
});

buttonReset.addEventListener("click", () => {
  init();
  resetScore();
  titlepage.innerHTML = `TIC TAC TOE`;
});

function init() {
  resetGame();
  /* ====== AJOUT: Initialiser les labels au démarrage ====== */
  updatePlayerLabels();
  /* ====== FIN AJOUT ====== */
}

// Initialiser le jeu au chargement
init();
