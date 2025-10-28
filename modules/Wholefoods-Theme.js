// ==UserScript==
// @name         Recipe Tools - Whole Foods Theme
// @description  Whole Foods Market color scheme and styling constants
// @version      1.0.0
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('[WholeFoodsTheme] Loading theme...');
    
    // Whole Foods Market Color Palette
    const COLORS = {
        // Primary Colors
        primaryGreen: '#00674F',
        secondaryGreen: '#00A862',
        accentOrange: '#FF6F00',
        
        // Neutral Colors
        white: '#FFFFFF',
        lightGray: '#F5F5F5',
        mediumGray: '#E0E0E0',
        darkGray: '#666666',
        textPrimary: '#333333',
        textSecondary: '#666666',
        
        // State Colors
        hover: '#004E3C',
        active: '#00674F',
        disabled: '#CCCCCC',
        error: '#D32F2F',
        success: '#388E3C',
        warning: '#F57C00',
        
        // UI Elements
        border: '#E0E0E0',
        shadow: 'rgba(0, 0, 0, 0.1)',
        overlay: 'rgba(0, 0, 0, 0.5)'
    };
    
    // Common Style Objects
    const STYLES = {
        // Main Panel
        panel: {
            position: 'fixed',
            width: '420px',
            maxHeight: '600px',
            backgroundColor: COLORS.white,
            borderRadius: '12px',
            boxShadow: `0 4px 20px ${COLORS.shadow}`,
            zIndex: '999999',
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
            overflow: 'hidden',
            display: 'none'
        },
        
        // Panel Header
        panelHeader: {
            backgroundColor: COLORS.primaryGreen,
            color: COLORS.white,
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'move',
            userSelect: 'none'
        },
        
        // Panel Title
        panelTitle: {
            fontSize: '16px',
            fontWeight: '600',
            margin: '0'
        },
        
        // Control Buttons (minimize, close)
        controlButton: {
            background: 'transparent',
            border: 'none',
            color: COLORS.white,
            fontSize: '20px',
            cursor: 'pointer',
            padding: '4px 8px',
            marginLeft: '8px',
            borderRadius: '4px',
            transition: 'background-color 0.2s'
        },
        
        // Tab Bar
        tabBar: {
            display: 'flex',
            backgroundColor: COLORS.lightGray,
            borderBottom: `2px solid ${COLORS.border}`,
            padding: '0'
        },
        
        // Individual Tab
        tab: {
            flex: '1',
            padding: '12px 16px',
            border: 'none',
            backgroundColor: 'transparent',
            color: COLORS.textSecondary,
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            borderBottom: '3px solid transparent',
            outline: 'none'
        },
        
        // Active Tab
        tabActive: {
            backgroundColor: COLORS.white,
            color: COLORS.primaryGreen,
            borderBottomColor: COLORS.primaryGreen,
            fontWeight: '600'
        },
        
        // Content Area
        contentArea: {
            padding: '20px',
            maxHeight: '450px',
            overflowY: 'auto',
            backgroundColor: COLORS.white
        },
        
        // Tool Content Container
        toolContent: {
            display: 'none'
        },
        
        // Trigger Button
        triggerButton: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: COLORS.primaryGreen,
            color: COLORS.white,
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: `0 4px 12px ${COLORS.shadow}`,
            zIndex: '999998',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        
        // Primary Button
        primaryButton: {
            backgroundColor: COLORS.primaryGreen,
            color: COLORS.white,
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            outline: 'none'
        },
        
        // Secondary Button
        secondaryButton: {
            backgroundColor: COLORS.white,
            color: COLORS.primaryGreen,
            border: `2px solid ${COLORS.primaryGreen}`,
            padding: '10px 20px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
            outline: 'none'
        },
        
        // Input Field
        input: {
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s',
            boxSizing: 'border-box'
        },
        
        // Textarea
        textarea: {
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.2s',
            resize: 'vertical',
            boxSizing: 'border-box'
        },
        
        // Select Dropdown
        select: {
            width: '100%',
            padding: '10px 12px',
            border: `1px solid ${COLORS.border}`,
            borderRadius: '6px',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            cursor: 'pointer',
            backgroundColor: COLORS.white,
            transition: 'border-color 0.2s',
            boxSizing: 'border-box'
        },
        
        // Label
        label: {
            display: 'block',
            marginBottom: '6px',
            fontSize: '14px',
            fontWeight: '500',
            color: COLORS.textPrimary
        },
        
        // Input Group
        inputGroup: {
            marginBottom: '16px'
        },
        
        // Checkbox Container
        checkboxContainer: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '12px',
            cursor: 'pointer'
        },
        
        // Checkbox
        checkbox: {
            width: '18px',
            height: '18px',
            marginRight: '8px',
            cursor: 'pointer',
            accentColor: COLORS.primaryGreen
        },
        
        // Error Message
        errorMessage: {
            color: COLORS.error,
            fontSize: '13px',
            marginTop: '6px',
            display: 'none'
        },
        
        // Success Message
        successMessage: {
            color: COLORS.success,
            fontSize: '13px',
            marginTop: '6px',
            display: 'none'
        }
    };
    
    // Helper function to apply styles to an element
    function applyStyles(element, styleObject) {
        Object.assign(element.style, styleObject);
    }
    
    // Helper function to create styled element
    function createStyledElement(tagName, styleKey, additionalStyles = {}) {
        const element = document.createElement(tagName);
        const baseStyles = STYLES[styleKey] || {};
        applyStyles(element, { ...baseStyles, ...additionalStyles });
        return element;
    }
    
    // Add hover effects
    function addHoverEffect(element, hoverStyles) {
        const originalStyles = {};
        Object.keys(hoverStyles).forEach(key => {
            originalStyles[key] = element.style[key];
        });
        
        element.addEventListener('mouseenter', () => {
            applyStyles(element, hoverStyles);
        });
        
        element.addEventListener('mouseleave', () => {
            applyStyles(element, originalStyles);
        });
    }
    
    // Inject global CSS for scrollbars and animations
    function injectGlobalStyles() {
        if (document.getElementById('wf-recipe-tools-global-styles')) {
            return; // Already injected
        }
        
        const style = document.createElement('style');
        style.id = 'wf-recipe-tools-global-styles';
        style.textContent = `
            /* Custom Scrollbar */
            .recipe-tools-panel ::-webkit-scrollbar {
                width: 8px;
            }
            
            .recipe-tools-panel ::-webkit-scrollbar-track {
                background: ${COLORS.lightGray};
                border-radius: 4px;
            }
            
            .recipe-tools-panel ::-webkit-scrollbar-thumb {
                background: ${COLORS.mediumGray};
                border-radius: 4px;
            }
            
            .recipe-tools-panel ::-webkit-scrollbar-thumb:hover {
                background: ${COLORS.darkGray};
            }
            
            /* Animations */
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            /* Hover Effects */
            .wf-button:hover {
                background-color: ${COLORS.hover} !important;
                transform: translateY(-1px);
                box-shadow: 0 4px 8px ${COLORS.shadow};
            }
            
            .wf-button:active {
                transform: translateY(0);
            }
            
            .wf-secondary-button:hover {
                background-color: ${COLORS.lightGray} !important;
            }
            
            .control-btn:hover {
                background-color: rgba(255, 255, 255, 0.2) !important;
            }
            
            .tool-tab:hover {
                background-color: rgba(0, 103, 79, 0.05) !important;
            }
            
            .wf-input:focus,
            .wf-textarea:focus,
            .wf-select:focus {
                border-color: ${COLORS.primaryGreen} !important;
                box-shadow: 0 0 0 3px rgba(0, 103, 79, 0.1);
            }
            
            /* Trigger Button Pulse */
            @keyframes pulse {
                0%, 100% {
                    box-shadow: 0 4px 12px ${COLORS.shadow};
                }
                50% {
                    box-shadow: 0 4px 20px rgba(0, 103, 79, 0.4);
                }
            }
            
            .trigger-button:hover {
                background-color: ${COLORS.hover} !important;
                transform: scale(1.05);
                animation: pulse 2s infinite;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Public API
    window.WholeFoodsTheme = {
        colors: COLORS,
        styles: STYLES,
        applyStyles: applyStyles,
        createStyledElement: createStyledElement,
        addHoverEffect: addHoverEffect,
        injectGlobalStyles: injectGlobalStyles
    };
    
    // Auto-inject global styles
    injectGlobalStyles();
    
    console.log('[WholeFoodsTheme] Theme loaded successfully');
    
    // Export for testing
    try {
        module.exports = {
            COLORS,
            STYLES,
            applyStyles,
            createStyledElement,
            addHoverEffect
        };
    } catch (e) {
        // Browser environment
    }
})();