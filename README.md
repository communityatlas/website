# Kumu Laama Interface

A local web interface that displays Kumu and Laama side-by-side in a resizable split view.

## Features

- 🔀 **Split View** - Display Kumu and Laama side-by-side
- 📏 **Resizable Panels** - Drag the divider to adjust the split ratio
- ⚙️ **Configurable URLs** - Set your Kumu and Laama URLs via settings
- 🔄 **Refresh Controls** - Refresh individual panels
- ⛶ **Fullscreen Mode** - Toggle fullscreen for either panel
- 💾 **Persistent Settings** - Your configuration is saved locally
- 📱 **Responsive Design** - Works on different screen sizes

## Getting Started

### Option 1: Direct File Access
Simply open `index.html` in your web browser. However, note that some browsers may block iframes from loading external/local content due to security restrictions.

### Option 2: Local Server (Recommended)
For best results, especially when accessing localhost URLs, use a local web server:

#### Using Python:
```bash
# Python 3
python3 -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Using Node.js (http-server):
```bash
npx http-server -p 8000
```

#### Using PHP:
```bash
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Configuration

### Using the Settings Page
1. Open the website
2. Click "Settings" in the navigation
3. Enter your URLs:
   - **Kumu URL**: The external Kumu website URL (e.g., `https://kumu.io`)
   - **Laama URL**: Your local Laama instance URL (e.g., `http://localhost:3000`)
4. Adjust the split ratio slider (20-80%)
5. Click "Save & Load"

### Default Configuration
The default configuration is:
- Kumu URL: `https://kumu.io`
- Laama URL: `http://localhost:3000`
- Split Ratio: 50/50

Your settings are automatically saved in browser localStorage and will persist between sessions.

## Usage

### Split View
- The main view shows both Kumu and Laama side-by-side
- Each panel has a header with controls

### Resizing Panels
- **Drag the divider** between panels to adjust the split ratio
- Or use the **slider in Settings** to set a specific ratio

### Panel Controls
- **🔄 Refresh**: Reload the iframe for that panel
- **⛶ Fullscreen**: Toggle fullscreen mode for that panel (press again to exit)

### Settings
- Configure URLs and split ratio
- Settings are saved automatically
- Changes take effect immediately

## Files Structure

- `index.html` - Main HTML structure with split-view interface
- `styles.css` - Styling and responsive design
- `script.js` - Split-view functionality, settings management, and iframe controls
- `config.example.js` - Example configuration (reference only)

## Troubleshooting

### Iframes Not Loading
- **CORS Issues**: Some websites block embedding in iframes. You may need to check if the target sites allow iframe embedding.
- **Localhost Access**: Make sure your Laama instance is running and accessible at the configured URL.
- **Mixed Content**: If accessing via HTTPS, localhost HTTP URLs may be blocked. Use a local server or configure HTTPS for your local instance.

### Local Server Required
For accessing `localhost` URLs, you must access this interface through a local web server, not via `file://` protocol.

## Browser Support

Works on all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## License

Free to use and modify as needed.

