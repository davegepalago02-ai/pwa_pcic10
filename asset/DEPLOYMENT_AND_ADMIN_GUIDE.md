# PCIC Insurance Application
# Deployment & Administration Guide

**Version:** 1.2.1  
**Date:** February 2026

---

## 1. Overview
The PCIC Insurance Application is a **Progressive Web Application (PWA)** contained entirely within the `pwa_app` folder. It uses **IndexedDB** for local storage and a **Service Worker** making it 100% offline-capable. There is no backend server required.

## 2. Deployment Instructions

### 2.1 Distribution
To deploy the application to agents, simply distribute a folder containing:
1.  The entire `pwa_app/` directory (The Application)
2.  `FarmersProfile.csv` (The Database Source)
3.  `Insurance Record.csv` (History Source)

**Recommended Folder Structure:**
```
/PCIC_App_v1.2.1/
├── pwa_app/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── asset/
├── DATA/
│   ├── FarmersProfile.csv
│   └── Insurance Record.csv
```

### 2.2 Installation
There is no installation process. Users simply copy the folder to their local machine (Desktop or Documents) and double-click the HTML file.

## 3. Administration & Maintenance

### 3.1 Managing High Value Crops (HVC)
The application allows users to add custom crops. However, to add **Permanent Default Crops** that persist even after a database reset, you must modify the source code.

**Procedure:**
1. Open `pwa_app/script.js` in a code editor.
2. Locate the function `ensureDefaultRates()`.
3. Add a new entry to the `defaults` array:
   ```javascript
   const defaults = [
       { name: 'Rice', rate: 15000 },
       { name: 'Corn', rate: 10000 },
       { name: 'NewCropName', rate: 50000 }, // Add new crop here
       // ...
   ];
   ```
5. Save and redistribute the generic `pwa_app` folder.

### 3.2 Resetting the Database
If an agent's application becomes corrupted or cluttered:
1. Go to the **"⚙️ Database"** tab.
2. Click **"Reset Application (Clear All Data)"**.
3. **Warning:** This deletes ALL local records.
4. Re-import the CSV files to restore the baseline data.

### 3.3 Backup & Recovery
- **Application Data:** All data is stored in the browser's IndexedDB. Agents should regularly export their "Batch Report" (CSV) as a backup of their work.
- **Application Logic:** Keep a master copy of the `html_powerInsuranceApplication.html` file in a secure location.

## 4. Troubleshooting Common Issues

### Issue: "Security Error" or "Access Denied" on Import
- **Cause:** Browser restrictions on local file access.
- **Fix:** Ensure the user is not running the file from a restricted location (like a network drive). It works best from "Documents" or "Desktop".

### Issue: PDF Text Misaligned
- **Cause:** Printer/PDF calibration settings or browser zoom.
- **Fix:** The app uses absolute positioning (mm). Ensure the browser Zoom is 100%. If persistent, the coordinates in `DEFAULT_CONFIG` within the code may need recalibration.

### Issue: App updates not showing
- **Cause:** Browser caching.
- **Fix:** Force refresh the page (`Ctrl + F5`) or clear browser cache for the file.

---
**Prepared By:** Development Team
