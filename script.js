// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Force scroll to top on page load
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', function () {
    window.scrollTo(0, 0);
});

// Scroll to top immediately
window.scrollTo(0, 0);

// Scroll Animations Function
function initScrollAnimations() {
    // Fade in elements on scroll
    gsap.utils.toArray('[data-scroll]').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power2.out'
        });
    });

    // Parallax effect on hero content (optimized, keep visible)
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5
        },
        y: 150,
        opacity: 0.3
    });

    // Parallax effect on grid images - simplified
    gsap.utils.toArray('.grid-item').forEach(item => {
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.3
            },
            y: -30,
            ease: 'none'
        });
    });

    // About section animations - simplified to prevent disappearing
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    });

    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out'
    });

    // Experience cards stagger animation
    gsap.from('.experience-card', {
        scrollTrigger: {
            trigger: '.experience-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });

    // Menu items stagger animation - simplified to prevent disappearing
    gsap.from('.menu-item', {
        scrollTrigger: {
            trigger: '.menu-section',
            start: 'top 80%',
            toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0.2,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // Parallax section quote animation
    gsap.from('.parallax-content h2', {
        scrollTrigger: {
            trigger: '.parallax-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });

    // Contact section animation
    gsap.from('.contact-content h2', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });

    gsap.from('.contact-item', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
    });
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    images.forEach(img => {
        imageObserver.observe(img);
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
}

// Show random image on mobile
function randomMobileImage() {
    if (window.innerWidth <= 768) {
        const gridItems = document.querySelectorAll('.grid-item');
        if (gridItems.length > 0) {
            gridItems.forEach(item => item.classList.remove('mobile-visible'));
            const randomIndex = Math.floor(Math.random() * gridItems.length);
            gridItems[randomIndex].classList.add('mobile-visible');
        }
    }
}

// Calendar Modal Functions
function openCalendar(type) {
    const modal = document.getElementById('calendar-modal');
    const modalTitle = document.getElementById('modal-title');
    
    if (!modal || !modalTitle) return;
    
    const calendars = document.querySelectorAll('.calendar-container');
    calendars.forEach(cal => cal.style.display = 'none');
    
    if (type === 'healing') {
        const healingCal = document.getElementById('calendar-healing');
        if (healingCal) {
            healingCal.style.display = 'block';
            modalTitle.textContent = 'Book Energy Healing Session';
        }
    } else if (type === 'in-home') {
        const inHomeCal = document.getElementById('calendar-in-home');
        if (inHomeCal) {
            inHomeCal.style.display = 'block';
            modalTitle.textContent = 'Book Aura Tuning Session';
        }
    } else if (type === 'gong') {
        const gongCal = document.getElementById('calendar-gong');
        if (gongCal) {
            gongCal.style.display = 'block';
            modalTitle.textContent = 'Book Sound Bath Session';
        }
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCalendar() {
    const modal = document.getElementById('calendar-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function openInquiryModal() {
    const modal = document.getElementById('inquiry-modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeInquiryModal() {
    const modal = document.getElementById('inquiry-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        const form = document.getElementById('inquiry-form');
        if (form) form.reset();
        const success = document.getElementById('form-success');
        if (success) success.style.display = 'none';
        const error = document.getElementById('form-error');
        if (error) error.style.display = 'none';
    }
}

// ALL DOM-dependent code inside DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Ensure page starts at top
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);
    
    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('active');
            burger.classList.toggle('active');
        });
    }

    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav) nav.classList.remove('active');
                if (burger) burger.classList.remove('active');
            });
        });

        // Smooth scrolling
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        }
    });

    // Initialize animations
    initScrollAnimations();
    initLazyLoading();
    randomMobileImage();

    // Inquiry form handler
    const inquiryForm = document.getElementById('inquiry-form');
    if (inquiryForm) {
        inquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('inquiry-name').value;
            const email = document.getElementById('inquiry-email').value;
            const phone = document.getElementById('inquiry-phone').value;
            const message = document.getElementById('inquiry-message').value;
            
            if (!email || !email.includes('@')) {
                const errorEl = document.getElementById('form-error');
                if (errorEl) {
                    errorEl.style.display = 'block';
                    errorEl.textContent = '✗ Please enter a valid email address.';
                }
                return;
            }
            
            const subject = encodeURIComponent('Inquiry about Gong Bath Session');
            const body = encodeURIComponent(
                `Hello Harmonics and Healings,\n\n` +
                `I am interested in learning more about your Gong Bath sessions.\n\n` +
                `Name: ${name}\n` +
                `Email: ${email}\n` +
                `Phone: ${phone || 'Not provided'}\n\n` +
                `Questions:\n${message}\n\n` +
                `Thank you!`
            );
            
            const mailtoLink = `mailto:harmonicsandhealingsny@gmail.com?subject=${subject}&body=${body}`;
            window.location.href = mailtoLink;
            
            const successEl = document.getElementById('form-success');
            const errorEl = document.getElementById('form-error');
            if (successEl) successEl.style.display = 'block';
            if (errorEl) errorEl.style.display = 'none';
            inquiryForm.style.display = 'none';
            
            setTimeout(function() {
                closeInquiryModal();
                inquiryForm.style.display = 'block';
            }, 3000);
        });
    }
});

// Window resize handlers
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
    randomMobileImage();
});

// Click outside modal to close
window.onclick = function(event) {
    const calendarModal = document.getElementById('calendar-modal');
    const inquiryModal = document.getElementById('inquiry-modal');
    
    if (event.target === calendarModal) {
        closeCalendar();
    }
    
    if (event.target === inquiryModal) {
        closeInquiryModal();
    }
}

// ESC key to close modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCalendar();
        closeInquiryModal();
    }
});

// Smooth scrolling configuration
ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 150
});
