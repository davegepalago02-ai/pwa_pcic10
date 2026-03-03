# PCIC Insurance Application - Quick Start Guide

## ✅ Your Application is Ready!

The application has been tested and is working perfectly. Here's how to use it:

---

## 🚀 Step 1: Open the Application

**Double-click this file:**
```
pwa_app/index.html
```

The app will open in your default browser.

---

## 📊 Step 2: Import Your Data (IMPORTANT!)

When you first open the app, you'll see **"NO DATA"** at the bottom-left. This is normal! You need to import your CSV files:

### Import Process:

1. **Click the "⚙️ Database" tab** in the sidebar

2. **Import Farmer Profiles:**
   - Click the **"Choose File"** button next to "1. Farmer Profiles (CSV)"
   - Select: `FarmersProfile.csv`
   - Wait for the success message

3. **Import Insurance Records:**
   - Click the **"Choose File"** button next to "2. Insurance History (CSV)"
   - Select: `Insurance Record.csv`
   - Wait for the success message

4. **Check the indicator:**
   - Bottom-left should now show: **"801 FARMERS OFFLINE"** ✅

---

## ⚙️ Step 3: Configure Rates

Still in the Database tab:

1. **Set Rice/Corn Rates:**
   - Rice Rate: 15000 (default)
   - Corn Rate: 10000 (default)
   - Click **"Save Rice/Corn Rates"**

2. **Add HVC Crops** (if needed):
   - Enter crop name (e.g., "Mango")
   - Enter rate per hectare
   - Click **"Add Crop"**

---

## 📝 Step 4: Start Enrolling Farmers

1. **Click "📝 Enrollment"** tab

2. **Enter your name** in the "AGENT:" field (top-right)

3. **Search for a farmer:**
   - Enter any search criteria (name, ID, location)
   - Click **"SEARCH DATABASE"**

4. **Select a farmer** from the results

5. **Review insurance history** (if any) or start new enrollment

6. **Fill out the form:**
   - Farm boundaries
   - Area (hectares)
   - Crop type (Rice/Corn/HVC)
   - Planting dates
   - Payment details

7. **Sign the form** using mouse or touchscreen

8. **Click "FINALIZE & DOWNLOAD FORM (PDF)"**
   - PDF will download automatically!

---

## 📊 Generate Reports

Click **"📊 Summary"** tab to:
- View recent enrollments
- Export batch reports (CSV or PDF)
- Filter by crop type and date

---

## 💻 Developer: Adding Permanent Crop Rates

If you want to add **permanent default crops** (like Mango, Banana) that are always available even if the database is cleared:

1.  Open `pwa_app/script.js` in a text editor (Notepad, VS Code).
2.  Search for the function `async function ensureDefaultRates()`.
3.  Add your new crops inside the function following this pattern:

```javascript
// Example: Adding Mango
const mango = await db.hvc_rates.get('Mango');
if (!mango) await db.hvc_rates.put({ name: 'Mango', rate: 45000 });
```

This ensures the crop is added only if it doesn't already exist, preserving any user-customized rates.

---

## 🔧 Troubleshooting

### "NO DATA" won't go away?
- Make sure you imported BOTH CSV files
- Check that CSV files are in the same folder
- Refresh the page and try again

### Can't find a farmer?
- Check spelling in search
- Try searching by just last name
- Verify the farmer exists in FarmersProfile.csv

### Signature not working?
- Make sure you're clicking inside the signature box
- Try using a mouse instead of touchpad
- Clear the signature and try again

---

## 📱 Mobile Testing

To test on mobile:
1. Both devices on same WiFi
2. Run: `python -m http.server 8000` in this folder
3. Find your PC's IP: `ipconfig`
4. On phone: `http://[YOUR-IP]:8000/pwa_app/index.html`

---

## 🎯 What's New (Fixed Issues)

✅ **Security:** XSS vulnerabilities fixed  
✅ **Mobile:** Fully responsive design  
✅ **Accessibility:** Screen reader support  
✅ **UX:** Better error messages  
✅ **Bugs:** Signature persists on resize  

---

## 📞 Need Help?

- Check the browser console (F12) for errors
- Verify CSV files are properly formatted
- Make sure you're using a modern browser (Chrome/Edge/Firefox)

**Backup file available:** `html_powerInsuranceApplication_backup.html` (Original v1.0 monolithic file)

---

**You're all set! Start enrolling farmers! 🎉**
