document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle-checkbox');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light' || (!currentTheme && !prefersDarkScheme.matches)) {
        document.documentElement.classList.add('light-theme');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.remove('light-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking on a nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
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
            showAlert('All fields are required', 'error');
            return;
        }
        
        showAlert('Message sent successfully!', 'success');
        e.target.reset();
    });

    function showAlert(message, type) {
        const alertEl = document.createElement('div');
        alertEl.className = `alert ${type}`;
        alertEl.textContent = message;
        document.body.appendChild(alertEl);
        
        // Position the alert properly
        const navbarHeight = document.querySelector('.glass-nav').offsetHeight;
        alertEl.style.top = `${navbarHeight + 20}px`;
        
        setTimeout(() => {
            alertEl.style.opacity = '0';
            setTimeout(() => alertEl.remove(), 300);
        }, 3000);
    }

    // Background Animation
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    class Particle {
        constructor() {
            this.reset();
            this.alpha = Math.random() * 0.5 + 0.1;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 3 - 1.5;
            this.speedY = Math.random() * 3 - 1.5;
            this.color = document.documentElement.classList.contains('light-theme') 
                ? `rgba(98, 0, 238, ${this.alpha})` 
                : `rgba(0, 255, 255, ${this.alpha})`;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;

            // Adjust color based on theme
            this.color = document.documentElement.classList.contains('light-theme') 
                ? `rgba(98, 0, 238, ${this.alpha})` 
                : `rgba(0, 255, 255, ${this.alpha})`;
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particles = Array(50).fill().map(() => new Particle());
    }

    function animate() {
        ctx.fillStyle = document.documentElement.classList.contains('light-theme') 
            ? 'rgba(245, 245, 245, 0.1)' 
            : 'rgba(10, 10, 10, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
            
            // Connect particles that are close to each other
            particles.forEach(otherParticle => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - otherParticle.x, 2) + 
                    Math.pow(particle.y - otherParticle.y, 2)
                );
                if (distance < 100) {
                    ctx.strokeStyle = particle.color;
                    ctx.lineWidth = 0.2;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    // Handle theme changes for particles
    themeToggle.addEventListener('change', () => {
        particles.forEach(particle => {
            particle.color = document.documentElement.classList.contains('light-theme') 
                ? `rgba(98, 0, 238, ${particle.alpha})` 
                : `rgba(0, 255, 255, ${particle.alpha})`;
        });
    });

    window.addEventListener('resize', initCanvas);
    initCanvas();
    animate();
});
