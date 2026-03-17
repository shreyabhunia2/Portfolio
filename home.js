/* home.js — Premium Interactions & 3D Tilt Effect */
(function() {

    // ──────────────── Typing Animation ────────────────
    const typedEl = document.getElementById('typedText');
    if (typedEl) {
        const words = ['M.C.A Student @ KIIT', 'Full Stack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'JavaScript Developer'];
        let wordIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let delay = 100;

        function type() {
            const currentWord = words[wordIdx];
            if (isDeleting) {
                typedEl.textContent = currentWord.substring(0, charIdx - 1);
                charIdx--;
                delay = 50;
            } else {
                typedEl.textContent = currentWord.substring(0, charIdx + 1);
                charIdx++;
                delay = 100;
            }

            if (!isDeleting && charIdx === currentWord.length) {
                isDeleting = true;
                delay = 2000; // Pause at end of word
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                wordIdx = (wordIdx + 1) % words.length;
                delay = 500;
            }

            setTimeout(type, delay);
        }
        type();
    }

    // ──────────────── 3D Tilt Effect ────────────────
    const tiltElements = document.querySelectorAll('.tilt-element');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', e => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt intensity (max 15 deg)
            const rotateX = ((y - centerY) / centerY) * -15;
            const rotateY = ((centerX - x) / centerX) * -15;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // ──────────────── Scroll Header Effect ────────────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('glass-scrolled');
        } else {
            navbar.classList.remove('glass-scrolled');
        }
    });

    // ──────────────── Floating Elements ────────────────
    // Adds a subtle continuous float to elements with .tilt-element
    function slowFloat() {
        tiltElements.forEach((el, idx) => {
            if (!el.matches(':hover')) {
                const time = Date.now() * 0.001;
                const offset = Math.sin(time + idx) * 5;
                el.style.transform = `translateY(${offset}px)`;
            }
        });
        requestAnimationFrame(slowFloat);
    }
    // Note: slowFloat is disabled for now as it might conflict with mouse tilt 
    // but can be enabled if the user prefers "float" over "tilt"
    // slowFloat();

})();
