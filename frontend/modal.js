document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('buy-modal');
    const closeBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.modal-cancel');
    const buyButtons = document.querySelectorAll('.product-card .cta-button');
    const productSummary = document.getElementById('modal-product-summary');
    const checkoutForm = document.getElementById('checkout-form');
    const payBtn = document.querySelector('.modal-pay-btn');
    const successMessage = document.getElementById('modal-success-message');
    const formContainer = document.getElementById('modal-form-container');

    // Open Modal
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = button.closest('.product-card');
            const productName = card.querySelector('h4').textContent;
            const productPrice = card.querySelector('.price').textContent;

            productSummary.innerHTML = `<strong>${productName}</strong> - ${productPrice}`;
            payBtn.textContent = `Pay ${productPrice}`;

            // Reset state
            formContainer.style.display = 'block';
            successMessage.style.display = 'none';
            checkoutForm.reset();

            modal.style.display = 'flex';
        });
    });

    // Close Modal
    const closeModal = () => {
        modal.style.display = 'none';
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle Form Submission
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate processing
        payBtn.textContent = 'Processing...';
        payBtn.disabled = true;

        setTimeout(() => {
            formContainer.style.display = 'none';
            successMessage.style.display = 'block';
            payBtn.disabled = false;
        }, 1500);
    });

    // ToS Modal Logic
    const tosModal = document.getElementById('tos-modal');
    const tosLink = document.getElementById('tos-link');
    const tosCloseBtn = document.querySelector('.close-tos-modal');
    const tosCloseActionBtn = document.querySelector('.close-tos-btn');

    const openTosModal = (e) => {
        if (e) e.preventDefault();
        tosModal.style.display = 'flex';
    };

    const closeTosModal = () => {
        tosModal.style.display = 'none';
    };

    if (tosLink) tosLink.addEventListener('click', openTosModal);
    if (tosCloseBtn) tosCloseBtn.addEventListener('click', closeTosModal);
    if (tosCloseActionBtn) tosCloseActionBtn.addEventListener('click', closeTosModal);

    // Close ToS modal on click outside (but keep main modal open)
    window.addEventListener('click', (e) => {
        if (e.target === tosModal) {
            closeTosModal();
        } else if (e.target === modal) {
            closeModal();
        }
    });
});
