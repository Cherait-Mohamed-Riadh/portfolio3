/**
 * CLEAN INDEX.JS - RESPONSIVE NAVIGATION READY
 * 
 * This file contains all the original functionality except for the conflicting
 * mobile navigation code, which is now handled by responsive-nav.js
 */

(function() {
    'use strict';

    // ===== HOMEPAGE FEATURES CLASS =====
    class HomepageFeatures {
        constructor() {
            this.init();
        }

        init() {
            this.setupScrollEffects();
            this.setupAnimations();
            this.setupInteractions();
            this.setupPerformance();
        }

        // ===== SCROLL EFFECTS =====
        setupScrollEffects() {
            // Smooth scroll for navigation links
            const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Parallax effect for hero section
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const heroSection = document.querySelector('.hero-section');
                
                if (heroSection) {
                    const rate = scrolled * -0.5;
                    heroSection.style.transform = `translateY(${rate}px)`;
                }
            });
        }

        // ===== ANIMATIONS =====
        setupAnimations() {
            // Intersection Observer for scroll animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, observerOptions);

            // Observe elements for animation
            const animateElements = document.querySelectorAll('.fade-in, .fade-in-up, .scale-in');
            animateElements.forEach(el => observer.observe(el));
        }

        // ===== INTERACTIONS =====
        setupInteractions() {
            // Enhanced button interactions
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('mouseenter', () => {
                    button.style.transform = 'translateY(-2px) scale(1.02)';
                });
                
                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'translateY(0) scale(1)';
                });
            });

            // Card hover effects
            const cards = document.querySelectorAll('.expertise-card, .project-card');
            cards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-8px)';
                    card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = '';
                });
            });
        }

        // ===== PERFORMANCE OPTIMIZATIONS =====
        setupPerformance() {
            // Lazy loading for images
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));

            // Debounced scroll handler
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                scrollTimeout = setTimeout(() => {
                    // Handle scroll-based effects
                    this.handleScrollEffects();
                }, 16); // ~60fps
            });
        }

        // ===== SCROLL EFFECTS HANDLER =====
        handleScrollEffects() {
            const scrolled = window.pageYOffset;
            const navbar = document.querySelector('.navbar');
            
            if (navbar) {
                if (scrolled > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            // Progress bar
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrolled / windowHeight) * 100;
                progressBar.style.width = `${progress}%`;
            }
        }

        // ===== UTILITY METHODS =====
        
        // Debounce function
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

        // Throttle function
        throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }

        // Safe DOM query
        safeQuerySelector(selector, parent = document) {
            try {
                return parent.querySelector(selector);
            } catch (error) {
                console.warn('Invalid selector:', selector, error);
                return null;
            }
        }
    }

    // ===== INITIALIZATION =====
    
    // Initialize homepage features when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new HomepageFeatures();
        });
    } else {
        new HomepageFeatures();
    }

})();

// ===== RESPONSIVE NAVIGATION =====
// All mobile navigation functionality is now handled by responsive-nav.js
// This ensures clean separation between desktop and mobile modes
// Force-load lazy images on mobile (if using data-src)
(function () {
    function loadAllImages() {
      document.querySelectorAll('img[data-src]').forEach(img => {
        if (!img.getAttribute('src')) {
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
        }
      });
    }
    if (window.innerWidth <= 768) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllImages);
      } else {
        loadAllImages();
      }
      ['scroll','touchstart'].forEach(ev =>
        window.addEventListener(ev, loadAllImages, { once:true, passive:true })
      );
    }
  })();
  