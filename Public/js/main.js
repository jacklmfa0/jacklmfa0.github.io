document.getElementById("performanceForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from reloading the page

    // Gather input values
    const weight = parseFloat(document.getElementById("weight").value); // in lbs
    const fuel = parseFloat(document.getElementById("fuelAmount").value); // in lbs
    const tempF = parseFloat(document.getElementById("temperature").value); // in °F
    const runwayLength = parseFloat(document.getElementById("runwayLength").value); // in ft
    const slope = parseFloat(document.getElementById("runwaySlope").value); // in %
    const densityAltitude = parseFloat(document.getElementById("densityAltitude").value); // in ft
    const runwaySurface = document.getElementById("runwaySurface").value; // "dry" or "wet"
    const powerSetting = document.getElementById("powerSetting").value; // "mil" or "ab"

    // Constants (Approximate values based on F-16 performance)
    const V1 = 150; // Decision speed in knots
    const Vr = 160; // Rotation speed in knots
    const V2 = 170; // Takeoff safety speed in knots
    const landingSpeed = 125; // Normal landing speed in knots
    const heavyLandingSpeed = 140; // Heavy landing speed in knots

    // Conversion factors
    const tempC = (tempF - 32) * 5 / 9; // Convert °F to °C

    // Calculate Thrust Available
    const thrustAvailable = powerSetting === "ab" ? 60000 : 40000; // in lbs, approximate values

    // Calculate Takeoff Distance
    const takeoffDistance = calculateTakeoffDistance(runwayLength, slope, runwaySurface, thrustAvailable, weight, densityAltitude);

    // Calculate Refusal Speed (Assuming V1)
    const refusalSpeed = V1;

    // Calculate Acceleration Checkpoint (Assuming distance at V1)
    const accelerationCheckpoint = calculateAccelerationCheckpoint(V1, thrustAvailable, weight, slope);

    // Calculate Landing Stopping Distance
    const landingResults = calculateLandingDistance(runwayLength, slope, runwaySurface, landingSpeed, heavyLandingSpeed);

    // Update results in the DOM
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML = `
        <div>
            <h3>Takeoff Performance</h3>
            <p><strong>Acceleration Checkpoint:</strong> ${accelerationCheckpoint.toFixed(2)} ft</p>
            <p><strong>Rotation Speed (Vr):</strong> ${Vr} knots</p>
            <p><strong>Takeoff Safety Speed (V2):</strong> ${V2} knots</p>
            <p><strong>Takeoff Distance:</strong> ${takeoffDistance.toFixed(2)} ft</p>
            <p><strong>Refusal Speed (V1):</strong> ${refusalSpeed} knots</p>
        </div>
        <hr>
        <div>
            <h3>Landing Performance</h3>
            <p><strong>Normal Landing Speed:</strong> ${landingSpeed} knots</p>
            <p><strong>Heavy Landing Speed:</strong> ${heavyLandingSpeed} knots</p>
            <p><strong>Stopping Distance (Dry):</strong> ${landingResults.stoppingDistanceDry.toFixed(2)} ft</p>
            <p><strong>Stopping Distance (Wet):</strong> ${landingResults.stoppingDistanceWet.toFixed(2)} ft</p>
            <p><strong>Heavy Stopping Distance (Dry):</strong> ${landingResults.heavyStoppingDistanceDry.toFixed(2)} ft</p>
            <p><strong>Heavy Stopping Distance (Wet):</strong> ${landingResults.heavyStoppingDistanceWet.toFixed(2)} ft</p>
        </div>
    `;
});

/**
 * Calculate Takeoff Distance based on inputs
 * @param {number} runwayLength - Available runway length in feet
 * @param {number} slope - Runway slope in percentage
 * @param {string} runwaySurface - "dry" or "wet"
 * @param {number} thrust - Available thrust in lbs
 * @param {number} weight - Aircraft weight in lbs
 * @param {number} densityAltitude - Density altitude in feet
 * @returns {number} takeoffDistance in feet
 */
