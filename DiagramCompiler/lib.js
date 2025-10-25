
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

const equipmenttype_db = {
	'StructureAirlock': {
		name: 'Airlock',
		href: 'https://stationeers-wiki.com/Airlock_(Structure)',
		doorLike: true,
		logicWrite: ['Open','Mode','Lock','Setting','On',],
		logicRead: ['Idle',],
		connections: [{data:1},{power:1},],
	},
	'StructureBlastDoor': {
		name: 'Blast Door',
		href: 'https://stationeers-wiki.com/Blast_Doors',
		doorLike: true,
		logicWrite: ['Open','Mode','Lock','Setting','On',],
		logicRead: ['Idle',],
		connections: [{data:1},{power:1},],
	},
	'StructureCompositeDoor': {
		name: 'Composite Door',
		href: 'https://stationeers-wiki.com/Composite_Door',
		logicWrite: ['Open','Mode','Lock','Setting','On',],
		doorLike: true,
		logicRead: ['Idle',],
		connections: [{data:1},{power:1},],
	},
	'StructureGlassDoor': {
		name: 'Glass Door',
		href: 'https://stationeers-wiki.com/Glass_Door',
		doorLike: true,
		logicWrite: ['Open','Mode','Lock','Setting','On',],
		logicRead: ['Idle',],
		connections: [{data:1},{power:1},],
	},
	'StructureActiveVent': {
		name: 'Active Vent',
		href: 'https://stationeers-wiki.com/Active_Vent',
		logicWrite: ['Mode','Lock','On','PressureExternal','PressureInternal',],
		logicRead: ['Error','PressureOutput','TemperatureOutput','RatioOxygenOutput','RatioNitrogenOutput','RatioPollutantOutput','RatioPollutantOutput','RatioVolatilesOutput','RatioWaterOutput','RatioNitrousOxideOutput','TotalMolesOutput','CombustionOutput'],
		connections: [{data:1,power:1},{gas:1}],
	},
	'StructureWallHeater': {
		name: 'Wall Heater',
		href: 'https://stationeers-wiki.com/Wall_Heater',
		logicWrite: ['Lock','On',],
		connections: [{data:1,power:1},],
	},
	'StructureLogicButton': {
		name: 'Button',
		logicRead: ['Setting'],
		connections: [{data:1,power:1},],
	},
	'ModularDeviceLight': {
		name: 'Modular Light Diode',
		logicWrite: ['On','Color'],
		connections: [{data:1,power:1}],
	},
	'StructureConsoleLED': {
		name: 'LED Display (various)',
		ledLike: true,
		logicWrite: ['On','Mode','Setting','Color'],
		logicRead: ['Error'],
		connections: [{data:1,power:1}],
	},
	'StructureCircuitHousing': {
		name: 'IC Housing',
		href: 'https://stationeers-wiki.com/IC_Housing',
		logicWrite: ['On','Mode','Setting','LineNumber',],
		logicRead: ['Error','StackSize'],
		logicSlots: [
			['LineNumber',], // IC10
		],
		connections: [{data:1},{power:1}],
	},
	'StructureGasSensor': {
		name: 'Gas Sensor',
		href: 'https://stationeers-wiki.com/Sensors',
		logicRead: [
			'Pressure','Temperature','TotalMoles','Combustion',
			'RatioOxygen','RatioCarbonDioxide','RatioNitrogen','RatioPollutant','RatioVolatiles','RatioWater','RatioNitrousOxide',
			'RatioLiquidNitrogen','RatioLiquidOxygen','RatioLiquidVolatiles','RatioSteam','RatioLiquidCarbonDioxide','RatioLiquidPollutant','RatioLiquidNitrousOxide',
		],
		connections: [{data:1,power:1}],
	},
	'StructureFiltration': {
		name: 'Filtration Unit',
		href: 'https://stationeers-wiki.com/Filtration',
		logicWrite: ['On','Mode','Lock','Setting'],
		logicRead: [
			'Pressure','Temperature','TotalMoles','Combustion',
			'RatioOxygen','RatioCarbonDioxide','RatioNitrogen','RatioPollutant','RatioVolatiles','RatioWater','RatioNitrousOxide',
			'RatioLiquidNitrogen','RatioLiquidOxygen','RatioLiquidVolatiles','RatioSteam','RatioLiquidCarbonDioxide','RatioLiquidPollutant','RatioLiquidNitrousOxide',
		].flatMap(L=>['Input'+L,'Output'+L,'Output2'+L]),
		logicSlots: [
			['FilterType',], // Filter A
			['FilterType',], // Filter B
			[], // IC10
		],
		connections: [{data:1},{power:1},{gas:'Input'},{gas:'Filtered'},{gas:'Unfiltered'}],
	}
};

