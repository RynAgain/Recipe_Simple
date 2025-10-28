# Recipe Tools - Technical Specification

## Project Overview

A modular Tampermonkey userscript providing nutrition and recipe text processing tools with a draggable, hidable UI featuring Whole Foods Market branding.

## Architecture

### Multi-File Structure

Following the guide in [`multi-tampermonkey-guide.md`](multi-tampermonkey-guide.md:1), the project will use a modular architecture:

```
Recipe_Simple/
├── MainScript.user.js          # Main orchestrator script
├── modules/
│   ├── UI-Core.js              # Draggable/hidable UI framework
│   ├── UnitConverter.js        # Unit conversion tool
│   └── RecipeSimplifier.js     # Recipe text simplification tool
├── styles/
│   └── Wholefoods-Theme.js     # Whole Foods color scheme and styling
└── docs/
    ├── TECHNICAL_SPECIFICATION.md
    └── USER_GUIDE.md
```

## Design Specifications

### Whole Foods Color Palette

Based on Whole Foods Market branding:

- **Primary Green**: `#00674F` (Dark forest green)
- **Secondary Green**: `#00A862` (Bright green)
- **Accent Orange**: `#FF6F00` (Whole Foods orange)
- **Background**: `#FFFFFF` (White)
- **Text Primary**: `#333333` (Dark gray)
- **Text Secondary**: `#666666` (Medium gray)
- **Border**: `#E0E0E0` (Light gray)
- **Hover**: `#004E3C` (Darker green)

### UI Components

#### Main Container
- **Position**: Fixed, draggable
- **Default Location**: Bottom-right corner
- **Size**: 400px width, auto height (max 600px)
- **Features**:
  - Draggable header bar
  - Minimize/maximize button
  - Close button (hides UI)
  - Persistent position storage

#### Tab System
- **Tabs**: Horizontal tab bar at top
  - Tab 1: "🔢 Unit Converter"
  - Tab 2: "📝 Recipe Simplifier"
- **Active State**: Whole Foods green background
- **Inactive State**: Light gray background
- **Content Area**: Switches based on active tab

#### Trigger Button
- **Position**: Fixed bottom-right
- **Size**: 60px × 60px circular button
- **Icon**: "🛠️" or custom Whole Foods-style icon
- **Behavior**: Shows/hides main UI panel

## Feature Specifications

### 1. Unit Converter Tool

#### Supported Conversions

**Volume Conversions:**
- Teaspoons (tsp) ↔ Tablespoons (tbsp) ↔ Fluid Ounces (fl oz)
- Cups (cup) ↔ Pints (pt) ↔ Quarts (qt) ↔ Gallons (gal)
- Milliliters (ml) ↔ Liters (L)
- Cross-system conversions (metric ↔ imperial)

**Weight Conversions:**
- Ounces (oz) ↔ Pounds (lb)
- Grams (g) ↔ Kilograms (kg)
- Cross-system conversions (metric ↔ imperial)

**Temperature Conversions:**
- Fahrenheit (°F) ↔ Celsius (°C) ↔ Kelvin (K)

#### UI Design
```
┌─────────────────────────────────────┐
│ From:  [Input Field]  [Dropdown▼]  │
│                                     │
│        ⇅ (Swap button)              │
│                                     │
│ To:    [Result Field] [Dropdown▼]  │
│                                     │
│ [Convert Button]                    │
└─────────────────────────────────────┘
```

#### Conversion Logic
- Real-time conversion as user types
- Precision: 2 decimal places for display
- Validation: Numeric input only
- Error handling: Invalid inputs show helpful messages

### 2. Recipe Text Simplifier Tool

#### Core Functionality

Based on [`Legacy-Format-VBA.txt`](Legacy-Format-VBA.txt:1) logic:

**Text Transformations:**
1. **Case Normalization**: Lowercase all text initially
2. **Bracket/Parentheses Fixing**: 
   - Convert `{` to `(` and `}` to `)`
   - Alternate between `()` and `[]` for nested levels
   - Track nesting depth with modulo logic
3. **Capitalization Rules**:
   - Capitalize first letter after spaces (outside parentheses)
   - Keep lowercase inside parentheses/brackets
4. **Special Handling**:
   - Fix `**organic` casing to `**Organic`
   - Remove asterisks and GMO-related text

**Ingredient Simplification Rules:**

