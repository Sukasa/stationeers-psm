
// Function Definition
const functiondef_db = {
	"IR": {
		fullname: 'Input Router',
		config: [
			{name: 'SourceLogic', type: 'logic', },
			{name: 'SourceDevice', type: 'equipment', },
			{name: 'Destination', type: 'data', array: true, allocate: true, },
			{name: 'R0', type: 'register', allocate: true, hidden: true, scope: 'instance', },
		],
		validate(report, cvals, workspace) {
			if( ! Find(Find(workspace.equipment_type, Find(workspace.equipment, cvals.SourceDevice)).logic_supported, cvals.SourceLogic) )
				report('error', 'selected device does not support selected logic type');
		},
		blocks: [
			{
				scope: 'instance-prologue',
				code: [
					'l %R0% %SourceDevice% %SourceLogic%',
				],
			},
			{
				scope: 'array', target: 'Destination',
				code: [
					'putd %Destination.RAM% %Destination.Addr% %R0%',
				],
			}
		],
	},

	"XR": {
		fullname: 'Interrupt Router',
		config: [
			{name: 'SourceDevice', type: 'equipment', },
			{name: 'Signal', type: 'constant', subtype: 'number', },
			{name: 'Destination', type: 'data', allocate: true, },
			{name: 'R0', type: 'register', allocate: true, hidden: true, scope: 'instance', },
		],
		validate(report, cvals, workspace) {
			if( ! Find(Find(workspace.equipment_type, Find(workspace.equipment, cvals.SourceDevice)).logic_supported, 'Setting') )
				report('error', 'selected device does not support "Setting" logic');
		},
		blocks: [
			{
				scope: 'instance',
				code: [
					'l %R0% %SourceDevice% Setting',
					'breqz %R0% 2',
					'putd %Destination.RAM% %Destination.Addr% %Signal%',
				],
			},
		],
	},

	"OR": {
		fullname: 'Output Router',
		config: [
			{name: 'Source', type: 'data' },
			{name: 'DestinationLogic', type: 'logic', },
			{name: 'DestinationDevice', type: 'equipment', },
			{name: 'R0', type: 'register', allocate: true, hidden: true, scope: 'instance', },
		],
		validate(report, cvals, workspace) {
			if( ! Find(Find(workspace.equipment_type, Find(workspace.equipment, cvals.DestinationDevice)).logic_supported, cvals.DestinationLogic) )
				report('error', 'selected device does not support selected logic type');
		},
		blocks: [
			{
				scope: 'instance',
				code: [
					'getd %R0% %Source.RAM% %Source.Addr%',
					's %DestinationDevice% %DestinationLogic% %R0%',
				],
			}
		]
	},

	"AT": {
		fullname: 'Alarm Test',
		config: [
			{name: 'Input', type: 'function', functiontype: ['IR','SR','XR']},
			{name: 'Threshold', type: 'constant', subtype: 'number'},
			{name: 'Destination', type: 'data', array: true, allocate: true, },
			{name: 'R1', type: 'register', allocate: true, hidden: true, scope: 'instance', },
			{name: 'Test', type: 'constant', subtype: 'list', options: [
				{name: "sgt", label: "Input > Threshold"},
				{name: "sge", label: "Input >= Threshold"},
				{name: "sle", label: "Input <= Threshold"},
				{name: "slt", label: "Input < Threshold"},
			]},
		],
		validate(report, cvals, workspace) {
			//TODO:
		},
		blocks: [
			{
				scope: 'instance',
				group: 'load',
				constraints: [{kind: 'different-processor', target: 'Input'}],
				code: [
					'getd %R1% %Input.Destination.RAM% %Input.Destination.Addr%',
					'%Test% %R1% %R1% %Threshold%'
				]
			},
			{
				scope: 'instance',
				group: 'load',
				constraints: [{kind: 'immediately-proceeding', target: 'Input'}],
				code: [
					'%Test% %R1% %Input.R0% %Threshold%'
				]
			},
			{
				scope: 'instance',
				code: [
					'putd %Destination.RAM% %Destination.Addr% %R1%',
				]
			}
		]
	},

	"AS": {
		fullname: 'Alarm State',
		config: [
			{name: 'Input', type: 'function', functiontype: ['AT']},
			{name: 'State', type: 'data', allocate: true, },
			{name: 'AckSignal', type: 'data', allocate: true, },
			{name: 'RAck', type: 'register', allocate: true, hidden: true, scope: 'processor', },
			{name: 'R2', type: 'register', allocate: true, hidden: true, scope: 'instance', },
			{name: 'AckOn', type: 'buffer', value: [0,0,0,1,2,2]},
			{name: 'AckNo', type: 'buffer', value: [0,1,0,1,1,2]},
		],
		validate(report, cvals, workspace) {
			//TODO
		},
		blocks: [
			{
				scope: 'prologue',
				code: [
					'getd %RAck% %AckSignal.RAM% %AckSignal.Addr%',
					'select %RAck% %RAck% %B.AckOn% %B.AckNo%',
					'putd %AckSignal.RAM% %AckSignal.Addr% 0',
				],
			},
			{
				scope: 'instance',
				constraints: [{kind: 'immediately-proceeding', target: 'Input'}],
				code: [
					'select %Input.R1% %Input.R1% 3 0',
					'getd %R2% %State.RAM% %State.Addr%',
					'add %R2% %R2% %Input.R1%',
					'add %R2% %R2% %RAck%',
					'getd %R2% %B.RAM% %R2%',
					'putd %State.RAM% %State.Addr% %R2%',
				]
			}
		]
	},

	"AA": {
		fullname: 'Alarm Annunciation',
		config: [
			{name: 'Input', type: 'function', functiontype: ['AS'], },
			{name: 'Display', type: 'equipment', },
			{name: 'r0', type: 'register', value: 0, hidden: true, },
			{name: 'r1', type: 'register', value: 1, hidden: true, },
			{name: 'r2', type: 'register', value: 2, hidden: true, },
			{name: 'RX', type: 'register', allocate: true, hidden: true, },
		],
		validate(report, cvals, workspace) {
			if( ! Find(Find(workspace.equipment_type, Find(workspace.equipment, cvals.SourceDevice)).logic_supported, 'On') )
				report('error', 'selected device does not support "On" logic');
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
				scope: 'prologue',
				code: [
					'select r1 0 1',
				]
			},
			{
				scope: 'instance',
				group: 'output',
				constraints: [{kind: 'different-processor', target: 'Input'}],
				code: [
					'getd %RX% %Input.State.RAM% %Input.State.Addr%',
					's %Display% On r%RX%',
				]
			},
			{
				scope: 'instance',
				group: 'output',
				constraints: [{kind: 'immediately-proceeding', target: 'Input'}],
				code: [
					's %Display% On r%Input.R2%',
				]
			}
		]
	}
}


