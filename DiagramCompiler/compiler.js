
const equipmenttype_db = {
	'StructureAirlock': {
		name: 'Airlock',
		prefab: '-2105052344',
		logicWrite: ['Open','Mode','Lock','Setting','On',],
		logicRead: ['Idle',],
		connections: [{data:1},{power:1},],
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
			{name: 'Destination', type: 'data', array: true, allocate: true, },
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
					'getd %R0% %Source.RAM% %Source.Addr%',
					's %DestinationDevice% %DestinationLogic% %R0%',
				],
			}
		]
	},

	"AT": {
		fullname: 'Alarm Test',
		rels: [
			{name: 'Input', type: 'function', functiontype:['IR','SR'], },
			{name: 'Destination', type: 'data', array: true, allocate: true, },
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
					'getd %R1% %Input.Destination.RAM% %Input.Destination.Addr%',
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
		properties: [
			{name: 'RAck', type: 'register', allocate: true, hidden: true, scope: 'processor', },
			{name: 'R2', type: 'register', allocate: true, hidden: true, scope: 'instance', },
			{name: 'R3', type: 'register', allocate: true, hidden: true, scope: 'instance', },
			{name: 'AckOn', type: 'buffer', value: [0,0,0,1,2,2], scope: 'zone'},
			{name: 'AckNo', type: 'buffer', value: [0,1,0,1,1,2], scope: 'zone'},
		],
		validate(report, workspace) {
			// Check the specific type of the input function.
			if( 'AT' !== workspace.ReadRelation(this, 'Input')?.kind )
				report('alarm', 'Alarm State function depends on an Alarm Test function');
		},
		blocks: [
			{
				scope: 'cycle-init',
				code: [
					'getd %RAck% %AckSignal.RAM% %AckSignal.Addr%',
					'select %RAck% %RAck% %B.AckOn% %B.AckNo%',
					'putd %AckSignal.RAM% %AckSignal.Addr% 0',
				],
			},
			{
				scope: 'instance',
				group: 'load',
				constraints: [{kind: 'immediately-after', target: 'Input'}],
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
					'getd %RX% %Input.State.RAM% %Input.State.Addr%',
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
	}
}

const StdLogic = ['Power','RequiredPower','ReferenceId','PrefabHash','NameHash'];
const StdSlotLogic = ['Occupied','OccupantHash','Quantity','MaxQuantity','Damage','ReferenceId','PrefabHash','NameHash'];

// Metanode Definitions
const metanode_db = {
	'function': {
		// Generate list of {name:,array:,type:,subtype?:} pins this node exposes for Relations.
		Pins(obj) {
		},
		// Generate list of {name:,type:,hidden:} property definitions this node exposes to property editor.
		Fields(obj) {
		},
		// Return renderer class for Diagram view of this metanode.
		Diagram(obj) {
		},
	},

	'data': {
		Pins(obj) {
			return [{name:'Zone', type:'zone'}];
		},
		Fields(obj) {

		},
		Diagram(obj) {

		},
	},

	'equipment': {
		Pins(obj) {
			const def = equipmenttype_db[obj.kind];
			if( ! def ) return [];
			if( def.pins === undefined ) {
				const res = [{name:'Zone', type:'zone'}];
	
				if( def.logicRead ) {
					const AddRO = L => res.push({name:L, type:'logic', writable:false,});
					def.logicRead.forEach(AddRO);
					StdLogic.forEach(AddRO);
					
					def.logicWrite?.forEach(L => res.push({name:L, type:'logic', writable:true,}));
				}
	
				def.logicSlots?.forEach((S,si) => {
					const addSlot = L => res.push({logic:L, slot:si, name:`Slot #${si} ${L}`, type:'logic', writable:false});
					S.forEach(addSlot);
					StdSlotLogic.forEach(addSlot);
				});
	
				def.pins = res;
			}
			return def.pins;
		},
		Fields(obj) {
			return [{name:'ReferenceId', type:'number',}];
		},
		Diagram(obj) {

		},
	},
};


const test_workspace = [
	{type: 'function', kind: 'IR', id: 'UK381091', properties: {}},
	{type: 'rel', fromNode: 'UK381091', fromPin: 'Source', toNode: 'EK419931', toPin: 'Temperature'},
	{type: 'rel', fromNode: 'UK381091', fromPin: 'Destination', toNode: 'HL13014'},

	{type: 'function', kind: 'XR', id: 'UV8201', properties: {
		'Signal': 1,
	}},
	{type: 'rel', fromNode: 'UV8201', fromPin: 'Source', toNode: 'RI39151'},
	{type: 'rel', fromNode: 'UV8201', fromPin: 'Destination', toNode: 'HL94912'},

	{type: 'function', kind: 'OR', id: 'EQ818293', properties: {}},
	{type: 'rel', fromNode: 'EQ818293', fromPin: 'Source', toNode: 'HL13014', viaNode: 'UK381091', viaPin: 'Destination'},
	{type: 'rel', fromNode: 'EQ818293', fromPin: 'Destination', toNode: 'TW818194', toPin: 'Setting'},

	{type: 'function', kind: 'AT', id: 'UG82030', properties: {
		'Test': 'slt',
		'Threshold': 283,
	}},
	{type: 'rel', fromNode: 'UG82030', fromPin: 'Input', toNode: 'UK381091'},
	{type: 'rel', fromNode: 'UG82030', fromPin: 'Destination', toNode: 'HL83018'},

	{type: 'function', kind: 'AS', id: 'UG7364', properties: {}},
	{type: 'rel', fromNode: 'UG7364', fromPin: 'Input', toNode: 'UG82030'},
	{type: 'rel', fromNode: 'UG7364', fromPin: 'State', toNode: 'HL92103'},
	{type: 'rel', fromNode: 'UG7364', fromPin: 'AckSignal', toNode: 'HL94912', viaNode: 'UV8201', viaPin: 'Destination'},

	{type: 'function', kind: 'AA', id: 'UG175689', properties: {}},
	{type: 'rel', fromNode: 'UG175689', fromPin: 'Input', toNode: 'UG7364'},
	{type: 'rel', fromNode: 'UG175689', fromPin: 'Display', toNode: 'TW3716'},

	{type: 'function', kind: 'AT', id: 'ZG7188', properties: {
		'Test': 'sgt',
		'Threshold': 302,
	}},
	{type: 'rel', fromNode: 'ZG7188', fromPin: 'Input', toNode: 'UK381091'},
	{type: 'rel', fromNode: 'ZG7188', fromPin: 'Destination', toNode: 'HH42018'},

	{type: 'function', kind: 'AS', id: 'UG2022', properties: {}},
	{type: 'rel', fromNode: 'UG2022', fromPin: 'Input', toNode: 'ZG7188'},
	{type: 'rel', fromNode: 'UG2022', fromPin: 'State', toNode: 'HL19371'},
	{type: 'rel', fromNode: 'UG2022', fromPin: 'AckSignal', toNode: 'HL94912', viaNode: 'UV8201', viaPin: 'Destination'},

	{type: 'function', kind: 'AA', id: 'UG497710', properties: {}},
	{type: 'rel', fromNode: 'UG497710', fromPin: 'Input', toNode: 'UG2022'},
	{type: 'rel', fromNode: 'UG497710', fromPin: 'Display', toNode: 'TW3716'},

	{type: 'data', id: 'HL13014', name:'TI-401 PV', transient:true, properties: {}},
	{type: 'data', id: 'HL94912', name:'ACK GROUP 1 TRIGGER', transient:true, properties: {}},
	{type: 'data', id: 'HL83018', name:'TI-401 LO ALARM TRIGGER', transient:true, properties: {}},
	{type: 'data', id: 'HL92103', name:'TI-401 LO ALARM STATE', transient:true, properties: {}},
	{type: 'data', id: 'HH42018', name:'TI-401 HI ALARM TRIGGER', transient:true, properties: {}},
	{type: 'data', id: 'HL19371', name:'TI-401 HI ALARM STATE', transient:true, properties: {}},

	{type: 'zone', id: 'ZHab1', properties: {
		'Name': 'Habitat 1',
	}},

	{type: 'drawing', id: 'DW927741', properties: {
		'Name': 'Habitat 1 Air Temperature Management',
	}},

	{type: 'rel', fromNode: 'DW927741', fromPin: 'Component', fromIndex: 0, toNode: 'EK419931', properties: {x:23, y:-4, as:'icon'}},
	{type: 'rel', fromNode: 'DW927741', fromPin: 'Component', fromIndex: 1, toNode: 'LC183102', properties: {x:23, y:-3, as:'icon'}},
	{type: 'rel', fromNode: 'DW927741', fromPin: 'Component', fromIndex: 2, toNode: 'RG3123', properties: {x:23, y:-2, as:'icon'}},
	{type: 'rel', fromNode: 'DW927741', fromPin: 'Component', fromIndex: 3, toNode: 'TW818194', properties: {x:23, y:-1, as:'icon'}},
	{type: 'rel', fromNode: 'DW927741', fromPin: 'Component', fromIndex: 4, toNode: 'RI39151', properties: {x:23, y:-0, as:'icon'}},
	{type: 'rel', fromNode: 'DW927741', fromPin: 'Component', fromIndex: 5, toNode: 'TW3716', properties: {x:23, y:1, as:'icon'}},

	{type: 'rel', fromNode: 'ZHab1', fromPin: 'Processor', toNode: 'RG3123'},
	{type: 'rel', fromNode: 'ZHab1', fromPin: 'RAM', toNode: 'RG3123'},

	{type: 'rel', fromNode: 'UK381091', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UV8201', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'EQ818293', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG82030', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG7364', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG175689', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'ZG7188', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG2022', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG497710', fromPin: 'Zone', toNode: 'ZHab1'},

	{type: 'equipment', kind: 'Gas Sensor', id: 'EK419931', properties: {
		'Name': 'Foyer Gas Sensor',
		'ReferenceId': 4108,
	}},
	{type: 'equipment', kind: 'Wall Heater', id: 'LC183102', properties: {
		'Name': 'Foyer Wall Heater',
		'ReferenceId': 1320,
	}},
	{type: 'equipment', kind: 'IC10 Socket', id: 'RG3123', properties: {
		'Name': 'Foyer Control',
		'ReferenceId': 4118,
		'Lines': 128,
		'Memory': 512,
	}},
	{type: 'equipment', kind: 'LED Display', id: 'TW818194', properties: {
		'Name': 'Temp Wall Display',
		'Initialize': {Color:2, On:1, Mode:4},
		'ReferenceId': 4102,
	}},
	{type: 'equipment', kind: 'Button', id: 'RI39151', properties: {
		'Name': 'ACK button',
		'Initialize': {Color:5},
		'ReferenceId': 4120,
	}},
	{type: 'equipment', kind: 'LED Panel', id: 'TW3716', properties: {
		'Name': 'Low Temp Alarm Lamp',
		'Initialize': {Color:5, On:1},
		'ReferenceId': 4127,
	}},
];


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

	// Read the node at the OTHER END of a specific non-array relationship pin.
	ReadRelation(objId, pinName) {
		if( !objId || !pinName || !this.FindObject(objId) ) return undefined;
		const rel = this.FindRelations(objId).find(r => r.fromPin === pinName && r.index === undefined);
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

		return JSON.stringify(list);
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

(function() {
	// Create graph layer from prototype test data.
	const db = new GraphLayer();
	db.Deserialize(JSON.stringify(test_workspace));

	// Make a sublayer upon the original graph.
	const def = new GraphLayer(db);
	const rc = new ReportReceiver();
	const cc = {};
	ZoneCodeCompile(def, rc, cc);
	rc.reports.forEach(e => console.log(`[${e.category}] ${e.severity}: ${e.message}`));
	console.log(`Done 1st prototype compile`);

	// Run compile on it again, so we can verify the result is stable.
	const rc2 = new ReportReceiver();
	const cc2 = {};
	ZoneCodeCompile(def, rc2, cc2);
	rc2.reports.forEach(e => console.log(`[${e.category}] ${e.severity}: ${e.message}`));
	console.log(`Done 2nd prototype compile`);
	console.log(JSON.parse(def.Serialize()));
})();

function ZoneCodeCompile(def, rc, cc) {
	// Gather function-related assets in Zone.
	const assets = def.FindRelations('ZHab1')
		.filter(rel => rel.fromNode === 'ZHab1'
			&& (rel.fromPin === 'Processor' || rel.fromPin === 'RAM'));

	// Gather Functions in Zone
	const funcs = def.FindRelations('ZHab1')
		.filter(rel => rel.fromPin === 'Zone')
		.map(rel => def.FindObject(rel.fromNode))
		.filter(o => o.type === 'function');

	//DEBUG: console.log(`Assets`, assets);
	//DEBUG: console.log(`Functions`, funcs);

	// Validate Functions
	funcs.forEach(f => {
		rc.setCategory(f.id);
		ValidateFunction(rc.report, f, def);
	});

	const processors = [], storages = [];
	if( ! rc.fatal ) {
		rc.setCategory('Allocation');

		// Gather what spaces we have available for allocating.
		assets.forEach(ar => {
			const n = def.FindObject(ar.toNode);
			if( ar.fromPin === 'Processor' ) {
				const maxLines = n?.properties?.Lines ?? 128;
				const avail = [];
				for(var i = 0, m = n?.properties?.Registers ?? 16; i < m; ++i)
					avail.push(i);
				processors.push({
					node: ar.toNode,
					blocks: [],
					registersFree: avail,
					capacity: maxLines, free: maxLines,
				});
			} else if( ar.fromPin === 'RAM' ) {
				const maxSlots = n?.properties?.Memory ?? 512;
				storages.push({node: ar.toNode, buffers: [{id:null, name:'-BLOCK-NULLPTR-ALLOC-', addr:0, size:1}], capacity: maxSlots, free: maxSlots - 1});
			}
		});
	}

	const funcsByDep = [];
	if( ! rc.fatal ) {
		// Pull dependency strings to sequence related function code blocks.
		const fQueue = funcs.map(f => ({
			func: f,
			refs: def.FindRelations(f.id)
				.filter(r => r.fromNode === f.id)
				.map(r => def.FindObject(r.toNode))
				.filter(f2 => f2.type === 'function')
		}));

		while( fQueue.length > 0 ) {
			fQueue.sort((a,b) => a.refs.length - b.refs.length);
			if( fQueue[0].refs.length > 0 ) {
				rc.report('error', `Failed to resolve depenencies of function "${fQueue[0].func.id}" (depends on at least "${fQueue[0].refs[0].id}")`);
				break;
			}

			const innerQueue = [fQueue.shift().func];
			while( innerQueue.length > 0 ) {
				const next = innerQueue.shift();
				funcsByDep.push(next);
				for(var i = 0; i < fQueue.length; ++i) {
					const idx = fQueue[i].refs.indexOf(next);
					if( idx > -1 ) {
						fQueue[i].refs.splice(idx, 1);
						rc.report('info', `Resolved "${next.id}" from dependencies of "${fQueue[i].func.id}"`);

						if( fQueue[i].refs.length === 0 ) {
							// This node's last dependency was the one we just resolved.
							// Enqueue it for fast-track resolution.
							innerQueue.push(fQueue[i].func);
						}
					}
				}
			}
		}

		rc.report('info', `${rc.fatal ? 'Incompletely sequenced':'Sequenced'} functions as (${funcsByDep.map(f => f.id).join("; ")})`);
	}

	if( ! rc.fatal ) {
		const typesOnce = {};
		// Allocate and mark as permanently used anything that has Zone or Processor scope.
		funcsByDep.forEach(f => {
			var fproc = def.ReadRelation(f.id, 'Processor');
			if( fproc && !processors.find(p => fproc.id === p.node) ) {
				rc.report('error', `Processor "${fproc.id}" assigned to function "${f.id}" is not assigned to the same Zone!`);
				return;

			} else if( !fproc && processors[0] ) {
				rc.report('info', `Assigning Zone processor "${processors[0].node}" to function "${f.id}"`);
				def.AddRel({fromNode:f.id, fromPin:'Processor', toNode:processors[0].node});
				fproc = def.FindObject(processors[0].node);
			}

			const proc = processors.find(p => p.node === fproc.id);
			const datum = def.FindRelations(f.id)
				.filter(r => f.id === r.fromNode)
				.map(r => def.FindObject(r.toNode))
				.filter(o => o?.type === 'data');
			datum.forEach(d => CheckAndValidateDatum(d, rc, storages));

			if( !typesOnce[f.kind] ) {
				// Process processor-wide register allocations
				typesOnce[f.kind] = true;
				functiondef_db[f.kind].properties?.forEach(pdef => {
					if( pdef.type !== 'register' || pdef.scope !== 'processor' ) return;
					const pval = f.properties?.[pdef.name] ?? pdef.value ?? undefined;

					var nval;
					if( pval === undefined ) {
						if( pdef.allocate ) {
							if( proc.registersFree.length > 0 ) {
								nval = proc.registersFree[proc.registersFree.length - 1];
							} else {
								rc.report('error', `No registers available in processor "${proc.node}" for use by function type "${f.kind}"`);
								return;
							}
						} else {
							rc.report('error', `Function "${f.id}" of kind "${f.kind}" requires manual register allocation for property "${pdef.name}"`);
							return;
						}
					} else {
						nval = pval;
					}

					const idx = proc.registersFree.indexOf(nval);
					if( -1 === idx ) {
						rc.report('error', `Register r${nval} is already in use in processor "${proc.node}"; cannot assign it to function type "${f.kind}"`);
					} else {
						rc.report('info', `Assigning Register r${nval} to function type "${f.kind}" in processor "${proc.node}"`);
						proc.registersFree.splice(idx, 1);
					}
				});
			}
		});
	}

	if( ! rc.fatal ) {
		const procTables = {}, typesOnce = {};
		funcsByDep.forEach(fnObj => {
			const fproc = def.ReadRelation(fnObj.id, 'Processor');
			const fnDef = functiondef_db[fnObj.kind];

			const proc = procTables[fproc.id] = procTables[fproc.id] ?? {
				processor: processors.find(p => p.node === fproc.id),
				'zone-init': [], 'processor-init': [], 'cycle-init': [], 'instance': [], 'cycle-outro': [],
			};

			rc.report('info', `Processor "${fproc.id}" has ${proc.processor.free} lines and ${proc.processor.registersFree.length} registers for use by function "${fnObj.id}"`);
			if( !typesOnce[fnObj.kind] ) {
				typesOnce[fnObj.kind] = true;
				//TODO: insert once-per-processor code blocks
			}

			//TODO: insert once-per-instance code blocks
		});

		//TODO: build list of function code blocks, grouped by processor and scope, with same-processor and different-processor constraints applied.
		//TODO: add label&yield to top (after zone-init and processor-init code), and jump to bottom, of every processor.
		
	}

	if( ! rc.fatal ) {
		// Generate code
		//TODO: again respecting function sort, generate substitution values and allocate instance-level reservations (mostly registers).
		//TODO: generate body of function code blocks
	}
}

function CheckAndValidateDatum(d, rc, storages) {
	if( d.properties?.addr === undefined || d.properties?.node === undefined ) {
		// Find and allocate space for this datum in a Zone RAM.
		const sz = d.properties?.size ?? 1;
		const st = storages.find(st => st.free >= sz);
		if( ! st ) {
			rc.report('error', `Failed to find space in Zone RAM for datum "${d.id}" referenced by "${f.id}"`);
			return;
		}

		var addr = null;
		for(var i = 0; i < st.buffers.length; ++i) {
			if( i < st.buffers.length - 1 ) {
				// Check between this block and next.
				if( sz <= st.buffers[i+1].addr - st.buffers[i].addr - st.buffers[i].size ) {
					// We can insert a new block here!
					addr = st.buffers[i+1].addr - sz;
					break;
				}
			} else {
				// Check between last block and end.
				addr = st.capacity - sz;
				break;
			}
		}

		if( addr === null ) {
			rc.report('error', `Failed to find space in Zone RAM for datum "${d.id}" referenced by "${f.id}"`);
			return;
		}

		// Insert new entry
		const e = {addr: addr, size: sz, id:d.id, name: d.name};
		d.properties = d.properties ?? {};
		d.properties.addr = addr;
		d.properties.node = st.node;

		rc.report('info', `Allocated ${sz} slots of "${st.node}" at \$${addr.toString(16)} for datum "${d.name ?? d.id}"`);
		st.buffers.push(e);
		st.buffers.sort((a,b) => a.addr - b.addr);

	} else {
		// Validate manually-allocated space for this datum in a Zone RAM.
		const sz = d.properties.size ?? 1;
		const da = d.properties.addr;
		const st = storages.find(st => st.node === d.properties.node);
		if( ! st ) {
			rc.report('error', `Failed to find RAM device "${d.properties.node}" in Zone for datum "${d.id}"`);
			return;
		}

		for(var i = 0; i < st.buffers.length; ++i) {
			const { addr:ba, size:bz } = st.buffers[i];
			if( st.buffers[i].id === d.id ) {
				// This is already the allocation we're looking for, found by another path.
				return;
			} else if( (da <= ba && da+sz > ba) || (ba <= da && ba+bz > da) ) {
				rc.report('error', `Datum "${d.id}" allocation overlaps with memory allocated for "${st.buffers[i].id ?? st.buffers[i].name}"`);
				return;
			}
		}

		st.buffers.push({addr: da, size: sz, id: d.id, name: d.name})
		st.buffers.sort((a,b) => a.addr - b.addr);
	}
}

function SortByIndex(a, b) {
	const av = a.index ?? -1, bv = b.index ?? -1;
	return av - bv;
}

function ValidateFunction(report, fnObj, layer) {
	const fdef = functiondef_db[fnObj.kind];
	if( !fdef ) return report('error', `Failed to find function type "${fnObj.kind}"`);

	// Validate relations
	const actualRels = layer.FindRelations(fnObj.id);
	fdef.rels.forEach(reldef => {
		const applicable = actualRels.filter(r => r.fromNode === fnObj.id && r.fromPin === reldef.name);
		applicable.sort(SortByIndex);
		ValidateFunctionRel(reldef, applicable, fnObj, report, layer);
	});

	// Validate configuration
	fdef.properties.forEach(propDef => {
		const value = fnObj.properties[propDef.name];
		if( value === undefined && !(propDef.allocate || propDef.value !== undefined) ) {
			report('error', `Configuration value "${propDef.name}" missing required value`);
		} else if( value ?? propDef.value ) {
			if( ! ValidatePropertyValue(propDef, value ?? propDef.value, fnObj, report, layer) )
				return;
		}

		// For valid values, assert relations into existence for certain properties.
		if( propDef.type === 'buffer' ) {
			const v = value ?? propDef.value;
			const scope = propDef.scope ?? 'processor';
			var scopeTarget = undefined;
			if( scope === 'zone' ) {
				scopeTarget = layer.ReadRelation(fnObj.id, 'Zone')?.id;
			} else if( scope === 'processor' ) {
				scopeTarget = layer.ReadRelation(fnObj.id, 'Processor')?.id;
			} else if( scope === 'instance' ) {
				scopeTarget = fnObj.id;
			}

			if( ! scopeTarget ) {
				report('error', `Failed to infer scope level "${scope}" target for function "${fnObj.id}" (you may have to manually assign one)`);
				return;
			}

			const dname = `${fnObj.kind}:${scope}=${scopeTarget}:${propDef.name}`;
			const dat = layer
				.FindRelations(scopeTarget)
				.filter(r => r.toNode === scopeTarget && r.fromPin === 'Scope')
				.map(r => layer.FindObject(r.fromNode))
				.filter(o => o.type === 'data' && o.name === dname);

			var buffer;
			if( dat.length === 0 ) {
				const did = buffer = layer.NewId();
				layer.AddObject({id: did, name: dname, type: 'data', transient:true, properties: {size: v.length}});
				layer.AddRel({fromNode: did, fromPin: 'Scope', toNode: scopeTarget});
				report('info', `Allocating new buffer "${buffer}" for scope ${scope}="${scopeTarget}"`);
			} else {
				buffer = dat[0].id;
			}

			if( buffer !== layer.ReadRelation(fnObj.id, propDef.name)?.id ) {
				layer.AddRel({fromNode: fnObj.id, fromPin: propDef.name, toNode: buffer});
				report('info', `Binding "${fnObj.id}:${propDef.name}" to buffer "${buffer}"`);
			}
		}
	});
}

function ValidatePropertyValue(propDef, val, fnObj, report, layer)
{
	const ok = true;
	switch(propDef.type) {
		case 'constant':
			if( propDef.subtype === 'number' ) {
				if( typeof val === 'string' ) val = parseFloat(val);
				if( typeof val !== 'number' || isNaN(val) ) {
					report('error', `Register value "${propDef.name}" is not a number`);
					ok = false;
				}
			
			} else if( propDef.subtype === 'integer' ) {
				if( typeof val === 'string' ) val = parseInt(val);
				if( typeof val !== 'number' || isNaN(val) || Math.floor(val) !== val ) {
					report('error', `Register value "${propDef.name}" is not an integer`);
					ok = false;
				}
			
			} else if( propDef.subtype === 'list' ) {
				if( !(propDef.options instanceof Array) ) {
					report('error', `Illegal property definition; subtype "list" implies an array "options" to pick from`);
					ok = false;
				} else if( ! propDef.options.find(i => i.name === val) ) {
					report('error', `Value "${val}" not a valid option for property value "${propDef.name}"`);
					ok = false;
				}
			}
			break;

		case 'register':
			if( typeof val === 'string' ) val = parseInt(val);
			if( typeof val !== 'number' || isNaN(val) || Math.floor(val) !== val ) {
				report('error', `Register value "${propDef.name}" is not an integer`);
				ok = false;
			} else if( val < 0 || val > 15 ) {
				report('error', `Register value "${propDef.name}" is out of valid range (0..15 inclusive)`);
				ok = false;
			}
			if( propDef.scope !== 'processor' && propDef.scope !== 'instance' ) {
				report('error', `Property Definition "${propDef.name}" is invalid: supported scopes are "processor" or "instance"!`);
				ok = false;
			}
			break;

		case 'buffer':
			if( typeof val === 'string' ) {
				try { val = JSON.parse(val); }
				catch {
					report('error', `Buffer value "${propDef.name}" must be an array, or a JSON string encoding an array!`);
					ok = false;
				}
			}
			if( !(val instanceof Array) || val.length < 1 ) {
				report('error', `Buffer value "${propDef.name}" must be a non-empty array`);
				ok = false;
			} else if( val.find(i => typeof i !== 'number' || isNaN(i)) ) {
				report('error', `Buffer value "${propDef.name}" must have only numeric entries`);
				ok = false;
			}
			break;
		
		default:
			report('error', `Unhandled property type "${propDef.type}"`);
			ok = false;
	}

	return ok;
}

function ValidateFunctionRel(reldef, rels, fnObj, report, layer)
{
	if( rels.length > 1 && !reldef.array ) {
		report('error', `Non-array pin "${reldef.name}" has more than one connection!`);
	} else if( rels.length === 0 && !reldef.optional ) {
		report('error', `Non-optional pin "${reldef.name}" has no connections!`);
	} else {
		rels.forEach(re => ValidateFunctionLink(reldef, re, fnObj, report, layer));
	}
}

function ValidateFunctionLink(reldef, rel, fnObj, report, layer)
{
	const far = layer.FindObject(rel.toNode);
	switch(reldef.type) {
		case 'function':
			if( rel.toPin !== undefined || rel.fromIndex !== undefined )
				report('error', 'Expected relationship to node, not pin');
			if( 'function' !== far?.type )
				report('error', `Bad connection: expected "function" at far node, found "${far?.type ?? 'nothing'}" instead`);
			if( reldef.functiontype instanceof Array ) {
				if( -1 === reldef.functiontype.indexOf(far.kind) ) {
					report('error', `Bad connection: incompatible function "${far.kind}" at far node`)
					break;
				}
			}
			break;

		case 'data':
			if( rel.toPin !== undefined )
				report('error', 'Expected relationship to node, not pin');
			if( 'data' !== far?.type )
				report('error', `Bad connection: expected "data" at far node, found "${far?.type ?? 'nothing'}" instead`);
			break;

		case 'equipment':
			if( !far ) {
				report('error', `Bad connection: expected "equipment" at far node, found nothing instead`);
				break;
			}
			if( !reldef.subtype && rel.toPin ) {
				report('error', `Expected relationship to node, not pin.`);
			} else if( reldef.subtype && !rel.toPin ) {
				report('error', `Expected relationship to pin, node node.`);
			} else if( reldef.subtype ) {
				//TODO: validate specific destination pin type selected
			}
			if( !far.properties?.ReferenceId ) {
				report('error', `Missing ReferenceId for equipment "${far.id}"`);
			}

			break;

		default:
			report('error', `Undefined function relationship type "${reldef.type}"`);
	}
}
