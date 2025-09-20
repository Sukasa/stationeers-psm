
// Must match up with their matching constants. The canonical list has no skips or duplicates.
const LogicTypeNames = [
	"None", "Power", "Open", "Mode", "Error", "Pressure", "Temperature", "PressureExternal",
	"PressureInternal", "Activate", "Lock", "Charge", "Setting", "Reagents", "RatioOxygen",
	"RatioCarbonDioxide", "RatioNitrogen", "RatioPollutant", "RatioVolatiles", "RatioWater",
	"Horizontal", "Vertical", "SolarAngle", "Maximum", "Ratio", "PowerPotential",
	"PowerActual", "Quantity", "On", "ImportQuantity", "ImportSlotOccupant", "ExportQuantity",
	"ExportSlotOccupant", "RequiredPower", "HorizontalRatio", "VerticalRatio", "PowerRequired",
	"Idle", "Color", "ElevatorSpeed", "ElevatorLevel", "RecipeHash", "ExportSlotHash",
	"ImportSlotHash", "PlantHealth1", "PlantHealth2", "PlantHealth3", "PlantHealth4",
	"PlantGrowth1", "PlantGrowth2", "PlantGrowth3", "PlantGrowth4", "PlantEfficiency1",
	"PlantEfficiency2", "PlantEfficiency3", "PlantEfficiency4", "PlantHash1", "PlantHash2",
	"PlantHash3", "PlantHash4", "RequestHash", "CompletionRatio", "ClearMemory", "ExportCount",
	"ImportCount", "PowerGeneration", "TotalMoles", "Volume", "Plant", "Harvest", "Output",
	"PressureSetting", "TemperatureSetting", "TemperatureExternal", "Filtration", "AirRelease",
	"PositionX", "PositionY", "PositionZ", "VelocityMagnitude", "VelocityRelativeX",
	"VelocityRelativeY", "VelocityRelativeZ", "RatioNitrousOxide", "PrefabHash", "ForceWrite",
	"SignalStrength", "SignalID", "TargetX", "TargetY", "TargetZ", "SettingInput",
	"SettingOutput", "CurrentResearchPodType", "ManualResearchRequiredPod",
	"MineablesInVicinity", "MineablesInQueue", "NextWeatherEventTime", "Combustion", "Fuel",
	"ReturnFuelCost", "CollectableGoods", "Time", "Bpm", "EnvironmentEfficiency",
	"WorkingGasEfficiency", "PressureInput", "TemperatureInput", "RatioOxygenInput",
	"RatioCarbonDioxideInput", "RatioNitrogenInput", "RatioPollutantInput",
	"RatioVolatilesInput", "RatioWaterInput", "RatioNitrousOxideInput", "TotalMolesInput",
	"PressureInput2", "TemperatureInput2", "RatioOxygenInput2", "RatioCarbonDioxideInput2",
	"RatioNitrogenInput2", "RatioPollutantInput2", "RatioVolatilesInput2", "RatioWaterInput2",
	"RatioNitrousOxideInput2", "TotalMolesInput2", "PressureOutput", "TemperatureOutput",
	"RatioOxygenOutput", "RatioCarbonDioxideOutput", "RatioNitrogenOutput",
	"RatioPollutantOutput", "RatioVolatilesOutput", "RatioWaterOutput",
	"RatioNitrousOxideOutput", "TotalMolesOutput", "PressureOutput2", "TemperatureOutput2",
	"RatioOxygenOutput2", "RatioCarbonDioxideOutput2", "RatioNitrogenOutput2",
	"RatioPollutantOutput2", "RatioVolatilesOutput2", "RatioWaterOutput2",
	"RatioNitrousOxideOutput2", "TotalMolesOutput2", "CombustionInput", "CombustionInput2",
	"CombustionOutput", "CombustionOutput2", "OperationalTemperatureEfficiency",
	"TemperatureDifferentialEfficiency", "PressureEfficiency", "CombustionLimiter", "Throttle",
	"Rpm", "Stress", "InterrogationProgress", "TargetPadIndex", "SizeX", "SizeY", "SizeZ",
	"MinimumWattsToContact", "WattsReachingContact", "Channel0", "Channel1", "Channel2",
	"Channel3", "Channel4", "Channel5", "Channel6", "Channel7", "LineNumber", "Flush",
	"SoundAlert", "SolarIrradiance", "RatioLiquidNitrogen", "RatioLiquidNitrogenInput",
	"RatioLiquidNitrogenInput2", "RatioLiquidNitrogenOutput", "RatioLiquidNitrogenOutput2",
	"VolumeOfLiquid", "RatioLiquidOxygen", "RatioLiquidOxygenInput", "RatioLiquidOxygenInput2",
	"RatioLiquidOxygenOutput", "RatioLiquidOxygenOutput2", "RatioLiquidVolatiles",
	"RatioLiquidVolatilesInput", "RatioLiquidVolatilesInput2", "RatioLiquidVolatilesOutput",
	"RatioLiquidVolatilesOutput2", "RatioSteam", "RatioSteamInput", "RatioSteamInput2",
	"RatioSteamOutput", "RatioSteamOutput2", "ContactTypeId", "RatioLiquidCarbonDioxide",
	"RatioLiquidCarbonDioxideInput", "RatioLiquidCarbonDioxideInput2",
	"RatioLiquidCarbonDioxideOutput", "RatioLiquidCarbonDioxideOutput2",
	"RatioLiquidPollutant", "RatioLiquidPollutantInput", "RatioLiquidPollutantInput2",
	"RatioLiquidPollutantOutput", "RatioLiquidPollutantOutput2", "RatioLiquidNitrousOxide",
	"RatioLiquidNitrousOxideInput", "RatioLiquidNitrousOxideInput2",
	"RatioLiquidNitrousOxideOutput", "RatioLiquidNitrousOxideOutput2", "Progress",
	"DestinationCode", "Acceleration", "ReferenceId", "AutoShutOff", "Mass", "DryMass",
	"Thrust", "Weight", "ThrustToWeight", "TimeToDestination", "BurnTimeRemaining", "AutoLand",
	"ForwardX", "ForwardY", "ForwardZ", "Orientation", "VelocityX", "VelocityY", "VelocityZ",
	"PassedMoles", "ExhaustVelocity", "FlightControlRule", "ReEntryAltitude", "Apex",
	"EntityState", "DrillCondition", "Index", "CelestialHash", "AlignmentError", "DistanceAu",
	"OrbitPeriod", "Inclination", "Eccentricity", "SemiMajorAxis", "DistanceKm",
	"CelestialParentHash", "TrueAnomaly", "RatioHydrogen", "RatioLiquidHydrogen",
	"RatioPollutedWater", "Discover", "Chart", "Survey", "NavPoints", "ChartedNavPoints",
	"Sites", "CurrentCode", "Density", "Richness", "Size", "TotalQuantity", "MinedQuantity",
	"BestContactFilter", "NameHash",
];


