/**
 * ArXiv formula copy functionality
 * Adds click events to MathML formulas to allow copying the LaTeX code or MathML
 */

// 存储全局设置对象，便于快速访问
let formulaSettings = {
    enableFormulaCopy: true,  // 默认启用
    formulaFormat: 'mathml'   // 默认使用 MathML
};

// Function to add copy functionality to arXiv MathML formulas
function enableArxivFormulaCopy() {
    // Find all MathML elements on the page
    const mathElements = document.querySelectorAll('math');

    mathElements.forEach(element => {
        // Make sure we haven't already processed this element
        if (element.dataset.arxivCopyEnabled) return;

        // Mark as processed
        element.dataset.arxivCopyEnabled = 'true';

        // Add click event listener
        element.addEventListener('click', handleArxivMathClick);

        // Add cursor pointer style to indicate clickability
        updateElementStyle(element);
    });
}

// 集中处理点击事件的函数
async function handleArxivMathClick(e) {
    // 如果功能被禁用，直接返回
    if (!formulaSettings.enableFormulaCopy) {
        return;
    }

    // Find the annotation element that contains the LaTeX code
    const annotation = this.querySelector('annotation[encoding="application/x-tex"]');

    if (annotation) {
        // Trim whitespace from LaTeX code before copying
        const latexCode = annotation.textContent.trim();

        try {
            let textToCopy;
            // Use the format specified in settings
            if (formulaSettings.formulaFormat === 'latex') {
                // Copy raw LaTeX
                textToCopy = latexCode;
            } else {
                // Copy the MathML directly
                textToCopy = this.outerHTML;
            }

            // Copy to clipboard
            await navigator.clipboard.writeText(textToCopy);

            // Show visual feedback with localized message using the toast notification
            window.showToastNotification(chrome.i18n.getMessage('formulaCopied'), 'success');
        } catch (error) {
            console.error('Failed to copy formula:', error);
            window.showToastNotification(chrome.i18n.getMessage('copyFailed'), 'error');
        }
    } else {
        // If no LaTeX annotation found, copy the MathML directly
        try {
            let textToCopy;
            if (formulaSettings.formulaFormat === 'latex') {
                // Try to extract LaTeX from the MathML structure if possible
                textToCopy = extractLatexFromMathML(this);
            } else {
                // Copy MathML
                textToCopy = this.outerHTML;
            }

            // Copy to clipboard
            await navigator.clipboard.writeText(textToCopy);

            // Show visual feedback
            window.showToastNotification(chrome.i18n.getMessage('formulaCopied'), 'success');
        } catch (error) {
            console.error('Failed to copy formula:', error);
            window.showToastNotification(chrome.i18n.getMessage('copyFailed'), 'error');
        }
    }
}

// 尝试从MathML结构中提取LaTeX（简单的回退方案）
function extractLatexFromMathML(mathElement) {
    // 这是一个简单的回退方案，直接返回MathML
    // 在实际情况下，可能需要更复杂的MathML到LaTeX的转换
    return mathElement.outerHTML;
}

// 更新元素样式和提示
function updateElementStyle(element) {
    if (formulaSettings.enableFormulaCopy) {
        element.style.cursor = 'pointer';
        element.title = chrome.i18n.getMessage('clickToCopyFormula');
        // 添加悬停效果
        element.style.transition = 'background-color 0.2s ease';
        
        element.addEventListener('mouseenter', function() {
            if (formulaSettings.enableFormulaCopy) {
                this.style.backgroundColor = 'rgba(77, 107, 254, 0.1)';
            }
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    } else {
        element.style.cursor = '';
        element.title = '';
        element.style.backgroundColor = '';
    }
}

// 更新所有已处理元素的样式和行为
function updateAllElements() {
    const mathElements = document.querySelectorAll('math[data-arxiv-copy-enabled="true"]');
    mathElements.forEach(updateElementStyle);
}

// 加载设置
function loadSettings() {
    chrome.storage.sync.get({
        enableFormulaCopy: true,  // 默认启用
        formulaFormat: 'mathml'   // 默认使用 MathML
    }, (settings) => {
        formulaSettings = settings;
        updateAllElements();
        enableArxivFormulaCopy();
    });
}

// Initialize when DOM is loaded
function initArxivFormulaCopy() {
    console.log('ArXiv Formula copy functionality initialized');

    // 首先加载设置
    loadSettings();

    // Use MutationObserver to handle dynamically added MathML elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                enableArxivFormulaCopy();
            }
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Listen for settings changes and re-apply
    chrome.storage.onChanged.addListener((changes) => {
        if (changes.enableFormulaCopy) {
            formulaSettings.enableFormulaCopy = changes.enableFormulaCopy.newValue;
        }
        if (changes.formulaFormat) {
            formulaSettings.formulaFormat = changes.formulaFormat.newValue;
        }
        // 如果相关设置有变更，更新所有元素
        if (changes.enableFormulaCopy || changes.formulaFormat) {
            updateAllElements();
        }
    });
}

// Run initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initArxivFormulaCopy);
} else {
    initArxivFormulaCopy();
}
