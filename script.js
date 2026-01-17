// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links a');

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    burger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll Animations
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

    // Parallax effect on hero content (optimized)
    gsap.to('.hero-content', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5  // Smoother scrub value
        },
        y: 150,  // Reduced movement
        opacity: 0.5
    });

    // Parallax effect on grid images (reduced for better performance)
    gsap.utils.toArray('.grid-item').forEach(item => {
        const speed = item.getAttribute('data-scroll-speed') || 1;
        gsap.to(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5  // Reduced scrub for smoother effect
            },
            y: -50 * speed,  // Reduced movement
            ease: 'none'
        });
    });

    // About section animations
    gsap.from('.about-text', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        x: -100,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out'
    });

    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        x: 100,
        opacity: 0,
        duration: 1.2,
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

    // Menu items stagger animation
    gsap.from('.menu-item', {
        scrollTrigger: {
            trigger: '.menu-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
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

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

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
        // Trigger loaded class after image actually loads
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    });
}


// Refresh ScrollTrigger on window resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
    randomMobileImage();
});

// Smooth scrolling configuration
ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 150
});

// Show random image on mobile - DEFINED BEFORE USE
function randomMobileImage() {
    if (window.innerWidth <= 768) {
        const gridItems = document.querySelectorAll('.grid-item');
        if (gridItems.length > 0) {
            gridItems.forEach(item => item.classList.remove('mobile-visible'));
            const randomIndex = Math.floor(Math.random() * gridItems.length);
            gridItems[randomIndex].classList.add('mobile-visible');
        }
    } else {
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach(item => item.classList.remove('mobile-visible'));
    }
}

// SINGLE DOMContentLoaded for everything
document.addEventListener('DOMContentLoaded', () => {
    randomMobileImage();
    initScrollAnimations();
    initLazyLoading();
    
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
                document.getElementById('form-error').style.display = 'block';
                document.getElementById('form-error').textContent = '✗ Please enter a valid email address.';
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
            
            document.getElementById('form-success').style.display = 'block';
            document.getElementById('form-error').style.display = 'none';
            inquiryForm.style.display = 'none';
            
            setTimeout(function() {
                closeInquiryModal();
                inquiryForm.style.display = 'block';
            }, 3000);
        });
    }
});

// Calendar Modal Functions
function openCalendar(type) {
    console.log('openCalendar called with type:', type);
    
    const modal = document.getElementById('calendar-modal');
    const modalTitle = document.getElementById('modal-title');
    
    if (!modal) {
        console.error('Modal element not found!');
        return;
    }
    
    if (!modalTitle) {
        console.error('Modal title element not found!');
        return;
    }
    
    const calendars = document.querySelectorAll('.calendar-container');
    calendars.forEach(cal => {
        cal.style.display = 'none';
    });
    
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

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeCalendar();
        closeInquiryModal();
    }
});

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
        
        document.getElementById('inquiry-form').reset();
        document.getElementById('form-success').style.display = 'none';
        document.getElementById('form-error').style.display = 'none';
    }
}
