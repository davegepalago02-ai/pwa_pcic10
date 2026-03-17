# PCIC RO10 Digital Insurance Application
## Technical Documentation

**Version:** 1.4.1
**Last Updated:** March 18, 2026
**Prepared by:** PCIC RO10 Management Systems Division (MSD)
**Maintained at:** [davegepalago02-ai/pwa_pcic10](https://github.com/davegepalago02-ai/pwa_pcic10)
**Live URL:** [https://davegepalago02-ai.github.io/pwa_pcic10/](https://davegepalago02-ai.github.io/pwa_pcic10/)

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project File Structure](#3-project-file-structure)
4. [Database Architecture (IndexedDB)](#4-database-architecture-indexeddb)
5. [Application Architecture & Views](#5-application-architecture--views)
6. [Core Function Reference](#6-core-function-reference)
7. [Service Worker & PWA Caching](#7-service-worker--pwa-caching)
8. [How to Update the Application](#8-how-to-update-the-application)
9. [How to Import & Manage Data](#9-how-to-import--manage-data)
10. [Version History & Changelog](#10-version-history--changelog)
11. [Known Limitations & Future Work](#11-known-limitations--future-work)
12. [Troubleshooting Guide](#12-troubleshooting-guide)

---

## 1. Project Overview

The **PCIC RO10 Digital Insurance Application** is an offline-capable Progressive Web App (PWA) designed for field use by PCIC Regional Office X (Cagayan de Oro) Underwriters and partner agents. It digitizes the insurance application process across four insurance lines — Crop, ADSS, Livestock, and Banca — enabling agents to complete, generate, and download PDF application forms directly on their devices without requiring a constant internet connection.

### Key Characteristics
| Property | Value |
|---|---|
| Application Type | Progressive Web App (PWA) |
| Architecture | Single-Page Application (SPA), offline-first |
| Target Users | PCIC Underwriters and Partner Agents, RO10 |
| Data Storage | 100% local (IndexedDB on the device) |
| Internet Required | Only for initial install and updates |
| Platform | Works on Android tablets, iOS, and Desktop Chrome |
| Institution | Philippine Crop Insurance Corporation, Regional Office X |

---

## 2. Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| Structure | HTML5 | Application shell and all view layouts |
| Logic | JavaScript (ES6+) | All application logic and state management |
| Styling | CSS3 | Layout, themes, responsive design |
| Database | IndexedDB via **Dexie.js** | Local offline data storage |
| PDF Export | **jsPDF** + **jsPDF-AutoTable** | Generating application form PDFs |
| PWA | Web App Manifest + Service Worker | Offline caching and installation |
| CSV Parsing | **PapaParse** | Parsing imported CSV data |
| Signature | **signature_pad.js** | Digital signature capture |
| QR Scanner | **qr-scanner.umd.min.js** | QR code scanning for farmer lookup |
| Icons | **Font Awesome 6** (self-hosted) | UI icons throughout the app |
| Hosting | **GitHub Pages** | Free static site deployment |

> All third-party libraries are **bundled locally** in the `lib/` folder. The app does not depend on any external CDNs, ensuring it works offline after first load.

---

## 3. Project File Structure

```
pwa_pcic10/
├── index.html                  # Main app shell — all views and modals in one file
├── script.js                   # Core application logic (~4,600 lines)
├── style.css                   # All visual styling (~64KB)
├── manifest.json               # PWA installation configuration
├── service-worker.js           # Offline caching (Cache-first strategy)
│
├── app_updates.js              # ⭐ EDIT THIS to update announcements & release notes
├── db_manager.js               # Low-level IndexedDB CRUD functions
├── csv_handler.js              # CSV import/export logic for all insurance types
├── address_autocomplete.js     # Philippine address (Province/Municipality/Barangay) dropdowns
├── farm_selector_functions.js  # Farm parcel selection helper
├── pdf_templates.js            # All PDF form layout definitions (~2.2MB)
│
├── asset/
│   ├── logo.png                # Main app logo (192x192 & 512x512 for PWA icons)
│   ├── sidebar_logo.png        # Sidebar logo
│   └── PCIC RO10 User Guide.pdf  # User guide (accessible from app)
│
├── lib/
│   ├── dexie.min.js            # Dexie.js (IndexedDB wrapper)
│   ├── jspdf.umd.min.js        # jsPDF library
│   ├── jspdf.plugin.autotable.min.js  # jsPDF table plugin
│   ├── papaparse.min.js        # CSV parser
│   ├── signature_pad.js        # Digital signature pad
│   ├── qr-scanner.umd.min.js  # QR code scanner
│   └── font-awesome/           # Font Awesome icons (self-hosted)
│
└── Preprocessing_Hub/          # Separate batch pre-processing sub-module
```

### Key File Descriptions

| File | Lines | Description |
|---|---|---|
| `index.html` | ~1,590 | Single HTML file containing all 6 main views, all modals, and the sidebar. Views are shown/hidden by JavaScript. |
| `script.js` | ~4,673 | The heart of the application. Contains all business logic: farmer search, form submission, PDF generation triggering, history management, settings, and all UI event handlers. |
| `style.css` | ~2,500 | All CSS including the dashboard glassmorphism design, satellite hero background, responsive layouts, and modals. |
| `app_updates.js` | ~95 | **Easiest file to maintain.** Contains two JavaScript constants: `APP_ANNOUNCEMENT` (the yellow banner text) and `APP_RELEASE_NOTES` (the scrollable update log). Edit these when publishing a new version. |
| `db_manager.js` | ~291 | A secondary raw IndexedDB manager. Used by the preprocessing hub and CSV handler for low-level operations. |
| `csv_handler.js` | ~552 | Handles the full CSV export/import pipeline for all four insurance types with type-specific column layouts and validation. |
| `pdf_templates.js` | large | Stores all the base64-encoded image data and layout definitions needed to generate the official PDF forms. Large file due to embedded images. |
| `service-worker.js` | 86 | Registers a cache and stores all app assets for offline use. Uses Cache-first strategy. |

---

## 4. Database Architecture (IndexedDB)

The app uses **two separate IndexedDB instances** — one managed by Dexie.js (the primary database) and one raw IndexedDB (used by `db_manager.js` for auxiliary operations).

### 4.1 Primary Database — Dexie.js (`PCIC_Offline_DB_V6`)

Initialized in `script.js` (line 145-152):

```javascript
const db = new Dexie("PCIC_Offline_DB_V6");
db.version(2).stores({
    profiles: "FarmersID, LastName, FirstName, RSBSAID, Municipality, Province, Barangay",
    records:  "++id, FARMERSID, FarmersID, CICNO, PROGRAMTYPE",
    apps:     "++id, FarmersID, LastName, CropType, Month",
    settings: "key",
    hvc_rates: "name"
});
```

| Store | Primary Key | Indexed Fields | Purpose |
|---|---|---|---|
| `profiles` | `FarmersID` | LastName, FirstName, RSBSAID, Municipality, Province, Barangay | All imported farmer profile records |
| `records` | auto-increment `id` | FARMERSID, FarmersID, CICNO, PROGRAMTYPE | Historical insurance records (from PCIC main database) |
| `apps` | auto-increment `id` | FarmersID, LastName, CropType, Month | New insurance applications created in-app |
| `settings` | `key` | — | App settings (e.g., underwriter name, last version seen) |
| `hvc_rates` | `name` | — | High Value Crop insurance rates (seeded with 40+ defaults) |

#### Important `apps` Store Schema
Each record in `db.apps` stores the full application form data. Key fields include:

| Field | Type | Description |
|---|---|---|
| `id` | Integer (auto) | Unique application ID |
| `FarmersID` | String | Farmer's RSBSA/National ID |
| `InsuranceLine` | String | One of: `Crop`, `ADSS`, `Livestock`, `Banca` |
| `CropType` | String | Crop name or insurance sub-type |
| `AmountCover` | Number | Insurance coverage amount in PHP |
| `Premium` | Number | Insurance premium in PHP |
| `timestamp` | ISO Date String | Date/time of application creation |
| `signatureData` | Base64 String | Farmer's digital signature image |
| `farmerSignature` | Base64 String | Alternate signature field |

### 4.2 Secondary Database — Raw IndexedDB (`PCICInsuranceDB`)

Managed by `db_manager.js`. Used by auxiliary modules.

| Object Store | Key Path | Indexes | Purpose |
|---|---|---|---|
| `profiles` | `FarmersID` | LastName, ProvFarmer, MunFarmer | Farmers (alternate store) |
| `apps` | `id` | FarmersID, InsuranceLine, status, timestamp | Applications (alternate store) |
| `settings` | `id` | — | Calibration/config data |

> **Note for maintainers:** The primary data used by the main app UI is always in the **Dexie.js** stores. The raw IndexedDB stores in `db_manager.js` are used by supplementary modules and for data export functions. They should stay in sync but may diverge if data is imported through different pathways.

### 4.3 localStorage Keys

Small configuration values are stored in `localStorage` (not IndexedDB):

| Key | Purpose |
|---|---|
| `pcic_device_id` | Unique identifier for the device (auto-generated on first run) |
| `pcic_agent_name` | Saved underwriter/agent name (persists across sessions) |
| `pcic_last_seen_version` | Last app version the user acknowledged (to control update banner) |

---

## 5. Application Architecture & Views

### 5.1 Single-Page Application Structure
The entire application is contained in **one HTML file** (`index.html`). All six "pages" are `<div>` elements with `class="content-area"`. The function `showView(viewId)` in `script.js` toggles their visibility by adding/removing the `active` CSS class.

**Navigation:** The sidebar on the left lists all views. On mobile/tablet, the sidebar collapses and is toggled via the hamburger icon (`toggleSidebar()`).

### 5.2 Available Views

| View ID | View Name | Description |
|---|---|---|
| `welcome` | 🏠 Home Dashboard | Landing page with satellite hero, announcement banner, footer, brochure and user guide access |
| `view-enrollment` | 📝 Enrollment | Farmer search, new applicant form, insurance selection, signature capture, and PDF generation |
| `view-log` | 📋 History/Log | All recorded applications with redownload PDF option |
| `view-summary` | 📊 Summary | Monthly performance dashboard, insurance line stats, CSV export |
| `view-settings` | ⚙️ Settings | Underwriter name, CSV import, crop rates management, system tools |
| `view-about` | ℹ️ About | App info, update release notes |

### 5.3 Insurance Line Hierarchy

The app supports **4 insurance lines**, each with sub-types. This hierarchy is defined by the `INSURANCE_HIERARCHY` constant in `script.js`:

```
Crop
├── Rice: Irrigated, Rainfed, Upland
├── Corn: Yellow Corn, White Corn
└── [All other crops from db.hvc_rates] → High Value Crops (HVC)

Livestock
├── Swine: Fattening, Breeding
├── Goat: Fattening, Breeding
├── Sheep: Fattening, Breeding
├── Poultry: I. Grower, C. Grower, Integrator, Pullet, Chicken Layer, Duck Layer, Quail Layer
├── Cattle: Draft, Dairy, Fattening, Breeding
├── Carabao: Draft, Dairy, Fattening, Breeding
├── Horse: Draft
└── Others (Free text)

ADSS (Agricultural Data Steward System)

Banca (Fisheries)
├── Motorized: Wood, Fiberglass
└── Non-Motorized: Wood, Fiberglass
```

### 5.4 Enrollment Workflow

1. **Search** — Underwriter searches for farmer by RSBSA ID, Last Name, First Name, or address
2. **Select** — Select farmer from results; a history popup shows previous enrollments
3. **Choose** — Select "Renew" (reuses previous farm data) or "New Enrollment" (blank form)
4. **Fill** — Complete the enrollment form: coverage details, farm/vessel info, dates, beneficiaries, NCFRS ID
5. **Sign** — Farmer captures digital signature on the signature pad
6. **Save & Download** — Click "FINALIZE & DOWNLOAD FORM (PDF)"; the app validates required fields, saves to `db.apps`, and generates the PDF

---

## 6. Core Function Reference

### 6.1 Initialization Functions (`script.js`)

| Function | Description |
|---|---|
| `window.onload` (async) | Main entry point. Runs on page load. Initializes Dexie DB, signature pads, default crop rates, version display, and sets starting view to `welcome`. |
| `initVersionDisplay()` | Updates all version labels (browser tab title, sidebar, footer, update banner) using the `APP_VERSION` constant. Also controls the update banner visibility. |
| `ensureDefaultRates()` | Seeds `db.hvc_rates` with 40+ default High Value Crops (including Rice, Corn, Coconut, etc.) on first run. Safe to call repeatedly — only inserts if missing. |

### 6.2 View & Navigation Functions

| Function | Description |
|---|---|
| `showView(id)` | Toggles the visible content area. Hides all views; shows only the one with the matching `id`. |
| `toggleSidebar()` | Toggles the `sidebar-open` CSS class on `<body>` to show/hide the mobile sidebar. |

### 6.3 Farmer Search & Enrollment

| Function | Description |
|---|---|
| `searchFarmer()` | Reads search fields (ID, name, province, municipality, barangay) and queries `db.farmers`. Displays results in a table. |
| `selectFarmer(farmerId)` | Loads a farmer from `db.farmers` and shows their insurance history popup. |
| `confirmNewApplicant()` | Prompts for new applicant confirmation and loads a blank enrollment form. |
| `saveApp()` | Validates all required fields, collects form data, saves to `db.apps`, and triggers PDF download. |
| `generateIndividualPDF(appId)` | Retrieves an application from `db.apps` by ID and regenerates the PDF. Used for redownloading from History. |
| `checkGuardianRequirement()` | Checks farmer's age from DOB. Automatically shows the guardian signature section for minors aged 15-18. |

### 6.4 History & Log Functions

| Function | Description |
|---|---|
| `refreshLog()` | Fetches **all** applications from `db.apps` (no limit), sorted by newest first. Renders the History/Log view table with PDF redownload buttons. |
| `deleteAppRecord(id)` | Deletes a single application record from `db.apps` after user confirmation. |

### 6.5 Summary & Statistics

| Function | Description |
|---|---|
| `renderLineStats()` | Queries `db.apps` and displays insurance line counts (Crop, ADSS, Livestock, Banca) on the Summary dashboard. |
| `refreshHVCRateList()` | Populates the HVC rate management table in Settings from `db.hvc_rates`. |
| `populateUnifiedCropDropdown()` | Builds the unified crop selection dropdown combining the fixed hierarchy and all HVC rates. |

### 6.6 Update & Settings Functions

| Function | Description |
|---|---|
| `showReleaseNotes()` | Shows the release notes popup modal. |
| `closeReleaseNotesModal()` | Closes the release notes modal and marks the current version as seen in `localStorage`. |
| `dismissUpdateBanner(event)` | Dismisses the yellow update banner without opening the modal. |
| `hardRefreshApp()` | **Hard Refresh:** Unregisters all service workers, clears all service worker caches, then calls `window.location.reload(true)`. Use when the app is stuck on an old version. |
| `sendFeedback()` | Opens the user's email app pre-filled with an issue report addressed to `ro10msd@pcicgov.onmicrosoft.com`. |

### 6.7 CSV & Data Management (`csv_handler.js`)

| Function | Description |
|---|---|
| `exportToCSV(type, ids)` | Exports applications to a `.csv` file. Supports type-specific export (Crop, ADSS, Livestock, Banca) or All. |
| `importFromCSV(file, type)` | Reads a CSV file, validates rows, and bulk-inserts valid records into IndexedDB. |
| `parseCSV(csv, type)` | Parses raw CSV text and returns `{ data, errors, headers }`. |
| `validateImportRecord(record, type)` | Validates a single parsed row against required field rules. |

### 6.8 Database Functions (`db_manager.js`)

| Function | Description |
|---|---|
| `initDB()` | Opens the `PCICInsuranceDB` raw IndexedDB, creating object stores if needed. |
| `saveFarmer(data)` | Inserts or updates a record in the `profiles` object store. |
| `saveApplication(data)` | Inserts or updates a record in the `apps` object store. |
| `getApplications(filter)` | Retrieves all applications, with optional filtering by type, status, or search term. |
| `getApplicationStats()` | Returns a count breakdown of applications by insurance line and status. |
| `clearAllData()` | Wipes all records from `profiles`, `apps`, and `settings` stores. |

---

## 7. Service Worker & PWA Caching

### 7.1 Cache Strategy: Cache-First
When a resource is requested, the service worker checks the cache first. If found, it serves the cached version immediately (fast, works offline). If not in cache, it tries to fetch from the network.

### 7.2 Cached Resources
All of the following are cached on first install (`service-worker.js` lines 2-35):
- `index.html`, `style.css`, `script.js`, `manifest.json`
- `pdf_templates.js`, `farm_selector_functions.js`, `db_manager.js`, `csv_handler.js`, `address_autocomplete.js`
- `asset/logo.png`, `asset/sidebar_logo.png`, `asset/PCIC RO10 User Guide.pdf`
- Font Awesome CSS and all font files (self-hosted)
- All third-party libraries in `lib/`

### 7.3 Service Worker Update Lifecycle
The app uses an **automatic update mechanism** in `script.js` (lines 308-347):
1. On page load, the app registers `service-worker.js`
2. If a new SW is detected (from a recent `git push`), it sends a `SKIP_WAITING` message to the new worker
3. The new SW skips the waiting phase immediately
4. The page reloads automatically so fresh files are served

### 7.4 How to Deploy an Update (Summary)
```
Step 1: Edit your code files
Step 2: Update APP_VERSION in script.js (e.g., "1.4.1" → "1.5.0")
Step 3: Update CACHE_NAME in service-worker.js (e.g., 'pcic-app-v1.3.3' → 'pcic-app-v1.5.0')
Step 4: Update APP_RELEASE_NOTES in app_updates.js
Step 5: git add . → git commit → git push origin main
Step 6: GitHub Pages auto-deploys within ~60 seconds
```
Users will see the app auto-refresh on their next visit, or they can use **Hard Refresh** in Settings.

---

## 8. How to Update the Application

This section is a practical guide for the next developer or maintainer.

### 8.1 Update the Announcement Banner
Open `app_updates.js` and edit the `APP_ANNOUNCEMENT` variable:
```javascript
const APP_ANNOUNCEMENT = `⚠️ <strong>Your new message here.</strong> Additional details.`;
```

### 8.2 Add a Release Note Entry
Open `app_updates.js` and prepend a new version block at the top of `APP_RELEASE_NOTES`:
```javascript
const APP_RELEASE_NOTES = `
<strong>v1.5.0 (YYYY-MM-DD)</strong>
<ul style="margin-top: 5px; margin-bottom: 15px;">
    <li>[FEAT] Description of new feature.</li>
    <li>[FIX] Description of bug fix.</li>
</ul>

<strong>v1.4.1 (2026-03-17)</strong>
... (previous notes remain below)
```

### 8.3 Add a New High Value Crop
Open `script.js` and find the `ensureDefaultRates()` function. Add a new entry to the `defaults` array:
```javascript
{ name: 'YourCropName', rate: 75000 }
```
The rate is the default **Amount of Cover** in Philippine Peso (PHP).

### 8.4 Change Insurance Rates
The HVC rates can also be directly edited through the app's **Settings → Crop Rates** section without touching the code.

### 8.5 Bump the Version Number
Update in **two places**:
1. `script.js` line 6: `const APP_VERSION = "1.5.0";`
2. `service-worker.js` line 1: `const CACHE_NAME = 'pcic-app-v1.5.0';`

### 8.6 Add a New Service Worker Cached File
If you add a new `.js` file to the project, add it to the `urlsToCache` array in `service-worker.js`:
```javascript
const urlsToCache = [
    'index.html',
    'your-new-file.js',   // ← Add here
    ...
];
```

### 8.7 Deploy to GitHub Pages
```bash
git add .
git commit -m "feat: Description of changes"
git push origin main
```
GitHub Actions automatically deploys commits to `main` branch to the live URL.

---

## 9. How to Import & Manage Data

### 9.1 Importing Farmer Profiles
1. Go to **Settings** in the app
2. Under "Import Data", click **"Choose File"** next to "Import Profiles"
3. Select your `.csv` file
4. The app will validate the records and show an import summary

**Required CSV columns for Profiles:**
| Column | Required | Description |
|---|---|---|
| `FarmersID` | ✅ | Unique RSBSA or Farmer ID |
| `LastName` | ✅ | Farmer's last name |
| `FirstName` | ✅ | Farmer's first name |
| `MiddlName` | | Middle name |
| `ProvFarmer` | | Province |
| `MunFarmer` | | Municipality |
| `BrgyFarmer` | | Barangay |
| `Mobile` | | Contact number |
| `Birthday` | | Date of birth (YYYY-MM-DD format) |

### 9.2 Importing Insurance History Records
1. Go to **Settings** in the app
2. Under "Import Data", click **"Choose File"** next to "Import Insurance Records"
3. Select your `.csv` file with historical insurance data

**Required CSV columns for Records:**
| Column | Required | Description |
|---|---|---|
| `FarmersID` | ✅ | Farmer ID (must match a profile) |
| `Farmer Name` | ✅ | Full name |
| `Insurance Type` | ✅ | `Crop`, `ADSS`, `Livestock`, or `Banca` |
| `Coverage Amount` | | Amount of insurance cover in PHP |
| `Premium` | | Premium amount in PHP |
| `Application Date` | | Date (YYYY-MM-DD) |
| `Status` | | `Pending` or `Approved` |

### 9.3 Exporting Data
Go to **Summary** → click the export button for the desired insurance type. Exported CSV files are named `PCIC_[type]_[date].csv`.

### 9.4 Clearing Data
In **Settings**, individual data stores can be cleared with the 🗑️ buttons next to each import section. Note: this is irreversible.

---

## 10. Version History & Changelog

| Version | Release Date | Changes |
|---|---|---|
| **v1.4.1** | 2026-03-17 | History redownload limit removed. Hard Refresh button in Settings. Coconut added to HVC. Separated announcements/release notes to `app_updates.js`. |
| **v1.4.0** | 2026-03-10 | Pre-processing Hub integrated. NCFRS input field added. Editable farmer address. Auto-clear farm details on new policy. Full-screen signature support. Required field prompt before saving. |
| **v1.3.4** | 2026-02-27 | Replaced individual brochure modals with a unified folder view. |
| **v1.3.0** | 2026-02-25 | Full Home Dashboard UI redesign: satellite background, glassmorphism hero card, SVG sidebar icons, announcement banner, 3-column footer. |
| **v1.2.6** | 2026-02-24 | Relocated brochure access to Home Dashboard; added brochure modal. |
| **v1.2.3** | 2026-02-24 | Updated dynamic PDF generation filename logic per insurance line. |
| **v1.2.2** | 2026-02-24 | Added Update Banner and Release Notes Modal. |
| **v1.1.2** | 2026-01-30 | Embedded the PCIC RO10 logo to the script. |
| **v1.0.2** | 2026-01-29 | Replaced 'Suffix' with 'Middle Name' field. Fixed Save bugs. |
| **v1.0.1** | 2026-01-28 | Added Farm Selector. Fixed blank PDF generation issues. |
| **v1.0.0** | 2026-01-01 | Initial public release. |

---

## 11. Known Limitations & Future Work

### 11.1 Current Limitations

| Limitation | Detail |
|---|---|
| **Local-only data** | All farmer profiles and application records are stored **per device**. There is no central server; each tablet/phone has its own separate database. |
| **Manual CSV distribution** | Currently, DB updates (new farmer profiles) must be manually imported per device via CSV file. |
| **SharePoint embedding blocked** | The brochure viewer attempts to embed a SharePoint URL in an iframe, but SharePoint's `X-Frame-Options: SAMEORIGIN` policy blocks external embedding. The brochure must currently be opened in a new tab. |
| **No server backend** | The app is a pure frontend PWA. There is no server, no authentication, no user accounts, and no real-time sync. |
| **Service worker cache version** | The service worker cache name (`pcic-app-v1.3.3`) is currently out of sync with the app version (`v1.4.1`). This should be updated before the next deployment to ensure proper cache invalidation. |

### 11.2 Planned Future Enhancements

| Feature | Description | Priority |
|---|---|---|
| **Automated DB Sync via Google Drive** | Use Google Apps Script as a free API to distribute farmer CSVs to specific users based on their name, eliminating manual CSV imports. | High |
| **Brochure Curated List** | Replace the iframe-embedded SharePoint folder with a manually managed list of individually shared PDF links in `app_updates.js` (an `APP_BROCHURES` constant). | Medium |
| **Automated DB Sync via OneDrive** | Use Microsoft Power Automate (requires Premium license) as an alternative to Google Apps Script for OneDrive-based CSV distribution. | Medium |
| **User login/assignment** | When the DB sync feature is implemented, add a simple name/ID prompt on first launch to determine which user's data to download. | Medium |

---

## 12. Troubleshooting Guide

### The app is not updating to the latest version
**Cause:** The service worker has cached the old version.
**Fix:**
1. Open the app → **Settings** → tap **"Hard Refresh / Force Update"**
2. The app will clear all service worker caches and reload
3. Alternatively: In the browser, open DevTools → Application → Service Workers → click **"Unregister"**, then hard refresh (`Ctrl+Shift+R`)

### The data (farmers/records) are not showing after CSV import
**Cause:** The CSV file likely has incorrect column headers, or rows failed validation.
**Fix:**
1. Check that your CSV uses the exact column names listed in Section 9
2. Ensure `FarmersID`, `LastName`, and `FirstName` columns are present and not empty
3. Remove any BOM character or special encoding before importing
4. Check the import status message shown below the import button after selection

### The PDF is blank or shows no data
**Cause:** The PDF uses the application data stored at the moment of saving. If the form was incomplete when saved, the PDF will be blank in those fields.
**Fix:**
1. Ensure all required fields are filled before saving (the app will prompt you)
2. To regenerate: go to **History/Log** → find the entry → click the **PDF** button to redownload
3. If still blank, the record may be corrupted. Delete and re-enter the application

### The signature box is not appearing / is too small
**Cause:** The canvas size is set on page load. If the panel was not visible at load time, the canvas may have zero dimensions.
**Fix:**
1. Call `resizeCanvas()` from the browser console, or
2. Navigate away from the Enrollment view and back again—the canvas will resize on re-render

### The app is showing "Database failed to open"
**Cause:** The browser's IndexedDB storage may be full or corrupted, or private/incognito mode may be restricting storage.
**Fix:**
1. Do not use private/incognito mode
2. Clear browser data for the site: Settings → Site Data → Clear for this site
3. Reinstall the PWA (uninstall from Home Screen → reinstall from browser)

### The announcement or release notes are not showing
**Cause:** `app_updates.js` may have a syntax error, preventing the DOM injection from running.
**Fix:**
1. Open `app_updates.js` and check for any unmatched backticks (`` ` ``) or quotes
2. Open the browser console and look for JavaScript errors on the page
3. Ensure `app_updates.js` is included in `index.html` before `script.js`

---

## Appendix: Developer Environment Setup

To make local changes and test before pushing:

### Prerequisites
- **Git** installed and configured
- A code editor (VS Code recommended)
- Any web server for local testing (e.g., VS Code Live Server extension)
- GitHub access to the `davegepalago02-ai/pwa_pcic10` repository

### Clone & Run Locally
```bash
git clone https://github.com/davegepalago02-ai/pwa_pcic10.git
cd pwa_pcic10
# Open with VS Code Live Server or any static web server
# DO NOT open index.html directly as a file:// URL — PWA features require a server
```

### File Editing Workflow
```bash
# 1. Make changes to your files
# 2. Test locally using VS Code Live Server
# 3. Stage and commit
git add .
git commit -m "type(scope): short description"
# e.g.: git commit -m "feat(hvc): Add Durian crop with 80000 cover"
# e.g.: git commit -m "fix(pdf): Fix blank signature in Banca PDF"
# 4. Push to deploy
git push origin main
```

### Commit Message Convention
| Prefix | Use for |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | CSS/UI changes |
| `refactor:` | Code cleanup without behavior change |
| `chore:` | Dependency updates, config changes |

---

*This document was generated based on the codebase as of version 1.4.1 (March 18, 2026). Update this document whenever significant architectural changes are made.*
