document.addEventListener("DOMContentLoaded", function () {

    // 1. SCROLL EFEKTİ (Framer Tarzı Aşağı İndikçe Aktifleşme)
    const videoRows = document.querySelectorAll('.video-row');

    // IntersectionObserver: Elementlerin ekrana girip girmediğini kontrol eder
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Eğer video satırı ekranın görünür alanına %40 oranında girdiyse
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // Yukarı çıkınca tekrar pasif olmasını istersen burayı aktif bırakabilirsin:
                entry.target.classList.remove('active');
            }
        });
    }, {
        threshold: 0.4 // %40'ı göründüğünde tetikle
    });

    videoRows.forEach(row => {
        observer.observe(row);
    });

    // 2. VİDEO TIKLAMA / OYNATMA MANTIĞI
    const videoCards = document.querySelectorAll('.video-card');

    videoCards.forEach(card => {
        card.addEventListener('click', function () {
            const video = this.querySelector('video');

            // Eğer video duraklatılmışsa oynat
            if (video.paused) {
                video.play();
                this.classList.add('is-playing'); // Oynat yazısını gizler
            } else {
                // Eğer video oynuyorsa duraklat
                video.pause();
                this.classList.remove('is-playing'); // Oynat yazısını geri getirir
            }
        });
    });

});