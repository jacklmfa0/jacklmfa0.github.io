// Constants for corrections based on the manual
const CG_CORRECTION = 0.8; // Knots per 1% CG shift
const SLOPE_CORRECTION = 0.01; // % per degree
const WET_RUNWAY_FACTOR = 1.3; // Multiplier for wet runway distances
const REFUSAL_SPEED_ADJUSTMENT = 10; // Adjustment for refusal speed
const TEMPERATURE_CONVERSION = 5 / 9; // Convert °F to °C for calculations

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
    const normalLandingSurface = document.getElementById("normalLandingSurface").value; // Normal landing surface
    const heavyLandingSurface = document.getElementById("heavyLandingSurface").value; // Heavy landing surface

    // Perform calculations
    const accelerationCheckpoint = computeAccelerationCheckpoint(weight, powerSetting);
    const rotationSpeed = computeRotationSpeed(weight, densityAltitude, temperature, runwaySlope);
    const takeoffSpeed = computeTakeoffSpeed(rotationSpeed);
    const takeoffDistance = computeTakeoffDistance(weight, densityAltitude, temperature, runwaySlope, powerSetting);
    const refusalSpeed = computeRefusalSpeed(weight, runwayLength, powerSetting);
    const normalLanding = computeLandingData(weight, normalLandingSurface, "normal"); // Calculate for normal landing
    const heavyLanding = computeLandingData(weight, heavyLandingSurface, "heavy"); // Calculate for heavy landing

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

    // Apply wet surface correction (1.3 multiplier for wet runways)
    const surfaceAdjustment = surface === "wet" ? baseDistance * WET_RUNWAY_FACTOR : 0;

    // Return an object with speed and corrected distance
    return {
        speed: baseSpeed,
        distance: baseDistance + surfaceAdjustment,
    };
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
