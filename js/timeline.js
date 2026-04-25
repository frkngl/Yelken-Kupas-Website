/**
 * timeline.js — Process timeline scroll animasyonu.
 * SADECE timeline bulunan sayfalara ekle.
 *
 * HTML'de kullanım:
 *   <script defer src="js/utils.js"></script>
 *   <script defer src="js/timeline.js"></script>
 *
 * Gerekli elementler:
 *   #process-scroll-wrapper
 *   #timeline-fill
 *   .station-dot (bir veya daha fazla)
 */

document.addEventListener('DOMContentLoaded', function () {
    const { debounce } = window.AppUtils || {};

    const scrollWrapper = document.getElementById('process-scroll-wrapper');
    const timelineFill  = document.getElementById('timeline-fill');
    const stationDots   = document.querySelectorAll('.station-dot');

    // Elementler bu sayfada yoksa modülü hiç başlatma
    if (!scrollWrapper || !timelineFill || !stationDots.length) return;

    let thresholds    = [];
    let isMobile      = false;
    let mobileLineLen = 0;
    let rafPending    = false;
    let lastProgress  = -1; // değişmeyen DOM yazımını önler

    // ── Layout Hesabı ──────────────────────────────────────────────────────────
    // getBoundingClientRect çağrıları burada toplanır (layout thrashing önlenir).
    function calcLayout() {
        isMobile = window.innerWidth <= 850;
        const container = document.querySelector('.timeline-container');
        if (!container) return;

        // Tüm rect okumalarını art arda yap — batch read, DOM yazımı yok
        const cRect    = container.getBoundingClientRect();
        const dotRects = Array.from(stationDots).map(d => d.getBoundingClientRect());

        if (!isMobile) {
            const lineLen = cRect.width - 62;
            thresholds = dotRects.map(r => {
                const dotCX = (r.left + r.right) / 2 - cRect.left;
                return lineLen > 0 ? (dotCX - 31) / lineLen : 0;
            });
        } else {
            const firstCY = (dotRects[0].top + dotRects[0].bottom) / 2;
            const lineEnd = cRect.bottom - 16;
            mobileLineLen = lineEnd - firstCY;

            thresholds = dotRects.map(r => {
                const cy = (r.top + r.bottom) / 2;
                return mobileLineLen > 0 ? (cy - firstCY) / mobileLineLen : 0;
            });
        }

        thresholds = thresholds.map(t => Math.max(0, Math.min(1, t)));

        // Layout değiştiğinde mevcut scroll pozisyonu için render'ı zorla
        lastProgress = -1;
    }

    // ── Render ────────────────────────────────────────────────────────────────
    // DOM yazımları burada toplanır — read/write ayrımı korunur.
    function render(progress) {
        if (progress === lastProgress) return;
        lastProgress = progress;

        if (isMobile) {
            timelineFill.style.height = (progress * mobileLineLen) + 'px';
        } else {
            scrollWrapper.style.setProperty('--line-progress', progress.toFixed(4));
        }

        stationDots.forEach((dot, i) => {
            const t = thresholds[i] ?? (i / (stationDots.length - 1));
            dot.classList.toggle('is-reached', progress >= t);
        });
    }

    // ── Progress Hesabı ───────────────────────────────────────────────────────
    function calcProgress() {
        const rect      = scrollWrapper.getBoundingClientRect();
        const maxScroll = rect.height - window.innerHeight;
        const scrolled  = -rect.top;

        if (scrolled < 0)           return 0;
        if (maxScroll <= 0)         return 1; // wrapper viewport'tan kısa
        return Math.min(scrolled / maxScroll, 1);
    }

    // ── Scroll Handler (rAF throttle) ─────────────────────────────────────────
    function onScroll() {
        if (rafPending) return;
        rafPending = true;

        requestAnimationFrame(() => {
            rafPending = false;
            render(calcProgress());
        });
    }

    // ── Resize Handler (debounce + rAF) ───────────────────────────────────────
    const onResize = debounce
        ? debounce(() => { calcLayout(); onScroll(); }, 150)
        : () => { calcLayout(); onScroll(); };

    // ── Başlatma ──────────────────────────────────────────────────────────────
    // 1. Layout'u hemen hesapla (setTimeout yok — DOMContentLoaded sonrası güvenli)
    calcLayout();

    // 2. Mevcut scroll pozisyonu için ilk render
    render(calcProgress());

    // 3. Font/image yüklenmesiyle boyut değişebilir; window.load'da yeniden hesapla
    window.addEventListener('load', () => {
        calcLayout();
        render(calcProgress());
    });

    // 4. ResizeObserver: wrapper boyutu değiştiğinde (responsive, font değişimi vb.)
    if (window.ResizeObserver) {
        new ResizeObserver(() => {
            calcLayout();
            render(calcProgress());
        }).observe(scrollWrapper);
    } else {
        // Tarayıcı ResizeObserver desteklemiyorsa resize event'i fallback
        window.addEventListener('resize', onResize, { passive: true });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
});