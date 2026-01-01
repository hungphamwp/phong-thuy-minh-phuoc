// ==========================================
// Minh Phước Feng Shui - JavaScript
// ==========================================

// ==========================================
// Mobile Navigation
// ==========================================

function initMobileNav() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');

    if (!mobileMenuBtn || !mobileNav) return;

    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileNav.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Close mobile nav when clicking on a link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        });
    });
}

// ==========================================
// FAQ Accordion
// ==========================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// ==========================================
// Smooth Scroll for Navigation Links
// ==========================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==========================================
// Header Scroll Effect
// ==========================================

function initHeaderScroll() {
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
        }
    });
}

// ==========================================
// Active Navigation on Scroll
// ==========================================

function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================
// Form Submission
// ==========================================

function initContactForm() {
    const form = document.querySelector('.contact-form');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        // Simple validation
        if (!data.name || !data.phone) {
            alert('Vui lòng nhập họ tên và số điện thoại!');
            return;
        }

        // Show success message
        alert('Cảm ơn bạn đã gửi yêu cầu! Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.');

        // Reset form
        form.reset();
    });
}

// ==========================================
// Animate on Scroll
// ==========================================

function initAnimateOnScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll('.service-card, .blog-card, .testimonial-card, .faq-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease forwards !important;
        }
    `;
    document.head.appendChild(style);
}

// ==========================================
// Counter Animation (for stats if needed)
// ==========================================

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const step = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(step);
        } else {
            element.textContent = target;
        }
    };

    step();
}

// ==========================================
// Floating Cards Animation Enhancement
// ==========================================

function initFloatingCards() {
    const cards = document.querySelectorAll('.floating-card');

    cards.forEach((card, index) => {
        // Add random slight movement on hover area
        card.addEventListener('mouseenter', () => {
            card.style.animationPlayState = 'paused';
            card.style.transform = 'translateY(-20px) scale(1.05)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.animationPlayState = 'running';
            card.style.transform = '';
        });
    });
}

// ==========================================
// Update Lunar Calendar on Homepage
// ==========================================

function updateLunarCalendar() {
    // Check if we have the getDayInfo function from lich-van-su.js
    if (typeof getDayInfo !== 'function') return;

    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yy = today.getFullYear();

    const info = getDayInfo(dd, mm, yy);

    // Update lunar date
    const lunarDateEl = document.getElementById('lvs-lunar-date');
    if (lunarDateEl) {
        const lunarDayName = info.lunar.day <= 10 ?
            ['Mùng 1', 'Mùng 2', 'Mùng 3', 'Mùng 4', 'Mùng 5', 'Mùng 6', 'Mùng 7', 'Mùng 8', 'Mùng 9', 'Mùng 10'][info.lunar.day - 1] :
            info.lunar.day.toString();
        const lunarMonthName = ['Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Chạp'][info.lunar.month - 1];
        lunarDateEl.textContent = `${lunarDayName} tháng ${lunarMonthName}`;
    }

    // Update big day number
    const bigDayEl = document.getElementById('lvs-big-day');
    if (bigDayEl) {
        bigDayEl.textContent = dd;
    }

    // Update Can Chi
    const gioCanChiEl = document.getElementById('lvs-gio-canchi');
    if (gioCanChiEl) {
        gioCanChiEl.textContent = info.canChiHour;
    }

    const ngayCanChiEl = document.getElementById('lvs-ngay-canchi');
    if (ngayCanChiEl) {
        ngayCanChiEl.textContent = info.canChi.canChi;
    }

    const thangCanChiEl = document.getElementById('lvs-thang-canchi');
    if (thangCanChiEl) {
        thangCanChiEl.textContent = info.canChiMonth;
    }

    const namCanChiEl = document.getElementById('lvs-nam-canchi');
    if (namCanChiEl) {
        namCanChiEl.textContent = info.canChiYear;
    }
}

// ==========================================
// Initialize Everything
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initFAQ();
    initSmoothScroll();
    initHeaderScroll();
    initActiveNav();
    initContactForm();
    initAnimateOnScroll();
    initFloatingCards();
    updateLunarCalendar();

    console.log('Minh Phước Feng Shui - Website loaded successfully!');
});
