# Troubleshooting Guide (v1.2.1)

This guide helps troubleshoot common issues and outlines steps for version management in the **PCIC SC Offline Insurance Mapper**.

## 1. Issue: Could Not Export Individual PDF

If clicking the **PDF** button for a specific farmer record results in no action or an error, follow these troubleshooting steps.

### A. Check Local PWA Setup (For Offline Use)
The application has been upgraded to a Progressive Web App (PWA). If PDF generation fails:
*   **Sign:** The PDF button does nothing.
*   **Diagnosis:** The local library files may not be cached correctly by the Service Worker, or the files are missing from `pwa_app/lib`.
*   **Fix:** Ensure the app was fully loaded at least once with a connection to cache the `pwa_app/lib` files. Check if `jspdf.js` and `jspdf-autotable.js` are in your `pwa_app/lib` folder.

### B. Check the Developer Console
Errors are usually hidden in the browser console.
1.  Open the Application in Chrome/Edge.
2.  Press **F12** on your keyboard (or Right Click > Inspect).
3.  Click on the **Console** tab at the top of the developer panel.
4.  Try clicking the **PDF** button again.
5.  Look for **Red Error Messages**:
    *   `Uncaught ReferenceError: jsPDF is not defined`: The library script didn't load (see step A).
    *   `Template add error`: The background template image (base64) might be corrupted.
    *   `TypeError`: Incorrect data is being passed to the function.

### C. Verify "headStyles" Fix
Ensure that the recent fix for the CSV/Summary generation didn't break the syntax for `generateIndividualPDF`.
*   **Check:** Verify that `doc.autoTable` has the correct syntax (commas separating properties).

### D. File Naming Issues
*   The system generates filenames like: `[LastName]_[FirstName]_[Crop]_[FarmID]_[Date].pdf`.
*   If a name contains forbidden text characters (like `/`, `\`, `:`, `*`), the browser might block the download.

---

## 2. Task: Update the Versions

To properly version the application (e.g., to **v1.2.1**), update the following locations in the code.

### Location 1: Browser Tab Title
*   **File:** `pwa_app/index.html`
*   **Search for:** `<title>`
*   **Update:**
    ```html
    <title>PCIC Ro10 Digital Insurance Application v1.2.1</title>
    ```

### Location 2: Application Variable Reference
*   **File:** `pwa_app/script.js`
*   **Search for:** `const APP_VERSION =`
*   **Update:**
    ```javascript
    const APP_VERSION = "v1.2.1"; // Update this variable when deploying a new version
    ```

### Location 3: Release Notes
*   Create a new file named **`RELEASE_NOTES_v1.2.1.md`**.
*   Document what changed (e.g., "Full Offline PWA Conversion").
