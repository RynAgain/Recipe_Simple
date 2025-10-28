# Extensibility Guide - Adding New Tools

## Overview

The Recipe Tools architecture is designed to be **highly extensible**. Adding new tools is straightforward and follows a consistent pattern. This guide explains how to add additional tools to the system.

## Architecture for Extensibility

### Plugin-Based Tab System

The UI framework uses a **plugin registration pattern** that allows new tools to be added without modifying core code:

```javascript
// In UI-Core.js
const registeredTools = [];

function registerTool(toolConfig) {
    registeredTools.push(toolConfig);
    createTabForTool(toolConfig);
}

// Tool configuration object
const toolConfig = {
    id: 'unique-tool-id',
    name: 'Tool Display Name',
    icon: '🔧',
    initFunction: initializeMyTool,
    contentBuilder: buildMyToolContent,
    order: 3 // Display order in tab bar
};
```

### Adding a New Tool - Step by Step

#### Step 1: Create the Tool Module

Create a new file in `modules/` directory:

**Example: `modules/RecipeScaler.js`**

```javascript
(function() {
    'use strict';
    
    // Tool configuration
    const TOOL_CONFIG = {
        id: 'recipe-scaler',
        name: 'Recipe Scaler',
        icon: '⚖️',
        order: 3
    };
    
    // Initialize the tool
    function initRecipeScaler() {
        console.log('[RecipeScaler] Initializing...');
        
        // Set up event listeners
        setupEventListeners();
        
        // Load saved state if any
        loadToolState();
    }
    
    // Build the tool's UI content
    function buildScalerContent() {
        const container = document.createElement('div');
        container.className = 'tool-content recipe-scaler-content';
        container.id = 'recipeScalerContent';
        
        // Build your tool's UI here
        container.innerHTML = `
            <div class="scaler-input-group">
                <label>Original Servings:</label>
                <input type="number" id="originalServings" value="4" min="1">
            </div>
            <div class="scaler-input-group">
                <label>Desired Servings:</label>
                <input type="number" id="desiredServings" value="8" min="1">
            </div>
            <div class="scaler-input-group">
                <label>Recipe Text:</label>
                <textarea id="recipeInput" rows="10"></textarea>
            </div>
            <button id="scaleButton" class="wf-button">Scale Recipe</button>
            <div class="scaler-output">
                <label>Scaled Recipe:</label>
                <textarea id="recipeOutput" rows="10" readonly></textarea>
            </div>
        `;
        
        return container;
    }
    
    // Tool-specific functionality
    function scaleRecipe(originalServings, desiredServings, recipeText) {
        const scaleFactor = desiredServings / originalServings;
        
        // Your scaling logic here
        // Parse recipe, multiply quantities, return scaled text
        
        return scaledRecipe;
    }
    
    function setupEventListeners() {
        // Wait for content to be added to DOM
        document.addEventListener('toolContentReady', (e) => {
            if (e.detail.toolId === TOOL_CONFIG.id) {
                const scaleButton = document.getElementById('scaleButton');
                scaleButton.addEventListener('click', handleScaleClick);
            }
        });
    }
    
    function handleScaleClick() {
        const original = document.getElementById('originalServings').value;
        const desired = document.getElementById('desiredServings').value;
        const recipe = document.getElementById('recipeInput').value;
        
        const scaled = scaleRecipe(original, desired, recipe);
        document.getElementById('recipeOutput').value = scaled;
    }
    
    function loadToolState() {
        // Load any saved preferences
        const savedState = GM_getValue('recipeScaler_state', {});
        // Apply saved state
    }
    
    // Register this tool with the UI framework
    if (window.RecipeToolsUI) {
        window.RecipeToolsUI.registerTool({
            ...TOOL_CONFIG,
            initFunction: initRecipeScaler,
            contentBuilder: buildScalerContent
        });
    } else {
        // UI not ready yet, wait for it
        document.addEventListener('RecipeToolsUIReady', () => {
            window.RecipeToolsUI.registerTool({
                ...TOOL_CONFIG,
                initFunction: initRecipeScaler,
                contentBuilder: buildScalerContent
            });
        });
    }
    
    // Export for testing
    try {
        module.exports = {
            initRecipeScaler,
            buildScalerContent,
            scaleRecipe
        };
    } catch (e) {}
})();
```

