# Installation Guide - Recipe Tools

## Quick Start

### Prerequisites

1. **Tampermonkey Extension** installed in your browser:
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

---

## Local Development Installation

### Step 1: Verify File Structure

Ensure you have all files in the correct structure:

```
Recipe_Simple/
├── MainScript.user.js
└── modules/
    ├── Wholefoods-Theme.js
    ├── UI-Core.js
    ├── UnitConverter.js
    └── RecipeSimplifier.js
```

### Step 2: Install in Tampermonkey

1. **Open Tampermonkey Dashboard**:
   - Click the Tampermonkey icon in your browser toolbar
   - Select "Dashboard"

2. **Create New Script**:
   - Click the "+" icon (Create a new script)
   - Delete the default template code

3. **Copy MainScript.user.js**:
   - Open [`MainScript.user.js`](MainScript.user.js:1)
   - Copy all contents (Ctrl+A, Ctrl+C)
   - Paste into Tampermonkey editor (Ctrl+V)

4. **Verify File Paths**:
   - The `@require` directives should point to your local files
   - Current paths are set to:
     ```javascript
     // @require file:///C:/Users/kryasatt/Documents/Source/Recipe_Simple/modules/Wholefoods-Theme.js
     // @require file:///C:/Users/kryasatt/Documents/Source/Recipe_Simple/modules/UI-Core.js
     // @require file:///C:/Users/kryasatt/Documents/Source/Recipe_Simple/modules/UnitConverter.js
     // @require file:///C:/Users/kryasatt/Documents/Source/Recipe_Simple/modules/RecipeSimplifier.js
     ```
   - **If your files are in a different location**, update these paths accordingly

5. **Save the Script**:
   - Click File → Save (or press Ctrl+S)
   - You should see "Script saved" confirmation

### Step 3: Test Installation

1. **Visit Any Website**:
   - Open any webpage (e.g., google.com)
   - Look for a green circular button (🛠️) in the bottom-right corner

2. **Open the Panel**:
   - Click the green button
   - The Recipe Tools panel should appear

3. **Check Console for Errors**:
   - Press F12 to open Developer Tools
   - Click the "Console" tab
   - Look for messages starting with `[RecipeTools]`
   - You should see:
     ```
     ============================================================
     🛠️ Recipe Tools - Whole Foods Edition
     Version: 1.0.0
     ============================================================
     [WholeFoodsTheme] Loading theme...
     [WholeFoodsTheme] Theme loaded successfully
     [UI-Core] Loading UI framework...
     [UnitConverter] Loading module...
     [RecipeSimplifier] Loading module...
     ```

4. **Test Functionality**:
   - Switch between tabs
   - Try a unit conversion
   - Test the recipe simplifier

---

## GitHub Installation (Production)

### Prerequisites

1. Files must be pushed to GitHub repository: `RynAgain/Recipe_Simple`
2. Repository must be public (or you need a personal access token)

### Step 1: Push to GitHub

```bash
cd Recipe_Simple
git init
git add .
git commit -m "Initial commit - Recipe Tools v1.0.0"
git remote add origin https://github.com/RynAgain/Recipe_Simple.git
git push -u origin main
```

### Step 2: Update @require URLs

Before pushing, update [`MainScript.user.js`](MainScript.user.js:1) to use GitHub URLs:

```javascript
// @require https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/modules/Wholefoods-Theme.js
// @require https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/modules/UI-Core.js
// @require https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/modules/UnitConverter.js
// @require https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/modules/RecipeSimplifier.js
```

### Step 3: Install from GitHub

1. **Get the Raw URL**:
   - Navigate to: `https://github.com/RynAgain/Recipe_Simple/blob/main/MainScript.user.js`
   - Click the "Raw" button
   - Copy the URL: `https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/MainScript.user.js`

2. **Install in Tampermonkey**:
   - Open Tampermonkey Dashboard
   - Click "Utilities" tab
   - Paste the raw URL in "Install from URL"
   - Click "Install"

3. **Automatic Updates**:
   - Script will check for updates every 24 hours
   - Manual check via 🔄 button in panel header

---

## Troubleshooting

### Issue: "Theme not loaded" Error

**Cause**: Module files not found at specified paths

**Solution**:
1. Verify all module files exist in the `modules/` directory
2. Check file paths in `@require` directives
3. For local files, use absolute paths with `file:///` protocol
4. For Windows, use forward slashes: `file:///C:/Users/...`

### Issue: Trigger Button Not Appearing

**Cause**: Script not running or JavaScript errors

**Solution**:
1. Check Tampermonkey icon - ensure script is enabled
2. Open browser console (F12) and look for errors
3. Verify `@match *://*/*` is present (runs on all sites)
4. Try reloading the page (Ctrl+R)

### Issue: Panel Appears But Tools Don't Work

**Cause**: Tool modules not loading properly

**Solution**:
1. Check console for module loading messages
2. Verify all 4 module files are present
3. Check for JavaScript errors in console
4. Ensure file paths are correct

### Issue: "Failed to check for updates"

**Cause**: Network error or incorrect GitHub URL

**Solution**:
1. Check internet connection
2. Verify GitHub URL in `GITHUB_VERSION_URL` constant
3. Ensure repository is public
4. Try manual update check

---

## File Path Examples

### Windows

```javascript
// Absolute path
// @require file:///C:/Users/YourName/Documents/Recipe_Simple/modules/Wholefoods-Theme.js

// Network drive
// @require file:///Z:/Projects/Recipe_Simple/modules/Wholefoods-Theme.js
```

### macOS/Linux

```javascript
// Absolute path
// @require file:///Users/yourname/Documents/Recipe_Simple/modules/Wholefoods-Theme.js

// Home directory
// @require file:///home/yourname/projects/Recipe_Simple/modules/Wholefoods-Theme.js
```

### GitHub (Production)

```javascript
// Main branch
// @require https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/modules/Wholefoods-Theme.js

// Specific version tag
// @require https://raw.githubusercontent.com/RynAgain/Recipe_Simple/v1.0.0/modules/Wholefoods-Theme.js
```

---

## Verification Checklist

After installation, verify:

- [ ] Green trigger button (🛠️) appears in bottom-right
- [ ] Clicking button shows/hides panel
- [ ] Panel can be dragged by header
- [ ] Both tabs are visible and clickable
- [ ] Unit Converter tab loads and works
- [ ] Recipe Simplifier tab loads and works
- [ ] No errors in browser console
- [ ] Panel position persists after page reload
- [ ] Update check button (🔄) works

---

## Next Steps

Once installed successfully:

1. **Read the User Guide**: See [`USER_GUIDE.md`](USER_GUIDE.md:1) for detailed feature documentation
2. **Try the Tools**: Test both Unit Converter and Recipe Simplifier
3. **Customize**: Edit theme colors or add new tools (see [`EXTENSIBILITY_GUIDE.md`](EXTENSIBILITY_GUIDE.md:1))
4. **Report Issues**: Open GitHub issues for bugs or feature requests

---

## Uninstallation

To remove Recipe Tools:

1. Open Tampermonkey Dashboard
2. Find "Recipe Tools - Whole Foods Edition"
3. Click the trash icon
4. Confirm deletion

All saved settings will be removed from browser storage.

---

**Need Help?** Check [`USER_GUIDE.md`](USER_GUIDE.md:1) or open a GitHub issue.