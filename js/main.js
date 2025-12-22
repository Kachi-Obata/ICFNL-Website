// Consolidated site JavaScript
// - nav toggle for mobile
// - smooth scrolling for internal anchors
// - fade-in on scroll
// - navbar background / link color changes on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Detect first touch to suppress persistent focus outlines on touch devices.
    // Adds `using-touch` to <body> so CSS can hide focus rings on touch input.
    function onFirstTouch() {
        try { document.body.classList.add('using-touch'); } catch (e) {}
        window.removeEventListener('touchstart', onFirstTouch, { passive: true });
    }
    window.addEventListener('touchstart', onFirstTouch, { passive: true });

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
        if (navLinks.length) {
            // focus first link for keyboard users
            navLinks[0].focus();
            // also remove any residual :focus outline shortly after to avoid
            // leaving a persistent border on touch devices when they reopen the nav
            setTimeout(() => { try { navLinks[0].blur(); } catch(e){} }, 300);
        }
    }
    function closeNav() {
        if (stickyNav.classList.contains('open')) {
            stickyNav.classList.remove('open');
            navToggle && navToggle.setAttribute('aria-expanded', 'false');
            // return focus to toggle
            navToggle && navToggle.focus();
            // ensure no nav-link retains focus when nav is closed
            navLinks.forEach(l => { try { l.blur(); } catch(e){} });
        }
    }

    // Replace toggle click handler to use openNav/closeNav for consistent behavior
    if (navToggle && stickyNav) {
        navToggle.addEventListener('click', function() {
            if (stickyNav.classList.contains('open')) closeNav(); else openNav();
        });
        // ensure toggle doesn't retain focus on touch after tapping
        navToggle.addEventListener('pointerdown', () => { try { navToggle.blur(); } catch(e){} });
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

    // Ensure nav links do not keep focus after tapping/clicking (prevents a lingering border)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            // blur after a short delay so platform tap highlight still shows briefly
            setTimeout(() => { try { link.blur(); } catch(e){} }, 100);
        });
        // also clear focus on pointerdown to avoid persistent focus rings on some devices
        link.addEventListener('pointerdown', () => { try { link.blur(); } catch(e){} });
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

        // Do not toggle 'scrolled' classes on scroll. Keep nav link colors and
        // background controlled entirely by CSS and the page's body class.

        // Remove inline color toggles — let CSS handle link colors so they remain
        // consistently black on non-home pages regardless of scroll position.
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
