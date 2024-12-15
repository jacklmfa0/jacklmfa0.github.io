// Constants for corrections based on the manual
const CG_CORRECTION = 0.8; // Knots per 1% CG shift
const SLOPE_CORRECTION = 0.01; // % per degree
const WET_RUNWAY_FACTOR = 1.3; // Multiplier for wet runway distances
const TEMPERATURE_CONVERSION = 5 / 9; // Convert °F to °C for calculations

// Event Listener for Form Submission
document.getElementById("performanceForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Retrieve input values from the form
    const weight = parseInt(document.getElementById("weight").value);
    const fuelAmount = parseInt(document.getElementById("fuelAmount").value); // Not used directly, but useful for adjustments
    const temperature = (parseFloat(document.getElementById("temperature").value) - 32) * TEMPERATURE_CONVERSION; // Convert °F to °C
    const runwayLength = parseInt(document.getElementById("runwayLength").value);
    const runwaySlope = parseFloat(document.getElementById("runwaySlope").value);
    const densityAltitude = parseInt(document.getElementById("densityAltitude").value);
    const runwaySurface = document.getElementById("runwaySurface").value;
    const powerSetting = document.getElementById("powerSetting").value;

    // Perform calculations
    const takeoffSpeed = computeTakeoffSpeed(weight, densityAltitude, temperature, runwaySlope, powerSetting);
    const takeoffDistance = computeTakeoffDistance(weight, densityAltitude, temperature, runwaySlope, powerSetting);
    const landingDistance = computeLandingDistance(weight, runwaySurface, runwaySlope);

    // Display results
    displayResults(takeoffSpeed, takeoffDistance, landingDistance);
});

// Function to compute takeoff speed
function computeTakeoffSpeed(weight, altitude, temp, slope, powerSetting) {
    const baseSpeed = lookupTakeoffSpeed(weight); // Baseline speed from chart
    const altitudeAdjustment = altitude * 0.001; // Altitude effect
    const tempAdjustment = temp * 0.002; // Temperature correction
    const slopeAdjustment = slope * SLOPE_CORRECTION; // Slope adjustment
    const powerSettingAdjustment = powerSetting === "ab" ? -15 : 0; // Afterburner adjustment
    return baseSpeed + altitudeAdjustment + tempAdjustment + slopeAdjustment + powerSettingAdjustment;
}

// Function to compute takeoff distance
function computeTakeoffDistance(weight, altitude, temp, slope, powerSetting) {
    const baseDistance = lookupTakeoffDistance(weight); // Baseline distance from chart
    const altitudeAdjustment = altitude * 0.005; // Altitude effect
    const tempAdjustment = temp * 0.01; // Temperature effect
    const slopeAdjustment = slope * SLOPE_CORRECTION * baseDistance; // Slope adjustment
    const powerSettingAdjustment = powerSetting === "ab" ? -200 : 0; // Afterburner adjustment
    return baseDistance + altitudeAdjustment + tempAdjustment + slopeAdjustment + powerSettingAdjustment;
}

// Function to compute landing distance
function computeLandingDistance(weight, surface, slope) {
    const baseDistance = lookupLandingDistance(weight); // Baseline landing distance
    const surfaceAdjustment = surface === "wet" ? baseDistance * WET_RUNWAY_FACTOR : 0; // Wet surface correction
    const slopeAdjustment = slope * SLOPE_CORRECTION * baseDistance; // Slope adjustment
    return baseDistance + surfaceAdjustment + slopeAdjustment;
}

// Lookup tables for base speeds and distances
function lookupTakeoffSpeed(weight) {
    const chart = {
        25000: 140, // Example: 140 knots at 25,000 lbs
        30000: 150,
        35000: 160,
    };
    return interpolate(weight, chart);
}

function lookupTakeoffDistance(weight) {
    const chart = {
        25000: 3000, // Example: 3000 ft at 25,000 lbs
        30000: 3500,
        35000: 4000,
    };
    return interpolate(weight, chart);
}

function lookupLandingDistance(weight) {
    const chart = {
        25000: 4000, // Example: 4000 ft at 25,000 lbs
        30000: 4500,
        35000: 5000,
    };
    return interpolate(weight, chart);
}

// Interpolation helper function for non-linear charts
function interpolate(value, chart) {
    const keys = Object.keys(chart).map(Number);
    const lowerKey = Math.max(...keys.filter((k) => k <= value));
    const upperKey = Math.min(...keys.filter((k) => k >= value));
    if (lowerKey === upperKey) return chart[lowerKey];
    const slope = (chart[upperKey] - chart[lowerKey]) / (upperKey - lowerKey);
    return chart[lowerKey] + slope * (value - lowerKey);
}

// Display results in the results section
function displayResults(takeoffSpeed, takeoffDistance, landingDistance) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <p>Takeoff Speed: ${takeoffSpeed.toFixed(2)} knots</p>
        <p>Takeoff Distance: ${takeoffDistance.toFixed(2)} ft</p>
        <p>Landing Distance: ${landingDistance.toFixed(2)} ft</p>
    `;
}
