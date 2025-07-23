document.addEventListener('DOMContentLoaded', function() {
            // Initialize cart
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Navigation functionality
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const pageId = this.getAttribute('data-page');
                    showPage(pageId);
                });
            });
            
            // Hamburger menu toggle
            document.getElementById('hamburger').addEventListener('click', function() {
                document.getElementById('navbar').classList.toggle('active');
            });
            
            // Close mobile menu when clicking a link
            document.querySelectorAll('#navbar ul li a').forEach(link => {
                link.addEventListener('click', function() {
                    document.getElementById('navbar').classList.remove('active');
                });
            });
            
            // Add to cart functionality
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const name = this.getAttribute('data-name');
                    const price = parseInt(this.getAttribute('data-price'));
                    
                    // Check if item already in cart
                    const existingItem = cart.find(item => item.name === name);
                    if (existingItem) {
                        existingItem.quantity += 1;
                    } else {
                        cart.push({ name, price, quantity: 1 });
                    }
                    
                    // Save to localStorage
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCart();
                    
                    // Show feedback
                    alert(`${name} added to cart!`);
                });
            });
            
            // Clear cart button
            document.getElementById('clear-cart')?.addEventListener('click', function() {
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
            });
            
            // Order form submission
            document.getElementById('order-form')?.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (cart.length === 0) {
                    alert('Your cart is empty. Please add items before placing an order.');
                    return;
                }
                
                // In a real app, you would send this data to a server
                const order = {
                    name: document.getElementById('name').value,
                    phone: document.getElementById('phone').value,
                    address: document.getElementById('address').value,
                    items: cart,
                    total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                    date: new Date().toISOString()
                };
                
                console.log('Order placed:', order);
                
                // Show confirmation modal
                document.getElementById('order-modal').style.display = 'flex';
                
                // Clear cart after order
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCart();
                
                // Reset form
                this.reset();
            });
            
            // Modal close buttons
            document.getElementById('modal-close')?.addEventListener('click', function() {
                document.getElementById('order-modal').style.display = 'none';
            });
            
            document.getElementById('modal-ok')?.addEventListener('click', function() {
                document.getElementById('order-modal').style.display = 'none';
                showPage('home');
            });
            
            // Function to render cart
            function renderCart() {
                const cartItemsEl = document.getElementById('cart-items');
                const cartTotalEl = document.getElementById('cart-total');
                
                if (!cartItemsEl) return;
                
                if (cart.length === 0) {
                    cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty. Add items from the menu.</p>';
                    cartTotalEl.textContent = '0';
                    return;
                }
                
                cartItemsEl.innerHTML = '';
                let total = 0;
                
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    const itemEl = document.createElement('div');
                    itemEl.className = 'cart-item';
                    itemEl.innerHTML = `
                        <div class="cart-item-info">
                            <h3>${item.name}</h3>
                            <p>${item.quantity} × ₦${item.price}</p>
                        </div>
                        <div class="cart-item-price">₦${itemTotal}</div>
                        <div class="cart-item-remove" data-name="${item.name}">&times;</div>
                    `;
                    cartItemsEl.appendChild(itemEl);
                });
                
                // Add remove item functionality
                document.querySelectorAll('.cart-item-remove').forEach(button => {
                    button.addEventListener('click', function() {
                        const itemName = this.getAttribute('data-name');
                        cart = cart.filter(item => item.name !== itemName);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        renderCart();
                    });
                });
                
                cartTotalEl.textContent = total;
            }
            
            // Function to show/hide pages
            function showPage(pageId) {
                // Hide all pages
                document.querySelectorAll('.page').forEach(page => {
                    page.classList.remove('active');
                });
                
                // Show selected page
                document.getElementById(`${pageId}-page`).classList.add('active');
                
                // Update document title
                let pageTitle = 'Aroma Kitchen - Nigerian Cuisine';
                if (pageId === 'menu') pageTitle = 'Menu - Aroma Kitchen';
                else if (pageId === 'order') {
                    pageTitle = 'Order - Aroma Kitchen';
                    renderCart();
                }
                else if (pageId === 'contact') pageTitle = 'Contact - Aroma Kitchen';
                document.title = pageTitle;
                
                // Scroll to top
                window.scrollTo(0, 0);
            }
            
            // Initialize the page
            renderCart();
        });