// Function Definition
const functiondef_db = {
	"IR": {
		name: 'Input Router',
		info: 'Reads device logic values for processing.',
		rels: [
			{name: 'Source', type: 'equipment', subtype: 'logic', },
			{name: 'Destination', type: 'data', allocate: true, },
		],
		properties: [
			{name: 'R0', type: 'register', allocate: true, hidden: true, scope: 'instance', },
		],
		validate(report, workspace) {
			// Nothing to check. All configuration is required, and that's pre-validated.
		},
		blocks: [
			{
				scope: 'instance',
				code: [
					'l %R0% %Source.ReferenceId% %Source.Logic%',
					'put %Destination.RAM% %Destination.Addr% %R0%',
				],
			},
		],
	},

	"XR": {
		name: 'Interrupt Router',
		info: 'Reads device `Setting` values for processing, at a high priority.',
		rels: [
			{name: 'Source', type: 'equipment', subtype: null, },
			{name: 'Destination', type: 'data', allocate: true, },
		],
		properties: [
			{name: 'Signal', type: 'constant', subtype: 'number', },
			{name: 'R0', type: 'register', allocate: true, hidden: true, scope: 'instance', },
		],
		validate(report, workspace) {
			// Nothing to check. All configuration is required, and that's pre-validated.
		},
		blocks: [
			{
				scope: 'instance',
				code: [
					'l %R0% %Source% Setting',
					'breqz %R0% 2',
					'put %Destination.RAM% %Destination.Addr% %Signal%',
				],
			},
		],
	},

	"OR": {
		name: 'Output Router',
		info: 'Writes processing and I/O results to device\'s control logic.',
		rels: [
			{name: 'Source', type: 'data' },
			{name: 'Destination', array:true, type: 'equipment', subtype: 'logic', write:true, },
		],
		properties: [
			{name: 'R0', type: 'register', allocate: true, hidden: true, scope: 'instance', },
		],
		validate(report, workspace) {
			// Nothing to check. All configuration is required, and that's pre-validated.
		},
		blocks: [
			{
				scope: 'instance',
				code: [
					'get %R0% %Source.RAM% %Source.Addr%',
				],
			},
			{
				scope: 'array', target: 'Destination',
				code: [
					's %Destination.ReferenceId% %Destination.Logic% %R0%',
				]
			}
		]
	},

	"EI": {
		name: 'Equipment Initialization',
		info: 'Writes constant values to device\'s control logic, but just once each time the controllers are reset.',
		notAddable: true,
		rels: [
			{name: 'Destination', type: 'equipment', subtype: 'logic'},
		],
		properties: [
			{name: 'Value', type: 'constant', subtype: 'number',},
		],
		blocks: [
			{
				scope: 'zone-init',
				code: [
					's %Destination.ReferenceId% %Destination.Logic% %Value%'
				],
			}
		]
	},

	"AT": {
		name: 'Alarm Test',
		info: 'Tests a value for some condition, and stores that boolean result.',
		rels: [
			{name: 'Input', type: 'function', functiontype:['IR','SR'], },
			{name: 'Destination', type: 'data', allocate: true, },
		],
		properties: [
			{name: 'Threshold', type: 'constant', subtype: 'number'},
			{name: 'Test', type: 'constant', subtype: 'list', options: [
				{name: "sgt", label: "Input > Threshold"},
				{name: "sge", label: "Input >= Threshold"},
				{name: "sle", label: "Input <= Threshold"},
				{name: "slt", label: "Input < Threshold"},
			]},
			{name: 'R1', type: 'register', allocate: true, hidden: true, scope: 'instance', },
		],
		validate(report, workspace) {
			// Check the specific type of the input function.
			if( -1 === ['IR','SR'].indexOf(workspace.ReadRelation(this, 'Input')?.kind) )
				report('error', 'Alarm Test function depends on an Input or Slot Input function');
		},
		blocks: [
			{
				scope: 'instance',
				group: 'load',
				constraints: [{kind: 'different-processor', target: 'Input'}],
				code: [
					'get %R1% %Input.Destination.RAM% %Input.Destination.Addr%',
					'%Test% %R1% %R1% %Threshold%'
				]
			},
			{
				scope: 'instance',
				group: 'load',
				constraints: [{kind: 'immediately-after', target: 'Input'}],
				code: [
					'%Test% %R1% %Input.R0% %Threshold%'
				]
			},
			{
				scope: 'instance',
				code: [
					'put %Destination.RAM% %Destination.Addr% %R1%',
				]
			}
		]
	},

	"AS": {
		name: 'Alarm State',
		info: 'Manages an acknowledgeable alarm status based on a test result.',
		rels: [
			{name: 'Input', type: 'function', functiontype: ['AT']},
			{name: 'State', type: 'data', allocate: true, },
			{name: 'AckSignal', type: 'data', allocate: true, },
		],
		properties: [
			{name: 'RAck', type: 'register', allocate: true, hidden: true, scope: 'processor', },
			{name: 'R2', type: 'register', allocate: true, hidden: true, scope: 'instance', },
			{name: 'R3', type: 'register', allocate: true, hidden: true, scope: 'instance', },
			{name: 'AckOn', type: 'buffer', hidden:true, value: [0,0,0,1,2,2], scope: 'zone'},
			{name: 'AckNo', type: 'buffer', hidden:true, value: [0,1,0,1,1,2], scope: 'zone'},
		],
		validate(report, workspace) {
			//TODO: validate that all `AS` nodes assigned to the same processor use the same AckSignal,
			//TODO: and that no two processors have `AS` nodes which use the same AckSignal
		},
		blocks: [
			{
				scope: 'cycle-init',
				code: [
					// Read the ack signal, clear it if seen, and select appropriate transition table.
					'get %RAck% %AckSignal.RAM% %AckSignal.Addr%',
					'put %AckSignal.RAM% %AckSignal.Addr% 0',
					'select %RAck% %RAck% %B.AckOn% %B.AckNo%',
				],
			},
			{
				scope: 'instance',
				group: 'load',
				constraints: [{kind: 'immediately-after', target: 'Input'}],
				code: [
					// Select subtable based on alarm test value
					'select %R3% %Input.R1% 3 0',
				]
			},
			{
				scope: 'instance',
				group: 'load',
				constraints: [{kind: 'different-processor', target: 'Input'}],
				code: [
					// Select subtable based on alarm test value
					'get %R3% %Input.Destination.RAM% %Input.Destination.Addr%',
					'select %R3% %R3% 3 0',
				]
			},
			{
				scope: 'instance',
				code: [
					// Compute final transition table offset based on state, read it, and update state.
					'get %R2% %State.RAM% %State.Addr%',
					'add %R2% %R2% %R3%',
					'add %R2% %R2% %RAck%',
					'get %R2% %B.RAM% %R2%',
					'put %State.RAM% %State.Addr% %R2%',
				]
			}
		]
	},

	"AA": {
		name: 'Alarm Annunciator',
		info: 'Turns alarm-indication equipment on or off based on an alarm status.',
		rels: [
			{name: 'Input', type: 'function', functiontype: ['AS'], },
			{name: 'Display', type: 'equipment',  },
		],
		requiredPriority: 1,
		properties: [
			{name: 'r0', type: 'register', scope: 'processor', value: 0, hidden: true, },
			{name: 'r1', type: 'register', scope: 'processor', value: 1, hidden: true, },
			{name: 'r2', type: 'register', scope: 'processor', value: 2, hidden: true, },
			{name: 'RX', type: 'register', scope: 'instance', allocate: true, hidden: true, },
		],
		validate(report, workspace) {
			// Check the logic support of the selected device.
			const target = workspace.ReadRelation(this, 'Display');
			if( !target || !equipmenttype_db[target.kind]?.Pins(target).find(p => p.name === 'On' && p.type === 'logic') )
				report('error', 'selected Display does not support "On" logic');
		},
		blocks: [
			{
				scope: 'processor-init',
				code: [
					'move r0 0',
					'move r2 1',
				],
			},
			{
				scope: 'cycle-init',
				code: [
					'select r1 0 1',
				]
			},
			{
				scope: 'instance',
				group: 'output',
				constraints: [{kind: 'different-processor', target: 'Input'}],
				code: [
					'get %RX% %Input.State.RAM% %Input.State.Addr%',
					's %Display% On r%RX%',
				]
			},
			{
				scope: 'instance',
				group: 'output',
				constraints: [{kind: 'immediately-after', target: 'Input'}],
				code: [
					's %Display% On r%Input.R2%',
				]
			}
		]
	},

	"ST": {
		// Implements a schmitt trigger with an active-high Set ("raise"), and an active-low Reset ("hold").
		// e.g. if you have Set as Temp > 30 and Hold as Temp > 20, and the trigger controls a cooling system,
		// then it turns on when the temp goes above 30 and off when the temp falls to 20.
		name: 'Schmitt Trigger',
		info: 'Implements a Set-Hold Schmitt trigger, activating an output when a Set signal becomes true, and deactivating it when the Hold signal becomes false.',
		rels: [
			{name: 'State', type: 'data', allocate: true, },
			{name: 'Raise', type: 'data',},
			{name: 'Hold', type: 'data',},
		],
		properties: [
			{name: 'R0', type: 'register', scope: 'instance', allocate: true, hidden: true, },
			{name: 'R1', type: 'register', scope: 'instance', allocate: true, hidden: true, },
		],
		validate(report, workspace) {

		},
		blocks: [
			{
				scope: 'zone-init',
				code: [
					'put %State.RAM% %State.Addr% 0',
				],
			},
			{
				scope: 'instance',
				code: [
					'get %R0% %State.RAM% %State.Addr%',
					'get %R1% %Raise.RAM% %Raise.Addr%',
					'breqz %R0% 2',
					'get %R1% %Hold.RAM% %Hold.Addr%',
					'select %R0% %R1% 1 0',
					'put %State.RAM% %State.Addr% %R0%',
				],
			}
		],
	},

	"IL": {
		name: "Interlock",
		info: 'Continuously copies a source value to an output value, except when at least one listed barrier condition is true.',
		rels: [
			{name: 'Source', type: 'data',},
			{name: 'Output', type: 'data', allocate: true, },
			{name: 'Barrier', type: 'data', array: true, },
		],
		properties: [
			{name: 'R0', type: 'register', scope: 'instance', allocate: true, hidden: true, },
			{name: 'R1', type: 'register', scope: 'instance', allocate: true, hidden: true, },
		],
		validate(report,workspace) {

		},
		blocks: [
			{
				scope: 'instance',
				constraints: [{type: 'array-plural', target: 'Barrier'}],
				code: [
					'move %R0% 0',
				],
			},
			{
				scope: 'array',
				target: 'Barrier',
				constraints: [{type: 'array-plural', target: 'Barrier'}],
				code: [
					'get %R1% %Barrier.RAM% %Barrier.Addr%',
					'or %R0% %R0% %R1%',
				],
			},
			{
				scope: 'instance',
				constraints: [{type: 'array-plural', target: 'Barrier'}],
				code: [
					'brnez %R0% 3',
					'get %R0% %Source.RAM% %Source.Addr%',
					'put %Output.RAM% %Output.Addr% %R0%',
				],
			},
			{
				scope: 'array',
				target: 'Barrier',
				constraints: [{type: 'array-singular', target: 'Barrier'}],
				code: [
					'get %R1% %Barrier.RAM% %Barrier.Addr%',
					'brnez %R0% 3',
					'get %R0% %Source.RAM% %Source.Addr%',
					'put %Output.RAM% %Output.Addr% %R0%',
				]
			}
		]
	},
}

