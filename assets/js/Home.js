// topupin.js - Main JavaScript file for Topupin Minecraft Shop

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initCategoryTabs();
    initSearch();
    initShoppingCart();
    initProductFilters();
    initFavorites();
});

// Category tabs functionality
function initCategoryTabs() {
    const categoryButtons = document.querySelectorAll('.kategori-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Get category from data attribute or text content
            const category = this.dataset.category || this.textContent.trim().toLowerCase();
            
            // Handle navigation based on category
            if (category === 'semua') {
                // Navigate to Home.html
                window.location.href = 'Home.html';
                return; // Exit early after navigation
            } else if (category === 'akun') {
                // Navigate to Account.html 
                window.location.href = 'Account.html';
                return; // Exit early after navigation
            } else if (category === 'top up') {
                // Navigate to TopUp.html
                window.location.href = 'TopUp.html';
                return; // Exit early after navigation
            } else if (category === 'jasa joki') {
                // Navigate to Jasa.html
                window.location.href = 'Jasa.html';
                return; // Exit early after navigation
            } else if (category === 'item') {
                // Navigate to Item.html
                window.location.href = 'Item.html';
                return; // Exit early after navigation
            }
            
            // Prevent default only for categories that should filter in current page
            e.preventDefault();
            
            // Remove active class from all buttons
            categoryButtons.forEach(btn => {
                btn.classList.remove('bg-lime-400', 'text-black');
                btn.classList.add('bg-zinc-800', 'text-white');
            });
            
            // Add active class to clicked button
            this.classList.remove('bg-zinc-800', 'text-white');
            this.classList.add('bg-lime-400', 'text-black');
            
            // Filter products by category if no navigation occurred
            filterProductsByCategory(category);
        });
    });
    
    // Set active class based on current page
    setActiveTabByCurrentPage();
}

// Set active tab based on current page
function setActiveTabByCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    const categoryButtons = document.querySelectorAll('.kategori-btn');

    categoryButtons.forEach(button => {
        const category = button.dataset.category || button.textContent.trim().toLowerCase();
        let isActive = false;

        if (currentPage === 'home.html' && category === 'semua') {
            isActive = true;
        } else if (currentPage === 'account.html' && category === 'akun') {
            isActive = true;
        } else if (currentPage === 'topup.html' && category === 'top up') {
            isActive = true;
        } else if (currentPage === 'jasa.html' && category === 'jasa joki') {
            isActive = true;
        }

        if (isActive) {
            button.classList.remove('bg-zinc-800', 'text-white');
            button.classList.add('bg-lime-400', 'text-black');
        } else {
            button.classList.remove('bg-lime-400', 'text-black');
            button.classList.add('bg-zinc-800', 'text-white');
        }
    });
}


