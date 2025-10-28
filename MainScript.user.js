// ==UserScript==
// @name         Recipe Tools - Whole Foods Edition
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Nutrition and recipe text processing tools with Whole Foods branding
// @author       RynAgain
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/modules/Wholefoods-Theme.js
// @require      https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/modules/UI-Core.js
// @require      https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/modules/UnitConverter.js
// @require      https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/modules/RecipeSimplifier.js
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/MainScript.user.js
// @downloadURL  https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/MainScript.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    console.log('='.repeat(60));
    console.log('🛠️ Recipe Tools - Whole Foods Edition');
    console.log('Version: 1.0.1');
    console.log('='.repeat(60));
    
    // ============================================
    // CONFIGURATION
    // ============================================
    const CURRENT_VERSION = '1.0.1';
    const GITHUB_VERSION_URL = 'https://raw.githubusercontent.com/RynAgain/Recipe_Simple/main/MainScript.user.js';
    const VERSION_CHECK_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
    
    // ============================================
    // VERSION CHECKING SYSTEM
    // ============================================
    let versionCheckInterval = null;
    
    /**
     * Start automatic version checking
     */
    function startVersionChecking() {
        console.log('[MainScript] 🔍 Starting automatic version checking...');
        
        // Check 5 seconds after startup (silent check)
        setTimeout(() => {
            checkForUpdates(false);
        }, 5000);
        
        // Set up periodic checking
        versionCheckInterval = setInterval(() => {
            checkForUpdates(false);
        }, VERSION_CHECK_INTERVAL);
        
        console.log('[MainScript] ✅ Version checking initialized');
    }
    
    /**
     * Check for updates from GitHub
     * @param {boolean} showNoUpdateMessage - Whether to show message if no update available
     */
    function checkForUpdates(showNoUpdateMessage = false) {
        console.log('[MainScript] Checking for updates...');
        
        // Rate limiting - don't check too frequently
        const lastCheck = GM_getValue('recipeTools_lastVersionCheck', 0);
        const now = Date.now();
        
        if (!showNoUpdateMessage && (now - lastCheck) < VERSION_CHECK_INTERVAL) {
            console.log('[MainScript] Skipping check - too soon since last check');
            return;
        }
        
        // Fetch latest version from GitHub
        GM_xmlhttpRequest({
            method: 'GET',
            url: GITHUB_VERSION_URL + '?t=' + now, // Cache busting
            onload: function(response) {
                try {
                    const content = response.responseText;
                    const versionMatch = content.match(/@version\s+([^\s]+)/);
                    
                    if (!versionMatch) {
                        throw new Error('Could not extract version from script');
                    }
                    
                    const latestVersion = versionMatch[1].trim();
                    GM_setValue('recipeTools_lastVersionCheck', now);
                    
                    console.log('[MainScript] Current version:', CURRENT_VERSION);
                    console.log('[MainScript] Latest version:', latestVersion);
                    
                    // Check if user has skipped this version
                    const skippedVersion = GM_getValue('recipeTools_skippedVersion', '');
                    if (skippedVersion === latestVersion) {
                        console.log('[MainScript] User has skipped this version');
                        return;
                    }
                    
                    if (isNewerVersion(latestVersion, CURRENT_VERSION)) {
                        console.log('[MainScript] 🎉 Update available!');
                        showUpdateNotification(latestVersion);
                    } else if (showNoUpdateMessage) {
                        showNoUpdateAvailable(latestVersion);
                    }
                } catch (error) {
                    console.error('[MainScript] Error checking for updates:', error);
                    if (showNoUpdateMessage) {
                        alert(`❌ Failed to check for updates:\n${error.message}`);
                    }
                }
            },
            onerror: function(error) {
                console.error('[MainScript] Network error checking for updates:', error);
                if (showNoUpdateMessage) {
                    alert('❌ Failed to check for updates: Network error');
                }
            }
        });
    }
    
    /**
     * Compare version numbers
     * @param {string} latest - Latest version string
     * @param {string} current - Current version string
     * @returns {boolean} True if latest is newer than current
     */
    function isNewerVersion(latest, current) {
        const latestParts = latest.split('.').map(part => parseInt(part, 10));
        const currentParts = current.split('.').map(part => parseInt(part, 10));
        
        const maxLength = Math.max(latestParts.length, currentParts.length);
        while (latestParts.length < maxLength) latestParts.push(0);
        while (currentParts.length < maxLength) currentParts.push(0);
        
        for (let i = 0; i < maxLength; i++) {
            if (latestParts[i] > currentParts[i]) {
                return true;
            } else if (latestParts[i] < currentParts[i]) {
                return false;
            }
        }
        
        return false;
    }
    
    /**
     * Show update notification modal
     * @param {string} latestVersion - The latest version available
     */
    function showUpdateNotification(latestVersion) {
        // Remove any existing update modal
        const existingModal = document.getElementById('recipeToolsUpdateModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const theme = window.WholeFoodsTheme;
        
        // Create modal overlay
        const modal = document.createElement('div');
        modal.id = 'recipeToolsUpdateModal';
        theme.applyStyles(modal, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: theme.colors.overlay,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '9999999',
            animation: 'fadeIn 0.3s'
        });
        
        // Create modal content
        const content = document.createElement('div');
        theme.applyStyles(content, {
            backgroundColor: theme.colors.white,
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            boxShadow: `0 8px 32px ${theme.colors.shadow}`,
            animation: 'slideIn 0.3s'
        });
        
        content.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 48px; margin-bottom: 12px;">🎉</div>
                <h2 style="margin: 0 0 8px 0; color: ${theme.colors.primaryGreen}; font-size: 20px;">
                    Update Available!
                </h2>
                <p style="margin: 0; color: ${theme.colors.textSecondary}; font-size: 14px;">
                    A new version of Recipe Tools is available
                </p>
            </div>
            
            <div style="background-color: ${theme.colors.lightGray}; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: ${theme.colors.textSecondary}; font-size: 14px;">Current Version:</span>
                    <span style="font-weight: 600; color: ${theme.colors.textPrimary}; font-size: 14px;">${CURRENT_VERSION}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: ${theme.colors.textSecondary}; font-size: 14px;">Latest Version:</span>
                    <span style="font-weight: 600; color: ${theme.colors.primaryGreen}; font-size: 14px;">${latestVersion}</span>
                </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button id="updateNowBtn" class="wf-button" style="width: 100%; padding: 12px; background-color: ${theme.colors.primaryGreen}; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">
                    Update Now
                </button>
                <button id="remindLaterBtn" class="wf-secondary-button" style="width: 100%; padding: 12px; background-color: white; color: ${theme.colors.primaryGreen}; border: 2px solid ${theme.colors.primaryGreen}; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer;">
                    Remind Me Later
                </button>
                <button id="skipVersionBtn" style="width: 100%; padding: 12px; background-color: transparent; color: ${theme.colors.textSecondary}; border: none; font-size: 13px; cursor: pointer;">
                    Skip This Version
                </button>
            </div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Event handlers
        document.getElementById('updateNowBtn').addEventListener('click', () => {
            window.open(GITHUB_VERSION_URL, '_blank');
            modal.remove();
        });
        
        document.getElementById('remindLaterBtn').addEventListener('click', () => {
            GM_setValue('recipeTools_lastVersionCheck', 0); // Reset check time
            modal.remove();
        });
        
        document.getElementById('skipVersionBtn').addEventListener('click', () => {
            GM_setValue('recipeTools_skippedVersion', latestVersion);
            modal.remove();
        });
        
        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    /**
     * Show "no update available" message
     * @param {string} latestVersion - The latest version checked
     */
    function showNoUpdateAvailable(latestVersion) {
        alert(`✅ You're running the latest version!\n\nCurrent: ${CURRENT_VERSION}\nLatest: ${latestVersion}`);
    }
    
    /**
     * Manual update check (called from UI)
     */
    window.RecipeToolsCheckForUpdates = function() {
        checkForUpdates(true);
    };
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    /**
     * Initialize the script
     */
    function init() {
        console.log('[MainScript] Initializing Recipe Tools...');
        
        // Verify theme is loaded
        if (!window.WholeFoodsTheme) {
            console.error('[MainScript] ❌ Whole Foods Theme not loaded!');
            return;
        }
        console.log('[MainScript] ✅ Theme loaded');
        
        // Start version checking
        startVersionChecking();
        
        // Wait for UI-Core to initialize
        // The UI-Core module will handle its own initialization
        
        console.log('[MainScript] ✅ Initialization complete');
    }
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // ============================================
    // CLEANUP
    // ============================================
    
    /**
     * Cleanup on page unload
     */
    window.addEventListener('beforeunload', () => {
        if (versionCheckInterval) {
            clearInterval(versionCheckInterval);
        }
    });
    
    console.log('[MainScript] Script loaded successfully');
})();