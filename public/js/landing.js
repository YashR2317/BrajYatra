(function () {
    'use strict';

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
            
            const hue = 30 + Math.random() * 25; 
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

    function restartAnimation() {
        if (!isRunning) {
            isRunning = true;
            resizeCanvas();
            initParticles();
            animate();
        }
    }

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    window.enterChat = function () {
        const landing = document.getElementById('landing');
        const chatApp = document.getElementById('app');

        if (!landing || !chatApp) return;

        landing.classList.add('fade-out');

        setTimeout(() => {
            landing.classList.add('gone');
            chatApp.classList.remove('hidden');
            chatApp.classList.add('visible');
            stopAnimation();
        }, 900);
    };

    window.restartLandingAnimation = restartAnimation;

    window.goToLanding = function () {
        const landing = document.getElementById('landing');
        const chatApp = document.getElementById('app');
        if (!landing || !chatApp) return;

        chatApp.classList.remove('visible');
        chatApp.classList.add('hidden');

        landing.classList.remove('gone', 'fade-out');
        sessionStorage.removeItem('brajyatra_entered');

        const cityPlacesView = document.getElementById('city-places-view');
        const landingContent = document.querySelector('.landing-content');
        if (cityPlacesView) cityPlacesView.classList.add('hidden');
        if (landingContent) landingContent.classList.remove('hidden');

        restartAnimation();
    };

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

    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            sessionStorage.setItem('brajyatra_entered', 'true');
        });
    }

    document.querySelectorAll('.city-link').forEach(link => {
        link.addEventListener('click', async () => {
            const city = link.dataset.city;
            if (!city) return;

            const landingContent = document.querySelector('.landing-content');
            const cityPlacesView = document.getElementById('city-places-view');
            const cityPlacesName = document.getElementById('city-places-name');
            const cityPlacesGrid = document.getElementById('city-places-grid');

            if (!landingContent || !cityPlacesView || !cityPlacesGrid) return;

            cityPlacesName.textContent = city;
            cityPlacesGrid.innerHTML = '<div class="city-places-loading">Loading places...</div>';

            landingContent.classList.add('hidden');
            cityPlacesView.classList.remove('hidden');

            try {
                const res = await fetch(`/api/places?city=${encodeURIComponent(city)}`);
                const places = await res.json();

                if (!places || places.length === 0) {
                    cityPlacesGrid.innerHTML = '<p class="city-places-empty">No places found for this city.</p>';
                    return;
                }

                cityPlacesGrid.innerHTML = places.map(p => `
                    <div class="city-place-card">
                        <div class="city-place-img-wrap">
                            <img src="${p.image_url || '/assets/images/krishna_janmabhoomi.png'}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
                        </div>
                        <div class="city-place-body">
                            <h4>${p.name}</h4>
                            <span class="city-place-cat">${p.category || ''}</span>
                            ${p.description ? `<p>${p.description.length > 100 ? p.description.slice(0, 100) + '...' : p.description}</p>` : ''}
                            <div class="city-place-meta">
                                ${p.estimated_visit_duration ? `<span>⏱️ ${p.estimated_visit_duration} min</span>` : ''}
                                ${p.best_time ? `<span>🕐 ${p.best_time}</span>` : ''}
                                ${p.crowd_level ? `<span>👥 ${p.crowd_level}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('');
            } catch (e) {
                cityPlacesGrid.innerHTML = '<p class="city-places-empty">Failed to load places. Please try again.</p>';
            }
        });
    });

    const cityPlacesBackBtn = document.getElementById('city-places-back');
    if (cityPlacesBackBtn) {
        cityPlacesBackBtn.addEventListener('click', () => {
            const landingContent = document.querySelector('.landing-content');
            const cityPlacesView = document.getElementById('city-places-view');
            if (landingContent) landingContent.classList.remove('hidden');
            if (cityPlacesView) cityPlacesView.classList.add('hidden');
        });
    }
})();

