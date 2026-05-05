document.querySelector('.contact-form').addEventListener('submit', function (e) {
    e.preventDefault(); // Sayfanın yenilenmesini engeller

    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerText;

    // Gönderim sırasında butonu pasif yap
    submitBtn.innerText = 'Gönderiliyor...';
    submitBtn.disabled = true;

    // Form verilerini al ve JSON objesine çevir
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Fetch ile istek at (Direkt JSON olarak gönderiyoruz)
    fetch(form.action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data) // Veriyi JSON string'ine dönüştür
    })
        .then(response => response.json())
        .then(responseData => {
            if (responseData.success) {
                // Başarılı olursa ekrana uyarı ver ve formu temizle
                alert("Mesajınız başarıyla gönderilmiştir! Teşekkür ederiz.");
                form.reset();
            } else {
                alert("Gönderim sırasında bir sorun oluştu. Lütfen tekrar deneyin.");
                console.error("FormSubmit Hatası:", responseData);
            }
        })
        .catch(error => {
            console.error("Fetch Hatası:", error);
            alert("Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
        })
        .finally(() => {
            // İşlem bitince butonu eski haline getir
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
});