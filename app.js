// ========================================
// Configuration
// ========================================
const CONFIG = {
    apiEndpoint: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'x-ai/grok-beta',
    // API key will be injected by GitHub Actions
    apiKey: window.OPENROUTER_API_KEY || '',
    updateInterval: 24 * 60 * 60 * 1000, // 24 hours
    cacheKey: 'market_intelligence_data',
    lastUpdateKey: 'last_update_time'
};

// ========================================
// Service Worker Registration (PWA)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('✅ Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('❌ Service Worker registration failed:', error);
            });
    });
}

// ========================================
// PWA Install Prompt
// ========================================
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install prompt after a delay
    setTimeout(() => {
        showInstallPrompt();
    }, 5000);
});

function showInstallPrompt() {
    const installPrompt = document.getElementById('install-prompt');
    if (installPrompt && deferredPrompt) {
        installPrompt.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('install-btn');
    const dismissBtn = document.getElementById('dismiss-install');
    const installPrompt = document.getElementById('install-prompt');
    
    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response: ${outcome}`);
                deferredPrompt = null;
                installPrompt.style.display = 'none';
            }
        });
    }
    
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            installPrompt.style.display = 'none';
        });
    }
});

// ========================================
// Data Management
// ========================================
class DataManager {
    static saveToCache(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            localStorage.setItem(CONFIG.lastUpdateKey, Date.now().toString());
        } catch (error) {
            console.error('Error saving to cache:', error);
        }
    }
    
    static getFromCache(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from cache:', error);
            return null;
        }
    }
    
    static getLastUpdateTime() {
        const timestamp = localStorage.getItem(CONFIG.lastUpdateKey);
        return timestamp ? parseInt(timestamp) : null;
    }
    
    static shouldUpdate() {
        const lastUpdate = this.getLastUpdateTime();
        if (!lastUpdate) return true;
        
        const timeSinceUpdate = Date.now() - lastUpdate;
        return timeSinceUpdate >= CONFIG.updateInterval;
    }
}

// ========================================
// OpenRouter API Integration
// ========================================
class AIService {
    static async fetchInsights(prompt) {
        if (!CONFIG.apiKey) {
            console.warn('⚠️ OpenRouter API key not configured. Using demo data.');
            return this.getDemoData();
        }
        
        try {
            const response = await fetch(CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.apiKey}`,
                    'HTTP-Referer': window.location.origin,
                    'X-Title': 'Market Intelligence Dashboard'
                },
                body: JSON.stringify({
                    model: CONFIG.model,
                    messages: [{
                        role: 'user',
                        content: prompt
                    }],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error fetching AI insights:', error);
            return this.getDemoData();
        }
    }
    
    static async generateDailyDigest() {
        const prompt = `Generate a comprehensive market intelligence digest for today (${new Date().toLocaleDateString()}). Include:

1. **Market Overview**: Current market sentiment and key trends
2. **Top 3 Insights**: Critical developments across finance, technology, and global markets
3. **Opportunities**: Emerging opportunities worth monitoring
4. **Risk Factors**: Key risks and challenges to watch

Format the response in clean, structured markdown suitable for display on a dashboard.`;
        
        const content = await this.fetchInsights(prompt);
        return this.parseDigestContent(content);
    }
    
    static async generateInsights(category = 'all') {
        const prompt = `Generate 5 actionable market insights for the category "${category}". Each insight should include:
- A clear, concise title
- A brief summary (2-3 sentences)
- Category tag
- Timestamp

Focus on: market analysis, emerging trends, technology developments, economic indicators, and investment opportunities.

Return as a JSON array with this structure:
[
  {
    "title": "Insight title",
    "summary": "Brief description",
    "category": "market|tech|finance|trends",
    "timestamp": "time ago format"
  }
]`;
        
        const content = await this.fetchInsights(prompt);
        return this.parseInsightsContent(content);
    }
    
    static parseDigestContent(content) {
        // Clean and format the AI response
        return content.replace(/```markdown\n?/g, '').replace(/```\n?/g, '');
    }
    
    static parseInsightsContent(content) {
        try {
            // Extract JSON from markdown code blocks if present
            const jsonMatch = content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
            const jsonStr = jsonMatch ? jsonMatch[1] : content;
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error('Error parsing insights:', error);
            return this.getDemoInsights();
        }
    }
    
    static getDemoData() {
        return `# Daily Market Intelligence Digest
*${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}*

## 📊 Market Overview
Global markets are showing resilience amid economic headwinds. Technology sector leads with 2.3% gains, while traditional energy faces headwinds from policy shifts.

## 💡 Top 3 Insights

### 1. AI Investment Surge Continues
Major tech companies are doubling down on AI infrastructure investments, with over $50B allocated in Q4 alone. This trend is creating ripple effects across semiconductor and cloud computing sectors.

### 2. Renewable Energy Breakthrough
New battery technology promises 40% cost reduction, potentially accelerating EV adoption and grid storage solutions. Watch for market movements in related sectors.

### 3. Emerging Market Recovery
Select emerging markets are showing strong recovery signals, particularly in Southeast Asia and Latin America, driven by manufacturing reshoring trends.

## 🎯 Opportunities
- **Technology**: AI chip manufacturers showing strong growth indicators
- **Energy**: Grid modernization projects opening new investment channels
- **Consumer**: E-commerce platforms expanding into underserved markets

## ⚠️ Risk Factors
- Geopolitical tensions affecting supply chains
- Interest rate uncertainty impacting growth stocks
- Regulatory changes in tech sector globally

---
*Generated by Grok AI • Next update in 24 hours*`;
    }
    
    static getDemoInsights() {
        return [
            {
                title: 'Quantum Computing Breakthrough Impacts Cybersecurity Stocks',
                summary: 'Recent advancements in quantum computing have significant implications for cybersecurity firms. Companies developing quantum-resistant encryption are seeing increased investor interest.',
                category: 'tech',
                timestamp: '2 hours ago'
            },
            {
                title: 'Green Hydrogen Market Poised for Exponential Growth',
                summary: 'Analysis suggests the green hydrogen market could reach $200B by 2030. Major energy companies are announcing strategic partnerships and infrastructure investments.',
                category: 'market',
                timestamp: '4 hours ago'
            },
            {
                title: 'Central Banks Signal Policy Shifts',
                summary: 'Multiple central banks are hinting at policy adjustments in response to inflation trends. This could create volatility in currency markets and impact international trade.',
                category: 'finance',
                timestamp: '6 hours ago'
            },
            {
                title: 'Consumer Behavior Shifts Favor Sustainability',
                summary: 'New data reveals 67% of consumers willing to pay premium for sustainable products. This trend is reshaping retail and manufacturing strategies across industries.',
                category: 'trends',
                timestamp: '8 hours ago'
            },
            {
                title: 'Semiconductor Supply Chain Diversification Accelerates',
                summary: 'Tech giants are investing billions in regional chip production. This shift could reduce supply chain risks but may impact short-term margins.',
                category: 'market',
                timestamp: '10 hours ago'
            }
        ];
    }
}

