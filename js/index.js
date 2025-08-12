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
/* =========================================
   MOBILE NAVBAR TOGGLE — add at end of index.js
========================================= */
(function () {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const navMenu   = document.getElementById('navMenu');
    const body      = document.body;
  
    if (!toggleBtn || !navMenu) return;
  
    // إمكانية الوصول
    toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
    toggleBtn.setAttribute('aria-controls', 'navMenu');
    toggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.setAttribute('role', 'navigation');
  
    const openMenu = () => {
      toggleBtn.classList.add('active');
      navMenu.classList.add('open');
      body.classList.add('no-scroll');
      toggleBtn.setAttribute('aria-expanded', 'true');
    };
  
    const closeMenu = () => {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('open');
      body.classList.remove('no-scroll');
      toggleBtn.setAttribute('aria-expanded', 'false');
    };
  
    const toggleMenu = () => {
      if (navMenu.classList.contains('open')) closeMenu();
      else openMenu();
    };
  
    // ضغط على زر المنيو
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  
    // إغلاق عند الضغط على أي رابط داخل القائمة
    navMenu.addEventListener('click', (e) => {
      const link = e.target.closest('.nav-link, .language-option');
      if (link) closeMenu();
    });
  
    // إغلاق عند الضغط خارج القائمة
    document.addEventListener('click', (e) => {
      const insideMenu  = e.target.closest('#navMenu');
      const isToggleBtn = e.target.closest('#mobileMenuToggle');
      if (!insideMenu && !isToggleBtn && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  
    // إغلاق بزر Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  
    // إغلاق تلقائي لو كبر العرض من 768px وطالع
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        closeMenu();
      }
    });
  })();
/* =========================================
   NAVBAR MOBILE — Overlay & Toggle polish
   أضِفه في آخر index.js
========================================= */
(function () {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const navMenu   = document.getElementById('navMenu');
    const body      = document.body;
  
    if (!toggleBtn || !navMenu) return;
  
    // أنشئ Overlay مرة واحدة
    let overlay = document.getElementById('navOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'navOverlay';
      document.body.appendChild(overlay);
    }
  
    const openMenu = () => {
      toggleBtn.classList.add('active');
      navMenu.classList.add('open');
      overlay.classList.add('open');
      body.classList.add('no-scroll');
      toggleBtn.setAttribute('aria-expanded', 'true');
    };
  
    const closeMenu = () => {
      toggleBtn.classList.remove('active');
      navMenu.classList.remove('open');
      overlay.classList.remove('open');
      body.classList.remove('no-scroll');
      toggleBtn.setAttribute('aria-expanded', 'false');
    };
  
    const toggleMenu = () => navMenu.classList.contains('open') ? closeMenu() : openMenu();
  
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  
    // إغلاق عند الضغط على الـOverlay أو رابط داخل القائمة
    overlay.addEventListener('click', closeMenu);
    navMenu.addEventListener('click', (e) => {
      const link = e.target.closest('.nav-link, .language-option');
      if (link) closeMenu();
    });
  
    // إغلاق بـ ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) closeMenu();
    });
  
    // عند تكبير الشاشة، أغلق القائمة
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) closeMenu();
    });
  
    // معالجة نادرة: لو عنصر ما حاول يسبب عرض > 100vw
    window.addEventListener('load', () => {
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
    });
  })();
/* =========================================
   Mobile navbar inline mode (same desktop style)
   ضع هذا في آخر index.js
========================================= */
(function () {
    const navMenu = document.getElementById('navMenu');
    const toggle  = document.getElementById('mobileMenuToggle');
    let overlay   = document.getElementById('navOverlay');
  
    if (!navMenu) return;
  
    const applyInlineNavbar = () => {
      if (window.innerWidth <= 768) {
        // إلغاء وضع الدرج
        navMenu.classList.add('inline-nav');
        navMenu.classList.remove('open');
  
        // أخفِ زر المنيو والـOverlay
        if (toggle) {
          toggle.classList.remove('active');
          toggle.style.display = 'none';
        }
        if (overlay) {
          overlay.classList.remove('open');
          overlay.style.display = 'none';
        }
        document.body.classList.remove('no-scroll');
      } else {
        // عودة السلوك العادي على الديسكتوب
        navMenu.classList.remove('inline-nav');
        if (toggle) toggle.style.display = '';
        if (overlay) overlay.style.display = '';
      }
    };
  
    window.addEventListener('load', applyInlineNavbar);
    window.addEventListener('resize', applyInlineNavbar);
  })();