const OnFieldSpec = {type:'constant', subtype:'boolean',};

const LockFieldSpec = {type:'constant', subtype:'boolean',};

const ColorFieldSpec = {type:'constant', subtype:'list', options:[
	{name: 0, label: 'Blue'},   {name: 1, label: 'Gray'},   {name: 2, label: 'Green'},
	{name: 3, label: 'Orange'}, {name: 4, label: 'Red'},    {name: 5, label: 'Yellow'},
	{name: 6, label: 'White'},  {name: 7, label: 'Black'},  {name: 8, label: 'Brown'},
	{name: 9, label: 'Khako'},  {name: 10, label: 'Pink'},  {name: 11, label: 'Purple'},
]};

const LEDModeFieldSpec = {type:'constant', subtype:'list', options:[
	{name: 0, label: 'Normal'},
	{name: 1, label: 'Percentage'},
	{name: 2, label: 'Power'},
	{name: 3, label: 'Kelvin'},
	{name: 4, label: 'Celcius'},
	{name: 11, label: 'Fahrenheit'},
	{name: 5, label: 'Meters'},
	{name: 6, label: 'Credits'},
	{name: 7, label: 'Seconds'},
	{name: 8, label: 'Minutes'},
	{name: 9, label: 'Days'},
	{name: 10, label: 'String'},
	{name: 12, label: 'Litres'},
	{name: 13, label: 'Mol'},
	{name: 14, label: 'Pascals'},
]};

