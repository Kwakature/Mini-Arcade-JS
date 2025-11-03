
document.addEventListener("DOMContentLoaded", () => {
    const bird = document.querySelector("#bird");
    const screen = document.querySelector("#gameScreen");
    const jumpButton = document.querySelector("#jumpButton");

    if (!bird || !screen || !jumpButton) {
        return;
    }

    const physics = {
        gravity: 0.35,
        jumpVelocity: -6.5,
        maxFallSpeed: 9,
    };

    let birdY = 0;
    let velocity = 0;
    let bounds = { min: 0, max: 0 };

    const updateBounds = () => {
        const screenHeight = screen.clientHeight;
        const birdHeight = bird.clientHeight;
        bounds = {
            min: 0,
            max: Math.max(screenHeight - birdHeight, 0),
        };
        if (!birdY) {
            birdY = screenHeight * 0.4;
        } else {
            birdY = Math.min(Math.max(birdY, bounds.min), bounds.max);
        }
        bird.style.transform = `translateY(${birdY}px)`;
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    const loop = () => {
        velocity += physics.gravity;
        velocity = Math.min(velocity, physics.maxFallSpeed);
        birdY += velocity;

        if (birdY > bounds.max) {
            birdY = bounds.max;
            velocity = 0;
        } else if (birdY < bounds.min) {
            birdY = bounds.min;
            velocity = 0;
        }

        bird.style.transform = `translateY(${Math.round(birdY)}px)`;
        requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    const handleJump = (event) => {
        if (event.code !== "Space") {
            return;
        }
        event.preventDefault();
        velocity = physics.jumpVelocity;
        jumpButton.classList.add("is-pressed");
        bird.classList.add("is-flapping");
        clearTimeout(handleJump.releaseTimeout);
        handleJump.releaseTimeout = setTimeout(() => {
            bird.classList.remove("is-flapping");
        }, 120);
    };

    const handleKeyUp = (event) => {
        if (event.code !== "Space") {
            return;
        }
        jumpButton.classList.remove("is-pressed");
    };

    document.addEventListener("keydown", handleJump);
    document.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", () => {
        jumpButton.classList.remove("is-pressed");
    });
});
