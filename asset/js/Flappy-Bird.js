document.addEventListener("DOMContentLoaded", () => {
  const screen = document.querySelector("#gameScreen");
  const bird = document.querySelector("#bird");
  const jumpButton = document.querySelector("#jumpButton");
  const pipeContainer = document.querySelector("#pipeContainer");
  const scoreDisplay = document.querySelector("#scoreDisplay");
  const hint = document.querySelector("#gameHint");

  if (!screen || !bird || !jumpButton || !pipeContainer || !scoreDisplay || !hint) {
    return;
  }

  const GRAVITY = 0.45; // la gravité qui attire le bird vers le bas
  const JUMP_VELOCITY = -6.2; // vitesse de saut vers le haut
  const MAX_FALL = 8; // vitesse maximale de chute
  const PIPE_COUNT = 100; // nombre total de tuyaux générés
  const PIPE_SPACING_MIN = 180; // distance minimale entre deux tuyaux
  const GAP_MIN = 0.26; // ouverture minimale entre tuyaux (ratio)
  const GAP_MAX = 0.32; // ouverture maximale
  const GAP_MARGIN = 0.18; // marge pour éviter que les tuyaux soient trop collés en haut ou bas


let birdY = 0; // position verticale du bird
let velocity = 0; // vitesse actuelle du bird
let running = false; // si le jeu est en cours
let gameOver = false; // si le joueur a perdu
let score = 0; // score actuel
let lastFrame = 0; // temps du dernier rafraîchissement
let idleWave = 0; // mouvement du bird quand il ne joue pas


let bounds = { min: 0, max: 0 }; // limites de hauteur
let pipeSpacing = 220; // distance horizontale entre tuyaux
let pipeSpeed = 2.2; // vitesse de défilement
let nextPipeX = 0; // position du prochain tuyau
const pipes = []; // tableau contenant tous les tuyaux


  const audioState = {
    context: null,
    masterGain: null,
  }; //fait un petit bip quand on saute

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max); //Empêche l'oiseau d’aller en dehors du jeux.
  const randomBetween = (min, max) => min + Math.random() * (max - min); //Génère un nombre aléatoire entre min et max.

  const setScore = (value) => {
    score = value;
    scoreDisplay.textContent = String(value);
  }; //Met à jour la variable score et l’affiche sur l’écran.

  const showHint = (message) => {
    hint.textContent = message;
    hint.classList.remove("is-hidden");
  }; // affiche un message d’aide.

  const hideHint = () => hint.classList.add("is-hidden"); // masque le message d’aide.

  const releaseButton = () => jumpButton.classList.remove("is-pressed"); // enlève l’effet visuel du bouton.

  const ensureAudio = () => { 
    if (audioState.context) {
      if (audioState.context.state === "suspended") {
        audioState.context.resume().catch(() => { });
      }
      return;
    } // en gros si l'audio existe deja on l'active 
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    const context = new AudioContextClass();
    const masterGain = context.createGain();
    masterGain.gain.value = 0.10;
    masterGain.connect(context.destination);
    audioState.context = context;
    audioState.masterGain = masterGain;
  };

  const playJumpBeep = () => {
    ensureAudio();
    if (!audioState.context || !audioState.masterGain) {
      return;
    }
    const now = audioState.context.currentTime;
    const osc = audioState.context.createOscillator();
    const gain = audioState.context.createGain();
    osc.type = "square";
    osc.frequency.setValueAtTime(760, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    osc.connect(gain);
    gain.connect(audioState.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);
  };

  const computeLayout = () => {
    const screenHeight = screen.clientHeight;
    const screenWidth = screen.clientWidth;
    const birdHeight = bird.clientHeight;

    bounds = { min: 0, max: Math.max(screenHeight - birdHeight, 0) };
    birdY = clamp(birdY, bounds.min, bounds.max);

    pipeSpacing = Math.max(PIPE_SPACING_MIN, screenWidth * 0.58);
    pipeSpeed = Math.max(2.1, screenWidth / 240);
    nextPipeX = screenWidth * 1.1;
  };

  const renderBird = (offsetY = 0) => {
    const y = Math.round(birdY + offsetY);
    bird.style.transform = `translate3d(0, ${y}px, 0)`;
  };

  const triggerJumpVisuals = () => {
    jumpButton.classList.add("is-pressed");
    bird.classList.add("is-flapping");
    window.setTimeout(() => {
      bird.classList.remove("is-flapping");
    }, 140);
  };

  const createPipePair = () => {
    const top = document.createElement("div");
    top.className = "pipe pipe--top";
    const bottom = document.createElement("div");
    bottom.className = "pipe pipe--bottom";
    pipeContainer.append(top, bottom);
    return { top, bottom, x: 0, gapRatio: 0.3, centerRatio: 0.5, scored: false };
  };

  const layoutPipe = (pipe) => {
    const height = screen.clientHeight;
    if (!height) {
      return;
    }
    const gap = height * pipe.gapRatio;
    const center = height * pipe.centerRatio;
    const topHeight = clamp(center - gap / 2, 20, height - 40);
    const bottomHeight = clamp(height - (center + gap / 2), 20, height - 40);
    pipe.top.style.height = `${Math.round(topHeight)}px`;
    pipe.bottom.style.height = `${Math.round(bottomHeight)}px`;
  };

  const positionPipe = (pipe) => {
    const x = Math.round(pipe.x);
    pipe.top.style.transform = `translate3d(${x}px, 0, 0)`;
    pipe.bottom.style.transform = `translate3d(${x}px, 0, 0)`;
  };

  const randomizePipe = (pipe, x) => {
    const gap = randomBetween(GAP_MIN, GAP_MAX);
    const minCenter = GAP_MARGIN + gap / 2;
    const maxCenter = 1 - GAP_MARGIN - gap / 2;
    pipe.gapRatio = gap;
    pipe.centerRatio = randomBetween(minCenter, Math.max(minCenter, maxCenter));
    pipe.x = x;
    pipe.scored = false;
    layoutPipe(pipe);
    positionPipe(pipe);
  };

  const seedPipes = () => {
    pipeContainer.innerHTML = "";
    pipes.length = 0;

    let cursor = nextPipeX;
    for (let index = 0; index < PIPE_COUNT; index += 1) {
      const pipe = createPipePair();
      pipes.push(pipe);
      randomizePipe(pipe, cursor);
      cursor += pipeSpacing;
    }
    nextPipeX = cursor;
  };

  const applyPhysics = (delta) => {
    velocity = Math.min(velocity + GRAVITY * delta, MAX_FALL);
    birdY += velocity * delta;

    if (birdY <= bounds.min) {
      birdY = bounds.min;
      return true;
    }
    if (birdY >= bounds.max) {
      birdY = bounds.max;
      return true;
    }
    return false;
  };

  const advancePipes = (delta) => {
    const birdRect = bird.getBoundingClientRect();
    let collision = false;

    for (const pipe of pipes) {
      pipe.x -= pipeSpeed * delta;

      if (pipe.x + pipe.top.offsetWidth < -60) {
        randomizePipe(pipe, nextPipeX);
        nextPipeX += pipeSpacing;
      } else {
        positionPipe(pipe);
      }

      if (!running || collision) {
        continue;
      }

      const topRect = pipe.top.getBoundingClientRect();
      const bottomRect = pipe.bottom.getBoundingClientRect();

      const overlaps =
        birdRect.right > topRect.left &&
        birdRect.left < topRect.right &&
        (birdRect.top < topRect.bottom || birdRect.bottom > bottomRect.top);

      if (overlaps) {
        collision = true;
      } else if (!pipe.scored && topRect.right < birdRect.left) {
        pipe.scored = true;
        setScore(score + 1);
      }
    }

    return collision;
  };

  const resetGame = () => {
    computeLayout();
    running = false;
    gameOver = false;
    velocity = 0;
    idleWave = 0;
    lastFrame = 0;
    birdY = screen.clientHeight * 0.42;
    renderBird();
    setScore(0);
    seedPipes();
    showHint("Appuie sur ESPACE pour jouer");
    releaseButton();
    bird.classList.remove("is-flapping");
  };

  const endGame = () => {
    running = false;
    gameOver = true;
    showHint(`Game over ! Score : ${score} — ESPACE pour rejouer`);
    releaseButton();
    bird.classList.remove("is-flapping");
  };

  const jump = () => {
    ensureAudio();
    if (gameOver) {
      resetGame();
    }
    if (!running) {
      running = true;
      hideHint();
    }
    velocity = JUMP_VELOCITY;
    triggerJumpVisuals();
    playJumpBeep();
  };

  const loop = (time) => {
    requestAnimationFrame(loop);

    if (!lastFrame) {
      lastFrame = time;
      return;
    }

    const delta = Math.min((time - lastFrame) / (1000 / 60), 3);
    lastFrame = time;

    if (running) {
      const hitBounds = applyPhysics(delta);
      const hitPipe = advancePipes(delta);
      renderBird();
      if (hitBounds || hitPipe) {
        endGame();
      }
    } else {
      idleWave += delta;
      renderBird(Math.sin(idleWave / 12) * 6);
    }
  };

  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space" || event.repeat) {
      return;
    }
    event.preventDefault();
    jump();
  });

  document.addEventListener("keyup", (event) => {
    if (event.code === "Space") {
      releaseButton();
    }
  });

  screen.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    jump();
  });

  jumpButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    jump();
  });

  const handlePointerUp = () => releaseButton();
  window.addEventListener("pointerup", handlePointerUp);
  window.addEventListener("pointercancel", handlePointerUp);
  window.addEventListener("blur", handlePointerUp);

  window.addEventListener("resize", () => {
    const wasRunning = running;
    computeLayout();
    for (const pipe of pipes) {
      layoutPipe(pipe);
      positionPipe(pipe);
    }
    if (!wasRunning) {
      renderBird();
    }
  });

  resetGame();
  requestAnimationFrame(loop);
});
