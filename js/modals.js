document.addEventListener('DOMContentLoaded', () => {

    let scrollY = 0;

    function openModal(modal) {
        if (!modal) return;

        scrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';

        modal.classList.add('is-open');

        modal.style.display = 'none';
        modal.offsetHeight;
        modal.style.display = '';
    }

    function closeModal(modal) {
        if (!modal) return;

        modal.classList.remove('is-open');

        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
    }

    document.addEventListener('click', (e) => {

        const trigger = e.target.closest('.modal-trigger');
        if (trigger) {
            e.preventDefault();
            e.stopPropagation();
            const targetModal = document.getElementById(trigger.getAttribute('data-modal'));
            openModal(targetModal);
            return;
        }

        const closeBtn = e.target.closest('.close-modal');
        if (closeBtn) {
            closeModal(closeBtn.closest('.custom-modal'));
            return;
        }

        if (e.target.classList.contains('custom-modal') && e.target.classList.contains('is-open')) {
            closeModal(e.target);
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.custom-modal.is-open');
            if (openModal) closeModal(openModal);
        }
    });

});