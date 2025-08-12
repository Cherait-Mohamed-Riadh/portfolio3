/**
 * Blog JavaScript for Mohamed Riadh Portfolio
 * Handles search, filtering, and interactive features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog functionality
    initBlog();
});

function initBlog() {
    // Initialize search functionality
    initSearch();
    
    // Initialize category filtering
    initCategoryFiltering();
    
    // Initialize load more functionality
    initLoadMore();
    
    // Initialize newsletter form
    initNewsletterForm();
    
    // Add smooth scrolling for anchor links
    initSmoothScrolling();
}

/**
 * Search functionality
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!searchInput || !searchBtn) return;
    
    // Search on input change
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        performSearch(query);
    });
    
    // Search on button click
    searchBtn.addEventListener('click', function() {
        const query = searchInput.value.toLowerCase().trim();
        performSearch(query);
    });
    
    // Search on Enter key
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const query = this.value.toLowerCase().trim();
            performSearch(query);
        }
    });
}

function performSearch(query) {
    const articles = document.querySelectorAll('.featured-card, .article-card');
    
    if (!query) {
        // Show all articles if no query
        articles.forEach(article => {
            article.style.display = 'block';
            article.style.opacity = '1';
        });
        return;
    }
    
    articles.forEach(article => {
        const title = article.querySelector('.card-title, .article-title')?.textContent.toLowerCase() || '';
        const excerpt = article.querySelector('.card-excerpt, .article-excerpt')?.textContent.toLowerCase() || '';
        const category = article.querySelector('.category')?.textContent.toLowerCase() || '';
        
        const matches = title.includes(query) || excerpt.includes(query) || category.includes(query);
        
        if (matches) {
            article.style.display = 'block';
            article.style.opacity = '1';
            // Highlight matching text
            highlightText(article, query);
        } else {
            article.style.display = 'none';
        }
    });
    
    // Show search results count
    showSearchResults(query);
}

function highlightText(article, query) {
    const title = article.querySelector('.card-title, .article-title');
    const excerpt = article.querySelector('.card-excerpt, .article-excerpt');
    
    if (title) {
        title.innerHTML = title.textContent.replace(
            new RegExp(query, 'gi'),
            match => `<mark style="background: #fef3c7; padding: 0 2px; border-radius: 3px;">${match}</mark>`
        );
    }
    
    if (excerpt) {
        excerpt.innerHTML = excerpt.textContent.replace(
            new RegExp(query, 'gi'),
            match => `<mark style="background: #fef3c7; padding: 0 2px; border-radius: 3px;">${match}</mark>`
        );
    }
}

function showSearchResults(query) {
    const visibleArticles = document.querySelectorAll('.featured-card[style*="block"], .article-card[style*="block"]');
    const totalArticles = document.querySelectorAll('.featured-card, .article-card').length;
    
    // You can add a results counter here if needed
    console.log(`Found ${visibleArticles.length} results for "${query}" out of ${totalArticles} total articles`);
}

/**
 * Category filtering
 */
function initCategoryFiltering() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Filter articles
            filterArticlesByCategory(category);
        });
    });
}

function filterArticlesByCategory(category) {
    const articles = document.querySelectorAll('.featured-card, .article-card');
    
    articles.forEach(article => {
        const articleCategory = article.dataset.category;
        
        if (category === 'all' || articleCategory === category) {
            article.style.display = 'block';
            article.style.opacity = '1';
            article.style.transform = 'scale(1)';
        } else {
            article.style.display = 'none';
            article.style.opacity = '0';
            article.style.transform = 'scale(0.95)';
        }
    });
    
    // Animate visible articles
    animateVisibleArticles();
}

function animateVisibleArticles() {
    const visibleArticles = document.querySelectorAll('.featured-card[style*="block"], .article-card[style*="block"]');
    
    visibleArticles.forEach((article, index) => {
        setTimeout(() => {
            article.style.transition = 'all 0.3s ease';
            article.style.opacity = '1';
            article.style.transform = 'scale(1)';
        }, index * 100);
    });
}

/**
 * Load more functionality
 */
function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', function() {
        loadMoreArticles();
    });
}

function loadMoreArticles() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    // Show loading state
    loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    loadMoreBtn.disabled = true;
    
    // Simulate loading delay
    setTimeout(() => {
        // Add more articles (this would typically fetch from an API)
        addMoreArticles();
        
        // Reset button
        loadMoreBtn.innerHTML = '<span>Load More Articles</span><i class="fas fa-chevron-down"></i>';
        loadMoreBtn.disabled = false;
    }, 1000);
}

function addMoreArticles() {
    const articlesGrid = document.getElementById('articlesGrid');
    
    // No additional articles to add
    // Articles will only be added when specifically requested
    
    // Hide the load more button since there are no more articles
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }
}

function createArticleElement(article) {
    const articleDiv = document.createElement('article');
    articleDiv.className = 'article-card';
    articleDiv.dataset.category = article.category;
    articleDiv.style.opacity = '0';
    articleDiv.style.transform = 'translateY(20px)';
    articleDiv.style.transition = 'all 0.3s ease';
    
    articleDiv.innerHTML = `
        <div class="article-image">
            <img src="${article.image}" alt="${article.title}" loading="lazy">
        </div>
        <div class="article-content">
            <div class="article-meta">
                <span class="category">${getCategoryDisplayName(article.category)}</span>
                <span class="date">${article.date}</span>
            </div>
            <h3 class="article-title">${article.title}</h3>
            <p class="article-excerpt">${article.excerpt}</p>
            <div class="article-footer">
                <span class="read-time">${article.readTime}</span>
                <a href="#" class="read-more">Read More</a>
            </div>
        </div>
    `;
    
    return articleDiv;
}

function getCategoryDisplayName(category) {
    const categoryMap = {
        'cybersecurity': 'Cybersecurity',
        'web-development': 'Web Development',
        'security': 'Security',
        'tutorials': 'Tutorials'
    };
    
    return categoryMap[category] || category;
}

/**
 * Newsletter form
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleNewsletterSubmission();
    });
}

function handleNewsletterSubmission() {
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim();
    
    if (!email) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    const submitBtn = newsletterForm.querySelector('.subscribe-btn');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        // Success
        showNotification('Successfully subscribed to newsletter!', 'success');
        emailInput.value = '';
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Utility functions
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function initSmoothScrolling() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Performance optimizations
 */
function debounce(func, wait) {
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

// Debounce search input
const debouncedSearch = debounce(performSearch, 300);

// Add intersection observer for lazy loading
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading when DOM is ready
if ('IntersectionObserver' in window) {
    initLazyLoading();
} 