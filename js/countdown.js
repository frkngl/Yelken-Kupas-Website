function startCountdown() {
    // Hedef tarihi belirliyoruz (19 Haziran 2026 Saat 10:00:00)
    const targetDate = new Date("June 19, 2026 10:00:00").getTime();
    
    // Sayıların yazılacağı HTML elementlerini seçiyoruz
    const daysElement = document.getElementById("countdown-days");
    const hoursElement = document.getElementById("countdown-hours");

    // Elementler yoksa sayfa hata vermesin diye işlemi durdur
    if (!daysElement || !hoursElement) return;

    // Sayacı hesaplayıp ekrana yazan fonksiyon
    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Eğer 19 Haziran saat 10:00 geçildiyse sayacı sıfırda tut
        if (distance < 0) {
            daysElement.textContent = "0";
            hoursElement.textContent = "0";
            return;
        }

        // Kalan milisaniyeyi gün ve saate çevirme formülleri
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        // Hesaplanan gün ve saati HTML'e yazdır
        daysElement.textContent = days;
        hoursElement.textContent = hours;
    }

    // Sayfa açılır açılmaz ilk hesaplamayı yap
    updateTimer();

    // Ardından her 1 dakikada bir (60000 milisaniye) sayacı güncelle 
    // Saati de gösterdiğimiz için anında güncellenmesi adına 1 dakika idealdir.
    setInterval(updateTimer, 60000);
}

// Sayfa yüklendiğinde sayacı başlat
document.addEventListener("DOMContentLoaded", startCountdown);