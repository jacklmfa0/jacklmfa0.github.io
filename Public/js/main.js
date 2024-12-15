document.getElementById("performanceForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from resetting

    // Gather input values
    const weight = parseFloat(document.getElementById("weight").value);
    const fuel = parseFloat(document.getElementById("fuel").value);
    const tempF = parseFloat(document.getElementById("temperature").value);
    const runwayLength = parseFloat(document.getElementById("runwayLength").value);
    const slope = parseFloat(document.getElementById("runwaySlope").value);
    const densityAltitude = parseFloat(document.getElementById("densityAltitude").value);
    const runwaySurface = document.getElementById("runwaySurface").value; // "dry" or "wet"
    const powerSetting = document.getElementById("powerSetting").value; // "mil" or "ab"

    // Validate inputs
    if (isNaN(weight) || isNaN(fuel) || isNaN(tempF) || isNaN(runwayLength) || isNaN(slope) || isNaN(densityAltitude)) {
        alert("Please fill in all fields with valid values.");
        return;
    }

    // Perform calculations
    const results = calculatePerformance({
        weight,
        fuel,
        tempF,
        runwayLength,
        slope,
        densityAltitude,
        runwaySurface,
        powerSetting,
    });

    // Display results
    displayResults(results);
});

function calculatePerformance({
    weight,
    fuel,
    tempF,
    runwayLength,
    slope,
    densityAltitude,
    runwaySurface,
    powerSetting,
}) {
    // Conversion factors and constants
    const tempC = (tempF - 32) * 5 / 9; // Convert Fahrenheit to Celsius
    const thrust = powerSetting === "ab" ? 60000 : 40000; // Approximate thrust (in lbs)
    const RCR = runwaySurface === "dry" ? 23 : 18; // Runway Condition Reading

    // Takeoff Calculations
    const takeoffResults = calculateTakeoff({
        weight,
        temp: tempC,
        runwayLength,
        slope,
        densityAltitude,
        thrust,
        RCR,
    });

    // Landing Calculations
    const landingResults = calculateLanding({
        weight,
        slope,
        RCR,
    });

    return { takeoffResults, landingResults };
}

function calculateTakeoff({ weight, temp, runwayLength, slope, densityAltitude, thrust, RCR }) {
    const baseSpeed = 150; // Baseline decision speed in knots
    const rotationSpeed = baseSpeed + (weight / 1000) * 0.2; // Adjust for weight
    const accelerationSpeed = rotationSpeed - 10; // Approximate checkpoint
    const drag = 0.02 * weight; // Simplified drag calculation
    const acceleration = (thrust - drag) / weight; // Acceleration (ft/s²)
    const takeoffDistance = Math.pow(rotationSpeed * 1.68781, 2) / (2 * acceleration); // Kinematic equation
    const refusalSpeed = baseSpeed + RCR * 0.1; // Adjust for runway conditions

    return { 
        accelerationSpeed: accelerationSpeed, 
        rotationSpeed: rotationSpeed, 
        takeoffDistance: takeoffDistance, 
        refusalSpeed: refusalSpeed 
    };
}

function calculateLanding({ weight, slope, RCR }) {
    const landingSpeed = 125 + (weight / 1000) * 0.15; // Adjust for weight
    const decelerationDry = 15; // Deceleration rate on dry runway (ft/s²)
    const decelerationWet = decelerationDry * 0.7; // Reduced rate on wet runway
    const stoppingDistanceDry = Math.pow(landingSpeed * 1.68781, 2) / (2 * decelerationDry);
    const stoppingDistanceWet = stoppingDistanceDry * 1.3; // Increase for wet conditions

    return { 
        landingSpeed: landingSpeed, 
        stoppingDistanceDry: stoppingDistanceDry, 
        stoppingDistanceWet: stoppingDistanceWet 
    };
}

function displayResults({ takeoffResults, landingResults }) {
    const resultsContainer = document.getElementById("results");

    resultsContainer.innerHTML = `
        <div>
            <h3>Takeoff Performance</h3>
            <p><strong>Acceleration Check Speed:</strong> ${takeoffResults.accelerationSpeed.toFixed(2)} KIAS</p>
            <p><strong>Rotation Speed:</strong> ${takeoffResults.rotationSpeed.toFixed(2)} KIAS</p>
            <p><strong>Takeoff Distance:</strong> ${takeoffResults.takeoffDistance.toFixed(2)} ft</p>
            <p><strong>Refusal Speed:</strong> ${takeoffResults.refusalSpeed.toFixed(2)} KIAS</p>
        </div>
        <hr>
        <div>
            <h3>Landing Performance</h3>
            <p><strong>Normal Landing Speed:</strong> ${landingResults.landingSpeed.toFixed(2)} KIAS</p>
            <p><strong>Stopping Distance (Dry):</strong> ${landingResults.stoppingDistanceDry.toFixed(2)} ft</p>
            <p><strong>Stopping Distance (Wet):</strong> ${landingResults.stoppingDistanceWet.toFixed(2)} ft</p>
        </div>
    `;
    
    // Remove the "no results" placeholder
    const noResultsElement = document.getElementById("noResults");
    if (noResultsElement) {
        noResultsElement.style.display = "none";
    }
}
