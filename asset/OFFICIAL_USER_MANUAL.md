# PCIC Insurance Application
# Official User Manual

**Version:** 1.2.1  
**Release Date:** February 2026  
**Audience:** PCIC Insurance Agents and Supervisors

---

## 1. Introduction
This application is a self-contained, offline-capable digital tool designed for PCIC Insurance Agents to enroll farmers, manage insurance applications, and generate standard PDF application forms. It runs entirely in your web browser and requires no internet connection once the data is loaded.

## 2. Getting Started

### 2.1 System Requirements
- **Device:** Laptop, Desktop PC, or Tablet.
- **Browser:** Google Chrome (Recommended), Microsoft Edge, or Mozilla Firefox.
- **Files:** You will receive a folder named `pwa_app` along with the necessary CSV databases.

### 2.2 Launching the App
1. Locate the file `index.html` inside the `pwa_app` folder on your computer.
2. Double-click the file to open it in your default web browser.
3. **Note:** Since this is a PWA, it works entirely offline. Data is securely saved to your browser.

## 3. Data Setup (One-Time Setup)

Before you can start enrolling farmers, you must populate the local database.

1. Navigate to the **"⚙️ Database"** tab in the left-hand sidebar.
2. Under "System Management", locate the **"Import Database (CSV)"** section.
3. **Import Farmer Profiles:**
   - Click "Choose File" next to `1. Farmer Profiles (CSV)`.
   - Select your provided `FarmersProfile.csv` file.
   - Wait for the confirmation alert.
4. **Import Insurance Records:**
   - Click "Choose File" next to `2. Insurance History (CSV)`.
   - Select your provided `Insurance Record.csv` file.
   - Wait for the confirmation alert.
5. Verify that the status indicator at the bottom-left of the screen shows the number of records (e.g., "801 FARMERS OFFLINE").

## 4. Configuring Insurance Rates

1. Go to the **"⚙️ Database"** tab.
2. **Standard Crops (Rice/Corn):**
   - The default Amount Cover per Hectare is set to **15,000** for Rice and **10,000** for Corn.
   - To change this, enter new values in the "Default Rice Rate" or "Default Corn Rate" boxes and click "Save Rice/Corn Actions".
3. **High Value Crops (HVC):**
   - The system comes pre-loaded with over 40 common HVCs (e.g., Mango, Banana, Cacao).
   - To check rates, scroll down to the "Current HVC Rates" list.
   - To add a new custom crop, enter the "Crop Name" and "Rate per Hectare" in the "Add New HVC Rate" section and click "Add Crop".

## 5. Enrolling a Farmer (Daily Workflow)

### 5.1 Search
1. Click the **"📝 Enrollment"** tab.
2. In the "SEARCH FARMER" card, enter the farmer's **Last Name**, **First Name**, or **Farmer ID**.
3. Click **"SEARCH DATABASE"**.
4. Select the correct farmer from the result list.

### 5.2 Application History
- A pop-up will show the farmer's previous insurance history.
- **Renewal:** Click on a previous record to "Renew" it. This will pre-fill the form with the old farm data.
- **New Enrollment:** Click "START NEW ENROLLMENT" to start with a blank form.

### 5.3 Filling the Application Form
Complete the following logical steps:

1.  **Program Selection:**
    - **Rice/Corn:** Select "RICE" or "CORN". The rate is automatic.
    - **HVC:** Select "HVC". A new dropdown "HVC Crop" will appear. Choose the specific crop (e.g., "Eggplant") to auto-load its rate.
2.  **Farm Details:**
    - Enter specific **Lot 1** details: Area (Ha), Boundaries, Trees/Hills (for HVC), and planting Dates.
    - **Location:** Confirm the Farm Location (Barangay/Muni/Prov).
3.  **Beneficiaries:** Enter the primary beneficiary information.
4.  **Consent:** Check all required Consent boxes (Privacy, etc.).
5.  **Signature:** Use the digital signature pad to have the farmer sign.

### 5.4 Finalization
1. Review the calculated **"Amount Cover"**.
2. Click **"FINALIZE & DOWNLOAD FORM (PDF)"**.
3. The system will:
   - Save the record to the local database.
   - Download a calibrated PDF Application Form.
   - Update the "Monthly Tracker" and "Batch Stats" immediately.

## 6. Generating Reports

Go to the **"📊 Summary"** tab to view your performance.

- **Monthly Tracker:** See your total applications count for the current month.
- **Batch Export:**
  - **Export CSV:** Downloads a spreadsheet of all applications you have processed.
  - **Export Summary PDF:** Generates a printable report of all applications, formatted for submission to the Regional Office.

## 7. Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **"NO DATA" status** | Re-import the CSV files in the Database tab. |
| **Wrong Date in PDF** | Ensure your computer's system clock is correct. |
| **Signature Empty** | Click "Clear" on the signature pad and sign again firmly. |
| **PDF Layout Wrong** | Ensure you are using the latest version of the HTML file. |

---
**Technical Support Contact:** [Insert IT Support Name/Number Here]
