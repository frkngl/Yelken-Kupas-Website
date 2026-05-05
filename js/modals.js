document.addEventListener('DOMContentLoaded', () => {
    
    // Tüm tıklama olaylarını Document seviyesinde dinliyoruz (Event Delegation)
    // Bu sayede i18n gibi dinamik olarak sonradan eklenen linkler de sorunsuz çalışır.
    document.addEventListener('click', (e) => {
        
        // 1. Linklere tıklanınca ilgili modalı aç
        const trigger = e.target.closest('.modal-trigger');
        if (trigger) {
            e.preventDefault(); // Sayfanın yukarı zıplamasını engeller
            const targetModalId = trigger.getAttribute('data-modal');
            const targetModal = document.getElementById(targetModalId);
            
            if (targetModal) {
                targetModal.classList.add('is-open');
                document.body.style.overflow = 'hidden'; // Modal açıkken arka sayfanın kaymasını engeller
            }
            return; // İşlem bittiyse alttaki şartları boşuna kontrol etme
        }

        // 2. Çarpı ikonuna basınca modalı kapat
        const closeBtn = e.target.closest('.close-modal');
        if (closeBtn) {
            const modal = closeBtn.closest('.custom-modal');
            if (modal) {
                modal.classList.remove('is-open');
                document.body.style.overflow = ''; // Arka sayfa kaydırmasını geri açar
            }
            return;
        }

        // 3. Modalın dışındaki siyah alana tıklayınca modalı kapat
        if (e.target.classList.contains('custom-modal')) {
            e.target.classList.remove('is-open');
            document.body.style.overflow = '';
        }
    });

});