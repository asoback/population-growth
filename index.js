// Globals
let advancedMenuEnabled = false;

// Elements
const advancedMenuCheckbox = document.getElementById("show_advanced");
const advancedMenu = document.getElementsByClassName("advanced_menu_options")[0];

// Functions
const toggleAdvancedMenu = (val) => {
    console.log(val);
    if (val) {
        advancedMenu.style.display = "block";
        advancedMenuEnabled = true;
    } else {
        advancedMenu.style.display = "none";
        advancedMenuEnabled = false;
    }
};

// Button Bindings
advancedMenuCheckbox.addEventListener('change', (event) => {
    toggleAdvancedMenu(advancedMenuCheckbox.checked);
});