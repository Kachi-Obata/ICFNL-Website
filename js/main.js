// Consolidated site JavaScript
// - nav toggle for mobile
// - smooth scrolling for internal anchors
// - fade-in on scroll
// - navbar background / link color changes on scroll
document.addEventListener('DOMContentLoaded', function() {
    // NAV TOGGLE
    const navToggle = document.querySelector('.nav-toggle');
    const stickyNav = document.querySelector('.sticky-nav');
    // Note: The toggle handler below replaces a simple toggle so we don't add a duplicate listener here.

    // Accessibility: close on Escape, focus management and simple focus trap
    const navList = document.getElementById(navToggle && navToggle.getAttribute('aria-controls')) || document.querySelector('.sticky-nav ul');
    const navLinks = navList ? Array.from(navList.querySelectorAll('.nav-link')) : [];
    function openNav() {
        if (!stickyNav.classList.contains('open')) {
            stickyNav.classList.add('open');
            navToggle && navToggle.setAttribute('aria-expanded', 'true');
        }
        // move focus to first nav link
        if (navLinks.length) navLinks[0].focus();
    }
    function closeNav() {
        if (stickyNav.classList.contains('open')) {
            stickyNav.classList.remove('open');
            navToggle && navToggle.setAttribute('aria-expanded', 'false');
            // return focus to toggle
            navToggle && navToggle.focus();
        }
    }

    // Replace toggle click handler to use openNav/closeNav for consistent behavior
    if (navToggle && stickyNav) {
        navToggle.addEventListener('click', function() {
            if (stickyNav.classList.contains('open')) closeNav(); else openNav();
        });
    }

    // Close on Escape and handle focus trapping for mobile nav
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNav();
        }

        if (stickyNav.classList.contains('open') && (e.key === 'Tab')) {
            // focusable elements inside nav
            const focusables = [navToggle].concat(navLinks).filter(Boolean);
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                // shift+tab on first -> move to last
                e.preventDefault(); last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                // tab on last -> move to first
                e.preventDefault(); first.focus();
            }
        }
    });

    // SMOOTH SCROLL for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({ top: target.offsetTop - 50, behavior: 'smooth' });
                // collapse nav on mobile after click
                if (stickyNav && stickyNav.classList.contains('open')) {
                    stickyNav.classList.remove('open');
                    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // FADE-IN ON SCROLL and NAV COLOR
    function onScroll() {
        document.querySelectorAll('.fade-in').forEach(function(element) {
            if (element.getBoundingClientRect().top < window.innerHeight * 0.8) {
                element.classList.add('visible');
            }
        });

        const nav = document.querySelector('.sticky-nav');
        const navLinks = document.querySelectorAll('.nav-link');
        const lawFirmSection = document.querySelector('#law-firm');

        if (window.scrollY > 100) {
            nav && nav.classList.add('scrolled');
            document.body.classList.add('scrolled');
        } else {
            nav && nav.classList.remove('scrolled');
            document.body.classList.remove('scrolled');
        }

        if (lawFirmSection) {
            if (lawFirmSection.getBoundingClientRect().top <= 50) {
                navLinks.forEach(link => link.style.color = 'black');
            } else {
                navLinks.forEach(link => link.style.color = 'white');
            }
        }
    }

    document.addEventListener('scroll', onScroll);
    // run once to set initial state
    onScroll();

    // Show half-page-bg after hero fades in (keeps previous behavior)
    setTimeout(() => {
        const half = document.querySelector('.half-page-bg');
        if (half) {
            half.style.opacity = '1';
            half.style.transform = 'translateY(0)';
        }
    }, 2500);

    // Reveal holiday message (if present) with a small delay so it fades in
    const holiday = document.querySelector('.holiday-message');
    if (holiday) {
        setTimeout(() => holiday.classList.add('visible'), 200);
    }
});