/* ================================
   MOBILE MENU BUTTON + SLIDE DRAWER
================================== */
(function(){
    const body = document.body;
    
    // إنشاء زر المنيو
    const menuBtn = document.createElement('div');
    menuBtn.className = 'mobile-menu-btn';
    menuBtn.innerHTML = '<span></span>';
    
    // تحديد مكان وضع الزر (داخل الشريط العلوي)
    const navbar = document.querySelector('.navbar, .nav-container');
    if (navbar) navbar.appendChild(menuBtn);
  
    // إنشاء الـ Drawer
    const drawer = document.createElement('div');
    drawer.className = 'mobile-drawer';
    drawer.innerHTML = `
      <a href="#home" class="nav-link"><i class="fas fa-home"></i> Home</a>
      <a href="#about" class="nav-link"><i class="fas fa-user"></i> About</a>
      <a href="#expertise" class="nav-link"><i class="fas fa-cogs"></i> Expertise</a>
      <a href="#projects" class="nav-link"><i class="fas fa-briefcase"></i> Projects</a>
      <a href="#blog" class="nav-link"><i class="fas fa-rss"></i> Blog</a>
      <a href="#contact" class="nav-link"><i class="fas fa-envelope"></i> Contact</a>
    `;
    document.body.appendChild(drawer);
  
    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    document.body.appendChild(overlay);
  
    // وظائف الفتح والإغلاق
    const openDrawer = () => {
      drawer.classList.add('open');
      overlay.classList.add('active');
      menuBtn.classList.add('active');
      body.style.overflow = 'hidden';
    };
    const closeDrawer = () => {
      drawer.classList.remove('open');
      overlay.classList.remove('active');
      menuBtn.classList.remove('active');
      body.style.overflow = '';
    };
  
    // أحداث
    menuBtn.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
    overlay.addEventListener('click', closeDrawer);
    drawer.addEventListener('click', e => {
      if (e.target.classList.contains('nav-link')) {
        closeDrawer();
      }
    });
  })();
