document.addEventListener("DOMContentLoaded", () => {
// --- Focus Trap & Management ---
let lastFocusedElement;

const trapFocus = (element) => {
    const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function (e) {
        const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

        if (!isTabPressed) {
            return;
        }

        if (e.shiftKey) { // if shift key pressed for shift + tab combination
            if (document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            }
        } else { // if tab key is pressed
            if (document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        }
    });
}

// --- Buy Modal Logic ---
const modal = document.getElementById('buy-modal');
if (modal) {
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
            lastFocusedElement = document.activeElement; // Save focus
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
            // Focus first input
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
            trapFocus(modal);
        });
    });

    // Close Modal Helper
    const closeModal = () => {
        modal.style.display = 'none';
        if (lastFocusedElement) lastFocusedElement.focus(); // Restore focus
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Close on click outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle Form Submission
    if (checkoutForm) {
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
    }
}

// --- ToS Modal Logic ---
const tosModal = document.getElementById('tos-modal');
if (tosModal) {
    const tosLink = document.getElementById('tos-link');
    const tosCloseBtn = document.querySelector('.close-tos-modal');
    const tosCloseActionBtn = document.querySelector('.close-tos-btn');

    const openTosModal = (e) => {
        if (e) e.preventDefault();
        // Note: We don't overwrite lastFocusedElement here because we want to return to it eventually,
        // or we could save the current active element if we want to return specifically to the ToS link.
        // For nested modals, usually retaining the original trigger is fine, but focus management gets complex.
        tosModal.style.display = 'flex';
        tosCloseBtn.focus(); // Focus close button
        trapFocus(tosModal);
    };

    const closeTosModal = () => {
        tosModal.style.display = 'none';
        // Return focus to ToS link if it's visible (which is inside Buy modal)
        if (tosLink && tosLink.offsetParent !== null) {
            tosLink.focus();
        }
    };

    if (tosLink) tosLink.addEventListener('click', openTosModal);
    if (tosCloseBtn) tosCloseBtn.addEventListener('click', closeTosModal);
    if (tosCloseActionBtn) tosCloseActionBtn.addEventListener('click', closeTosModal);

    // Close ToS modal on click outside
    window.addEventListener('click', (e) => {
        if (e.target === tosModal) {
            closeTosModal();
        }
    });
}

// --- WCAG Modal Logic ---
const wcagModal = document.getElementById('wcag-modal');
if (wcagModal) {
    const wcagLink = document.getElementById('wcag-link');
    const wcagCloseBtn = document.querySelector('.close-wcag-modal');
    const wcagCloseActionBtn = document.querySelector('.close-wcag-btn');

    const openWcagModal = (e) => {
        if (e) e.preventDefault();
        lastFocusedElement = document.activeElement;
        wcagModal.style.display = 'flex';
        wcagCloseBtn.focus();
        trapFocus(wcagModal);
    };

    const closeWcagModal = () => {
        wcagModal.style.display = 'none';
        if (lastFocusedElement) lastFocusedElement.focus();
    };

    if (wcagLink) wcagLink.addEventListener('click', openWcagModal);
    if (wcagCloseBtn) wcagCloseBtn.addEventListener('click', closeWcagModal);
    if (wcagCloseActionBtn) wcagCloseActionBtn.addEventListener('click', closeWcagModal);

    // Close WCAG modal on click outside
    window.addEventListener('click', (e) => {
        if (e.target === wcagModal) {
            closeWcagModal();
        }
    });
}

// --- Global ESC Key Logic ---
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('buy-modal');
        const tosModal = document.getElementById('tos-modal');
        const wcagModal = document.getElementById('wcag-modal');

        // Priority 1: Close Top-Level Modals (ToS or WCAG)
        if (tosModal && tosModal.style.display === 'flex') {
            tosModal.style.display = 'none';
            if (document.getElementById('tos-link')) document.getElementById('tos-link').focus();
            return; // Stop here, do not close the underlying Buy modal
        }
        if (wcagModal && wcagModal.style.display === 'flex') {
            wcagModal.style.display = 'none';
            if (lastFocusedElement) lastFocusedElement.focus();
            return; // Stop here
        }

        // Priority 2: Close Base Modal (Buy)
        if (modal && modal.style.display === 'flex') {
            modal.style.display = 'none';
            if (lastFocusedElement) lastFocusedElement.focus();
        }
    }
});

});
