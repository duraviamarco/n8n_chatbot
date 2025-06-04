// Chat Widget Script
(function() {
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #854fff);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #6b3fd4);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none; /* MODIFIED: Hidden by default, shown by toggle button */
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
            
            /* MODIFIED: Make chat-container a flex container to manage its children screens when open */
            flex-direction: column; 
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex; /* MODIFIED: Show when open */
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(133, 79, 255, 0.1);
            position: relative;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header .brand-logo-link { /* NEW: Style for the logo link */
            display: flex; /* To center the image */
            align-items: center;
            height: 32px; /* Match image height */
            text-decoration: none; /* Remove underline */
            cursor: pointer;
        }

        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
            transition: transform 0.2s;
        }
        .n8n-chat-widget .brand-header img:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }

        /* NEW: Styles for the initial new conversation screen */
        .n8n-chat-widget .new-conversation-screen {
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px; /* Constrain width within flex container */
            margin: auto; /* Center horizontally within parent */
            flex-grow: 1; /* Allow it to take available vertical space */
            display: flex; /* Make it a flex container */
            flex-direction: column; /* Stack children vertically */
            justify-content: center; /* Center content vertically */
            align-items: center; /* Center content horizontally */
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
            margin-bottom: 15px; /* Aggiunto per spaziatura */
        }

        /* INIZIO NUOVO CSS PER DOMANDE RAPIDE */
        .n8n-chat-widget .quick-questions {
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px; /* Spazio tra i pulsanti */
            width: 100%; /* Take full width of parent */
        }

        .n8n-chat-widget .quick-question-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 12px 20px;
            background: var(--chat--color-background); /* Sfondo chiaro */
            color: var(--chat--color-font); /* Colore del testo principale */
            border: 1px solid rgba(133, 79, 255, 0.2); /* Bordo leggero */
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
            transition: transform 0.2s, background 0.2s, border-color 0.2s;
            font-weight: 400;
            font-family: inherit;
            text-align: left; /* Allinea il testo a sinistra per leggibilità */
        }

        .n8n-chat-widget .quick-question-btn:hover {
            transform: translateY(-2px); /* Effetto leggero al passaggio del mouse */
            background: rgba(133, 79, 255, 0.05); /* Sfondo leggermente colorato all'hover */
            border-color: var(--chat--color-primary); /* Bordo colorato all'hover */
        }
        /* FINE NUOVO CSS PER DOMANDE RAPIDE */

        /* NEW: Styles for the main chat interface screen */
        .n8n-chat-widget .chat-interface-screen { 
            display: none; /* Hidden by default */
            flex-direction: column;
            height: 100%; /* Take full height of parent */
            flex-grow: 1; /* Allow it to take available vertical space */
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.2);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(133, 79, 255, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        /* NEW: Basic styling for markdown elements within bot messages */
        .n8n-chat-widget .chat-message.bot strong {
            font-weight: 600;
        }
        .n8n-chat-widget .chat-message.bot a {
            color: var(--chat--color-primary);
            text-decoration: underline;
        }
        .n8n-chat-widget .chat-message.bot ul,
        .n8n-chat-widget .chat-message.bot ol {
            margin-left: 20px;
            padding-left: 0;
            margin-top: 5px;
            margin-bottom: 5px;
        }
        .n8n-chat-widget .chat-message.bot li {
            margin-bottom: 5px;
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(133, 79, 255, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(133, 79, 255, 0.3);
            z-index: 999;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px;
            text-align: center;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(133, 79, 255, 0.1);
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }

        /* NEW: CSS for Confirmation Modal */
        .n8n-chat-widget .confirmation-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.4);
            z-index: 1001; /* Higher than chat container */
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }
        .n8n-chat-widget .confirmation-modal-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        .n8n-chat-widget .confirmation-modal-content {
            background: var(--chat--color-background);
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            max-width: 350px;
            text-align: center;
            color: var(--chat--color-font);
            font-size: 15px;
            line-height: 1.5;
        }
        .n8n-chat-widget .confirmation-modal-content h3 {
            font-size: 18px;
            font-weight: 600;
            margin-top: 0;
            margin-bottom: 15px;
            color: var(--chat--color-font);
        }
        .n8n-chat-widget .confirmation-modal-buttons {
            margin-top: 25px;
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        .n8n-chat-widget .confirmation-modal-buttons button {
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
            transition: background 0.2s, transform 0.2s;
            font-family: inherit;
        }
        .n8n-chat-widget .confirmation-modal-buttons .confirm-btn {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
        }
        .n8n-chat-widget .confirmation-modal-buttons .confirm-btn:hover {
            transform: scale(1.02);
        }
        .n8n-chat-widget .confirmation-modal-buttons .cancel-btn {
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            border: 1px solid rgba(133, 79, 255, 0.2);
            opacity: 0.8;
        }
        .n8n-chat-widget .confirmation-modal-buttons .cancel-btn:hover {
            opacity: 1;
            transform: scale(1.02);
            border-color: var(--chat--color-primary);
        }
    `;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // NEW: Load Marked.js for Markdown rendering
    const markedScript = document.createElement('script');
    markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    markedScript.onload = () => {
        // Optional: Configure marked if needed
        // marked.setOptions({
        //     gfm: true, // Use GitHub Flavored Markdown
        //     breaks: true, // Convert newlines to <br>
        // });
    };
    document.head.appendChild(markedScript);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: 'Powered by n8n',
                link: 'https://n8n.partnerlinks.io/m8a94i19zhqq?utm_source=nocodecreative.io'
            },
            homeLink: '/' // NEW: Default home link for logo redirection
        },
        style: {
            primaryColor: '',
            secondaryColor: '',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        }
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { 
                ...defaultConfig.branding, 
                ...window.ChatWidgetConfig.branding,
                poweredBy: { // Ensure nested poweredBy is merged correctly
                    ...defaultConfig.branding.poweredBy,
                    ...(window.ChatWidgetConfig.branding && window.ChatWidgetConfig.branding.poweredBy ? window.ChatWidgetConfig.branding.poweredBy : {})
                }
            },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    // NEW: Single brand header at the top level of chatContainer
    const brandHeaderHTML = `
        <div class="brand-header">
            <a href="${config.branding.homeLink || '/'}" class="brand-logo-link"> <!-- MODIFIED: Wrapped logo in <a> tag -->
                <img src="${config.branding.logo}" alt="${config.branding.name}">
            </a>
            <span>${config.branding.name}</span>
            <button class="close-button">×</button>
        </div>
    `;

    // NEW: The initial screen for starting a new conversation
    const newConversationScreenHTML = `
        <div class="new-conversation-screen">
            <h2 class="welcome-text">${config.branding.welcomeText}</h2>
            <p class="response-text">${config.branding.responseTimeText}</p>
            <button class="new-chat-btn">
                <svg class="message-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                </svg>
                Chatta con noi!
            </button>
            <div class="quick-questions">
                <button class="quick-question-btn" data-question="Mi fornisci il tracking del mio ordine?">Mi fornisci il tracking del mio ordine?</button>
                <button class="quick-question-btn" data-question="Voglio informazioni su un prodotto, mi aiuti?">Voglio informazioni su un prodotto, mi aiuti?</button>
                <button class="quick-question-btn" data-question="Quali sono le politiche di reso dei prodotti?">Quali sono le politiche di reso dei prodotti?</button>
            </div>
        </div>
    `;

    // NEW: The actual chat interface screen
    const chatInterfaceScreenHTML = `
        <div class="chat-interface-screen">
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Scrivi il tuo messaggio..." rows="1"></textarea>
                <button type="submit">Invia</button>
            </div>
            <div class="chat-footer">
                <a href="${config.branding.poweredBy.link}" target="_blank">${config.branding.poweredBy.text}</a>
            </div>
        </div>
    `;
    
    // Combine all parts into chatContainer
    chatContainer.innerHTML = brandHeaderHTML + newConversationScreenHTML + chatInterfaceScreenHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);

    // NEW: Add confirmation modal HTML
    const confirmationModalHTML = `
        <div class="confirmation-modal-overlay">
            <div class="confirmation-modal-content">
                <h3 class="modal-title"></h3>
                <p class="modal-message"></p>
                <div class="confirmation-modal-buttons">
                    <button class="confirm-btn"></button>
                    <button class="cancel-btn">Annulla</button>
                </div>
            </div>
        </div>
    `;
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = confirmationModalHTML;
    widgetContainer.appendChild(modalDiv.firstElementChild); // Append the actual div, not its wrapper
    
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    // Riferimenti agli elementi DOM (updated selectors)
    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const quickQuestionButtons = chatContainer.querySelectorAll('.quick-question-btn');
    const newConversationScreen = chatContainer.querySelector('.new-conversation-screen'); 
    const chatInterfaceScreen = chatContainer.querySelector('.chat-interface-screen');   
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const brandLogoLink = chatContainer.querySelector('.brand-logo-link'); // NEW
    
    // NEW: Modal elements
    const modalOverlay = widgetContainer.querySelector('.confirmation-modal-overlay');
    const modalTitle = modalOverlay.querySelector('.modal-title');
    const modalMessage = modalOverlay.querySelector('.modal-message');
    const confirmBtn = modalOverlay.querySelector('.confirm-btn');
    const cancelBtn = modalOverlay.querySelector('.cancel-btn');

    // Initial state: ensure chat container is hidden by default
    chatContainer.classList.remove('open'); // Ensure it's closed on load
    newConversationScreen.style.display = 'flex'; // Show initial screen
    chatInterfaceScreen.style.display = 'none'; // Hide chat interface

    let currentConfirmCallback = null; // To store the callback for the confirm button

    // NEW: Confirmation Modal Functions
    function showConfirmationModal(title, message, confirmText, onConfirm) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        confirmBtn.textContent = confirmText;
        currentConfirmCallback = onConfirm; // Store the callback
        modalOverlay.classList.add('active');
    }

    function hideConfirmationModal() {
        modalOverlay.classList.remove('active');
        currentConfirmCallback = null; // Clear the callback
    }

    // NEW: Add event listeners for modal buttons
    confirmBtn.addEventListener('click', () => {
        if (currentConfirmCallback) {
            currentConfirmCallback();
        }
        hideConfirmationModal();
    });

    cancelBtn.addEventListener('click', hideConfirmationModal);

    // NEW: Helper function to render Markdown
    function renderMarkdown(text) {
        if (typeof marked === 'undefined') {
            console.warn('Marked.js is not loaded. Markdown will not be rendered.');
            return text; // Return raw text if marked is not available
        }
        return marked.parse(text);
    }

    function generateUUID() {
        return crypto.randomUUID();
    }

    async function startNewConversation() {
        // Clear previous messages when starting a new conversation
        messagesContainer.innerHTML = ''; 
        currentSessionId = generateUUID();
        const data = [{
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route,
            metadata: {
                userId: ""
            }
        }];

        // Hide new conversation screen, show chat interface screen
        newConversationScreen.style.display = 'none';
        chatInterfaceScreen.style.display = 'flex'; 
        
        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();
            // MODIFIED: Robustly get output and handle empty/null
            const botOutput = Array.isArray(responseData) && responseData.length > 0 && responseData[0].output ? responseData[0].output : (responseData.output || '');

            if (botOutput.trim().length > 0) { // Only add message if output is not empty
                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'chat-message bot';
                botMessageDiv.innerHTML = renderMarkdown(botOutput); // MODIFIED: Render Markdown
                messagesContainer.appendChild(botMessageDiv);
            }
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error starting new conversation:', error);
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.className = 'chat-message bot';
            errorMessageDiv.textContent = 'Sorry, I\'m having trouble starting a conversation right now. Please try again later.';
            messagesContainer.appendChild(errorMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            // Revert to initial screen if conversation failed to start
            newConversationScreen.style.display = 'flex';
            chatInterfaceScreen.style.display = 'none';
            currentSessionId = ''; // Reset session ID if it failed to start
        }
    }

    async function sendMessage(message) {
        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route,
            chatInput: message,
            metadata: {
                userId: ""
            }
        };

        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });
            
            const data = await response.json();
            // MODIFIED: Robustly get output and handle empty/null
            const botOutput = Array.isArray(data) && data.length > 0 && data[0].output ? data[0].output : (data.output || '');
            
            if (botOutput.trim().length > 0) { // Only add message if output is not empty
                const botMessageDiv = document.createElement('div');
                botMessageDiv.className = 'chat-message bot';
                botMessageDiv.innerHTML = renderMarkdown(botOutput); // MODIFIED: Render Markdown
                messagesContainer.appendChild(botMessageDiv);
            }
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.className = 'chat-message bot';
            errorMessageDiv.textContent = 'Sorry, I\'m having trouble responding right now.';
            messagesContainer.appendChild(errorMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    newChatBtn.addEventListener('click', startNewConversation);
    
    // Listener per i pulsanti delle domande rapide
    quickQuestionButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const question = button.dataset.question; 

            if (!currentSessionId) {
                // Se non c'è una sessione attiva, avviane una nuova.
                await startNewConversation(); 
                // Se startNewConversation fallisce, la sessione non sarà impostata e l'esecuzione si fermerà qui.
                if (!currentSessionId) {
                    return; // Exit if conversation failed to start
                }
            }
            
            // Invia la domanda rapida come messaggio dell'utente
            sendMessage(question);

            // Assicurati che l'interfaccia di chat sia mostrata (redundante se startNewConversation ha successo, ma sicuro)
            newConversationScreen.style.display = 'none';
            chatInterfaceScreen.style.display = 'flex';
        });
    });

    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('open');
    });

    // Add close button handlers (MODIFIED to use confirmation modal)
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            showConfirmationModal(
                "Conferma chiusura",
                "Stai chiudendo la conversazione. I dati non verranno salvati. Continuare?",
                "Sì, chiudi",
                () => { // This is the onConfirm callback
                    chatContainer.classList.remove('open');
                    newConversationScreen.style.display = 'flex';
                    chatInterfaceScreen.style.display = 'none';
                    messagesContainer.innerHTML = ''; // Clear messages
                    currentSessionId = ''; // Reset session ID
                }
            );
        });
    });

    // NEW: Add event listener for logo click (uses confirmation modal)
    if (brandLogoLink) { // Check if the element exists
        brandLogoLink.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior (redirect immediately)
            showConfirmationModal(
                "Conferma navigazione",
                "Stai chiudendo la conversazione. I dati non verranno salvati. Continuare?",
                "Sì, vai alla home",
                () => { // This is the onConfirm callback
                    window.location.href = config.branding.homeLink || '/'; // Redirect to home
                }
            );
        });
    }

})(); 
