document.addEventListener("DOMContentLoaded", () => {
  injectHeader();
  initGameCarousel();
});

function injectHeader() {
  fetch("/html/header.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur réseau lors de la récupération du header");
      }
      return response.text();
    })
    .then((data) => {
      const placeholder = document.querySelector("#header-placeholder");
      if (placeholder) {
        placeholder.innerHTML = data;

        // C'EST LA CORRECTION PRINCIPALE :
        // On appelle la fonction de musique ICI,
        // maintenant que le header est dans la page.
        initMusicControls();
      }
    })
    .catch((error) => {
      console.error("Erreur lors du chargement du header:", error);
      const placeholder = document.querySelector("#header-placeholder");
      if (placeholder) {
        placeholder.innerHTML = "<p>Impossible de charger l'en-tête.</p>";
      }
    });
}

/**
 * Initialise les contrôles de la musique de fond.
 * Cette fonction est appelée APRES l'injection du header.
 */
function initMusicControls() {
  // 1. Sélectionne le bouton et l'audio par leur ID
  const boutonLogo = document.querySelector(".bouton_logo");
  const backgroundMusic = document.getElementById("backgroundMusic");

  // Sécurité : Vérifie si les éléments existent avant de continuer
  if (!boutonLogo || !backgroundMusic) {
    console.error("Impossible de trouver le bouton mute ou l'audio.");
    return;
  }

  // 2. Ajoute un "écouteur d'événement" sur le bouton
  boutonLogo.addEventListener("click", () => {
    // 3. Logique pour couper/remettre le son

    // Si la musique est actuellement en pause (parce que l'autoplay a été bloqué)
    // On la lance au premier clic.
    if (backgroundMusic.paused) {
      backgroundMusic.play();
    }

    // Inverse l'état "muet" de la musique
    backgroundMusic.muted = !backgroundMusic.muted;

    // 4. Met à jour le texte du bouton pour refléter le nouvel état
    if (backgroundMusic.muted) {
      boutonLogo.innerHTML = `<img src="asset/img/mute.png" alt="logo son coupé" class="logomute">`;
    } else {
      boutonLogo.innerHTML = `<img src="asset/img/unmute.png" alt="logo son coupé" class="logomute">`;
    }
  });

  // --- Note sur l'autoplay ---
  // Tente de lancer la musique, mais gère l'erreur si le navigateur bloque
  let playPromise = backgroundMusic.play();
  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      // L'autoplay a été bloqué.
      // La musique ne démarrera pas avant le premier clic sur le bouton.
      console.log("L'autoplay a été bloqué par le navigateur.");
      // On peut mettre à jour le bouton pour refléter cet état initial
      muteButton.textContent = "🔇 Son coupé";
    });
  }
}

function initGameCarousel() {
  const games = [
    {
      name: "Flappy Bird",
      image: "asset/img/flappy.png",
      imageDesktop: "asset/img/flappy.png",
      imageMobile: "asset/img/flappy-mobile.png",
      link: "/html/Flappy-Bird.html",
    },
    {
      name: "Tic Tac Toe",
      image: "asset/img/tictactoe.png",
      imageDesktop: "asset/img/tictactoe.png",
      imageMobile: "asset/img/tictactoe.png",
      link: "html/tictactoe.html",
    },
        {
      name: "Fusionclicker",
      image: "asset/img/Fusionclicker.png",
      imageDesktop: "asset/img/Fusionclicker.png",
      imageMobile: "asset/img/Fusionclicker.png",
      link: "html/Fusionclicker.html",
    },
  ];

  const prevButton = document.querySelector("#prev");
  const nextButton = document.querySelector("#next");
  const photo = document.querySelector(".selector-photo-image");
  const gameName = document.querySelector("#gameName");
  const playBtn = document.querySelector("#playBtn");

  if (!prevButton || !nextButton || !photo || !gameName || !playBtn) {
    return;
  }

  const mediaQuery = window.matchMedia("(max-width: 768px)");

  const state = {
    index: 0,
    animating: false,
    prefersReducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches,
  };

  updateGame(0);

  const handleViewportChange = () => {
    applyPhotoSource(games[state.index]);
  };

  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", handleViewportChange);
  } else {
    mediaQuery.addListener(handleViewportChange);
  }

  prevButton.addEventListener("click", () => handleNavigation(-1));
  nextButton.addEventListener("click", () => handleNavigation(1));

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      handleNavigation(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      handleNavigation(1);
    } else if (event.key === "Enter" && document.activeElement === playBtn) {
      launchSelectedGame();
    }
  });

  playBtn.addEventListener("click", launchSelectedGame);

  function handleNavigation(step) {
    if (state.animating) {
      return;
    }
    const nextIndex = (state.index + step + games.length) % games.length;
    animateTo(nextIndex, step > 0 ? 1 : -1);
  }

  async function animateTo(nextIndex, direction) {
    if (state.animating || nextIndex === state.index) {
      return;
    }

    state.animating = true;
    photo.classList.add("is-animating");

    const distance = direction > 0 ? "-64px" : "64px";
    const incoming = direction > 0 ? "64px" : "-64px";

    await runAnimation([
      { opacity: 1, transform: "translateX(0)", filter: "blur(0px)" },
      { opacity: 0, transform: `translateX(${distance})`, filter: "blur(6px)" },
    ]);

    updateGame(nextIndex);

    await runAnimation([
      { opacity: 0, transform: `translateX(${incoming})`, filter: "blur(6px)" },
      { opacity: 1, transform: "translateX(0)", filter: "blur(0px)" },
    ]);

    photo.classList.remove("is-animating");
    state.animating = false;
  }

  function runAnimation(keyframes) {
    if (state.prefersReducedMotion) {
      return Promise.resolve();
    }
    const animation = photo.animate(keyframes, {
      duration: 260,
      easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      fill: "forwards",
    });
    return animation.finished.catch(() => {});
  }

  function updateGame(nextIndex) {
    state.index = nextIndex;
    const current = games[nextIndex];
    applyPhotoSource(current);
    gameName.textContent = current.name;

    const isPlayable = Boolean(current.link);
    playBtn.disabled = !isPlayable;
    playBtn.classList.toggle("is-disabled", !isPlayable);
    playBtn.setAttribute("aria-disabled", String(!isPlayable));
    playBtn.dataset.href = current.link ?? "";
  }

  function applyPhotoSource(currentGame) {
    const isMobile = mediaQuery.matches;
    const source = isMobile && currentGame.imageMobile
      ? currentGame.imageMobile
      : currentGame.imageDesktop ?? currentGame.image;

    if (!source) {
      return;
    }

    if (photo.src !== new URL(source, window.location.href).href) {
      photo.src = source;
    }
    photo.dataset.variant = isMobile ? "mobile" : "desktop";
    photo.alt = `Illustration ${isMobile ? "mobile" : "desktop"} du jeu ${currentGame.name}`;
  }

  function launchSelectedGame() {
    const targetUrl = playBtn.dataset.href;
    if (!targetUrl) {
      return;
    }
    window.location.href = targetUrl;
  }
}