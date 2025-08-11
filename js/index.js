// ===== INDEX.JS - HOMEPAGE SPECIFIC FUNCTIONALITY =====
(function() {
    'use strict';

    // Homepage specific functionality
    class HomepageFeatures {
        constructor() {
            this.init();
        }

        init() {
            this.setupHeroAnimations();
            this.setupProjectHoverEffects();
            this.setupLightbox();
            this.setupSkillBars();
            this.setupContactFormEnhancements();
            this.setupPerformanceOptimizations();
        }

        // Hero Section Animations
        setupHeroAnimations() {
            // Typing effect for hero title
            this.setupTypingEffect();
            
            // Parallax scrolling for hero elements
            this.setupHeroParallax();
            
            // Floating elements animation
            this.setupFloatingElements();
        }

        setupTypingEffect() {
            const titleElement = document.querySelector('.title-highlight');
            if (!titleElement) return;

            const text = titleElement.textContent;
            titleElement.textContent = '';
            titleElement.style.borderRight = '2px solid var(--primary-blue)';

            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    titleElement.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    // Remove cursor after typing is complete
                    setTimeout(() => {
                        titleElement.style.borderRight = 'none';
                    }, 1000);
                }
            };

            // Start typing effect when element is in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(typeWriter, 500);
                        observer.unobserve(entry.target);
                    }
                });
            });

            observer.observe(titleElement);
        }

        setupHeroParallax() {
            const heroElements = document.querySelectorAll('.hero-content, .hero-visual');
            
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                heroElements.forEach((element, index) => {
                    const speed = (index + 1) * 0.1;
                    element.style.transform = `translateY(${rate * speed}px)`;
                });
            });
        }

        setupFloatingElements() {
            const floatingCards = document.querySelectorAll('.floating-card');
            
            floatingCards.forEach((card, index) => {
                // Add random movement to each card
                setInterval(() => {
                    const randomX = (Math.random() - 0.5) * 20;
                    const randomY = (Math.random() - 0.5) * 20;
                    card.style.transform = `translate(${randomX}px, ${randomY}px)`;
                }, 3000 + (index * 1000));
            });
        }

        // Project Cards Enhanced Hover Effects
        setupProjectHoverEffects() {
            const projectCards = document.querySelectorAll('.project-card');
            
            projectCards.forEach(card => {
                const image = card.querySelector('.project-image img');
                const overlay = card.querySelector('.project-overlay');
                const content = card.querySelector('.project-content');
                
                card.addEventListener('mouseenter', () => {
                    // Enhanced image zoom
                    if (image) {
                        image.style.transform = 'scale(1.15)';
                    }
                    
                    // Smooth overlay fade in
                    if (overlay) {
                        overlay.style.opacity = '1';
                    }
                    
                    // Content slide up effect
                    if (content) {
                        content.style.transform = 'translateY(-10px)';
                    }
                });
                
                card.addEventListener('mouseleave', () => {
                    // Reset all effects
                    if (image) {
                        image.style.transform = 'scale(1)';
                    }
                    
                    if (overlay) {
                        overlay.style.opacity = '0';
                    }
                    
                    if (content) {
                        content.style.transform = 'translateY(0)';
                    }
                });
            });
        }

        // Skill Bars Animation
        setupSkillBars() {
            const skillBars = document.querySelectorAll('.skill-progress');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const progressBar = entry.target;
                        const width = progressBar.style.width;
                        
                        // Reset width to animate from 0
                        progressBar.style.width = '0%';
                        
                        // Animate to target width
                        setTimeout(() => {
                            progressBar.style.width = width;
                        }, 100);
                        
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            skillBars.forEach(bar => {
                observer.observe(bar);
            });
        }

        // Enhanced Contact Form
        setupContactFormEnhancements() {
            const form = document.getElementById('contactForm');
            if (!form) return;

            const inputs = form.querySelectorAll('input, textarea');
            
            inputs.forEach(input => {
                // Real-time validation
                input.addEventListener('input', () => {
                    this.validateField(input);
                });
                
                // Focus effects
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', () => {
                    input.parentElement.classList.remove('focused');
                    this.validateField(input);
                });
            });

            // Form submission with enhanced feedback
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleEnhancedFormSubmit(form);
            });
        }

        validateField(field) {
            const value = field.value.trim();
            const fieldType = field.type;
            const fieldName = field.name;
            let isValid = true;
            let errorMessage = '';

            // Remove existing error styling
            field.classList.remove('error');
            const existingError = field.parentElement.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }

            // Validation rules
            switch (fieldName) {
                case 'name':
                    if (value.length < 2) {
                        isValid = false;
                        errorMessage = 'Name must be at least 2 characters long';
                    }
                    break;
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        isValid = false;
                        errorMessage = 'Please enter a valid email address';
                    }
                    break;
                case 'subject':
                    if (value.length < 5) {
                        isValid = false;
                        errorMessage = 'Subject must be at least 5 characters long';
                    }
                    break;
                case 'message':
                    if (value.length < 10) {
                        isValid = false;
                        errorMessage = 'Message must be at least 10 characters long';
                    }
                    break;
            }

            // Apply validation result
            if (!isValid) {
                field.classList.add('error');
                const errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                errorElement.textContent = errorMessage;
                field.parentElement.appendChild(errorElement);
            }

            return isValid;
        }

        handleEnhancedFormSubmit(form) {
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;

            // Validate all fields
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                this.showNotification('Please fix the errors in the form', 'error');
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Prepare form data
            const formData = new FormData(form);
            
            // Remove honeypot field from validation (it's hidden)
            formData.delete('website');
            
            // Convert to plain object for JSON submission
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Send to Google Apps Script backend
            this.sendToBackend(formObject, submitBtn, originalText, form);
        }

        async sendToBackend(data, submitBtn, originalText, form) {
            try {
                // Replace this URL with your actual Google Apps Script web app URL
                const BACKEND_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
                
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    // Don't set Content-Type to avoid preflight request
                });

                const result = await response.json();

                if (result.ok) {
                    // Success - reset form and show success message
                    form.reset();
                    this.showNotification('Thank you! Your message has been sent successfully.', 'success');
                } else {
                    // Error from backend
                    this.showNotification(result.error || 'Failed to send message. Please try again.', 'error');
                }
            } catch (error) {
                console.error('Error sending form:', error);
                this.showNotification('Network error. Please check your connection and try again.', 'error');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            // Add styles if not already present
            if (!document.querySelector('#notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .notification {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: var(--bg-primary);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius-lg);
                        padding: var(--space-lg);
                        box-shadow: var(--shadow-lg);
                        z-index: 9999;
                        transform: translateX(100%);
                        transition: transform var(--transition-normal);
                        max-width: 400px;
                    }
                    .notification.show { transform: translateX(0); }
                    .notification-content {
                        display: flex;
                        align-items: center;
                        gap: var(--space-sm);
                    }
                    .notification-success { border-left: 4px solid var(--success-green); }
                    .notification-success i { color: var(--success-green); }
                    .notification-error { border-left: 4px solid var(--error-red); }
                    .notification-error i { color: var(--error-red); }
                    .notification-info { border-left: 4px solid var(--primary-blue); }
                    .notification-info i { color: var(--primary-blue); }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => notification.classList.add('show'), 100);
            
            // Hide after 5 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }

        // Performance Optimizations
        setupPerformanceOptimizations() {
            // Lazy loading for images
            this.setupLazyLoading();
            
            // Smooth scrolling optimization
            this.setupSmoothScrolling();
            
            // Intersection Observer for animations
            this.setupIntersectionObserver();
        }

        setupLazyLoading() {
            const images = document.querySelectorAll('img[loading="lazy"]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src || img.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                images.forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }

        setupSmoothScrolling() {
            // Optimize smooth scrolling performance
            let ticking = false;
            
            function updateScroll() {
                // Update scroll-based animations here
                ticking = false;
            }
            
            function requestTick() {
                if (!ticking) {
                    requestAnimationFrame(updateScroll);
                    ticking = true;
                }
            }
            
            window.addEventListener('scroll', requestTick);
        }

        setupIntersectionObserver() {
            // Optimize animations with Intersection Observer
            const animatedElements = document.querySelectorAll('[data-aos]');
            
            if ('IntersectionObserver' in window) {
                const animationObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('aos-animate');
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                });

                animatedElements.forEach(element => {
                    animationObserver.observe(element);
                });
            }
        }

        // Lightbox functionality
        setupLightbox() {
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightboxImage');
            const lightboxOverlay = document.getElementById('lightboxOverlay');
            const lightboxClose = document.getElementById('lightboxClose');
            const projectImages = document.querySelectorAll('.project-image-clickable');

            // Open lightbox when clicking on project images
            projectImages.forEach(image => {
                image.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Set the image source
                    lightboxImage.src = image.src;
                    lightboxImage.alt = image.alt;
                    
                    // Show lightbox
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Prevent background scrolling
                });
            });

            // Close lightbox functions
            const closeLightbox = () => {
                lightbox.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            };

            // Close on overlay click
            lightboxOverlay.addEventListener('click', closeLightbox);

            // Close on close button click
            lightboxClose.addEventListener('click', closeLightbox);

            // Close on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                    closeLightbox();
                }
            });

            // Prevent lightbox content clicks from closing the lightbox
            lightboxImage.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    // Initialize homepage features when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new HomepageFeatures();
        });
    } else {
        new HomepageFeatures();
    }

})();