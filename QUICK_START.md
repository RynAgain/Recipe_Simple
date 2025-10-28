# Quick Start Guide - Recipe Tools

## 🚀 Get Running in 5 Minutes

### Step 1: Install Tampermonkey (1 minute)

Install the Tampermonkey browser extension:
- **Chrome**: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
- **Firefox**: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
- **Edge**: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd

### Step 2: Install Recipe Tools (2 minutes)

1. Click the Tampermonkey icon → **Dashboard**
2. Click the **+** icon (Create new script)
3. Delete the template code
4. Open [`MainScript.user.js`](MainScript.user.js:1) and copy all contents
5. Paste into Tampermonkey editor
6. Click **File → Save** (or Ctrl+S)

### Step 3: Test It (2 minutes)

1. Visit **any website** (e.g., google.com)
2. Look for a **green button (🛠️)** in the bottom-right corner
3. Click it to open the panel
4. Try the tools:
   - **Unit Converter**: Convert 1 cup to ml
   - **Recipe Simplifier**: Paste some ingredient text

---

## ✅ Verification

If everything works, you should see:

- ✅ Green trigger button in bottom-right
- ✅ Panel opens when you click it
- ✅ Two tabs: "🔢 Unit Converter" and "📝 Recipe Simplifier"
- ✅ Panel can be dragged by the green header
- ✅ No errors in browser console (F12)

---

## 🐛 Troubleshooting

### Problem: No green button appears

**Solution**:
1. Check Tampermonkey icon - is the script enabled?
2. Press F12 → Console tab - any errors?
3. Reload the page (Ctrl+R)

### Problem: Console shows "Theme not loaded"

**Solution**:
The file paths in `@require` directives need to match your actual file locations.

Current paths:
```javascript
// @require file:///C:/Users/kryasatt/Documents/Source/Recipe_Simple/modules/Wholefoods-Theme.js
```

If your files are elsewhere, update these paths in [`MainScript.user.js`](MainScript.user.js:1) lines 11-14.

---

## 📖 Next Steps

Once it's working:

1. **Read the User Guide**: [`USER_GUIDE.md`](USER_GUIDE.md:1)
   - Detailed feature documentation
   - Examples and tips
   - FAQ section

2. **Try Both Tools**:
   - **Unit Converter**: Test all conversion types (volume, weight, temperature)
   - **Recipe Simplifier**: Try the example recipes in the user guide

3. **Customize** (optional):
   - Change colors in [`modules/Wholefoods-Theme.js`](modules/Wholefoods-Theme.js:1)
   - Add new tools using [`EXTENSIBILITY_GUIDE.md`](EXTENSIBILITY_GUIDE.md:1)

---

## 🎯 Common Use Cases

### Convert Recipe Measurements
```
1. Click green button
2. Select "Unit Converter" tab
3. Choose "Volume" from dropdown
4. Enter: 2 cups
5. Select target: ml
6. Result: 473.18 ml
```

### Clean Recipe Text
```
1. Click green button
2. Select "Recipe Simplifier" tab
3. Paste: "organic tomatoes (diced), sea salt, filtered water"
4. Click "Simplify Recipe"
5. Result: "Organic Tomatoes (diced), Salt"
6. Click "Copy to Clipboard"
```

---

## 📁 Project Files

```
Recipe_Simple/
├── MainScript.user.js          ← Install this in Tampermonkey
├── modules/                     ← Required module files
│   ├── Wholefoods-Theme.js
│   ├── UI-Core.js
│   ├── UnitConverter.js
│   └── RecipeSimplifier.js
├── QUICK_START.md              ← You are here
├── README.md                    ← Project overview
├── INSTALLATION.md              ← Detailed install guide
└── USER_GUIDE.md                ← Complete documentation
```

---

## 💡 Tips

1. **Drag the panel** to your preferred position - it remembers where you put it
2. **Use the swap button** (⇅) in Unit Converter for quick reverse conversions
3. **Check/uncheck options** in Recipe Simplifier to customize the output
4. **Click the 🔄 button** in the panel header to check for updates

---

## 🆘 Need Help?

- **Installation issues**: See [`INSTALLATION.md`](INSTALLATION.md:1)
- **How to use features**: See [`USER_GUIDE.md`](USER_GUIDE.md:1)
- **Technical details**: See [`TECHNICAL_SPECIFICATION.md`](TECHNICAL_SPECIFICATION.md:1)
- **Adding tools**: See [`EXTENSIBILITY_GUIDE.md`](EXTENSIBILITY_GUIDE.md:1)

---

## 🎉 You're Ready!

That's it! You now have a fully functional recipe tools system with:
- ✅ Unit conversion (volume, weight, temperature)
- ✅ Recipe text simplification
- ✅ Whole Foods themed UI
- ✅ Draggable, persistent interface
- ✅ Automatic updates
- ✅ Extensible architecture

**Enjoy using Recipe Tools! 🛠️**