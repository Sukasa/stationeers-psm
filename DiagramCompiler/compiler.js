
// Function Definition
const functiondef_db = {
	"IR": {
		fullname: 'Input Router',
		config: [
			{name: 'SourceLogic', type: 'logic', },
			{name: 'SourceDevice', type: 'equipment', },
			{name: 'Destination', type: 'data', array: true, allocate: true, },
			{name: 'R0', type: 'register', allocate: true, private: true, scope: 'instance', },
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

	"OR": {
		fullname: 'Output Router',
		config: [
			{name: 'Source', type: 'data' },
			{name: 'DestinationLogic', type: 'logic', },
			{name: 'DestinationDevice', type: 'equipment', },
			{name: 'R0', type: 'register', allocate: true, private: true, scope: 'instance', },
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
			{name: 'R1', type: 'register', allocate: true, private: true, scope: 'instance', },
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
				constraints: [{kind: 'different-processor', target: 'Input'}],
				code: [
					'getd %R1% %Input.Destination.RAM% %Input.Destination.Addr%',
					'%Test% %R1% %R1% %Threshold%'
				]
			},
			{
				scope: 'instance',
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
}