const OpenFieldSpec = {type: 'constant', subtype: 'list', options: [
	{name: 0, label: 'Closed'},
	{name: 1, label: 'Open'},
]};

const ActiveVentModeFieldSpec = {type: 'constant', subtype: 'list', options: [
	{name: 0, label: 'Outward / Blow'},
	{name: 1, label: 'Inward / Suck'},
]};

const DoorModeFieldSpec = {type:'constant', subtype:'list', options: [
	{name: 0, label: 'Local Operation'},
	{name: 1, label: 'Remote Operation'},
]};

function ValuesForEquipmentInitialize(object, key) {
	if( key === 'On' ) {
		return OnFieldSpec;

	} else if( key === 'Color' ) {
		return ColorFieldSpec;

	} else if( key === 'Lock' ) {
		return LockFieldSpec;

	} else if( key === 'Open' ) {
		return OpenFieldSpec;

	} else if( key === 'Mode' && object.doorLike === true ) {
		return DoorModeFieldSpec;

	} else if( key === 'Mode' && object.ledLike === true ) {
		return LEDModeFieldSpec;

	} else if( key === 'Mode' && object === equipmenttype_db.StructureActiveVent ) {
		return ActiveVentModeFieldSpec;

	} else {
		return {type:'constant', subtype:'number'};
	}
}

