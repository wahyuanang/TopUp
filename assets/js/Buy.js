/**
 * Topupin - Game Account Marketplace
 * Buy.js - JavaScript logic for the Buy page
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initializePage();
    
    // Add event listeners to all Buy buttons
    setupBuyButtons();
    
    // Setup search functionality
    setupSearch();
    
    // Setup featured account
    setupFeaturedAccount();
});

/**
 * Initialize the page with any required setup
 */
function initializePage() {
    console.log('Buy page initialized');
    
    // Show the page contents after loading
    document.body.style.opacity = '1';
    
    // Handle browser back button for mobile menu state
    window.addEventListener('popstate', function(event) {
        const dropdownMenu = document.getElementById('dropdownMenu');
        if (dropdownMenu && !dropdownMenu.classList.contains('hidden')) {
            dropdownMenu.classList.add('hidden');
        }
    });
}

/**
 * Setup all Buy buttons with event listeners
 */
function setupBuyButtons() {
    const buyButtons = document.querySelectorAll('button:not([onclick])');
    
    buyButtons.forEach(button => {
        if (button.textContent.trim() === 'Beli' || button.textContent.trim() === 'Beli Sekarang') {
            button.addEventListener('click', function(event) {
                const parentCard = button.closest('.rounded-lg');
                let productTitle = '';
                let productPrice = '';
                
                if (parentCard) {
                    const titleElement = parentCard.querySelector('h3') || parentCard.querySelector('h2');
                    const priceElement = parentCard.querySelector('.text-lime-400');
                    
                    if (titleElement) {
                        productTitle = titleElement.textContent.trim();
                    }
                    
                    if (priceElement) {
                        productPrice = priceElement.textContent.trim();
                    }
                }
                
                handleBuyAction(productTitle, productPrice);
            });
        }
    });
}

/**
 * Handle the Buy action when a user clicks on a Buy button
 * @param {string} productTitle - The title of the product
 * @param {string} productPrice - The price of the product
 */
function handleBuyAction(productTitle, productPrice) {
    console.log(`Buying: ${productTitle} for ${productPrice}`);
    
    // Show confirmation dialog
    if (confirm(`Anda akan membeli ${productTitle || 'akun ini'} dengan harga ${productPrice || 'yang tertera'}. Lanjutkan ke pembayaran?`)) {
        // Store selected item in session storage for checkout page
        sessionStorage.setItem('selectedProduct', JSON.stringify({
            title: productTitle,
            price: productPrice,
            timestamp: new Date().toISOString()
        }));
        
        // Redirect to checkout page (assuming it exists)
        window.location.href = '../Checkout.html';
    }
}

/**
 * Setup search functionality
 */
function setupSearch() {
    const searchInputs = document.querySelectorAll('input[placeholder="Search..."]');
    
    searchInputs.forEach(input => {
        input.addEventListener('keyup', function(event) {
            // If Enter key is pressed
            if (event.key === 'Enter') {
                const searchTerm = input.value.trim().toLowerCase();
                searchAccounts(searchTerm);
            }
        });
        
        // Get the search button next to this input
        const searchButton = input.nextElementSibling;
        if (searchButton) {
            searchButton.addEventListener('click', function() {
                const searchTerm = input.value.trim().toLowerCase();
                searchAccounts(searchTerm);
            });
        }
    });
}

/**
 * Search through the accounts based on search term
 * @param {string} searchTerm - The search term entered by user
 */
