document.addEventListener('DOMContentLoaded', function() {
    // Kelas untuk produk halaman 1 (yang sudah ada di HTML asli)
    const page1Products = document.querySelectorAll('.product-grid > div:not(.page-2-product):not(.page-3-product)');
    
    // Kelas untuk produk halaman 2 (yang ditambahkan kemudian)
    const page2Products = document.querySelectorAll('.page-2-product');
    
    // Kelas untuk produk halaman 3 (jika ada)
    const page3Products = document.querySelectorAll('.page-3-product');
    
    // Tombol pagination
    const pageButtons = document.querySelectorAll('.pagination-nav a[data-page]');
    const prevButton = document.querySelector('.pagination-nav .prev-btn');
    const nextButton = document.querySelector('.pagination-nav .next-btn');
    
    // Mendapatkan parameter halaman dari URL
    let currentPage = 1;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('page')) {
        currentPage = parseInt(urlParams.get('page'));
    }
    
    // Fungsi untuk mengubah halaman
    function changePage(pageNum) {
        // Update currentPage
        currentPage = pageNum;
        
        // Sembunyikan semua produk terlebih dahulu
        hideAllProducts();
        
        // Tampilkan produk berdasarkan halaman yang dipilih
        if (pageNum === 1) {
            showProducts(page1Products);
        } else if (pageNum === 2) {
            showProducts(page2Products);
        } else if (pageNum === 3) {
            showProducts(page3Products);
        }
        
        // Perbarui status tombol pagination
        updatePaginationButtons(pageNum);
        
        // Perbarui URL
        updateUrl(pageNum);
        
        // Scroll ke atas halaman
        window.scrollTo(0, 0);
    }
    
    // Fungsi untuk menyembunyikan semua produk
    function hideAllProducts() {
        const allProducts = document.querySelectorAll('.page-2-product, .page-3-product');

        // Sembunyikan semua produk halaman 2 dan 3
        allProducts.forEach(product => {
            product.style.display = 'none';
        });

        // Produk halaman 1: hanya tampil jika currentPage === 1
        const page1Products = document.querySelectorAll('.grid > div:not(.page-2-product):not(.page-3-product)');
        page1Products.forEach(product => {
            product.style.display = (currentPage === 1) ? 'block' : 'none';
        });
    }
    
    // Fungsi untuk menampilkan produk
    function showProducts(products) {
        products.forEach(product => {
            product.style.display = 'block';
        });
    }
    
    // Fungsi untuk memperbarui status tombol pagination
    function updatePaginationButtons(pageNum) {
        // Perbarui status tombol halaman
        pageButtons.forEach(button => {
            const buttonPage = parseInt(button.getAttribute('data-page'));
            
            if (buttonPage === pageNum) {
                button.className = 'px-3 py-2 bg-lime-400 text-black';
            } else {
                button.className = 'px-3 py-2 bg-[#242424] text-white hover:bg-lime-400 hover:text-black';
            }
        });
        
        // Perbarui status tombol Previous
        if (pageNum === 1) {
            prevButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        
        // Perbarui status tombol Next
        const maxPage = page3Products.length > 0 ? 3 : (page2Products.length > 0 ? 2 : 1);
        if (pageNum === maxPage) {
            nextButton.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
    
    // Fungsi untuk memperbarui URL
    function updateUrl(pageNum) {
        const url = new URL(window.location.href);
        url.searchParams.set('page', pageNum);
        window.history.pushState({page: pageNum}, '', url);
    }
    
    // Tambahkan event listener ke tombol pagination
    pageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const pageNum = parseInt(this.getAttribute('data-page'));
            changePage(pageNum);
        });
    });
    
    // Tambahkan event listener ke tombol Previous
    prevButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    });
    
    // Tambahkan event listener ke tombol Next
    nextButton.addEventListener('click', function(e) {
        e.preventDefault();
        const maxPage = page3Products.length > 0 ? 3 : (page2Products.length > 0 ? 2 : 1);
        if (currentPage < maxPage) {
            changePage(currentPage + 1);
        }
    });
    
    // Tampilkan halaman awal
    changePage(currentPage);
});