const StdLogic = ['Power','RequiredPower','ReferenceId','PrefabHash','NameHash'];
const StdSlotLogic = ['Occupied','OccupantHash','Quantity','MaxQuantity','Damage','ReferenceId','PrefabHash','NameHash'];

// Metanode Definitions
const metanode_db = {
	'function': {
		// Generate info block for properties pane
		Info(obj) {
			const def = functiondef_db[obj.kind];
			return $("div", "="+def.name, [
				def.info && ["p", "="+def.info],
			]);
		},

		// Title for navigation item or functional node
		Name(obj) {
			const def = functiondef_db[obj.kind];
			return `[${obj.kind}] ${obj.properties.Name ?? obj.id}`;
		},

		// Generate list of {name:,array:,type:,subtype?:} pins this node exposes for Relations.
		Pins(obj) {
			const def = functiondef_db[obj.kind];
			if( ! def ) return [];
			if( def._cache_pins === undefined ) {
				// Generate and cache pins
				const res = [{name: 'Zone', type: 'zone'}, {name: 'Processor', type: 'equipment', equipmenttype: ['StructureCircuitHousing'],}];
				def.rels?.forEach(rel => res.push(rel));
				def._cache_pins = res;
			}
			return def._cache_pins;
		},

		// Generate list of {name:,category?:,type:,hidden:} property definitions this node exposes to property editor.
		Fields(obj) {
			const def = functiondef_db[obj.kind];
			if( !def ) return [];
			return [
				{name:'Name', type:'constant', subtype:'string'},
				{name:'HideUnused', type:'constant', subtype:'boolean'},
				...def.properties ?? [],
			];
		},

		// Return renderer class for Schematic view of this metanode.
		Diagram(obj) {
		},

		Addable() {
			return Object.keys(functiondef_db).map(key => {
				const def = functiondef_db[key];
				if( def.notAddable ) return null;
				return {
					group: 'Functional',
					priority: 2,
					label: def.name,
					ctor: id => ({type: 'function', kind: key, properties:{Name: id},}),
				}
			}).filter(x => x);
		},
	},

	'data': {
		Info(obj) {},

		Name(obj) {
			return obj.properties?.name
				?? (obj.properties.addr && obj.properties.node && `[RAM] ${obj.properties.node}:\$${obj.properties.addr.toString(16)}`)
				?? `[RAM] Unallocated ${obj.id}`;
		},

		Pins(obj) {
			return [{name:'Zone', type:'zone'}];
		},

		Fields(obj) {

		},

		// Return renderer class for Schematic view of this metanode.
		Diagram(obj) {

		},

		Addable() {
			return [{
				group: 'Functional',
				priority: 2,
				label: `Data Allocation`,
				ctor: id => ({type: 'data', properties:{},}),
			}];
		},
	},

	'equipment': {
		// Generate info block for properties pane
		Info(obj) {
			const def = equipmenttype_db[obj.kind];
			var lb = $("span", "="+(def.name ?? obj.kind));
			if( def.href) lb = $("a", {href:def.href, target:"_blank", noreferrer:true}, [lb]);
			//TODO: icon
			return lb;
		},

		Name(obj) {
			const def = equipmenttype_db[obj.kind];
			return (obj.properties?.Name ?? def.name) + (obj.properties?.ReferenceId ? ` (#${obj.properties.ReferenceId})` : '');
		},
		
		Pins(obj) {
			const def = equipmenttype_db[obj.kind];
			if( ! def ) {
				console.warn(`Unknown Equipment type "${obj.kind}", plz add`);
				equipmenttype_db[obj.kind] = {pins:[]};
				return [];
			}
			if( def._cache_pins === undefined ) {
				// Generate and cache pins by equipment type.
				const res = [{name:'Zone', type:'zone'}];

				def.logicWrite?.forEach(L => res.push({name:L, passive:true, type:'logic', writable:true,}));

				if( def.logicRead ) {
					const AddRO = L => res.push({name:L, passive:true, type:'logic', writable:false,});
					def.logicRead.forEach(AddRO);
					StdLogic.forEach(AddRO);
				}

				def.logicSlots?.forEach((S,si) => {
					const addSlot = L => res.push({logic:L, slot:si, name:`Slot #${si} ${L}`, passive:true, type:'logic', writable:false});
					S.forEach(addSlot);
					StdSlotLogic.forEach(addSlot);
				});

				def._cache_pins = res;
			}
			return def._cache_pins;
		},

		Fields(obj) {
			const def = equipmenttype_db[obj.kind];
			const res = [
				{name:'Name', type:'constant', subtype:'string'},
				{name:'HideUnused', type:'constant', subtype:'boolean'},
				{name:'ReferenceId', type:'constant', subtype:'number'},
			];

			if( def.logicWrite?.length ) {
				res.push({name:'Initialize', type:'map', keys: def.logicWrite, values: ValuesForEquipmentInitialize});
			}

			return res;
		},

		// Return renderer class for Schematic view of this metanode.
		Diagram(obj) {

		},

		Addable() {
			return Object.keys(equipmenttype_db).map(key => ({
				group: 'Equipment',
				priority: 1,
				label: equipmenttype_db[key].name,
				ctor: id => ({type: 'equipment', kind: key, properties:{Name: `${equipmenttype_db[key].name} ${id}`,}}),
			}));
		},
	},

	//TODO:
	'metafunction': {
		Info(obj) {},
		Name(obj) { 
			return obj.properties?.Name ?? `Metafunction ${obj.id}`;
		},
		Pins(obj) { },
		Fields(obj) { },
		Diagram(obj) { },

		Addable() {
			return []; /*Object.keys(equipmenttype_db).map(key => ({
				group: 'Equipment',
				priority: 1,
				label: equipmenttype_db[key].name,
				ctor: id => ({type: 'equipment', kind: key, properties:{Name: `${equipmenttype_db[key].name} ${id}`,}}),
			}));*/
		},
	},

	//TODO:
	'zone': {
		Info(obj) {},
		Name(obj) {
			return obj.properties?.Name ?? `Zone ${obj.id}`;
		},
		Pins(obj) { return []; },
		Fields(obj) {
			return [
				{name:'Name', type: 'constant', subtype:'string'},
			];
		},
		Diagram(obj) {},

		Addable() {
			return [{
				group: 'Organizational',
				priority: 0,
				label: 'Zone',
				ctor: id => ({type: 'zone', properties:{}}),
			}];
		},
	},

	//TODO:
	'network': {
		Info(obj) {},
		Name(obj) {
			return obj.properties?.Name ?? `Network ${obj.id}`;
		},
		Pins(obj) { return []; },
		Fields(obj) { },
		Diagram(obj) { },

		Addable() {
			return [{
				group: 'Organizational',
				priority: 0,
				label: 'Network',
				ctor: id => ({type: 'network', properties:{}}),
			}];
		},
	},

	//TODO:
	'drawing': {
		Info(obj) {},
		Name(obj) {
			return obj.properties?.Name ?? `Drawing ${obj.id}`;
		},
		Pins(obj) { return []; },
		Fields(obj) {
			return [
				{name:'Name', type:'constant', subtype:'string'},
			];
		},

		// Return renderer class for Schematic view of this metanode.
		Diagram(obj) {
			//TODO: render an off-page link
		},

		Addable() {
			return [{
				group: 'Organizational',
				priority: 0,
				label: 'Drawing',
				ctor: id => ({type: 'drawing', properties:{}}),
			}];
		},
	},
};

