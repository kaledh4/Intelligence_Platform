# 🚀 Market Intelligence Dashboard

[![Daily Updates](https://github.com/yourusername/MARKET_K/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/MARKET_K/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue)](https://yourusername.github.io/MARKET_K/)
[![PWA](https://img.shields.io/badge/PWA-Ready-success)](https://web.dev/progressive-web-apps/)

> AI-Powered Market Intelligence Dashboard with Daily Updates from Grok

## ✨ Features

- 📊 **Real-time Market Intelligence** - Powered by xAI Grok
- 🤖 **Daily AI Digests** - Automated updates every 24 hours via GitHub Actions
- 📱 **Progressive Web App** - Install on any device, works offline
- 🎨 **Modern UI/UX** - Sleek dark theme with smooth animations
- ⚡ **Lightning Fast** - Optimized performance with smart caching
- 🔒 **Secure** - API keys stored in GitHub Secrets
- 🌐 **GitHub Pages** - Free hosting, zero maintenance

## 🎯 What You Get

### Daily Content
- **Market Overview** - Current sentiment and key trends
- **Top Insights** - Critical developments across sectors
- **Opportunities** - Emerging trends worth monitoring
- **Risk Factors** - Key challenges to watch

### Real-time Features
- AI-generated market analysis
- Categorized insights (Market, Tech, Finance, Trends)
- Filterable content feed
- Manual refresh capability
- Offline support

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/MARKET_K.git
cd MARKET_K
```

### 2. Set Up GitHub Secrets

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add a secret named `OPENROUTER_API_KEY` with your OpenRouter API key

**How to get an OpenRouter API Key:**
1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Go to [API Keys](https://openrouter.ai/keys)
4. Create a new API key
5. Copy and paste it into your GitHub Secret

### 3. Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

### 4. Trigger the Workflow

The workflow will automatically:
- Run daily at 6 AM UTC
- Run on every push to `main`
- Can be manually triggered from the Actions tab

To manually trigger:
1. Go to the **Actions** tab
2. Select **Daily AI Updates & Deploy to GitHub Pages**
3. Click **Run workflow**

## 📱 Install as PWA

### Desktop (Chrome/Edge)
1. Visit your GitHub Pages URL
2. Look for the install icon in the address bar
3. Click **Install**

### Mobile (iOS)
1. Open in Safari
2. Tap the Share button
3. Select **Add to Home Screen**

### Mobile (Android)
1. Open in Chrome
2. Tap the menu (three dots)
3. Select **Install app** or **Add to Home Screen**

## 🛠️ Configuration

### Customize Update Schedule

Edit `.github/workflows/deploy.yml`:

```yaml
schedule:
  - cron: '0 6 * * *'  # Daily at 6 AM UTC
```

Examples:
- Every 12 hours: `0 */12 * * *`
- Twice daily: `0 6,18 * * *`
- Weekly: `0 6 * * 0`

### Change AI Model

Edit `app.js`:

```javascript
const CONFIG = {
    model: 'x-ai/grok-beta',  // Change to any OpenRouter model
    // ...
};
```

Available models:
- `x-ai/grok-beta` - Grok (default)
- `openai/gpt-4-turbo` - GPT-4 Turbo
- `anthropic/claude-3-opus` - Claude 3 Opus
- `google/gemini-pro` - Gemini Pro

## 📁 Project Structure

```
MARKET_K/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── icons/
│   ├── icon-192.png           # PWA icon (192x192)
│   └── icon-512.png           # PWA icon (512x512)
├── index.html                 # Main HTML
├── styles.css                 # Styling
├── app.js                     # Application logic
├── manifest.json              # PWA manifest
├── service-worker.js          # Service worker for offline support
└── README.md                  # This file
```

## 🔧 Local Development

### Run Locally

Simply open `index.html` in your browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

Visit `http://localhost:8000`

### Testing PWA Features

PWA features (like offline mode) require HTTPS. Use one of these:

1. **GitHub Pages** (recommended) - Automatic HTTPS
2. **ngrok** - Create HTTPS tunnel
   ```bash
   npx ngrok http 8000
   ```
3. **localhost** - Chrome treats localhost as secure

## 🎨 Customization

### Change Theme Colors

Edit `styles.css`:

```css
:root {
    --color-accent-primary: #00d4ff;    /* Main accent color */
    --color-accent-secondary: #7b2ff7;  /* Secondary accent */
    --color-bg-primary: #0f0f1e;        /* Background */
}
```

### Add Custom Insights Categories

Edit `app.js`:

```javascript
// Add to filter select in index.html
<option value="custom">Custom Category</option>

// Filter will work automatically
```

## 📊 Monitoring

### Check Workflow Status

1. Go to the **Actions** tab on GitHub
2. View workflow runs and logs
3. Check for any errors in the deployment

### View Deployment Stats

GitHub Pages provides basic analytics:
1. Go to **Insights** → **Traffic**
2. View page views and unique visitors

## 🔒 Security

- ✅ API keys stored in GitHub Secrets (never in code)
- ✅ HTTPS enforced by GitHub Pages
- ✅ No server-side code (static site = secure)
- ✅ Service Worker follows security best practices
- ✅ Content Security Policy ready

## 🌟 Features Roadmap

- [ ] User authentication
- [ ] Personalized dashboards
- [ ] Email notifications
- [ ] Multi-language support
- [ ] Data export (PDF/CSV)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Custom AI prompts

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### PWA Not Installing
- Ensure you're using HTTPS (GitHub Pages provides this)
- Check that `manifest.json` is valid
- Verify service worker is registered (check DevTools → Application)

### API Requests Failing
- Verify `OPENROUTER_API_KEY` secret is set correctly
- Check OpenRouter account has credits
- Review GitHub Actions logs for errors

### Daily Updates Not Working
- Ensure GitHub Actions is enabled in repository settings
- Check workflow file syntax
- Verify the workflow has necessary permissions

### GitHub Pages Not Deploying
- Enable GitHub Pages in Settings → Pages
- Select "GitHub Actions" as the source
- Wait a few minutes after first workflow run

## 📞 Support

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/MARKET_K/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/MARKET_K/discussions)

## 🙏 Acknowledgments

- **xAI** for Grok AI
- **OpenRouter** for API aggregation
- **GitHub** for free hosting and CI/CD
- **Open source community** for amazing tools

---

<div align="center">

**[🌐 Live Demo](https://yourusername.github.io/MARKET_K/)** • **[📖 Documentation](https://github.com/yourusername/MARKET_K/wiki)** • **[⭐ Star on GitHub](https://github.com/yourusername/MARKET_K)**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>
