
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
			if( 'AT' !== workspace.ReadRelation(this, 'Input')?.kind )
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
	{type: 'rel', fromNode: 'EQ818293', fromPin: 'Source', toNode: 'HL13014', viaNode: 'UK381091', viaPin: 'Destination'},
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
	{type: 'rel', fromNode: 'UG7364', fromPin: 'AckSignal', toNode: 'HL94912', viaNode: 'UV8201', viaPin: 'Destination'},

	{type: 'function', kind: 'AA', id: 'UG175689', config: {}},
	{type: 'rel', fromNode: 'UG175689', fromPin: 'Input', toNode: 'UG7364'},
	{type: 'rel', fromNode: 'UG175689', fromPin: 'Display', toNode: 'TW3716'},

	{type: 'data', id: 'HL13014', transient:true, config: {}},
	{type: 'data', id: 'HL94912', transient:true, config: {}},
	{type: 'data', id: 'HL83018', transient:true, config: {}},
	{type: 'data', id: 'HL92103', transient:true, config: {}},

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

	{type: 'rel', fromNode: 'UK381091', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UV8201', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'EQ818293', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG82030', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG7364', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG175689', fromPin: 'Zone', toNode: 'ZHab1'},

	{type: 'rel', fromNode: 'ZHab1', fromPin: 'Processor', toNode: 'RG3123'},
	{type: 'rel', fromNode: 'ZHab1', fromPin: 'RAM', toNode: 'RG3123'},

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
		return (rel && this.Objs[rel.toNode]) || undefined;
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

	const db = new GraphLayer();
	db.Deserialize(JSON.stringify(test_workspace));

	// Make a read-only view into the full graph.
	const def = new GraphLayer(db, true);

	// Gather function-related assets in Zone.
	const assets = def.FindRelations('ZHab1')
		.filter(rel => rel.fromNode === 'ZHab1'
			&& (rel.fromPin === 'Processor' || rel.fromPin === 'RAM'));

	// Gather Functions in Zone
	const funcs = def.FindRelations('ZHab1')
		.filter(rel => rel.fromPin === 'Zone')
		.map(rel => def.FindObject(rel.fromNode))
		.filter(o => o.type === 'function');

	//DEBUG:
	console.log(`Assets`, assets);
	//DEBUG:
	console.log(`Functions`, funcs);

	// Validate Functions
	const rc = new ReportReceiver();
	funcs.forEach(f => ValidateFunction(rc.report, f, def));

	console.log(rc.reports);

})();

function ValidateFunction(report, fnObj, layer) {
	const fdef = functiondef_db[fnObj.kind];
	if( !fdef ) return report('error', `Failed to find function type "${fnObj.kind}"`);

	
}