class GraphLayer {
	constructor(parent, ro) {
		this.parent = parent || null;
		this.ro = !!ro;
		this.Objs = {};
		this.Rels = {};
	}

	NewId() {
		var id;
		do {
			id = (Math.random() * 9999999).toString(36);
		} while( this.FindObject(id) );
		return id;
	}

	Objects(filter, intoResult) {
		intoResult = intoResult ?? [];
		if( this.parent ) this.parent.Objects(filter, intoResult);
		if( 'function' === typeof filter ) {
			Object.values(this.Objs).filter(filter).forEach(o => intoResult.push(o));
		} else {
			Object.values(this.Objs).forEach(o => intoResult.push(o));
		}
		return intoResult;
	}

	FindObject(objId) {
		return this.Objs[objId] ?? this.parent?.FindObject(objId) ?? undefined;
	}

	// List all relation objects related to a given node object.
	FindRelations(objId, intoResult) {
		intoResult = intoResult ?? [];
		if( this.parent ) this.parent.FindRelations(objId, intoResult);
		this.Rels[objId]?.forEach(r => intoResult.push(r));
		return intoResult;
	}

	// List ONLY relations FROM a given node, and optionally only those of a specific pin.
	// More efficient than calling FindRelations() and filtering it yourself.
	RelationsOf(objId, pinName, intoResult) {
		intoResult = intoResult ?? [];
		if( this.parent ) this.parent.RelationsOf(objId, pinName, intoResult);
		this.Rels[objId]?.forEach(r => {
			if( r.fromNode === objId && (pinName === undefined || pinName === r.fromPin) )
				intoResult.push(r);
		});
		return intoResult;
	}

