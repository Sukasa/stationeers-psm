
// Function Definition
const functiondef_db = {
	"IR": {
		fullname: 'Input Router',
		rels: [
			{name: 'Source', type: 'equipment', subtype: 'logic', },
			{name: 'Destination', type: 'data', array: true, allocate: true, },
		],
		config: [
			{name: 'R0', type: 'register', allocate: true, hidden: true, scope: 'instance', },
		],
		validate(report, workspace) {
			// Nothing to check. All configuration is required, and that's pre-validated.
		},
		blocks: [
			{
				scope: 'instance-prologue',
				code: [
					'l %R0% %Source.ReferenceId% %Source.Logic%',
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
		rels: [
			{name: 'SourceDevice', type: 'equipment', subtype: null, },
			{name: 'Destination', type: 'data', allocate: true, },
		],
		config: [
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
					'l %R0% %SourceDevice% Setting',
					'breqz %R0% 2',
					'putd %Destination.RAM% %Destination.Addr% %Signal%',
				],
			},
		],
	},

	"OR": {
		fullname: 'Output Router',
		rels: [
			{name: 'Source', type: 'data' },
			{name: 'Destination', type: 'equipment', subtype: 'logic', },
		],
		config: [
			{name: 'R0', type: 'register', allocate: true, hidden: true, scope: 'instance', },
		],
		validate(report, workspace) {
			// Nothing to check. All configuration is required, and that's pre-validated.
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
		rels: [
			{name: 'Input', type: 'function',},
			{name: 'Destination', type: 'data', array: true, allocate: true, },
		],
		config: [
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
			if( -1 === ['IR','SR'].indexOf(workspace.ReadRelation(this, 'Input')?.NodeClass) )
				report('error', 'Alarm Test function depends on an Input or Slot Input function');
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
		rels: [
			{name: 'Input', type: 'function', functiontype: ['AT']},
			{name: 'State', type: 'data', allocate: true, },
			{name: 'AckSignal', type: 'data', allocate: true, },
		],
		config: [
			{name: 'RAck', type: 'register', allocate: true, hidden: true, scope: 'processor', },
			{name: 'R2', type: 'register', allocate: true, hidden: true, scope: 'instance', },
			{name: 'R3', type: 'register', allocate: true, hidden: true, scope: 'instance', },
			{name: 'AckOn', type: 'buffer', value: [0,0,0,1,2,2]},
			{name: 'AckNo', type: 'buffer', value: [0,1,0,1,1,2]},
		],
		validate(report, workspace) {
			// Check the specific type of the input function.
			if( 'AT' !== workspace.ReadRelation(this, 'Input')?.NodeClass )
				report('alarm', 'Alarm State function depends on an Alarm Test function');
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
				group: 'load',
				constraints: [{kind: 'immediately-proceeding', target: 'Input'}],
				code: [
					'select %R3% %Input.R1% 3 0',
				]
			},
			{
				scope: 'instance',
				group: 'load',
				constraints: [{kind: 'different-processor', target: 'Input'}],
				code: [
					'getd %R3% %Input.Destination.RAM% %Input.Destination.Addr%',
					'select %R3% %R3% 3 0',
				]
			},
			{
				scope: 'instance',
				code: [
					'getd %R2% %State.RAM% %State.Addr%',
					'add %R2% %R2% %R3%',
					'add %R2% %R2% %RAck%',
					'getd %R2% %B.RAM% %R2%',
					'putd %State.RAM% %State.Addr% %R2%',
				]
			}
		]
	},

	"AA": {
		fullname: 'Alarm Annunciation',
		rels: [
			{name: 'Input', type: 'function', },
			{name: 'Display', type: 'equipment', },
		],
		config: [
			{name: 'r0', type: 'register', value: 0, hidden: true, },
			{name: 'r1', type: 'register', value: 1, hidden: true, },
			{name: 'r2', type: 'register', value: 2, hidden: true, },
			{name: 'RX', type: 'register', allocate: true, hidden: true, },
		],
		validate(report, workspace) {
			// Check the specific type of the input function.
			if( 'AS' !== workspace.ReadRelation(this, 'Input')?.NodeClass )
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
	{type: 'function', kind: 'IR', id: 'UK381091', config: {}},
	{type: 'rel', fromNode: 'UK381091', fromPin: 'Source', toNode: 'EK419931', toPin: 'Temperature'},
	{type: 'rel', fromNode: 'UK381091', fromPin: 'Destination', toNode: 'HL13014'},

	{type: 'function', kind: 'XR', id: 'UV8201', config: {
		'Signal': 1,
	}},
	{type: 'rel', fromNode: 'UV8201', fromPin: 'Source', toNode: 'RI39151'},
	{type: 'rel', fromNode: 'UV8201', fromPin: 'Destination', toNode: 'HL94912'},

	{type: 'function', kind: 'OR', id: 'EQ818293', config: {}},
	{type: 'rel', fromNode: 'EQ818293', fromPin: 'Source', viaNode: 'UK381091', viaPin: 'Destination'},
	{type: 'rel', fromNode: 'EQ818293', fromPin: 'Destination', toNode: 'TW818194', toPin: 'Setting'},

	{type: 'function', kind: 'AT', id: 'UG82030', config: {
		'Test': 'lt',
		'Threshold': 283,
	}},
	{type: 'rel', fromNode: 'UG82030', fromPin: 'Input', toNode: 'UK381091'},
	{type: 'rel', fromNode: 'UG82030', fromPin: 'Destination', toNode: 'HL83018'},

	{type: 'function', kind: 'AS', id: 'UG7364', config: {}},
	{type: 'rel', fromNode: 'UG7364', fromPin: 'Input', toNode: 'UG82030'},
	{type: 'rel', fromNode: 'UG7364', fromPin: 'State', toNode: 'HL92103'},
	{type: 'rel', fromNode: 'UG7364', fromPin: 'AckSignal', viaNode: 'UV8201', viaPin: 'Destination'},

	{type: 'function', kind: 'AA', id: 'UG175689', config: {}},
	{type: 'rel', fromNode: 'UG175689', fromPin: 'Input', toNode: 'UG7364'},
	{type: 'rel', fromNode: 'UG175689', fromPin: 'Display', toNode: 'TW3716'},

	{type: 'data', id: 'HL13014', transient:true, config: {}},
	{type: 'data', id: 'HL94912', transient:true, config: {}},
	{type: 'data', id: 'HL83018', transient:true, config: {}},
	{type: 'data', id: 'HL92103', transient:true, config: {}},

	{type: 'Zone', id: 'ZHab1', properties: {
		'Name': 'Habitat 1',
	}},

	{type: 'rel', fromNode: 'EK419931', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'LC183102', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'RG3123', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'TW818194', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'RI39151', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'TW3716', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'ZHab1', fromPin: 'Processor', toNode: 'RG3123'},
	{type: 'rel', fromNode: 'ZHab1', fromPin: 'RAM', toNode: 'RG3123'},

	{type: 'Equipment', kind: 'Gas Sensor', id: 'EK419931', properties: {
		'Name': 'Foyer Gas Sensor',
		'ReferenceId': 4108,
	}},
	{type: 'Equipment', kind: 'Wall Heater', id: 'LC183102', properties: {
		'Name': 'Foyer Wall Heater',
		'ReferenceId': 1320,
	}},
	{type: 'Equipment', kind: 'IC10 Socket', id: 'RG3123', properties: {
		'Name': 'Foyer Control',
		'ReferenceId': 4118,
	}},
	{type: 'Equipment', kind: 'LED Display', id: 'TW818194', properties: {
		'Name': 'Temp Wall Display',
		'Initialize': {Color:2, On:1, Mode:4},
		'ReferenceId': 4102,
	}},
	{type: 'Equipment', kind: 'Button', id: 'RI39151', properties: {
		'Name': 'ACK button',
		'Initialize': {Color:5},
		'ReferenceId': 4120,
	}},
	{type: 'Equipment', kind: 'LED Panel', id: 'TW3716', properties: {
		'Name': 'Low Temp Alarm Lamp',
		'Initialize': {Color:5, On:1},
		'ReferenceId': 4127,
	}},
];
