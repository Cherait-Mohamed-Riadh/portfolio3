// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations - Only if AOS is available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('formMessage');
    const statusEl = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        console.log('Contact form found and event listener added');
    } else {
        console.warn('Contact form not found');
    }

    // Form validation and submission
    function handleFormSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();

        // Clear previous errors
        clearFormErrors();

        // Validate form
        if (!validateForm(name, email, subject, message)) {
            return;
        }

        // Loading state is now handled in sendToGoogleAppsScript function

        // Send to Google Apps Script
        sendToGoogleAppsScript(formData);
    }

    // Send form data to Google Apps Script
    async function sendToGoogleAppsScript(formData) {
        try {
            // Show loading state
            if (statusEl) { 
                statusEl.textContent = 'Sending...'; 
                statusEl.style.color = '#777'; 
            }

            console.log('Sending form data to Google Apps Script...');
            console.log('Form data:', Object.fromEntries(formData));

            const res = await fetch('https://script.google.com/macros/s/AKfycby4ueJrPGea-1Q6v1m2XTArhauPbZVMtBPi46YMQKNmYLmnKy3b6GJ5LrJtE7yPHiBN4w/exec', {
                method: 'POST',
                body: formData
            });

            console.log('Response status:', res.status);
            console.log('Response ok:', res.ok);

            let data = {};
            try { 
                data = await res.json(); 
                console.log('Response data:', data);
            } catch (_) {
                console.log('Response is not JSON');
            }

            if (res.ok && data && data.ok) {
                console.log('Form submitted successfully');
                if (statusEl) { 
                    statusEl.textContent = 'Submitted Successfully ✅'; 
                    statusEl.style.color = '#078b4f'; 
                }
                contactForm.reset();
                setTimeout(function(){ 
                    if (statusEl) statusEl.textContent = ''; 
                }, 5000);
            } else {
                console.log('Form submission failed');
                if (statusEl) { 
                    statusEl.textContent = 'An Error Occurred ❌'; 
                    statusEl.style.color = '#c62828'; 
                }
            }
        } catch (err) {
            console.error('Form submission error:', err);
            if (statusEl) { 
                statusEl.textContent = 'An Error Occurred ❌'; 
                statusEl.style.color = '#c62828'; 
            }
        }
    }

    // Form validation
    function validateForm(name, email, subject, message) {
        let isValid = true;

        // Name validation
        if (!name) {
            showFieldError('nameError', 'Name is required');
            isValid = false;
        } else if (name.length < 2) {
            showFieldError('nameError', 'Name must be at least 2 characters');
            isValid = false;
        }

        // Email validation
        if (!email) {
            showFieldError('emailError', 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('emailError', 'Please enter a valid email address');
            isValid = false;
        }

        // Subject validation
        if (!subject) {
            showFieldError('subjectError', 'Subject is required');
            isValid = false;
        } else if (subject.length < 5) {
            showFieldError('subjectError', 'Subject must be at least 5 characters');
            isValid = false;
        }

        // Message validation
        if (!message) {
            showFieldError('messageError', 'Message is required');
            isValid = false;
        } else if (message.length < 10) {
            showFieldError('messageError', 'Message must be at least 10 characters');
            isValid = false;
        }

        return isValid;
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show field error
    function showFieldError(errorId, message) {
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        } else {
            console.warn(`Error element with id '${errorId}' not found`);
        }
    }

    // Clear all form errors
    function clearFormErrors() {
        const errorElements = document.querySelectorAll('.form-error');
        if (errorElements.length > 0) {
            errorElements.forEach(element => {
                element.classList.remove('show');
                element.textContent = '';
            });
        }
    }

    // Show form message
    function showFormMessage(type, message) {
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type}`;
            formMessage.style.display = 'block';

            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    }

    // Animate statistics numbers - Only if elements exist
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        if (statNumbers.length === 0) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (isNaN(target)) return;
            
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current);
            }, 16);
        });
    }

    // Trigger number animation when stats come into view - Only if element exists
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }

    // Contact card hover effects - Only if element exists
    const contactCard = document.querySelector('.contact-card');
    if (contactCard) {
        contactCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        contactCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    }

    // Service cards hover effects - Only if elements exist
    const serviceCards = document.querySelectorAll('.service-card');
    if (serviceCards.length > 0) {
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Contact links functionality - Only if elements exist
    const contactLinks = document.querySelectorAll('.contact-link');
    if (contactLinks.length > 0) {
        contactLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    // Social media links - Only if elements exist
    const socialLinks = document.querySelectorAll('.social-link');
    if (socialLinks.length > 0) {
        socialLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Add click animation
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    // Form field focus effects - Only if elements exist
    const formFields = document.querySelectorAll('.form-group input, .form-group textarea');
    if (formFields.length > 0) {
        formFields.forEach(field => {
            field.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
                // إعادة تطبيق النصوص عند focus
                if (window.FormTextLock && window.FormTextLock.enforceFormTexts) {
                    setTimeout(window.FormTextLock.enforceFormTexts, 0);
                }
            });

            field.addEventListener('blur', function() {
                if (!this.value) {
                    this.parentElement.classList.remove('focused');
                }
            });

            // Auto-focus effect for filled fields
            if (field.value) {
                field.parentElement.classList.add('focused');
            }
        });
    }

    // Initialize floating particles effect - Only if element exists
    initParticlesEffect();
});

// Floating particles effect - Only if element exists
function initParticlesEffect() {
    const particlesContainer = document.getElementById('heroParticles');
    if (!particlesContainer) return;

    // Create floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            animation: float-particle ${3 + Math.random() * 4}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Add CSS for floating particles animation - Only if not already added
if (!document.querySelector('style[data-particles]')) {
    const style = document.createElement('style');
    style.setAttribute('data-particles', 'true');
    style.textContent = `
        @keyframes float-particle {
            0%, 100% {
                transform: translateY(0px) translateX(0px);
                opacity: 0.3;
            }
            50% {
                transform: translateY(-20px) translateX(10px);
                opacity: 0.8;
            }
        }
    `;
    document.head.appendChild(style);
}