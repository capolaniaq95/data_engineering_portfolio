/**
 * Animation JavaScript file for Data Engineer Portfolio
 * Handles scroll animations, reveal effects, and interactive animations
 */

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initParticleSystem();
    initSkillBars();
    initCounterAnimations();
    initHoverEffects();
});

/**
 * Initialize scroll-based reveal animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animateElements = document.querySelectorAll('.animate-on-scroll, .animate-on-scroll-left, .animate-on-scroll-right, .animate-on-scroll-scale');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Observe sections for staggered animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });

    // Observe skill items
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(item);
    });

    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(item);
    });

    // Observe certification cards
    const certCards = document.querySelectorAll('.certification-card');
    certCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
}

/**
 * Initialize particle system for hero section
 */
function initParticleSystem() {
    const particlesContainer = document.getElementById('particles');

    if (!particlesContainer) return;

    const particleCount = 50;
    const particles = [];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background-color: ${Math.random() > 0.5 ? 'var(--primary-color)' : 'var(--secondary-color)'};
            border-radius: 50%;
            opacity: ${Math.random() * 0.5 + 0.1};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: particleFloat ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 10}s;
        `;
        particlesContainer.appendChild(particle);
        particles.push(particle);
    }

    // Update particle positions on scroll
    window.addEventListener('scroll', throttle(updateParticles, 16));

    function updateParticles() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        particles.forEach((particle, index) => {
            const speed = (index % 3 + 1) * 0.5;
            particle.style.transform = `translateY(${rate * speed}px)`;
        });
    }
}

/**
 * Initialize skill bar animations
 */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 200);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

/**
 * Initialize counter animations for statistics
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent);
                animateCounter(counter, 0, target, 2000);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));

    /**
     * Animate counter from start to end value
     * @param {Element} element - The element to animate
     * @param {number} start - Starting value
     * @param {number} end - Ending value
     * @param {number} duration - Animation duration in milliseconds
     */
    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        const endTime = startTime + duration;

        function updateCounter(currentTime) {
            if (currentTime < endTime) {
                const progress = (currentTime - startTime) / duration;
                const easeOutProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
                const currentValue = Math.floor(start + (end - start) * easeOutProgress);
                element.textContent = currentValue;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = end;
            }
        }

        requestAnimationFrame(updateCounter);
    }
}

/**
 * Initialize hover effects for interactive elements
 */
function initHoverEffects() {
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });

    // Add hover effects to social links
    const socialLinks = document.querySelectorAll('.social-link, .footer-social a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add hover effects to certification cards
    const certCards = document.querySelectorAll('.certification-card');
    certCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) rotate(1deg)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });

    // Add typing effect to hero title (optional)
    initTypingEffect();
}

/**
 * Initialize typing effect for hero title
 */
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title-main');
    if (!heroTitle) return;

    const text = heroTitle.textContent;
    heroTitle.textContent = '';
    heroTitle.style.borderRight = '2px solid var(--primary-color)';

    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            heroTitle.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            setTimeout(() => {
                heroTitle.style.borderRight = 'none';
            }, 500);
        }
    }, 100);
}

/**
 * Initialize parallax effects
 */
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');

    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(element => {
            const rate = element.dataset.parallax || 0.5;
            element.style.transform = `translateY(${scrolled * rate}px)`;
        });
    }, 16));
}

/**
 * Initialize magnetic effect for buttons (optional)
 */
function initMagneticEffect() {
    const magneticElements = document.querySelectorAll('.btn-magnetic');

    magneticElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
        });
    });
}

/**
 * Initialize scroll progress indicator
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = `${scrollPercent}%`;
    }, 16));
}

/**
 * Initialize loading animations
 */
function initLoadingAnimations() {
    // Add loading class to elements that should animate in
    const elementsToAnimate = document.querySelectorAll('section, .project-card, .skill-item, .timeline-item, .certification-card');

    elementsToAnimate.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;

        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    });
}

/**
 * Utility function to throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit time in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

/**
 * Utility function to check if element is in viewport
 * @param {Element} element - The element to check
 * @returns {boolean} - True if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Initialize additional animation features
initParallaxEffects();
initMagneticEffect();
initScrollProgress();
initLoadingAnimations();