/**
 * Blog JavaScript for Mohamed Riadh Portfolio
 * Enhanced functionality for blog page interactions
 */

class BlogManager {
    constructor() {
        this.currentCategory = 'all';
        this.blogCards = document.querySelectorAll('.blog-card');
        this.categoryButtons = document.querySelectorAll('.category-btn');
        this.newsletterForm = document.getElementById('newsletterForm');
        
        this.init();
    }

    init() {
        this.setupCategoryFiltering();
        this.setupNewsletterSubscription();
        this.setupBlogInteractions();
        this.setupSearchFunctionality();
        this.setupReadingProgress();
        this.setupShareFunctionality();
    }

    // Category filtering
    setupCategoryFiltering() {
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const category = button.dataset.category;
                this.filterByCategory(category);
                this.updateActiveButton(button);
            });
        });
    }

    filterByCategory(category) {
        this.currentCategory = category;
        
        this.blogCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                card.classList.add('visible');
                this.animateCard(card);
            } else {
                card.classList.add('hidden');
                card.classList.remove('visible');
            }
        });

        // Track filter usage
        this.trackEvent('blog_filter', {
            category: category,
            total_cards: this.blogCards.length,
            visible_cards: document.querySelectorAll('.blog-card.visible').length
        });
    }

    updateActiveButton(activeButton) {
        this.categoryButtons.forEach(button => {
            button.classList.remove('active');
        });
        activeButton.classList.add('active');
    }

    animateCard(card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100);
    }

    // Newsletter subscription
    setupNewsletterSubscription() {
        if (!this.newsletterForm) return;

        this.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSubscription();
        });
    }

    async handleNewsletterSubscription() {
        const emailInput = document.getElementById('newsletterEmail');
        const email = emailInput.value.trim();
        
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        const submitButton = this.newsletterForm.querySelector('.newsletter-btn');
        const originalText = submitButton.innerHTML;
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitButton.disabled = true;

        try {
            // Simulate API call
            await this.subscribeToNewsletter(email);
            
            this.showNotification('Successfully subscribed to newsletter!', 'success');
            emailInput.value = '';
            
            // Track subscription
            this.trackEvent('newsletter_subscription', {
                email: this.maskEmail(email)
            });
            
        } catch (error) {
            this.showNotification('Failed to subscribe. Please try again.', 'error');
            console.error('Newsletter subscription error:', error);
        } finally {
            // Restore button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    async subscribeToNewsletter(email) {
        // Simulate API call with delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    maskEmail(email) {
        const [local, domain] = email.split('@');
        const maskedLocal = local.charAt(0) + '*'.repeat(local.length - 2) + local.charAt(local.length - 1);
        return `${maskedLocal}@${domain}`;
    }

    // Blog interactions
    setupBlogInteractions() {
        this.blogCards.forEach(card => {
            // Track card views
            this.trackCardView(card);
            
            // Setup click tracking
            const readMoreBtn = card.querySelector('.read-more-btn');
            if (readMoreBtn) {
                readMoreBtn.addEventListener('click', (e) => {
                    this.trackEvent('blog_article_click', {
                        title: card.querySelector('.blog-title')?.textContent || 'Unknown',
                        category: card.dataset.category,
                        featured: card.classList.contains('featured')
                    });
                });
            }
        });
    }

    trackCardView(card) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.trackEvent('blog_card_view', {
                        title: card.querySelector('.blog-title')?.textContent || 'Unknown',
                        category: card.dataset.category,
                        featured: card.classList.contains('featured')
                    });
                    observer.unobserve(card);
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(card);
    }

    // Search functionality
    setupSearchFunctionality() {
        // Add search button to navigation
        const nav = document.querySelector('nav ul');
        if (nav) {
            const searchLi = document.createElement('li');
            searchLi.innerHTML = `
                <button class="search-toggle" aria-label="Search blog">
                    <i class="fas fa-search"></i>
                </button>
            `;
            nav.appendChild(searchLi);

            const searchToggle = searchLi.querySelector('.search-toggle');
            searchToggle.addEventListener('click', () => {
                this.openSearchModal();
            });
        }
    }

    openSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.innerHTML = `
            <div class="search-modal-content">
                <div class="search-header">
                    <h3>Search Articles</h3>
                    <button class="close-search">&times;</button>
                </div>
                <div class="search-input-container">
                    <input type="text" placeholder="Search for articles..." class="search-input">
                    <button class="search-btn">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div class="search-results"></div>
            </div>
        `;

        document.body.appendChild(modal);

        const searchInput = modal.querySelector('.search-input');
        const closeBtn = modal.querySelector('.close-search');
        const searchBtn = modal.querySelector('.search-btn');

        // Focus on input
        setTimeout(() => searchInput.focus(), 100);

        // Close modal
        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Search functionality
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                this.performBlogSearch(query, modal.querySelector('.search-results'));
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    performBlogSearch(query, resultsContainer) {
        const searchResults = Array.from(this.blogCards).filter(card => {
            const title = card.querySelector('.blog-title')?.textContent.toLowerCase() || '';
            const excerpt = card.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
            const tags = Array.from(card.querySelectorAll('.blog-tag')).map(tag => tag.textContent.toLowerCase());
            
            return title.includes(query.toLowerCase()) || 
                   excerpt.includes(query.toLowerCase()) || 
                   tags.some(tag => tag.includes(query.toLowerCase()));
        });

        this.displaySearchResults(searchResults, query, resultsContainer);
    }

    displaySearchResults(results, query, container) {
        container.innerHTML = '';

        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <p>No articles found for "${query}"</p>
                    <p>Try different keywords or browse all categories</p>
                </div>
            `;
            return;
        }

        const resultsHTML = results.map(card => {
            const title = card.querySelector('.blog-title')?.textContent || '';
            const excerpt = card.querySelector('.blog-excerpt')?.textContent || '';
            const category = card.querySelector('.blog-category')?.textContent || '';
            
            return `
                <div class="search-result-item">
                    <h4>${this.highlightText(title, query)}</h4>
                    <p>${this.highlightText(excerpt.substring(0, 150), query)}...</p>
                    <span class="result-category">${category}</span>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="search-results-header">
                <p>Found ${results.length} article(s) for "${query}"</p>
            </div>
            <div class="search-results-list">
                ${resultsHTML}
            </div>
        `;
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Reading progress
    setupReadingProgress() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track reading progress
                if (maxScroll % 25 === 0) {
                    this.trackEvent('blog_reading_progress', {
                        progress: maxScroll
                    });
                }
            }
        });
    }

    // Share functionality
    setupShareFunctionality() {
        this.blogCards.forEach(card => {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'share-btn';
            shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
            shareBtn.setAttribute('aria-label', 'Share article');
            
            shareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.shareArticle(card);
            });
            
            const cardContent = card.querySelector('.blog-card-content');
            if (cardContent) {
                cardContent.appendChild(shareBtn);
            }
        });
    }

    shareArticle(card) {
        const title = card.querySelector('.blog-title')?.textContent || 'Blog Article';
        const url = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url
            }).then(() => {
                this.trackEvent('blog_share', {
                    method: 'native',
                    title: title
                });
            }).catch(console.error);
        } else {
            // Fallback to copy link
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Link copied to clipboard!', 'success');
                this.trackEvent('blog_share', {
                    method: 'copy_link',
                    title: title
                });
            });
        }
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#27ae60';
                break;
            case 'error':
                notification.style.backgroundColor = '#e74c3c';
                break;
            case 'warning':
                notification.style.backgroundColor = '#f39c12';
                break;
            default:
                notification.style.backgroundColor = '#3498db';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Analytics tracking
    trackEvent(eventName, data = {}) {
        const event = {
            timestamp: Date.now(),
            event: eventName,
            data: data,
            page: 'blog'
        };

        // Send to analytics if available
        if (window.portfolioAnalytics) {
            window.portfolioAnalytics.trackEvent(eventName, data);
        }

        console.log('Blog Event:', event);
    }

    // Utility methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize blog manager
const blogManager = new BlogManager();

// Export for global access
if (typeof window !== 'undefined') {
    window.BlogManager = BlogManager;
    window.blogManager = blogManager;
} 