	// Read the node at the OTHER END of a specific non-array relationship pin.
	ReadRelation(objId, pinName) {
		if( !objId || !pinName || !this.FindObject(objId) ) return undefined;
		const rel = this.RelationsOf(objId, pinName).find(r => r.index === undefined);
		return rel && this.FindObject(rel.toNode);
	}

	Deserialize(str) {
		if( this.parent || this.ro )
			throw new Error("cannot deserialize into non-root graph layer");

		this.Objs = {};
		this.Rels = {};
		const raw = JSON.parse(str);
		if( !(raw instanceof Array) )
			throw new Error("expected deserialized graph data to be an array");
		raw.forEach(e => { if( e.type !== 'rel' ) this.AddObject(e); });
		raw.forEach(e => { if( e.type === 'rel' ) this.AddRel(e);    });
	}

	Serialize() {
		const list = [];
		Object.keys(this.Objs).forEach(k => {
			list.push(this.Objs[k]);
		});
		Object.keys(this.Rels).forEach(k => {
			this.Rels[k].forEach(r => {
				if( r.fromNode === k ) list.push(r);
			});
		});

		return JSON.stringify(list, undefined, 2);
	}

	AddObject(def) {
		if( this.ro )
			throw new Error("cannot add to read-only graph layer");
		if( !def || !def.id || !def.type )
			throw new Error("incomplete object; requires {id:,type:}");
		if( def.type === 'rel' )
			throw new Error("bad object type; must use AddRel for relations, AddObject for objects!");
		if( this.Objs[def.id] )
			throw new Error(`cannot implicitly replace existing object "${def.id}"`);
		if( this.parent?.FindObject(def.id) )
			throw new Error(`cannot shadow existing object "${def.id}"`);

		this.Objs[def.id] = def;
	}

