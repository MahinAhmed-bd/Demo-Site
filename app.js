/**
 * Luminary Audio - Demo E-Commerce Platform
 * Tracking Ready Code Setup for GA4 and Google Tag Manager
 */

// Initialize DataLayer Array globally
window.dataLayer = window.dataLayer || [];

// Mock Product Dataset
const PRODUCTS = [
    {
        id: "SKU-1001",
        name: "Luminary Studio Pro Headphones",
        category: "Headphones",
        price: 299.00,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
        description: "Studio-grade wireless over-ear headphones with active noise cancellation and 40-hour battery life."
    },
    {
        id: "SKU-1002",
        name: "Aura ANC Earbuds",
        category: "Earbuds",
        price: 149.00,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
        description: "Compact wireless earbuds with deep bass, high-fidelity sound, and water-resistant casing."
    },
    {
        id: "SKU-1003",
        name: "Pulse Portable Speaker",
        category: "Speakers",
        price: 119.00,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&auto=format&fit=crop&q=80",
        description: "360-degree Bluetooth speaker featuring IPX7 waterproofing and room-filling acoustic output."
    },
    {
        id: "SKU-1004",
        name: "Zenith Desktop Soundbar",
        category: "Speakers",
        price: 199.00,
        image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80",
        description: "Sleek desktop soundbar with optical and wireless connectivity designed for modern workstations."
    }
];

// Application State
let cart = [];
let currentProduct = null;

// Helper: Push Custom Events to dataLayer
function pushToDataLayer(eventName, ecommerceData = null, extraParams = {}) {
    const payload = {
        event: eventName,
        ...extraParams
    };
    if (ecommerceData) {
        payload.ecommerce = ecommerceData;
    }
    window.dataLayer.push(payload);
    console.log(`[DataLayer Push] Event: ${eventName}`, payload);
}

// Single Page Application Navigation Handler
function navigateTo(viewId) {
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active-view');
    });

    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) {
        targetView.classList.add('active-view');
        window.scrollTo(0, 0);

        // Track Virtual Pageviews for SPA routing
        pushToDataLayer('page_view', null, {
            page_title: document.title + ' - ' + viewId.toUpperCase(),
            page_location: window.location.origin + '/' + viewId,
            page_path: '/' + viewId
        });

        // Trigger specific dataLayer events based on view
        if (viewId === 'cart') {
            trackViewCart();
        } else if (viewId === 'checkout') {
            trackBeginCheckout();
        }
    }
}

// Render Products
function renderProducts() {
    const featuredContainer = document.getElementById('featured-products-grid');
    const shopContainer = document.getElementById('shop-products-grid');

    const productHTML = (p) => `
        <div class="product-card" data-id="${p.id}">
            <img src="${p.image}" alt="${p.name}">
            <div class="product-card-body">
                <span class="product-card-category">${p.category}</span>
                <h3 class="product-card-title">${p.name}</h3>
                <div class="product-card-price">$${p.price.toFixed(2)}</div>
                <div class="product-card-actions">
                    <button class="btn btn-secondary btn-full view-product-btn" data-id="${p.id}">View Details</button>
                    <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
                </div>
            </div>
        </div>
    `;

    if (featuredContainer) {
        featuredContainer.innerHTML = PRODUCTS.slice(0, 3).map(productHTML).join('');
    }
    if (shopContainer) {
        shopContainer.innerHTML = PRODUCTS.map(productHTML).join('');
    }

    // Trigger item list view event
    trackViewItemList();
}

