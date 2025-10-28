// ==UserScript==
// @name         Recipe Tools - Unit Converter
// @description  Unit conversion tool for volume, weight, and temperature
// @version      1.0.0
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('[UnitConverter] Loading module...');
    
    // ============================================
    // TOOL CONFIGURATION
    // ============================================
    const TOOL_CONFIG = {
        id: 'unit-converter',
        name: 'Unit Converter',
        icon: '🔢',
        order: 1
    };
    
    // ============================================
    // CONVERSION DATA
    // ============================================
    
    // All conversions to base unit (milliliters for volume, grams for weight)
    const CONVERSIONS = {
        volume: {
            // US Volume
            'tsp': { name: 'Teaspoon', toBase: 4.92892, category: 'US Volume' },
            'tbsp': { name: 'Tablespoon', toBase: 14.7868, category: 'US Volume' },
            'fl oz': { name: 'Fluid Ounce', toBase: 29.5735, category: 'US Volume' },
            'cup': { name: 'Cup', toBase: 236.588, category: 'US Volume' },
            'pt': { name: 'Pint', toBase: 473.176, category: 'US Volume' },
            'qt': { name: 'Quart', toBase: 946.353, category: 'US Volume' },
            'gal': { name: 'Gallon', toBase: 3785.41, category: 'US Volume' },
            // Metric Volume
            'ml': { name: 'Milliliter', toBase: 1, category: 'Metric Volume' },
            'L': { name: 'Liter', toBase: 1000, category: 'Metric Volume' }
        },
        weight: {
            // US Weight
            'oz': { name: 'Ounce', toBase: 28.3495, category: 'US Weight' },
            'lb': { name: 'Pound', toBase: 453.592, category: 'US Weight' },
            // Metric Weight
            'g': { name: 'Gram', toBase: 1, category: 'Metric Weight' },
            'kg': { name: 'Kilogram', toBase: 1000, category: 'Metric Weight' }
        },
        temperature: {
            '°F': { name: 'Fahrenheit', category: 'Temperature' },
            '°C': { name: 'Celsius', category: 'Temperature' },
            'K': { name: 'Kelvin', category: 'Temperature' }
        }
    };
    
    // ============================================
    // STATE
    // ============================================
    let conversionTimeout = null;
    
    // ============================================
    // CONVERSION LOGIC
    // ============================================
    
    /**
     * Convert between units
     * @param {number} value - Value to convert
     * @param {string} fromUnit - Source unit
     * @param {string} toUnit - Target unit
     * @param {string} type - Conversion type (volume, weight, temperature)
     * @returns {number|null} Converted value or null if invalid
     */
    function convert(value, fromUnit, toUnit, type) {
        if (isNaN(value) || value === '') {
            return null;
        }
        
        value = parseFloat(value);
        
        if (type === 'temperature') {
            return convertTemperature(value, fromUnit, toUnit);
        }
        
        const conversions = CONVERSIONS[type];
        if (!conversions || !conversions[fromUnit] || !conversions[toUnit]) {
            return null;
        }
        
        // Convert to base unit, then to target unit
        const baseValue = value * conversions[fromUnit].toBase;
        const result = baseValue / conversions[toUnit].toBase;
        
        return result;
    }
    
    /**
     * Convert temperature between units
     * @param {number} value - Temperature value
     * @param {string} from - Source unit
     * @param {string} to - Target unit
     * @returns {number} Converted temperature
     */
    function convertTemperature(value, from, to) {
        if (from === to) return value;
        
        // Convert to Celsius first
        let celsius;
        if (from === '°F') {
            celsius = (value - 32) * 5/9;
        } else if (from === 'K') {
            celsius = value - 273.15;
        } else {
            celsius = value;
        }
        
        // Convert from Celsius to target
        if (to === '°F') {
            return (celsius * 9/5) + 32;
        } else if (to === 'K') {
            return celsius + 273.15;
        } else {
            return celsius;
        }
    }
    
    /**
     * Format number for display
     * @param {number} value - Number to format
     * @returns {string} Formatted number
     */
    function formatNumber(value) {
        if (value === null || isNaN(value)) return '';
        
        // Round to 2 decimal places, remove trailing zeros
        return parseFloat(value.toFixed(2)).toString();
    }
    
    // ============================================
    // UI BUILDER
    // ============================================
    
    /**
     * Build the converter UI
     * @returns {HTMLElement} Content container
     */
    function buildConverterContent() {
        const theme = window.WholeFoodsTheme;
        const container = document.createElement('div');
        container.className = 'tool-content unit-converter-content';
        container.id = 'unit-converter-content';
        
        // Conversion type selector
        const typeSection = document.createElement('div');
        theme.applyStyles(typeSection, theme.styles.inputGroup);
        
        const typeLabel = document.createElement('label');
        typeLabel.textContent = 'Conversion Type:';
        theme.applyStyles(typeLabel, theme.styles.label);
        
        const typeSelect = document.createElement('select');
        typeSelect.id = 'conversionType';
        typeSelect.className = 'wf-select';
        theme.applyStyles(typeSelect, theme.styles.select);
        
        typeSelect.innerHTML = `
            <option value="volume">Volume</option>
            <option value="weight">Weight</option>
            <option value="temperature">Temperature</option>
        `;
        
        typeSection.appendChild(typeLabel);
        typeSection.appendChild(typeSelect);
        
        // From section
        const fromSection = document.createElement('div');
        theme.applyStyles(fromSection, theme.styles.inputGroup);
        
        const fromLabel = document.createElement('label');
        fromLabel.textContent = 'From:';
        theme.applyStyles(fromLabel, theme.styles.label);
        
        const fromRow = document.createElement('div');
        fromRow.style.display = 'flex';
        fromRow.style.gap = '10px';
        
        const fromInput = document.createElement('input');
        fromInput.type = 'number';
        fromInput.id = 'fromValue';
        fromInput.className = 'wf-input';
        fromInput.placeholder = 'Enter value';
        fromInput.step = 'any';
        theme.applyStyles(fromInput, { ...theme.styles.input, flex: '1' });
        
        const fromUnitSelect = document.createElement('select');
        fromUnitSelect.id = 'fromUnit';
        fromUnitSelect.className = 'wf-select';
        theme.applyStyles(fromUnitSelect, { ...theme.styles.select, flex: '1' });
        
        fromRow.appendChild(fromInput);
        fromRow.appendChild(fromUnitSelect);
        fromSection.appendChild(fromLabel);
        fromSection.appendChild(fromRow);
        
        // Swap button
        const swapSection = document.createElement('div');
        swapSection.style.textAlign = 'center';
        swapSection.style.margin = '10px 0';
        
        const swapButton = document.createElement('button');
        swapButton.id = 'swapButton';
        swapButton.className = 'wf-secondary-button';
        swapButton.innerHTML = '⇅ Swap';
        theme.applyStyles(swapButton, {
            ...theme.styles.secondaryButton,
            padding: '8px 20px'
        });
        
        swapSection.appendChild(swapButton);
        
        // To section
        const toSection = document.createElement('div');
        theme.applyStyles(toSection, theme.styles.inputGroup);
        
        const toLabel = document.createElement('label');
        toLabel.textContent = 'To:';
        theme.applyStyles(toLabel, theme.styles.label);
        
        const toRow = document.createElement('div');
        toRow.style.display = 'flex';
        toRow.style.gap = '10px';
        
        const toInput = document.createElement('input');
        toInput.type = 'text';
        toInput.id = 'toValue';
        toInput.className = 'wf-input';
        toInput.placeholder = 'Result';
        toInput.readOnly = true;
        theme.applyStyles(toInput, {
            ...theme.styles.input,
            flex: '1',
            backgroundColor: theme.colors.lightGray
        });
        
        const toUnitSelect = document.createElement('select');
        toUnitSelect.id = 'toUnit';
        toUnitSelect.className = 'wf-select';
        theme.applyStyles(toUnitSelect, { ...theme.styles.select, flex: '1' });
        
        toRow.appendChild(toInput);
        toRow.appendChild(toUnitSelect);
        toSection.appendChild(toLabel);
        toSection.appendChild(toRow);
        
        // Error message
        const errorMsg = document.createElement('div');
        errorMsg.id = 'converterError';
        theme.applyStyles(errorMsg, theme.styles.errorMessage);
        
        // Assemble
        container.appendChild(typeSection);
        container.appendChild(fromSection);
        container.appendChild(swapSection);
        container.appendChild(toSection);
        container.appendChild(errorMsg);
        
        return container;
    }
    
    // ============================================
    // EVENT HANDLERS
    // ============================================
    
    /**
     * Update unit dropdowns based on conversion type
     */
    function updateUnitDropdowns() {
        const type = document.getElementById('conversionType').value;
        const fromUnit = document.getElementById('fromUnit');
        const toUnit = document.getElementById('toUnit');
        
        const units = CONVERSIONS[type];
        
        // Clear existing options
        fromUnit.innerHTML = '';
        toUnit.innerHTML = '';
        
        // Add new options
        Object.keys(units).forEach(unit => {
            const fromOption = document.createElement('option');
            fromOption.value = unit;
            fromOption.textContent = `${units[unit].name} (${unit})`;
            fromUnit.appendChild(fromOption);
            
            const toOption = document.createElement('option');
            toOption.value = unit;
            toOption.textContent = `${units[unit].name} (${unit})`;
            toUnit.appendChild(toOption);
        });
        
        // Set default selections
        if (type === 'volume') {
            fromUnit.value = 'cup';
            toUnit.value = 'ml';
        } else if (type === 'weight') {
            fromUnit.value = 'oz';
            toUnit.value = 'g';
        } else if (type === 'temperature') {
            fromUnit.value = '°F';
            toUnit.value = '°C';
        }
        
        // Trigger conversion
        performConversion();
    }
    
    /**
     * Perform the conversion with debouncing
     */
    function handleInputChange() {
        clearTimeout(conversionTimeout);
        conversionTimeout = setTimeout(performConversion, 300);
    }
    
    /**
     * Perform the actual conversion
     */
    function performConversion() {
        const fromValue = document.getElementById('fromValue').value;
        const fromUnit = document.getElementById('fromUnit').value;
        const toUnit = document.getElementById('toUnit').value;
        const type = document.getElementById('conversionType').value;
        const toInput = document.getElementById('toValue');
        const errorMsg = document.getElementById('converterError');
        
        // Clear error
        errorMsg.style.display = 'none';
        
        if (!fromValue || fromValue === '') {
            toInput.value = '';
            return;
        }
        
        const result = convert(fromValue, fromUnit, toUnit, type);
        
        if (result === null) {
            errorMsg.textContent = 'Invalid input';
            errorMsg.style.display = 'block';
            toInput.value = '';
        } else {
            toInput.value = formatNumber(result);
        }
    }
    
    /**
     * Swap from and to units
     */
    function swapUnits() {
        const fromValue = document.getElementById('fromValue');
        const toValue = document.getElementById('toValue');
        const fromUnit = document.getElementById('fromUnit');
        const toUnit = document.getElementById('toUnit');
        
        // Swap values
        const tempValue = fromValue.value;
        fromValue.value = toValue.value;
        
        // Swap units
        const tempUnit = fromUnit.value;
        fromUnit.value = toUnit.value;
        toUnit.value = tempUnit;
        
        // Perform conversion
        performConversion();
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    /**
     * Initialize the converter
     */
    function initConverter() {
        console.log('[UnitConverter] Initializing...');
        
        // Wait for content to be ready
        document.addEventListener('toolContentReady', (e) => {
            if (e.detail.toolId === TOOL_CONFIG.id) {
                setupEventListeners();
                updateUnitDropdowns();
                console.log('[UnitConverter] ✅ Initialized');
            }
        });
    }
    
    /**
     * Set up event listeners
     */
    function setupEventListeners() {
        const typeSelect = document.getElementById('conversionType');
        const fromInput = document.getElementById('fromValue');
        const fromUnit = document.getElementById('fromUnit');
        const toUnit = document.getElementById('toUnit');
        const swapButton = document.getElementById('swapButton');
        
        typeSelect.addEventListener('change', updateUnitDropdowns);
        fromInput.addEventListener('input', handleInputChange);
        fromUnit.addEventListener('change', performConversion);
        toUnit.addEventListener('change', performConversion);
        swapButton.addEventListener('click', swapUnits);
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
                initFunction: initConverter,
                contentBuilder: buildConverterContent
            });
        } else {
            document.addEventListener('RecipeToolsUIReady', () => {
                window.RecipeToolsUI.registerTool({
                    ...TOOL_CONFIG,
                    initFunction: initConverter,
                    contentBuilder: buildConverterContent
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
            initConverter,
            buildConverterContent,
            convert,
            convertTemperature,
            formatNumber
        };
    } catch (e) {
        // Browser environment
    }
    
    console.log('[UnitConverter] Module loaded');
})();