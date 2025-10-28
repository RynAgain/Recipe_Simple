# Recipe Tools - User Guide

## 📖 Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Getting Started](#getting-started)
4. [Features](#features)
   - [Unit Converter](#unit-converter)
   - [Recipe Simplifier](#recipe-simplifier)
5. [Tips & Tricks](#tips--tricks)
6. [Troubleshooting](#troubleshooting)
7. [FAQ](#faq)

---

## Overview

**Recipe Tools** is a Tampermonkey userscript that provides nutrition and recipe text processing tools with Whole Foods Market branding. It features a draggable, hidable interface with multiple tools accessible through tabs.

### Key Features

- 🔢 **Unit Converter** - Convert between volume, weight, and temperature units
- 📝 **Recipe Simplifier** - Clean and format recipe ingredient lists
- 🎨 **Whole Foods Theme** - Professional green and orange color scheme
- 🖱️ **Draggable Interface** - Position the panel anywhere on screen
- 💾 **Persistent Settings** - Remembers your preferences and position
- 🔄 **Auto-Updates** - Automatic version checking from GitHub
- 🔌 **Extensible** - Easy to add new tools in the future

---

## Installation

### Prerequisites

1. **Web Browser**: Chrome, Firefox, or Edge
2. **Tampermonkey Extension**: Install from:
   - [Chrome Web Store](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### Installation Steps

#### Option 1: Local Installation (Development)

1. **Download the files** to your computer:
   ```
   Recipe_Simple/
   ├── MainScript.user.js
   └── modules/
       ├── Wholefoods-Theme.js
       ├── UI-Core.js
       ├── UnitConverter.js
       └── RecipeSimplifier.js
   ```

2. **Open Tampermonkey Dashboard**:
   - Click the Tampermonkey icon in your browser
   - Select "Dashboard"

3. **Create New Script**:
   - Click the "+" icon (Create a new script)
   - Delete the default template

4. **Copy MainScript.user.js**:
   - Open [`MainScript.user.js`](MainScript.user.js:1) in a text editor
   - Copy all contents
   - Paste into Tampermonkey editor
   - **Important**: Update the `@require` paths to use `file:///` URLs pointing to your local files:
     ```javascript
     // @require file:///C:/Users/YourName/Documents/Recipe_Simple/modules/Wholefoods-Theme.js
     // @require file:///C:/Users/YourName/Documents/Recipe_Simple/modules/UI-Core.js
     // etc.
     ```

5. **Save the Script**:
   - Click File → Save (or Ctrl+S)
   - The script should now be active

6. **Verify Installation**:
   - Visit any website
   - You should see a green circular button (🛠️) in the bottom-right corner

#### Option 2: GitHub Installation (Production)

*Note: This requires the files to be hosted on GitHub*

1. **Install from GitHub URL**:
   - Open Tampermonkey Dashboard
   - Click "Utilities" tab
   - Paste the GitHub raw URL in "Install from URL"
   - Example: `https://raw.githubusercontent.com/[user]/[repo]/main/MainScript.user.js`
   - Click "Install"

2. **Automatic Updates**:
   - The script will automatically check for updates every 24 hours
   - You can manually check by clicking the 🔄 button in the panel header

---

## Getting Started

### Opening the Panel

1. **Click the Trigger Button**:
   - Look for the green circular button (🛠️) in the bottom-right corner
   - Click it to show/hide the Recipe Tools panel

2. **Panel Layout**:
   ```
   ┌─────────────────────────────────────┐
   │ 🛠️ Recipe Tools        🔄 − ×      │ ← Header (drag to move)
   ├─────────────────────────────────────┤
   │ 🔢 Unit Converter | 📝 Recipe...   │ ← Tabs
   ├─────────────────────────────────────┤
   │                                     │
   │     Tool Content Area               │
   │                                     │
   └─────────────────────────────────────┘
   ```

3. **Header Controls**:
   - **🔄** - Check for updates
   - **−** - Minimize panel
   - **×** - Close panel

### Moving the Panel

1. **Click and Drag**:
   - Click on the green header bar
   - Drag to any position on the screen
   - Release to drop

2. **Position Persistence**:
   - Your chosen position is automatically saved
   - Panel will reappear in the same location next time

---

## Features

### Unit Converter

Convert between different units of measurement for cooking and recipes.

#### Supported Conversions

**Volume (US & Metric)**:
- Teaspoon (tsp), Tablespoon (tbsp), Fluid Ounce (fl oz)
- Cup, Pint (pt), Quart (qt), Gallon (gal)
- Milliliter (ml), Liter (L)

**Weight (US & Metric)**:
- Ounce (oz), Pound (lb)
- Gram (g), Kilogram (kg)

**Temperature**:
- Fahrenheit (°F), Celsius (°C), Kelvin (K)

#### How to Use

1. **Select Conversion Type**:
   - Choose from dropdown: Volume, Weight, or Temperature

2. **Enter Value**:
   - Type a number in the "From" field
   - Select the source unit from the dropdown

3. **Choose Target Unit**:
   - Select the desired unit in the "To" dropdown
   - Result appears automatically

4. **Swap Units**:
   - Click the "⇅ Swap" button to reverse the conversion

#### Examples

**Volume Conversion**:
```
From: 2 cups
To: 473.18 ml
```

**Weight Conversion**:
```
From: 8 oz
To: 226.80 g
```

**Temperature Conversion**:
```
From: 350 °F
To: 176.67 °C
```

#### Tips

- Results update in real-time as you type
- All conversions are accurate to 2 decimal places
- Use the swap button for quick reverse conversions

---

### Recipe Simplifier

Clean and format recipe ingredient lists according to Whole Foods standards.

#### What It Does

Based on legacy VBA formatting logic, the Recipe Simplifier:

1. **Fixes Capitalization**:
   - Capitalizes first letter of each ingredient
   - Keeps text inside parentheses lowercase
   - Example: `organic tomatoes (diced)` → `Organic Tomatoes (diced)`

2. **Balances Brackets**:
   - Converts `{` to `(` and `}` to `)`
   - Alternates between `()` and `[]` for nested items
   - Validates bracket matching

3. **Simplifies Ingredients**:
   - Removes unnecessary qualifiers
   - Standardizes common ingredients
   - Cleans up formatting

4. **Removes Clutter**:
   - Removes asterisks and GMO disclaimers
   - Optionally removes "organic" labels
   - Optionally removes water completely

#### How to Use

1. **Paste Recipe Text**:
   - Copy ingredient list from any source
   - Paste into the "Input Recipe Text" area

2. **Select Options**:
   - ☑ **Remove water** - Removes all water references
   - ☑ **Simplify salt types** - "Sea Salt" → "Salt"
   - ☐ **Remove "organic" labels** - Strips organic qualifiers
   - ☑ **Remove GMO-related text** - Removes asterisks and GMO text
   - ☑ **Fix capitalization and brackets** - Applies formatting rules

3. **Click "Simplify Recipe"**:
   - Processed text appears in the output area
   - Success message confirms completion

4. **Copy Result**:
   - Click "📋 Copy to Clipboard"
   - Paste into your target application

#### Examples

**Input**:
```
organic tomatoes (diced), sea salt, filtered water, *non-gmo corn, {organic basil}
```

**Output** (with default options):
```
Organic Tomatoes (diced), Salt, Corn, (Organic Basil)
```

**Input with Nested Brackets**:
```
flour {wheat [enriched (niacin, iron)]}, sugar
```

**Output**:
```
Flour (Wheat [Enriched (niacin, iron)]), Sugar
```

#### Simplification Rules

| Input | Output | Option |
|-------|--------|--------|
| `filtered water` | *removed* | Remove water |
| `purified water` | *removed* | Remove water |
| `Sea Salt` | `Salt` | Simplify salt |
| `Kosher Salt` | `Salt` | Simplify salt |
| `organic tomatoes` | `Tomatoes` | Remove organic |
| `*non-GMO corn` | `Corn` | Remove GMO |
| `**organic` | `**Organic` | Always fixed |

#### Error Messages

- **"Parentheses/brackets are unbalanced"**:
  - Check for missing opening or closing brackets
  - Ensure all `(` have matching `)`
  - Fix the input and try again

- **"Please enter some text to process"**:
  - Input field is empty
  - Paste or type some text first

---

## Tips & Tricks

### General Usage

1. **Keyboard Shortcuts**:
   - Tab through input fields
   - Enter to submit forms (where applicable)
   - Ctrl+A to select all text in fields

2. **Panel Management**:
   - Panel remembers if it was open or closed
   - Position is saved automatically
   - Settings persist across browser sessions

3. **Multiple Conversions**:
   - Keep the panel open while working
   - Switch between tabs without losing data
   - Each tool maintains its own state

### Unit Converter Tips

1. **Quick Conversions**:
   - Type value and immediately see result
   - No need to click a button
   - Use Tab to move between fields

2. **Common Conversions**:
   - 1 cup = 236.59 ml (≈ 240 ml)
   - 1 oz = 28.35 g (≈ 30 g)
   - 350°F = 176.67°C (≈ 180°C)

3. **Precision**:
   - Results show 2 decimal places
   - Trailing zeros are removed
   - Sufficient for cooking purposes

### Recipe Simplifier Tips

1. **Batch Processing**:
   - Process multiple ingredient lists
   - Copy output before processing next batch
   - Options stay selected between uses

2. **Formatting Best Practices**:
   - Always enable "Fix capitalization"
   - Check bracket balance before processing
   - Review output before copying

3. **Custom Workflows**:
   - Disable options you don't need
   - Create your own simplification rules
   - Save frequently used settings mentally

---

## Troubleshooting

### Panel Not Appearing

**Problem**: Green trigger button doesn't show up

**Solutions**:
1. Check Tampermonkey is enabled:
   - Click Tampermonkey icon
   - Ensure extension is active
   - Check script is enabled

2. Verify script installation:
   - Open Tampermonkey Dashboard
   - Look for "Recipe Tools - Whole Foods Edition"
   - Check for error messages

3. Check browser console:
   - Press F12 to open DevTools
   - Look for errors in Console tab
   - Check for module loading issues

4. Reload the page:
   - Press Ctrl+R or F5
   - Script loads on page load

### Module Loading Errors

**Problem**: Console shows "Theme not loaded" or similar

**Solutions**:
1. **For Local Installation**:
   - Verify all file paths in `@require` directives
   - Ensure paths use `file:///` protocol
   - Check files exist at specified locations
   - Use absolute paths, not relative

2. **For GitHub Installation**:
   - Check internet connection
   - Verify GitHub URLs are correct
   - Try clearing browser cache
   - Check GitHub repository is public

### Conversion Not Working

**Problem**: Unit converter shows no result

**Solutions**:
1. Check input is numeric:
   - Only numbers are accepted
   - No letters or special characters
   - Decimal points are allowed

2. Verify units are compatible:
   - Can't convert volume to weight
   - Can't convert temperature to volume
   - Select correct conversion type first

3. Try different values:
   - Very large numbers may cause issues
   - Negative numbers are allowed
   - Zero is valid

### Recipe Simplifier Errors

**Problem**: "Parentheses/brackets are unbalanced"

**Solutions**:
1. Count brackets manually:
   - Every `(` needs a `)`
   - Every `[` needs a `]`
   - Check for hidden characters

2. Fix input text:
   - Remove extra brackets
   - Add missing closing brackets
   - Use find/replace to fix bulk issues

3. Disable capitalization fix:
   - Uncheck "Fix capitalization and brackets"
   - Process without bracket validation
   - Manually fix brackets later

### Update Check Failing

**Problem**: Update check shows error

**Solutions**:
1. Check internet connection
2. Verify GitHub URL is correct
3. Try manual update:
   - Visit GitHub repository
   - Download latest version
   - Reinstall script

---

## FAQ

### General Questions

**Q: Does this work on all websites?**  
A: Yes! The script is configured with `@match *://*/*` so it works on any website.

**Q: Will this slow down my browser?**  
A: No. The script is lightweight (~50KB total) and only loads when you open the panel.

**Q: Can I use this offline?**  
A: Yes, if using local file installation. GitHub installation requires internet for updates.

**Q: Is my data saved anywhere?**  
A: Only locally in your browser. No data is sent to external servers.

### Feature Questions

**Q: Can I add more conversion units?**  
A: Yes! Edit [`modules/UnitConverter.js`](modules/UnitConverter.js:1) and add to the `CONVERSIONS` object.

**Q: Can I customize the simplification rules?**  
A: Yes! Edit [`modules/RecipeSimplifier.js`](modules/RecipeSimplifier.js:1) and modify the `simplifyIngredients()` function.

**Q: How do I add new tools?**  
A: See [`EXTENSIBILITY_GUIDE.md`](EXTENSIBILITY_GUIDE.md:1) for detailed instructions.

**Q: Can I change the colors?**  
A: Yes! Edit [`modules/Wholefoods-Theme.js`](modules/Wholefoods-Theme.js:1) and modify the `COLORS` object.

### Technical Questions

**Q: What browsers are supported?**  
A: Chrome, Firefox, and Edge with Tampermonkey 4.x+

**Q: Does this require special permissions?**  
A: Only `GM_setValue`, `GM_getValue`, and `GM_xmlhttpRequest` for storage and updates.

**Q: Can I use this with other userscripts?**  
A: Yes! This script doesn't interfere with other scripts.

**Q: How do I report bugs?**  
A: Open an issue on the GitHub repository with:
- Browser and Tampermonkey version
- Steps to reproduce
- Console error messages (F12 → Console)

### Update Questions

**Q: How often does it check for updates?**  
A: Automatically every 24 hours, or manually via the 🔄 button.

**Q: Can I disable update checks?**  
A: Yes, comment out the `startVersionChecking()` call in [`MainScript.user.js`](MainScript.user.js:1).

**Q: What happens when I skip a version?**  
A: That version won't prompt you again, but newer versions will.

---

## Support

### Getting Help

1. **Check this guide** for common solutions
2. **Review the documentation**:
   - [`TECHNICAL_SPECIFICATION.md`](TECHNICAL_SPECIFICATION.md:1) - Technical details
   - [`ARCHITECTURE_PLAN.md`](ARCHITECTURE_PLAN.md:1) - System architecture
   - [`EXTENSIBILITY_GUIDE.md`](EXTENSIBILITY_GUIDE.md:1) - Adding features

3. **Check browser console** (F12) for error messages

4. **GitHub Issues** - Report bugs or request features

### Contributing

Contributions are welcome! See [`EXTENSIBILITY_GUIDE.md`](EXTENSIBILITY_GUIDE.md:1) for:
- How to add new tools
- Code structure and patterns
- Testing guidelines

---

## Version History

### Version 1.0.0 (Current)
- ✨ Initial release
- 🔢 Unit Converter tool
- 📝 Recipe Simplifier tool
- 🎨 Whole Foods themed UI
- 🖱️ Draggable interface
- 🔄 Auto-update system
- 🔌 Extensible architecture

---

## Credits

- **Design**: Whole Foods Market color palette
- **VBA Logic**: Legacy recipe formatting system
- **Architecture**: Multi-file Tampermonkey pattern

---

**Enjoy using Recipe Tools! 🛠️**