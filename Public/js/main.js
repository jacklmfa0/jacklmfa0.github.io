document.getElementById("performanceForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from reloading the page

    // Gather input values
    const weight = parseFloat(document.getElementById("weight").value);
    const fuel = parseFloat(document.getElementById("fuelAmount").value);
    const tempF = parseFloat(document.getElementById("temperature").value);
    const runwayLength = parseFloat(document.getElementById("runwayLength").value);
    const slope = parseFloat(document.getElementById("runwaySlope").value);
    const densityAltitude = parseFloat(document.getElementById("densityAltitude").value);
    const runwaySurface = document.getElementById("runwaySurface").value; // "dry" or "wet"
    const powerSetting = document.getElementById("powerSetting").value; // "mil" or "ab"

    // Convert temperature to Celsius (if necessary for formulas)
    const tempC = (tempF - 32) * 5 / 9;

    // Perform calculations
    const takeoffResults = calculateTakeoff({
        weight,
        fuel,
        temp: tempC,
        runwayLength,
        slope,
        densityAltitude,
        runwayCondition: runwaySurface,
        thrustSetting: powerSetting
    });

    const landingResults = calculateLanding({
        weight,
        slope,
        densityAltitude,
        runwayCondition: runwaySurface
    });

    // Update results in the DOM
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = `
        <p><strong>Takeoff Performance:</strong></p>
        <p>Acceleration Check Speed: ${takeoffResults.accelerationSpeed.toFixed(2)} KIAS</p>
        <p>Rotation Speed: ${takeoffResults.rotationSpeed.toFixed(2)} KIAS</p>
        <p>Takeoff Speed: ${takeoffResults.takeoffSpeed.toFixed(2)} KIAS</p>
        <p>Takeoff Distance: ${takeoffResults.takeoffDistance.toFixed(2)} ft</p>
        <p>Refusal Speed: ${takeoffResults.refusalSpeed.toFixed(2)} KIAS</p>
        <hr>
        <p><strong>Landing Performance:</strong></p>
        <p>Normal Landing Speed: ${landingResults.normalLandingSpeed.toFixed(2)} KIAS</p>
        <p>Heavy Landing Speed: ${landingResults.heavyLandingSpeed.toFixed(2)} KIAS</p>
        <p>Stopping Distance (Dry): ${landingResults.stoppingDistanceDry.toFixed(2)} ft</p>
        <p>Stopping Distance (Wet): ${landingResults.stoppingDistanceWet.toFixed(2)} ft</p>
    `;
});

// Placeholder formulas
const calculateTakeoff = ({ weight, fuel, temp, runwayLength, slope, densityAltitude, runwayCondition, thrustSetting }) => {
    // Replace these placeholder calculations with actual formulas
    const takeoffFactor = weight * 0.002; // Example weight factor
    return {
        accelerationSpeed: 80 + temp * 0.1, // Placeholder
        rotationSpeed: 130 + takeoffFactor * 0.5, // Placeholder
        takeoffSpeed: 150 + takeoffFactor * 0.7, // Placeholder
        takeoffDistance: runwayLength - 500, // Placeholder
        refusalSpeed: 100 + slope * 0.2 // Placeholder
    };
};

const calculateLanding = ({ weight, slope, densityAltitude, runwayCondition }) => {
    // Replace these placeholder calculations with actual formulas
    const stoppingFactor = weight * 0.001; // Example weight factor
    const isWet = runwayCondition === "wet";
    return {
        normalLandingSpeed: 125 + stoppingFactor * 0.3, // Placeholder
        heavyLandingSpeed: 140 + stoppingFactor * 0.4, // Placeholder
        stoppingDistanceDry: 3000 - slope * 10, // Placeholder
        stoppingDistanceWet: isWet ? 1.3 * (3000 - slope * 10) : 3000 - slope * 10 // Placeholder
    };
};,
