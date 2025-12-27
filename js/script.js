document.addEventListener('DOMContentLoaded', function() {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            // تغيير أيقونة القائمة
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Preloader ---
    const preloader = document.querySelector('.preloader');
    window.addEventListener('load', () => {
        if(preloader) {
            preloader.classList.add('hidden');
        }
    });

    // --- AOS Init ---
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
        });
    }

    // --- Counters Animation ---
    const counters = document.querySelectorAll('.counter');
    const speed = 300;
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const animateCounter = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const inc = target / speed;
                        if (count < target) {
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(animateCounter, 10);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    animateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(counter => observer.observe(counter));
    }
});

// ========================================
// ====== كود الوضع الليلي ======
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    if (themeToggle) {
        // 1. التحقق من الإعداد المحفوظ
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
            if(themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            body.classList.remove('dark-mode');
            if(themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
        }

        // 2. التبديل
        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                if(themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                localStorage.setItem('theme', 'light');
                if(themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }
});