function searchAccounts(searchTerm) {
    console.log(`Searching for: ${searchTerm}`);
    
    if (!searchTerm) {
        // If search is empty, show all accounts
        showAllAccounts();
        return;
    }
    
    const accountItems = document.querySelectorAll('.grid-cols-2 > div, .grid-cols-3 > div, .grid-cols-5 > div');
    let matchFound = false;
    
    accountItems.forEach(item => {
        const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
        const description = item.querySelector('p')?.textContent.toLowerCase() || '';
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            item.style.display = '';
            matchFound = true;
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show a message if no matches found
    const noResultsMessage = document.getElementById('noResultsMessage');
    if (!matchFound) {
        if (!noResultsMessage) {
            const message = document.createElement('p');
            message.id = 'noResultsMessage';
            message.className = 'text-center text-gray-400 my-8';
            message.textContent = `Tidak ada hasil untuk "${searchTerm}"`;
            
            const accountsSection = document.querySelector('.grid-cols-2, .grid-cols-3, .grid-cols-5');
            if (accountsSection) {
                accountsSection.parentNode.insertBefore(message, accountsSection.nextSibling);
            }
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove();
    }
}

/**
 * Show all accounts (used when clearing search)
 */
function showAllAccounts() {
    const accountItems = document.querySelectorAll('.grid-cols-2 > div, .grid-cols-3 > div, .grid-cols-5 > div');
    
    accountItems.forEach(item => {
        item.style.display = '';
    });
    
    // Remove any "no results" message
    const noResultsMessage = document.getElementById('noResultsMessage');
    if (noResultsMessage) {
        noResultsMessage.remove();
    }
}

/**
 * Setup featured account functionality
 */
function setupFeaturedAccount() {
    const featuredSection = document.querySelector('section:first-of-type');
    if (!featuredSection) return;
    
    // Get the featured product details
    const featuredTitle = featuredSection.querySelector('h2')?.textContent || '';
    const featuredPrice = featuredSection.querySelector('.text-lime-400')?.textContent || '';
    const featuredImage = featuredSection.querySelector('img')?.src || '';
    
    // Add animation to the featured product
    const featuredCard = featuredSection.querySelector('.bg-black');
    if (featuredCard) {
        featuredCard.classList.add('featured-highlight');
        
        // Add hover effect
        featuredCard.addEventListener('mouseenter', function() {
            this.classList.add('featured-hover');
        });
        
        featuredCard.addEventListener('mouseleave', function() {
            this.classList.remove('featured-hover');
        });
    }
    
    // Store featured item info for potential quick access later
    sessionStorage.setItem('featuredProduct', JSON.stringify({
        title: featuredTitle,
        price: featuredPrice,
        image: featuredImage
    }));
}

/**
 * Toggle the dropdown menu for mobile view
 */
function toggleDropdown() {
    const menu = document.getElementById("dropdownMenu");
    if (menu) {
        menu.classList.toggle("hidden");
    }
}

/**
 * Format price with Indonesian Rupiah format
 * @param {string} priceStr - Price string to format
 * @returns {string} - Formatted price
 */
function formatCurrency(priceStr) {
    // Remove any non-numeric characters
    const numericValue = priceStr.replace(/[^\d]/g, '');
    
    // Convert to number and format with dot separators
    return 'Rp ' + parseInt(numericValue).toLocaleString('id-ID');
}

/**
 * Track user engagement for analytics
 * @param {string} action - The action performed
 * @param {Object} data - Additional data about the action
 */
function trackUserEngagement(action, data = {}) {
    // This would typically send data to an analytics service
    console.log('User Engagement:', { action, ...data, timestamp: new Date().toISOString() });
    
    // For demonstration, we'll just store in localStorage
    const engagementHistory = JSON.parse(localStorage.getItem('userEngagement') || '[]');
    engagementHistory.push({ action, ...data, timestamp: new Date().toISOString() });
    localStorage.setItem('userEngagement', JSON.stringify(engagementHistory));
}

// Add CSS for animations
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        .featured-highlight {
            transition: all 0.3s ease;
            box-shadow: 0 0 0 rgba(215, 253, 82, 0);
        }
        
        .featured-hover {
            box-shadow: 0 0 15px rgba(215, 253, 82, 0.5);
            transform: translateY(-5px);
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
        }
        
        .grid-cols-2 > div:hover, 
        .grid-cols-3 > div:hover, 
        .grid-cols-5 > div:hover {
            transform: translateY(-3px);
            transition: transform 0.2s ease;
        }
    `;
    document.head.appendChild(style);
});