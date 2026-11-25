
"use strict";

/* ==========================================
   PORTFOLIO INTERACTIONS
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const preloader = document.getElementById("preloader");
    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");

    // PRELOADER
    window.addEventListener("load", () => {
        setTimeout(() => {
            preloader?.classList.add("hide");
        }, 500);
    });
   

    // FALLBACK: hide preloader if load event already passed
    setTimeout(() => {
        preloader?.classList.add("hide");
    }, 2500);

    // PAGE ENTRY
    document.body.classList.add("page-transition");

    // MOBILE NAVIGATION
    function closeMenu() {
        mainNav?.classList.remove("open");
        menuToggle?.classList.remove("active");
        menuToggle?.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    }

    menuToggle?.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");

        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        document.body.classList.toggle("menu-open", isOpen);
    });

    mainNav?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });

    // HEADER SCROLL EFFECT
    function updateHeader() {
        header?.classList.toggle("scrolled", window.scrollY > 30);
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    // CURRENT YEAR
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // TYPING ANIMATION
    const typingElement = document.getElementById("typingText");

    if (typingElement) {
        const roles = [
            "FULL STACK DEVELOPER",
            "WEB DEVELOPER",
            "CREATIVE THINKER",
            "TECH ENTHUSIAST"
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function typeRole() {
            const currentRole = roles[roleIndex];

            if (!deleting) {
                typingElement.textContent =
                    currentRole.substring(0, charIndex + 1);

                charIndex++;

                if (charIndex === currentRole.length) {
                    deleting = true;
                    setTimeout(typeRole, 1500);
                    return;
                }
            } else {
                typingElement.textContent =
                    currentRole.substring(0, charIndex - 1);

                charIndex--;

                if (charIndex === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                }
            }

            setTimeout(typeRole, deleting ? 35 : 75);
        }

        typeRole();
    }

    // SCROLL REVEAL
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(element => {
            element.classList.add("visible");
        });
    }

    // ANIMATED CODE BACKGROUND
    const canvas = document.getElementById("codeCanvas");

    if (canvas) {
        const ctx = canvas.getContext("2d");

        const codeWords = [
            "const", "function", "return", "class",
            "async", "await", "let", "export",
            "Node.js", "JavaScript", "HTML", "CSS",
            "developer", "create()", "build()", "design"
        ];

        const colors = [
            "rgba(174, 124, 255, .7)",
            "rgba(50, 211, 255, .65)",
            "rgba(255, 174, 119, .55)",
            "rgba(125, 225, 165, .55)"
        ];

        let particles = [];
        let animationFrame = null;
        let canvasWidth = 0;
        let canvasHeight = 0;

        function resizeCanvas() {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvasWidth = window.innerWidth;
            canvasHeight = window.innerHeight;

            canvas.width = canvasWidth * dpr;
            canvas.height = canvasHeight * dpr;

            canvas.style.width = canvasWidth + "px";
            canvas.style.height = canvasHeight + "px";

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            createParticles();
        }

        function createParticles() {
            const count = Math.min(
                55,
                Math.floor(canvasWidth / 22)
            );

            particles = Array.from({ length: count }, () => ({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                speed: .12 + Math.random() * .4,
                word: codeWords[Math.floor(Math.random() * codeWords.length)],
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 9 + Math.random() * 3,
                opacity: .2 + Math.random() * .35
            }));
        }

        function drawCanvas() {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            particles.forEach(particle => {
                ctx.font = `${particle.size}px monospace`;
                ctx.fillStyle = particle.color;
                ctx.globalAlpha = particle.opacity;

                ctx.fillText(
                    particle.word,
                    particle.x,
                    particle.y
                );

                particle.y -= particle.speed;

                if (particle.y < -30) {
                    particle.y = canvasHeight + 30;
                    particle.x = Math.random() * canvasWidth;
                    particle.word =
                        codeWords[Math.floor(Math.random() * codeWords.length)];
                }
            });

            ctx.globalAlpha = 1;

            animationFrame = requestAnimationFrame(drawCanvas);
        }

        resizeCanvas();

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            drawCanvas();
        }

        window.addEventListener("resize", resizeCanvas);

        document.addEventListener("visibilitychange", () => {
            if (document.hidden && animationFrame) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
            } else if (!document.hidden && !animationFrame &&
                       !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                drawCanvas();
            }
        });
    }

    // SUBTLE CARD POINTER GLOW
    document.querySelectorAll(
        ".technology-card, .project-card, .approach-card, .mini-card"
    ).forEach(card => {

        card.addEventListener("pointermove", event => {
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });
    });

    // CLOSE MOBILE MENU ON OUTSIDE CLICK
    document.addEventListener("click", event => {
        if (
            mainNav?.classList.contains("open") &&
            !mainNav.contains(event.target) &&
            !menuToggle?.contains(event.target)
        ) {
            closeMenu();
        }
    });

});
