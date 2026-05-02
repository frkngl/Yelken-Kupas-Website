function startCountdown() {
    // Hedef tarihi belirliyoruz (15 Haziran 2026)
    const targetDate = new Date("June 15, 2026 09:00:00").getTime();
    
    // Sayının yazılacağı HTML elementini seçiyoruz
    const daysElement = document.getElementById("countdown-days");

    // Element yoksa sayfa hata vermesin diye işlemi durdur
    if (!daysElement) return;

    // Sayacı hesaplayıp ekrana yazan fonksiyon
    function updateTimer() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Eğer 15 Haziran geçildiyse sayacı sıfırda tut
        if (distance < 0) {
            daysElement.textContent = "0";
            return;
        }

        // Kalan milisaniyeyi güne çevirme formülü
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        
        // Hesaplanan günü HTML'e yazdır
        daysElement.textContent = days;
    }

    // Sayfa açılır açılmaz ilk hesaplamayı yap
    updateTimer();

    // Ardından her 1 saatte bir (3600000 milisaniye) sayacı güncelle 
    // Sadece gün gösterdiğimiz için saniyede bir çalıştırıp tarayıcıyı yormaya gerek yok
    setInterval(updateTimer, 3600000);
}

// Sayfa yüklendiğinde sayacı başlat
document.addEventListener("DOMContentLoaded", startCountdown);