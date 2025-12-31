/**
 * Space Theme Handler
 * Implements a lightweight Three.js starfield for the "Space" theme.
 * Auto-initializes when data-theme="space".
 */

(function () {
    let scene, camera, renderer, stars, animationId;
    let isInitialized = false;

    // Load Three.js if not present
    function loadThree(callback) {
        if (window.THREE) {
            callback();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    function initSpaceTheme() {
        if (isInitialized) return;

        // Container
        const container = document.createElement('div');
        container.id = 'space-theme-canvas';
        Object.assign(container.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            pointerEvents: 'none',
            background: '#050505' // Fallback
        });
        document.body.appendChild(container);

        // Three.js Setup
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x050505, 0.002);

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 50;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false }); // Disable AA for perf
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio
        container.appendChild(renderer.domElement);

        // Stars
        const starGeo = new THREE.BufferGeometry();
        const starCount = 1500; // Reduced count for content pages
        const starPos = [];
        for (let i = 0; i < starCount; i++) {
            starPos.push((Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400);
        }
        starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0.8 });
        stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        isInitialized = true;
        animate();

        // Resize
        window.addEventListener('resize', onResize);
    }

    function onResize() {
        if (!camera || !renderer) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
        if (!document.getElementById('space-theme-canvas')) {
            isInitialized = false;
            return; // Stop if removed
        }

        animationId = requestAnimationFrame(animate);

        // Gentle Fly-through
        stars.position.z += 0.05;
        if (stars.position.z > 50) stars.position.z = -50; // Loop?? No, points are static geometry.

        // Actually better to rotate or move points
        // Let's just rotate gently
        stars.rotation.y += 0.0005;
        stars.rotation.z += 0.0002;

        renderer.render(scene, camera);
    }

    function removeSpaceTheme() {
        const container = document.getElementById('space-theme-canvas');
        if (container) {
            container.remove();
        }
        if (animationId) cancelAnimationFrame(animationId);
        window.removeEventListener('resize', onResize);

        // Cleanup Three.js
        if (renderer) {
            renderer.dispose();
            scene = null;
            camera = null;
            renderer = null;
        }
        isInitialized = false;
    }

    // Observer for Theme Changes
    function checkTheme() {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'space') {
            loadThree(initSpaceTheme);
        } else {
            removeSpaceTheme();
        }
    }

    // Init Observer
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Check initial state
    document.addEventListener('DOMContentLoaded', checkTheme);
    checkTheme(); // Check immediately too

})();
