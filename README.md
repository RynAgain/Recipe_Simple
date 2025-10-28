# Recipe Tools - Whole Foods Edition

🛠️ **Nutrition and recipe text processing tools with Whole Foods Market branding**

A modular Tampermonkey userscript featuring a draggable, hidable UI with multiple tools for recipe and nutrition work.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Tampermonkey](https://img.shields.io/badge/tampermonkey-4.x+-orange)

---

## ✨ Features

### 🔢 Unit Converter
- **Volume**: tsp, tbsp, fl oz, cup, pt, qt, gal, ml, L
- **Weight**: oz, lb, g, kg
- **Temperature**: °F, °C, K
- Real-time conversion as you type
- Swap button for quick reverse conversions

### 📝 Recipe Simplifier
- Fix capitalization and bracket formatting
- Balance nested parentheses and brackets
- Remove water, simplify salt types
- Remove organic labels and GMO text
- Based on legacy VBA formatting logic
- One-click copy to clipboard

### 🎨 Whole Foods Theme
- Professional green (#00674F) and orange (#FF6F00) color scheme
- Clean, modern interface design
- Smooth animations and transitions

### 🖱️ Draggable Interface
- Position panel anywhere on screen
- Persistent position storage
- Minimize/maximize controls
- Show/hide with trigger button

### 🔄 Auto-Update System
- Automatic version checking (every 24 hours)
- Manual update check button
- User control: Update Now, Remind Later, or Skip Version

### 🔌 Extensible Architecture
- Plugin-based tool registration
- Easy to add new tools
- Modular file structure
- Well-documented code

---

## 📦 Installation

### Quick Install (Local Development)

1. **Install Tampermonkey** in your browser
2. **Open Tampermonkey Dashboard** → Create new script
3. **Copy [`MainScript.user.js`](MainScript.user.js)** and paste into editor
4. **Save** (Ctrl+S)
5. **Visit any website** - look for green 🛠️ button in bottom-right

**Detailed instructions**: See [`INSTALLATION.md`](INSTALLATION.md)

### GitHub Install (Production)

```
https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/MainScript.user.js
```

Install via Tampermonkey Dashboard → Utilities → Install from URL

---

## 🚀 Quick Start

1. **Click the green button** (🛠️) in bottom-right corner
2. **Choose a tool** from the tabs:
   - 🔢 Unit Converter
   - 📝 Recipe Simplifier
3. **Drag the panel** by the green header to reposition
4. **Use the tools** - they're intuitive and self-explanatory!

**Full guide**: See [`USER_GUIDE.md`](USER_GUIDE.md)

---

## 📁 Project Structure

```
Recipe_Simple/
├── MainScript.user.js              # Main orchestrator script
├── modules/
│   ├── Wholefoods-Theme.js         # Color scheme and styling
│   ├── UI-Core.js                  # Draggable UI framework
│   ├── UnitConverter.js            # Unit conversion tool
│   └── RecipeSimplifier.js         # Recipe text processor
├── docs/
│   ├── TECHNICAL_SPECIFICATION.md  # Technical details
│   ├── ARCHITECTURE_PLAN.md        # System architecture
│   ├── EXTENSIBILITY_GUIDE.md      # Adding new tools
│   ├── USER_GUIDE.md               # User documentation
│   └── INSTALLATION.md             # Installation guide
├── Legacy-Format-VBA.txt           # Original VBA logic
└── README.md                        # This file
```

---

## 🎯 Use Cases

### For Recipe Developers
- Convert recipe measurements between metric and imperial
- Standardize ingredient list formatting
- Clean up vendor-provided recipe text
- Ensure consistent capitalization

### For Nutrition Teams
- Quick unit conversions for nutrition facts
- Simplify ingredient statements
- Remove unnecessary qualifiers
- Format for label compliance

### For Content Creators
- Convert measurements for different audiences
- Clean up scraped recipe data
- Standardize formatting across recipes
- Prepare text for publication

---

## 🔧 Adding New Tools

Recipe Tools is designed to be easily extensible. Adding a new tool is simple:

1. **Create a new module file** in `modules/YourTool.js`
2. **Use the tool template** from [`EXTENSIBILITY_GUIDE.md`](EXTENSIBILITY_GUIDE.md)
3. **Add one `@require` line** to [`MainScript.user.js`](MainScript.user.js)
4. **Done!** Your tool automatically appears as a new tab

**Example tools you could add**:
- 🍳 Recipe Scaler (scale servings up/down)
- 🔄 Ingredient Substitution Finder
- 📊 Nutrition Calculator
- 📝 Shopping List Generator
- ⏱️ Recipe Timer

**Full guide**: See [`EXTENSIBILITY_GUIDE.md`](EXTENSIBILITY_GUIDE.md)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`USER_GUIDE.md`](USER_GUIDE.md) | Complete user documentation with examples |
| [`INSTALLATION.md`](INSTALLATION.md) | Step-by-step installation instructions |
| [`TECHNICAL_SPECIFICATION.md`](TECHNICAL_SPECIFICATION.md) | Technical details and specifications |
| [`ARCHITECTURE_PLAN.md`](ARCHITECTURE_PLAN.md) | System architecture and design |
| [`EXTENSIBILITY_GUIDE.md`](EXTENSIBILITY_GUIDE.md) | How to add new tools |

---

## 🛠️ Development

### Prerequisites
- Node.js (for testing, optional)
- Git
- Text editor (VS Code recommended)
- Tampermonkey extension

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/RynAgain/Recipe_Simple.git
cd Recipe_Simple

# Edit files in your preferred editor
code .

# Install in Tampermonkey using local file:/// URLs
# See INSTALLATION.md for details
```

### File Watching (Optional)

For development, you can use Tampermonkey's file watching feature:
1. Enable "Allow access to file URLs" in Tampermonkey settings
2. Use `file:///` URLs in `@require` directives
3. Changes to module files reload automatically

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Trigger button appears on all websites
- [ ] Panel shows/hides correctly
- [ ] Panel is draggable and position persists
- [ ] Both tabs switch correctly
- [ ] Unit Converter: All conversion types work
- [ ] Unit Converter: Swap button works
- [ ] Recipe Simplifier: All options work
- [ ] Recipe Simplifier: Copy button works
- [ ] Update check works (manual and auto)
- [ ] No console errors

### Test Data

**Unit Converter**:
- 1 cup → 236.59 ml
- 8 oz → 226.80 g
- 350°F → 176.67°C

**Recipe Simplifier**:
```
Input: organic tomatoes (diced), sea salt, filtered water, *non-gmo corn
Output: Organic Tomatoes (diced), Salt, Corn
```

---

## 🤝 Contributing

Contributions are welcome! Here's how:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-tool`
3. **Make your changes** following the existing code style
4. **Test thoroughly** using the checklist above
5. **Commit**: `git commit -m 'Add amazing tool'`
6. **Push**: `git push origin feature/amazing-tool`
7. **Open a Pull Request**

### Code Style
- Use ES6+ features
- Follow existing naming conventions
- Add JSDoc comments for functions
- Keep modules self-contained (IIFE pattern)
- Test in multiple browsers

---

## 📝 License

MIT License - see LICENSE file for details

---

## 👤 Author

**RynAgain**
- GitHub: [@RynAgain](https://github.com/RynAgain)

---

## 🙏 Acknowledgments

- **Whole Foods Market** - Color palette and design inspiration
- **Legacy VBA System** - Recipe formatting logic
- **Tampermonkey Community** - Multi-file architecture patterns

---

## 📊 Version History

### v1.0.0 (2024-10-28)
- ✨ Initial release
- 🔢 Unit Converter tool
- 📝 Recipe Simplifier tool
- 🎨 Whole Foods themed UI
- 🖱️ Draggable interface
- 🔄 Auto-update system
- 🔌 Extensible architecture

---

## 🐛 Known Issues

None currently. Please report issues on GitHub!

---

## 🔮 Roadmap

### v1.1.0 (Planned)
- [ ] Recipe Scaler tool
- [ ] Keyboard shortcuts
- [ ] Dark mode option
- [ ] Export/import settings

### v1.2.0 (Planned)
- [ ] Ingredient substitution database
- [ ] Nutrition calculator
- [ ] Shopping list generator

### Future
- [ ] Mobile-responsive design
- [ ] Multi-language support
- [ ] Cloud sync for settings

---

## 💬 Support

- **Documentation**: Check the docs/ folder
- **Issues**: [GitHub Issues](https://github.com/RynAgain/Recipe_Simple/issues)
- **Questions**: Open a discussion on GitHub

---

## ⭐ Show Your Support

If you find this tool useful, please:
- ⭐ Star this repository
- 🐛 Report bugs
- 💡 Suggest features
- 🤝 Contribute code

---

**Happy cooking! 🛠️👨‍🍳**
