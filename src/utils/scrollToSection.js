let activeAutoAnimCancel = null;

function cancelActiveAutoAnim() {
    if (activeAutoAnimCancel) {
        activeAutoAnimCancel();
        activeAutoAnimCancel = null;
    }
}

/**
 * Desativa imediatamente a animação de frames do Hero e leva a tela
 * direto para a seção de destino sem travar no meio do caminho.
 */
export function jumpToSection(sectionId) {
    if (!sectionId) return;

    cancelActiveAutoAnim();

    sessionStorage.setItem("skipFramesLock", "true");
    window.dispatchEvent(new CustomEvent("navBypassFrames"));

    const performScroll = () => {
        const target = document.getElementById(sectionId);
        if (!target) return false;

        const html = document.documentElement;
        const prevScrollBehavior = html.style.scrollBehavior;
        html.style.scrollBehavior = "auto";

        const headerHeight = window.innerWidth >= 768 ? 80 : 64;
        const computeTop = () =>
            Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight);

        window.scrollTo(0, computeTop());

        requestAnimationFrame(() => {
            window.scrollTo(0, computeTop());
            requestAnimationFrame(() => {
                html.style.scrollBehavior = prevScrollBehavior;
            });
        });

        if (window.location.hash !== `#${sectionId}`) {
            window.history.replaceState(null, "", `/#${sectionId}`);
        }

        return true;
    };

    if (!performScroll()) {
        let attempts = 0;
        const interval = setInterval(() => {
            attempts += 1;
            if (performScroll() || attempts >= 25) {
                clearInterval(interval);
            }
        }, 40);
    }
}

export function jumpToTop() {
    cancelActiveAutoAnim();

    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    if (window.location.hash) {
        window.history.replaceState(null, "", "/");
    }
    requestAnimationFrame(() => {
        html.style.scrollBehavior = prevScrollBehavior;
    });
}

/**
 * Reproduz suavemente a animação de abertura do Hero descendo sozinho
 * aos poucos até parar exatamente no último frame (Frame 168).
 */
export function playHeroAnimation(durationMs = 5600) {
    cancelActiveAutoAnim();

    const html = document.documentElement;
    const prevScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";

    // Se já estiver perto do fim, reinicia do topo para mostrar se formando completa
    const targetY = Math.round(window.innerHeight * 2 * 0.991);
    const initialY = window.scrollY >= targetY * 0.85 ? 0 : window.scrollY;
    if (initialY === 0 && window.scrollY !== 0) {
        window.scrollTo(0, 0);
    }

    window.dispatchEvent(new CustomEvent("navStartHeroAnimation"));

    const distance = targetY - initialY;
    // Ajusta duração proporcionalmente se não começar do zero
    const fullDistance = Math.max(1, targetY);
    const effectiveDuration = Math.max(1800, durationMs * (distance / fullDistance));

    let rafId = null;
    let finished = false;
    const startTime = performance.now();

    const cleanup = () => {
        if (finished) return;
        finished = true;
        if (rafId !== null) cancelAnimationFrame(rafId);
        html.style.scrollBehavior = prevScrollBehavior;
        window.removeEventListener("wheel", onUserInterrupt);
        window.removeEventListener("touchstart", onUserInterrupt);
        window.removeEventListener("keydown", onKeyInterrupt);
        window.dispatchEvent(new CustomEvent("navEndHeroAnimation"));
        if (activeAutoAnimCancel === cleanup) {
            activeAutoAnimCancel = null;
        }
    };

    const onUserInterrupt = () => cleanup();
    const onKeyInterrupt = (e) => {
        if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", "Home", "End"].includes(e.code)) {
            cleanup();
        }
    };

    window.addEventListener("wheel", onUserInterrupt, { passive: true });
    window.addEventListener("touchstart", onUserInterrupt, { passive: true });
    window.addEventListener("keydown", onKeyInterrupt);

    activeAutoAnimCancel = cleanup;

    const step = (now) => {
        if (finished) return;

        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / effectiveDuration);
        // Curva suave (easeInOutSine) que monta os frames com cadência constante e desacelera no último frame
        const eased = 0.5 * (1 - Math.cos(Math.PI * progress));

        const nextTargetY = Math.round(window.innerHeight * 2 * 0.991);
        const currentY = initialY + (nextTargetY - initialY) * eased;

        window.scrollTo(0, currentY);

        if (progress < 1) {
            rafId = requestAnimationFrame(step);
        } else {
            window.scrollTo(0, nextTargetY);
            cleanup();
        }
    };

    rafId = requestAnimationFrame(step);
}