#### Step 2: Add @require to MainScript.user.js

Simply add one line to the main script:

```javascript
// ==UserScript==
// @name         Recipe Tools - Whole Foods Edition
// ... other headers ...
// @require      https://raw.githubusercontent.com/[user]/[repo]/main/modules/UI-Core.js
// @require      https://raw.githubusercontent.com/[user]/[repo]/main/modules/UnitConverter.js
// @require      https://raw.githubusercontent.com/[user]/[repo]/main/modules/RecipeSimplifier.js
// @require      https://raw.githubusercontent.com/[user]/[repo]/main/modules/RecipeScaler.js  ← ADD THIS
// @require      https://raw.githubusercontent.com/[user]/[repo]/main/styles/Wholefoods-Theme.js
// ==/UserScript==
```

#### Step 3: That's It!

The new tool will automatically:
- ✅ Appear as a new tab in the UI
- ✅ Be styled with Whole Foods theme
- ✅ Have its own content area
- ✅ Initialize when its tab is clicked
- ✅ Persist its state across sessions

## Enhanced UI-Core.js Architecture

Here's how the UI-Core module should be structured to support plugins:

```javascript
// UI-Core.js - Enhanced for extensibility

(function() {
    'use strict';
    
    // Tool registry
    const registeredTools = [];
    let activeToolId = null;
    
    // Public API
    window.RecipeToolsUI = {
        registerTool: registerTool,
        switchToTool: switchToTool,
        getActiveTool: () => activeToolId,
        getAllTools: () => [...registeredTools]
    };
    
    // Register a new tool
    function registerTool(toolConfig) {
        // Validate config
        if (!toolConfig.id || !toolConfig.name || !toolConfig.contentBuilder) {
            console.error('[UI-Core] Invalid tool configuration:', toolConfig);
            return false;
        }
        
        // Check for duplicates
        if (registeredTools.find(t => t.id === toolConfig.id)) {
            console.warn('[UI-Core] Tool already registered:', toolConfig.id);
            return false;
        }
        
        // Add to registry
        registeredTools.push(toolConfig);
        
        // Sort by order
        registeredTools.sort((a, b) => (a.order || 999) - (b.order || 999));
        
        // If UI is already built, add the tab dynamically
        if (document.getElementById('recipeToolsPanel')) {
            addToolTab(toolConfig);
        }
        
        console.log('[UI-Core] Tool registered:', toolConfig.name);
        return true;
    }
    
    // Create tab for a tool
    function addToolTab(toolConfig) {
        const tabBar = document.getElementById('toolTabBar');
        if (!tabBar) return;
        
        const tab = document.createElement('button');
        tab.className = 'tool-tab';
        tab.id = `tab-${toolConfig.id}`;
        tab.innerHTML = `${toolConfig.icon || '🔧'} ${toolConfig.name}`;
        tab.dataset.toolId = toolConfig.id;
        
        tab.addEventListener('click', () => switchToTool(toolConfig.id));
        
        tabBar.appendChild(tab);
    }
    
    // Switch to a specific tool
    function switchToTool(toolId) {
        const tool = registeredTools.find(t => t.id === toolId);
        if (!tool) {
            console.error('[UI-Core] Tool not found:', toolId);
            return;
        }
        
        // Update active tool
        activeToolId = toolId;
        
        // Update tab styles
        document.querySelectorAll('.tool-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(`tab-${toolId}`)?.classList.add('active');
        
        // Hide all tool contents
        document.querySelectorAll('.tool-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show or create this tool's content
        let content = document.getElementById(`${toolId}-content`);
        if (!content) {
            content = tool.contentBuilder();
            content.id = `${toolId}-content`;
            content.style.display = 'none';
            document.getElementById('toolContentArea').appendChild(content);
            
            // Initialize tool if needed
            if (tool.initFunction && !tool.initialized) {
                tool.initFunction();
                tool.initialized = true;
            }
            
            // Dispatch event for tool-specific setup
            document.dispatchEvent(new CustomEvent('toolContentReady', {
                detail: { toolId: toolId }
            }));
        }
        
        content.style.display = 'block';
        
        // Save active tool
        GM_setValue('recipeTools_activeTab', toolId);
    }
    
    // Build the main UI with dynamic tabs
    function buildMainPanel() {
        const panel = document.createElement('div');
        panel.id = 'recipeToolsPanel';
        panel.className = 'recipe-tools-panel';
        
        // Header with drag handle
        const header = document.createElement('div');
        header.className = 'panel-header';
        header.id = 'panelHeader';
        header.innerHTML = `
            <span class="panel-title">🛠️ Recipe Tools</span>
            <div class="panel-controls">
                <button id="minimizeBtn" class="control-btn">−</button>
                <button id="closeBtn" class="control-btn">×</button>
            </div>
        `;
        
        // Tab bar (will be populated by registered tools)
        const tabBar = document.createElement('div');
        tabBar.className = 'tool-tab-bar';
        tabBar.id = 'toolTabBar';
        
        // Content area
        const contentArea = document.createElement('div');
        contentArea.className = 'tool-content-area';
        contentArea.id = 'toolContentArea';
        
        panel.appendChild(header);
        panel.appendChild(tabBar);
        panel.appendChild(contentArea);
        
        // Add tabs for all registered tools
        registeredTools.forEach(tool => addToolTab(tool));
        
        // Make draggable
        makeDraggable(panel, header);
        
        return panel;
    }
    
    // Initialize UI
    function initializeUI() {
        console.log('[UI-Core] Initializing UI...');
        
        // Create trigger button
        createTriggerButton();
        
        // Create main panel
        const panel = buildMainPanel();
        document.body.appendChild(panel);
        
        // Load saved state
        const savedTab = GM_getValue('recipeTools_activeTab', registeredTools[0]?.id);
        if (savedTab) {
            switchToTool(savedTab);
        }
        
        // Dispatch ready event
        document.dispatchEvent(new CustomEvent('RecipeToolsUIReady'));
        
        console.log('[UI-Core] UI initialized with', registeredTools.length, 'tools');
    }
    
    // Wait for DOM and initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUI);
    } else {
        initializeUI();
    }
    
    // Export for testing
    try {
        module.exports = {
            registerTool,
            switchToTool,
            buildMainPanel
        };
    } catch (e) {}
})();
```