Remove unnecessary qualifiers:
- "Sea Salt" → "Salt"
- "Kosher Salt" → "Salt"
- "Filtered Water" → Remove completely
- "Purified Water" → Remove completely
- "Organic [ingredient]" → "[ingredient]" (optional toggle)
- Remove asterisks (`*`, `**`)
- Remove GMO disclaimers

**Formatting Rules:**
- Trim excess whitespace
- Ensure proper comma spacing
- Balance parentheses/brackets
- Validate bracket matching before output

#### UI Design
```
┌─────────────────────────────────────┐
│ Input:                              │
│ ┌─────────────────────────────────┐ │
│ │ [Multi-line text area]          │ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Options:                            │
│ ☑ Remove water                      │
│ ☑ Simplify salt types               │
│ ☑ Remove organic labels             │
│ ☑ Remove GMO text                   │
│ ☑ Fix capitalization                │
│                                     │
│ [Simplify Button]                   │
│                                     │
│ Output:                             │
│ ┌─────────────────────────────────┐ │
│ │ [Multi-line text area]          │ │
│ │ (Read-only, with copy button)   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Copy to Clipboard]                 │
└─────────────────────────────────────┘
```

## Technical Implementation Details

### Main Script Structure

```javascript
// ==UserScript==
// @name         Recipe Tools - Whole Foods Edition
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Nutrition and recipe text processing tools
// @author       Your Name
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://raw.githubusercontent.com/[user]/[repo]/main/modules/UI-Core.js
// @require      https://raw.githubusercontent.com/[user]/[repo]/main/modules/UnitConverter.js
// @require      https://raw.githubusercontent.com/[user]/[repo]/main/modules/RecipeSimplifier.js
// @require      https://raw.githubusercontent.com/[user]/[repo]/main/styles/Wholefoods-Theme.js
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/[user]/[repo]/main/MainScript.user.js
// @downloadURL  https://raw.githubusercontent.com/[user]/[repo]/main/MainScript.user.js
// ==/UserScript==
```

### Module Patterns

Each module follows the IIFE pattern from [`multi-tampermonkey-guide.md`](multi-tampermonkey-guide.md:115):

```javascript
(function() {
    'use strict';
    
    // Module code here
    
    // Export for testing
    try {
        module.exports = { /* exports */ };
    } catch (e) {}
})();
```

### Draggable UI Implementation

```javascript
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
    handle.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        
        // Save position
        GM_setValue('uiPosition', {
            top: element.style.top,
            left: element.style.left
        });
    }
    
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
```

### State Management

Using Tampermonkey's GM_setValue/GM_getValue:

```javascript
// Persistent state
const STATE_KEYS = {
    UI_POSITION: 'recipeTools_uiPosition',
    UI_VISIBLE: 'recipeTools_uiVisible',
    ACTIVE_TAB: 'recipeTools_activeTab',
    SIMPLIFIER_OPTIONS: 'recipeTools_simplifierOptions',
    LAST_VERSION_CHECK: 'recipeTools_lastVersionCheck'
};

// Save state
function saveState(key, value) {
    GM_setValue(STATE_KEYS[key], JSON.stringify(value));
}

// Load state
function loadState(key, defaultValue) {
    const stored = GM_getValue(STATE_KEYS[key]);
    return stored ? JSON.parse(stored) : defaultValue;
}
```

## Update System

Following [`Update System Documentation.md`](Update System Documentation.md:1):

### Configuration
```javascript
const CURRENT_VERSION = '1.0.0';
const GITHUB_VERSION_URL = 'https://raw.githubusercontent.com/[user]/[repo]/main/MainScript.user.js';
const VERSION_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
```

### Features
- Automatic version checking on startup
- Manual "Check for Updates" button in UI
- User choices: Update Now, Remind Later, Skip Version
- Persistent storage of check timestamps and skipped versions

## Unit Conversion Reference

### Conversion Factors

**Volume (US):**
- 1 tsp = 4.92892 ml
- 1 tbsp = 3 tsp = 14.7868 ml
- 1 fl oz = 2 tbsp = 29.5735 ml
- 1 cup = 8 fl oz = 236.588 ml
- 1 pt = 2 cups = 473.176 ml
- 1 qt = 2 pt = 946.353 ml
- 1 gal = 4 qt = 3785.41 ml

