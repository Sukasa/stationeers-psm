
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
		logicWrite: ['Open','Mode','Lock','Setting','On',],
		logicRead: ['Idle',],
		connections: [{data:1},{power:1},],
	},
	'StructureWallHeater': {
		name: 'Wall Heater',
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
		logicWrite: ['On','Mode','Setting','Color'],
		logicRead: ['Error'],
		connections: [{data:1,power:1}],
	},
	'StructureCircuitHousing': {
		name: 'IC Housing',
		logicWrite: ['On','Mode','Setting','LineNumber',],
		logicRead: ['Error','StackSize'],
		logicSlots: [
			['LineNumber',],
		],
		connections: [{data:1},{power:1}],
	},
	'StructureGasSensor': {
		name: 'Gas Sensor',
		logicRead: [
			'Pressure','Temperature','TotalMoles','Combustion',
			'RatioOxygen','RatioCarbonDioxide','RatioNitrogen','RatioPollutant','RatioVolatiles','RatioWater','RatioNitrousOxide',
			'RatioLiquidNitrogen','RatioLiquidOxygen','RatioLiquidVolatiles','RatioSteam','RatioLiquidCarbonDioxide','RatioLiquidPollutant','RatioLiquidNitrousOxide',
		],
		connections: [{data:1,power:1}],
	},
	'StructureFiltration': {
		name: 'Filtration Unit',
		logicWrite: ['On','Mode','Lock','Setting'],
		logicRead: [
			'Pressure','Temperature','TotalMoles','Combustion',
			'RatioOxygen','RatioCarbonDioxide','RatioNitrogen','RatioPollutant','RatioVolatiles','RatioWater','RatioNitrousOxide',
			'RatioLiquidNitrogen','RatioLiquidOxygen','RatioLiquidVolatiles','RatioSteam','RatioLiquidCarbonDioxide','RatioLiquidPollutant','RatioLiquidNitrousOxide',
		].flatMap(L=>['Input'+L,'Output'+L,'Output2'+L]),
		logicSlots: [
			['FilterType',],
			['FilterType',],
			[],
		],
		connections: [{data:1},{power:1},{gas:'Input'},{gas:'Filtered'},{gas:'Unfiltered'}],
	}
};

