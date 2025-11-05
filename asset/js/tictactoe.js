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
    const winner = player1 ? "Joueur 2 (0)" : "Joueur 1 (X)";
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
  if (scorePlayer1 == 3) {
    titlepage.innerHTML = `Joueur 1 a Gagner 🏆 <p>: ${scorePlayer1} : ${scorePlayer2} :</p>`;
  } else if (scorePlayer2 == 3) {
    titlepage.innerHTML = `Joueur 2 a Gagner 🏆 <p>: ${scorePlayer1} : ${scorePlayer2} :</p>`;
  }
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
}

function resetScore() {
  scorePlayer1 = 0;
  scorePlayer2 = 0;
  score1.innerHTML = scorePlayer1;
  score2.innerHTML = scorePlayer2;
}

// Event listeners pour les cases
case1.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case1.dataset.case, img);
});

case2.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case2.dataset.case, img);
});

case3.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case3.dataset.case, img);
});

case4.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case4.dataset.case, img);
});

case5.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case5.dataset.case, img);
});

case6.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case6.dataset.case, img);
});

case7.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case7.dataset.case, img);
});

case8.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case8.dataset.case, img);
});

case9.addEventListener("click", () => {
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
}

// Initialiser le jeu au chargement
init();
