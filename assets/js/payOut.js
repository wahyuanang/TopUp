// Initialize variables to store selections
let selectedNominal = null;
let selectedPaymentMethod = null;

// Add event listeners to nominal cards
document.querySelectorAll('.nominal-card').forEach(card => {
    card.addEventListener('click', function() {
        // Remove active class from all cards
        document.querySelectorAll('.nominal-card').forEach(c => {
            c.classList.remove('ring-2', 'ring-yellow-400');
        });
        
        // Add active class to selected card
        this.classList.add('ring-2', 'ring-yellow-400');
        
        // Get the price and amount from data attributes and elements
        const price = this.getAttribute('data-price');
        const amount = this.querySelector('.p-2.text-center').innerText.split('\n')[0].trim();
        
        selectedNominal = {
            price: price,
            amount: amount
        };
        
        // Update the order summary
        updateOrderSummary();
    });
});

// Add event listeners to payment methods
document.querySelectorAll('.payment-method').forEach(method => {
    method.addEventListener('click', function() {
        // Remove active class from all payment methods
        document.querySelectorAll('.payment-method').forEach(m => {
            m.classList.remove('ring-2', 'ring-yellow-400');
        });
        
        // Add active class to selected payment method
        this.classList.add('ring-2', 'ring-yellow-400');
        
        // Get the payment method from data attribute
        selectedPaymentMethod = this.getAttribute('data-method');
        
        // Update the payment display
        updatePaymentDisplay();
    });
});

// Function to update order summary
function updateOrderSummary() {
    if (selectedNominal) {
        // Format the price for display (adding 'Rp' prefix)
        const priceDisplay = `Rp${selectedNominal.price}`;
        
        // Update the price displays
        document.getElementById('price-display').innerText = priceDisplay;
        document.getElementById('total-price-display').innerText = priceDisplay;
        
        // Update the diamond amount display
        document.getElementById('amount-display').innerText = selectedNominal.amount;
        
        // Update the header of the "Membeli Item" section to include the diamond amount
        const buyingItemElement = document.querySelector('.bg-gray-800.rounded.border.border-lime-300 .flex.justify-between:first-child span:first-child');
        if (buyingItemElement) {
            buyingItemElement.innerText = `Membeli Item: ${selectedNominal.amount}`;
        }
        
        // Update the item details content for "Lihat rincian" section
        const itemDetailLink = document.querySelector('.bg-gray-800.rounded.border.border-lime-300 .flex.justify-between:first-child a');
        if (itemDetailLink) {
            // Store the item details in a data attribute for display later
            itemDetailLink.setAttribute('data-item-details', `Valorant - ${selectedNominal.amount}`);
            
            // Optional: Add click handler to show details
            if (!itemDetailLink.hasAttribute('data-has-handler')) {
                itemDetailLink.setAttribute('data-has-handler', 'true');
                itemDetailLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert(`Detail pembelian:\n${this.getAttribute('data-item-details')}`);
                });
            }
        }
    } else {
        document.getElementById('price-display').innerText = 'Rp0';
        document.getElementById('total-price-display').innerText = 'Rp0';
        document.getElementById('amount-display').innerText = '0 Diamonds';
        
        // Reset text if nothing is selected
        const buyingItemElement = document.querySelector('.bg-gray-800.rounded.border.border-lime-300 .flex.justify-between:first-child span:first-child');
        if (buyingItemElement) {
            buyingItemElement.innerText = 'Membeli Item';
        }
    }
}

// Function to update payment display
function updatePaymentDisplay() {
    const paymentDisplay = document.getElementById('payment-method-display');
    if (paymentDisplay && selectedPaymentMethod) {
        paymentDisplay.innerText = selectedPaymentMethod;
    } else if (paymentDisplay) {
        paymentDisplay.innerText = 'Pilih metode pembayaran';
    }
}
document.addEventListener('DOMContentLoaded', function() {
    initializePaymentSystem();
});

function initializePaymentSystem() {
    // Handle nominal card selection
    const nominalCards = document.querySelectorAll('.nominal-card');
    nominalCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove previous selection
            nominalCards.forEach(c => c.classList.remove('selected', 'ring-2', 'ring-[#D7FD52]'));
            
            // Add selection to clicked card
            this.classList.add('selected', 'ring-2', 'ring-[#D7FD52]');
            
            // Store selected nominal data
            selectedNominal = {
                amount: this.getAttribute('data-amount'),
                price: this.getAttribute('data-price')
            };
            
            // Update display in checkout form
            updateCheckoutDisplay();
        });
    });

    // Handle payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove previous selection
            paymentMethods.forEach(m => m.classList.remove('selected', 'ring-2', 'ring-blue-500'));
            
            // Add selection to clicked method
            this.classList.add('selected', 'ring-2', 'ring-blue-500');
            
            // Store selected payment method
            selectedPaymentMethod = this.getAttribute('data-method');
            
            // Update display in checkout form
            updateCheckoutDisplay();
        });
    });

    // Handle mobile dropdown toggle
    window.toggleDropdown = function() {
        const dropdown = document.getElementById('dropdownMenu');
        dropdown.classList.toggle('hidden');
    };

    // Handle form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate required fields
            const userId = document.getElementById('userId').value.trim();
            const server = document.getElementById('server').value.trim();
            
            if (!userId || !server) {
                showAlert('Silakan lengkapi User ID dan Server!', 'error');
                return;
            }
            
            if (!selectedNominal) {
                showAlert('Silakan pilih nominal top up!', 'error');
                return;
            }
            
            if (!selectedPaymentMethod) {
                showAlert('Silakan pilih metode pembayaran!', 'error');
                return;
            }
            
            // Show payment popup
            showPaymentPopup();
        });
    }

    // Close popup when clicking outside
    const paymentPopup = document.getElementById('paymentPopup');
    if (paymentPopup) {
        paymentPopup.addEventListener('click', function(e) {
            if (e.target === this) {
                closePaymentPopup();
            }
        });
    }

    // Handle ESC key to close popup
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePaymentPopup();
        }
    });
}

