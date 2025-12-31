/**
 * Stemawy Theme Effects
 * Handles unique animations for each theme using Anime.js and Canvas.
 */

const ThemeEffects = (() => {
    let currentCleanup = null;
    let mouseX = 0;
    let mouseY = 0;

    // Track mouse globally
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // --- Midnight Theme: Interactive Retro Grid (React Bits inspired) ---
    function initMidnight() {
        // Create Canvas Overlay
        const canvas = document.createElement('canvas');
        canvas.id = 'midnight-grid-canvas';
        Object.assign(canvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '-1',
            pointerEvents: 'none',
            background: '#1a0b2e' // Dark Indigo Base
        });
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width, height;
        let squares = [];
        const gridSize = 40; // Size of grid squares

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initSquares();
        }

        function initSquares() {
            squares = [];
            for (let x = 0; x < width; x += gridSize) {
                for (let y = 0; y < height; y += gridSize) {
                    squares.push({
                        x, y,
                        baseAlpha: 0.1,
                        activeAlpha: 0,
                        color: '#ff00ff'
                    });
                }
            }
        }

        function draw() {
            if (!document.getElementById('midnight-grid-canvas')) return;

            ctx.clearRect(0, 0, width, height);

            squares.forEach(sq => {
                // Calculate distance to mouse
                const dx = mouseX - (sq.x + gridSize / 2);
                const dy = mouseY - (sq.y + gridSize / 2);
                const dist = Math.sqrt(dx * dx + dy * dy);

                // React to mouse: Increase alpha if close
                if (dist < 150) {
                    sq.activeAlpha = 1 - (dist / 150);
                } else {
                    sq.activeAlpha *= 0.95; // Decay
                }

                // Draw Border
                ctx.strokeStyle = `rgba(255, 0, 255, ${Math.max(sq.baseAlpha, sq.activeAlpha * 0.8)})`;
                ctx.lineWidth = 1;
                ctx.strokeRect(sq.x, sq.y, gridSize, gridSize);

                // Fill if active
                if (sq.activeAlpha > 0.1) {
                    ctx.fillStyle = `rgba(0, 255, 255, ${sq.activeAlpha * 0.3})`;
                    ctx.fillRect(sq.x, sq.y, gridSize, gridSize);
                }
            });

            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', resize);
        resize();
        draw();

        // Cleanup function
        return () => {
            window.removeEventListener('resize', resize);
            canvas.remove();
        };
    }

    // --- Christmas Theme: Enhanced Snow ---
    function initChristmas() {
        const container = document.createElement('div');
        container.id = 'snow-container-fs';
        Object.assign(container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '50', // On top
            pointerEvents: 'none'
        });
        document.body.appendChild(container);

        const snowflakeCount = 50;

        // Use Anime.js to animate creation? No, let's use setInterval loop but animate with anime.js
        // Actually, let's use a pure anime.js loop for better performance control

        let active = true;

        function createSnowflake() {
            if (!active) return;
            const el = document.createElement('div');
            el.classList.add('snowflake-enhanced'); // CSS class for basic shape
            Object.assign(el.style, {
                position: 'absolute',
                top: '-20px',
                left: Math.random() * 100 + 'vw',
                width: Math.random() * 5 + 3 + 'px',
                height: Math.random() * 5 + 3 + 'px',
                background: 'white',
                borderRadius: '50%',
                opacity: Math.random()
            });
            container.appendChild(el);

            // Animate fall with Sway
            anime({
                targets: el,
                translateY: '110vh',
                translateX: {
                    value: () => anime.random(-50, 50),
                    duration: 3000,
                    easing: 'easeInOutSine',
                    direction: 'alternate',
                    loop: true
                },
                duration: anime.random(3000, 8000),
                easing: 'linear',
                complete: () => {
                    el.remove();
                    createSnowflake(); // Keep generating
                }
            });
        }

        // Initial burst - reduced
        for (let i = 0; i < 10; i++) setTimeout(createSnowflake, i * 300);
        // Slower interval
        const interval = setInterval(createSnowflake, 800);

        return () => {
            active = false;
            clearInterval(interval);
            container.remove();
        };
    }

    // --- Public Methods ---

    function setEffect(theme) {
        // Cleanup previous
        if (currentCleanup) {
            currentCleanup();
            currentCleanup = null;
        }

        // Hide other specific backgrounds if needed
        const cyberGrid = document.querySelector('.cyber-wrapper');
        if (cyberGrid) cyberGrid.style.display = 'none';

        const spaceCanvas = document.getElementById('space-theme-canvas');
        if (spaceCanvas) spaceCanvas.style.display = 'none';

        // Apply new
        if (theme === 'midnight') {
            currentCleanup = initMidnight();
        } else if (theme === 'christmas') {
            currentCleanup = initChristmas();
        } else if (theme === 'dark') {
            // Restore default cyber grid
            if (cyberGrid) cyberGrid.style.display = 'block';
        } else if (theme === 'space') {
            if (spaceCanvas) spaceCanvas.style.display = 'block';
            // space-theme.js handles its own creation, we just show/hide if it exists or let it handle itself?
            // space-theme.js is an IIFE that auto-runs. We should coordinate.
            // For now, let's rely on space-theme.js's mutation observer, but we might likely need to unhide it here.
        }
    }

    function animateCards() {
        if (typeof anime !== 'undefined') {
            anime({
                targets: ['.subject-card', '.comp-card'],
                opacity: [0, 1],
                translateY: [20, 0],
                delay: anime.stagger(100),
                easing: 'easeOutQuad'
            });
        }
    }

    return {
        setEffect,
        animateCards
    };

})();

// expose for direct use if needed, but mainly used by index.html logic
window.ThemeEffects = ThemeEffects;
