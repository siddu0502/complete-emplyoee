// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});



// Simple fade-in animation on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
featureCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `all 0.4s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Form submission handler
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Login functionality coming soon!');
        loginForm.reset();
    });
}

// Simple scroll effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.02;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Simple page load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Simple fade in for hero elements
    const heroElements = [
        '.hero-title',
        '.hero-subtitle',
        '.hero-description',
        '.hero-buttons'
    ];
    
    heroElements.forEach((selector, index) => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.transition = 'opacity 0.4s ease';
                element.style.opacity = '1';
            }, index * 150);
        }
    });
});

// Console welcome message
console.log('Welcome to Oppty - Professional Attendance & Leave Management System');