**Weight:**
- 1 oz = 28.3495 g
- 1 lb = 16 oz = 453.592 g

**Temperature:**
- °F = (°C × 9/5) + 32
- °C = (°F - 32) × 5/9
- K = °C + 273.15

## Recipe Simplifier Logic

### VBA Translation to JavaScript

Key functions from [`Legacy-Format-VBA.txt`](Legacy-Format-VBA.txt:58):

```javascript
function fixParentheses(text) {
    let output = '';
    let depth = 0;
    let prev = ' ';
    
    for (let i = 0; i < text.length; i++) {
        let curr = text[i];
        
        // Capitalize after spaces when outside parentheses
        if (depth === 0 && prev === ' ') {
            curr = curr.toUpperCase();
        } else {
            curr = curr.toLowerCase();
        }
        
        // Fix parentheses/brackets based on depth
        if (isLeftParenBracket(curr)) {
            curr = (depth % 2 === 0) ? '(' : '[';
            depth++;
        } else if (isRightParenBracket(curr)) {
            depth--;
            curr = (depth % 2 === 0) ? ')' : ']';
        }
        
        output += curr;
        prev = curr;
    }
    
    // Validate balanced
    if (depth !== 0) {
        return { success: false, error: 'Parentheses/brackets are unbalanced' };
    }
    
    return { success: true, text: output };
}

function removeAsterisks(text) {
    text = text.replace(/\*/g, '');
    text = text.replace(/non-gmo\./gi, '');
    text = text.replace(/non-gmo/gi, '');
    text = text.replace(/non gmo/gi, '');
    text = text.replace(/\bgmo\b/gi, '');
    return text;
}

function simplifyIngredients(text, options) {
    if (options.removeWater) {
        text = text.replace(/\b(filtered |purified )?water\b/gi, '');
    }
    
    if (options.simplifySalt) {
        text = text.replace(/\b(sea |kosher |himalayan )?salt\b/gi, 'Salt');
    }
    
    if (options.removeOrganic) {
        text = text.replace(/\*?\*?organic\s+/gi, '');
    }
    
    if (options.removeGMO) {
        text = removeAsterisks(text);
    }
    
    return text;
}
```

## Testing Strategy

### Unit Tests
- Conversion accuracy tests
- Edge case handling (negative numbers, zero, very large numbers)
- Text transformation validation
- Parentheses balancing verification

### Integration Tests
- Tab switching functionality
- State persistence across page reloads
- Drag and drop positioning
- UI show/hide behavior

### User Acceptance Tests
- Real recipe text processing
- Various unit conversion scenarios
- UI responsiveness and usability

## Performance Considerations

- **Lazy Loading**: Load tool modules only when tabs are activated
- **Debouncing**: Debounce real-time conversion inputs (300ms delay)
- **Memory Management**: Clean up event listeners on UI hide
- **DOM Efficiency**: Minimize reflows and repaints

## Accessibility

- **Keyboard Navigation**: Tab through all interactive elements
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Clear focus indicators
- **Color Contrast**: WCAG AA compliant contrast ratios

## Browser Compatibility

- **Target**: Modern browsers (Chrome, Firefox, Edge)
- **Tampermonkey**: Version 4.x+
- **ES6+**: Use modern JavaScript features
- **Fallbacks**: Graceful degradation for older browsers

## Future Enhancements

- Additional conversion types (length, area, etc.)
- Recipe scaling calculator
- Ingredient substitution suggestions
- Export/import settings
- Custom conversion presets
- Batch processing for multiple recipes
- Integration with recipe websites

## Development Workflow

1. **Setup**: Create GitHub repository structure
2. **Core UI**: Build draggable panel and tab system
3. **Styling**: Apply Whole Foods theme
4. **Tool 1**: Implement unit converter
5. **Tool 2**: Implement recipe simplifier
6. **Integration**: Connect all modules
7. **Testing**: Comprehensive testing
8. **Documentation**: User guide and API docs
9. **Deployment**: Publish to GitHub for @require URLs

## File Size Targets

- MainScript.user.js: < 5KB (orchestrator only)
- UI-Core.js: < 15KB
- UnitConverter.js: < 10KB
- RecipeSimplifier.js: < 15KB
- Wholefoods-Theme.js: < 5KB
- **Total**: < 50KB (acceptable for userscript)

## Version Numbering

Following semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

Initial release: `1.0.0`