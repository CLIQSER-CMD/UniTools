// Universal Tools Hub - Main JavaScript

// Global variables
let allTools = [];
let filteredTools = [];
let currentCategory = null;
let currentPlatform = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Load tools data
        await loadToolsData();
        
        // Initialize event listeners
        initializeEventListeners();
        
        // Load recent tools on homepage
        if (document.getElementById('recentTools')) {
            loadRecentTools();
        }
        
        // Initialize search functionality
        if (document.getElementById('globalSearch')) {
            initializeSearch();
        }
        
        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
    }
}

// Event Listeners
function initializeEventListeners() {
    // Category cards click
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            window.location.href = `category/${category}-tools.html`;
        });
    });
    
    // Platform cards click
    const platformCards = document.querySelectorAll('.platform-card');
    platformCards.forEach(card => {
        card.addEventListener('click', () => {
            const platform = card.dataset.platform;
            window.location.href = `platform/${platform}-tools.html`;
        });
    });
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (!link.href.includes('#')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = link.href;
            });
        }
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('globalSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length === 0) {
        filteredTools = allTools;
    } else {
        filteredTools = allTools.filter(tool => 
            tool.name.toLowerCase().includes(query) ||
            tool.description.toLowerCase().includes(query) ||
            tool.category.toLowerCase().includes(query) ||
            tool.platforms.some(platform => platform.toLowerCase().includes(query))
        );
    }
    
    displaySearchResults(filteredTools);
}

function performSearch() {
    const query = document.getElementById('globalSearch').value.trim();
    if (query) {
        window.location.href = `search.html?q=${encodeURIComponent(query)}`;
    }
}

function displaySearchResults(results) {
    const recentToolsContainer = document.getElementById('recentTools');
    if (recentToolsContainer) {
        recentToolsContainer.innerHTML = '';
        
        if (results.length === 0) {
            recentToolsContainer.innerHTML = `
                <div class="no-results">
                    <p>No tools found matching your search.</p>
                </div>
            `;
            return;
        }
        
        results.slice(0, 12).forEach(tool => {
            const toolCard = createToolCard(tool);
            recentToolsContainer.appendChild(toolCard);
        });
    }
}

// Load and display recent tools
function loadRecentTools() {
    const recentTools = allTools
        .filter(tool => tool.isNew)
        .slice(0, 12);
    
    const container = document.getElementById('recentTools');
    if (container) {
        container.innerHTML = '';
        
        recentTools.forEach(tool => {
            const toolCard = createToolCard(tool);
            container.appendChild(toolCard);
        });
    }
}

// Create tool card element
function createToolCard(tool) {
    const card = document.createElement('a');
    card.href = `tools/${tool.id}.html`;
    card.className = 'tool-card';
    card.setAttribute('data-tool-id', tool.id);
    
    card.innerHTML = `
        <div class="tool-header">
            <div class="tool-icon">${tool.icon}</div>
            <h3 class="tool-title">${tool.name}</h3>
        </div>
        <p class="tool-description">${tool.description}</p>
        <div class="tool-meta">
            <span class="tool-category">${tool.category}</span>
            ${tool.platforms.map(platform => `<span class="tool-platforms">${platform}</span>`).join('')}
        </div>
    `;
    
    card.addEventListener('click', (e) => {
        e.preventDefault();
        openTool(tool.id);
    });
    
    return card;
}

// Open individual tool
function openTool(toolId) {
    window.location.href = `tools/${toolId}.html`;
}

// Utility functions
function debounce(func, wait) {
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

// Load tools data
async function loadToolsData() {
    try {
        const response = await fetch('data/tools.json');
        if (!response.ok) {
            throw new Error('Failed to load tools data');
        }
        const data = await response.json();
        allTools = data.tools;
        filteredTools = [...allTools];
    } catch (error) {
        console.error('Error loading tools data:', error);
        // Fallback to sample data if file doesn't exist
        allTools = getSampleTools();
        filteredTools = [...allTools];
    }
}

// Sample tools for development
function getSampleTools() {
    return [
        {
            id: 'text-counter',
            name: 'Text Counter',
            description: 'Count words, characters, sentences, and paragraphs in your text.',
            category: 'Text Tools',
            icon: '📝',
            platforms: ['General'],
            url: 'tools/text-counter.html',
            isNew: true
        },
        {
            id: 'json-formatter',
            name: 'JSON Formatter',
            description: 'Format, validate, and beautify your JSON data.',
            category: 'Developer Tools',
            icon: '📋',
            platforms: ['General'],
            url: 'tools/json-formatter.html',
            isNew: true
        },
        {
            id: 'qr-generator',
            name: 'QR Code Generator',
            description: 'Generate QR codes for text, URLs, and more.',
            category: 'Generators',
            icon: '📱',
            platforms: ['General'],
            url: 'tools/qr-generator.html',
            isNew: true
        },
        {
            id: 'calculator',
            name: 'Calculator',
            description: 'Basic and advanced calculator for all your math needs.',
            category: 'Calculators',
            icon: '🧮',
            platforms: ['General'],
            url: 'tools/calculator.html',
            isNew: true
        },
        {
            id: 'youtube-downloader',
            name: 'YouTube Downloader',
            description: 'Download YouTube videos in various formats and qualities.',
            category: 'Video Tools',
            icon: '📺',
            platforms: ['YouTube'],
            url: 'tools/youtube-downloader.html',
            isNew: false
        },
        {
            id: 'instagram-hashtag-generator',
            name: 'Instagram Hashtag Generator',
            description: 'Generate relevant hashtags for your Instagram posts.',
            category: 'Social Media',
            icon: '📷',
            platforms: ['Instagram'],
            url: 'tools/instagram-hashtag-generator.html',
            isNew: true
        }
    ];
}

// Category page functionality
function loadCategoryTools(category) {
    const categoryTools = allTools.filter(tool => 
        tool.category.toLowerCase().includes(category.toLowerCase())
    );
    
    const container = document.getElementById('categoryTools');
    if (container) {
        container.innerHTML = '';
        categoryTools.forEach(tool => {
            const toolCard = createToolCard(tool);
            container.appendChild(toolCard);
        });
    }
}

// Platform page functionality
function loadPlatformTools(platform) {
    const platformTools = allTools.filter(tool => 
        tool.platforms.some(p => p.toLowerCase().includes(platform.toLowerCase()))
    );
    
    const container = document.getElementById('platformTools');
    if (container) {
        container.innerHTML = '';
        platformTools.forEach(tool => {
            const toolCard = createToolCard(tool);
            container.appendChild(toolCard);
        });
    }
}

// Export functions for use in other modules
window.UniversalTools = {
    loadCategoryTools,
    loadPlatformTools,
    createToolCard,
    openTool
};