// Constants for corrections based on the manual
const CG_CORRECTION = 0.8; // Knots per 1% CG shift
const SLOPE_CORRECTION = 0.01; // % per degree
const WET_RUNWAY_FACTOR = 1.3; // Multiplier for wet runway distances
const TEMPERATURE_CONVERSION = 5 / 9; // Convert °F to °C for calculations
const REFUSAL_SPEED_ADJUSTMENT = 10; // Adjustment for refusal speed

// Event Listener for Form Submission
document.getElementById("performanceForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from refreshing the page

    // Retrieve input values from the form
    const weight = parseInt(document.getElementById("weight").value);
    const fuelAmount = parseInt(document.getElementById("fuelAmount").value); // For future fuel-specific adjustments
    const temperature = (parseFloat(document.getElementById("temperature").value) - 32) * TEMPERATURE_CONVERSION; // Convert °F to °C
    const runwayLength = parseInt(document.getElementById("runwayLength").value);
    const runwaySlope = parseFloat(document.getElementById("runwaySlope").value);
    const densityAltitude = parseInt(document.getElementById("densityAltitude").value);
    const runwaySurface = document.getElementById("runwaySurface").value;
    const powerSetting = document.getElementById("powerSetting").value;

    // Perform calculations
    const accelerationCheckpoint = computeAccelerationCheckpoint(weight, powerSetting);
    const rotationSpeed = computeRotationSpeed(weight, densityAltitude, temperature, runwaySlope);
    const takeoffSpeed = computeTakeoffSpeed(rotationSpeed);
    const takeoffDistance = computeTakeoffDistance(weight, densityAltitude, temperature, runwaySlope, powerSetting);
    const refusalSpeed = computeRefusalSpeed(weight, runwayLength, powerSetting);
    const normalLanding = computeLandingData(weight, runwaySurface, "normal");
    const heavyLanding = computeLandingData(weight, runwaySurface, "heavy");

    // Display results
    displayResults(
        accelerationCheckpoint,
        rotationSpeed,
        takeoffSpeed,
        takeoffDistance,
        refusalSpeed,
        normalLanding,
        heavyLanding
    );
});

// Function to compute acceleration checkpoint
function computeAccelerationCheckpoint(weight, powerSetting) {
    const baseAcceleration = lookupAccelerationCheckpoint(weight);
    return powerSetting === "ab" ? baseAcceleration * 0.9 : baseAcceleration; // Adjustment for afterburner
}

// Function to compute rotation speed
function computeRotationSpeed(weight, altitude, temp, slope) {
    const baseSpeed = lookupTakeoffSpeed(weight);
    const altitudeAdjustment = altitude * 0.001; // Altitude effect
    const tempAdjustment = temp * 0.002; // Temperature correction
    const slopeAdjustment = slope * SLOPE_CORRECTION; // Slope adjustment
    return baseSpeed + altitudeAdjustment + tempAdjustment + slopeAdjustment;
}

// Function to compute takeoff speed
function computeTakeoffSpeed(rotationSpeed) {
    return rotationSpeed + 10; // Takeoff speed is typically 10 knots above rotation speed
}

// Function to compute takeoff distance
function computeTakeoffDistance(weight, altitude, temp, slope, powerSetting) {
    const baseDistance = lookupTakeoffDistance(weight);
    const altitudeAdjustment = altitude * 0.005; // Altitude effect
    const tempAdjustment = temp * 0.01; // Temperature effect
    const slopeAdjustment = slope * SLOPE_CORRECTION * baseDistance; // Slope adjustment
    const powerSettingAdjustment = powerSetting === "ab" ? -200 : 0; // Afterburner adjustment
    return baseDistance + altitudeAdjustment + tempAdjustment + slopeAdjustment + powerSettingAdjustment;
}

// Function to compute refusal speed
function computeRefusalSpeed(weight, runwayLength, powerSetting) {
    const baseSpeed = lookupRefusalSpeed(weight);
    const runwayEffect = runwayLength * 0.01; // Effect of runway length
    const powerAdjustment = powerSetting === "ab" ? REFUSAL_SPEED_ADJUSTMENT : 0; // Afterburner adjustment
    return baseSpeed + runwayEffect + powerAdjustment;
}

// Function to compute landing data (speed and stopping distance)
function computeLandingData(weight, surface, type) {
    const baseDistance = type === "normal" ? lookupLandingDistance(weight) : lookupHeavyLandingDistance(weight);
    const baseSpeed = type === "normal" ? lookupLandingSpeed(weight) : lookupHeavyLandingSpeed(weight);
    const surfaceAdjustment = surface === "wet" ? baseDistance * WET_RUNWAY_FACTOR : 0;
    return {
        speed: baseSpeed,
        distance: baseDistance + surfaceAdjustment,
    };
}

// Lookup tables for base speeds and distances
function lookupAccelerationCheckpoint(weight) {
    const chart = {
        25000: 500, // Example: 500 ft for 25,000 lbs
        30000: 550,
        35000: 600,
    };
    return interpolate(weight, chart);
}

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

function lookupRefusalSpeed(weight) {
    const chart = {
        25000: 120, // Example: 120 knots at 25,000 lbs
        30000: 130,
        35000: 140,
    };
    return interpolate(weight, chart);
}

function lookupLandingDistance(weight) {
    const chart = {
        25000: 4000,
        30000: 4500,
        35000: 5000,
    };
    return interpolate(weight, chart);
}

function lookupLandingSpeed(weight) {
    const chart = {
        25000: 130,
        30000: 140,
        35000: 150,
    };
    return interpolate(weight, chart);
}

function lookupHeavyLandingDistance(weight) {
    const chart = {
        25000: 4500,
        30000: 5000,
        35000: 5500,
    };
    return interpolate(weight, chart);
}

function lookupHeavyLandingSpeed(weight) {
    const chart = {
        25000: 140,
        30000: 150,
        35000: 160,
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
function displayResults(
    accelerationCheckpoint,
    rotationSpeed,
    takeoffSpeed,
    takeoffDistance,
    refusalSpeed,
    normalLanding,
    heavyLanding
) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <p><strong>Acceleration Checkpoint:</strong> ${accelerationCheckpoint.toFixed(2)} ft</p>
        <p><strong>Rotation Speed:</strong> ${rotationSpeed.toFixed(2)} knots</p>
        <p><strong>Takeoff Speed:</strong> ${takeoffSpeed.toFixed(2)} knots</p>
        <p><strong>Takeoff Distance:</strong> ${takeoffDistance.toFixed(2)} ft</p>
        <p><strong>Refusal Speed:</strong> ${refusalSpeed.toFixed(2)} knots</p>
        <p><strong>Normal Landing Speed:</strong> ${normalLanding.speed.toFixed(2)} knots</p>
        <p><strong>Normal Landing Stopping Distance (Dry/Wet):</strong> ${normalLanding.distance.toFixed(2)} ft</p>
        <p><strong>Heavy Landing Speed:</strong> ${heavyLanding.speed.toFixed(2)} knots</p>
        <p><strong>Heavy Landing Stopping Distance (Dry/Wet):</strong> ${heavyLanding.distance.toFixed(2)} ft</p>
    `;
}