/* =========================================
   Mobile menu toggle for #mobileMenuToggle
   ضعّه في آخر index.js
========================================= */
(function(){
    const btn = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');
    if (!btn || !menu) return;
  
    // اصنع overlay مرة واحدة
    let overlay = document.getElementById('navOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'navOverlay';
      document.body.appendChild(overlay);
    }
  
    const openMenu = () => {
      btn.classList.add('active');
      menu.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('no-scroll');
      btn.setAttribute('aria-expanded','true');
    };
    const closeMenu = () => {
      btn.classList.remove('active');
      menu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
      btn.setAttribute('aria-expanded','false');
    };
  
    btn.setAttribute('aria-label','Open menu');
    btn.setAttribute('aria-controls','navMenu');
    btn.setAttribute('aria-expanded','false');
  
    btn.addEventListener('click', (e)=> {
      e.stopPropagation();
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });
  
    overlay.addEventListener('click', closeMenu);
  
    // إغلاق عند الضغط على أي رابط داخل القائمة
    menu.addEventListener('click', (e)=>{
      const link = e.target.closest('.nav-link');
      if (link) closeMenu();
    });
  
    // إغلاق بـ ESC
    document.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  
    // إغلاق تلقائي لو تعدّى العرض 768px
    window.addEventListener('resize', ()=>{
      if (window.innerWidth > 768 && menu.classList.contains('open')) closeMenu();
    });
  })();
  (function(){
    const btn = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');
    if (!btn || !menu) return;
  
    let overlay = document.getElementById('navOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'navOverlay';
      document.body.appendChild(overlay);
    }
  
    const openMenu = () => {
      btn.classList.add('active');
      menu.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('no-scroll');
    };
    const closeMenu = () => {
      btn.classList.remove('active');
      menu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
    };
  
    btn.addEventListener('click', () => {
      if (menu.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    overlay.addEventListener('click', closeMenu);
    menu.addEventListener('click', e => {
      if (e.target.classList.contains('nav-link')) closeMenu();
    });
  })();
/* Force center-modal behavior on mobile */
(function () {
    const btn  = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');
    if (!btn || !menu) return;
  
    // اصنع overlay إن لم يوجد
    let overlay = document.getElementById('navOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'navOverlay';
      document.body.appendChild(overlay);
    }
  
    const openMenu = () => {
      btn.classList.add('active');
      menu.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('no-scroll');
    };
    const closeMenu = () => {
      btn.classList.remove('active');
      menu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
    };
  
    // تأكد من إزالة أي كلاس سابق قد يغيّر السلوك
    const ensureModalMode = () => {
      if (window.innerWidth <= 768) {
        menu.classList.remove('inline-nav'); // إن وُجد من قبل
      }
    };
    window.addEventListener('load', ensureModalMode);
    window.addEventListener('resize', ensureModalMode);
  
    btn.addEventListener('click', () => menu.classList.contains('open') ? closeMenu() : openMenu());
    overlay.addEventListener('click', closeMenu);
    menu.addEventListener('click', (e) => {
      if (e.target.closest('.nav-link')) closeMenu();
    });
  
    // إغلاق بـ ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  })();
/* ========= VIDEO MODAL (YouTube/Vimeo/MP4) ========= */
(function () {
    const BODY = document.body;
  
    // اصنع المودال مرّة واحدة لو غير موجود
    let videoModal = document.getElementById('videoModal');
    if (!videoModal) {
      videoModal = document.createElement('div');
      videoModal.id = 'videoModal';
      videoModal.className = 'video-modal';
      videoModal.innerHTML = `
        <div class="video-overlay" id="videoOverlay"></div>
        <div class="video-content">
          <button class="video-close" id="videoClose" aria-label="Close video">
            <i class="fas fa-times"></i>
          </button>
          <!-- سيتم إدراج iframe أو video هنا -->
        </div>
      `;
      document.body.appendChild(videoModal);
    }
  
    const overlay = videoModal.querySelector('#videoOverlay');
    const closeBtn = videoModal.querySelector('#videoClose');
    const content  = videoModal.querySelector('.video-content');
  
    function toYouTubeEmbed(url) {
      // يدعم روابط watch?v= و youtu.be
      try {
        const u = new URL(url);
        if (u.hostname.includes('youtube.com')) {
          const id = u.searchParams.get('v');
          if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
        }
        if (u.hostname.includes('youtu.be')) {
          const id = u.pathname.replace('/', '');
          if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
        }
        return null;
      } catch { return null; }
    }
  
    function toVimeoEmbed(url) {
      try {
        const u = new URL(url);
        if (u.hostname.includes('vimeo.com')) {
          const id = u.pathname.split('/').filter(Boolean).pop();
          if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
        }
        return null;
      } catch { return null; }
    }
  
    function openVideo(src) {
      // نظّف أي محتوى سابق
      const old = content.querySelector('iframe, video');
      if (old) old.remove();
  
      let node;
      const isMp4 = /\.mp4$|\.webm$|\.ogg$/i.test(src);
      const yt = toYouTubeEmbed(src);
      const vm = toVimeoEmbed(src);
  
      if (isMp4) {
        node = document.createElement('video');
        node.src = src;
        node.controls = true;
        node.autoplay = true;
        node.playsInline = true;
      } else if (yt || vm) {
        node = document.createElement('iframe');
        node.allow =
          'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        node.allowFullscreen = true;
        node.src = yt || vm;
      } else {
        // fallback: افتح كرابط عادي
        window.open(src, '_blank');
        return;
      }
  
      content.appendChild(node);
      videoModal.classList.add('active');
      BODY.style.overflow = 'hidden';
    }
  
    function closeVideo() {
      videoModal.classList.remove('active');
      BODY.style.overflow = '';
      // أوقف التشغيل بإزالة العنصر
      const el = content.querySelector('iframe, video');
      if (el) el.remove();
    }
  
    // اربط كل الأزرار التي تشغّل الفيديو
    function bindVideoTriggers() {
      document.querySelectorAll('.video-trigger[data-video]').forEach(btn => {
        if (btn.__videoBound) return;
        btn.__videoBound = true;
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const src = btn.getAttribute('data-video');
          if (src) openVideo(src);
        });
      });
    }
  
    // إغلاق بالأوفرلاي وبالزر و بـ ESC
    overlay.addEventListener('click', closeVideo);
    closeBtn.addEventListener('click', closeVideo);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('active')) closeVideo();
    });
  
    // اربط عند التحميل وبعد تغيير DOM المحتمل
    window.addEventListener('load', bindVideoTriggers);
    const mo = new MutationObserver(bindVideoTriggers);
    mo.observe(document.body, { childList: true, subtree: true });
  })();
