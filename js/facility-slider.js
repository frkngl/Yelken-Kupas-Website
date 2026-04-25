/**
 * facility-slider.js — Facility görsel slider'ı.
 * SADECE slider bulunan sayfalara ekle.
 *
 * HTML'de kullanım:
 *   <script defer src="js/utils.js"></script>
 *   <script defer src="js/facility-slider.js"></script>
 *
 * Gerekli elementler:
 *   .facility-slider
 *   .slider-dots .dot (bir veya daha fazla)
 */

document.addEventListener('DOMContentLoaded', function () {
    const { debounce } = window.AppUtils || {};

    const slider = document.querySelector('.facility-slider');
    const dots   = document.querySelectorAll('.slider-dots .dot');

    // Elementler bu sayfada yoksa modülü hiç başlatma
    if (!slider || !dots.length) return;

    const total = dots.length;
    let current    = 0;
    let startX     = 0;
    let isDragging = false;

    // isMobile'ı her event'te hesaplamak yerine cache'le
    let _isMobile = window.innerWidth <= 992;

    // ── Navigasyon ────────────────────────────────────────────────────────────
    function goTo(index) {
        current = (index + total) % total;
        slider.style.transform = `translateX(calc(-${current * 100}% - ${current * 16}px))`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    // ── Dot Tıklamaları (event delegation) ───────────────────────────────────
    const dotsContainer = dots[0].parentElement;
    dotsContainer.addEventListener('click', (e) => {
        if (!_isMobile) return;
        const dot = e.target.closest('.dot');
        if (!dot) return;
        const index = Array.prototype.indexOf.call(dots, dot);
        if (index !== -1) goTo(index);
    });

    // ── Touch / Swipe ─────────────────────────────────────────────────────────
    slider.addEventListener('touchstart', (e) => {
        if (!_isMobile) return;
        startX     = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        if (!_isMobile || !isDragging) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
        isDragging = false;
    });

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = debounce
        ? debounce(() => {
            _isMobile = window.innerWidth <= 992;
            if (!_isMobile) {
                slider.style.transform = '';
            } else {
                goTo(current); // mevcut pozisyonu koru
            }
        }, 150)
        : () => {
            _isMobile = window.innerWidth <= 992;
            slider.style.transform = !_isMobile ? '' : `translateX(calc(-${current * 100}% - ${current * 16}px))`;
        };

    window.addEventListener('resize', onResize, { passive: true });
});