function $() {
	var carried = null;
	for (var i = 0; i < arguments.length; ++i) {
		const a = arguments[i];
		if (typeof a === 'string') {
			if (a[0] === '#') {
				// Find a specific named element in the document.
				carried = document.getElementById(a.slice(1));
			} else if (a[0] === '=') {
				if (!(carried instanceof HTMLElement))
					throw new Error("can only set text content of HTML elements");
				carried.append(document.createTextNode(a.slice(1)));
			} else {
				// Create a new element in the document.
				const n = document.createElement(a);
				if (carried instanceof HTMLElement) carried.appendChild(n);
				carried = n;
			}

		} else if (a instanceof Array) {
			if (typeof carried !== 'object')
				throw new Error("array spread can only be meaningfully applied to an object");
			if (i < arguments.length - 1)
				throw new Error("array spread must be last `$` argument if present");
			a.forEach(i => {
				if (i === undefined || i === null || i === true || i === false) {
					// Ignore safely.
				} else if (i instanceof HTMLElement) {
					// Add this element, keep the same target for later elements.
					carried.appendChild(i);
				} else if (i instanceof Array) {
					// Recurse the $ script with the current target and the contents of this array.
					$(carried, ...i);
				} else {
					throw new Error("array spread must have only HTML elements or arrays of `$` expressions");
				}
			});
			return carried;

		} else if (typeof a === 'object') {
			if (carried === null) {
				// Make this object the new target.
				carried = a;
			} else if (a instanceof HTMLElement) {
				// Add an HTML element, then use it as the new target.
				carried.appendChild(a);
				carried = a;
			} else if (a) {
				// Set properties or add listeners.
				Object.keys(a).forEach(k => k[0] === '?'
					? carried.addEventListener(k.slice(1), a[k])
					: carried instanceof HTMLElement && carried[k] === undefined
						? carried.setAttribute(k, a[k])
						: carried[k] = a[k]);
			}

		} else if (a === undefined || a === null || a === true || a === false) {
			// Ignore safely.

		} else {
			throw new Error("couldn't understand intent behind `$` argument #" + i);
		}
	}
	return carried;
}


