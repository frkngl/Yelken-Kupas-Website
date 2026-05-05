document.addEventListener('DOMContentLoaded', () => {

    let scrollY = 0;

    function openModal(modal) {
        if (!modal) return;

        // Sayfa kaydırma pozisyonunu kaydet ve body'yi sabitle
        scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';

        // Modalı aç
        modal.classList.add('is-open');
    }

    function closeModal(modal) {
        if (!modal) return;

        // Modalı kapat
        modal.classList.remove('is-open');

        // Body sabitliğini kaldır ve eski kaydırma pozisyonuna dön
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
    }

    document.addEventListener('click', (e) => {
        // Modal açma tetikleyicisi
        const trigger = e.target.closest('.modal-trigger');
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            const targetModal = document.getElementById(trigger.getAttribute('data-modal'));
            openModal(targetModal);
            return;
        }

        // Çarpı butonundan kapatma
        const closeBtn = e.target.closest('.close-modal');
        if (closeBtn) {
            closeModal(closeBtn.closest('.custom-modal'));
            return;
        }

        // Dış alana (arka plana) tıklayarak kapatma
        if (e.target.classList.contains('custom-modal') && e.target.classList.contains('is-open')) {
            closeModal(e.target);
        }
    });

    // ESC tuşu ile kapatma
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.custom-modal.is-open');
            if (openModal) closeModal(openModal);
        }
    });

});