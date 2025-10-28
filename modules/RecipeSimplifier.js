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
        
        // Options section
        const optionsSection = document.createElement('div');
        theme.applyStyles(optionsSection, theme.styles.inputGroup);
        
        const optionsLabel = document.createElement('label');
        optionsLabel.textContent = 'Simplification Options:';
        theme.applyStyles(optionsLabel, theme.styles.label);
        
        const options = [
            { id: 'removeWater', label: 'Remove water', checked: true },
            { id: 'simplifySalt', label: 'Simplify salt types (e.g., "Sea Salt" → "Salt")', checked: true },
            { id: 'removeOrganic', label: 'Remove "organic" labels', checked: false },
            { id: 'removeGMO', label: 'Remove GMO-related text and asterisks', checked: true },
            { id: 'fixCapitalization', label: 'Fix capitalization and brackets', checked: true }
        ];
        
        optionsSection.appendChild(optionsLabel);
        
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
            optionsSection.appendChild(checkboxContainer);
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
            counter.textContent = `${count.toLocaleString()} character${count !== 1 ? 's' : ''}`;
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
            fixCapitalization: document.getElementById('fixCapitalization').checked
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
        
        processButton.addEventListener('click', handleProcessClick);
        copyButton.addEventListener('click', handleCopyClick);
        
        // Update character count as user types
        inputTextarea.addEventListener('input', () => {
            updateCharCount('recipeInput', 'inputCharCount');
        });
        
        // Initialize character counts
        updateCharCount('recipeInput', 'inputCharCount');
        updateCharCount('recipeOutput', 'outputCharCount');
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
            simplifyIngredients
        };
    } catch (e) {
        // Browser environment
    }
    
    console.log('[RecipeSimplifier] Module loaded');
})();