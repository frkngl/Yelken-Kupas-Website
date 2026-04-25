/**
 * navbar.js — Hamburger menü.
 * Tüm sayfalarda yüklenir.
 *
 * HTML'de kullanım:
 *   <script defer src="js/utils.js"></script>
 *   <script defer src="js/navbar.js"></script>
 */

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu   = document.getElementById('nav-menu');

    // Bu elementler yoksa (örn. farklı bir layout) sessizce çık
    if (!hamburger || !navMenu) return;

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
});