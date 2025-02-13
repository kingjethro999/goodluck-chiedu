// Demo data
const demoUsers = [
    { id: 1, firstName: 'John', lastName: 'Doe', role: 'Student', profilePic: 'https://via.placeholder.com/40', lastMessage: 'Hey, how are you?' },
    { id: 2, firstName: 'Jane', lastName: 'Smith', role: 'Teacher', profilePic: 'https://via.placeholder.com/40', lastMessage: 'The assignment is due tomorrow' },
    { id: 3, firstName: 'Mike', lastName: 'Johnson', role: 'Student', profilePic: 'https://via.placeholder.com/40', lastMessage: 'Thanks for the help!' }
];

const demoMessages = {
    1: [
        { id: 1, sender: 1, text: 'Hey, how are you?', timestamp: '2024-02-09T10:00:00' },
        { id: 2, sender: 'currentUser', text: 'I\'m good, thanks! How about you?', timestamp: '2024-02-09T10:01:00' },
        { id: 3, sender: 1, text: 'Doing great! Did you finish the assignment?', timestamp: '2024-02-09T10:02:00' }
    ],
    2: [
        { id: 1, sender: 2, text: 'The assignment is due tomorrow', timestamp: '2024-02-09T09:00:00' },
        { id: 2, sender: 'currentUser', text: 'Yes, I\'m working on it now', timestamp: '2024-02-09T09:01:00' },
        { id: 3, sender: 2, text: 'Great, let me know if you need help', timestamp: '2024-02-09T09:02:00' }
    ],
    3: [
        { id: 1, sender: 3, text: 'Thanks for the help!', timestamp: '2024-02-09T08:00:00' },
        { id: 2, sender: 'currentUser', text: 'You\'re welcome!', timestamp: '2024-02-09T08:01:00' }
    ]
};

let currentChat = null;

// Create chat item element
function createChatItem(user) {
    const div = document.createElement('div');
    div.className = `chat-item ${currentChat === user.id ? 'active' : ''}`;
    div.dataset.userId = user.id; // Add data attribute for easier selection
    
    div.innerHTML = `
        <img src="${user.profilePic}" class="chat-item-avatar" alt="Profile">
        <div>
            <h6 class="mb-1">${user.firstName} ${user.lastName}</h6>
            <small class="text-muted">${user.lastMessage}</small>
        </div>
    `;
    
    // Add click event listener directly to the element
    div.addEventListener('click', () => selectChat(user.id));
    
    return div;
}

// Select a chat
function selectChat(userId) {
    currentChat = userId;
    const user = demoUsers.find(u => u.id === userId);
    
    if (!user) return;

    // Update active states
    document.querySelectorAll('.chat-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.chat-item[data-user-id="${userId}"]`).classList.add('active');

    // Update chat header
    const chatHeader = document.querySelector('.chat-header');
    chatHeader.classList.remove('d-none');
    chatHeader.innerHTML = `
        <div class="d-flex align-items-center">
            <img src="${user.profilePic}" class="chat-item-avatar" alt="Profile">
            <div>
                <h6 class="mb-1">${user.firstName} ${user.lastName}</h6>
                <small class="text-muted">${user.role}</small>
            </div>
        </div>
    `;

    // Show chat input and hide no chat selected message
    document.querySelector('.chat-input').classList.remove('d-none');
    document.querySelector('.no-chat-selected').style.display = 'none';
    
    // Load messages
    loadMessages(userId);
}

// Load messages for a chat
function loadMessages(userId) {
    const messagesContainer = document.getElementById('messageContainer');
    if (!messagesContainer) return;
    
    messagesContainer.innerHTML = '';
    
    const messages = demoMessages[userId] || [];
    messages.forEach(message => {
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);
    });
    
    scrollToBottom();
}

// Create message element
function createMessageElement(message) {
    const div = document.createElement('div');
    div.className = `message ${message.sender === 'currentUser' ? 'sent' : 'received'}`;
    
    const timestamp = new Date(message.timestamp);
    const timeString = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    div.innerHTML = `
        <div class="message-content">${message.text}</div>
        <small class="message-time">${timeString}</small>
    `;
    
    return div;
}

// Initialize recent chats
function loadRecentChats() {
    const chatListContainer = document.querySelector('.chat-list-container');
    if (!chatListContainer) return;
    
    chatListContainer.innerHTML = '';
    demoUsers.forEach(user => {
        const chatItem = createChatItem(user);
        chatListContainer.appendChild(chatItem);
    });
}

// Send a message
function sendMessage() {
    const input = document.getElementById('messageInput');
    if (!input) return;

    const message = input.value.trim();
    
    if (!message || !currentChat) return;
    
    // Create new message
    const newMessage = {
        id: Date.now(),
        sender: 'currentUser',
        text: message,
        timestamp: new Date().toISOString()
    };
    
    // Add to demo data
    if (!demoMessages[currentChat]) {
        demoMessages[currentChat] = [];
    }
    demoMessages[currentChat].push(newMessage);
    
    // Update UI
    const messagesContainer = document.getElementById('messageContainer');
    if (messagesContainer) {
        messagesContainer.appendChild(createMessageElement(newMessage));
    }
    
    // Clear input and scroll
    input.value = '';
    scrollToBottom();
    
    // Update last message in chat list
    updateLastMessage(currentChat, message);
}

// Update last message in chat list
function updateLastMessage(userId, message) {
    const user = demoUsers.find(u => u.id === userId);
    if (user) {
        user.lastMessage = message;
        loadRecentChats();
    }
}

// Scroll to bottom of messages
function scrollToBottom() {
    const container = document.getElementById('messageContainer');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

// Initialize everything when document is ready
document.addEventListener('DOMContentLoaded', () => {
    // Load initial chats
    loadRecentChats();
    
    // Setup message input handler
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Setup search handler
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredUsers = demoUsers.filter(user => 
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm)
            );
            
            const chatListContainer = document.querySelector('.chat-list-container');
            if (chatListContainer) {
                chatListContainer.innerHTML = '';
                filteredUsers.forEach(user => {
                    const chatItem = createChatItem(user);
                    chatListContainer.appendChild(chatItem);
                });
            }
        });
    }

    // Setup mobile sidebar handlers
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const closeSidebarBtn = document.querySelector('.close-sidebar');

    if (mobileToggle && sidebar && sidebarOverlay && closeSidebarBtn) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.add('show');
            sidebarOverlay.classList.add('show');
        });

        function closeSidebar() {
            sidebar.classList.remove('show');
            sidebarOverlay.classList.remove('show');
        }

        closeSidebarBtn.addEventListener('click', closeSidebar);
        sidebarOverlay.addEventListener('click', closeSidebar);
    }
});