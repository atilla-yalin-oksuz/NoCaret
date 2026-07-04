/**
 * popup.js
 * 
 * Controls the popup user interface.
 * Listens for state toggles and saves them in browser storage.
 * Handles opening external links in new browser tabs.
 */

// Fallback logic to support cross-browser namespaces (Firefox uses 'browser', Chrome uses 'chrome')
const api = typeof browser !== 'undefined' ? browser : chrome;

// UI element references
const powerToggle = document.getElementById('power-toggle');
const statusText = document.getElementById('status-text');
const statusDot = document.getElementById('status-dot');
const actionButtons = document.querySelectorAll('.action-btn');

// 1. Load the initial state from browser storage when the popup is opened.
api.storage.local.get('enabled').then((result) => {
    // Default to 'true' if the state has not been configured yet
    const enabled = result.enabled !== false;
    powerToggle.checked = enabled;
    updateUI(enabled);
});

// 2. Listen for clicks on the switch toggle button.
powerToggle.addEventListener('change', () => {
    const enabled = powerToggle.checked;
    // Save the state and update the UI accordingly
    api.storage.local.set({ enabled: enabled }).then(() => {
        updateUI(enabled);
    });
});

// 3. Update the UI text and glow dots depending on state
function updateUI(enabled) {
    if (enabled) {
        statusText.textContent = 'ACTIVE';
        statusText.className = 'status-value active';
        statusDot.className = 'status-dot active';
    } else {
        statusText.textContent = 'STANDBY';
        statusText.className = 'status-value inactive';
        statusDot.className = 'status-dot inactive';
    }
}

// 4. Intercept clicks on links to open them safely in a new browser tab.
actionButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Stop default link behavior in popups (which can be blocked/buggy)
        e.preventDefault();
        const url = button.getAttribute('href');
        if (url) {
            api.tabs.create({ url: url });
        }
    });
});

// 5. Prevent right-click (context menu) globally within the popup.
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 6. Prevent element dragging globally within the popup.
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
});