## Example: Adding More Tools

### Tool Ideas and Implementation Patterns

#### 1. Recipe Scaler
**Purpose**: Scale recipe quantities up or down
**Complexity**: Medium
**Files**: `modules/RecipeScaler.js`

#### 2. Ingredient Substitution Finder
**Purpose**: Suggest substitutions for ingredients
**Complexity**: Medium
**Files**: `modules/IngredientSubstitution.js`

#### 3. Nutrition Calculator
**Purpose**: Calculate nutrition facts from ingredients
**Complexity**: High (needs nutrition database)
**Files**: `modules/NutritionCalculator.js`, `data/nutrition-db.json`

#### 4. Shopping List Generator
**Purpose**: Convert recipe to shopping list
**Complexity**: Low
**Files**: `modules/ShoppingList.js`

#### 5. Recipe Timer
**Purpose**: Multi-timer for cooking steps
**Complexity**: Low
**Files**: `modules/RecipeTimer.js`

#### 6. Temperature Converter (Extended)
**Purpose**: More detailed temperature conversions with cooking tips
**Complexity**: Low
**Files**: `modules/TemperatureGuide.js`

## Tool Template

Use this template to create new tools quickly:

```javascript
// modules/YourToolName.js
(function() {
    'use strict';
    
    // ============================================
    // CONFIGURATION
    // ============================================
    const TOOL_CONFIG = {
        id: 'your-tool-id',           // Unique identifier
        name: 'Your Tool Name',        // Display name
        icon: '🔧',                    // Emoji or icon
        order: 10                      // Display order (lower = earlier)
    };
    
    // ============================================
    // INITIALIZATION
    // ============================================
    function initYourTool() {
        console.log(`[${TOOL_CONFIG.name}] Initializing...`);
        setupEventListeners();
        loadToolState();
    }
    
    // ============================================
    // UI BUILDER
    // ============================================
    function buildToolContent() {
        const container = document.createElement('div');
        container.className = 'tool-content your-tool-content';
        container.id = `${TOOL_CONFIG.id}-content`;
        
        // Apply Whole Foods theme
        if (window.WholeFoodsTheme) {
            window.WholeFoodsTheme.applyStyles(container, 'toolContent');
        }
        
        // Build your UI here
        container.innerHTML = `
            <div class="tool-section">
                <h3>Your Tool Title</h3>
                <!-- Your tool's HTML here -->
            </div>
        `;
        
        return container;
    }
    
    // ============================================
    // CORE FUNCTIONALITY
    // ============================================
    function yourMainFunction() {
        // Your tool's main logic here
    }
    
    // ============================================
    // EVENT HANDLERS
    // ============================================
    function setupEventListeners() {
        document.addEventListener('toolContentReady', (e) => {
            if (e.detail.toolId === TOOL_CONFIG.id) {
                // Set up your event listeners here
                const button = document.getElementById('yourButton');
                button?.addEventListener('click', handleButtonClick);
            }
        });
    }
    
    function handleButtonClick() {
        // Handle button click
    }
    
    // ============================================
    // STATE MANAGEMENT
    // ============================================
    function loadToolState() {
        const state = GM_getValue(`${TOOL_CONFIG.id}_state`, {});
        // Apply saved state
    }
    
    function saveToolState(state) {
        GM_setValue(`${TOOL_CONFIG.id}_state`, state);
    }
    
    // ============================================
    // REGISTRATION
    // ============================================
    function registerThisTool() {
        if (window.RecipeToolsUI) {
            window.RecipeToolsUI.registerTool({
                ...TOOL_CONFIG,
                initFunction: initYourTool,
                contentBuilder: buildToolContent
            });
        } else {
            document.addEventListener('RecipeToolsUIReady', () => {
                window.RecipeToolsUI.registerTool({
                    ...TOOL_CONFIG,
                    initFunction: initYourTool,
                    contentBuilder: buildToolContent
                });
            });
        }
    }
    
    // Auto-register
    registerThisTool();
    
    // ============================================
    // EXPORTS (for testing)
    // ============================================
    try {
        module.exports = {
            initYourTool,
            buildToolContent,
            yourMainFunction
        };
    } catch (e) {}
})();
```

