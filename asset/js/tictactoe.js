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

let player1 = true;
let player2 = false;
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
      break;
    case 1:
      case2.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      break;
    case 2:
      case3.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      break;
    case 3:
      case4.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      break;
    case 4:
      case5.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      break;
    case 5:
      case6.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      break;
    case 6:
      case7.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      break;
    case 7:
      case8.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      break;
    case 8:
      case9.innerHTML = `<img class="imgCase" src="/asset/img/${img}" alt="image cercle ou croix" />`;
      break;
    default:
      console.log("erreur");
  }

  // Vérifier s'il y a un gagnant ou match nul
  checkWinner();
}

function selectImgInvers() {
  if (player1 == true) {
    player1 = false;
    player2 = true;
  } else {
    player1 = true;
    player2 = false;
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
    const winner = player1 ? "Joueur 1 (X)" : "Joueur 2 (0)";
    setTimeout(() => {
      alert(`${winner} a gagné ! 🎉`);
      resetGame();
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

function resetGame() {
  player1 = true;
  player2 = false;
  gameBoard = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;

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

// Event listeners pour les cases
case1.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case1.dataset.case, img);
  if (gameActive) selectImgInvers();
});

case2.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case2.dataset.case, img);
  if (gameActive) selectImgInvers();
});

case3.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case3.dataset.case, img);
  if (gameActive) selectImgInvers();
});

case4.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case4.dataset.case, img);
  if (gameActive) selectImgInvers();
});

case5.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case5.dataset.case, img);
  if (gameActive) selectImgInvers();
});

case6.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case6.dataset.case, img);
  if (gameActive) selectImgInvers();
});

case7.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case7.dataset.case, img);
  if (gameActive) selectImgInvers();
});

case8.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case8.dataset.case, img);
  if (gameActive) selectImgInvers();
});

case9.addEventListener("click", () => {
  const img = player1 ? "crois.png" : "rond.png";
  addImg(case9.dataset.case, img);
  if (gameActive) selectImgInvers();
});

// Bouton retour pour réinitialiser
returnButton.addEventListener("click", () => {
  resetGame();
});

function init() {
  resetGame();
}

// Initialiser le jeu au chargement
init();