// Function Definition
const functiondef_db = {
	"IR": {
		fullname: 'Input Router',
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
		fullname: 'Interrupt Router',
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
		fullname: 'Output Router',
		rels: [
			{name: 'Source', type: 'data' },
			{name: 'Destination', array:true, type: 'equipment', subtype: 'logic', },
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
		fullname: 'Equipment Initialization',
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
		fullname: 'Alarm Test',
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
		fullname: 'Alarm State',
		rels: [
			{name: 'Input', type: 'function', functiontype: ['AT']},
			{name: 'State', type: 'data', allocate: true, },
			{name: 'AckSignal', type: 'data', allocate: true, },
		],
		properties: [
			{name: 'RAck', type: 'register', allocate: true, hidden: true, scope: 'processor', },
			{name: 'R2', type: 'register', allocate: true, hidden: true, scope: 'instance', },
			{name: 'R3', type: 'register', allocate: true, hidden: true, scope: 'instance', },
			{name: 'AckOn', type: 'buffer', value: [0,0,0,1,2,2], scope: 'zone'},
			{name: 'AckNo', type: 'buffer', value: [0,1,0,1,1,2], scope: 'zone'},
		],
		validate(report, workspace) {
			// Check the specific type of the input function.
			if( 'AT' !== workspace.ReadRelation(this.id, 'Input')?.kind )
				report('alarm', 'Alarm State function depends on an Alarm Test function');
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
		fullname: 'Alarm Annunciator',
		rels: [
			{name: 'Input', type: 'function', },
			{name: 'Display', type: 'equipment', },
		],
		requiredPriority: 1,
		properties: [
			{name: 'r0', type: 'register', scope: 'processor', value: 0, hidden: true, },
			{name: 'r1', type: 'register', scope: 'processor', value: 1, hidden: true, },
			{name: 'r2', type: 'register', scope: 'processor', value: 2, hidden: true, },
			{name: 'RX', type: 'register', scope: 'instance', allocate: true, hidden: true, },
		],
		validate(report, workspace) {
			// Check the specific type of the input function.
			if( 'AS' !== workspace.ReadRelation(this, 'Input')?.kind )
				report('error', 'Input must be an Alarm State function');

			// Check the logic support of the selected device.
			if( ! workspace.ReadRelation(this, 'Display')?.Pin('On') )
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
		fullname: 'Schmitt Trigger',
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
		fullname: "Interlock",
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
	}
}

const StdLogic = ['Power','RequiredPower','ReferenceId','PrefabHash','NameHash'];
const StdSlotLogic = ['Occupied','OccupantHash','Quantity','MaxQuantity','Damage','ReferenceId','PrefabHash','NameHash'];

// Metanode Definitions
const metanode_db = {
	'function': {
		// Title for navigation item or functional node
		Name(obj) {
			const def = functiondef_db[obj.kind];
			return `[${obj.kind}] ${obj.properties.Name ?? def.fullname}`;
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
			return def.properties ?? [];
		},

		// Return renderer class for Schematic view of this metanode.
		Diagram(obj) {
		},
	},

	'data': {
		Name(obj) {

		},

		Pins(obj) {
			return [{name:'Zone', type:'zone'}];
		},

		Fields(obj) {

		},

		// Return renderer class for Schematic view of this metanode.
		Diagram(obj) {

		},
	},

	'equipment': {
		Name(obj) {
			const def = equipmenttype_db[obj.kind];
			return (obj.properties?.Name ?? def.name) + (obj.properties?.ReferenceId ? ` (\$${obj.properties.ReferenceId.toString(16)})` : '');
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

				if( def.logicRead ) {
					const AddRO = L => res.push({name:L, passive:true, type:'logic', writable:false,});
					def.logicRead.forEach(AddRO);
					StdLogic.forEach(AddRO);
				}

				def.logicWrite?.forEach(L => res.push({name:L, passive:true, type:'logic', writable:true,}));

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
			return [{name:'Name', type:'string',}, {name:'ReferenceId', type:'number',}];
		},

		// Return renderer class for Schematic view of this metanode.
		Diagram(obj) {

		},
	},

	//TODO:
	'metafunction': {
		Name(obj) { },
		Pins(obj) { },
		Fields(obj) { },
		Diagram(obj) { },
	},

	//TODO:
	'zone': {
		Name(obj) { },
		Pins(obj) { },
		Fields(obj) { },
		Diagram(obj) { },
	},

	//TODO:
	'network': {
		Name(obj) { },
		Pins(obj) { },
		Fields(obj) { },
		Diagram(obj) { },
	},

	//TODO:
	'diagram': {
		Name(obj) { },
		Pins(obj) { },
		Fields(obj) { },
		Diagram(obj) { },
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
		if( !def || !def.id || !def.type || def.type === 'rel' )
			throw new Error("incomplete object; requires {id:,type:}");
		if( this.Objs[def.id] ) {
			console.warn(`replacing object "${def.id}"`);
		} else if( this.parent?.FindObject(def.id) ) {
			console.warn(`shadowing object "${def.id}"`);
		}

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
			this._unregister_rel(rel, rel.toNode);
			if( rel.viaNode ) this._unregister_rel(rel, rel.viaNode);
		});
	}

	AddRel(def) {
		if( this.ro )
			throw new Error("cannot add to read-only graph layer");
		if( !def || !def.fromNode || !def.toNode )
			throw new Error("incomplete relation; requires {fromNode:,toNode:}");
		if( def.fromIndex !== undefined && ('number' !== typeof def.fromIndex || def.fromIndex < 0) )
			throw new Error("illegal index relation number; must be undefined or else >= 0");
		if( def.type === undefined ) def.type = 'rel';
		if( !this.FindObject(def.fromNode) || !this.FindObject(def.toNode) || (def.viaNode && !this.FindObject(def.viaNode)))
			throw new Error("cannot create relation; all referenced objects must exist");

		this._register_rel(def, def.fromNode);
		this._register_rel(def, def.toNode);
		if( def.viaNode ) this._register_rel(def, def.viaNode);
	}

	// Remove a relation ONLY if it actually exists in this layer.
	RemoveRel(def) {
		if( this.ro )
			throw new Error("cannot delete from read-only graph layer");
		if( -1 === this.Rels.indexOf(def) ) return;
		this._unregister_rel(def, def.fromNode);
		this._unregister_rel(def, def.toNode);
		if( def.viaNode ) this._unregister_rel(def, def.viaNode);
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
