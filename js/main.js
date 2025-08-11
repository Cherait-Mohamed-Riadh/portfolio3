// ===== MAIN JAVASCRIPT - MODERN PORTFOLIO =====
(function() {
    'use strict';

    // Utility functions
    const utils = {
        // Debounce function for performance
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Safe DOM query selector
        safeQuerySelector: (selector, parent = document) => {
            try {
                return parent.querySelector(selector);
            } catch (error) {
                console.warn('Invalid selector:', selector, error);
                return null;
            }
        },

        // Safe addEventListener
        safeAddEventListener: (element, event, handler, options = {}) => {
            if (element && typeof element.addEventListener === 'function') {
                try {
                    element.addEventListener(event, handler, options);
                    return true;
                } catch (error) {
                    console.warn('Failed to add event listener:', error);
                    return false;
                }
            }
            return false;
        },

        // Check if element is in viewport
        isInViewport: (element) => {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Smooth scroll to element with faster, more responsive navigation
        smoothScrollTo: (element, duration = 600) => {
            const targetPosition = element.offsetTop - 80; // Reduced offset for faster feel
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;

            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = ease(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            }

            // Enhanced easing function for faster, more responsive feel
            function ease(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            requestAnimationFrame(animation);
        },

        // Quick scroll for immediate navigation
        quickScrollTo: (element) => {
            const targetPosition = element.offsetTop - 80;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Main application class
    class PortfolioApp {
        constructor() {
            this.currentTheme = 'light';
            this.currentLanguage = 'en';
            this.isLoading = true;
            this.isScrolling = false;
            this.lastScrollTop = 0;
            this.init();
        }

        init() {
            this.setupLoadingScreen();
            this.setupEventListeners();
            this.initializeTheme();
            this.initializeLanguage();
            this.setupScrollHandlers();
            this.setupCursorEffects();
            this.setupAnimations();
            this.setupParticles();
            this.setupStatsCounter();
            this.setupFormHandling();
            this.setupChatbot();
            this.setupNavigationHelp();
        }

        // Loading Screen
        setupLoadingScreen() {
            const loadingScreen = utils.safeQuerySelector('#loadingScreen');
            if (loadingScreen) {
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        this.isLoading = false;
                    }, 500);
                }, 2000);
            }
        }

        // Event Listeners
        setupEventListeners() {
            // Theme toggle
            const themeToggle = utils.safeQuerySelector('#themeToggle');
            if (themeToggle) {
                utils.safeAddEventListener(themeToggle, 'click', () => this.toggleTheme());
            }

            // Language selector
            const languageBtn = utils.safeQuerySelector('#languageBtn');
            const languageDropdown = utils.safeQuerySelector('#languageDropdown');
            
            if (languageBtn) {
                utils.safeAddEventListener(languageBtn, 'click', () => this.toggleLanguageDropdown());
            }

            // Language options
            const languageOptions = document.querySelectorAll('.language-option');
            languageOptions.forEach(option => {
                utils.safeAddEventListener(option, 'click', () => this.selectLanguage(option));
            });

            // Close dropdown when clicking outside
            utils.safeAddEventListener(document, 'click', (e) => {
                const dropdown = utils.safeQuerySelector('#languageDropdown');
                const btn = utils.safeQuerySelector('#languageBtn');
                
                if (dropdown && !dropdown.contains(e.target) && !btn?.contains(e.target)) {
                    this.closeLanguageDropdown();
                }
            });

            // Navigation links with enhanced fast scrolling
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                utils.safeAddEventListener(link, 'click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href').substring(1);
                    const targetElement = utils.safeQuerySelector(`#${targetId}`);
                    
                    if (targetElement) {
                        // Use faster scrolling for better user experience
                        utils.smoothScrollTo(targetElement, 500);
                        
                        // Add visual feedback
                        link.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            link.style.transform = 'scale(1)';
                        }, 150);
                    }
                    
                    // Update active nav link immediately
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Close mobile menu if open
                    const navMenu = utils.safeQuerySelector('#navMenu');
                    const mobileToggle = utils.safeQuerySelector('#mobileMenuToggle');
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        mobileToggle.classList.remove('active');
                    }
                });
            });

            // Mobile menu toggle
            const mobileMenuToggle = utils.safeQuerySelector('#mobileMenuToggle');
            if (mobileMenuToggle) {
                utils.safeAddEventListener(mobileMenuToggle, 'click', () => this.toggleMobileMenu());
            }

            // Scroll to top button
            const scrollToTopBtn = utils.safeQuerySelector('#scrollToTopBtn');
            if (scrollToTopBtn) {
                utils.safeAddEventListener(scrollToTopBtn, 'click', () => this.scrollToTop());
            }

            // Form submission
            const contactForm = utils.safeQuerySelector('#contactForm');
            if (contactForm) {
                utils.safeAddEventListener(contactForm, 'submit', (e) => this.handleFormSubmit(e));
            }

            // Keyboard navigation for faster access
            utils.safeAddEventListener(document, 'keydown', (e) => {
                // Only trigger when not typing in input fields
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                const navLinks = document.querySelectorAll('.nav-link');
                const sections = ['home', 'about', 'expertise', 'projects', 'contact'];
                
                switch(e.key) {
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                        const index = parseInt(e.key) - 1;
                        if (sections[index]) {
                            e.preventDefault();
                            const targetElement = utils.safeQuerySelector(`#${sections[index]}`);
                            if (targetElement) {
                                utils.smoothScrollTo(targetElement, 400);
                                // Update active nav link
                                navLinks.forEach(l => l.classList.remove('active'));
                                const activeLink = document.querySelector(`[href="#${sections[index]}"]`);
                                if (activeLink) activeLink.classList.add('active');
                            }
                        }
                        break;
                    case 'Home':
                        e.preventDefault();
                        utils.smoothScrollTo(document.querySelector('#home'), 400);
                        break;
                    case 'End':
                        e.preventDefault();
                        utils.smoothScrollTo(document.querySelector('#contact'), 400);
                        break;
                }
            });
        }

        // Theme Management
        initializeTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            this.setTheme(savedTheme);
        }

        setTheme(theme) {
            this.currentTheme = theme;
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            
            // Update theme toggle UI
            const themeToggle = utils.safeQuerySelector('#themeToggle');
            if (themeToggle) {
                themeToggle.setAttribute('data-theme', theme);
            }
        }

        toggleTheme() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        }

        // Language Management
        initializeLanguage() {
            const savedLanguage = localStorage.getItem('language') || 'en';
            this.setLanguage(savedLanguage);
        }

        setLanguage(lang) {
            this.currentLanguage = lang;
            localStorage.setItem('language', lang);
            this.updateLanguageUI(lang);
            this.loadTranslations(lang);
        }

        updateLanguageUI(lang) {
            const currentFlag = utils.safeQuerySelector('#currentFlag');
            const currentLang = utils.safeQuerySelector('#currentLang');
            
            if (currentFlag && currentLang) {
                const flagMap = {
                    'en': 'image/uk.png',
                    'ar': 'image/Algeria.png',
                    'fr': 'image/France.png'
                };
                
                const langMap = {
                    'en': 'English',
                    'ar': 'العربية',
                    'fr': 'Français'
                };
                
                currentFlag.src = flagMap[lang] || flagMap['en'];
                currentLang.textContent = langMap[lang] || langMap['en'];
            }
        }

        toggleLanguageDropdown() {
            const dropdown = utils.safeQuerySelector('#languageDropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        }

        closeLanguageDropdown() {
            const dropdown = utils.safeQuerySelector('#languageDropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }

        selectLanguage(optionElement) {
            const lang = optionElement.getAttribute('data-lang');
            this.setLanguage(lang);
            this.closeLanguageDropdown();
        }

        loadTranslations(lang) {
            const translations = this.getTranslations(lang);
            this.applyTranslations(translations);
        }

        getTranslations(lang) {
            const translations = {
                en: {
                                    // Navigation
                'nav.logo': 'MR',
                'nav.brand': 'Mohamed Riadh',
                'nav.home': 'Home',
                'nav.about': 'About',
                'nav.expertise': 'Expertise',
                'nav.projects': 'Projects',
                'nav.contact': 'Contact',
                'nav.language.english': 'English',
                'nav.language.arabic': 'العربية',
                'nav.language.french': 'Français',
                    
                    // Hero Section
                    'hero.badge': 'Cybersecurity & Financial Expert',
                    'hero.title.line1': 'Hello, I\'m',
                    'hero.title.line2': 'Mohamed Riadh',
                    'hero.title.line3': 'Building Secure Digital Futures',
                    'hero.description': 'Bridging the gap between digital security and financial markets. Specializing in enterprise security architecture, penetration testing, and algorithmic trading strategies with a focus on innovation and excellence.',
                    'hero.cta.work': 'View My Work',
                    'hero.cta.contact': 'Let\'s Launch Your Profitable Project in 7 Days.',
                    'hero.scroll': 'Scroll to explore',
                    
                    // Hero Social Links
                    'hero.social.linkedin': 'LinkedIn',
                    'hero.social.github': 'GitHub',
                    'hero.social.twitter': 'Twitter',
                    'hero.social.instagram': 'Instagram',
                    'hero.social.email': 'Email',
                    
                    // Floating Cards
                    'hero.floating.security': 'Security Expert',
                    'hero.floating.market': 'Market Analyst',
                    'hero.floating.developer': 'Developer',
                    
                    // About Section
                    'about.title': 'About Me',
                    'about.subtitle': 'Passionate about securing digital assets and optimizing financial strategies',
                    'about.intro.title': 'Dual Expertise in Security & Finance',
                    'about.intro.text': 'My name is Mohamed Riadh, and I bring a distinctive blend of cybersecurity expertise, web development skills, and financial market insight. My professional journey began with a strong dedication to securing digital ecosystems, which naturally evolved into a broader passion for identifying, mitigating, and managing risks across both technological and financial domains, while also building and optimizing web solutions that align with modern business needs.',
                    'about.experience.title': 'Professional Experience',
                    'about.experience.text': 'Over 6 years of experience leading cybersecurity initiatives, developing web applications, and contributing to the development of algorithmic trading strategies for financial institutions. Skilled in programming and building secure, high-performance web solutions tailored to business needs.',
                    'about.achievements.title': 'Achievements',
                    'about.achievements.text': 'We have secured dozens of enterprise systems by implementing robust security frameworks, building and deploying numerous professional websites and web applications, and developing algorithmic trading models that have consistently delivered positive returns and high predictive accuracy in real market conditions.',
                    'about.cta': 'Let\'s Work Together',
                    
                    // Expertise Section
                    'expertise.title': 'Areas of Expertise',
                    'expertise.subtitle': 'Comprehensive skills across cybersecurity and financial markets',
                    'expertise.cybersecurity.title': 'Cybersecurity',
                    'expertise.cybersecurity.description': 'Comprehensive security solutions including penetration testing, vulnerability assessment, and secure architecture design.',
                    'expertise.cybersecurity.skills': ['Penetration Testing', 'Vulnerability Assessment', 'Security Architecture', 'Incident Response', 'Compliance & GRC'],
                    'expertise.cybersecurity.level': 'Expert Level',
                    'expertise.financial.title': 'Financial Analysis',
                    'expertise.financial.description': 'Advanced market analysis and algorithmic trading strategies for forex, crypto, and traditional markets.',
                    'expertise.financial.skills': ['Technical Analysis', 'Algorithmic Trading', 'Risk Management', 'Portfolio Optimization', 'Market Research'],
                    'expertise.financial.level': 'Advanced Level',
                    'expertise.web.title': 'Web Development',
                    'expertise.web.description': 'Full-stack development with focus on secure, scalable applications and modern web technologies.',
                    'expertise.web.skills': ['React & Node.js', 'Python & JavaScript', 'Database Design', 'API Development', 'DevOps & CI/CD'],
                    'expertise.web.level': 'Proficient Level',
                    
                    // Projects Section
                    'projects.title': 'Featured Projects',
                    'projects.subtitle': 'Showcasing my best work across security, finance, and development',
                    'projects.web.category': 'Web Development',
                    'projects.web.title': 'Enterprise Security Portal',
                    'projects.web.description': 'A comprehensive security management platform with real-time threat monitoring, incident response, and compliance reporting capabilities.',
                    'projects.financial.category': 'Financial Analysis',
                    'projects.financial.title': 'Algorithmic Trading System',
                    'projects.financial.description': 'Advanced trading algorithms with machine learning integration for forex and cryptocurrency markets.',
                    'projects.security.category': 'Cybersecurity',
                    'projects.security.title': 'Penetration Testing Framework',
                    'projects.security.description': 'Automated security testing platform with comprehensive vulnerability scanning and reporting tools.',
                    'projects.cta': 'Launch Your Professional Website Today',
                    
                    // Contact Section
                    'contact.intro': 'Tell us your idea, and get a clear plan & price within 24 hours.',
                    'contact.title': 'Get In Touch',
                    'contact.subtitle': 'Let\'s bring your vision to life. Whether it\'s securing systems, developing high-impact websites, or crafting smart trading solutions, I\'m ready to make it happen — let\'s connect and get started.',
                    'contact.email': 'Email',
                    'contact.phone': 'Phone',
                    'contact.location': 'Location',
                    'contact.location.text': 'Algeria, Available Worldwide',
                    'contact.form.name': 'Your Name',
                    'contact.form.email': 'Your Email',
                    'contact.form.subject': 'Subject',
                    'contact.form.message': 'Your Message',
                    'contact.form.send': 'Send Request Now',
                    'contact.form.name.placeholder': 'Enter your name',
                    'contact.form.email.placeholder': 'Enter your email',
                    'contact.form.subject.placeholder': 'Enter subject',
                    'contact.form.message.placeholder': 'Enter your message',
                    
                    // Footer
                    'footer.tagline': 'Securing digital futures through innovation and expertise',
                    'footer.services.title': 'Services',
                    'footer.services.security': 'Security Consulting',
                    'footer.services.web': 'Web Development',
                    'footer.services.analysis': 'Market Analysis',
                    'footer.services.testing': 'Penetration Testing',
                    'footer.brand': 'Mohamed Riadh',
                    
                    // Start Website Section
                    'start-website.title': 'Ready to Launch Your Website?',
                    'start-website.subtitle': 'Let\'s turn your vision into a powerful online presence that drives results.',
                    'start-website.button': 'Get Your High-Impact Website Today',
                    
                    'footer.resources.title': 'Resources',
                    'footer.resources.blog': 'Blog',
                    'footer.resources.about': 'About',
                    'footer.resources.contact': 'Contact',
                    'footer.resources.portfolio': 'Portfolio',
                    'footer.resources.instagram': 'Instagram',
                    'footer.connect.title': 'Connect',
                    'footer.connect.linkedin': 'LinkedIn',
                    'footer.connect.github': 'GitHub',
                    'footer.connect.twitter': 'Twitter',
                    'footer.connect.instagram': 'Instagram',
                    'footer.copyright': '© 2025 Mohamed Riadh. All rights reserved.',
                    
                    // Chatbot
                    'chatbot.tooltip': 'Chat with AI Assistant',
                    
                    // Telegram
                    'telegram.button': 'Chat on Telegram',
                    'telegram.tooltip': 'Chat on Telegram',
                    'chatbot.title': 'AI Assistant',
                    'chatbot.placeholder': 'Type your message...',
                    'chatbot.send': 'Send',
                    'chatbot.close': 'Close',
                    
                    // Navigation Help
                    'nav.help.title': 'Quick Navigation',
                    'nav.help.sections': 'Press 1-5 to jump to sections',
                    'nav.help.navigation': 'Press Home / End for top/bottom',
                    
                    // Loading
                    'loading.text': 'Loading Portfolio...'
                },
                ar: {
                                    // Navigation
                'nav.logo': 'م ر',
                'nav.brand': 'محمد رياض',
                'nav.home': 'الرئيسية',
                'nav.about': 'حول',
                'nav.expertise': 'الخبرات',
                'nav.projects': 'المشاريع',
                'nav.contact': 'اتصل',
                'nav.language.english': 'English',
                'nav.language.arabic': 'العربية',
                'nav.language.french': 'Français',
                    
                    // Hero Section
                    'hero.badge': 'خبير الأمن السيبراني والمالي',
                    'hero.title.line1': 'مرحباً، أنا',
                    'hero.title.line2': 'محمد رياض',
                    'hero.title.line3': 'بناء المستقبل الرقمي الآمن',
                    'hero.description': 'جسر الفجوة بين الأمن السيبراني والأسواق المالية. متخصص في هندسة الأمان المؤسسي واختبار الاختراق واستراتيجيات التداول الخوارزمي مع التركيز على الابتكار والتميز.',
                    'hero.cta.work': 'شاهد أعمالي',
                    'hero.cta.contact': 'دعنا نطلق مشروعك المربح في 7 أيام.',
                    'hero.scroll': 'مرر للاستكشاف',
                    
                    // Hero Social Links
                    'hero.social.linkedin': 'لينكد إن',
                    'hero.social.github': 'جيت هب',
                    'hero.social.twitter': 'تويتر',
                    'hero.social.instagram': 'إنستغرام',
                    'hero.social.email': 'البريد الإلكتروني',
                    
                    // Floating Cards
                    'hero.floating.security': 'خبير الأمان',
                    'hero.floating.market': 'محلل الأسواق',
                    'hero.floating.developer': 'مطور',
                    
                    // About Section
                    'about.title': 'حول',
                    'about.subtitle': 'شغوف بتأمين الأصول الرقمية وتحسين الاستراتيجيات المالية',
                    'about.intro.title': 'خبرة مزدوجة في الأمان والمالية',
                    'about.intro.text': 'اسمي محمد رياض، وأجلب مزيجاً مميزاً من خبرة الأمن السيبراني ومهارات تطوير الويب ورؤية السوق المالية. بدأت رحلتي المهنية بتفانٍ قوي لتأمين النظم البيئية الرقمية، والذي تطور بشكل طبيعي إلى شغف أوسع لتحديد وتخفيف وإدارة المخاطر عبر المجالات التكنولوجية والمالية، مع بناء وتحسين حلول الويب التي تتوافق مع احتياجات الأعمال الحديثة.',
                    'about.experience.title': 'الخبرة المهنية',
                    'about.experience.text': 'أكثر من 6 سنوات من الخبرة في قيادة مبادرات الأمن السيبراني وتطوير تطبيقات الويب والمساهمة في تطوير استراتيجيات التداول الخوارزمي للمؤسسات المالية. ماهر في البرمجة وبناء حلول الويب الآمنة عالية الأداء المصممة لاحتياجات الأعمال.',
                    'about.achievements.title': 'الإنجازات',
                    'about.achievements.text': 'لقد قمنا بتأمين العشرات من الأنظمة المؤسسية من خلال تنفيذ أطر أمان قوية وبناء ونشر العديد من المواقع الإلكترونية والتطبيقات المهنية وتطوير نماذج التداول الخوارزمي التي حققت باستمرار عوائد إيجابية ودقة تنبؤية عالية في ظروف السوق الحقيقية.',
                    'about.cta': 'دعنا نعمل معاً',
                    
                    // Expertise Section
                    'expertise.title': 'مجالات الخبرة',
                    'expertise.subtitle': 'مهارات شاملة في الأمن السيبراني والأسواق المالية',
                    'expertise.cybersecurity.title': 'الأمن السيبراني',
                    'expertise.cybersecurity.description': 'حلول أمان شاملة تشمل اختبار الاختراق وتقييم الثغرات وتصميم الهندسة المعمارية الآمنة.',
                    'expertise.cybersecurity.skills': ['اختبار الاختراق', 'تقييم الثغرات', 'هندسة الأمان', 'الاستجابة للحوادث', 'الامتثال وإدارة المخاطر'],
                    'expertise.cybersecurity.level': 'مستوى الخبير',
                    'expertise.financial.title': 'التحليل المالي',
                    'expertise.financial.description': 'تحليل متقدم للسوق واستراتيجيات التداول الخوارزمي للفوركس والعملات المشفرة والأسواق التقليدية.',
                    'expertise.financial.skills': ['التحليل الفني', 'التداول الخوارزمي', 'إدارة المخاطر', 'تحسين المحفظة', 'بحث السوق'],
                    'expertise.financial.level': 'مستوى متقدم',
                    'expertise.web.title': 'تطوير الويب',
                    'expertise.web.description': 'تطوير شامل مع التركيز على التطبيقات الآمنة والقابلة للتوسع وتقنيات الويب الحديثة.',
                    'expertise.web.skills': ['React & Node.js', 'Python & JavaScript', 'تصميم قاعدة البيانات', 'تطوير API', 'DevOps & CI/CD'],
                    'expertise.web.level': 'مستوى متقن',
                    
                    // Projects Section
                    'projects.title': 'المشاريع المميزة',
                    'projects.subtitle': 'عرض أفضل أعمالي في الأمان والمالية والتطوير',
                    'projects.web.category': 'تطوير الويب',
                    'projects.web.title': 'بوابة الأمان المؤسسي',
                    'projects.web.description': 'منصة شاملة لإدارة الأمان مع مراقبة التهديدات في الوقت الفعلي والاستجابة للحوادث وإعداد تقارير الامتثال.',
                    'projects.financial.category': 'التحليل المالي',
                    'projects.financial.title': 'نظام التداول الخوارزمي',
                    'projects.financial.description': 'خوارزميات تداول متقدمة مع تكامل التعلم الآلي للفوركس والعملات المشفرة.',
                    'projects.security.category': 'الأمن السيبراني',
                    'projects.security.title': 'إطار اختبار الاختراق',
                    'projects.security.description': 'منصة اختبار أمان آلية مع أدوات فحص الثغرات وإعداد التقارير الشاملة.',
                    'projects.cta': 'أطلق موقعك المهني اليوم',
                    
                    // Contact Section
                    'contact.intro': 'أخبرنا بفكرتك، واحصل على خطة واضحة وسعر خلال 24 ساعة.',
                    'contact.title': 'تواصل معي',
                    'contact.subtitle': 'مستعد للتعاون في مشروعك القادم؟ دعنا نناقش كيف يمكنني المساعدة.',
                    'contact.email': 'البريد الإلكتروني',
                    'contact.phone': 'الهاتف',
                    'contact.location': 'الموقع',
                    'contact.location.text': 'الجزائر، متاح عالمياً',
                    'contact.form.name': 'اسمك',
                    'contact.form.email': 'بريدك الإلكتروني',
                    'contact.form.subject': 'الموضوع',
                    'contact.form.message': 'رسالتك',
                    'contact.form.send': 'إرسال الطلب الآن',
                    'contact.form.name.placeholder': 'أدخل اسمك',
                    'contact.form.email.placeholder': 'أدخل بريدك الإلكتروني',
                    'contact.form.subject.placeholder': 'أدخل الموضوع',
                    'contact.form.message.placeholder': 'أدخل رسالتك',
                    
                    // Footer
                    'footer.tagline': 'تأمين المستقبل الرقمي من خلال الابتكار والخبرة',
                    'footer.services.title': 'الخدمات',
                    'footer.services.security': 'استشارات الأمان',
                    'footer.services.web': 'تطوير الويب',
                    'footer.services.analysis': 'تحليل السوق',
                    'footer.services.testing': 'اختبار الاختراق',
                    'footer.brand': 'محمد رياض',
                    
                    // Start Website Section
                    'start-website.title': 'هل أنت مستعد لإطلاق موقعك الإلكتروني؟',
                    'start-website.subtitle': 'دعنا نحول رؤيتك إلى حضور قوي على الإنترنت يحقق النتائج.',
                    'start-website.button': 'ابدأ موقعك الإلكتروني اليوم',
                    
                    'footer.resources.title': 'الموارد',
                    'footer.resources.blog': 'المدونة',
                    'footer.resources.about': 'حول',
                    'footer.resources.contact': 'اتصل',
                    'footer.resources.portfolio': 'المحفظة',
                    'footer.resources.instagram': 'إنستغرام',
                    'footer.connect.title': 'تواصل',
                    'footer.connect.linkedin': 'لينكد إن',
                    'footer.connect.github': 'جيت هب',
                    'footer.connect.twitter': 'تويتر',
                    'footer.connect.instagram': 'إنستغرام',
                    'footer.copyright': '© 2025 محمد رياض. جميع الحقوق محفوظة.',
                    
                    // Chatbot
                    'chatbot.tooltip': 'دردشة مع المساعد الذكي',
                    
                    // Telegram
                    'telegram.button': 'دردشة على تيليجرام',
                    'telegram.tooltip': 'دردشة على تيليجرام',
                    'chatbot.title': 'المساعد الذكي',
                    'chatbot.placeholder': 'اكتب رسالتك...',
                    'chatbot.send': 'إرسال',
                    'chatbot.close': 'إغلاق',
                    
                    // Navigation Help
                    'nav.help.title': 'التنقل السريع',
                    'nav.help.sections': 'اضغط 1-5 للانتقال إلى الأقسام',
                    'nav.help.navigation': 'اضغط Home / End للانتقال للأعلى/الأسفل',
                    
                    // Loading
                    'loading.text': 'جاري تحميل المحفظة...'
                },
                fr: {
                                    // Navigation
                'nav.logo': 'MR',
                'nav.brand': 'Mohamed Riadh',
                'nav.home': 'Accueil',
                'nav.about': 'À propos',
                'nav.expertise': 'Expertise',
                'nav.projects': 'Projets',
                'nav.contact': 'Contact',
                'nav.language.english': 'English',
                'nav.language.arabic': 'العربية',
                'nav.language.french': 'Français',
                    
                    // Hero Section
                    'hero.badge': 'Expert en Cybersécurité et Finance',
                    'hero.title.line1': 'Bonjour, je suis',
                    'hero.title.line2': 'Mohamed Riadh',
                    'hero.title.line3': 'Construire des futurs numériques sécurisés',
                    'hero.description': 'Combler le fossé entre la cybersécurité et les marchés financiers. Spécialisé dans l\'architecture de sécurité d\'entreprise, les tests de pénétration et les stratégies de trading algorithmique avec un accent sur l\'innovation et l\'excellence.',
                    'hero.cta.work': 'Voir mes travaux',
                    'hero.cta.contact': 'Lançons votre projet rentable en 7 jours.',
                    'hero.scroll': 'Faites défiler pour explorer',
                    
                    // Hero Social Links
                    'hero.social.linkedin': 'LinkedIn',
                    'hero.social.github': 'GitHub',
                    'hero.social.twitter': 'Twitter',
                    'hero.social.instagram': 'Instagram',
                    'hero.social.email': 'Email',
                    
                    // Floating Cards
                    'hero.floating.security': 'Expert en Sécurité',
                    'hero.floating.market': 'Analyste de Marché',
                    'hero.floating.developer': 'Développeur',
                    
                    // About Section
                    'about.title': 'À propos',
                    'about.subtitle': 'Passionné par la sécurisation des actifs numériques et l\'optimisation des stratégies financières',
                    'about.intro.title': 'Double expertise en sécurité et finance',
                    'about.intro.text': 'Mon nom est Mohamed Riadh, et j\'apporte un mélange distinctif d\'expertise en cybersécurité, de compétences en développement web et d\'aperçu du marché financier. Mon parcours professionnel a commencé par un dévouement fort à la sécurisation des écosystèmes numériques, qui a naturellement évolué vers une passion plus large pour identifier, atténuer et gérer les risques à travers les domaines technologiques et financiers, tout en construisant et optimisant des solutions web qui s\'alignent sur les besoins des entreprises modernes.',
                    'about.experience.title': 'Expérience professionnelle',
                    'about.experience.text': 'Plus de 6 ans d\'expérience dans la direction d\'initiatives de cybersécurité, le développement d\'applications web et la contribution au développement de stratégies de trading algorithmique pour les institutions financières. Compétent en programmation et en construction de solutions web sécurisées et performantes adaptées aux besoins des entreprises.',
                    'about.achievements.title': 'Réalisations',
                    'about.achievements.text': 'Nous avons sécurisé des dizaines de systèmes d\'entreprise en mettant en œuvre des cadres de sécurité robustes, en construisant et déployant de nombreux sites web et applications professionnels, et en développant des modèles de trading algorithmique qui ont constamment livré des rendements positifs et une précision prédictive élevée dans des conditions de marché réelles.',
                    'about.cta': 'Travaillons ensemble',
                    
                    // Expertise Section
                    'expertise.title': 'Domaines d\'expertise',
                    'expertise.subtitle': 'Compétences complètes en cybersécurité et marchés financiers',
                    'expertise.cybersecurity.title': 'Cybersécurité',
                    'expertise.cybersecurity.description': 'Solutions de sécurité complètes incluant les tests de pénétration, l\'évaluation des vulnérabilités et la conception d\'architecture sécurisée.',
                    'expertise.cybersecurity.skills': ['Tests de pénétration', 'Évaluation des vulnérabilités', 'Architecture de sécurité', 'Réponse aux incidents', 'Conformité et GRC'],
                    'expertise.cybersecurity.level': 'Niveau expert',
                    'expertise.financial.title': 'Analyse financière',
                    'expertise.financial.description': 'Analyse avancée du marché et stratégies de trading algorithmique pour le forex, la crypto et les marchés traditionnels.',
                    'expertise.financial.skills': ['Analyse technique', 'Trading algorithmique', 'Gestion des risques', 'Optimisation de portefeuille', 'Recherche de marché'],
                    'expertise.financial.level': 'Niveau avancé',
                    'expertise.web.title': 'Développement web',
                    'expertise.web.description': 'Développement full-stack avec un accent sur les applications sécurisées et évolutives et les technologies web modernes.',
                    'expertise.web.skills': ['React & Node.js', 'Python & JavaScript', 'Conception de base de données', 'Développement API', 'DevOps & CI/CD'],
                    'expertise.web.level': 'Niveau compétent',
                    
                    // Projects Section
                    'projects.title': 'Projets en vedette',
                    'projects.subtitle': 'Présentation de mes meilleurs travaux en sécurité, finance et développement',
                    'projects.web.category': 'Développement web',
                    'projects.web.title': 'Portail de sécurité d\'entreprise',
                    'projects.web.description': 'Une plateforme de gestion de sécurité complète avec surveillance des menaces en temps réel, réponse aux incidents et capacités de rapport de conformité.',
                    'projects.financial.category': 'Analyse financière',
                    'projects.financial.title': 'Système de trading algorithmique',
                    'projects.financial.description': 'Algorithmes de trading avancés avec intégration d\'apprentissage automatique pour les marchés forex et crypto.',
                    'projects.security.category': 'Cybersécurité',
                    'projects.security.title': 'Framework de tests de pénétration',
                    'projects.security.description': 'Plateforme de tests de sécurité automatisée avec outils de scan de vulnérabilités et de génération de rapports complets.',
                    'projects.cta': 'Lancez votre site web professionnel aujourd\'hui',
                    
                    // Contact Section
                    'contact.intro': 'Dites-nous votre idée et obtenez un plan clair et un prix en 24 heures.',
                    'contact.title': 'Me contacter',
                    'contact.subtitle': 'Prêt à collaborer sur votre prochain projet ? Discutons de la façon dont je peux vous aider.',
                    'contact.email': 'Email',
                    'contact.phone': 'Téléphone',
                    'contact.location': 'Localisation',
                    'contact.location.text': 'Algérie, Disponible mondialement',
                    'contact.form.name': 'Votre nom',
                    'contact.form.email': 'Votre email',
                    'contact.form.subject': 'Sujet',
                    'contact.form.message': 'Votre message',
                    'contact.form.send': 'Envoyer la demande maintenant',
                    'contact.form.name.placeholder': 'Entrez votre nom',
                    'contact.form.email.placeholder': 'Entrez votre email',
                    'contact.form.subject.placeholder': 'Entrez le sujet',
                    'contact.form.message.placeholder': 'Entrez votre message',
                    
                    // Footer
                    'footer.tagline': 'Sécuriser les futurs numériques grâce à l\'innovation et l\'expertise',
                    'footer.services.title': 'Services',
                    'footer.services.security': 'Conseil en sécurité',
                    'footer.services.web': 'Développement web',
                    'footer.services.analysis': 'Analyse de marché',
                    'footer.services.testing': 'Tests de pénétration',
                    'footer.brand': 'Mohamed Riadh',
                    
                    // Start Website Section
                    'start-website.title': 'Prêt à lancer votre site web ?',
                    'start-website.subtitle': 'Transformons votre vision en une présence en ligne puissante qui génère des résultats.',
                    'start-website.button': 'Commencez votre site web aujourd\'hui',
                    
                    'footer.resources.title': 'Ressources',
                    'footer.resources.blog': 'Blog',
                    'footer.resources.about': 'À propos',
                    'footer.resources.contact': 'Contact',
                    'footer.resources.portfolio': 'Portfolio',
                    'footer.resources.instagram': 'Instagram',
                    'footer.connect.title': 'Connecter',
                    'footer.connect.linkedin': 'LinkedIn',
                    'footer.connect.github': 'GitHub',
                    'footer.connect.twitter': 'Twitter',
                    'footer.connect.instagram': 'Instagram',
                    'footer.copyright': '© 2025 Mohamed Riadh. Tous droits réservés.',
                    
                    // Chatbot
                    'chatbot.tooltip': 'Discuter avec l\'assistant IA',
                    
                    // Telegram
                    'telegram.button': 'Discuter sur Telegram',
                    'telegram.tooltip': 'Discuter sur Telegram',
                    'chatbot.title': 'Assistant IA',
                    'chatbot.placeholder': 'Tapez votre message...',
                    'chatbot.send': 'Envoyer',
                    'chatbot.close': 'Fermer',
                    
                    // Navigation Help
                    'nav.help.title': 'Navigation Rapide',
                    'nav.help.sections': 'Appuyez sur 1-5 pour sauter aux sections',
                    'nav.help.navigation': 'Appuyez sur Home / End pour haut/bas'
                }
            };
            
            return translations[lang] || translations.en;
        }

        applyTranslations(translations) {
            // Apply translations to navigation
            this.translateElement('.logo-text', translations['nav.logo']);
            this.translateElement('.brand-text', translations['nav.brand']);
            
            const navLinks = document.querySelectorAll('.nav-link span');
            navLinks.forEach(link => {
                const key = link.getAttribute('data-translate');
                if (key && translations[key]) {
                    link.textContent = translations[key];
                }
            });
            
            // Apply translations to language selector
            this.translateElement('#currentLang', translations['nav.language.english']);
            this.translateElement('.language-option[data-lang="en"] span', translations['nav.language.english']);
            this.translateElement('.language-option[data-lang="ar"] span', translations['nav.language.arabic']);
            this.translateElement('.language-option[data-lang="fr"] span', translations['nav.language.french']);

            // Apply translations to hero section
            this.translateElement('.hero-badge span', translations['hero.badge']);
            this.translateElement('.title-line:first-child', translations['hero.title.line1']);
            this.translateElement('.title-highlight', translations['hero.title.line2']);
            this.translateElement('.title-line:last-child', translations['hero.title.line3']);
            this.translateElement('.hero-description', translations['hero.description']);
            this.translateElement('.hero-actions .btn-primary span', translations['hero.cta.work']);
            this.translateElement('.hero-actions .btn-secondary span', translations['hero.cta.contact']);
            this.translateElement('.scroll-indicator span', translations['hero.scroll']);

            // Apply translations to hero social links
            this.translateElement('.social-links a[data-translate="hero.social.linkedin"]', translations['hero.social.linkedin']);
            this.translateElement('.social-links a[data-translate="hero.social.github"]', translations['hero.social.github']);
            this.translateElement('.social-links a[data-translate="hero.social.twitter"]', translations['hero.social.twitter']);
            this.translateElement('.social-links a[data-translate="hero.social.instagram"]', translations['hero.social.instagram']);
            this.translateElement('.social-links a[data-translate="hero.social.email"]', translations['hero.social.email']);

            // Apply translations to floating cards
            this.translateElement('.floating-card:first-child span', translations['hero.floating.security']);
            this.translateElement('.floating-card:nth-child(2) span', translations['hero.floating.market']);
            this.translateElement('.floating-card:last-child span', translations['hero.floating.developer']);

            // Apply translations to about section
            this.translateElement('.about-section .section-title', translations['about.title']);
            this.translateElement('.about-section .section-subtitle', translations['about.subtitle']);
            this.translateElement('.about-intro h3', translations['about.intro.title']);
            this.translateElement('.about-intro p', translations['about.intro.text']);
            this.translateElement('.highlight-item:nth-child(1) h4', translations['about.experience.title']);
            this.translateElement('.highlight-item:nth-child(1) p', translations['about.experience.text']);
            this.translateElement('.highlight-item:nth-child(2) h4', translations['about.achievements.title']);
            this.translateElement('.highlight-item:nth-child(2) p', translations['about.achievements.text']);
            this.translateElement('.about-cta .btn span', translations['about.cta']);

            // Apply translations to expertise section
            this.translateElement('.expertise-section .section-title', translations['expertise.title']);
            this.translateElement('.expertise-section .section-subtitle', translations['expertise.subtitle']);
            this.translateElement('.expertise-card:nth-child(1) h3', translations['expertise.cybersecurity.title']);
            this.translateElement('.expertise-card:nth-child(1) .card-content p', translations['expertise.cybersecurity.description']);
            this.translateElement('.expertise-card:nth-child(1) .skill-level span', translations['expertise.cybersecurity.level']);
            this.translateElement('.expertise-card:nth-child(2) h3', translations['expertise.financial.title']);
            this.translateElement('.expertise-card:nth-child(2) .card-content p', translations['expertise.financial.description']);
            this.translateElement('.expertise-card:nth-child(2) .skill-level span', translations['expertise.financial.level']);
            this.translateElement('.expertise-card:nth-child(3) h3', translations['expertise.web.title']);
            this.translateElement('.expertise-card:nth-child(3) .card-content p', translations['expertise.web.description']);
            this.translateElement('.expertise-card:nth-child(3) .skill-level span', translations['expertise.web.level']);
            
            // Apply translations to skills lists
            this.translateSkillsList('.expertise-card:nth-child(1) .skill-list li', translations['expertise.cybersecurity.skills']);
            this.translateSkillsList('.expertise-card:nth-child(2) .skill-list li', translations['expertise.financial.skills']);
            this.translateSkillsList('.expertise-card:nth-child(3) .skill-list li', translations['expertise.web.skills']);

            // Apply translations to projects section
            this.translateElement('.projects-section .section-title', translations['projects.title']);
            this.translateElement('.projects-section .section-subtitle', translations['projects.subtitle']);
            this.translateElement('.project-card:nth-child(1) .project-category', translations['projects.web.category']);
            this.translateElement('.project-card:nth-child(1) .project-title', translations['projects.web.title']);
            this.translateElement('.project-card:nth-child(1) .project-description', translations['projects.web.description']);
            this.translateElement('.project-card:nth-child(2) .project-category', translations['projects.financial.category']);
            this.translateElement('.project-card:nth-child(2) .project-title', translations['projects.financial.title']);
            this.translateElement('.project-card:nth-child(2) .project-description', translations['projects.financial.description']);
            this.translateElement('.project-card:nth-child(3) .project-category', translations['projects.security.category']);
            this.translateElement('.project-card:nth-child(3) .project-title', translations['projects.security.title']);
            this.translateElement('.project-card:nth-child(3) .project-description', translations['projects.security.description']);
            this.translateElement('.projects-cta .btn span', translations['projects.cta']);

            // Apply translations to contact section
            this.translateElement('.contact-section .section-intro', translations['contact.intro']);
            this.translateElement('.contact-section .section-title', translations['contact.title']);
            this.translateElement('.contact-section .section-subtitle', translations['contact.subtitle']);
            this.translateElement('.contact-item:nth-child(1) h4', translations['contact.email']);
            this.translateElement('.contact-item:nth-child(2) h4', translations['contact.phone']);
            this.translateElement('.contact-item:nth-child(3) h4', translations['contact.location']);
            this.translateElement('.contact-item:nth-child(3) p', translations['contact.location.text']);
            this.translateElement('.form-group:nth-child(1) label', translations['contact.form.name']);
            this.translateElement('.form-group:nth-child(2) label', translations['contact.form.email']);
            this.translateElement('.form-group:nth-child(3) label', translations['contact.form.subject']);
            this.translateElement('.form-group:nth-child(4) label', translations['contact.form.message']);
            this.translateElement('.contact-form .btn span', translations['contact.form.send']);
            
            // Translate placeholders
            this.translatePlaceholder('#contact-name', translations['contact.form.name.placeholder']);
            this.translatePlaceholder('#contact-email', translations['contact.form.email.placeholder']);
            this.translatePlaceholder('#contact-subject', translations['contact.form.subject.placeholder']);
            this.translatePlaceholder('#contact-message', translations['contact.form.message.placeholder']);

            // Apply translations to footer
            this.translateElement('.footer-brand h3', translations['footer.brand']);
            this.translateElement('.footer-tagline', translations['footer.tagline']);
            this.translateElement('.footer-section:nth-child(1) h4', translations['footer.services.title']);
            this.translateElement('.footer-section:nth-child(1) li:nth-child(1) a', translations['footer.services.security']);
            this.translateElement('.footer-section:nth-child(1) li:nth-child(2) a', translations['footer.services.web']);
            this.translateElement('.footer-section:nth-child(1) li:nth-child(3) a', translations['footer.services.analysis']);
            this.translateElement('.footer-section:nth-child(1) li:nth-child(4) a', translations['footer.services.testing']);
            this.translateElement('.footer-section:nth-child(2) h4', translations['footer.resources.title']);
            this.translateElement('.footer-section:nth-child(2) li:nth-child(1) a', translations['footer.resources.blog']);
            this.translateElement('.footer-section:nth-child(2) li:nth-child(2) a', translations['footer.resources.about']);
            this.translateElement('.footer-section:nth-child(2) li:nth-child(3) a', translations['footer.resources.contact']);
            this.translateElement('.footer-section:nth-child(2) li:nth-child(4) a', translations['footer.resources.portfolio']);
            this.translateElement('.footer-section:nth-child(2) li:nth-child(5) a', translations['footer.resources.instagram']);
            this.translateElement('.footer-section:nth-child(3) h4', translations['footer.connect.title']);
            this.translateElement('.footer-section:nth-child(3) li:nth-child(1) a', translations['footer.connect.linkedin']);
            this.translateElement('.footer-section:nth-child(3) li:nth-child(2) a', translations['footer.connect.github']);
            this.translateElement('.footer-section:nth-child(3) li:nth-child(3) a', translations['footer.connect.twitter']);
            this.translateElement('.footer-section:nth-child(3) li:nth-child(4) a', translations['footer.connect.instagram']);
            this.translateElement('.footer-info p:first-child', translations['footer.copyright']);

            // Apply translations to chatbot
            this.translateElement('.chatbot-tooltip', translations['chatbot.tooltip']);
            
            // Apply translations to Telegram button
            this.translateElement('.telegram-text', translations['telegram.button']);
            this.translateElement('.telegram-tooltip', translations['telegram.tooltip']);
            
            // Apply translations to start website section
            this.translateElement('.start-website-title', translations['start-website.title']);
            this.translateElement('.start-website-subtitle', translations['start-website.subtitle']);
            this.translateElement('.start-website-btn span', translations['start-website.button']);
            
            // Apply translations to navigation help
            this.translateElement('.nav-help-tooltip h4', translations['nav.help.title']);
            this.translateElement('.nav-help-tooltip p:first-of-type', translations['nav.help.sections']);
            this.translateElement('.nav-help-tooltip p:last-of-type', translations['nav.help.navigation']);
        }

        translateElement(selector, translation) {
            if (!translation) return;
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = translation;
            }
        }

        translatePlaceholder(selector, translation) {
            if (!translation) return;
            const element = document.querySelector(selector);
            if (element) {
                element.placeholder = translation;
            }
        }

        translateSkillsList(selector, skillsArray) {
            if (!skillsArray || !Array.isArray(skillsArray)) return;
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                if (skillsArray[index]) {
                    element.textContent = skillsArray[index];
                }
            });
        }

        // Scroll Handlers
        setupScrollHandlers() {
            // Progress bar
            utils.safeAddEventListener(window, 'scroll', utils.debounce(() => {
                this.updateProgressBar();
                this.updateNavbar();
                this.updateActiveNavLink();
                this.updateScrollToTopButton();
            }, 10));

            // Parallax effects
            utils.safeAddEventListener(window, 'scroll', utils.debounce(() => {
                this.updateParallax();
            }, 16));
        }

        updateProgressBar() {
            const progressBar = utils.safeQuerySelector('#progressBar');
            if (progressBar) {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                progressBar.style.width = scrollPercent + '%';
            }
        }

        updateNavbar() {
            const navbar = utils.safeQuerySelector('#navbar');
            if (navbar) {
                const scrollTop = window.pageYOffset;
                
                if (scrollTop > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        }

        updateActiveNavLink() {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        updateParallax() {
            const parallaxElements = document.querySelectorAll('[data-parallax]');
            parallaxElements.forEach(element => {
                const speed = element.getAttribute('data-parallax') || 0.5;
                const yPos = -(window.pageYOffset * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        }

        updateScrollToTopButton() {
            const scrollToTopBtn = utils.safeQuerySelector('#scrollToTopBtn');
            if (scrollToTopBtn) {
                if (window.pageYOffset > 300) {
                    scrollToTopBtn.classList.add('show');
                } else {
                    scrollToTopBtn.classList.remove('show');
                }
            }
        }

        // Cursor Effects
        setupCursorEffects() {
            const cursorFollower = utils.safeQuerySelector('.cursor-follower');
            const cursorDot = utils.safeQuerySelector('.cursor-dot');
            
            if (cursorFollower && cursorDot) {
                let mouseX = 0, mouseY = 0;
                let followerX = 0, followerY = 0;
                let dotX = 0, dotY = 0;

                utils.safeAddEventListener(document, 'mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                });

                // Animate cursor follower
                function animateCursor() {
                    followerX += (mouseX - followerX) * 0.1;
                    followerY += (mouseY - followerY) * 0.1;
                    dotX += (mouseX - dotX) * 0.3;
                    dotY += (mouseY - dotY) * 0.3;

                    cursorFollower.style.transform = `translate(${followerX - 10}px, ${followerY - 10}px)`;
                    cursorDot.style.transform = `translate(${dotX - 2}px, ${dotY - 2}px)`;

                    requestAnimationFrame(animateCursor);
                }
                animateCursor();

                // Cursor hover effects
                const hoverElements = document.querySelectorAll('a, button, .btn, .nav-link');
                hoverElements.forEach(element => {
                    utils.safeAddEventListener(element, 'mouseenter', () => {
                        cursorFollower.style.transform += ' scale(1.5)';
                        cursorFollower.style.opacity = '0.5';
                    });
                    
                    utils.safeAddEventListener(element, 'mouseleave', () => {
                        cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
                        cursorFollower.style.opacity = '1';
                    });
                });
            }
        }

        // Animations
        setupAnimations() {
            // Initialize AOS
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 1000,
                    easing: 'ease-in-out',
                    once: true,
                    offset: 100
                });
            }

            // Custom animations
            this.setupScrollAnimations();
        }

        setupScrollAnimations() {
            const animatedElements = document.querySelectorAll('[data-animate]');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            animatedElements.forEach(element => {
                observer.observe(element);
            });
        }

        // Particles System
        setupParticles() {
            const particlesContainer = utils.safeQuerySelector('#heroParticles');
            if (particlesContainer) {
                this.createParticles(particlesContainer);
            }
        }

        createParticles(container) {
            const particleCount = 50;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 4 + 1}px;
                    height: ${Math.random() * 4 + 1}px;
                    background: rgba(37, 99, 235, ${Math.random() * 0.3 + 0.1});
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
                    animation-delay: ${Math.random() * 5}s;
                `;
                container.appendChild(particle);
            }

            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes float-particle {
                    0% { transform: translateY(0px) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // Stats Counter
        setupStatsCounter() {
            const statNumbers = document.querySelectorAll('.stat-number');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            statNumbers.forEach(stat => {
                observer.observe(stat);
            });
        }

        animateCounter(element) {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current);
            }, 16);
        }

        // Form Handling
        setupFormHandling() {
            const formGroups = document.querySelectorAll('.form-group');
            
            formGroups.forEach(group => {
                const input = group.querySelector('input, textarea');
                const label = group.querySelector('label');
                
                if (input && label) {
                    utils.safeAddEventListener(input, 'focus', () => {
                        label.classList.add('active');
                    });
                    
                    utils.safeAddEventListener(input, 'blur', () => {
                        if (!input.value) {
                            label.classList.remove('active');
                        }
                    });
                    
                    // Check if input has value on load
                    if (input.value) {
                        label.classList.add('active');
                    }
                }
            });
        }

        // Chatbot functionality
        setupChatbot() {
            const chatbotIcon = utils.safeQuerySelector('#chatbotIcon');
            if (chatbotIcon) {
                utils.safeAddEventListener(chatbotIcon, 'click', () => {
                    this.openChatbot();
                });
            }
        }

        // Navigation help tooltip
        setupNavigationHelp() {
            const navHelpTooltip = utils.safeQuerySelector('#navHelpTooltip');
            const tooltipClose = utils.safeQuerySelector('#tooltipClose');
            
            if (navHelpTooltip && tooltipClose) {
                // Show tooltip on first visit
                const hasSeenTooltip = localStorage.getItem('navHelpSeen');
                if (!hasSeenTooltip) {
                    setTimeout(() => {
                        navHelpTooltip.classList.add('show');
                    }, 3000);
                }
                
                // Close tooltip
                utils.safeAddEventListener(tooltipClose, 'click', () => {
                    navHelpTooltip.classList.remove('show');
                    localStorage.setItem('navHelpSeen', 'true');
                });
                
                // Show tooltip on question mark key
                utils.safeAddEventListener(document, 'keydown', (e) => {
                    if (e.key === '?' && !e.target.matches('input, textarea')) {
                        e.preventDefault();
                        navHelpTooltip.classList.toggle('show');
                    }
                });
            }
        }

        openChatbot() {
            // Create chatbot modal
            const chatbotModal = document.createElement('div');
            chatbotModal.className = 'chatbot-modal';
            chatbotModal.innerHTML = `
                <div class="chatbot-container">
                    <div class="chatbot-header">
                        <h3>AI Assistant</h3>
                        <button class="chatbot-close" id="chatbotClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="chatbot-messages" id="chatbotMessages">
                        <div class="message bot-message">
                            <div class="message-content">
                                Hello! I'm your AI assistant. How can I help you today?
                            </div>
                        </div>
                    </div>
                    <div class="chatbot-input">
                        <input type="text" id="chatbotInput" placeholder="Type your message...">
                        <button id="chatbotSend">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(chatbotModal);
            
            // Add chatbot styles
            if (!document.querySelector('#chatbot-styles')) {
                const style = document.createElement('style');
                style.id = 'chatbot-styles';
                style.textContent = `
                    .chatbot-modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 9999;
                        opacity: 0;
                        transition: opacity var(--transition-normal);
                    }
                    .chatbot-modal.show {
                        opacity: 1;
                    }
                    .chatbot-container {
                        background: var(--bg-primary);
                        border-radius: var(--radius-xl);
                        width: 90%;
                        max-width: 400px;
                        max-height: 500px;
                        display: flex;
                        flex-direction: column;
                        box-shadow: var(--shadow-xl);
                        transform: scale(0.8);
                        transition: transform var(--transition-normal);
                    }
                    .chatbot-modal.show .chatbot-container {
                        transform: scale(1);
                    }
                    .chatbot-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: var(--space-lg);
                        border-bottom: 1px solid var(--border-color);
                    }
                    .chatbot-header h3 {
                        color: var(--text-primary);
                        margin: 0;
                    }
                    .chatbot-close {
                        background: none;
                        border: none;
                        color: var(--text-secondary);
                        cursor: pointer;
                        font-size: 1.25rem;
                        padding: var(--space-xs);
                    }
                    .chatbot-close:hover {
                        color: var(--text-primary);
                    }
                    .chatbot-messages {
                        flex: 1;
                        padding: var(--space-lg);
                        overflow-y: auto;
                        max-height: 300px;
                    }
                    .message {
                        margin-bottom: var(--space-md);
                        display: flex;
                    }
                    .bot-message {
                        justify-content: flex-start;
                    }
                    .user-message {
                        justify-content: flex-end;
                    }
                    .message-content {
                        background: var(--bg-secondary);
                        color: var(--text-primary);
                        padding: var(--space-sm) var(--space-md);
                        border-radius: var(--radius-lg);
                        max-width: 80%;
                        word-wrap: break-word;
                    }
                    .user-message .message-content {
                        background: var(--primary-blue);
                        color: var(--white);
                    }
                    .chatbot-input {
                        display: flex;
                        gap: var(--space-sm);
                        padding: var(--space-lg);
                        border-top: 1px solid var(--border-color);
                    }
                    .chatbot-input input {
                        flex: 1;
                        padding: var(--space-sm) var(--space-md);
                        border: 1px solid var(--border-color);
                        border-radius: var(--radius-md);
                        background: var(--bg-primary);
                        color: var(--text-primary);
                    }
                    .chatbot-input button {
                        background: var(--primary-blue);
                        color: var(--white);
                        border: none;
                        border-radius: var(--radius-md);
                        padding: var(--space-sm) var(--space-md);
                        cursor: pointer;
                        transition: all var(--transition-normal);
                    }
                    .chatbot-input button:hover {
                        background: var(--primary-dark);
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Show modal
            setTimeout(() => chatbotModal.classList.add('show'), 10);
            
            // Close functionality
            const closeBtn = chatbotModal.querySelector('#chatbotClose');
            utils.safeAddEventListener(closeBtn, 'click', () => {
                chatbotModal.classList.remove('show');
                setTimeout(() => chatbotModal.remove(), 300);
            });
            
            // Click outside to close
            utils.safeAddEventListener(chatbotModal, 'click', (e) => {
                if (e.target === chatbotModal) {
                    chatbotModal.classList.remove('show');
                    setTimeout(() => chatbotModal.remove(), 300);
                }
            });
            
            // Send message functionality
            const input = chatbotModal.querySelector('#chatbotInput');
            const sendBtn = chatbotModal.querySelector('#chatbotSend');
            const messagesContainer = chatbotModal.querySelector('#chatbotMessages');
            
            const sendMessage = () => {
                const message = input.value.trim();
                if (message) {
                    // Add user message
                    const userMessage = document.createElement('div');
                    userMessage.className = 'message user-message';
                    userMessage.innerHTML = `<div class="message-content">${message}</div>`;
                    messagesContainer.appendChild(userMessage);
                    
                    input.value = '';
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    
                    // Simulate bot response
                    setTimeout(() => {
                        const botMessage = document.createElement('div');
                        botMessage.className = 'message bot-message';
                        botMessage.innerHTML = `<div class="message-content">Thanks for your message! I'm here to help with any questions about cybersecurity, financial markets, or web development.</div>`;
                        messagesContainer.appendChild(botMessage);
                        messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    }, 1000);
                }
            };
            
            utils.safeAddEventListener(sendBtn, 'click', sendMessage);
            utils.safeAddEventListener(input, 'keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
            
            // Focus input
            setTimeout(() => input.focus(), 500);
        }

        handleFormSubmit(e) {
            e.preventDefault();
            
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Reset form
                form.reset();
                
                // Show success message
                this.showNotification('Message sent successfully!', 'success');
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        }

        showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Add styles
            const style = document.createElement('style');
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
                    z-index: var(--z-modal);
                    transform: translateX(100%);
                    transition: transform var(--transition-normal);
                }
                .notification.show { transform: translateX(0); }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                }
                .notification-success { border-left: 4px solid var(--success-green); }
                .notification-success i { color: var(--success-green); }
            `;
            document.head.appendChild(style);
            
            // Show notification
            setTimeout(() => notification.classList.add('show'), 100);
            
            // Hide after 5 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 5000);
        }

        // Mobile Menu
        toggleMobileMenu() {
            const navMenu = utils.safeQuerySelector('#navMenu');
            const mobileToggle = utils.safeQuerySelector('#mobileMenuToggle');
            
            if (navMenu && mobileToggle) {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            }
        }

        // Scroll to Top
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    // Initialize the application when DOM is loaded
    if (document.readyState === 'loading') {
        utils.safeAddEventListener(document, 'DOMContentLoaded', () => {
            new PortfolioApp();
        });
    } else {
        new PortfolioApp();
    }

})();

