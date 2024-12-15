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

            const weight = parseFloat(weightInput.value);
            const fuel = parseFloat(fuelInput.value);
            const tempF = parseFloat(tempInput.value);
            const runwayLength = parseFloat(runwayLengthInput.value);
            const slope = parseFloat(slopeInput.value);
            const densityAltitude = parseFloat(densityAltitudeInput.value);
            const runwaySurface = runwaySurfaceInput.value;
            const powerSetting = powerSettingInput.value;

            if (isNaN(weight) || isNaN(fuel) || isNaN(tempF) || 
                isNaN(runwayLength) || isNaN(slope) || isNaN(densityAltitude)) {
                alert("Please fill in all fields with valid numbers.");
                return;
            }

            const results = calculatePerformance({
                weight,
                fuel,
                tempF,
                runwayLength,
                slope,
                densityAltitude,
                runwaySurface,
                powerSetting
            });

            displayResults(results);

            weightInput.value = weight;
            fuelInput.value = fuel;
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
    fuel,
    tempF,
    runwayLength,
    slope,
    densityAltitude,
    runwaySurface,
    powerSetting,
}) {
    const tempC = (tempF - 32) * 5 / 9;
    const thrust = powerSetting === "ab" ? 23800 : 17000; // More realistic F-16 thrust values
    const RCR = runwaySurface === "dry" ? 23 : 18;

    const takeoffResults = calculateTakeoff({
        weight,
        temp: tempC,
        runwayLength,
        slope,
        densityAltitude,
        thrust,
        RCR,
    });

    const landingResults = calculateLanding({
        weight,
        slope,
        RCR,
    });

    return { takeoffResults, landingResults };
}

function calculateTakeoff({ weight, temp, runwayLength, slope, densityAltitude, thrust, RCR }) {
    // F-16 specific performance calculations
    const baseSpeed = 140; // Baseline decision speed for F-16
    const rotationSpeed = baseSpeed + (weight / 20000) * 5; // More nuanced speed calculation
    const accelerationSpeed = rotationSpeed - 10;
    
    // More realistic drag and acceleration calculation
    const drag = 0.01 * weight; // Reduced drag coefficient
    const acceleration = (thrust - drag) / weight;
    
    // Adjusted takeoff distance calculation based on F-16 performance data
    const takeoffDistance = Math.pow(rotationSpeed * 1.68781, 2) / (2 * acceleration * 1.3);
    
    // Refusal speed adjusted for F-16 characteristics
    const refusalSpeed = baseSpeed + (RCR * 0.05);

    return { 
        accelerationSpeed: accelerationSpeed, 
        rotationSpeed: rotationSpeed, 
        takeoffDistance: takeoffDistance, 
        refusalSpeed: refusalSpeed 
    };
}

function calculateLanding({ weight, slope, RCR }) {
    const landingSpeed = 120 + (weight / 15000) * 5; // Adjusted for F-16 landing characteristics
    const decelerationDry = 12; // Slightly reduced deceleration rate
    const decelerationWet = decelerationDry * 0.7;
    const stoppingDistanceDry = Math.pow(landingSpeed * 1.68781, 2) / (2 * decelerationDry);
    const stoppingDistanceWet = stoppingDistanceDry * 1.3;

    return { 
        landingSpeed: landingSpeed, 
        stoppingDistanceDry: stoppingDistanceDry, 
        stoppingDistanceWet: stoppingDistanceWet 
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
