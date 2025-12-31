/**
 * Black Hole Video Background
 * Uses a local video file (stemawy/bg-loop.mp4).
 * Loops: 0s-6s, then 12s-20s.
 */

(function () {
    let videoElement;
    let isInitialized = false;
    // UPDATED FILE NAME to force refresh
    const VIDEO_PATH = 'bg-loop.mp4'; 
    
    function initVideoTheme() {
        if (isInitialized) return;

        // Container
        const container = document.createElement('div');
        container.id = 'space-theme-video-container';
        Object.assign(container.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            zIndex: '-1',
            overflow: 'hidden',
            pointerEvents: 'none',
            background: '#050505'
        });
        document.body.appendChild(container);

        // Video Element
        videoElement = document.createElement('video');
        videoElement.src = VIDEO_PATH;
        videoElement.muted = true;
        videoElement.autoplay = true;
        videoElement.loop = false; 
        videoElement.playsInline = true;
        
        Object.assign(videoElement.style, {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            objectFit: 'cover',
            width: '100%',
            height: '100%'
        });
        
        container.appendChild(videoElement);

        // Complex Loop Logic
        videoElement.addEventListener('timeupdate', checkLoop);

        isInitialized = true;
    }

    function checkLoop() {
        if (!videoElement) return;
        const t = videoElement.currentTime;

        // Logic: 
        // 1. Play from 0 to 6.
        // 2. If it hits 6 (or is between 6 and 12), jump to 12.
        // 3. Play from 12 to 20.
        // 4. If it hits 20, loop back to 0.
        
        if (t >= 6 && t < 12) {
            videoElement.currentTime = 12;
            videoElement.play();
        } else if (t >= 20) {
            videoElement.currentTime = 0;
            videoElement.play();
        }
    }

    function removeVideoTheme() {
        const container = document.getElementById('space-theme-video-container');
        if (container) container.remove();
        
        if (videoElement) {
            videoElement.removeEventListener('timeupdate', checkLoop);
            videoElement.pause();
            videoElement.src = "";
            videoElement = null;
        }
        isInitialized = false;
    }

    function checkTheme() {
        const theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'space') {
            initVideoTheme();
        } else {
            removeVideoTheme();
        }
    }

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkTheme);
    } else {
        checkTheme();
    }

})();