// Filter products by category
function filterProductsByCategory(category) {
    const products = document.querySelectorAll('.grid > div');
    
    if (category === 'semua') {
        // Show all products
        products.forEach(product => {
            product.style.display = 'block';
        });
    } else {
        // Filter products based on category
        products.forEach(product => {
            const productCategory = getProductCategory(product);
            
            if (productCategory === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
}

// Helper function to get product category
function getProductCategory(productElement) {
    // Get category from product element
    // For this example, we're using the Town Hall level as category
    const categorySpan = productElement.querySelector('.absolute.top-2.left-2');
    if (categorySpan) {
        const text = categorySpan.textContent.toLowerCase();
        if (text.includes('akun')) return 'akun';
        if (text.includes('item')) return 'item';
        if (text.includes('jasa')) return 'jasa joki';
        return 'top up';
    }
    return 'akun'; // Default category
}

// Search functionality
function initSearch() {
    const searchInput = document.querySelector('input[type="text"]');
    const searchButton = document.querySelector('button .fa-search')?.parentElement;
    
    if (searchButton) {
        searchButton.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(this.value);
            }
        });
    }
}

// Perform search
function performSearch(query) {
    query = query.toLowerCase().trim();
    
    if (!query) {
        resetSearch();
        return;
    }
    
    const products = document.querySelectorAll('.grid > div');
    let resultsFound = false;
    
    products.forEach(product => {
        const title = product.querySelector('.font-bold')?.textContent.toLowerCase() || '';
        const category = product.querySelector('.absolute.top-2.left-2')?.textContent.toLowerCase() || '';
        
        if (title.includes(query) || category.includes(query)) {
            product.style.display = 'block';
            resultsFound = true;
            // Highlight match
            product.classList.add('search-result');
            setTimeout(() => {
                product.classList.remove('search-result');
            }, 2000);
        } else {
            product.style.display = 'none';
        }
    });
    
    if (!resultsFound) {
        showNoResultsMessage();
    }
}

// Reset search
function resetSearch() {
    const products = document.querySelectorAll('.grid > div');
    products.forEach(product => {
        product.style.display = 'block';
        product.classList.remove('search-result');
    });
    
    // Remove no results message if it exists
    const noResultsMsg = document.querySelector('.no-results-message');
    if (noResultsMsg) {
        noResultsMsg.remove();
    }
}

// Show no results message
function showNoResultsMessage() {
    // Remove existing message if any
    const existingMsg = document.querySelector('.no-results-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    const grid = document.querySelector('.grid');
    if (!grid) return;
    
    const msgElement = document.createElement('div');
    msgElement.className = 'no-results-message col-span-full text-white text-center py-8';
    msgElement.innerHTML = 'Tidak ada hasil yang ditemukan. Coba kata kunci lain.';
    
    grid.appendChild(msgElement);
}

// Shopping cart functionality
function initShoppingCart() {
    const cartButton = document.querySelector('.fa-shopping-cart')?.parentElement;
    const buyButtons = document.querySelectorAll('button.bg-lime-400');
    
    // Initialize cart data
    let cartItems = [];
    
    buyButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!button.textContent.includes("Buy.html")) return;
            
            e.preventDefault();
            
            // Get product info
            const productCard = this.closest('.bg-slate-800');
            const title = productCard.querySelector('.font-bold').textContent;
            const price = productCard.querySelector('.text-lime-400').textContent;
            const category = productCard.querySelector('.absolute.top-2.left-2').textContent;
            
            // Add to cart
            addToCart({
                title: title,
                price: price,
                category: category
            });
            
            // Show confirmation
            showAddedToCartMessage(productCard);
        });
    });
    
    if (cartButton) {
        cartButton.addEventListener('click', function() {
            showCartModal();
        });
    }
    
    // Add to cart function
    function addToCart(item) {
        cartItems.push(item);
        updateCartCounter();
        
        // Optional: save to localStorage
        saveCartToLocalStorage();
    }
    
    // Update cart counter
    function updateCartCounter() {
        if (!cartButton) return;
        
        // Create counter if doesn't exist
        let counter = document.querySelector('.cart-counter');
        
        if (!counter) {
            counter = document.createElement('span');
            counter.className = 'cart-counter absolute -top-2 -right-2 bg-lime-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center';
            cartButton.appendChild(counter);
        }
        
        counter.textContent = cartItems.length;
        
        if (cartItems.length === 0) {
            counter.style.display = 'none';
        } else {
            counter.style.display = 'flex';
        }
    }
    
    // Show added to cart message
    function showAddedToCartMessage(productCard) {
        const msg = document.createElement('div');
        msg.className = 'added-to-cart-msg absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center';
        msg.innerHTML = '<div class="text-lime-400 font-bold py-2 px-4 rounded">Ditambahkan ke keranjang!</div>';
        
        productCard.style.position = 'relative';
        productCard.appendChild(msg);
        
        setTimeout(() => {
            msg.remove();
        }, 1500);
    }
    
    // Save cart to localStorage
    function saveCartToLocalStorage() {
        localStorage.setItem('topupinCart', JSON.stringify(cartItems));
    }
    
    // Load cart from localStorage
    function loadCartFromLocalStorage() {
        const savedCart = localStorage.getItem('topupinCart');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
            updateCartCounter();
        }
    }
    
    // Show cart modal
    function showCartModal() {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'cart-modal fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50';
        
        let cartContent = '';
        let totalPrice = 0;
        
        if (cartItems.length === 0) {
            cartContent = '<p class="text-gray-300 mb-4">Keranjang belanja kosong.</p>';
        } else {
            cartContent = '<div class="max-h-60 overflow-y-auto mb-4">';
            cartItems.forEach((item, index) => {
                // Extract price value
                const priceText = item.price.replace(/[^\d]/g, '');
                const price = parseInt(priceText, 10);
                totalPrice += price;
                
                cartContent += `
                    <div class="flex justify-between items-center py-2 border-b border-gray-700">
                        <div>
                            <p class="font-bold">${item.title}</p>
                            <p class="text-sm text-gray-400">${item.category}</p>
                        </div>
                        <div class="flex items-center">
                            <p class="text-lime-400 mr-4">${item.price}</p>
                            <button class="remove-item text-red-500 hover:text-red-300" data-index="${index}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            });
            cartContent += '</div>';
            
            // Add total
            cartContent += `
                <div class="flex justify-between items-center py-2 border-t border-gray-500 font-bold">
                    <span>Total:</span>
                    <span class="text-lime-400">Rp${totalPrice.toLocaleString()}</span>
                </div>
            `;
        }
        
        modal.innerHTML = `
            <div class="bg-gray-900 p-6 rounded-lg w-full max-w-md">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-bold text-white">Keranjang Belanja</h2>
                    <button class="close-modal text-gray-500 hover:text-white">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                ${cartContent}
                <div class="flex justify-between mt-4">
                    <button class="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 close-modal">
                        Tutup
                    </button>
                    ${cartItems.length > 0 ? `
                        <button class="bg-lime-400 text-black px-4 py-2 rounded hover:bg-lime-500 checkout-btn">
                            Checkout
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', function() {
            modal.remove();
        });
        
        const removeButtons = modal.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.dataset.index, 10);
                removeItemFromCart(index);
                modal.remove();
                showCartModal();
            });
        });
        
        const checkoutBtn = modal.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function() {
                checkout();
                modal.remove();
            });
        }
    }
    
    // Remove item from cart
    function removeItemFromCart(index) {
        cartItems.splice(index, 1);
        updateCartCounter();
        saveCartToLocalStorage();
    }
    
    // Checkout function
    function checkout() {
        // Here you would implement the checkout process
        // For this example, we'll just clear the cart
        alert('Terima kasih telah berbelanja di Topupin!');
        cartItems = [];
        updateCartCounter();
        saveCartToLocalStorage();
    }
    
    // Load cart on init
    loadCartFromLocalStorage();
}

// Product filtering functionality
function initProductFilters() {
    // Check if we're on a page with product listings
    const grid = document.querySelector('.grid');
    if (!grid) return;

    // You can add price range filters, etc. here
    const filterContainer = document.createElement('div');
    filterContainer.className = 'product-filters flex justify-center gap-4 mb-6';
    filterContainer.innerHTML = `
        <div class="price-filter">
            <select class="bg-gray-800 text-white px-3 py-2 rounded">
                <option value="all">Semua Harga</option>
                <option value="under100">Dibawah Rp100.000</option>
                <option value="100to200">Rp100.000 - Rp200.000</option>
                <option value="200to300">Rp200.000 - Rp300.000</option>
                <option value="above300">Diatas Rp300.000</option>
            </select>
        </div>
        <div class="sort-filter">
            <select class="bg-gray-800 text-white px-3 py-2 rounded">
                <option value="default">Urutan Default</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
                <option value="name-asc">Nama: A-Z</option>
                <option value="name-desc">Nama: Z-A</option>
            </select>
        </div>
    `;
    
    // Insert after the category tabs
    const categoryTabs = document.querySelector('.flex.mb-6.text-center.justify-center.gap-4');
    if (categoryTabs) {
        categoryTabs.parentNode.insertBefore(filterContainer, categoryTabs.nextSibling);
    }
    
    // Add event listeners
    const priceFilter = filterContainer.querySelector('.price-filter select');
    const sortFilter = filterContainer.querySelector('.sort-filter select');
    
    priceFilter.addEventListener('change', function() {
        applyFilters();
    });
    
    sortFilter.addEventListener('change', function() {
        applyFilters();
    });
    
    function applyFilters() {
        const products = document.querySelectorAll('.grid > div');
        const priceRange = priceFilter.value;
        const sortOrder = sortFilter.value;
        
        // First apply price filter
        products.forEach(product => {
            const priceElement = product.querySelector('.text-lime-400');
            if (!priceElement) return;
            
            const priceText = priceElement.textContent;
            const price = parseInt(priceText.replace(/[^\d]/g, ''), 10);
            
            let showProduct = true;
            
            if (priceRange === 'under100' && price >= 100000) showProduct = false;
            if (priceRange === '100to200' && (price < 100000 || price > 200000)) showProduct = false;
            if (priceRange === '200to300' && (price < 200000 || price > 300000)) showProduct = false;
            if (priceRange === 'above300' && price <= 300000) showProduct = false;
            
            product.style.display = showProduct ? 'block' : 'none';
        });
        
        // Then apply sorting
        const productsArray = Array.from(products).filter(p => p.style.display !== 'none');
        
        productsArray.sort((a, b) => {
            const nameA = a.querySelector('.font-bold').textContent;
            const nameB = b.querySelector('.font-bold').textContent;
            
            const priceA = parseInt(a.querySelector('.text-lime-400').textContent.replace(/[^\d]/g, ''), 10);
            const priceB = parseInt(b.querySelector('.text-lime-400').textContent.replace(/[^\d]/g, ''), 10);
            
            switch (sortOrder) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'name-asc':
                    return nameA.localeCompare(nameB);
                case 'name-desc':
                    return nameB.localeCompare(nameA);
                default:
                    return 0;
            }
        });
        
        // Reorder elements in the DOM
        const grid = document.querySelector('.grid');
        productsArray.forEach(product => grid.appendChild(product));
    }
}

// Favorites functionality
function initFavorites() {
    // Get all star icons
    const starIcons = document.querySelectorAll('.fa-star');
    if (starIcons.length === 0) return;
    
    // Initialize favorites from localStorage
    let favorites = JSON.parse(localStorage.getItem('topupinFavorites')) || [];
    
    // Mark favorites
    markFavorites();
    
    starIcons.forEach(star => {
        star.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const product = this.closest('.bg-slate-800');
            const productTitle = product.querySelector('.font-bold').textContent;
            const productCategory = product.querySelector('.absolute.top-2.left-2').textContent;
            
            const isFavorite = this.classList.contains('text-yellow-400');
            
            if (isFavorite) {
                // Remove from favorites
                favorites = favorites.filter(fav => 
                    fav.title !== productTitle || fav.category !== productCategory);
                this.classList.remove('text-yellow-400');
                this.classList.add('text-gray-400');
            } else {
                // Add to favorites
                favorites.push({
                    title: productTitle,
                    category: productCategory
                });
                this.classList.remove('text-gray-400');
                this.classList.add('text-yellow-400');
            }
            
            // Save to localStorage
            localStorage.setItem('topupinFavorites', JSON.stringify(favorites));
        });
        
        // Make clickable
        star.style.cursor = 'pointer';
    });
    
    // Mark products as favorites
    function markFavorites() {
        document.querySelectorAll('.bg-slate-800').forEach(product => {
            const title = product.querySelector('.font-bold').textContent;
            const category = product.querySelector('.absolute.top-2.left-2').textContent;
            const star = product.querySelector('.fa-star');
            
            if (!star) return;
            
            const isFavorite = favorites.some(fav => 
                fav.title === title && fav.category === category);
            
            if (isFavorite) {
                star.classList.add('text-yellow-400');
            } else {
                star.classList.remove('text-yellow-400');
                star.classList.add('text-gray-400');
            }
        });
    }
}

// Add some CSS styles
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .search-result {
            box-shadow: 0 0 0 2px #a3e635;
        }
        
        .transition-all {
            transition: all 0.3s ease;
        }
        
        .kategori-btn:hover {
            transform: translateY(-2px);
        }
        
        .bg-slate-800:hover {
            transform: translateY(-5px);
            transition: transform 0.3s ease;
        }
        
        .cart-counter {
            position: absolute;
            top: -8px;
            right: -8px;
        }
        
        .added-to-cart-msg {
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    
    document.head.appendChild(style);
}

// Call addStyles
addStyles();

// Dropdown menu
function toggleDropdown() {
    const menu = document.getElementById("dropdownMenu");
    menu.classList.toggle("hidden");
  }

