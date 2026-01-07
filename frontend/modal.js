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
        let isFormDirty = false;

        // Confirmation Modal Elements
        const confirmModal = document.getElementById('confirm-modal');
        const confirmDiscardBtn = document.getElementById('confirm-discard-btn');
        const confirmCancelBtn = document.getElementById('confirm-cancel-btn');

        console.log('Init Modal Logic:', {
            hasBuyModal: !!modal,
            hasConfirmModal: !!confirmModal,
            hasForm: !!checkoutForm,
            confirmModalDisplay: confirmModal ? confirmModal.style.display : 'N/A'
        });

        // Track form changes
        if (checkoutForm) {
            checkoutForm.addEventListener('input', () => {
                const wasDirty = isFormDirty;
                isFormDirty = true;
                if (!wasDirty) console.log('Form became dirty');
            });
        }

        // Open Modal
        buyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Opening Buy Modal');
                lastFocusedElement = document.activeElement; // Save focus
                const card = button.closest('.product-card');
                const productName = card.querySelector('h4').textContent;
                const productPrice = card.querySelector('.price').textContent;

                productSummary.innerHTML = `<strong>${productName}</strong> - ${productPrice}`;
                payBtn.textContent = `Pay ${productPrice}`;

                // Reset state - but only if previous session was clean or user confirmed discard
                // In a real app we might want to keep draft data. 
                // For now, let's assume opening a NEW product always wants a fresh form,
                // BUT we should warn if the OLD form had data. 
                // However, the modal was closed, so we already handled the warning there.
                // So here we just ensure we start fresh.
                formContainer.style.display = 'block';
                successMessage.style.display = 'none';
                checkoutForm.reset();
                isFormDirty = false; // Reset dirty flag on open

                modal.style.display = 'flex';
                // Focus first input
                const firstInput = modal.querySelector('input');
                if (firstInput) firstInput.focus();
                trapFocus(modal);
            });
        });

        // Internal function to force close without checking dirty state
        const forceCloseModal = () => {
            console.log('Force closing modal');
            modal.style.display = 'none';
            isFormDirty = false;
            if (lastFocusedElement) lastFocusedElement.focus();
        };

        // Close Modal Helper
        const closeModal = () => {
            console.log('closeModal called. Dirty:', isFormDirty);
            if (isFormDirty) {
                // Show custom confirmation modal
                if (confirmModal) {
                    console.log('Displaying confirm modal');
                    confirmModal.style.display = 'flex';
                    if (confirmDiscardBtn) confirmDiscardBtn.focus();
                    trapFocus(confirmModal);
                } else {
                    console.error('Confirm modal element missing!');
                    // Fallback if modal missing (shouldn't happen)
                    forceCloseModal();
                }
                return;
            }
            forceCloseModal();
        };

        // Confirmation Modal Logic
        if (confirmModal) {
            if (confirmDiscardBtn) {
                confirmDiscardBtn.addEventListener('click', () => {
                    confirmModal.style.display = 'none';
                    forceCloseModal();
                });
            }
            if (confirmCancelBtn) {
                confirmCancelBtn.addEventListener('click', () => {
                    confirmModal.style.display = 'none';
                    // Return focus to the Buy modal
                    const firstInput = modal.querySelector('input');
                    if (firstInput) firstInput.focus();
                });
            }
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

        // Close on click outside (Buy Modal)
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (confirmModal && confirmModal.style.display === 'flex') {
                    return; // Ignore clicks if confirmation is open
                }
                closeModal();
            }
        });

        // Close on click outside (Confirm Modal)
        window.addEventListener('click', (e) => {
            if (e.target === confirmModal) {
                // Treat click outside confirm modal as "Keep Editing"
                confirmModal.style.display = 'none';
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
                    isFormDirty = false; // Form submitted, no longer dirty
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
            const confirmModal = document.getElementById('confirm-modal');

            // Priority 1: Close Top-Level Modals (ToS, WCAG, or Confirm)
            if (confirmModal && confirmModal.style.display === 'flex') {
                confirmModal.style.display = 'none'; // Treat as cancel
                // Return focus to buy modal
                if (modal) {
                    const firstInput = modal.querySelector('input');
                    if (firstInput) firstInput.focus();
                }
                return;
            }
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
                // If confirm modal is ALREADY open, let its own logic handle ESC (usually closes it/cancels)
                // But wait, ESC priority 1 handles "Top-Level Modals". 
                // I need to add Confirm Modal to Priority 1 list in the global handler.

                const closeBtn = modal.querySelector('.close-modal');
                if (closeBtn) closeBtn.click();
            }
        }
    });

});
