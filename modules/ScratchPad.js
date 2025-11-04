// ==UserScript==
// @name         Recipe Tools - Scratchpad
// @description  Multi-tab persistent notepad
// @version      1.0.0
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('[ScratchPad] Loading module...');
    
    // ============================================
    // TOOL CONFIGURATION
    // ============================================
    const TOOL_CONFIG = {
        id: 'scratchpad',
        name: 'Scratchpad',
        icon: '📝',
        order: 3
    };
    
    // ============================================
    // STORAGE HELPERS
    // ============================================
    
    /**
     * Get tabs from storage
     * @returns {Array} Array of tab objects
     */
    function getTabs() {
        const saved = GM_getValue('scratchpad_tabs', null);
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('[ScratchPad] Error parsing tabs:', e);
            }
        }
        return [{ name: 'Tab 1', content: '' }];
    }
    
    /**
     * Save tabs to storage
     * @param {Array} tabs - Array of tab objects
     */
    function setTabs(tabs) {
        GM_setValue('scratchpad_tabs', JSON.stringify(tabs));
    }
    
    /**
     * Get active tab index
     * @returns {number} Active tab index
     */
    function getActiveTabIndex() {
        return parseInt(GM_getValue('scratchpad_activeTab', '0'), 10);
    }
    
    /**
     * Set active tab index
     * @param {number} idx - Tab index
     */
    function setActiveTabIndex(idx) {
        GM_setValue('scratchpad_activeTab', idx.toString());
    }
    
    // ============================================
    // STATE
    // ============================================
    let tabs = [];
    let activeTabIndex = 0;
    
    // ============================================
    // UI BUILDER
    // ============================================
    
    /**
     * Build the scratchpad UI
     * @returns {HTMLElement} Content container
     */
    function buildScratchpadContent() {
        const theme = window.WholeFoodsTheme;
        const container = document.createElement('div');
        container.className = 'tool-content scratchpad-content';
        container.id = 'scratchpad-content';
        
        // Info section
        const infoSection = document.createElement('div');
        infoSection.style.marginBottom = '12px';
        infoSection.style.padding = '12px';
        infoSection.style.backgroundColor = theme.colors.lightGray;
        infoSection.style.borderRadius = '6px';
        infoSection.style.fontSize = '13px';
        infoSection.style.color = theme.colors.textSecondary;
        infoSection.innerHTML = `
            <strong style="color: ${theme.colors.textPrimary};">💡 Quick Notes</strong><br>
            Multi-tab notepad with automatic saving. Double-click tabs to rename.
        `;
        
        // Tab bar
        const tabBar = document.createElement('div');
        tabBar.id = 'scratchpadTabBar';
        tabBar.style.display = 'flex';
        tabBar.style.alignItems = 'center';
        tabBar.style.background = theme.colors.lightGray;
        tabBar.style.borderRadius = '6px 6px 0 0';
        tabBar.style.padding = '4px';
        tabBar.style.overflowX = 'auto';
        tabBar.style.marginBottom = '0';
        
        // Textarea
        const textarea = document.createElement('textarea');
        textarea.id = 'scratchpadTextarea';
        textarea.className = 'wf-textarea';
        textarea.rows = 12;
        textarea.placeholder = 'Type or paste anything here...';
        theme.applyStyles(textarea, {
            ...theme.styles.textarea,
            fontFamily: 'monospace',
            fontSize: '13px',
            marginTop: '0',
            borderRadius: '0 0 6px 6px'
        });
        
        // Character count
        const charCount = document.createElement('div');
        charCount.id = 'scratchpadCharCount';
        charCount.style.textAlign = 'right';
        charCount.style.fontSize = '12px';
        charCount.style.color = theme.colors.textSecondary;
        charCount.style.marginTop = '6px';
        charCount.textContent = '0 characters';
        
        // Assemble
        container.appendChild(infoSection);
        container.appendChild(tabBar);
        container.appendChild(textarea);
        container.appendChild(charCount);
        
        return container;
    }
    
    // ============================================
    // TAB MANAGEMENT
    // ============================================
    
    /**
     * Render tabs in the tab bar
     */
    function renderTabs() {
        const tabBar = document.getElementById('scratchpadTabBar');
        if (!tabBar) return;
        
        const theme = window.WholeFoodsTheme;
        
        // Clear existing tabs
        tabBar.innerHTML = '';
        
        tabs.forEach((tab, idx) => {
            const tabBtn = document.createElement('div');
            tabBtn.textContent = tab.name;
            tabBtn.style.padding = '6px 12px';
            tabBtn.style.margin = '2px';
            tabBtn.style.borderRadius = '4px';
            tabBtn.style.background = idx === activeTabIndex ? theme.colors.white : 'transparent';
            tabBtn.style.cursor = 'pointer';
            tabBtn.style.position = 'relative';
            tabBtn.style.fontWeight = idx === activeTabIndex ? '600' : 'normal';
            tabBtn.style.fontSize = '13px';
            tabBtn.style.userSelect = 'none';
            tabBtn.style.color = idx === activeTabIndex ? theme.colors.primaryGreen : theme.colors.textPrimary;
            tabBtn.title = 'Double-click to rename';
            tabBtn.style.transition = 'all 0.2s';
            
            // Hover effect
            tabBtn.addEventListener('mouseenter', () => {
                if (idx !== activeTabIndex) {
                    tabBtn.style.background = 'rgba(0, 103, 79, 0.1)';
                }
            });
            tabBtn.addEventListener('mouseleave', () => {
                if (idx !== activeTabIndex) {
                    tabBtn.style.background = 'transparent';
                }
            });
            
            // Switch tab
            tabBtn.addEventListener('click', () => {
                switchTab(idx);
            });
            
            // Rename tab on double-click
            tabBtn.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                renameTab(idx);
            });
            
            // Close button (if more than 1 tab)
            if (tabs.length > 1) {
                const closeBtn = document.createElement('span');
                closeBtn.innerHTML = '×';
                closeBtn.style.position = 'absolute';
                closeBtn.style.right = '4px';
                closeBtn.style.top = '4px';
                closeBtn.style.fontSize = '16px';
                closeBtn.style.color = theme.colors.textSecondary;
                closeBtn.style.cursor = 'pointer';
                closeBtn.style.fontWeight = 'bold';
                closeBtn.title = 'Close tab';
                
                closeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    closeTab(idx);
                });
                
                closeBtn.addEventListener('mouseenter', () => {
                    closeBtn.style.color = theme.colors.error;
                });
                closeBtn.addEventListener('mouseleave', () => {
                    closeBtn.style.color = theme.colors.textSecondary;
                });
                
                tabBtn.appendChild(closeBtn);
                tabBtn.style.paddingRight = '24px'; // Make room for close button
            }
            
            tabBar.appendChild(tabBtn);
        });
        
        // Add tab button
        const addBtn = document.createElement('div');
        addBtn.textContent = '+';
        addBtn.style.padding = '6px 12px';
        addBtn.style.margin = '2px';
        addBtn.style.borderRadius = '4px';
        addBtn.style.background = 'transparent';
        addBtn.style.cursor = 'pointer';
        addBtn.style.fontWeight = 'bold';
        addBtn.style.fontSize = '16px';
        addBtn.style.color = theme.colors.primaryGreen;
        addBtn.title = 'Add new tab';
        addBtn.style.transition = 'all 0.2s';
        
        addBtn.addEventListener('mouseenter', () => {
            addBtn.style.background = 'rgba(0, 103, 79, 0.1)';
        });
        addBtn.addEventListener('mouseleave', () => {
            addBtn.style.background = 'transparent';
        });
        
        addBtn.addEventListener('click', addTab);
        
        tabBar.appendChild(addBtn);
    }
    
    /**
     * Switch to a different tab
     * @param {number} idx - Tab index
     */
    function switchTab(idx) {
        saveCurrentTabContent();
        activeTabIndex = idx;
        setActiveTabIndex(activeTabIndex);
        renderTabs();
        loadTabContent();
    }
    
    /**
     * Add a new tab
     */
    function addTab() {
        saveCurrentTabContent();
        const newTabName = `Tab ${tabs.length + 1}`;
        tabs.push({ name: newTabName, content: '' });
        activeTabIndex = tabs.length - 1;
        setTabs(tabs);
        setActiveTabIndex(activeTabIndex);
        renderTabs();
        loadTabContent();
        
        const textarea = document.getElementById('scratchpadTextarea');
        if (textarea) textarea.focus();
    }
    
    /**
     * Close a tab
     * @param {number} idx - Tab index
     */
    function closeTab(idx) {
        if (tabs.length <= 1) return; // Keep at least one tab
        
        tabs.splice(idx, 1);
        if (activeTabIndex >= tabs.length) {
            activeTabIndex = tabs.length - 1;
        }
        setTabs(tabs);
        setActiveTabIndex(activeTabIndex);
        renderTabs();
        loadTabContent();
    }
    
    /**
     * Rename a tab
     * @param {number} idx - Tab index
     */
    function renameTab(idx) {
        const newName = prompt('Rename tab:', tabs[idx].name);
        if (newName && newName.trim()) {
            tabs[idx].name = newName.trim();
            setTabs(tabs);
            renderTabs();
        }
    }
    
    /**
     * Save current tab content
     */
    function saveCurrentTabContent() {
        const textarea = document.getElementById('scratchpadTextarea');
        if (textarea && tabs[activeTabIndex]) {
            tabs[activeTabIndex].content = textarea.value;
            setTabs(tabs);
        }
    }
    
    /**
     * Load tab content into textarea
     */
    function loadTabContent() {
        const textarea = document.getElementById('scratchpadTextarea');
        if (textarea && tabs[activeTabIndex]) {
            textarea.value = tabs[activeTabIndex].content || '';
            updateCharCount();
        }
    }
    
    /**
     * Update character count
     */
    function updateCharCount() {
        const textarea = document.getElementById('scratchpadTextarea');
        const charCount = document.getElementById('scratchpadCharCount');
        if (textarea && charCount) {
            const count = textarea.value.length;
            charCount.textContent = `${count.toLocaleString()} character${count !== 1 ? 's' : ''}`;
        }
    }
    
    // ============================================
    // EVENT HANDLERS
    // ============================================
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        const textarea = document.getElementById('scratchpadTextarea');
        
        if (textarea) {
            // Auto-save on input
            textarea.addEventListener('input', () => {
                saveCurrentTabContent();
                updateCharCount();
            });
        }
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    /**
     * Initialize the scratchpad
     */
    function initScratchpad() {
        console.log('[ScratchPad] Initializing...');
        
        // Load tabs from storage
        tabs = getTabs();
        activeTabIndex = Math.min(getActiveTabIndex(), tabs.length - 1);
        
        // Wait for content to be ready
        document.addEventListener('toolContentReady', (e) => {
            if (e.detail.toolId === TOOL_CONFIG.id) {
                renderTabs();
                loadTabContent();
                setupEventListeners();
                console.log('[ScratchPad] ✅ Initialized');
            }
        });
    }
    
    // ============================================
    // REGISTRATION
    // ============================================
    
    /**
     * Register this tool with the UI framework
     */
    function registerThisTool() {
        if (window.RecipeToolsUI) {
            window.RecipeToolsUI.registerTool({
                ...TOOL_CONFIG,
                initFunction: initScratchpad,
                contentBuilder: buildScratchpadContent
            });
        } else {
            document.addEventListener('RecipeToolsUIReady', () => {
                window.RecipeToolsUI.registerTool({
                    ...TOOL_CONFIG,
                    initFunction: initScratchpad,
                    contentBuilder: buildScratchpadContent
                });
            });
        }
    }
    
    // Auto-register
    registerThisTool();
    
    // ============================================
    // EXPORTS
    // ============================================
    try {
        module.exports = {
            initScratchpad,
            buildScratchpadContent,
            getTabs,
            setTabs,
            switchTab,
            addTab,
            closeTab,
            renameTab
        };
    } catch (e) {
        // Browser environment
    }
    
    console.log('[ScratchPad] Module loaded');
})();