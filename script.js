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
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });

    const EMAILJS_CONFIG = {
        SERVICE_ID: 'service_gyo6t38',
        ADMIN_TEMPLATE: 'template_p1x4zlr',
        AUTOREPLY_TEMPLATE: 'template_198zcoi'
    };

    // 4. Contact Form Handling with EmailJS
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const submitBtn = this.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;

            // Collect form data
            const templateParams = {
                from_name: document.getElementById('firstname').value + ' ' + document.getElementById('lastname').value,
                from_email: document.getElementById('Email').value,
                subject: document.getElementById('Subject').value,
                message: document.getElementById('message').value,
            };

            // Email validation (stronger version)
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailPattern.test(templateParams.from_email)) {
                alert("❌ Please enter a valid email address");
                return;
            }

            // Optional: empty field check
            if (!templateParams.from_name || !templateParams.subject || !templateParams.message) {
                alert("❌ Please fill all fields");
                return;
            }

            // Loading state
            submitBtn.innerHTML = 'Sending... <span class="spinner"></span>';
            submitBtn.disabled = true;

            // 1️⃣ Send to ADMIN
            emailjs.send(
                EMAILJS_CONFIG.SERVICE_ID,
                EMAILJS_CONFIG.ADMIN_TEMPLATE,
                templateParams
            )

                // 2️⃣ Then send AUTO-REPLY
                .then(() => {
                    return emailjs.send(
                        EMAILJS_CONFIG.SERVICE_ID,
                        EMAILJS_CONFIG.AUTOREPLY_TEMPLATE,
                        templateParams
                    );
                })

                // ✅ Success
                .then(() => {
                    submitBtn.innerHTML = 'Message Sent! ✅';
                    submitBtn.style.backgroundColor = '#4CAF50';

                    contactForm.reset();

                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                    }, 4000);
                })

                // ❌ Error handling
                .catch(err => {
                    console.error("FULL EMAILJS ERROR OBJECT:", err);

                    // Show detailed error in UI
                    alert(
                        `❌ Failed to send email\n\n` +
                        `Status: ${err.status}\n` +
                        `Text: ${err.text}\n\n` +
                        `Check console for full details`
                    );

                    submitBtn.innerHTML = 'Error! ❌';
                    submitBtn.style.backgroundColor = '#f44336';

                    setTimeout(() => {
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                        submitBtn.style.backgroundColor = '';
                    }, 4000);
                });
        });
    }
});