	// Remove an object ONLY if it actually exists in this layer.
	// Note that relations to this object in CHILD LAYERS will not be properly destroyed by this!
	RemoveObject(def) {
		if( this.ro )
			throw new Error("cannot delete from read-only graph layer");
		if( def !== this.Objs[def.id] ) return;
		delete this.Objs[def.id];
		this.Rels[def.id]?.forEach(rel => {
			// Delete this relation from each list it participates in.
			this._unregister_rel(rel, rel.fromNode);
			if( rel.toNode ) this._unregister_rel(rel, rel.toNode);
			if( rel.viaNode ) this._unregister_rel(rel, rel.viaNode);
		});
	}

	AddRel(def) {
		if( this.ro )
			throw new Error("cannot add to read-only graph layer");
		if( !def || !def.fromNode )
			throw new Error("incomplete relation; requires {fromNode:}");		
		if( def.fromIndex !== undefined && ('number' !== typeof def.fromIndex || def.fromIndex < 0 || def.fromIndex !== Math.trunc(def.fromIndex)) )
			throw new Error("illegal index relation number; must be undefined or a non-negative integer");
		if( def.type && def.type !== 'rel' )
			throw new Error("bad object type; must use AddRel for relations, AddObject for objects!");
		def.type = 'rel';

		if( !this.FindObject(def.fromNode)
			|| (def.toNode && !this.FindObject(def.toNode))
			|| (def.viaNode && !this.FindObject(def.viaNode))
		)
			throw new Error("cannot create relation; all referenced objects must exist");

		this._register_rel(def, def.fromNode);
		if( def.toNode ) this._register_rel(def, def.toNode);
		if( def.viaNode ) this._register_rel(def, def.viaNode);
	}

	// Remove a relation ONLY if it actually exists in this layer.
	RemoveRel(def) {
		if( this.ro )
			throw new Error("cannot delete from read-only graph layer");

		this._unregister_rel(def, def.fromNode);

		if( def.toNode )
			this._unregister_rel(def, def.toNode);

		if( def.viaNode )
			this._unregister_rel(def, def.viaNode);
	}

	_register_rel(d, n) {
		const a = this.Rels[n] ?? [];
		if( a.find(r => d.fromNode === r.fromNode && d.fromPin === r.fromPin && d.fromIndex === r.fromIndex))
			throw new Error("cannot create relation; conflicts with an existing relation!");
		this.Rels[n] = a;
		a.push(d);
	}

	_unregister_rel(d, n) {
		const a = this.Rels[n];
		if( ! a ) return;
		const i = a.indexOf(d);
		if( i !== -1 ) a.splice(i, 1);
		if( a.length === 0 ) {
			delete this.Rels[n];
		} else if( d.index !== null ) {
			// Renumber array-pin relations with higher indices.
			this.Rels[n].forEach(r => {
				if( r.fromNode === d.fromNode && r.fromPin === d.fromPin && r.fromIndex !== undefined && r.fromIndex > d.fromIndex )
					r.fromIndex--;
			})
		}
	}
}

class ReportReceiver {
	constructor() {
		this.reports = [];
		this.fatal = false;
		this.category = null;
		this.ordinal = 0;

		this.report = this._report.bind(this);
	}

	setCategory(cat) {
		this.category = cat;
	}

	_report(sev, msg) {
		if( msg === undefined && typeof sev === 'string' ) {
			msg = sev;
			sev = 'info';
		} else if( typeof sev !== 'string' ) {
			throw new Error('illegal arguments to report function');
		}

		this.reports.push({severity:sev, order:++this.ordinal, category:this.category, message:msg});
		if( sev === 'error' ) this.fatal = true;
	}
}

function ObjectValidForPin(obj, pin) {
	if( pin.type === 'logic' && obj.type === 'equipment' ) return true;
	if( pin.type === 'function' && (pin.functiontype === undefined || pin.functiontype.includes(obj.type)) ) return true;
	if( pin.type === 'equipment' && (pin.equipmenttype === undefined || pin.equipmenttype.includes(obj.type)) ) return true;
	if( metanode_db[obj.type]?.Pins(obj)?.find(p => p.type === pin.type && !p.passive) ) return true;
	//TODO: other conditions?
	return pin.type === obj.type;
}

function PinValidForPin(from, to) {
	if( from.type === to.type ) return true;
	//TODO: other conditions?
	return false;
}
