# Release Notes
# PCIC Insurance Application v1.2.1

**Release Date:** February 23, 2026

---

## 🚀 Version 1.2.1 - PWA Modularization & Offline Capabilities

We are proud to announce the next major release of the PCIC Digital Insurance Application. This tool has been significantly modularized and rebuilt to natively function as a Progressive Web App (PWA) that is 100% offline-capable out in the field.

### ✨ Key Upgrades & Features

*   **100% Offline Capability:**
    *   All external CDNs (fonts, CSS, dependencies) have been converted to local assets seamlessly.
    *   Registered a modern `service-worker.js` that actively caches the entire app locally.
*   **Massive Performance Optimization:**
    *   The monolithic `html` file was decoupled saving nearly 4.5MB of redundant UI rendering overhead.
    *   `script.js` was shrunk from 2.56 MB to just 65 KB.
    *   Mega Base64 objects properly segregated into `pdf_templates.js`.
*   **Database & Logic Enhancements:**
    *   Fully offline-capable IndexedDB logic ensures records survive restarts.
    *   Refined farm selection logic correctly populating regions & areas for each farmer profile.
*   **User Interface Polishing:**
    *   Properly anchored the PCIC partner underwriter footer at the bottom of the `#workspace` to eliminate the flexbox scrolling bug.
    *   Dynamic, semantic HTML components cleanly nested inside `pwa_app` framework.


### 🛠️ Improvements & Fixes (from v1.1.2)

*   **Fixed:** Replaced legacy external script dependency strings for jsPDF, Dexie, PapaParse.
*   **Fixed:** Incorrect footer placement caused by floating HTML text nodes outside the dom tree.
*   **Added:** Auto-generated offline `manifest.json`.
*   **Added:** `asset` directory dynamically housing documentation.


### ⚠️ Known Limitations

*   **Browser Dependency:** Requires a modern browser (Chrome, Edge). Local storage means records are inherently tied to the browser process executing the HTML index.
*   **Hard Restarts:** Because Service Workers inherently cache heavily, users may need to explicitly hit "CTRL+SHIFT+R" (hard refresh) to detect new `script.js` updates if modifying code manually.

---
**Next Steps:**
Please refer to the `OFFICIAL_USER_MANUAL.md` located in the `asset` directory for detailed usage instructions.
