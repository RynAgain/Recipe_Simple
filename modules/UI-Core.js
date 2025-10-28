// ==UserScript==
// @name         Recipe Tools - UI Core
// @description  Draggable UI framework with plugin-based tab system
// @version      1.0.0
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('[UI-Core] Loading UI framework...');
    
    // ============================================
    // STATE MANAGEMENT
    // ============================================
    const registeredTools = [];
    let activeToolId = null;
    let mainPanel = null;
    let triggerButton = null;
    let isPanelVisible = false;
    
    // ============================================
    // PUBLIC API
    // ============================================
    window.RecipeToolsUI = {
        registerTool: registerTool,
        switchToTool: switchToTool,
        getActiveTool: () => activeToolId,
        getAllTools: () => [...registeredTools],
        showPanel: showPanel,
        hidePanel: hidePanel,
        togglePanel: togglePanel
    };
    
    // ============================================
    // TOOL REGISTRATION
    // ============================================
    
    /**
     * Register a new tool
     * @param {Object} toolConfig - Tool configuration object
     * @returns {boolean} Success status
     */
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
        if (mainPanel) {
            addToolTab(toolConfig);
        }
        
        console.log('[UI-Core] ✅ Tool registered:', toolConfig.name);
        return true;
    }
    
    /**
     * Create tab for a tool
     * @param {Object} toolConfig - Tool configuration
     */
    function addToolTab(toolConfig) {
        const tabBar = document.getElementById('recipeToolsTabBar');
        if (!tabBar) return;
        
        const tab = document.createElement('button');
        tab.className = 'tool-tab';
        tab.id = `tab-${toolConfig.id}`;
        tab.innerHTML = `${toolConfig.icon || '🔧'} ${toolConfig.name}`;
        tab.dataset.toolId = toolConfig.id;
        
        // Apply theme styles
        const theme = window.WholeFoodsTheme;
        theme.applyStyles(tab, theme.styles.tab);
        
        tab.addEventListener('click', () => switchToTool(toolConfig.id));
        
        tabBar.appendChild(tab);
    }
    
    // ============================================
    // TAB SWITCHING
    // ============================================
    
    /**
     * Switch to a specific tool
     * @param {string} toolId - Tool identifier
     */
    function switchToTool(toolId) {
        const tool = registeredTools.find(t => t.id === toolId);
        if (!tool) {
            console.error('[UI-Core] Tool not found:', toolId);
            return;
        }
        
        console.log('[UI-Core] Switching to tool:', tool.name);
        
        // Update active tool
        activeToolId = toolId;
        
        const theme = window.WholeFoodsTheme;
        
        // Update tab styles
        document.querySelectorAll('.tool-tab').forEach(tab => {
            theme.applyStyles(tab, theme.styles.tab);
            tab.classList.remove('active');
        });
        
        const activeTab = document.getElementById(`tab-${toolId}`);
        if (activeTab) {
            theme.applyStyles(activeTab, {
                ...theme.styles.tab,
                ...theme.styles.tabActive
            });
            activeTab.classList.add('active');
        }
        
        // Hide all tool contents
        document.querySelectorAll('.tool-content').forEach(content => {
            content.style.display = 'none';
        });
        
        // Show or create this tool's content
        let content = document.getElementById(`${toolId}-content`);
        if (!content) {
            console.log('[UI-Core] Creating content for:', tool.name);
            content = tool.contentBuilder();
            content.id = `${toolId}-content`;
            content.className = 'tool-content';
            content.style.display = 'none';
            
            document.getElementById('recipeToolsContentArea').appendChild(content);
            
            // Initialize tool if needed
            if (tool.initFunction && !tool.initialized) {
                console.log('[UI-Core] Initializing tool:', tool.name);
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
    
    // ============================================
    // DRAGGABLE FUNCTIONALITY
    // ============================================
    
    /**
     * Make an element draggable
     * @param {HTMLElement} element - Element to make draggable
     * @param {HTMLElement} handle - Drag handle element
     */
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        handle.style.cursor = 'move';
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
            
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;
            
            // Keep panel within viewport
            const maxTop = window.innerHeight - element.offsetHeight;
            const maxLeft = window.innerWidth - element.offsetWidth;
            
            newTop = Math.max(0, Math.min(newTop, maxTop));
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            
            element.style.top = newTop + 'px';
            element.style.left = newLeft + 'px';
        }
        
        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            
            // Save position
            GM_setValue('recipeTools_uiPosition', {
                top: element.style.top,
                left: element.style.left
            });
        }
    }
    
    // ============================================
    // UI CONSTRUCTION
    // ============================================
    
    /**
     * Create the trigger button
     */
    function createTriggerButton() {
        if (triggerButton) return triggerButton;
        
        const theme = window.WholeFoodsTheme;
        
        triggerButton = document.createElement('button');
        triggerButton.id = 'recipeToolsTrigger';
        triggerButton.className = 'trigger-button';
        triggerButton.innerHTML = '🛠️';
        triggerButton.title = 'Recipe Tools';
        
        theme.applyStyles(triggerButton, theme.styles.triggerButton);
        
        triggerButton.addEventListener('click', togglePanel);
        
        document.body.appendChild(triggerButton);
        
        console.log('[UI-Core] ✅ Trigger button created');
        return triggerButton;
    }
    
    /**
     * Create the main panel
     */
    function createMainPanel() {
        if (mainPanel) return mainPanel;
        
        const theme = window.WholeFoodsTheme;
        
        // Main panel container
        mainPanel = document.createElement('div');
        mainPanel.id = 'recipeToolsPanel';
        mainPanel.className = 'recipe-tools-panel';
        
        theme.applyStyles(mainPanel, theme.styles.panel);
        
        // Header with drag handle
        const header = document.createElement('div');
        header.className = 'panel-header';
        header.id = 'recipeToolsHeader';
        theme.applyStyles(header, theme.styles.panelHeader);
        
        const title = document.createElement('span');
        title.className = 'panel-title';
        title.textContent = '🛠️ Recipe Tools';
        theme.applyStyles(title, theme.styles.panelTitle);
        
        const controls = document.createElement('div');
        controls.className = 'panel-controls';
        controls.style.display = 'flex';
        controls.style.gap = '4px';
        
        // Update check button
        const updateBtn = document.createElement('button');
        updateBtn.className = 'control-btn';
        updateBtn.innerHTML = '🔄';
        updateBtn.title = 'Check for Updates';
        theme.applyStyles(updateBtn, theme.styles.controlButton);
        updateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.RecipeToolsCheckForUpdates) {
                window.RecipeToolsCheckForUpdates();
            }
        });
        
        // Minimize button
        const minimizeBtn = document.createElement('button');
        minimizeBtn.className = 'control-btn';
        minimizeBtn.innerHTML = '−';
        minimizeBtn.title = 'Minimize';
        theme.applyStyles(minimizeBtn, theme.styles.controlButton);
        minimizeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hidePanel();
        });
        
        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'control-btn';
        closeBtn.innerHTML = '×';
        closeBtn.title = 'Close';
        theme.applyStyles(closeBtn, theme.styles.controlButton);
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            hidePanel();
        });
        
        controls.appendChild(updateBtn);
        controls.appendChild(minimizeBtn);
        controls.appendChild(closeBtn);
        
        header.appendChild(title);
        header.appendChild(controls);
        
        // Tab bar
        const tabBar = document.createElement('div');
        tabBar.className = 'tool-tab-bar';
        tabBar.id = 'recipeToolsTabBar';
        theme.applyStyles(tabBar, theme.styles.tabBar);
        
        // Content area
        const contentArea = document.createElement('div');
        contentArea.className = 'tool-content-area';
        contentArea.id = 'recipeToolsContentArea';
        theme.applyStyles(contentArea, theme.styles.contentArea);
        
        // Assemble panel
        mainPanel.appendChild(header);
        mainPanel.appendChild(tabBar);
        mainPanel.appendChild(contentArea);
        
        // Make draggable
        makeDraggable(mainPanel, header);
        
        // Load saved position
        const savedPosition = GM_getValue('recipeTools_uiPosition', null);
        if (savedPosition) {
            mainPanel.style.top = savedPosition.top;
            mainPanel.style.left = savedPosition.left;
        } else {
            // Default position: bottom-right
            mainPanel.style.bottom = '100px';
            mainPanel.style.right = '100px';
        }
        
        document.body.appendChild(mainPanel);
        
        // Add tabs for all registered tools
        registeredTools.forEach(tool => addToolTab(tool));
        
        console.log('[UI-Core] ✅ Main panel created');
        return mainPanel;
    }
    
    // ============================================
    // PANEL VISIBILITY
    // ============================================
    
    /**
     * Show the main panel
     */
    function showPanel() {
        if (!mainPanel) {
            createMainPanel();
        }
        
        mainPanel.style.display = 'block';
        isPanelVisible = true;
        
        // Switch to saved or first tool
        if (registeredTools.length > 0) {
            const savedTab = GM_getValue('recipeTools_activeTab', registeredTools[0].id);
            switchToTool(savedTab);
        }
        
        GM_setValue('recipeTools_uiVisible', true);
        console.log('[UI-Core] Panel shown');
    }
    
    /**
     * Hide the main panel
     */
    function hidePanel() {
        if (mainPanel) {
            mainPanel.style.display = 'none';
            isPanelVisible = false;
            GM_setValue('recipeTools_uiVisible', false);
            console.log('[UI-Core] Panel hidden');
        }
    }
    
    /**
     * Toggle panel visibility
     */
    function togglePanel() {
        if (isPanelVisible) {
            hidePanel();
        } else {
            showPanel();
        }
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    /**
     * Initialize the UI
     */
    function initializeUI() {
        console.log('[UI-Core] Initializing UI...');
        
        // Verify theme is loaded
        if (!window.WholeFoodsTheme) {
            console.error('[UI-Core] ❌ Theme not loaded!');
            return;
        }
        
        // Create trigger button
        createTriggerButton();
        
        // Create main panel (but keep it hidden initially)
        createMainPanel();
        
        // Check if panel should be visible
        const wasVisible = GM_getValue('recipeTools_uiVisible', false);
        if (wasVisible) {
            showPanel();
        }
        
        // Dispatch ready event
        document.dispatchEvent(new CustomEvent('RecipeToolsUIReady'));
        
        console.log('[UI-Core] ✅ UI initialized with', registeredTools.length, 'tools');
    }
    
    // Wait for DOM and initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeUI);
    } else {
        // DOM already loaded, wait a bit for theme to load
        setTimeout(initializeUI, 100);
    }
    
    // Export for testing
    try {
        module.exports = {
            registerTool,
            switchToTool,
            makeDraggable,
            showPanel,
            hidePanel,
            togglePanel
        };
    } catch (e) {
        // Browser environment
    }
    
    console.log('[UI-Core] Module loaded');
})();