/**
 * Main JavaScript for Drop Shipping Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    setupMobileNavigation();
    
    // Quick Actions for Product Cards
    setupQuickActions();
    
    // Newsletter Form
    setupNewsletterForm();
    
    // Add to Bag Functionality
    setupAddToBag();
    
    // Sticky Navigation
    setupStickyNavigation();
});

/**
 * Mobile Navigation Toggle
 */
function setupMobileNavigation() {
    // Create hamburger menu for mobile if it doesn't exist
    if (!document.querySelector('.mobile-menu-toggle')) {
        const nav = document.querySelector('.main-nav');
        const mobileToggle = document.createElement('div');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.innerHTML = '<span></span><span></span><span></span>';
        nav.prepend(mobileToggle);
        
        mobileToggle.addEventListener('click', function() {
            document.body.classList.toggle('mobile-menu-open');
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (document.body.classList.contains('mobile-menu-open') && 
                !event.target.closest('.nav-left') && 
                !event.target.closest('.mobile-menu-toggle')) {
                document.body.classList.remove('mobile-menu-open');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

/**
 * Quick Actions for Product Cards
 */
function setupQuickActions() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add animation class when hovering
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
        
        // Quick View Button
        const quickViewBtn = card.querySelector('.quick-actions button:first-child');
        if (quickViewBtn) {
            // If no onclick is set directly in HTML, add event listener
            if (!quickViewBtn.hasAttribute('onclick')) {
                quickViewBtn.addEventListener('click', function() {
                    const productUrl = card.getAttribute('data-product-url');
                    if (productUrl) {
                        window.location.href = productUrl;
                    }
                });
            }
        }
    });
}

/**
 * Newsletter Form
 */
function setupNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Here you would normally send the data to your backend
            console.log('Newsletter signup:', email);
            
            // Show success message
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            
            // Reset form
            emailInput.value = '';
        });
    }
}

/**
 * Add to Bag Functionality
 */
function setupAddToBag() {
    // Quick add buttons on product cards
    const addToBagButtons = document.querySelectorAll('.quick-actions button:last-child, .add-to-bag');
    
    addToBagButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product info - in a real app, you'd store this in data attributes
            const productCard = this.closest('.product-card') || this.closest('.product-info');
            let productName = 'Product';
            let productPrice = '$0.00';
            
            if (productCard) {
                const nameElement = productCard.querySelector('h3') || productCard.querySelector('h1');
                const priceElement = productCard.querySelector('p') || productCard.querySelector('.price');
                
                if (nameElement) productName = nameElement.textContent;
                if (priceElement) productPrice = priceElement.textContent;
            }
            
            // Animation effect
            animateAddToBag();
            
            // Show notification
            showNotification(`${productName} added to your bag`, 'success');
        });
    });
}

/**
 * Sticky Navigation
 */
function setupStickyNavigation() {
    const topBar = document.querySelector('.top-bar');
    const nav = document.querySelector('.main-nav');
    let navOffset = nav.offsetTop;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > navOffset) {
            nav.classList.add('sticky');
            document.body.style.paddingTop = nav.offsetHeight + 'px';
        } else {
            nav.classList.remove('sticky');
            document.body.style.paddingTop = 0;
        }
    });
}

/**
 * Notification System
 */
function showNotification(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message and type
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Show the notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Animation for adding to bag
 */
function animateAddToBag() {
    // Create a small circle element that will animate
    const circle = document.createElement('div');
    circle.className = 'add-to-bag-animation';
    document.body.appendChild(circle);
    
    // Position at click location
    circle.style.top = (event.clientY - 10) + 'px';
    circle.style.left = (event.clientX - 10) + 'px';
    
    // Get bag icon position
    const bagIcon = document.querySelector('.nav-right img[alt="Cart"]');
    if (!bagIcon) {
        circle.remove();
        return;
    }
    
    const bagRect = bagIcon.getBoundingClientRect();
    const bagX = bagRect.left + (bagRect.width / 2);
    const bagY = bagRect.top + (bagRect.height / 2);
    
    // Animate the circle to the bag icon
    circle.style.transition = 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
    setTimeout(() => {
        circle.style.top = bagY + 'px';
        circle.style.left = bagX + 'px';
        circle.style.opacity = '0';
        circle.style.transform = 'scale(0.2)';
        
        // Animate bag icon
        bagIcon.classList.add('pulse');
        setTimeout(() => {
            bagIcon.classList.remove('pulse');
            circle.remove();
        }, 1000);
    }, 10);
}

// Main JavaScript for Drop Shipping Catalog

// Wait for the DOM to be loaded
document.addEventListener("DOMContentLoaded", function() {
    // Initialize search functionality
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", filterProducts);
    }

    // Initialize category filter
    const categoryFilter = document.getElementById("categoryFilter");
    if (categoryFilter) {
        categoryFilter.addEventListener("change", filterProducts);
    }
});

// Function to filter products based on search input and category
function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value.toLowerCase();
    const productCards = document.querySelectorAll(".card");

    productCards.forEach(card => {
        const title = card.querySelector(".card-title").textContent.toLowerCase();
        const category = card.querySelector(".text-muted").textContent.toLowerCase();
        
        const matchesSearch = title.includes(searchTerm);
        const matchesCategory = !selectedCategory || category.includes(selectedCategory);

        card.closest(".col").style.display = 
            matchesSearch && matchesCategory ? "block" : "none";
    });
}

// Admin panel functions
function confirmDelete(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        // Here you would typically make an API call to delete the product
        console.log(`Delete product ${productId}`);
    }
}

// Function to show product details
function showProductDetails(productId) {
    window.location.href = `/product/${productId}`;
}

// Handle form submission errors
function handleFormError(error) {
    console.error("Error:", error);
    alert("An error occurred. Please try again.");
}

