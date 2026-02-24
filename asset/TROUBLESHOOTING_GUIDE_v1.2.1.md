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

### E. Stuck Service Worker (App Won't Update Locally)
*   **Sign:** A new version was pushed (e.g., v1.2.3), other users see it, but your specific PC is still loading the old version and the update banner doesn't appear.
*   **Diagnosis:** Chrome/Edge has aggressively cached the old Service Worker and is refusing to release it to save local bandwidth during heavy development.
*   **Fix:** Force unregister the stuck Service Worker via Developer Tools.
    1. Press **F12** to open Developer Tools.
    2. Go to the **Application** tab.
    3. Click on **Service Workers** in the left sidebar.
    4. Click the blue **"Unregister"** button next to the active worker.
    5. *(Optional but recommended)* Click **Storage** in the left sidebar and click **"Clear site data"** (ensure "Service workers" and "Cache storage" are checked. Do not check "IndexedDB" if you have unsaved offline data).
    6. Close Developer Tools and press **Ctrl + F5** to hard refresh the page. The new version should now be fetched.

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
