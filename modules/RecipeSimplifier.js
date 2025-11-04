// ==UserScript==
// @name         Recipe Tools - Recipe Simplifier
// @description  Recipe text simplification with VBA formatting logic
// @version      1.0.0
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('[RecipeSimplifier] Loading module...');
    
    // ============================================
    // TOOL CONFIGURATION
    // ============================================
    const TOOL_CONFIG = {
        id: 'recipe-simplifier',
        name: 'Recipe Simplifier',
        icon: '📝',
        order: 2
    };
    
    // ============================================
    // HELPER FUNCTIONS
    // ============================================
    
    /**
     * Check if character is a left parenthesis or bracket
     * @param {string} char - Character to check
     * @returns {boolean}
     */
    function isLeftParenBracket(char) {
        return char === '(' || char === '[';
    }
    
    /**
     * Check if character is a right parenthesis or bracket
     * @param {string} char - Character to check
     * @returns {boolean}
     */
    function isRightParenBracket(char) {
        return char === ')' || char === ']';
    }
    
    /**
     * Remove asterisks and GMO-related text
     * Ported from VBA AsteriskRemover function
     * @param {string} text - Text to process
     * @returns {string} Cleaned text
     */
    function removeAsterisks(text) {
        text = text.replace(/\*/g, '');
        text = text.replace(/non-gmo\./gi, '');
        text = text.replace(/non-gmo/gi, '');
        text = text.replace(/non gmo/gi, '');
        text = text.replace(/\bgmo\b/gi, '');
        return text;
    }
    
    /**
     * Fix parentheses and brackets, apply capitalization
     * Ported from VBA fixPara function
     * @param {string} text - Text to process
     * @returns {Object} Result object with success status and text/error
     */
    function fixParentheses(text) {
        let output = '';
        let depth = 0;
        let prev = ' ';
        
        for (let i = 0; i < text.length; i++) {
            let curr = text[i];
            
            // Correct casing. depth = 0 means outside parentheses
            // Characters after a space should be capitalized
            if (depth === 0 && prev === ' ') {
                curr = curr.toUpperCase();
            } else {
                curr = curr.toLowerCase();
            }
            
            // Fix parentheses/brackets. Track value of depth to determine
            // whether a bracket or parentheses is next.
            // Modulo function always returns 0 or 1, which correspond to
            // parentheses or bracket, respectively
            if (isLeftParenBracket(curr)) {
                if (depth % 2 === 0) {
                    curr = '(';
                } else {
                    curr = '[';
                }
                depth++;
            } else if (isRightParenBracket(curr)) {
                depth--;
                if (depth % 2 === 0) {
                    curr = ')';
                } else {
                    curr = ']';
                }
            }
            
            output += curr;
            prev = curr;
        }
        
        // Fix casing of **organic at end
        output = output.replace(/\*\*organic/gi, '**Organic');
        
        // Output result. Not accurate unless parentheses/brackets are balanced
        if (depth !== 0) {
            return {
                success: false,
                error: 'Parentheses/brackets are unbalanced.'
            };
        }
        
        return {
            success: true,
            text: output
        };
    }
    
    /**
     * Load custom replacements from storage
     * @returns {Array} Array of custom replacement objects
     */
    function loadCustomReplacements() {
        const saved = GM_getValue('recipeSimplifier_customReplacements', '[]');
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('[RecipeSimplifier] Error loading custom replacements:', e);
            return [];
        }
    }
    
    /**
     * Save custom replacements to storage
     * @param {Array} replacements - Array of replacement objects
     */
    function saveCustomReplacements(replacements) {
        GM_setValue('recipeSimplifier_customReplacements', JSON.stringify(replacements));
    }
    
    /**
     * Apply custom replacements to text
     * @param {string} text - Text to process
     * @param {Array} replacements - Array of {from, to} objects
     * @returns {string} Processed text
     */
    function applyCustomReplacements(text, replacements) {
        replacements.forEach(rule => {
            if (rule.from && rule.from.trim()) {
                // Escape special regex characters in the 'from' string
                const escapedFrom = rule.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`\\b${escapedFrom}\\b`, 'gi');
                text = text.replace(regex, rule.to || '');
            }
        });
        return text;
    }
    
    /**
     * Simplify ingredients based on options
     * @param {string} text - Text to simplify
     * @param {Object} options - Simplification options
     * @returns {string} Simplified text
     */
    function simplifyIngredients(text, options) {
        if (options.removeWater) {
            // Remove water with optional qualifiers
            text = text.replace(/\b(filtered |purified |distilled )?water\b/gi, '');
            // Clean up resulting double commas or spaces
            text = text.replace(/,\s*,/g, ',');
            text = text.replace(/\(\s*,/g, '(');
            text = text.replace(/,\s*\)/g, ')');
        }
        
        if (options.simplifySalt) {
            // Simplify salt types to just "Salt"
            text = text.replace(/\b(sea |kosher |himalayan |table )?salt\b/gi, 'salt');
        }
        
        if (options.removeOrganic) {
            // Remove organic labels (with optional asterisks)
            text = text.replace(/\*?\*?organic\s+/gi, '');
        }
        
        if (options.removeGMO) {
            text = removeAsterisks(text);
        }
        
        // Apply custom replacements if enabled
        if (options.useCustomReplacements) {
            const customReplacements = loadCustomReplacements();
            text = applyCustomReplacements(text, customReplacements);
        }
        
        return text;
    }
    
    /**
     * Main text processing function
     * Combines all VBA logic
     * @param {string} inputText - Raw input text
     * @param {Object} options - Processing options
     * @returns {Object} Result with success status and output/error
     */
    function processRecipeText(inputText, options) {
        if (!inputText || inputText.trim().length === 0) {
            return {
                success: false,
                error: 'Please enter some text to process.'
            };
        }
        
        let text = inputText;
        
        // Convert to lowercase
        text = text.toLowerCase();
        
        // Replace curly braces with parentheses
        text = text.replace(/{/g, '(');
        text = text.replace(/}/g, ')');
        
        // Apply ingredient simplifications
        text = simplifyIngredients(text, options);
        
        // Check for asterisks and process if needed
        if (text.includes('*')) {
            text = removeAsterisks(text);
        }
        
        // Fix parentheses and capitalization
        let result;
        if (options.fixCapitalization) {
            result = fixParentheses(text);
            if (!result.success) {
                return result;
            }
            text = result.text;
        }
        
        // Trim excess whitespace
        text = text.trim();
        text = text.replace(/\s+/g, ' '); // Multiple spaces to single space
        text = text.replace(/\s*,\s*/g, ', '); // Normalize comma spacing
        text = text.replace(/\s*\(\s*/g, ' ('); // Space before opening paren
        text = text.replace(/\s*\)\s*/g, ') '); // Space after closing paren
        text = text.replace(/\s+/g, ' '); // Clean up any double spaces created
        text = text.trim();
        
        return {
            success: true,
            text: text
        };
    }
    
    // ============================================
    // UI BUILDER
    // ============================================
    
    /**
     * Build the simplifier UI
     * @returns {HTMLElement} Content container
     */
    function buildSimplifierContent() {
        const theme = window.WholeFoodsTheme;
        const container = document.createElement('div');
        container.className = 'tool-content recipe-simplifier-content';
        container.id = 'recipe-simplifier-content';
        
        // Input section
        const inputSection = document.createElement('div');
        theme.applyStyles(inputSection, theme.styles.inputGroup);
        
        const inputLabelRow = document.createElement('div');
        inputLabelRow.style.display = 'flex';
        inputLabelRow.style.justifyContent = 'space-between';
        inputLabelRow.style.alignItems = 'center';
        inputLabelRow.style.marginBottom = '6px';
        
        const inputLabel = document.createElement('label');
        inputLabel.textContent = 'Input Recipe Text:';
        theme.applyStyles(inputLabel, theme.styles.label);
        inputLabel.style.marginBottom = '0';
        
        const inputCharCount = document.createElement('span');
        inputCharCount.id = 'inputCharCount';
        inputCharCount.textContent = '0 characters';
        inputCharCount.style.fontSize = '12px';
        inputCharCount.style.color = theme.colors.textSecondary;
        
        inputLabelRow.appendChild(inputLabel);
        inputLabelRow.appendChild(inputCharCount);
        
        const inputTextarea = document.createElement('textarea');
        inputTextarea.id = 'recipeInput';
        inputTextarea.className = 'wf-textarea';
        inputTextarea.rows = 6;
        inputTextarea.placeholder = 'Paste your recipe ingredients here...';
        theme.applyStyles(inputTextarea, theme.styles.textarea);
        
        inputSection.appendChild(inputLabelRow);
        inputSection.appendChild(inputTextarea);
        
        // Options section (collapsible)
        const optionsSection = document.createElement('div');
        theme.applyStyles(optionsSection, theme.styles.inputGroup);
        
        // Options header (clickable to expand/collapse)
        const optionsHeader = document.createElement('div');
        optionsHeader.style.display = 'flex';
        optionsHeader.style.justifyContent = 'space-between';
        optionsHeader.style.alignItems = 'center';
        optionsHeader.style.cursor = 'pointer';
        optionsHeader.style.padding = '8px 12px';
        optionsHeader.style.backgroundColor = theme.colors.lightGray;
        optionsHeader.style.borderRadius = '6px';
        optionsHeader.style.marginBottom = '8px';
        optionsHeader.style.userSelect = 'none';
        
        const optionsLabel = document.createElement('label');
        optionsLabel.textContent = 'Simplification Options';
        optionsLabel.style.fontWeight = '600';
        optionsLabel.style.fontSize = '14px';
        optionsLabel.style.color = theme.colors.textPrimary;
        optionsLabel.style.cursor = 'pointer';
        optionsLabel.style.margin = '0';
        
        const optionsToggle = document.createElement('span');
        optionsToggle.id = 'optionsToggle';
        optionsToggle.textContent = '▼';
        optionsToggle.style.fontSize = '12px';
        optionsToggle.style.color = theme.colors.textSecondary;
        optionsToggle.style.transition = 'transform 0.2s';
        
        optionsHeader.appendChild(optionsLabel);
        optionsHeader.appendChild(optionsToggle);
        
        // Options content (collapsible)
        const optionsContent = document.createElement('div');
        optionsContent.id = 'optionsContent';
        optionsContent.style.display = 'block';
        optionsContent.style.paddingLeft = '8px';
        
        const options = [
            { id: 'removeWater', label: 'Remove water', checked: true },
            { id: 'simplifySalt', label: 'Simplify salt types (e.g., "Sea Salt" → "Salt")', checked: true },
            { id: 'removeOrganic', label: 'Remove "organic" labels', checked: false },
            { id: 'removeGMO', label: 'Remove GMO-related text and asterisks', checked: true },
            { id: 'fixCapitalization', label: 'Fix capitalization and brackets', checked: true },
            { id: 'useCustomReplacements', label: 'Apply custom replacements', checked: true }
        ];
        
        options.forEach(opt => {
            const checkboxContainer = document.createElement('div');
            theme.applyStyles(checkboxContainer, theme.styles.checkboxContainer);
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = opt.id;
            checkbox.checked = opt.checked;
            theme.applyStyles(checkbox, theme.styles.checkbox);
            
            const label = document.createElement('label');
            label.htmlFor = opt.id;
            label.textContent = opt.label;
            label.style.cursor = 'pointer';
            label.style.fontSize = '14px';
            label.style.color = theme.colors.textPrimary;
            
            checkboxContainer.appendChild(checkbox);
            checkboxContainer.appendChild(label);
            optionsContent.appendChild(checkboxContainer);
        });
        
        // Custom replacements section
        const customSection = document.createElement('div');
        customSection.style.marginTop = '12px';
        customSection.style.padding = '12px';
        customSection.style.backgroundColor = theme.colors.lightGray;
        customSection.style.borderRadius = '6px';
        
        const customHeader = document.createElement('div');
        customHeader.style.display = 'flex';
        customHeader.style.justifyContent = 'space-between';
        customHeader.style.alignItems = 'center';
        customHeader.style.marginBottom = '8px';
        
        const customTitleRow = document.createElement('div');
        customTitleRow.style.display = 'flex';
        customTitleRow.style.alignItems = 'center';
        customTitleRow.style.gap = '6px';
        
        const customTitle = document.createElement('strong');
        customTitle.textContent = 'Custom Replacements';
        customTitle.style.fontSize = '13px';
        customTitle.style.color = theme.colors.textPrimary;
        
        // Info icon for tooltip
        const infoIcon = document.createElement('span');
        infoIcon.innerHTML = 'ℹ️';
        infoIcon.style.fontSize = '14px';
        infoIcon.style.cursor = 'help';
        infoIcon.style.opacity = '0.7';
        infoIcon.title = 'Click for best practices';
        
        customTitleRow.appendChild(customTitle);
        customTitleRow.appendChild(infoIcon);
        
        const customButtons = document.createElement('div');
        customButtons.style.display = 'flex';
        customButtons.style.gap = '6px';
        
        const importBtn = document.createElement('button');
        importBtn.id = 'importCustomBtn';
        importBtn.textContent = '📤 Import';
        importBtn.style.fontSize = '11px';
        importBtn.style.padding = '4px 8px';
        importBtn.style.border = `1px solid ${theme.colors.border}`;
        importBtn.style.borderRadius = '4px';
        importBtn.style.backgroundColor = theme.colors.white;
        importBtn.style.cursor = 'pointer';
        importBtn.title = 'Import CSV file to append rules';
        
        const exportBtn = document.createElement('button');
        exportBtn.id = 'exportCustomBtn';
        exportBtn.textContent = '📥 Export';
        exportBtn.style.fontSize = '11px';
        exportBtn.style.padding = '4px 8px';
        exportBtn.style.border = `1px solid ${theme.colors.border}`;
        exportBtn.style.borderRadius = '4px';
        exportBtn.style.backgroundColor = theme.colors.white;
        exportBtn.style.cursor = 'pointer';
        exportBtn.title = 'Export rules to CSV file';
        
        const addBtn = document.createElement('button');
        addBtn.id = 'addCustomBtn';
        addBtn.textContent = '+ Add';
        addBtn.style.fontSize = '11px';
        addBtn.style.padding = '4px 8px';
        addBtn.style.border = 'none';
        addBtn.style.borderRadius = '4px';
        addBtn.style.backgroundColor = theme.colors.primaryGreen;
        addBtn.style.color = theme.colors.white;
        addBtn.style.cursor = 'pointer';
        addBtn.title = 'Add a new custom replacement';
        
        customButtons.appendChild(importBtn);
        customButtons.appendChild(exportBtn);
        customButtons.appendChild(addBtn);
        customHeader.appendChild(customTitleRow);
        customHeader.appendChild(customButtons);
        
        // Best practices tooltip (hidden by default)
        const tooltip = document.createElement('div');
        tooltip.id = 'customReplacementsTooltip';
        tooltip.style.display = 'none';
        tooltip.style.marginTop = '8px';
        tooltip.style.padding = '10px';
        tooltip.style.backgroundColor = '#f5f7fa';
        tooltip.style.border = `2px solid ${theme.colors.primaryGreen}`;
        tooltip.style.borderRadius = '6px';
        tooltip.style.fontSize = '12px';
        tooltip.style.lineHeight = '1.6';
        tooltip.innerHTML = `
            <div style="font-weight:600;color:${theme.colors.primaryGreen};margin-bottom:6px;">📋 Best Practices:</div>
            <ul style="margin:4px 0 0 18px;padding:0;color:${theme.colors.textPrimary};">
                <li><strong>Case insensitive:</strong> Matches ignore case (e.g., "Red Wine" = "red wine")</li>
                <li><strong>Use 2+ words:</strong> Avoid false matches (e.g., "red wine" not "wine")</li>
                <li><strong>Whole words only:</strong> Won't match partial words (e.g., "salt" won't match "salted")</li>
                <li><strong>Order matters:</strong> Rules apply top to bottom</li>
                <li><strong>Empty "To":</strong> Removes the text completely</li>
            </ul>
            <div style="margin-top:8px;padding-top:8px;border-top:1px solid ${theme.colors.border};font-style:italic;color:${theme.colors.textSecondary};">
                💡 Tip: Test with a sample before adding many rules
            </div>
        `;
        
        // Toggle tooltip on info icon click
        infoIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            tooltip.style.display = tooltip.style.display === 'none' ? 'block' : 'none';
        });
        
        const customList = document.createElement('div');
        customList.id = 'customReplacementsList';
        customList.style.maxHeight = '150px';
        customList.style.overflowY = 'auto';
        
        customSection.appendChild(customHeader);
        customSection.appendChild(tooltip);
        customSection.appendChild(customList);
        optionsContent.appendChild(customSection);
        
        optionsSection.appendChild(optionsHeader);
        optionsSection.appendChild(optionsContent);
        
        // Toggle collapse on header click
        optionsHeader.addEventListener('click', () => {
            const isCollapsed = optionsContent.style.display === 'none';
            optionsContent.style.display = isCollapsed ? 'block' : 'none';
            optionsToggle.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(-90deg)';
        });
        
        // Process button
        const buttonSection = document.createElement('div');
        buttonSection.style.textAlign = 'center';
        buttonSection.style.margin = '16px 0';
        
        const processButton = document.createElement('button');
        processButton.id = 'processButton';
        processButton.className = 'wf-button';
        processButton.textContent = 'Simplify Recipe';
        theme.applyStyles(processButton, {
            ...theme.styles.primaryButton,
            padding: '12px 32px',
            fontSize: '15px'
        });
        
        buttonSection.appendChild(processButton);
        
        // Output section
        const outputSection = document.createElement('div');
        theme.applyStyles(outputSection, theme.styles.inputGroup);
        
        const outputLabelRow = document.createElement('div');
        outputLabelRow.style.display = 'flex';
        outputLabelRow.style.justifyContent = 'space-between';
        outputLabelRow.style.alignItems = 'center';
        outputLabelRow.style.marginBottom = '6px';
        
        const outputLabel = document.createElement('label');
        outputLabel.textContent = 'Simplified Output:';
        theme.applyStyles(outputLabel, theme.styles.label);
        outputLabel.style.marginBottom = '0';
        
        const outputCharCount = document.createElement('span');
        outputCharCount.id = 'outputCharCount';
        outputCharCount.textContent = '0 characters';
        outputCharCount.style.fontSize = '12px';
        outputCharCount.style.color = theme.colors.textSecondary;
        
        outputLabelRow.appendChild(outputLabel);
        outputLabelRow.appendChild(outputCharCount);
        
        const outputTextarea = document.createElement('textarea');
        outputTextarea.id = 'recipeOutput';
        outputTextarea.className = 'wf-textarea';
        outputTextarea.rows = 6;
        outputTextarea.readOnly = true;
        outputTextarea.placeholder = 'Simplified text will appear here...';
        theme.applyStyles(outputTextarea, {
            ...theme.styles.textarea,
            backgroundColor: theme.colors.lightGray
        });
        
        outputSection.appendChild(outputLabelRow);
        outputSection.appendChild(outputTextarea);
        
        // Copy button
        const copyButtonSection = document.createElement('div');
        copyButtonSection.style.textAlign = 'center';
        copyButtonSection.style.marginTop = '12px';
        
        const copyButton = document.createElement('button');
        copyButton.id = 'copyButton';
        copyButton.className = 'wf-secondary-button';
        copyButton.textContent = '📋 Copy to Clipboard';
        theme.applyStyles(copyButton, theme.styles.secondaryButton);
        
        copyButtonSection.appendChild(copyButton);
        
        // Messages
        const errorMsg = document.createElement('div');
        errorMsg.id = 'simplifierError';
        theme.applyStyles(errorMsg, theme.styles.errorMessage);
        
        const successMsg = document.createElement('div');
        successMsg.id = 'simplifierSuccess';
        theme.applyStyles(successMsg, theme.styles.successMessage);
        
        // Assemble
        container.appendChild(inputSection);
        container.appendChild(optionsSection);
        container.appendChild(buttonSection);
        container.appendChild(errorMsg);
        container.appendChild(outputSection);
        container.appendChild(copyButtonSection);
        container.appendChild(successMsg);
        
        return container;
    }
    
    // ============================================
    // EVENT HANDLERS
    // ============================================
    
    /**
     * Update character count for a textarea
     * @param {string} textareaId - ID of the textarea
     * @param {string} counterId - ID of the counter element
     */
    function updateCharCount(textareaId, counterId) {
        const textarea = document.getElementById(textareaId);
        const counter = document.getElementById(counterId);
        if (textarea && counter) {
            const count = textarea.value.length;
            const theme = window.WholeFoodsTheme;
            
            counter.textContent = `${count.toLocaleString()} character${count !== 1 ? 's' : ''}`;
            
            // Change color to red if at or over 1480 characters
            if (count >= 1480) {
                counter.style.color = theme.colors.error;
                counter.style.fontWeight = '600';
            } else {
                counter.style.color = theme.colors.textSecondary;
                counter.style.fontWeight = 'normal';
            }
        }
    }
    
    /**
     * Handle process button click
     */
    function handleProcessClick() {
        const inputText = document.getElementById('recipeInput').value;
        const outputTextarea = document.getElementById('recipeOutput');
        const errorMsg = document.getElementById('simplifierError');
        const successMsg = document.getElementById('simplifierSuccess');
        
        // Clear messages
        errorMsg.style.display = 'none';
        successMsg.style.display = 'none';
        
        // Get options
        const options = {
            removeWater: document.getElementById('removeWater').checked,
            simplifySalt: document.getElementById('simplifySalt').checked,
            removeOrganic: document.getElementById('removeOrganic').checked,
            removeGMO: document.getElementById('removeGMO').checked,
            fixCapitalization: document.getElementById('fixCapitalization').checked,
            useCustomReplacements: document.getElementById('useCustomReplacements').checked
        };
        
        // Process text
        const result = processRecipeText(inputText, options);
        
        if (result.success) {
            outputTextarea.value = result.text;
            updateCharCount('recipeOutput', 'outputCharCount');
            successMsg.textContent = '✓ Recipe simplified successfully!';
            successMsg.style.display = 'block';
        } else {
            outputTextarea.value = '';
            updateCharCount('recipeOutput', 'outputCharCount');
            errorMsg.textContent = result.error;
            errorMsg.style.display = 'block';
        }
    }
    
    /**
     * Handle copy button click
     */
    function handleCopyClick() {
        const outputTextarea = document.getElementById('recipeOutput');
        const successMsg = document.getElementById('simplifierSuccess');
        const errorMsg = document.getElementById('simplifierError');
        
        if (!outputTextarea.value) {
            errorMsg.textContent = 'Nothing to copy. Please process some text first.';
            errorMsg.style.display = 'block';
            return;
        }
        
        // Copy to clipboard
        outputTextarea.select();
        document.execCommand('copy');
        
        // Show success message
        successMsg.textContent = '✓ Copied to clipboard!';
        successMsg.style.display = 'block';
        
        // Hide message after 2 seconds
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 2000);
    }
    
    /**
     * Render the custom replacements list
     */
    function renderCustomReplacements() {
        const list = document.getElementById('customReplacementsList');
        if (!list) return;
        
        const replacements = loadCustomReplacements();
        const theme = window.WholeFoodsTheme;
        
        list.innerHTML = '';
        
        if (replacements.length === 0) {
            const emptyMsg = document.createElement('div');
            emptyMsg.textContent = 'No custom replacements yet. Click "+ Add" to create one.';
            emptyMsg.style.fontSize = '12px';
            emptyMsg.style.color = theme.colors.textSecondary;
            emptyMsg.style.fontStyle = 'italic';
            emptyMsg.style.padding = '8px';
            list.appendChild(emptyMsg);
            return;
        }
        
        replacements.forEach((rule, index) => {
            const item = document.createElement('div');
            item.style.display = 'flex';
            item.style.justifyContent = 'space-between';
            item.style.alignItems = 'center';
            item.style.padding = '6px 8px';
            item.style.marginBottom = '4px';
            item.style.backgroundColor = theme.colors.white;
            item.style.borderRadius = '4px';
            item.style.fontSize = '12px';
            
            const ruleText = document.createElement('span');
            ruleText.textContent = `"${rule.from}" → "${rule.to || '(remove)'}"`;
            ruleText.style.flex = '1';
            ruleText.style.color = theme.colors.textPrimary;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.style.border = 'none';
            deleteBtn.style.background = 'transparent';
            deleteBtn.style.color = theme.colors.error;
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.fontSize = '18px';
            deleteBtn.style.padding = '0 4px';
            deleteBtn.title = 'Delete this replacement';
            
            deleteBtn.addEventListener('click', () => {
                deleteCustomReplacement(index);
            });
            
            item.appendChild(ruleText);
            item.appendChild(deleteBtn);
            list.appendChild(item);
        });
    }
    
    /**
     * Add a new custom replacement
     */
    function addCustomReplacement() {
        const from = prompt('Enter the text to find (e.g., "red wine"):');
        if (!from || !from.trim()) return;
        
        const to = prompt('Enter the replacement text (leave empty to remove):\n\nExample: "red wine" → "wine"', '');
        if (to === null) return; // User cancelled
        
        const replacements = loadCustomReplacements();
        replacements.push({
            from: from.trim(),
            to: to.trim()
        });
        
        saveCustomReplacements(replacements);
        renderCustomReplacements();
        
        // Show success message
        const successMsg = document.getElementById('simplifierSuccess');
        if (successMsg) {
            successMsg.textContent = '✓ Custom replacement added!';
            successMsg.style.display = 'block';
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 2000);
        }
    }
    
    /**
     * Delete a custom replacement
     * @param {number} index - Index of replacement to delete
     */
    function deleteCustomReplacement(index) {
        const replacements = loadCustomReplacements();
        replacements.splice(index, 1);
        saveCustomReplacements(replacements);
        renderCustomReplacements();
    }
    
    /**
     * Export custom replacements to CSV
     */
    function exportCustomReplacements() {
        const replacements = loadCustomReplacements();
        
        if (replacements.length === 0) {
            alert('No custom replacements to export.');
            return;
        }
        
        // Create CSV content
        let csv = 'From,To\n';
        replacements.forEach(rule => {
            // Escape quotes and wrap in quotes if contains comma
            const from = rule.from.includes(',') ? `"${rule.from.replace(/"/g, '""')}"` : rule.from;
            const to = rule.to.includes(',') ? `"${rule.to.replace(/"/g, '""')}"` : rule.to;
            csv += `${from},${to}\n`;
        });
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', 'recipe-custom-replacements.csv');
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        const successMsg = document.getElementById('simplifierSuccess');
        if (successMsg) {
            successMsg.textContent = '✓ Custom replacements exported!';
            successMsg.style.display = 'block';
            setTimeout(() => {
                successMsg.style.display = 'none';
            }, 2000);
        }
    }
    
    /**
     * Import custom replacements from CSV file (appends to existing)
     */
    function importCustomReplacements() {
        // Create file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.csv';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const csv = event.target.result;
                    const lines = csv.split('\n');
                    
                    // Skip header row
                    const dataLines = lines.slice(1).filter(line => line.trim());
                    
                    if (dataLines.length === 0) {
                        alert('No data found in CSV file.');
                        return;
                    }
                    
                    // Parse CSV and append to existing replacements
                    const existingReplacements = loadCustomReplacements();
                    let importedCount = 0;
                    let duplicateCount = 0;
                    
                    dataLines.forEach(line => {
                        // Simple CSV parsing (handles quoted fields)
                        const match = line.match(/^"?([^"]*)"?,\s*"?([^"]*)"?$/);
                        if (match) {
                            const from = match[1].replace(/""/g, '"').trim();
                            const to = match[2].replace(/""/g, '"').trim();
                            
                            if (from) {
                                // Check for duplicates
                                const isDuplicate = existingReplacements.some(r =>
                                    r.from.toLowerCase() === from.toLowerCase()
                                );
                                
                                if (!isDuplicate) {
                                    existingReplacements.push({ from, to });
                                    importedCount++;
                                } else {
                                    duplicateCount++;
                                }
                            }
                        }
                    });
                    
                    // Save updated list
                    saveCustomReplacements(existingReplacements);
                    renderCustomReplacements();
                    
                    // Show success message
                    const successMsg = document.getElementById('simplifierSuccess');
                    const errorMsg = document.getElementById('simplifierError');
                    
                    if (importedCount > 0) {
                        let message = `✓ Imported ${importedCount} replacement${importedCount !== 1 ? 's' : ''}!`;
                        if (duplicateCount > 0) {
                            message += ` (${duplicateCount} duplicate${duplicateCount !== 1 ? 's' : ''} skipped)`;
                        }
                        
                        if (successMsg) {
                            successMsg.textContent = message;
                            successMsg.style.display = 'block';
                            setTimeout(() => {
                                successMsg.style.display = 'none';
                            }, 3000);
                        }
                    } else if (duplicateCount > 0) {
                        if (errorMsg) {
                            errorMsg.textContent = `All ${duplicateCount} rule${duplicateCount !== 1 ? 's' : ''} already exist. No new rules imported.`;
                            errorMsg.style.display = 'block';
                            setTimeout(() => {
                                errorMsg.style.display = 'none';
                            }, 3000);
                        }
                    }
                    
                } catch (error) {
                    console.error('[RecipeSimplifier] Error importing CSV:', error);
                    alert('Error importing CSV file. Please check the file format.');
                }
            };
            
            reader.readAsText(file);
        });
        
        // Trigger file selection
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    /**
     * Initialize the simplifier
     */
    function initSimplifier() {
        console.log('[RecipeSimplifier] Initializing...');
        
        // Wait for content to be ready
        document.addEventListener('toolContentReady', (e) => {
            if (e.detail.toolId === TOOL_CONFIG.id) {
                setupEventListeners();
                console.log('[RecipeSimplifier] ✅ Initialized');
            }
        });
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        const processButton = document.getElementById('processButton');
        const copyButton = document.getElementById('copyButton');
        const inputTextarea = document.getElementById('recipeInput');
        const addCustomBtn = document.getElementById('addCustomBtn');
        const importCustomBtn = document.getElementById('importCustomBtn');
        const exportCustomBtn = document.getElementById('exportCustomBtn');
        
        processButton.addEventListener('click', handleProcessClick);
        copyButton.addEventListener('click', handleCopyClick);
        
        // Update character count as user types
        inputTextarea.addEventListener('input', () => {
            updateCharCount('recipeInput', 'inputCharCount');
        });
        
        // Custom replacement buttons
        addCustomBtn.addEventListener('click', addCustomReplacement);
        importCustomBtn.addEventListener('click', importCustomReplacements);
        exportCustomBtn.addEventListener('click', exportCustomReplacements);
        
        // Initialize character counts
        updateCharCount('recipeInput', 'inputCharCount');
        updateCharCount('recipeOutput', 'outputCharCount');
        
        // Render custom replacements list
        renderCustomReplacements();
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
                initFunction: initSimplifier,
                contentBuilder: buildSimplifierContent
            });
        } else {
            document.addEventListener('RecipeToolsUIReady', () => {
                window.RecipeToolsUI.registerTool({
                    ...TOOL_CONFIG,
                    initFunction: initSimplifier,
                    contentBuilder: buildSimplifierContent
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
            initSimplifier,
            buildSimplifierContent,
            processRecipeText,
            fixParentheses,
            removeAsterisks,
            simplifyIngredients,
            loadCustomReplacements,
            saveCustomReplacements,
            applyCustomReplacements,
            addCustomReplacement,
            deleteCustomReplacement,
            importCustomReplacements,
            exportCustomReplacements,
            renderCustomReplacements
        };
    } catch (e) {
        // Browser environment
    }
    
    console.log('[RecipeSimplifier] Module loaded');
})();