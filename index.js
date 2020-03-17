import { utils } from './utils.js';

// Globals
let advancedMenuEnabled = false;
let onCurrentYear = true;
const MILLION = 1000000;
const BILLION = MILLION * 1000;
const TRILLION = BILLION * 1000;
const QUADRILLION = TRILLION * 1000;

// Elements
const advancedMenuCheckbox = document.getElementById("show_advanced");
const advancedMenu = document.getElementsByClassName("advanced_menu_options")[0];
const numYears = document.getElementById("num_years");
const growthRate = document.getElementById("growth_rate");
const startingPop = document.getElementById("starting_pop");
const maxPop = document.getElementById("max_pop");
const resultsOutput = document.getElementById("results_output");
const resultsDescription = document.getElementById("results_description");


// Functions
const toggleAdvancedMenu = (val) => {
    if (val) {
        advancedMenu.style.display = "block";
        advancedMenuEnabled = true;
    } else {
        advancedMenu.style.display = "none";
        advancedMenuEnabled = false;
    }
};

const showResults = (results) => {
    resultsOutput.textContent = results;   
};

const showDescription = (description) => {
    resultsDescription.textContent = description;
};

const calculateExponentialGrowth = (start, rate, years, cap=-1) => {
    const popArray = [start];
    let current = start;
    for (let i = 0; i <= years; i++) {
        current += current * rate;
        current = Math.round(current);
        popArray.push(current);
        if (cap > start && current >= cap) {
            return popArray;
        }
    }
    return popArray;
};

const growTowardsLimit = (start, rate, years, cap) => {
    const popArray = [];
    // See https://en.wikipedia.org/wiki/Logistic_function
    let current = start;
    for (let i = 0; i < years; i++) {
        const growth = current*rate*(1-((current-start)/(cap - start)));
        popArray.push(Math.round(current + growth));
        current = popArray[i];
    }
    return popArray;
};

const calculateGrowth = () => {
    // Set up
    const mNumYears = numYears.value;
    const mGrowthRate = growthRate.value * .01;
    const mStartingPop = startingPop.value * BILLION;
    const mMaxPop = maxPop.value * BILLION;

    if (startingPop.value == 7.8) {
        onCurrentYear = true;
    } else {
        onCurrentYear = false;
    }

    let popArray;

    // Calculate growth
    if (!advancedMenuEnabled) {
        // Just exponential growth
        popArray = calculateExponentialGrowth(mStartingPop,
            mGrowthRate,
            mNumYears);
    } else {
        popArray = calculateExponentialGrowth(mStartingPop,
            mGrowthRate,
            mNumYears,
            mMaxPop * 0.8);

        let popArrayEnd = growTowardsLimit(utils.last(popArray),
            mGrowthRate,
            mNumYears - popArray.length,
            mMaxPop);
        popArray = popArray.concat(popArrayEnd);
    }

    // Show results
    if (advancedMenuEnabled) {
        // Get stable year
        let stableYear = 0;
        for (let i = 0; i < popArray.length; i++) {
            if (popArray[i] >= mMaxPop * 0.97) {
                console.log(i);
                stableYear = i;
                break;
            }
        }
        if (stableYear == 0) {
            const lastPop = utils.last(popArray);
            showResults('Population will not stabalize within this timeframe.');
            showDescription(`It reaches ${lastPop} in ${mNumYears}.`)
        } else {
            showResults(`The population stabalizes in ${stableYear} years.`);
            showDescription('');
        }

    } else {
        const lastPop = utils.last(popArray);
        let timeDesc = `after ${mNumYears} years`;
        if (onCurrentYear){
            const endYear = 2020 + parseInt(mNumYears, 10);
            timeDesc = `by the year ${endYear}`;
        }

        if (lastPop > QUADRILLION) {
            showResults(`Population: About ${Math.round(lastPop/QUADRILLION)} Quadrillion (${lastPop}) ${timeDesc}.`);
        } else if (lastPop > TRILLION) {
            showResults(`Population: About ${Math.round(lastPop/TRILLION)} Trillion (${lastPop}) ${timeDesc}.`);
        } else {
            showResults(`Population: About ${Math.round(lastPop/BILLION)} Billion (${lastPop}) ${timeDesc}.`);
        }
        showDescription('');
    }
};

// Button Bindings
advancedMenuCheckbox.addEventListener('change', (event) => {
    toggleAdvancedMenu(advancedMenuCheckbox.checked);
});

numYears.addEventListener('change', (event) => {
    calculateGrowth();
});

growthRate.addEventListener('change', (event) => {
    calculateGrowth();
});

startingPop.addEventListener('change', (event) => {
    calculateGrowth();
});

maxPop.addEventListener('change', (event) => {
    calculateGrowth();
});