/* ===== Universal VIDEO MODAL (delegated) ===== */
(function () {
    const BODY = document.body;
  
    // أنشئ المودال مرة واحدة
    function ensureVideoModal() {
      let modal = document.getElementById('videoModal');
      if (modal) return modal;
  
      modal = document.createElement('div');
      modal.id = 'videoModal';
      modal.innerHTML = `
        <div class="video-overlay"></div>
        <div class="video-content">
          <button class="video-close" aria-label="Close video"><i class="fas fa-times"></i></button>
        </div>
      `;
      document.body.appendChild(modal);
      return modal;
    }
  
    function toYouTubeEmbed(url) {
      try {
        const u = new URL(url);
        if (u.hostname.includes('youtube.com')) {
          const id = u.searchParams.get('v');
          if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
        }
        if (u.hostname.includes('youtu.be')) {
          const id = u.pathname.replace('/', '');
          if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
        }
      } catch {}
      return null;
    }
  
    function toVimeoEmbed(url) {
      try {
        const u = new URL(url);
        if (u.hostname.includes('vimeo.com')) {
          const id = u.pathname.split('/').filter(Boolean).pop();
          if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
        }
      } catch {}
      return null;
    }
  
    function openVideo(src) {
      const modal = ensureVideoModal();
      const content = modal.querySelector('.video-content');
  
      // نظّف السابق
      const old = content.querySelector('iframe, video');
      if (old) old.remove();
  
      let node;
      const isFile = /\.(mp4|webm|ogg)$/i.test(src);
      const yt = toYouTubeEmbed(src);
      const vm = toVimeoEmbed(src);
  
      if (isFile) {
        node = document.createElement('video');
        node.src = src;
        node.controls = true;
        node.autoplay = true;
        node.playsInline = true;
      } else if (yt || vm) {
        node = document.createElement('iframe');
        node.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        node.allowFullscreen = true;
        node.src = yt || vm;
      } else {
        console.warn('Unrecognized video URL:', src);
        return;
      }
  
      content.appendChild(node);
      modal.classList.add('active');
      BODY.style.overflow = 'hidden';
  
      // أزرار الإغلاق
      const close = () => {
        modal.classList.remove('active');
        BODY.style.overflow = '';
        const el = content.querySelector('iframe, video');
        if (el) el.remove();
      };
      modal.querySelector('.video-overlay').onclick = close;
      modal.querySelector('.video-close').onclick = close;
      document.onkeydown = (e) => { if (e.key === 'Escape') close(); };
    }
  
    // تفويض: أي عنصر عليه .video-trigger و data-video
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.video-trigger[data-video]');
      if (!btn) return;
      e.preventDefault();
      const src = btn.getAttribute('data-video');
      if (src) openVideo(src);
    });
  
    // ضمان أعلى z-index لو كان عندك overlays أخرى
    window.addEventListener('load', () => {
      const modal = ensureVideoModal();
      modal.style.zIndex = '99999';
    });
  })();
/* ===== Mobile center menu modal toggle ===== */
(function(){
    const btn  = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');
    if (!btn || !menu) return;
  
    // اصنع الـOverlay لو غير موجود
    let overlay = document.getElementById('navOverlay');
    if (!overlay){
      overlay = document.createElement('div');
      overlay.id = 'navOverlay';
      document.body.appendChild(overlay);
    }
  
    const openMenu = () => {
      btn.classList.add('active');
      menu.classList.add('open');
      overlay.classList.add('open');
      document.body.classList.add('no-scroll');
      btn.setAttribute('aria-expanded','true');
    };
    const closeMenu = () => {
      btn.classList.remove('active');
      menu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
      btn.setAttribute('aria-expanded','false');
    };
  
    btn.setAttribute('aria-controls','navMenu');
    btn.setAttribute('aria-label','Open menu');
    btn.setAttribute('aria-expanded','false');
  
    btn.addEventListener('click', (e)=>{
      e.stopPropagation();
      menu.classList.contains('open') ? closeMenu() : openMenu();
    });
    overlay.addEventListener('click', closeMenu);
  
    // إغلاق عند اختيار عنصر أو الضغط على ESC
    menu.addEventListener('click', (e)=>{
      if (e.target.closest('.nav-link')) closeMenu();
    });
    document.addEventListener('keydown', (e)=>{
      if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
    });
  
    // ضمان إلغاء أي سلوك قديم (drawer/inline) عند الموبايل
    const enforceModal = () => {
      if (window.innerWidth <= 768) menu.classList.remove('inline-nav');
    };
    window.addEventListener('load', enforceModal);
    window.addEventListener('resize', enforceModal);
  })();
                    