/**
 * BrajYatra — Landing Page & Particle Canvas
 * Golden sacred particle animation + landing page transitions
 */

(function () {
    'use strict';

    // ═══════════════ PARTICLE CANVAS ═══════════════
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isRunning = true;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
            this.growing = Math.random() > 0.5;
            // Sacred golden hues
            const hue = 30 + Math.random() * 25; // 30-55 (gold to amber)
            const sat = 70 + Math.random() * 30;
            const light = 50 + Math.random() * 20;
            this.color = `hsla(${hue}, ${sat}%, ${light}%, `;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.growing) {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 0.6) this.growing = false;
            } else {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0.05) {
                    this.reset();
                    this.growing = true;
                }
            }

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.fill();

            // Glow effect
            if (this.size > 1.5) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
                ctx.fillStyle = this.color + (this.opacity * 0.15) + ')';
                ctx.fill();
            }
        }
    }

    function initParticles() {
        const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        if (!isRunning) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animate);
    }

    function stopAnimation() {
        isRunning = false;
        if (animationId) cancelAnimationFrame(animationId);
    }

    // Initialize
    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // ═══════════════ LANDING → CHAT TRANSITION ═══════════════
    window.enterChat = function () {
        const landing = document.getElementById('landing');
        const chatApp = document.getElementById('app');

        if (!landing || !chatApp) return;

        // Fade out landing
        landing.classList.add('fade-out');

        setTimeout(() => {
            landing.classList.add('gone');
            chatApp.classList.remove('hidden');
            chatApp.classList.add('visible');
            stopAnimation();
        }, 900);
    };

    // Skip landing if already visited in this session
    if (sessionStorage.getItem('brajyatra_entered')) {
        const landing = document.getElementById('landing');
        const chatApp = document.getElementById('app');
        if (landing && chatApp) {
            landing.classList.add('gone');
            chatApp.classList.remove('hidden');
            chatApp.classList.add('visible');
            stopAnimation();
        }
    }

    // Mark as entered when user clicks start
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            sessionStorage.setItem('brajyatra_entered', 'true');
        });
    }
})();
