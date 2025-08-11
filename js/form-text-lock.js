/**
 * Form Text Lock Script
 * يضمن ثبات نصوص فورم التواصل مهما كانت التغييرات
 * Ensures contact form text remains constant regardless of translation scripts
 */

(function() {
    'use strict';

    // النصوص المطلوبة للفورم
    const FORM_TEXTS = {
        'contact-name': {
            label: 'Your Name',
            placeholder: 'Enter your name'
        },
        'contact-email': {
            label: 'Your Email',
            placeholder: 'Enter your email'
        },
        'contact-subject': {
            label: 'Subject',
            placeholder: 'Enter subject'
        },
        'contact-message': {
            label: 'Your Message',
            placeholder: 'Enter your message'
        }
    };

    // دالة إعادة كتابة النصوص
    function enforceFormTexts() {
        Object.keys(FORM_TEXTS).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const label = document.querySelector(`label[for="${fieldId}"]`);
            
            if (field) {
                // إعادة كتابة placeholder
                if (field.placeholder !== FORM_TEXTS[fieldId].placeholder) {
                    field.placeholder = FORM_TEXTS[fieldId].placeholder;
                }
            }
            
            if (label) {
                // إعادة كتابة label
                if (label.textContent !== FORM_TEXTS[fieldId].label) {
                    label.textContent = FORM_TEXTS[fieldId].label;
                }
            }
        });
    }

    // دالة مراقبة التغييرات في DOM
    function setupMutationObserver() {
        const observer = new MutationObserver(function(mutations) {
            let shouldReapply = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // فحص إذا تم إضافة أو إزالة عناصر
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.id && FORM_TEXTS[node.id]) {
                                shouldReapply = true;
                            }
                            if (node.querySelector) {
                                const formField = node.querySelector('[id^="contact-"]');
                                if (formField) shouldReapply = true;
                            }
                        }
                    });
                } else if (mutation.type === 'characterData') {
                    // فحص إذا تم تغيير النصوص
                    const parent = mutation.target.parentNode;
                    if (parent && parent.tagName === 'LABEL') {
                        const forAttr = parent.getAttribute('for');
                        if (forAttr && FORM_TEXTS[forAttr]) {
                            shouldReapply = true;
                        }
                    }
                } else if (mutation.type === 'attributes') {
                    // فحص إذا تم تغيير attributes
                    if (mutation.attributeName === 'placeholder' || mutation.attributeName === 'for') {
                        shouldReapply = true;
                    }
                }
            });
            
            if (shouldReapply) {
                // تأخير قليل لضمان اكتمال التغييرات
                setTimeout(enforceFormTexts, 10);
            }
        });

        // بدء المراقبة
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ['placeholder', 'for']
        });

        return observer;
    }

    // دالة التهيئة الرئيسية
    function init() {
        // تطبيق النصوص فوراً
        enforceFormTexts();
        
        // إعداد مراقب التغييرات
        const observer = setupMutationObserver();
        
        // إعادة تطبيق النصوص كل 100ms لمدة 5 ثوانٍ (للتأكد من عدم تغييرها)
        let attempts = 0;
        const maxAttempts = 50; // 5 ثوانٍ
        
        const interval = setInterval(() => {
            enforceFormTexts();
            attempts++;
            
            if (attempts >= maxAttempts) {
                clearInterval(interval);
            }
        }, 100);
        
        // إعادة تطبيق النصوص عند تغيير الصفحة
        window.addEventListener('beforeunload', () => {
            observer.disconnect();
        });
        
        // إعادة تطبيق النصوص عند focus على أي حقل
        document.addEventListener('focusin', (e) => {
            if (e.target.id && FORM_TEXTS[e.target.id]) {
                setTimeout(enforceFormTexts, 0);
            }
        });
    }

    // انتظار تحميل DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // إعادة تطبيق النصوص عند تحميل الصفحة بالكامل
    window.addEventListener('load', () => {
        setTimeout(enforceFormTexts, 100);
        setTimeout(enforceFormTexts, 500);
        setTimeout(enforceFormTexts, 1000);
    });

    // إعادة تطبيق النصوص عند تغيير اللغة (إذا كان هناك)
    if (window.PortfolioApp) {
        const originalSetLanguage = window.PortfolioApp.prototype.setLanguage;
        if (originalSetLanguage) {
            window.PortfolioApp.prototype.setLanguage = function(lang) {
                originalSetLanguage.call(this, lang);
                setTimeout(enforceFormTexts, 100);
            };
        }
    }

    // إعادة تطبيق النصوص عند تغيير الترجمة
    const originalApplyTranslations = window.PortfolioApp?.prototype?.applyTranslations;
    if (originalApplyTranslations) {
        window.PortfolioApp.prototype.applyTranslations = function(translations) {
            originalApplyTranslations.call(this, translations);
            setTimeout(enforceFormTexts, 100);
        };
    }

    // تصدير الدوال للاستخدام الخارجي
    window.FormTextLock = {
        enforceFormTexts,
        FORM_TEXTS
    };

})();
