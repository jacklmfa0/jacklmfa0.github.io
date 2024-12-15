document.addEventListener('DOMContentLoaded', function() {
    const performanceForm = document.getElementById("performanceForm");
    
    if (performanceForm) {
        performanceForm.addEventListener("submit", function(event) {
            event.preventDefault();
            event.stopPropagation();

            const weightInput = document.getElementById("weight");
            const fuelInput = document.getElementById("fuel");
            const tempInput = document.getElementById("temperature");
            const runwayLengthInput = document.getElementById("runwayLength");
            const slopeInput = document.getElementById("runwaySlope");
            const densityAltitudeInput = document.getElementById("densityAltitude");
            const runwaySurfaceInput = document.getElementById("runwaySurface");
            const powerSettingInput = document.getElementById("powerSetting");

            const baseWeight = parseFloat(weightInput.value);
            const fuelWeight = parseFloat(fuelInput.value);
            const tempF = parseFloat(tempInput.value);
            const runwayLength = parseFloat(runwayLengthInput.value);
            const slope = parseFloat(slopeInput.value);
            const densityAltitude = parseFloat(densityAltitudeInput.value);
            const runwaySurface = runwaySurfaceInput.value;
            const powerSetting = powerSettingInput.value;

            // Calculate total weight by adding fuel weight
            const totalWeight = baseWeight + fuelWeight;

            if (isNaN(baseWeight) || isNaN(fuelWeight) || isNaN(tempF) || 
                isNaN(runwayLength) || isNaN(slope) || isNaN(densityAltitude)) {
                alert("Please fill in all fields with valid numbers.");
                return;
            }

            const results = calculatePerformance({
                weight: totalWeight,
                tempF,
                runwayLength,
                slope,
                densityAltitude,
                runwaySurface,
                powerSetting
            });

            displayResults(results);

            weightInput.value = baseWeight;
            fuelInput.value = fuelWeight;
            tempInput.value = tempF;
            runwayLengthInput.value = runwayLength;
            slopeInput.value = slope;
            densityAltitudeInput.value = densityAltitude;
            runwaySurfaceInput.value = runwaySurface;
            powerSettingInput.value = powerSetting;
        });
    }
});

function calculatePerformance({
    weight,
    tempF,
    runwayLength,
    slope,
    densityAltitude,
    runwaySurface,
    powerSetting,
}) {
    const tempC = (tempF - 32) * 5 / 9;
    const thrust = powerSetting === "ab" ? 260000 : 192800; // F-16 thrust values

    const takeoffResults = calculateTakeoff({
        weight,
        temp: tempC,
        runwayLength,
        slope,
        densityAltitude,
        thrust,
        runwaySurface
    });

    const landingResults = calculateLanding({
        weight,
        slope,
        runwaySurface,
        densityAltitude
    });

    return { takeoffResults, landingResults };
}

function calculateTakeoff({ 
    weight, 
    temp, 
    runwayLength, 
    slope, 
    densityAltitude, 
    thrust,
    runwaySurface 
}) {
    // Density Altitude Performance Correction
    const densityAltitudeFactor = Math.max(1 + (densityAltitude / 1000) * 0.04, 1);

    // Slope Performance Correction
    const slopeFactor = 1 + (Math.abs(slope) / 100) * 0.1;

    // Base Speed Calculations
    const baseSpeed = 140; // Baseline decision speed for F-16
    const rotationSpeed = baseSpeed + (weight / 20000) * 5 * densityAltitudeFactor;
    const accelerationSpeed = rotationSpeed - 10;
    
    // Drag and Acceleration with Density Altitude and Slope Considerations
    const baseDrag = 0.01 * weight;
    const dragIncrease = densityAltitudeFactor * slopeFactor;
    const drag = baseDrag * dragIncrease;
    
    // Adjusted Acceleration
    const acceleration = Math.max((thrust - drag) / weight, 0.5);
    
    // Takeoff Distance Calculation
    let takeoffDistance = Math.pow(rotationSpeed * 1.68781, 2) / (2 * acceleration * 1.3);
    
    // Runway Surface and Slope Adjustments
    const surfaceFactor = runwaySurface === "wet" ? 1.3 : 1;
    const slopeMultiplier = slope > 0 ? 1 + (slope / 100) * 0.2 : 1 - (Math.abs(slope) / 100) * 0.1;
    
    takeoffDistance *= surfaceFactor * slopeMultiplier * densityAltitudeFactor;

    // Refusal Speed Adjustment
    const baseRefusalSpeed = baseSpeed + 10;
    const refusalSpeed = baseRefusalSpeed * densityAltitudeFactor;

    return { 
        accelerationSpeed: accelerationSpeed, 
        rotationSpeed: rotationSpeed, 
        takeoffDistance: takeoffDistance, 
        refusalSpeed: refusalSpeed 
    };
}

function calculateLanding({ 
    weight, 
    slope, 
    runwaySurface,
    densityAltitude 
}) {
    // Density Altitude Performance Correction
    const densityAltitudeFactor = Math.max(1 + (densityAltitude / 1000) * 0.04, 1);

    // Slope Performance Correction
    const slopeFactor = 1 + (Math.abs(slope) / 100) * 0.15;

    // Landing Speed Calculations
    const baseLandingSpeed = 120 + (weight / 15000) * 5;
    const landingSpeed = baseLandingSpeed * densityAltitudeFactor * slopeFactor;

    // Deceleration Rates
    const decelerationDry = 12 * densityAltitudeFactor;
    const decelerationWet = decelerationDry * 0.7;

    // Stopping Distance Calculations
    const stoppingDistanceDry = Math.pow(landingSpeed * 1.68781, 2) / (2 * decelerationDry);
    const stoppingDistanceWet = stoppingDistanceDry * 1.3;

    // Slope Adjustments
    const slopeMultiplier = slope > 0 ? 1 + (slope / 100) * 0.25 : 1 - (Math.abs(slope) / 100) * 0.15;
    
    return { 
        landingSpeed: landingSpeed, 
        stoppingDistanceDry: stoppingDistanceDry * slopeMultiplier, 
        stoppingDistanceWet: stoppingDistanceWet * slopeMultiplier
    };
}

function displayResults({ takeoffResults, landingResults }) {
    const resultsContainer = document.getElementById("results");
    const noResultsElement = document.getElementById("noResults");

    if (noResultsElement) {
        noResultsElement.style.display = "none";
    }

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
}
