// Education carousel behavior
(function() {
    const carousel = document.getElementById('eduCarousel');
    const cards = Array.from(carousel.querySelectorAll('.edu-card'));
    const prevBtn = document.querySelector('.edu-prev');
    const nextBtn = document.querySelector('.edu-next');

    if (!carousel) return;

    function updateActiveCard() {
        const carouselRect = carousel.getBoundingClientRect();
        const centerX = carouselRect.left + carouselRect.width / 2;

        let closest = null;
        let closestDist = Infinity;
        cards.forEach(card => {
            const r = card.getBoundingClientRect();
            const cardCenter = r.left + r.width / 2;
            const dist = Math.abs(centerX - cardCenter);
            if (dist < closestDist) {
                closestDist = dist;
                closest = card;
            }
            card.classList.remove('active');
        });
        if (closest) closest.classList.add('active');
    }

    function scrollToCard(card) {
        const rect = carousel.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const offset = (cardRect.left + cardRect.width / 2) - (rect.left + rect.width / 2);
        carousel.scrollBy({ left: offset, behavior: 'smooth' });
    }

    prevBtn && prevBtn.addEventListener('click', () => {
        const activeIndex = cards.findIndex(c => c.classList.contains('active'));
        const target = cards[Math.max(0, activeIndex - 1)];
        if (target) scrollToCard(target);
    });

    nextBtn && nextBtn.addEventListener('click', () => {
        const activeIndex = cards.findIndex(c => c.classList.contains('active'));
        const target = cards[Math.min(cards.length - 1, activeIndex + 1)];
        if (target) scrollToCard(target);
    });

    let rAF = null;
    carousel.addEventListener('scroll', () => {
        if (rAF) cancelAnimationFrame(rAF);
        rAF = requestAnimationFrame(updateActiveCard);
    });

    window.addEventListener('load', () => {
        setTimeout(() => {
            updateActiveCard();
            if (cards[0] && window.innerWidth > 900) scrollToCard(cards[0]);
        }, 150);
    });

    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn && prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn && nextBtn.click();
        }
    });

    window.addEventListener('resize', updateActiveCard);

    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('active')) {
                scrollToCard(card);
            }
        });
    });
})();

// Combined scroll handler for better performance
function handleScroll() {
    const scrolled = window.pageYOffset;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Progress indicator
    const progressPercent = (scrolled / scrollHeight) * 100;
    document.getElementById('scrollIndicator').style.width = progressPercent + '%';
    
    // Active navigation highlighting
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// Throttled scroll listener
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
});

// Loading Screen
window.addEventListener('load', function() {
    setTimeout(() => {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }, 1000);
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.className = 'fas fa-sun';
}

themeToggle.addEventListener('click', function() {
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const menuIcon = mobileMenuBtn.querySelector('i');

mobileMenuBtn.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    const isActive = navLinks.classList.contains('active');
    menuIcon.className = isActive ? 'fas fa-times' : 'fas fa-bars';
});

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuIcon.className = 'fas fa-bars';
    });
});

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

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Optimized particles (responsive count)
function createParticles() {
    const particleContainer = document.getElementById('particles');
    const particleCount = window.innerWidth > 768 ? 30 : 15; // Fewer on mobile
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.width = Math.random() * 4 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        particleContainer.appendChild(particle);
    }
}

createParticles();

// Contact Form Handling with HTML5 validation
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Thank you for your message! I\'ll get back to you soon.');
        this.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
});

// Profile image error handling
document.getElementById('profileImg').addEventListener('error', function() {
    this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjNjY3ZWVhIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5IUDwvdGV4dD4KPC9zdmc+';
});

// Dynamic year in footer
document.addEventListener('DOMContentLoaded', function() {
    const currentYear = new Date().getFullYear();
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = currentYear;
    }
});

// Project Cards Interaction - UPDATED FUNCTIONALITY
// Project Modal Functionality - COMPLETE REPLACEMENT
// Replace the entire project cards section in script.js with this code

