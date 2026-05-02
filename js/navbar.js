document.addEventListener('DOMContentLoaded', function () {

    // --- 1. Hamburger Menü İşlemleri ---
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');

    // Sadece hamburger ve navMenu bu sayfada varsa çalıştır
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('is-active');
            navMenu.classList.toggle('is-active');
        });

        // Her link için ayrı listener yerine parent'a tek event delegation
        navMenu.addEventListener('click', (e) => {
            if (e.target.closest('a')) {
                hamburger.classList.remove('is-active');
                navMenu.classList.remove('is-active');
            }
        });
    }

    // --- 2. Performanslı Header Kaydırma (Scroll) Renk Değişimi İşlemleri ---
    const header = document.querySelector(".site-header");

    // Efektin yalnızca anasayfada çalışması için kontrol
    const isHomePage = window.location.pathname === "/" || window.location.pathname.endsWith("index.html");

    // Sadece header bu sayfada varsa ve kullanıcı anasayfadaysa çalıştır
    if (header && isHomePage) {
        let ticking = false;

        const togglePositionalHeaderStyles = () => {
            const currentScrollY = window.scrollY;
            const hasClass = header.classList.contains("scrolled");

            // Sayfa 50px'den fazla aşağı kaydırıldıysa ve class yoksa ekle
            if (currentScrollY > 50 && !hasClass) {
                header.classList.add("scrolled");
            }
            // Sayfa 50px veya daha az kaydırıldıysa ve class varsa çıkar
            else if (currentScrollY <= 50 && hasClass) {
                header.classList.remove("scrolled");
            }

            // İşlem bittiğinde kilidi aç
            ticking = false;
        };

        // Sayfa ilk yüklendiğinde mevcut durumu ayarla
        togglePositionalHeaderStyles();

        window.addEventListener("scroll", function () {
            // Tarayıcı meşgul değilse yeni bir çizim karesi (frame) iste
            if (!ticking) {
                window.requestAnimationFrame(togglePositionalHeaderStyles);
                ticking = true;
            }
        }, { passive: true }); // Kaydırma performansını artırır
    }
});