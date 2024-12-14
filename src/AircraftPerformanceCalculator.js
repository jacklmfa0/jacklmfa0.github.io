import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

class F16PerformanceCalculator {
  // F-16 Specific Constants
  static AIRCRAFT_SPECS = {
    emptyWeight: 19700, // lbs
    maxTakeoffWeight: 42300, // lbs
    wingArea: 300, // sq ft
    maxThrust: {
      milPower: 23770, // lbs of thrust
      afterburner: 28600  // lbs of thrust
    },
    stallSpeed: 138, // knots
  };

  // Performance Calculation Methods
  static calculateDensityAltitude(temperature, pressureAltitude) {
    // Standard density altitude calculation
    return pressureAltitude + 118.6 * (temperature - 15);
  }

  static calculateRotationSpeed(weight) {
    // F-16 specific rotation speed calculation
    // Based on weight and aircraft characteristics
    const baseRotationSpeed = 140; // knots
    const weightFactor = Math.max(0.8, Math.min(1.2, weight / this.AIRCRAFT_SPECS.maxTakeoffWeight));
    return Math.round(baseRotationSpeed * weightFactor);
  }

  static calculateTakeoffSpeed(weight, densityAltitude, powerSetting) {
    // Takeoff speed calculation considering weight and density altitude
    const baseSpeed = 160; // knots
    const weightFactor = weight / this.AIRCRAFT_SPECS.maxTakeoffWeight;
    const altitudeFactor = 1 + (densityAltitude / 10000);
    const powerFactor = powerSetting === 'ab' ? 1.2 : 1.0;
    
    return Math.round(baseSpeed * weightFactor * altitudeFactor * powerFactor);
  }

  static calculateTakeoffDistance(weight, temperature, runwayLength, powerSetting) {
    // Takeoff distance calculation for F-16
    const baseDistance = 7000; // ft at sea level
    const weightFactor = weight / this.AIRCRAFT_SPECS.maxTakeoffWeight;
    const temperatureFactor = 1 + ((temperature - 15) / 30);
    const powerFactor = powerSetting === 'ab' ? 0.8 : 1.0;
    
    let adjustedDistance = baseDistance * weightFactor * temperatureFactor * powerFactor;
    
    // Ensure distance doesn't exceed available runway
    return Math.min(adjustedDistance, runwayLength * 0.9);
  }

  static calculateRefusalSpeed(weight) {
    // Refusal speed calculation
    const baseRefusalSpeed = 180; // knots
    const weightFactor = weight / this.AIRCRAFT_SPECS.maxTakeoffWeight;
    
    return Math.round(baseRefusalSpeed * weightFactor);
  }

  static calculateLandingPerformance(weight, runwayLength, runwaySurface) {
    // Landing speed and stopping distance calculations
    const baseNormalLandingSpeed = 140; // knots
    const weightFactor = weight / this.AIRCRAFT_SPECS.maxTakeoffWeight;
    const surfaceFactor = runwaySurface === 'wet' ? 1.3 : 1.0;
    
    const normalLandingSpeed = Math.round(baseNormalLandingSpeed * weightFactor);
    
    // Base stopping distance calculations
    const baseStoppingDistance = 5000; // ft
    const stoppingDistance = Math.round(
      baseStoppingDistance * weightFactor * surfaceFactor
    );
    
    // Heavy landing calculations
    const heavyLandingSpeed = Math.round(normalLandingSpeed * 1.2);
    const heavyStoppingDistance = Math.round(stoppingDistance * 1.5);
    
    return {
      normalLandingSpeed,
      stoppingDistanceDry: runwaySurface === 'dry' ? stoppingDistance : stoppingDistance * 1.2,
      stoppingDistanceWet: runwaySurface === 'wet' ? stoppingDistance * 1.4 : stoppingDistance,
      heavyLandingSpeed,
      heavyLandingStoppingDistanceDry: runwaySurface === 'dry' ? heavyStoppingDistance : heavyStoppingDistance * 1.3,
      heavyLandingStoppingDistanceWet: runwaySurface === 'wet' ? heavyStoppingDistance * 1.6 : heavyStoppingDistance
    };
  }
}

