document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.menu-page');
    let currentIndex = 0;
    let isTransitioning = false;
    const transitionDuration = 800; // Match CSS transition

    // Animation: Intersection Observer (Reveal)
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    pages.forEach(page => observer.observe(page));

    // Forced Navigation: Scroll to section
    const scrollToPage = (index) => {
        if (index < 0 || index >= pages.length || isTransitioning) return;

        isTransitioning = true;
        currentIndex = index;

        pages[currentIndex].scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            isTransitioning = false;
        }, transitionDuration);
    };

    // Desktop: Wheel Event
    window.addEventListener('wheel', (e) => {
        e.preventDefault(); // Stop default scroll
        if (isTransitioning) return;

        if (e.deltaY > 0) {
            scrollToPage(currentIndex + 1);
        } else {
            scrollToPage(currentIndex - 1);
        }
    }, { passive: false });

    // Mobile: Touch Events
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (isTransitioning) return;

        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchStartY - touchEndY;
        const minSwipeDistance = 50;

        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                scrollToPage(currentIndex + 1);
            } else {
                scrollToPage(currentIndex - 1);
            }
        }
    }, { passive: true });

    // Back to Top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            scrollToPage(0);
        });
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
        if (isTransitioning) return;
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            scrollToPage(currentIndex + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            scrollToPage(currentIndex - 1);
        }
    });
});