// ========================================
// UI Controller
// ========================================
class UIController {
    static hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen && app) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                app.style.display = 'block';
            }, 1500);
        }
    }
    
    static updateLastUpdateTime() {
        const element = document.getElementById('last-updated');
        const lastUpdate = DataManager.getLastUpdateTime();
        
        if (element && lastUpdate) {
            const date = new Date(lastUpdate);
            element.innerHTML = `
                <span class="status-indicator"></span>
                Last updated: ${date.toLocaleString()}
            `;
        }
    }
    
    static updateStats(data) {
        const stats = {
            trends: data.insights?.length || 5,
            insights: Math.floor(Math.random() * 20) + 15,
            updates: Math.floor(Math.random() * 50) + 30,
            sentiment: ['Bullish 📈', 'Neutral ➡️', 'Bearish 📉'][Math.floor(Math.random() * 3)]
        };
        
        document.getElementById('trends-count').textContent = stats.trends;
        document.getElementById('insights-count').textContent = stats.insights;
        document.getElementById('updates-count').textContent = stats.updates;
        document.getElementById('sentiment-value').textContent = stats.sentiment;
        
        // Remove shimmer effect
        document.querySelectorAll('.stat-card.shimmer').forEach(card => {
            card.classList.remove('shimmer');
        });
    }
    
    static renderDigest(content) {
        const digestContent = document.getElementById('digest-content');
        if (digestContent) {
            // Convert markdown to HTML (simple implementation)
            const html = this.markdownToHTML(content);
            digestContent.innerHTML = html;
        }
    }
    
    static renderInsights(insights) {
        const insightsFeed = document.getElementById('insights-feed');
        if (!insightsFeed) return;
        
        insightsFeed.innerHTML = insights.map(insight => `
            <div class="insight-card" data-category="${insight.category}">
                <div class="insight-header">
                    <span class="insight-category">${insight.category}</span>
                    <span class="insight-time">${insight.timestamp}</span>
                </div>
                <h3 class="insight-title">${insight.title}</h3>
                <p class="insight-summary">${insight.summary}</p>
            </div>
        `).join('');
    }
    
    static markdownToHTML(markdown) {
        return markdown
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h3>$1</h3>')
            .replace(/^# (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(?!<[h|u|l])(.*$)/gim, '<p>$1</p>')
            .replace(/<p><\/p>/g, '');
    }
    
    static filterInsights(category) {
        const cards = document.querySelectorAll('.insight-card');
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// ========================================
// App Initialization
// ========================================
class App {
    static async init() {
        console.log('🚀 Initializing Market Intelligence Dashboard...');
        
        // Check if we should update or use cached data
        const shouldUpdate = DataManager.shouldUpdate();
        let data = DataManager.getFromCache(CONFIG.cacheKey);
        
        if (shouldUpdate || !data) {
            console.log('📡 Fetching fresh data from AI...');
            data = await this.fetchFreshData();
            DataManager.saveToCache(CONFIG.cacheKey, data);
        } else {
            console.log('💾 Using cached data...');
        }
        
        // Render UI
        UIController.updateStats(data);
        UIController.renderDigest(data.digest);
        UIController.renderInsights(data.insights);
        UIController.updateLastUpdateTime();
        UIController.hideLoading();
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Dashboard ready!');
    }
    
    static async fetchFreshData() {
        const [digest, insights] = await Promise.all([
            AIService.generateDailyDigest(),
            AIService.generateInsights()
        ]);
        
        return { digest, insights };
    }
    
    static setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                refreshBtn.classList.add('spinning');
                const data = await this.fetchFreshData();
                DataManager.saveToCache(CONFIG.cacheKey, data);
                UIController.renderDigest(data.digest);
                UIController.renderInsights(data.insights);
                UIController.updateLastUpdateTime();
                setTimeout(() => refreshBtn.classList.remove('spinning'), 1000);
            });
        }
        
        // Filter select
        const filterSelect = document.getElementById('filter-select');
        if (filterSelect) {
            filterSelect.addEventListener('change', (e) => {
                UIController.filterInsights(e.target.value);
            });
        }
        
        // Settings button (placeholder)
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                alert('Settings panel coming soon!');
            });
        }
    }
}

// ========================================
// Start the App
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// ========================================
// Auto-update check
// ========================================
setInterval(() => {
    if (DataManager.shouldUpdate()) {
        console.log('🔄 Auto-updating dashboard...');
        App.init();
    }
}, 60 * 60 * 1000); // Check every hour
