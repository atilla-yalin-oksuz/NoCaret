/**
 * content.js
 * 
 * This content script is injected into every webpage at "document_start".
 * It checks the extension state in browser storage and dynamically manages a disabling
 * class on the root HTML element to toggle the caret-blocking styles.
 */

// Cross-browser namespace handler (Firefox uses 'browser', Chrome uses 'chrome')
const api = typeof browser !== 'undefined' ? browser : chrome;

// 1. Initial State Check: Read the enabled state from local storage.
api.storage.local.get("enabled").then((result) => {
    // The value defaults to true if the setting has not been saved yet.
    const enabled = result.enabled !== false;
    
    // If the extension is disabled, add the ".nocaret-disabled" class to the <html> tag.
    // This immediately stops our custom CSS file (nocaret.css) from hiding carets.
    if (!enabled) {
        document.documentElement.classList.add("nocaret-disabled");
    }
});

// 2. Real-Time Storage Listener: Detects when the user toggles the switch in the popup menu.
api.storage.onChanged.addListener((changes, area) => {
    // Verify that the change occurred in the local storage scope and targets the "enabled" key.
    if (area === "local" && "enabled" in changes) {
        // If the new setting is false (Disabled), add the class to stop blocking carets.
        if (changes.enabled.newValue === false) {
            document.documentElement.classList.add("nocaret-disabled");
        } else {
            // If the new setting is true (Enabled), remove the class to reactivate blocking.
            document.documentElement.classList.remove("nocaret-disabled");
        }
    }
});