// Product Listing Filters
function setupFilters() {
    const searchInput = document.getElementById('shop-search');
    const categorySelect = document.getElementById('shop-category-filter');
    const shopContainer = document.getElementById('shop-products-grid');

    function filter() {
        const query = searchInput.value.toLowerCase();
        const category = categorySelect.value;

        const filtered = PRODUCTS.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(query);
            const matchesCategory = category === 'all' || p.category === category;
            return matchesSearch && matchesCategory;
        });

        shopContainer.innerHTML = filtered.map(p => `
            <div class="product-card" data-id="${p.id}">
                <img src="${p.image}" alt="${p.name}">
                <div class="product-card-body">
                    <span class="product-card-category">${p.category}</span>
                    <h3 class="product-card-title">${p.name}</h3>
                    <div class="product-card-price">$${p.price.toFixed(2)}</div>
                    <div class="product-card-actions">
                        <button class="btn btn-secondary btn-full view-product-btn" data-id="${p.id}">View Details</button>
                        <button class="btn btn-primary add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    if (searchInput && categorySelect) {
        searchInput.addEventListener('input', filter);
        categorySelect.addEventListener('change', filter);
    }
}

// Render Product Detail
function showProductDetail(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    currentProduct = product;
    const detailContainer = document.getElementById('product-detail-content');

    detailContainer.innerHTML = `
        <div>
            <img src="${product.image}" alt="${product.name}" class="product-detail-img">
        </div>
        <div>
            <span class="product-card-category">${product.category}</span>
            <h1 style="margin-bottom: 0.5rem;">${product.name}</h1>
            <p style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">$${product.price.toFixed(2)}</p>
            <p style="margin-bottom: 1.5rem; color: var(--text-muted);">${product.description}</p>
            
            <div style="margin-bottom: 1.5rem;">
                <label for="detail-quantity" style="font-weight: 600; display: block; margin-bottom: 0.5rem;">Quantity:</label>
                <input type="number" id="detail-quantity" value="1" min="1" max="10" class="form-input" style="width: 100px;">
            </div>

            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary" id="detail-add-to-cart-btn">Add to Cart</button>
                <button class="btn btn-secondary" id="detail-buy-now-btn">Buy Now</button>
            </div>
        </div>
    `;

    navigateTo('product-detail');
    trackViewItem(product);
}

// Cart Rendering
function updateCartUI() {
    const cartCountEl = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalItems;

    const cartContainer = document.getElementById('cart-container');
    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.innerHTML = `<p>Your cart is currently empty. <a href="#" data-nav="shop">Browse Shop</a></p>`;
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let html = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
    `;

    cart.forEach(item => {
        html += `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" class="cart-qty-input form-input" data-id="${item.id}" style="width: 70px;">
                </td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger remove-cart-btn" data-id="${item.id}">Remove</button>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
        <div class="cart-summary">
            <h3>Subtotal: $${subtotal.toFixed(2)}</h3>
            <br>
            <button class="btn btn-primary" id="go-to-checkout-btn">Proceed to Checkout</button>
        </div>
    `;

    cartContainer.innerHTML = html;
}

// Cart Operations
function addToCart(productId, quantity = 1) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    updateCartUI();
    trackAddToCart(product, quantity);
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        updateCartUI();
        trackRemoveFromCart(removedItem);
    }
}

// TRACKING FUNCTIONS (GA4 Standard E-Commerce Events)

function trackViewItemList() {
    pushToDataLayer('view_item_list', {
        item_list_id: "all_products",
        item_list_name: "Catalog Products",
        items: PRODUCTS.map((p, index) => ({
            item_id: p.id,
            item_name: p.name,
            item_category: p.category,
            price: p.price,
            index: index + 1
        }))
    });
}

function trackViewItem(product) {
    pushToDataLayer('view_item', {
        currency: "USD",
        value: product.price,
        items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
            quantity: 1
        }]
    });
}

function trackAddToCart(product, quantity) {
    pushToDataLayer('add_to_cart', {
        currency: "USD",
        value: product.price * quantity,
        items: [{
            item_id: product.id,
            item_name: product.name,
            item_category: product.category,
            price: product.price,
            quantity: quantity
        }]
    });
}

function trackRemoveFromCart(item) {
    pushToDataLayer('remove_from_cart', {
        currency: "USD",
        value: item.price * item.quantity,
        items: [{
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity
        }]
    });
}

