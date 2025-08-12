// Enhanced AI Chatbot with Advanced Intelligence
class EnhancedChatbot {
    constructor() {
        this.conversationHistory = [];
        this.userPreferences = {};
        this.currentContext = 'general';
        this.isTyping = false;
        
        // Knowledge base for intelligent responses
        this.knowledgeBase = {
            services: {
                cybersecurity: {
                    title: 'Cybersecurity & Ethical Hacking',
                    description: 'Professional penetration testing, vulnerability assessment, and security consulting',
                    features: [
                        'Penetration Testing & Ethical Hacking',
                        'Vulnerability Assessment & Security Auditing',
                        'Security Architecture & Design',
                        'Incident Response & Threat Hunting',
                        'Compliance & Security Consulting'
                    ],
                    expertise: 'Expert Level (95%)',
                    pricing: 'Custom quotes based on scope',
                    timeline: '1-4 weeks depending on complexity'
                },
                webDevelopment: {
                    title: 'Professional Web Development',
                    description: 'High-impact websites and web applications built in 7 days',
                    features: [
                        'React & Node.js Development',
                        'Python & JavaScript Programming',
                        'Secure Database Design',
                        'API Development & Security',
                        'DevOps & CI/CD Implementation'
                    ],
                    expertise: 'Proficient Level (85%)',
                    pricing: 'Starting from $500',
                    timeline: '7 days guaranteed delivery',
                    guarantee: 'Satisfaction guaranteed - Pay only when happy'
                },
                financialAnalysis: {
                    title: 'Financial Market Analysis',
                    description: 'Advanced market analysis and algorithmic trading strategies',
                    features: [
                        'Technical Analysis',
                        'Algorithmic Trading',
                        'Risk Management',
                        'Portfolio Optimization',
                        'Market Research'
                    ],
                    expertise: 'Advanced Level (90%)',
                    pricing: 'Monthly subscription plans available',
                    timeline: 'Ongoing support and updates'
                }
            },
            projects: {
                enterprisePortal: {
                    title: 'Enterprise Security Portal',
                    description: 'Comprehensive security management platform with real-time threat monitoring',
                    outcome: 'Reduced security incidents by 78% and achieved 100% compliance audit success',
                    technologies: ['React', 'Node.js', 'MongoDB', 'AWS']
                },
                tradingSystem: {
                    title: 'Algorithmic Trading System',
                    description: 'Advanced trading algorithms with machine learning integration',
                    outcome: 'Generated 42% higher returns than manual trading with 65% reduced risk exposure',
                    technologies: ['Python', 'TensorFlow', 'Pandas', 'NumPy']
                },
                penetrationTesting: {
                    title: 'Professional Penetration Testing Framework',
                    description: 'Automated security testing platform with comprehensive vulnerability scanning',
                    outcome: 'Identified and patched 23 critical vulnerabilities, preventing $2.5M in potential breach costs',
                    technologies: ['Python', 'Docker', 'Nmap', 'Metasploit']
                }
            },
            contact: {
                email: 'mohamedriadhch@gmail.com',
                phone: '+213 549050906',
                location: 'Algeria, Available Worldwide',
                responseTime: 'Within 24 hours',
                consultation: 'Free initial consultation available'
            }
        };

        // Common questions and intelligent responses
        this.faqResponses = {
            'pricing': 'Our pricing varies by service. Web development starts at $500 with 7-day delivery guarantee. Cybersecurity services are custom-quoted based on scope. Financial analysis offers monthly subscription plans. Would you like a detailed quote for a specific service?',
            'timeline': 'Web development projects are delivered in exactly 7 days with our satisfaction guarantee. Cybersecurity assessments typically take 1-4 weeks depending on complexity. Financial analysis provides ongoing support. What type of project are you considering?',
            'experience': 'I have over 6 years of experience in cybersecurity, web development, and financial analysis. I\'ve successfully delivered 50+ secure websites, conducted 100+ security assessments, and prevented over $5M in potential security breaches. Would you like to see specific project examples?',
            'guarantee': 'Yes! We offer a satisfaction guarantee - you only pay when you\'re completely happy with the results. For web development, this means you get your high-impact website in 7 days or you don\'t pay. What specific concerns do you have about quality?',
            'security': 'Security is our top priority. All web development projects include security best practices, and our cybersecurity services provide comprehensive protection. We use ethical hacking principles and follow industry standards. Would you like to discuss your specific security needs?'
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadUserPreferences();
    }

    setupEventListeners() {
        const chatbotIcon = document.querySelector('#chatbotIcon');
        if (chatbotIcon) {
            chatbotIcon.addEventListener('click', () => this.openChatbot());
        }
    }

    loadUserPreferences() {
        const saved = localStorage.getItem('chatbotPreferences');
        if (saved) {
            this.userPreferences = JSON.parse(saved);
        }
    }

    saveUserPreferences() {
        localStorage.setItem('chatbotPreferences', JSON.stringify(this.userPreferences));
    }

    openChatbot() {
        if (document.querySelector('.enhanced-chatbot-modal')) return;

        const modal = this.createChatbotModal();
        document.body.appendChild(modal);
        
        // Add styles
        this.addChatbotStyles();
        
        // Show modal with animation
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Send welcome message
        this.sendWelcomeMessage();
        
        // Setup event listeners
        this.setupModalEventListeners(modal);
    }

    createChatbotModal() {
        const modal = document.createElement('div');
        modal.className = 'enhanced-chatbot-modal';
        modal.innerHTML = `
            <div class="chatbot-container">
                <div class="chatbot-header">
                    <div class="header-content">
                        <div class="bot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="header-text">
                            <h3>AI Assistant</h3>
                        </div>
                    </div>
                    <button class="chatbot-close" id="chatbotClose">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="chatbot-messages" id="chatbotMessages">
                    <!-- Messages will be added here -->
                </div>
                
                <div class="quick-actions" id="quickActions">
                    <!-- Quick action buttons -->
                </div>
                
                <div class="chatbot-input">
                    <div class="input-wrapper">
                        <input type="text" id="chatbotInput" placeholder="Ask me anything about cybersecurity, web development, or financial analysis...">
                        <button id="chatbotSend" class="send-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="typing-indicator" id="typingIndicator" style="display: none;">
                        <span>AI is typing</span>
                        <div class="typing-dots">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return modal;
    }

    addChatbotStyles() {
        // Styles are now handled by enhanced-chatbot.css
        // This method is kept for compatibility but does nothing
        return;
    }

    setupModalEventListeners(modal) {
        const closeBtn = modal.querySelector('#chatbotClose');
        const input = modal.querySelector('#chatbotInput');
        const sendBtn = modal.querySelector('#chatbotSend');
        const messagesContainer = modal.querySelector('#chatbotMessages');

        // Close functionality
        closeBtn.addEventListener('click', () => this.closeChatbot(modal));
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeChatbot(modal);
            }
        });

        // Send message functionality
        const sendMessage = () => this.handleUserMessage(input.value.trim(), messagesContainer, modal);
        
        sendBtn.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // Focus input
        setTimeout(() => input.focus(), 500);
    }

    closeChatbot(modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }

    sendWelcomeMessage() {
        const messagesContainer = document.querySelector('#chatbotMessages');
        const quickActions = document.querySelector('#quickActions');
        
        if (!messagesContainer) return;

        // Welcome message
        this.addMessage('bot', 'Hello! I\'m your AI assistant, specialized in cybersecurity, web development, and financial analysis. How can I help you today?', messagesContainer);
        
        // Quick action buttons
        this.addQuickActions(quickActions);
    }

    addMessage(sender, content, container) {
        const message = document.createElement('div');
        message.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.innerHTML = content;
        
        message.appendChild(avatar);
        message.appendChild(messageContent);
        container.appendChild(message);
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
        
        // Add to conversation history
        this.conversationHistory.push({ sender, content, timestamp: Date.now() });
    }

    addQuickActions(container) {
        const actions = [
            'Tell me about your services',
            'Web development pricing',
            'Cybersecurity expertise',
            'View projects',
            'Contact information'
        ];
        
        container.innerHTML = '';
        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'quick-action-btn';
            btn.textContent = action;
            btn.addEventListener('click', () => this.handleQuickAction(action));
            container.appendChild(btn);
        });
    }

    handleQuickAction(action) {
        const messagesContainer = document.querySelector('#chatbotMessages');
        if (!messagesContainer) return;

        // Add user message
        this.addMessage('user', action, messagesContainer);
        
        // Process action
        this.processUserInput(action, messagesContainer);
    }

    handleUserMessage(message, messagesContainer, modal) {
        if (!message) return;

        // Add user message
        this.addMessage('user', message, messagesContainer);
        
        // Clear input
        const input = modal.querySelector('#chatbotInput');
        input.value = '';
        
        // Process message
        this.processUserInput(message, messagesContainer);
    }

    async processUserInput(input, messagesContainer) {
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate processing time
        await this.delay(1000 + Math.random() * 1000);
        
        // Hide typing indicator
        this.hideTypingIndicator();
        
        // Generate intelligent response
        const response = this.generateIntelligentResponse(input);
        
        // Add bot response
        this.addMessage('bot', response, messagesContainer);
        
        // Update quick actions based on context
        this.updateQuickActions(response);
    }

    generateIntelligentResponse(input) {
        const lowerInput = input.toLowerCase();
        
        // Check for specific service inquiries
        if (lowerInput.includes('web development') || lowerInput.includes('website') || lowerInput.includes('site')) {
            return this.getServiceResponse('webDevelopment');
        }
        
        if (lowerInput.includes('cybersecurity') || lowerInput.includes('security') || lowerInput.includes('hacking') || lowerInput.includes('penetration')) {
            return this.getServiceResponse('cybersecurity');
        }
        
        if (lowerInput.includes('financial') || lowerInput.includes('trading') || lowerInput.includes('market') || lowerInput.includes('analysis')) {
            return this.getServiceResponse('financialAnalysis');
        }
        
        // Check for pricing inquiries
        if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('how much')) {
            return this.faqResponses.pricing;
        }
        
        // Check for timeline inquiries
        if (lowerInput.includes('time') || lowerInput.includes('how long') || lowerInput.includes('duration')) {
            return this.faqResponses.timeline;
        }
        
        // Check for experience inquiries
        if (lowerInput.includes('experience') || lowerInput.includes('years') || lowerInput.includes('background')) {
            return this.faqResponses.experience;
        }
        
        // Check for guarantee inquiries
        if (lowerInput.includes('guarantee') || lowerInput.includes('satisfaction') || lowerInput.includes('refund')) {
            return this.faqResponses.guarantee;
        }
        
        // Check for project inquiries
        if (lowerInput.includes('project') || lowerInput.includes('portfolio') || lowerInput.includes('work')) {
            return this.getProjectsResponse();
        }
        
        // Check for contact inquiries
        if (lowerInput.includes('contact') || lowerInput.includes('email') || lowerInput.includes('phone') || lowerInput.includes('reach')) {
            return this.getContactResponse();
        }
        
        // Default intelligent response
        return this.getDefaultResponse(input);
    }

    getServiceResponse(serviceKey) {
        const service = this.knowledgeBase.services[serviceKey];
        return `**${service.title}**\n\n${service.description}\n\n**Key Features:**\n${service.features.map(f => `• ${f}`).join('\n')}\n\n**Expertise Level:** ${service.expertise}\n**Timeline:** ${service.timeline}\n\nWould you like more specific details about pricing or to discuss your project requirements?`;
    }

    getProjectsResponse() {
        const projects = this.knowledgeBase.projects;
        return `**Featured Projects:**\n\n**1. ${projects.enterprisePortal.title}**\n${projects.enterprisePortal.description}\n*Outcome:* ${projects.enterprisePortal.outcome}\n\n**2. ${projects.tradingSystem.title}**\n${projects.tradingSystem.description}\n*Outcome:* ${projects.tradingSystem.outcome}\n\n**3. ${projects.penetrationTesting.title}**\n${projects.penetrationTesting.description}\n*Outcome:* ${projects.penetrationTesting.outcome}\n\nWould you like to see more details about any specific project or discuss how we can apply similar solutions to your needs?`;
    }

    getContactResponse() {
        const contact = this.knowledgeBase.contact;
        return `**Contact Information:**\n\n📧 **Email:** ${contact.email}\n📱 **Phone:** ${contact.phone}\n🌍 **Location:** ${contact.location}\n⏰ **Response Time:** ${contact.responseTime}\n💬 **Consultation:** ${contact.consultation}\n\nI can also help you fill out a contact form or schedule a consultation. What would you prefer?`;
    }

    getDefaultResponse(input) {
        const responses = [
            `I understand you're asking about "${input}". Let me help you with that. Could you provide more specific details about what you're looking for?`,
            `That's an interesting question about "${input}". I'd be happy to help! What specific aspect would you like to know more about?`,
            `I want to make sure I give you the most helpful information about "${input}". Could you clarify what specific information you need?`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    updateQuickActions(response) {
        const quickActions = document.querySelector('#quickActions');
        if (!quickActions) return;

        // Update quick actions based on the response context
        let newActions = [];
        
        if (response.includes('web development')) {
            newActions = ['Get a quote', 'See examples', 'Discuss requirements', 'Timeline details'];
        } else if (response.includes('cybersecurity')) {
            newActions = ['Security assessment', 'Penetration testing', 'Compliance help', 'Get quote'];
        } else if (response.includes('financial')) {
            newActions = ['Trading strategies', 'Risk management', 'Portfolio analysis', 'Market insights'];
        } else {
            newActions = ['Tell me about your services', 'Web development pricing', 'Cybersecurity expertise', 'Contact information'];
        }
        
        quickActions.innerHTML = '';
        newActions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'quick-action-btn';
            btn.textContent = action;
            btn.addEventListener('click', () => this.handleQuickAction(action));
            quickActions.appendChild(btn);
        });
    }

    showTypingIndicator() {
        const indicator = document.querySelector('#typingIndicator');
        if (indicator) {
            indicator.style.display = 'flex';
        }
        this.isTyping = true;
    }

    hideTypingIndicator() {
        const indicator = document.querySelector('#typingIndicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
        this.isTyping = false;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize enhanced chatbot when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.enhancedChatbot = new EnhancedChatbot();
    });
} else {
    window.enhancedChatbot = new EnhancedChatbot();
}
