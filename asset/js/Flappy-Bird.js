// Exécute le code quand le document est chargé
document.addEventListener("DOMContentLoaded", () => {

  // Sélection des éléments HTML principaux du jeu
  const screen = document.querySelector("#gameScreen"); // zone du jeu
  const bird = document.querySelector("#bird"); // l’oiseau
  const jumpButton = document.querySelector("#jumpButton"); // bouton pour sauter
  const pipeContainer = document.querySelector("#pipeContainer"); // conteneur des tuyaux
  const scoreDisplay = document.querySelector("#scoreDisplay"); // affichage du score
  const hint = document.querySelector("#gameHint"); // texte d’aide (ex: “Appuie sur espace”)

  // Vérifie que tous les éléments existent avant de lancer le jeu
  if (!screen || !bird || !jumpButton || !pipeContainer || !scoreDisplay || !hint) {
    return;
  }

  // === CONSTANTES DU JEU ===
  const GRAVITY = 0.45;         // force de la gravité
  const JUMP_VELOCITY = -6.2;   // force du saut
  const MAX_FALL = 8;           // vitesse maximale de chute
  const PIPE_COUNT = 100;       // nombre total de tuyaux générés à l’avance
  const PIPE_SPACING_MIN = 180; // espace minimal entre deux tuyaux
  const GAP_MIN = 0.26;         // ouverture minimale entre les tuyaux (en pourcentage de la hauteur)
  const GAP_MAX = 0.32;         // ouverture maximale
  const GAP_MARGIN = 0.18;      // marge pour éviter que le trou soit trop haut ou trop bas

  // === VARIABLES DU JEU ===
  let birdY = 0;         // position verticale du bird
  let velocity = 0;       // vitesse actuelle du bird
  let running = false;    // indique si la partie est en cours
  let gameOver = false;   // indique si la partie est terminée
  let score = 0;          // score actuel
  let lastFrame = 0;      // temps de la dernière image
  let idleWave = 0;       // animation du bird quand il ne joue pas
  let godMode = false;    // mode invincible (aucune collision)
  let funSpeedMode = false;      // mode “vitesse boostée” après 3 appuis sur V
  let funSpeedPressCount = 0;    // nombre d'appuis pour débloquer la vitesse x20
  let funSpeedMultiplier = 1;    // multiplicateur de vitesse courant
  let hintTimerId = null;   // timer pour cacher automatiquement les messages

  // Données liées à la scène
  let bounds = { min: 0, max: 0 };     // limites haut/bas du bird
  let pipeSpacingMin = PIPE_SPACING_MIN; // espacement horizontal minimal entre les tuyaux
  let pipeSpacingMax = PIPE_SPACING_MIN + 80; // espacement horizontal maximal entre les tuyaux
  let pipeSpeed = 2.2;               // vitesse de défilement des tuyaux
  let nextPipeX = 0;               // position du prochain tuyau à générer
  const pipes = [];                // tableau contenant les tuyaux

  // === GESTION DU SON ===
  const audioState = {
    context: null,
    masterGain: null,
  };

  // Empêche le bird d’aller au-dessus ou en dessous de la zone de jeu
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // Retourne un nombre aléatoire entre min et max
  const randomBetween = (min, max) => min + Math.random() * (max - min);

  // Calcule un espacement horizontal aléatoire dans les bornes autorisées
  const pickPipeSpacing = () => randomBetween(pipeSpacingMin, pipeSpacingMax);

  // Met à jour le score à l’écran
  const setScore = (value) => {
    score = value;
    scoreDisplay.textContent = String(value);
  };

  // Affiche un message d’aide ou d’info
  const showHint = (message) => {
    if (hintTimerId !== null) {
      window.clearTimeout(hintTimerId);
      hintTimerId = null;
    }
    hint.textContent = message;
    hint.classList.remove("is-hidden");
    hintTimerId = window.setTimeout(() => {
      hideHint();
      hintTimerId = null;
    }, 3000);
  };

  // Cache le message d’aide
  const hideHint = () => {
    if (hintTimerId !== null) {
      window.clearTimeout(hintTimerId);
      hintTimerId = null;
    }
    hint.classList.add("is-hidden");
  };

  // Enlève l’effet visuel du bouton de saut
  const releaseButton = () => jumpButton.classList.remove("is-pressed");

  // Prépare l’audio (si possible)
  const ensureAudio = () => { 
    if (audioState.context) {
      if (audioState.context.state === "suspended") {
        audioState.context.resume().catch(() => { });
      }
      return;
    }
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      return;
    }

    // Création du contexte audio
    const context = new AudioContextClass();
    const masterGain = context.createGain();
    masterGain.gain.value = 0.10; // volume général
    masterGain.connect(context.destination);
    audioState.context = context;
    audioState.masterGain = masterGain;
  };

  // Joue un petit bip quand on saute
  const playJumpBeep = () => {
    ensureAudio();
    if (!audioState.context || !audioState.masterGain) {
      return;
    }
    const now = audioState.context.currentTime;
    const osc = audioState.context.createOscillator();
    const gain = audioState.context.createGain();

    osc.type = "square"; // son carré
    osc.frequency.setValueAtTime(760, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    osc.connect(gain);
    gain.connect(audioState.masterGain);
    osc.start(now);
    osc.stop(now + 0.3);
  };

  // Calcule la taille de la zone et les vitesses selon la fenêtre
  const computeLayout = () => {
    const screenHeight = screen.clientHeight;
    const screenWidth = screen.clientWidth;
    const birdHeight = bird.clientHeight;

    bounds = { min: 0, max: Math.max(screenHeight - birdHeight, 0) };
    birdY = clamp(birdY, bounds.min, bounds.max);

    const baseSpacing = Math.max(PIPE_SPACING_MIN, screenWidth * 0.54);
    pipeSpacingMin = Math.max(PIPE_SPACING_MIN, baseSpacing * 0.85);
    pipeSpacingMax = Math.max(pipeSpacingMin + 60, baseSpacing * 1.15);
    pipeSpeed = Math.max(2.1, screenWidth / 240);
    nextPipeX = screenWidth * 1.1;
  };

  // Affiche le bird à la bonne position
  const renderBird = (offsetY = 0) => {
    const y = Math.round(birdY + offsetY);
    bird.style.transform = `translate3d(0, ${y}px, 0)`;
  };

  // Effet visuel quand le bird saute
  const triggerJumpVisuals = () => {
    jumpButton.classList.add("is-pressed");
    bird.classList.add("is-flapping");
    window.setTimeout(() => {
      bird.classList.remove("is-flapping");
    }, 140);
  };

  // Crée un duo de tuyaux (haut + bas)
  const createPipePair = () => {
    const top = document.createElement("div");
    top.className = "pipe pipe--top";
    const bottom = document.createElement("div");
    bottom.className = "pipe pipe--bottom";
    pipeContainer.append(top, bottom);
    return { top, bottom, x: 0, gapRatio: 0.3, centerRatio: 0.5, scored: false };
  };

  // Définit la hauteur et position verticale des tuyaux
  const layoutPipe = (pipe) => {
    const height = screen.clientHeight;
    if (!height) return;
    const gap = height * pipe.gapRatio;
    const center = height * pipe.centerRatio;
    const topHeight = clamp(center - gap / 2, 20, height - 40);
    const bottomHeight = clamp(height - (center + gap / 2), 20, height - 40);
    pipe.top.style.height = `${Math.round(topHeight)}px`;
    pipe.bottom.style.height = `${Math.round(bottomHeight)}px`;
  };

  // Place les tuyaux horizontalement
  const positionPipe = (pipe) => {
    const x = Math.round(pipe.x);
    pipe.top.style.transform = `translate3d(${x}px, 0, 0)`;
    pipe.bottom.style.transform = `translate3d(${x}px, 0, 0)`;
  };

  // Randomise la position et la taille d’un tuyau
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

  // Crée tous les tuyaux de départ
  const seedPipes = () => {
    pipeContainer.innerHTML = "";
    pipes.length = 0;
    let cursor = nextPipeX;
    for (let index = 0; index < PIPE_COUNT; index++) {
      const pipe = createPipePair();
      pipes.push(pipe);
      randomizePipe(pipe, cursor);
      cursor += pickPipeSpacing();
    }
    nextPipeX = cursor;
  };

  // Applique la gravité et le mouvement du bird
  const applyPhysics = (delta) => {
    velocity = Math.min(velocity + GRAVITY * delta, MAX_FALL);
    birdY += velocity * delta;

    // Si le bird touche le haut ou le bas
    if (birdY <= bounds.min) { birdY = bounds.min; return true; }
    if (birdY >= bounds.max) { birdY = bounds.max; return true; }
    return false;
  };

  // Fait avancer les tuyaux et vérifie les collisions
  const advancePipes = (delta) => {
    const birdRect = bird.getBoundingClientRect(); // aille d'un élément et sa position relative par rapport à la zone d'affichage
    let collision = false;
    const speedFactor = funSpeedMultiplier;

    for (const pipe of pipes) {
      pipe.x -= pipeSpeed * delta * speedFactor;

      // Si un tuyau sort de l’écran, on le replace à droite
      if (pipe.x + pipe.top.offsetWidth < -60) {
        randomizePipe(pipe, nextPipeX);
        nextPipeX += pickPipeSpacing();
      } else {
        positionPipe(pipe);
      }

      if (!running || collision) continue;

      // Détection de collision
      const topRect = pipe.top.getBoundingClientRect();
      const bottomRect = pipe.bottom.getBoundingClientRect();

      const overlaps =
        birdRect.right > topRect.left &&
        birdRect.left < topRect.right &&
        (birdRect.top < topRect.bottom || birdRect.bottom > bottomRect.top);

      // Si on touche un tuyau et pas en god mode → perdu
      if (overlaps && !godMode) {
        collision = true;
      } 
      // Si on passe un tuyau → +1 point
      else if (!pipe.scored && topRect.right < birdRect.left) {
        pipe.scored = true;
        setScore(score + 1);
      }
    }

    return collision;
  };

  // Réinitialise complètement le jeu
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

  // Quand on perd
  const endGame = () => {
    running = false;
    gameOver = true;
    showHint(`Game over ! Score : ${score} — ESPACE pour rejouer`);
    releaseButton();
    bird.classList.remove("is-flapping");
  };

  // Fait sauter le bird
  const jump = () => {
    ensureAudio();
    if (gameOver) resetGame();
    if (!running) {
      running = true;
      hideHint();
    }
    velocity = JUMP_VELOCITY;
    triggerJumpVisuals();
    playJumpBeep();
  };

  // Boucle principale du jeu (60 FPS)
  const loop = (time) => {
    requestAnimationFrame(loop);
    if (!lastFrame) { lastFrame = time; return; }
    const delta = Math.min((time - lastFrame) / (1000 / 60), 3);
    lastFrame = time;

    if (running) {
      const hitBounds = applyPhysics(delta);
      const hitPipe = advancePipes(delta);
      renderBird();
      if ((hitBounds || hitPipe) && !godMode) endGame();
    } else {
      // Animation idle (petit mouvement de haut en bas)
      idleWave += delta;
      renderBird(Math.sin(idleWave / 12) * 6);
    }
  };

  // === GESTION DES TOUCHES ===
  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space" || event.repeat) return;
    if (event.shiftKey && (event.metaKey || event.ctrlKey)) return;
    event.preventDefault();
    jump();
  });

  document.addEventListener("keyup", (event) => {
    if (event.code === "Space") releaseButton();
  });

  // Gestion du clic ou appui tactile
  screen.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    jump();
  });
  jumpButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    jump();
  });

  // Quand on relâche le clic/touch
  const handlePointerUp = () => releaseButton();
  window.addEventListener("pointerup", handlePointerUp);
  window.addEventListener("pointercancel", handlePointerUp);
  window.addEventListener("blur", handlePointerUp);

  // Recalcule la taille si on redimensionne la fenêtre
  window.addEventListener("resize", () => {
    const wasRunning = running;
    computeLayout();
    for (const pipe of pipes) {
      layoutPipe(pipe);
      positionPipe(pipe);
    }
    if (!wasRunning) renderBird();
  });

  // Démarre le jeu
  resetGame();
  requestAnimationFrame(loop);







  // === MODES SECRETS ===
  // God mode : Cmd/Ctrl + Shift + G
  document.addEventListener("keydown", (event) => {
    if (event.code !== "KeyG" || event.repeat) return;
    if (!event.shiftKey || !(event.metaKey || event.ctrlKey)) return;
    event.preventDefault();
    godMode = !godMode;
    showHint(godMode ? "Good mode activé — aucune collision" : "Good mode désactivé");
  });

  // Fun speed mode : Cmd/Ctrl + Shift + V (3x) pour passer en x20 (juste pour le fun)
  document.addEventListener("keydown", (event) => {
    if (event.code !== "KeyV" || event.repeat) return;
    if (!event.shiftKey || !(event.metaKey || event.ctrlKey) || event.altKey) return;
    event.preventDefault();
    if (funSpeedMode) {
      funSpeedMode = false;
      funSpeedMultiplier = 1;
      funSpeedPressCount = 0;
      showHint("Fun speed désactivé");
      return;
    }
    funSpeedPressCount += 1;
    if (funSpeedPressCount >= 3) {
      funSpeedMode = true;
      funSpeedMultiplier = 20;
      funSpeedPressCount = 0;
      showHint("Fun speed x20 activé — tout va plus vite !");
    } else {
      const remaining = 3 - funSpeedPressCount;
      showHint(`Fun speed: encore ${remaining} appui(s) sur V…`);
    }
  });
});
