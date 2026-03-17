document.addEventListener('DOMContentLoaded', () => {
    // 1. Intersection Observer for Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once it's visible if we only want it to animate once
                // observer.unobserve(entry.target);
            } else {
                // Remove visible class when not in view, so it animates again on scroll back up
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // 2. 3D Tilt Effect for Cards
    const tiltContainers = document.querySelectorAll('.tilt-card');
    
    tiltContainers.forEach(container => {
        container.addEventListener('mousemove', e => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; // adjust factor for intensity
            const rotateY = ((x - centerX) / centerX) * 15;
            
            container.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        container.addEventListener('mouseleave', () => {
            container.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 3. Set Active Nav Link based on Current Page
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll('nav.navbar a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'portfolio.html')) {
            link.classList.add('active');
        }
    });
});