## Benefits of This Architecture

### 1. **Zero Core Modification**
- Add new tools without touching UI-Core.js or MainScript.user.js
- Only need to add one `@require` line

### 2. **Automatic Integration**
- New tools automatically get Whole Foods styling
- Tab system handles everything
- State management is built-in

### 3. **Independent Development**
- Each tool is self-contained
- Tools don't interfere with each other
- Easy to test individually

### 4. **Easy Maintenance**
- Update one tool without affecting others
- Remove tools by simply removing the `@require` line
- Version control is straightforward

### 5. **Scalability**
- Can have 2 tools or 20 tools
- Performance impact is minimal (lazy loading)
- UI adapts automatically

## Tool Communication

If tools need to communicate with each other:

```javascript
// Tool A dispatches an event
document.dispatchEvent(new CustomEvent('recipeDataUpdated', {
    detail: { recipe: recipeData }
}));

// Tool B listens for the event
document.addEventListener('recipeDataUpdated', (e) => {
    const recipe = e.detail.recipe;
    // Use the recipe data
});
```

## Shared Utilities

Create a shared utilities module for common functions:

**`modules/SharedUtils.js`**
```javascript
window.RecipeToolsUtils = {
    parseRecipe: function(text) { /* ... */ },
    formatNumber: function(num, decimals) { /* ... */ },
    copyToClipboard: function(text) { /* ... */ },
    showNotification: function(message, type) { /* ... */ }
};
```

Then use in any tool:
```javascript
const parsed = window.RecipeToolsUtils.parseRecipe(recipeText);
```

## Summary

The architecture is **fully extensible**:

✅ **Add new tools** by creating one file and adding one `@require` line  
✅ **No core modifications** needed  
✅ **Automatic styling** with Whole Foods theme  
✅ **Built-in state management** for each tool  
✅ **Independent development** and testing  
✅ **Scalable** to any number of tools  

This makes it easy to grow the toolset over time without increasing complexity!