document.addEventListener('DOMContentLoaded', function() {
    // Create modal overlay if it doesn't exist
    if (!document.querySelector('.project-modal-overlay')) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'project-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="project-modal">
                <div class="project-modal-header">
                    <button class="modal-close-btn" aria-label="Close modal">
                        <i class="fas fa-times"></i>
                    </button>
                    <h3 class="modal-title"></h3>
                    <div class="project-date"></div>
                </div>
                <div class="project-modal-body">
                    <p class="project-modal-description"></p>
                    <div class="project-modal-tech"></div>
                    <ul class="project-features"></ul>
                    <div class="project-modal-actions"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);
    }

    const modal = document.querySelector('.project-modal-overlay');
    const modalContent = document.querySelector('.project-modal');
    const closeBtn = document.querySelector('.modal-close-btn');
    
    // Project data
    const projectData = {
        'books-platform': {
            title: 'Online Books Reselling and Exchanging Platform',
            date: 'February 2025 - April 2025',
            description: 'Developed a comprehensive full-stack web application to facilitate buying, reselling, donating, and exchanging of books among users. The platform features user authentication, role-based access control, and a responsive user interface with enhanced interactivity.',
            technologies: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
            features: [
                'Implemented user authentication and role-based access (Admin, User, Seller)',
                'Built dynamic pages for book listing, searching, reviewing, and cart management',
                'Ensured responsive and attractive UI with custom CSS and JavaScript',
                'Integrated email verification system for secure user registration',
                'Created comprehensive admin panel for user and book management',
                'Developed secure payment integration for book transactions'
            ],
            githubLink: 'https://github.com/bhsphanendra/Online-Books-Reselling-and-Exchanging-Platform'
        },
        'ml-insurance': {
            title: 'Medical Insurance Cost Prediction Using ML',
            date: 'October 2024 - December 2024',
            description: 'Developed a predictive model using Random Forest Regressor to accurately predict medical insurance costs. The project involved comprehensive data preprocessing, feature engineering, and model evaluation to achieve optimal prediction accuracy.',
            technologies: ['Python', 'Random Forest', 'Scikit-learn', 'Jupyter Notebook', 'Pandas'],
            features: [
                'Implemented feature engineering and preprocessing techniques on real-world dataset',
                'Evaluated model performance using MAE, MSE metrics achieving 85% accuracy',
                'Compared multiple algorithms: Linear Regression, Gradient Boosting, Ada Boosting',
                'Identified Random Forest as optimal model for insurance cost prediction',
                'Created interactive visualizations for data analysis and model insights',
                'Developed user-friendly interface for cost prediction input'
            ],
            githubLink: '#'
        },
        'digital-portfolio': {
            title: 'Digital Portfolio Website',
            date: 'September 2025',
            description: 'Designed and developed a personal digital portfolio to showcase my skills, education, projects, and certifications. The site features a modern responsive design, interactive animations, and accessibility enhancements.',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            features: [
                'Responsive layout for desktop and mobile devices',
                'Animated sections and interactive project modals',
                'Accessible navigation and keyboard support',
                'Dynamic content updates using JavaScript',
                'Custom theme toggle (light/dark mode)',
                'Contact form with validation and feedback'
            ],
            githubLink: 'https://github.com/bhsphanendra/Interactive-Digital-Portfolio'
        }
    };

    const projectCards = document.querySelectorAll('.project-card-compact');

    projectCards.forEach(card => {
        const compactView = card.querySelector('.project-compact-view');
        const projectKey = card.getAttribute('data-project');
        
        // Click to open modal
        compactView.addEventListener('click', function(e) {
            e.preventDefault();
            openProjectModal(projectKey);
        });

        // Keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProjectModal(projectKey);
            }
        });
    });

    // Open modal function
    function openProjectModal(projectKey) {
        const project = projectData[projectKey];
        if (!project) return;

        // Populate modal content
        document.querySelector('.modal-title').textContent = project.title;
        document.querySelector('.project-date').textContent = project.date;
        document.querySelector('.project-modal-description').textContent = project.description;

        // Populate technologies
        const techContainer = document.querySelector('.project-modal-tech');
        techContainer.innerHTML = project.technologies
            .map(tech => `<span class="tech-tag">${tech}</span>`)
            .join('');

        // Populate features
        const featuresContainer = document.querySelector('.project-features');
        featuresContainer.innerHTML = project.features
            .map(feature => `<li>${feature}</li>`)
            .join('');

        // Populate actions
        const actionsContainer = document.querySelector('.project-modal-actions');
        const githubButton = project.githubLink !== '#' 
            ? `<a href="${project.githubLink}" class="project-modal-btn" target="_blank" rel="noopener noreferrer">
                 <i class="fab fa-github"></i> View on GitHub
               </a>`
            : `<button class="project-modal-btn" disabled style="opacity: 0.6; cursor: not-allowed;">
                 <i class="fab fa-github"></i> Coming Soon
               </button>`;
               
        actionsContainer.innerHTML = `
            ${githubButton}
            <button class="project-modal-btn" onclick="closeProjectModal()" style="background: var(--accent-gradient);">
                <i class="fas fa-arrow-left"></i> Back to Projects
            </button>
        `;

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on close button
        setTimeout(() => {
            closeBtn.focus();
        }, 100);
    }

    // Close modal function
    function closeProjectModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Make closeProjectModal globally available
    window.closeProjectModal = closeProjectModal;

    // Close button event
    closeBtn.addEventListener('click', closeProjectModal);

    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    });

    // Prevent modal content clicks from closing modal
    modalContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeProjectModal();
        }
    });

    // Handle focus trap in modal
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });
});