function calculateTakeoffDistance(runwayLength, slope, runwaySurface, thrust, weight, densityAltitude) {
    // Simplified takeoff distance calculation using basic physics
    // Takeoff distance = (V2^2 - V1^2) / (2 * a) + safety margin
    // Where a = (Thrust - Drag) / Weight

    // Estimate Drag (D) as a function of weight and speed
    // D = 0.02 * weight (simplified)
    const drag = 0.02 * weight;

    // Acceleration (a) = (Thrust - Drag) / Weight
    const acceleration = (thrust - drag) / weight; // in ft/s²

    // Convert V2 from knots to ft/s
    const V2_ft_s = (170 * 1.68781); // 170 knots to ft/s ≈ 287 ft/s

    // Takeoff distance calculation
    const takeoffDistance = (Math.pow(V2_ft_s, 2)) / (2 * acceleration);

    // Adjust for runway slope
    const slopeFactor = 1 - (slope / 100); // Downhill slope reduces distance
    const adjustedTakeoffDistance = takeoffDistance / slopeFactor;

    // Adjust for runway surface
    const surfaceFactor = runwaySurface === "wet" ? 1.3 : 1.0; // Wet surfaces increase distance
    const finalTakeoffDistance = adjustedTakeoffDistance * surfaceFactor;

    // Safety margin
    const safetyMargin = 500; // feet
    return finalTakeoffDistance + safetyMargin;
}

/**
 * Calculate Acceleration Checkpoint based on V1 speed
 * @param {number} V1 - Decision speed in knots
 * @param {number} thrust - Available thrust in lbs
 * @param {number} weight - Aircraft weight in lbs
 * @param {number} slope - Runway slope in percentage
 * @returns {number} accelerationCheckpoint in feet
 */
function calculateAccelerationCheckpoint(V1, thrust, weight, slope) {
    // Convert V1 from knots to ft/s
    const V1_ft_s = (V1 * 1.68781); // 150 knots ≈ 253 ft/s

    // Estimate Drag at V1
    const drag = 0.02 * weight;

    // Acceleration (a) = (Thrust - Drag) / Weight
    const acceleration = (thrust - drag) / weight; // in ft/s²

    // Distance = V1^2 / (2 * a)
    const distance = Math.pow(V1_ft_s, 2) / (2 * acceleration);

    // Adjust for slope
    const slopeFactor = 1 - (slope / 100);
    const adjustedDistance = distance / slopeFactor;

    return adjustedDistance;
}

/**
 * Calculate Landing Distances based on inputs
 * @param {number} runwayLength - Available runway length in feet
 * @param {number} slope - Runway slope in percentage
 * @param {string} runwaySurface - "dry" or "wet"
 * @param {number} landingSpeed - Normal landing speed in knots
 * @param {number} heavyLandingSpeed - Heavy landing speed in knots
 * @returns {object} landingDistances with dry/wet stopping distances
 */
function calculateLandingDistance(runwayLength, slope, runwaySurface, landingSpeed, heavyLandingSpeed) {
    // Simplified stopping distance calculation using basic physics
    // Stopping distance = V^2 / (2 * deceleration) + safety margin
    // Deceleration depends on runway surface

    // Deceleration factors (simplified)
    const decelerationDry = 15; // ft/s²
    const decelerationWet = 10; // ft/s²

    const deceleration = runwaySurface === "wet" ? decelerationWet : decelerationDry;

    // Convert speeds from knots to ft/s
    const landingSpeed_ft_s = landingSpeed * 1.68781; // 125 knots ≈ 211 ft/s
    const heavyLandingSpeed_ft_s = heavyLandingSpeed * 1.68781; // 140 knots ≈ 236 ft/s

    // Calculate stopping distances
    const stoppingDistanceDry = (Math.pow(landingSpeed_ft_s, 2)) / (2 * deceleration);
    const stoppingDistanceWet = runwaySurface === "wet" ? stoppingDistanceDry * 1.3 : stoppingDistanceDry;

    // Heavy landing stopping distances
    const heavyStoppingDistanceDry = (Math.pow(heavyLandingSpeed_ft_s, 2)) / (2 * deceleration);
    const heavyStoppingDistanceWet = runwaySurface === "wet" ? heavyStoppingDistanceDry * 1.3 : heavyStoppingDistanceDry;

    // Safety margin
    const safetyMargin = 300; // feet

    return {
        stoppingDistanceDry: stoppingDistanceDry + safetyMargin,
        stoppingDistanceWet: stoppingDistanceWet + safetyMargin,
        heavyStoppingDistanceDry: heavyStoppingDistanceDry + safetyMargin,
        heavyStoppingDistanceWet: heavyStoppingDistanceWet + safetyMargin
    };
}
