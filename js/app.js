document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    hamburger.addEventListener('click', () => {
        // Menüyü ve ikonu aç/kapat
        hamburger.classList.toggle('is-active');
        navMenu.classList.toggle('is-active');
    });

    // Menüdeki linklerden birine tıklandığında menüyü geri kapat
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('is-active');
            navMenu.classList.remove('is-active');
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {

    const scrollWrapper = document.getElementById('process-scroll-wrapper');
    const timelineFill = document.getElementById('timeline-fill');
    const stationDots = document.querySelectorAll('.station-dot');
    const stepItems = document.querySelectorAll('.step-item');

    if (!scrollWrapper || !timelineFill) return;

    let thresholds = [];
    let isMobile = false;
    let mobileLineLen = 0;

    // ─── Layout Hesabı ───────────────────────────────────────────
    function calcLayout() {
        isMobile = window.innerWidth <= 850;
        const container = document.querySelector('.timeline-container');
        if (!container) return;

        const cRect = container.getBoundingClientRect();
        const n = stationDots.length;

        if (!isMobile) {
            const lineLen = cRect.width - 62;
            thresholds = Array.from(stationDots).map(dot => {
                const r = dot.getBoundingClientRect();
                const dotCX = (r.left + r.right) / 2 - cRect.left;
                return lineLen > 0 ? (dotCX - 31) / lineLen : 0;
            });

        } else {
            const dotRects = Array.from(stationDots).map(d => d.getBoundingClientRect());
            const firstCY = (dotRects[0].top + dotRects[0].bottom) / 2;

            // line-bg'nin bitiş noktası = container bottom - 16px
            const lineEnd = cRect.bottom - 16;
            mobileLineLen = lineEnd - firstCY;

            thresholds = dotRects.map(r => {
                const cy = (r.top + r.bottom) / 2;
                return mobileLineLen > 0 ? (cy - firstCY) / mobileLineLen : 0;
            });
        }

        thresholds = thresholds.map(t => Math.max(0, Math.min(1, t)));
    }

    // ─── Render ──────────────────────────────────────────────────
    function render(progress) {
        if (isMobile) {
            timelineFill.style.height = (progress * mobileLineLen) + 'px';
        } else {
            scrollWrapper.style.setProperty('--line-progress', progress.toFixed(4));
        }
        updateDots(progress);
    }

    function updateDots(progress) {
        stationDots.forEach((dot, i) => {
            const t = thresholds[i] ?? (i / (stationDots.length - 1));
            dot.classList.toggle('is-reached', progress >= t);
        });
    }

    // ─── Scroll ──────────────────────────────────────────────────
    window.addEventListener('scroll', () => {
        if (thresholds.length === 0) calcLayout();

        const rect = scrollWrapper.getBoundingClientRect();
        const maxScroll = rect.height - window.innerHeight;
        const scrolled = -rect.top;

        if (scrolled < 0) { render(0); return; }

        const progress = Math.max(0, Math.min(scrolled / maxScroll, 1));
        render(progress);
    });

    window.addEventListener('resize', () => {
        calcLayout();
        const rect = scrollWrapper.getBoundingClientRect();
        const maxScroll = rect.height - window.innerHeight;
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(scrolled / maxScroll, 1));
        render(Math.max(0, progress));
    });

    setTimeout(calcLayout, 120);
});

// Facility Slider
(function () {
    const isMobile = () => window.innerWidth <= 992;

    const slider = document.querySelector('.facility-slider');
    const dots = document.querySelectorAll('.slider-dots .dot');
    if (!slider || !dots.length) return;

    let current = 0;
    const total = dots.length;
    let startX = 0;
    let isDragging = false;

    function goTo(index) {
        current = (index + total) % total;
        slider.style.transform = `translateX(calc(-${current * 100}% - ${current * 16}px))`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    dots.forEach((dot, i) => dot.addEventListener('click', () => isMobile() && goTo(i)));

    // Touch / swipe desteği
    slider.addEventListener('touchstart', e => {
        if (!isMobile()) return;
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    slider.addEventListener('touchend', e => {
        if (!isMobile() || !isDragging) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        isDragging = false;
    });

    // Ekran boyutu değişince sıfırla
    window.addEventListener('resize', () => {
        if (!isMobile()) slider.style.transform = '';
        else goTo(current);
    });
})();