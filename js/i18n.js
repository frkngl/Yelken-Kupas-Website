// Performans için önbellek: Yüklenen dili tekrar fetch etmemek için
const loadedTranslations = {};

async function loadLanguage(lang) {
    if (!loadedTranslations[lang]) {
        try {
            // DİKKAT: JSON dosyalarının yolu 'js/' klasörü olarak güncellendi
            const response = await fetch(`js/${lang}.json`);
            loadedTranslations[lang] = await response.json();
        } catch (error) {
            console.error(`Dil dosyası yüklenemedi: js/${lang}.json`, error);
            return;
        }
    }

    const translations = loadedTranslations[lang];

    // Sayfadaki tüm i18n etiketlerini hızlıca güncelle
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            // Eğer element bir input veya textarea ise placeholder'ı değiştir
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[key];
            } 
            // Eğer çeviri metninde herhangi bir HTML etiketi ( < işareti ) varsa HTML olarak işle
            else if (translations[key].includes('<')) {
                element.innerHTML = translations[key];
            } else {
                // Sadece düz metinse performansı artırmak için textContent kullan
                element.textContent = translations[key];
            }
        }
    });

    // Menü butonundaki metni (TR/EN) güncelle
    const currentLangBtn = document.getElementById('current-lang-btn');
    if (currentLangBtn) {
        currentLangBtn.innerHTML = `${lang.toUpperCase()} <span class="arrow">▼</span>`;
    }

    // Dropdown içindeki aktif sınıfını güncelle
    document.querySelectorAll('.lang-menu a').forEach(a => a.classList.remove('active'));
    const activeLink = document.getElementById(`lang-${lang}`);
    if (activeLink) activeLink.classList.add('active');

    // Tarayıcı ve HTML dil ayarlarını güncelle
    document.documentElement.lang = lang;
    localStorage.setItem('preferredLang', lang);

    // Titreme önleyici sınıfı ekle
    document.body.classList.add('lang-loaded');
}

// Butonlara tıklandığında çalışacak fonksiyon
function changeLanguage(lang, event) {
    if (event) event.preventDefault();
    if (document.documentElement.lang === lang) return;
    loadLanguage(lang);
}

// Sayfa ilk yüklendiğinde anında çalıştır
const savedLang = localStorage.getItem('preferredLang') || 'tr';
loadLanguage(savedLang);