// Update checkout display when selections change
function updateCheckoutDisplay() {
    if (selectedNominal) {
        document.getElementById('amount-display').innerText = selectedNominal.amount;
        document.getElementById('price-display').innerText = `Rp${selectedNominal.price}`;
        document.getElementById('total-price-display').innerText = `Rp${selectedNominal.price}`;
    }
    
    if (selectedPaymentMethod) {
        document.getElementById('payment-method-display').innerText = selectedPaymentMethod;
    }
}

// Payment Popup Functions
function showPaymentPopup() {
    if (!selectedNominal || !selectedPaymentMethod) {
        showAlert('Silakan pilih nominal dan metode pembayaran terlebih dahulu!', 'error');
        return;
    }

    // Update popup content with correct data
    document.getElementById('popup-amount').innerText = selectedNominal.amount;
    document.getElementById('popup-payment-method').innerText = selectedPaymentMethod;
    document.getElementById('popup-payment-text').innerText = selectedPaymentMethod;
    document.getElementById('popup-total').innerText = `Rp ${formatNumber(selectedNominal.price)}`;
    
    // Update payment method icon in popup
    updatePaymentMethodIcon();
    
    // Show popup with animation
    const popup = document.getElementById('paymentPopup');
    popup.classList.remove('hidden');
    popup.style.opacity = '0';
    popup.style.transform = 'scale(0.9)';
    
    // Animate in
    setTimeout(() => {
        popup.style.transition = 'all 0.3s ease-out';
        popup.style.opacity = '1';
        popup.style.transform = 'scale(1)';
    }, 10);
    
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closePaymentPopup() {
    const popup = document.getElementById('paymentPopup');
    popup.style.transition = 'all 0.3s ease-in';
    popup.style.opacity = '0';
    popup.style.transform = 'scale(0.9)';
    
    setTimeout(() => {
        popup.classList.add('hidden');
        popup.style.transition = '';
        document.body.style.overflow = 'auto'; // Enable scrolling
    }, 300);
}

function proceedPayment() {
    // Collect all user details
    const userDetails = {
        whatsapp: document.getElementById('whatsapp').value.trim(),
        userId: document.getElementById('userId').value.trim(),
        server: document.getElementById('server').value.trim(),
        promoCode: document.getElementById('promoCode').value.trim(),
        amount: selectedNominal.amount,
        price: selectedNominal.price,
        paymentMethod: selectedPaymentMethod
    };
    
    console.log('Processing payment with details:', userDetails);
    
    // Show loading state
    const button = event.target;
    const originalText = button.innerText;
    button.innerText = 'Memproses...';
    button.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        showAlert(`Pembayaran berhasil diproses! Total: Rp ${formatNumber(selectedNominal.price)}`, 'success');
        closePaymentPopup();
        
        // Reset button
        button.innerText = originalText;
        button.disabled = false;
        
        // Reset form after successful payment
        resetForm();
    }, 2000);
}

// Update payment method icon in popup
function updatePaymentMethodIcon() {
    const iconMap = {
        'OVO': '/assets/logopembayaran/ovo.png',
        'DANA': '/assets/logopembayaran/dana.png',
        'QRIS': '/assets/logopembayaran/qris.png',
        'BCA': '/assets/logopembayaran/blu.png'
    };
    
    const paymentIcon = document.querySelector('#paymentPopup img[alt="Dana"]');
    if (paymentIcon && iconMap[selectedPaymentMethod]) {
        paymentIcon.src = iconMap[selectedPaymentMethod];
        paymentIcon.alt = selectedPaymentMethod;
    }
}

// Utility Functions
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full`;
    
    // Set colors based on type
    if (type === 'error') {
        alertDiv.classList.add('bg-red-500', 'text-white');
    } else if (type === 'success') {
        alertDiv.classList.add('bg-green-500', 'text-white');
    } else {
        alertDiv.classList.add('bg-blue-500', 'text-white');
    }
    
    alertDiv.innerHTML = `
        <div class="flex items-center gap-2">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Animate in
    setTimeout(() => {
        alertDiv.classList.remove('translate-x-full');
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        alertDiv.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(alertDiv);
        }, 300);
    }, 3000);
}

function resetForm() {
    // Reset form fields
    document.getElementById('checkoutForm').reset();
    
    // Reset selections
    selectedNominal = null;
    selectedPaymentMethod = null;
    
    // Remove visual selections
    document.querySelectorAll('.nominal-card').forEach(card => {
        card.classList.remove('selected', 'ring-2', 'ring-[#D7FD52]');
    });
    
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('selected', 'ring-2', 'ring-blue-500');
    });
    
    // Reset checkout display
    document.getElementById('amount-display').innerText = '53 VP';
    document.getElementById('payment-method-display').innerText = 'Pilih metode';
    document.getElementById('price-display').innerText = 'Rp0';
    document.getElementById('total-price-display').innerText = 'Rp0';
}