function trackViewCart() {
    const value = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    pushToDataLayer('view_cart', {
        currency: "USD",
        value: value,
        items: cart.map(item => ({
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity
        }))
    });
}

function trackBeginCheckout() {
    const value = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    pushToDataLayer('begin_checkout', {
        currency: "USD",
        value: value,
        items: cart.map(item => ({
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity
        }))
    });
}

function trackPurchase(transactionId, userDetails) {
    const value = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    pushToDataLayer('purchase', {
        transaction_id: transactionId,
        value: value,
        tax: 0.00,
        shipping: 0.00,
        currency: "USD",
        items: cart.map(item => ({
            item_id: item.id,
            item_name: item.name,
            item_category: item.category,
            price: item.price,
            quantity: item.quantity
        }))
    }, {
        customer_email: userDetails.email
    });
}

// Global Event Delegation & Setup
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupFilters();

    // Navigation Delegation
    document.addEventListener('click', (e) => {
        const navTarget = e.target.closest('[data-nav]');
        if (navTarget) {
            e.preventDefault();
            const view = navTarget.getAttribute('data-nav');
            navigateTo(view);
        }

        // View Product
        if (e.target.classList.contains('view-product-btn')) {
            const id = e.target.getAttribute('data-id');
            showProductDetail(id);
        }

        // Add to Cart from Card
        if (e.target.classList.contains('add-to-cart-btn')) {
            const id = e.target.getAttribute('data-id');
            addToCart(id, 1);
        }

        // Remove from Cart
        if (e.target.classList.contains('remove-cart-btn')) {
            const id = e.target.getAttribute('data-id');
            removeFromCart(id);
        }

        // Detail Page Actions
        if (e.target.id === 'detail-add-to-cart-btn') {
            const qty = parseInt(document.getElementById('detail-quantity').value) || 1;
            addToCart(currentProduct.id, qty);
        }

        if (e.target.id === 'detail-buy-now-btn') {
            const qty = parseInt(document.getElementById('detail-quantity').value) || 1;
            addToCart(currentProduct.id, qty);
            navigateTo('checkout');
        }

        if (e.target.id === 'go-to-checkout-btn') {
            navigateTo('checkout');
        }

        // Click Tracking for Contact links
        if (e.target.id === 'whatsapp-link') {
            pushToDataLayer('whatsapp_click', null, { click_type: 'whatsapp' });
        }
        if (e.target.id === 'phone-link') {
            pushToDataLayer('phone_click', null, { click_type: 'phone' });
        }
        if (e.target.id === 'email-link') {
            pushToDataLayer('email_click', null, { click_type: 'email' });
        }
    });

    // Form Submissions Tracking
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                alert('Cart is empty!');
                return;
            }

            const transactionId = "DEMO-ORD-" + Math.floor(100000 + Math.random() * 900000);
            const userDetails = {
                name: document.getElementById('checkout-name').value,
                email: document.getElementById('checkout-email').value
            };

            trackPurchase(transactionId, userDetails);

            // Render Success View
            const successContent = document.getElementById('order-success-content');
            successContent.innerHTML = `
                <h1>Thank You for Your Order!</h1>
                <p style="margin: 1rem 0; font-size: 1.1rem;">Order Reference: <strong>${transactionId}</strong></p>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">A confirmation email has been dispatched to ${userDetails.email}.</p>
                <button class="btn btn-primary" data-nav="shop">Continue Shopping</button>
            `;

            cart = [];
            updateCartUI();
            navigateTo('order-success');
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            pushToDataLayer('contact_form_submit', null, {
                form_id: 'contact_form',
                contact_name: document.getElementById('contact-name').value
            });
            alert('Thank you for contacting us! Message sent successfully.');
            contactForm.reset();
        });
    }

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            pushToDataLayer('newsletter_signup', null, {
                form_id: 'newsletter_form'
            });
            alert('Thank you for subscribing!');
            newsletterForm.reset();
        });
    }
});
