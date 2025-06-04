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
            display: none; /* Hidden by default, shown by toggle button */
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(133, 79, 255, 0.15);
            border: 1px solid rgba(133, 79, 255, 0.2);
            overflow: hidden;
            font-family: inherit;
            
            /* NEW: Make chat-container a flex container to manage its children screens */
            display: flex; 
            flex-direction: column;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex; /* Show when open */
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

        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
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
        .n8n-chat-widget .chat-interface-screen { /* Renamed from .chat-interface */
            display: none; /* Hidden by default */
            flex-direction: column;
            height: 100%; /* Take full height of parent */
            flex-grow: 1; /* Allow it to take available vertical space */
        }

        .n8n-chat-widget .chat-interface-screen.active { /* This class is no longer needed with new display logic */
            /* display: flex; */
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
    `;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // NEW: Load Marked.js for Markdown parsing
    const markedScript = document.createElement('script');
    markedScript.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
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
            }
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
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
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
            <img src="${config.branding.logo}" alt="${config.branding.name}">
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

    // Initial state: show new conversation screen, hide chat interface screen
    newConversationScreen.style.display = 'flex'; 
    chatInterfaceScreen.style.display = 'none';

    function generateUUID() {
        return crypto.randomUUID();
    }

    async function startNewConversation() {
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
        
        // IMPORTANT: Clear previous messages when starting a new conversation
        messagesContainer.innerHTML = ''; 

        try {
            // Make the call to n8n to initialize the session.
            // We DO NOT append a bot message here, as the actual first bot response
            // will come AFTER the user sends their first message via sendMessage().
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // We still need to parse the response to ensure it's valid JSON,
            // even if we don't display its 'output' immediately.
            const responseData = await response.json(); 
            // Optional: You could log responseData here to debug n8n's initial response.
            // console.log("n8n loadPreviousSession response:", responseData);

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
            messagesContainer.innerHTML = ''; // Clear messages again if error
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
        userMessageDiv.textContent = message; // User message is plain text
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
            
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            
            let botOutput = Array.isArray(data) && data.length > 0 ? data[0].output : (data.output || 'Sorry, I could not get a response.');
            
            // NEW: Parse Markdown for bot output
            // Check if marked is available (it should be, but good practice)
            if (typeof marked !== 'undefined') {
                botMessageDiv.innerHTML = marked.parse(botOutput);
            } else {
                // Fallback if marked.js fails to load
                botMessageDiv.textContent = botOutput;
            }
            
            messagesContainer.appendChild(botMessageDiv);
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

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
              chatContainer.classList.remove('open');
              // Optional: Reset chat to initial screen when closed
              newConversationScreen.style.display = 'flex';
              chatInterfaceScreen.style.display = 'none';
              messagesContainer.innerHTML = ''; // Clear messages
              currentSessionId = ''; // Reset session ID
        });
    });
})(); 
