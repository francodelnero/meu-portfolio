/*
 * Header interativo
 * ---------------------------------------------------------
 * A referência usa jQuery + animações antigas.
 * Aqui o comportamento foi refeito em JavaScript puro:
 * - entrada inicial dos dois lados;
 * - movimento suave acompanhando o mouse;
 * - revelação maior do lado correspondente;
 * - retorno suave ao centro ao sair.
 */

(() => {
    const hero = document.querySelector("#hero");
    const stage = document.querySelector(".hero-stage");
    const leftImage = document.querySelector(".hero-image--left");
    const rightImage = document.querySelector(".hero-image--right");
    const leftCopy = document.querySelector(".hero-copy--left");
    const rightCopy = document.querySelector(".hero-copy--right");

    if (hero && stage && leftImage && rightImage) {
        let targetX = 0.9;
        let currentX = 0.9;
        let animationFrame = null;

        const isDesktop = () => window.matchMedia("(min-width: 1140px)").matches;
        const prefersReducedMotion = () =>
            window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        function render() {
            const width = stage.clientWidth;
            const maxTravel = Math.min(110, width * 0.105);

            // Suavização semelhante ao "Zeno" usado na referência.
            currentX += (targetX - currentX) * 0.12;

            const offset = (currentX - 0.5) * 10;
            const leftExtra = -offset * maxTravel;
            const rightExtra = offset * maxTravel;

            const leftWidth = 42 + (-offset * 8);
            const rightWidth = 42 + (offset * 8);

            leftImage.style.left = `${10 + leftExtra / 10}%`;
            rightImage.style.right = `${10 - rightExtra / 10}%`;

            leftImage.style.width = `${leftWidth}%`;
            rightImage.style.width = `${rightWidth}%`;

            // Os textos desaparecem gradualmente conforme o lado oposto é revelado.
            if (leftCopy) {
                leftCopy.style.opacity = String(Math.max(0.05, 1 - Math.max(offset, 0) * 1));
            }

            if (rightCopy) {
                rightCopy.style.opacity = String(Math.max(0.05, 1 - Math.max(-offset, 0) * 1));
            }

            if (Math.abs(targetX - currentX) > 0.001 && isDesktop()) {
                animationFrame = requestAnimationFrame(render);
            } else {
                animationFrame = null;
            }
        }

        function updateFromPointer(clientX) {
            const rect = stage.getBoundingClientRect();

            targetX = (clientX - rect.left) / rect.width;
            targetX = Math.max(0, Math.min(1, targetX));

            if (!animationFrame) {
                animationFrame = requestAnimationFrame(render);
            }
        }

        hero.addEventListener("pointermove", (event) => {
            if (!isDesktop() || prefersReducedMotion()) return;
            updateFromPointer(event.clientX);
        });

        hero.addEventListener("pointerleave", () => {
            targetX = 0.5;

            if (!animationFrame && !prefersReducedMotion()) {
                animationFrame = requestAnimationFrame(render);
            }
        });

        // Evita tentar usar o efeito de mouse em telas pequenas.
        window.addEventListener("resize", () => {
            if (!isDesktop()) {
                targetX = 0.5;
                currentX = 0.5;

                leftImage.style.left = "8%";
                rightImage.style.right = "8%";
                leftImage.style.width = "42%";
                rightImage.style.width = "42%";
            }
        });
    }

    // Menu mobile.
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".main-nav");

    if (menuButton && navigation) {
        menuButton.addEventListener("click", () => {
            const isOpen = navigation.classList.toggle("is-open");
            menuButton.setAttribute("aria-expanded", String(isOpen));
        });
    }
})();
