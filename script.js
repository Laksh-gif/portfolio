document.addEventListener("DOMContentLoaded", () => {
    // 🌟 Smooth scrolling for navbar links
    document.querySelectorAll(".nav-links a").forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute("href")).scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    // 📨 Contact form validation
    document.getElementById("contact-form").addEventListener("submit", function (e) {
        e.preventDefault();
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let message = document.getElementById("message").value;

        if (name === "" || email === "" || message === "") {
            alert("All fields are required!");
        } else {
            alert("Message sent successfully!");
            this.reset();
        }
    });

    // 🔥 Navbar animation on scroll
    const navbar = document.querySelector("header");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });
});

// 🎨 Interactive Moving Lines Background
const canvas = document.getElementById("backgroundCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initLines();
});

// Create moving lines
let lines = [];
const numLines = 80; // Reduce number for better performance
let mouse = { x: null, y: null };

function initLines() {
    lines = [];
    for (let i = 0; i < numLines; i++) {
        lines.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 120 + 50,
            speedX: (Math.random() * 0.5 - 0.25), // ⏳ Slower movement
            speedY: (Math.random() * 0.5 - 0.25),
            angle: Math.random() * Math.PI * 2
        });
    }
}
initLines();

// Mouse interaction
window.addEventListener("mousemove", (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Draw & animate lines
function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(0, 255, 255, 0.7)";
    ctx.lineWidth = 1.2;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Move line position
        line.x += line.speedX;
        line.y += line.speedY;

        // Bounce off edges
        if (line.x < 0 || line.x > canvas.width) line.speedX *= -1;
        if (line.y < 0 || line.y > canvas.height) line.speedY *= -1;

        // Make lines react to mouse
        if (mouse.x && mouse.y) {
            let dx = mouse.x - line.x;
            let dy = mouse.y - line.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 150) {
                line.x -= dx * 0.01;
                line.y -= dy * 0.01;
            }
        }

        // Draw the line
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(
            line.x + Math.cos(line.angle) * line.length,
            line.y + Math.sin(line.angle) * line.length
        );
        ctx.stroke();
    }

    connectLines();
    requestAnimationFrame(drawLines);
}

// Connect nearby lines for pattern effect
function connectLines() {
    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
            let dx = lines[i].x - lines[j].x;
            let dy = lines[i].y - lines[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 130) { // Reduce max distance for performance
                ctx.strokeStyle = `rgba(0, 255, 255, ${1 - distance / 130})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(lines[i].x, lines[i].y);
                ctx.lineTo(lines[j].x, lines[j].y);
                ctx.stroke();
            }
        }
    }
}

drawLines();
