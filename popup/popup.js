/**
 * Formula Copy Popup Script
 * Handles the popup interface for formula copy settings
 */

// DOM elements
const enableFormulaCopyCheckbox = document.getElementById('enableFormulaCopy');
const formatMathMLRadio = document.getElementById('formatMathML');
const formatLaTeXRadio = document.getElementById('formatLaTeX');

// Initialize popup
function initPopup() {
    // Load current settings
    loadSettings();
    
    // Add event listeners
    addEventListeners();
    
    // Load localization
    loadLocalization();
}

// Load current settings from storage
function loadSettings() {
    chrome.storage.sync.get({
        enableFormulaCopy: true,
        formulaFormat: 'mathml'
    }, (settings) => {
        enableFormulaCopyCheckbox.checked = settings.enableFormulaCopy;
        
        if (settings.formulaFormat === 'latex') {
            formatLaTeXRadio.checked = true;
        } else {
            formatMathMLRadio.checked = true;
        }
    });
}

// Add event listeners
function addEventListeners() {
    // Enable/disable formula copy
    enableFormulaCopyCheckbox.addEventListener('change', (e) => {
        const enabled = e.target.checked;
        chrome.storage.sync.set({ enableFormulaCopy: enabled });
        
        // Send message to content script to update behavior
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, {
                    action: 'updateFormulaCopy',
                    enabled: enabled
                });
            }
        });
    });
    
    // Formula format selection
    formatMathMLRadio.addEventListener('change', (e) => {
        if (e.target.checked) {
            chrome.storage.sync.set({ formulaFormat: 'mathml' });
        }
    });
    
    formatLaTeXRadio.addEventListener('change', (e) => {
        if (e.target.checked) {
            chrome.storage.sync.set({ formulaFormat: 'latex' });
        }
    });
}

// Load localization
function loadLocalization() {
    // Update text content with localized messages
    document.getElementById('formulaSettingsTitle').textContent = 
        chrome.i18n.getMessage('formulaSettingsTitle') || '公式复制设置';
    
    document.getElementById('enableFormulaCopyLabel').textContent = 
        chrome.i18n.getMessage('enableFormulaCopyLabel') || '启用公式复制功能';
    
    document.getElementById('formulaFormatLabel').textContent = 
        chrome.i18n.getMessage('formulaFormatLabel') || '公式复制格式';
    
    document.getElementById('formatMathMLLabel').textContent = 
        chrome.i18n.getMessage('formatMathMLLabel') || 'MathML';
    
    document.getElementById('formatLaTeXLabel').textContent = 
        chrome.i18n.getMessage('formatLaTeXLabel') || 'LaTeX';
    
    document.getElementById('formulaFormatHint').textContent = 
        chrome.i18n.getMessage('formulaFormatHint') || 'MathML 格式兼容更多编辑器，LaTeX 适合专业排版';
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopup);
} else {
    initPopup();
}