const F16PerformanceApp = () => {
  const [inputs, setInputs] = useState({
    weight: 30000, // lbs
    fuel: 5000, // lbs
    temperature: 25, // °F
    runwayLength: 10000, // ft
    runwaySlope: 0, // %
    densityAltitude: 0, // ft
    runwaySurface: 'dry',
    powerSetting: 'mil'
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleSelectChange = (name, value) => {
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePerformance = () => {
    // Calculate density altitude
    const densityAltitude = F16PerformanceCalculator.calculateDensityAltitude(
      inputs.temperature, 
      inputs.densityAltitude
    );

    // Takeoff Performance
    const accelerationCheckpoint = Math.round(inputs.runwayLength * 0.3);
    const rotationSpeed = F16PerformanceCalculator.calculateRotationSpeed(inputs.weight);
    const takeoffSpeed = F16PerformanceCalculator.calculateTakeoffSpeed(
      inputs.weight, 
      densityAltitude, 
      inputs.powerSetting
    );
    const takeoffDistance = F16PerformanceCalculator.calculateTakeoffDistance(
      inputs.weight, 
      inputs.temperature, 
      inputs.runwayLength, 
      inputs.powerSetting
    );
    const refusalSpeed = F16PerformanceCalculator.calculateRefusalSpeed(inputs.weight);

    // Landing Performance
    const landingPerformance = F16PerformanceCalculator.calculateLandingPerformance(
      inputs.weight, 
      inputs.runwayLength, 
      inputs.runwaySurface
    );

    setResults({
      accelerationCheckpoint,
      rotationSpeed,
      takeoffSpeed,
      takeoffDistance,
      refusalSpeed,
      ...landingPerformance
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">F-16 Fighting Falcon Performance Calculator</h1>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label>Weight (lbs)</label>
                <Input 
                  type="number"
                  name="weight"
                  value={inputs.weight}
                  onChange={handleInputChange}
                  placeholder="Enter aircraft weight"
                />
              </div>
              
              <div>
                <label>Fuel (lbs)</label>
                <Input 
                  type="number"
                  name="fuel"
                  value={inputs.fuel}
                  onChange={handleInputChange}
                  placeholder="Enter fuel amount"
                />
              </div>
              
              <div>
                <label>Temperature (°F)</label>
                <Input 
                  type="number"
                  name="temperature"
                  value={inputs.temperature}
                  onChange={handleInputChange}
                  placeholder="Enter temperature"
                />
              </div>
              
              <div>
                <label>Runway Length (ft)</label>
                <Input 
                  type="number"
                  name="runwayLength"
                  value={inputs.runwayLength}
                  onChange={handleInputChange}
                  placeholder="Enter runway length"
                />
              </div>
              
              <div>
                <label>Runway Slope (%)</label>
                <Input 
                  type="number"
                  name="runwaySlope"
                  value={inputs.runwaySlope}
                  onChange={handleInputChange}
                  placeholder="Enter runway slope"
                />
              </div>
              
              <div>
                <label>Density Altitude (ft)</label>
                <Input 
                  type="number"
                  name="densityAltitude"
                  value={inputs.densityAltitude}
                  onChange={handleInputChange}
                  placeholder="Enter density altitude"
                />
              </div>
              
              <div>
                <label>Runway Surface</label>
                <Select 
                  value={inputs.runwaySurface}
                  onValueChange={(value) => handleSelectChange('runwaySurface', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select runway surface" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dry">Dry</SelectItem>
                    <SelectItem value="wet">Wet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label>Power Setting</label>
                <Select 
                  value={inputs.powerSetting}
                  onValueChange={(value) => handleSelectChange('powerSetting', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select power setting" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mil">MIL Power</SelectItem>
                    <SelectItem value="ab">Afterburner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={calculatePerformance} className="w-full">
                Calculate Performance
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Display */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-2">
                <h2 className="font-bold">Takeoff Performance</h2>
                <div>Acceleration Checkpoint: {results.accelerationCheckpoint} ft</div>
                <div>Rotation Speed: {results.rotationSpeed} knots</div>
                <div>Takeoff Speed: {results.takeoffSpeed} knots</div>
                <div>Takeoff Distance: {results.takeoffDistance} ft</div>
                <div>Refusal Speed: {results.refusalSpeed} knots</div>

                <h2 className="font-bold mt-4">Landing Performance</h2>
                <div>Normal Landing Speed: {results.normalLandingSpeed} knots</div>
                <div>Stopping Distance (Dry): {results.stoppingDistanceDry} ft</div>
                <div>Stopping Distance (Wet): {results.stoppingDistanceWet} ft</div>
                <div>Heavy Landing Speed: {results.heavyLandingSpeed} knots</div>
                <div>Heavy Landing Stopping Distance (Dry): {results.heavyLandingStoppingDistanceDry} ft</div>
                <div>Heavy Landing Stopping Distance (Wet): {results.heavyLandingStoppingDistanceWet} ft</div>
              </div>
            ) : (
              <p className="text-gray-500">Calculate performance to see results</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default F16PerformanceApp;