const test_workspace = [
	{type: 'function', kind: 'IR', id: 'UK381091', config: {
		'SourceLogic': 'Temperature',
		'SourceDevice': 'EK419931',
		'Destination': 'HL13014',
	}},
	{type: 'function', kind: 'XR', id: 'UV8201', config: {
		'Source': 'RI39151',
		'Destination': 'HL94912',
		'Signal': 1,
	}},
	{type: 'function', kind: 'OR', id: 'EQ818293', config: {
		'Source': 'HL13014',
		'DestinationDevice': 'TW818194',
		'DestinationLogic': 'Setting',
	}},
	{type: 'function', kind: 'AT', id: 'UG82030', config: {
		'Input': 'UK381091',
		'Test': 'lt',
		'Threshold': 283,
		'Destination': 'HL83018',
	}},
	{type: 'function', kind: 'AS', id: 'UG7364', config: {
		'Input': 'UG82030',
		'State': 'HL92103',
		'AckSignal': 'HL94912',
	}},
	{type: 'function', kind: 'AA', id: 'UG175689', config: {
		'Input': 'UG7364',
		'Display': 'TW3716',
	}},
	{type: 'data', id: 'HL13014', transient:true, config: {}},
	{type: 'data', id: 'HL83018', transient:true, config: {}},
	{type: 'data', id: 'HL92103', transient:true, config: {}},
	{type: 'data', id: 'HL94912', transient:true, config: {}},

	{type: 'Equipment', kind: 'Gas Sensor', id: 'EK419931', properties: {
		'Zone': 'Habitat 1',
		'Name': 'Foyer Gas Sensor',
		'ReferenceId': 4108,
	}},
	{type: 'Equipment', kind: 'Wall Heater', id: 'LC183102', properties: {
		'Zone': 'Habitat 1',
		'Name': 'Foyer Wall Heater',
		'ReferenceId': 1320,
	}},
	{type: 'Equipment', kind: 'Chip Socket', id: 'RG3123', properties: {
		'Zone': 'Habitat 1',
		'Name': 'Foyer Control',
		'ReferenceId': 4118,
		'Purpose': ['Processor', 'RAM'],
	}},
	{type: 'Equipment', kind: 'LED Display', id: 'TW818194', properties: {
		'Zone': 'Habitat 1',
		'Name': 'Temp Wall Display',
		'Initialize': {Color:8, On:1, Mode:4},
		'ReferenceId': 4102,
	}},
	{type: 'Equipment', kind: 'Button', id: 'RI39151', properties: {
		'Zone': 'Habitat 1',
		'Name': 'ACK button',
		'Initialize': {Color:3},
		'ReferenceId': 4120,
	}},
	{type: 'Equipment', kind: 'LED Panel', id: 'TW3716', properties: {
		'Zone': 'Habitat 1',
		'Name': 'Low Temp Alarm Lamp',
		'Initialize': {Color:3},
		'ReferenceId': 4120,
	}},
];
