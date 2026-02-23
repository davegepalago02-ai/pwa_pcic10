/**
 * Address Autocomplete Logic for PCIC Region 10 Application Form
 * Handles population and filtering of Province and Municipality datalists.
 */

// Region 10 Data
const REGION_10_DATA = {
    "Bukidnon": [
        "Baungon", "Cabanglasan", "Damulog", "Dangcagan", "Don Carlos",
        "Impasugong", "Kadingilan", "Kalilangan", "Kibawe", "Kitaotao",
        "Lantapan", "Libona", "Malaybalay City", "Malitbog", "Manolo Fortich",
        "Maramag", "Pangantucan", "Quezon", "San Fernando", "Sumilao",
        "Talakag", "Valencia City"
    ],
    "Camiguin": [
        "Catarman", "Guinsiliban", "Mahinog", "Mambajao", "Sagay"
    ],
    "Lanao del Norte": [
        "Bacolod", "Baloi", "Baroy", "Iligan City", "Kapatagan",
        "Kauswagan", "Kolambugan", "Lala", "Linamon", "Magsaysay",
        "Maigo", "Matungao", "Munai", "Nunungan", "Pantao Ragat",
        "Pantar", "Poona Piagapo", "Salvador", "Sapad", "Sultan Naga Dimaporo",
        "Tagoloan", "Tangcal", "Tubod"
    ],
    "Misamis Occidental": [
        "Aloran", "Baliangao", "Bonifacio", "Calamba", "Clarin",
        "Concepcion", "Don Victoriano Chiongbian", "Jimenez", "Lopez Jaena",
        "Oroquieta City", "Ozamiz City", "Panaon", "Plaridel", "Sapang Dalaga",
        "Sinacaban", "Tangub City", "Tudela"
    ],
    "Misamis Oriental": [
        "Alubijid", "Balingasag", "Balingoan", "Binuangan", "Cagayan de Oro City",
        "Claveria", "El Salvador City", "Gingoog City", "Gitagum", "Initao",
        "Jasaan", "Kinoguitan", "Lagonglong", "Laguindingan", "Libertad",
        "Lugait", "Magsaysay", "Manticao", "Medina", "Naawan",
        "Opol", "Salay", "Sugbongcogon", "Tagoloan", "Talisayan", "Villanueva"
    ]
};

// Populate Province Datalist on Load
function populateAddressDatalists() {
    const provinceList = document.getElementById('province-list');
    if (!provinceList) return;

    // Clear existing options
    provinceList.innerHTML = '';

    // Sort provinces alphabetically
    const provinces = Object.keys(REGION_10_DATA).sort();

    provinces.forEach(prov => {
        const option = document.createElement('option');
        option.value = prov;
        provinceList.appendChild(option);
    });

    console.log("Province datalist populated with " + provinces.length + " provinces.");
}

/**
 * Filter Municipalities based on selected Province
 * @param {string} provinceInputId - ID of the province input field
 * @param {string} municipalityListId - ID of the municipality datalist to populate
 */
function filterMunicipalities(provinceInputId, municipalityListId) {
    const provinceInput = document.getElementById(provinceInputId);
    const municipalityList = document.getElementById(municipalityListId);

    if (!provinceInput || !municipalityList) return;

    const selectedProvince = provinceInput.value;

    // Clear current municipality options
    municipalityList.innerHTML = '';

    if (selectedProvince && REGION_10_DATA[selectedProvince]) {
        const municipalities = REGION_10_DATA[selectedProvince].sort();

        municipalities.forEach(mun => {
            const option = document.createElement('option');
            option.value = mun;
            municipalityList.appendChild(option);
        });

        // Clear municipality input if it doesn't match the new list (optional, might be annoying if typing)
        // For now, we prefer to let the user clear it manually or keep it if it's valid.
    } else {
        // If province is not found or empty, maybe show all? 
        // Or show nothing. Standard behavior is show nothing or wait.
        // If we want to support free text provinces outside the list, we can't filter.
    }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    populateAddressDatalists();
});

// Dummy functions to prevent errors if referenced by legacy HTML/JS
function onLiveMunicipalityChange() {
    console.log("onLiveMunicipalityChange called - simple input, no additional logic needed.");
}

function onLiveProvinceChange() {
    // This is mostly replaced by filterMunicipalities, but keeping for safety
    console.log("onLiveProvinceChange called.");
}

function onMunicipalityChange() {
    console.log("onMunicipalityChange called - simple input, no additional logic needed.");
}
