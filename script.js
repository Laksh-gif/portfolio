document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('[data-scroll]').forEach((el) => observer.observe(el));

    // Contact Form
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        if ([...formData.values()].some(value => !value.trim())) {
            showError('All fields are required');
            return;
        }
        
        showSuccess('Message sent successfully!');
        e.target.reset();
    });

    function showError(message) {
        const errorEl = document.createElement('div');
        errorEl.className = 'alert error';
        errorEl.textContent = message;
        document.body.appendChild(errorEl);
        setTimeout(() => errorEl.remove(), 3000);
    }

    function showSuccess(message) {
        const successEl = document.createElement('div');
        successEl.className = 'alert success';
        successEl.textContent = message;
        document.body.appendChild(successEl);
        setTimeout(() => successEl.remove(), 3000);
    }

    // Background Animation
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = `rgba(0, 255, 255, ${this.size/3})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = Array(50).fill().map(() => new Particle());
    }

    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', init);
    init();
    animate();
});
