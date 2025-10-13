
/* TEST DATA
const test_workspace = [
	// Equipment
	{type: 'equipment', kind: 'Gas Sensor', id: 'EK419931', properties: {
		'Name': 'Foyer Gas Sensor',
		'ReferenceId': 4108,
	}},
	{type: 'equipment', kind: 'Wall Heater', id: 'LC183102', properties: {
		'Name': 'Foyer Wall Heater',
		'ReferenceId': 1320,
	}},
	{type: 'equipment', kind: 'LED Display', id: 'TW818194', properties: {
		'Name': 'Temp Wall Display (North)',
		'Initialize': {Color:2, On:1, Mode:4},
		'ReferenceId': 4102,
	}},
	{type: 'equipment', kind: 'LED Display', id: 'TW37182', properties: {
		'Name': 'Temp Wall Display (South)',
		'Initialize': {Color:2, On:1, Mode:4},
		'ReferenceId': 4261,
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
	{type: 'equipment', kind: 'LED Panel', id: 'TW7191', properties: {
		'Name': 'High Temp Alarm Lamp',
		'Initialize': {Color:4, On:1},
		'ReferenceId': 4243,
	}},
	{type: 'equipment', kind: 'IC10 Socket', id: 'RG3123', properties: {
		'Name': 'Foyer Control A',
		'ReferenceId': 4118,
		'Lines': 128,
		'Memory': 512,
	}},
	{type: 'equipment', kind: 'IC10 Socket', id: 'RG3124', properties: {
		'Name': 'Foyer Control B',
		'ReferenceId': 5423,
		'Lines': 128,
		'Memory': 512,
	}},
	{type: 'equipment', kind: 'Utility Socket', id: 'UC48', properties: {
		'Name': 'Foyer Control RAM',
		'ReferenceId': 5766,
		'Lines': 0,
		'Memory': 8192,
	}},

	// Zone
	{type: 'zone', id: 'ZHab1', properties: {
		'Name': 'Habitat 1',
	}},

	{type: 'rel', fromNode: 'ZHab1', fromPin: 'Processor', fromIndex:0, toNode: 'RG3123'},
	{type: 'rel', fromNode: 'ZHab1', fromPin: 'Processor', fromIndex:1, toNode: 'RG3124'},
	{type: 'rel', fromNode: 'ZHab1', fromPin: 'RAM', toNode: 'UC48'},

	{type: 'rel', fromNode: 'UK381091', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UV8201',   fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'EQ818293', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG82030',  fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG7364',   fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG175689', fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'ZG7188',   fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG2022',   fromPin: 'Zone', toNode: 'ZHab1'},
	{type: 'rel', fromNode: 'UG497710', fromPin: 'Zone', toNode: 'ZHab1'},

	{type: 'rel', fromNode: 'UK381091', fromPin: 'Processor', toNode: 'RG3123'},
	{type: 'rel', fromNode: 'UV8201',   fromPin: 'Processor', toNode: 'RG3123'},
	{type: 'rel', fromNode: 'EQ818293', fromPin: 'Processor', toNode: 'RG3123'},
	{type: 'rel', fromNode: 'UG82030',  fromPin: 'Processor', toNode: 'RG3123'},
	{type: 'rel', fromNode: 'UG7364',   fromPin: 'Processor', toNode: 'RG3124'},
	{type: 'rel', fromNode: 'UG175689', fromPin: 'Processor', toNode: 'RG3124'},
	{type: 'rel', fromNode: 'ZG7188',   fromPin: 'Processor', toNode: 'RG3123'},
	{type: 'rel', fromNode: 'UG2022',   fromPin: 'Processor', toNode: 'RG3124'},
	{type: 'rel', fromNode: 'UG497710', fromPin: 'Processor', toNode: 'RG3124'},

	// Functions
	{type: 'function', kind: 'IR', id: 'UK381091', properties: {
		Name: 'TI-401 PV',
	}},
	{type: 'rel', fromNode: 'UK381091', fromPin: 'Source', toNode: 'EK419931', toPin: 'Temperature'},
	{type: 'rel', fromNode: 'UK381091', fromPin: 'Destination', toNode: 'HL13014'},

	{type: 'function', kind: 'XR', id: 'UV8201', properties: {
		Name: 'ACK input',
		'Signal': 1,
	}},
	{type: 'rel', fromNode: 'UV8201', fromPin: 'Source', toNode: 'RI39151'},
	{type: 'rel', fromNode: 'UV8201', fromPin: 'Destination', toNode: 'HL94912'},

	{type: 'function', kind: 'OR', id: 'EQ818293', properties: {
		Name: 'TI-401 PV (to HID)',
	}},
	{type: 'rel', fromNode: 'EQ818293', fromPin: 'Source', toNode: 'HL13014', viaNode: 'UK381091', viaPin: 'Destination'},
	{type: 'rel', fromNode: 'EQ818293', fromPin: 'Destination', fromIndex: 0, toNode: 'TW818194', toPin: 'Setting'},
	{type: 'rel', fromNode: 'EQ818293', fromPin: 'Destination', fromIndex: 1, toNode: 'TW37182', toPin: 'Setting'},

	{type: 'function', kind: 'AT', id: 'UG82030', properties: {
		Name: 'TI-401 low level alarm',
		'Test': 'slt',
		'Threshold': 283,
	}},
	{type: 'rel', fromNode: 'UG82030', fromPin: 'Input', toNode: 'UK381091'},
	{type: 'rel', fromNode: 'UG82030', fromPin: 'Destination', toNode: 'HL83018'},

	{type: 'function', kind: 'AS', id: 'UG7364', properties: {
		Name: 'TI-401 low level alarm',
	}},
	{type: 'rel', fromNode: 'UG7364', fromPin: 'Input', toNode: 'UG82030'},
	{type: 'rel', fromNode: 'UG7364', fromPin: 'State', toNode: 'HL92103'},
	{type: 'rel', fromNode: 'UG7364', fromPin: 'AckSignal', toNode: 'HL94912', viaNode: 'UV8201', viaPin: 'Destination'},

	{type: 'function', kind: 'AA', id: 'UG175689', properties: {
		Name: 'TI-401 low level alarm',
	}},
	{type: 'rel', fromNode: 'UG175689', fromPin: 'Input', toNode: 'UG7364'},
	{type: 'rel', fromNode: 'UG175689', fromPin: 'Display', toNode: 'TW3716'},

	{type: 'function', kind: 'AT', id: 'ZG7188', properties: {
		Name: 'TI-401 high level alarm',
		'Test': 'sgt',
		'Threshold': 302,
	}},
	{type: 'rel', fromNode: 'ZG7188', fromPin: 'Input', toNode: 'UK381091'},
	{type: 'rel', fromNode: 'ZG7188', fromPin: 'Destination', toNode: 'HH42018'},

	{type: 'function', kind: 'AS', id: 'UG2022', properties: {
		Name: 'TI-401 high level alarm',
	}},
	{type: 'rel', fromNode: 'UG2022', fromPin: 'Input', toNode: 'ZG7188'},
	{type: 'rel', fromNode: 'UG2022', fromPin: 'State', toNode: 'HL19371'},
	{type: 'rel', fromNode: 'UG2022', fromPin: 'AckSignal', toNode: 'HL94912', viaNode: 'UV8201', viaPin: 'Destination'},

	{type: 'function', kind: 'AA', id: 'UG497710', properties: {
		Name: 'TI-401 high level alarm',
	}},
	{type: 'rel', fromNode: 'UG497710', fromPin: 'Input', toNode: 'UG2022'},
	{type: 'rel', fromNode: 'UG497710', fromPin: 'Display', toNode: 'TW7191'},

	{type: 'data', id: 'HL94912', name:'ACK GROUP 1 TRIGGER', transient:true, properties: {}},
	{type: 'data', id: 'HL13014', name:'TI-401 PV', transient:true, properties: {}},
	{type: 'data', id: 'HL83018', name:'TI-401 LO ALARM TRIGGER', transient:true, properties: {}},
	{type: 'data', id: 'HL92103', name:'TI-401 LO ALARM STATE', transient:true, properties: {}},
	{type: 'data', id: 'HH42018', name:'TI-401 HI ALARM TRIGGER', transient:true, properties: {}},
	{type: 'data', id: 'HL19371', name:'TI-401 HI ALARM STATE', transient:true, properties: {}},


	{type: 'drawing', id: 'DW927741', properties: {'Name': 'Greenhouse Support Module',}},
	
	{type: 'rel', fromNode: 'DW927741', fromPin: 'Component', fromIndex: 0, toNode: 'EK419931', properties: {x:2, y:-1, as:'schematic'}},
	{type: 'rel', fromNode: 'DW927741', fromPin: 'Component', fromIndex: 1, toNode: 'LC183102', properties: {x:2, y:0, as:'schematic'}},
	{type: 'rel', fromNode: 'DW927741', fromPin: 'Component', fromIndex: 2, toNode: 'RG3123', properties: {x:2, y:1, as:'schematic'}},
	{type: 'rel', fromNode: 'DW927741', fromPin: 'Component', fromIndex: 3, toNode: 'TW818194', properties: {x:0, y:-1, as:'schematic'}},
	{type: 'rel', fromNode: 'DW927741', fromPin: 'Component', fromIndex: 4, toNode: 'RI39151', properties: {x:0, y:0, as:'schematic'}},
	{type: 'rel', fromNode: 'DW927741', fromPin: 'Component', fromIndex: 5, toNode: 'TW3716', properties: {x:0, y:1, as:'schematic'}},
];
*/

function ZoneCodeCompile(def, rc, cc) {
	// Gather function-related assets in Zone.
	const assets = def.FindRelations('ZHab1')
		.filter(rel => rel.fromNode === 'ZHab1'
			&& (rel.fromPin === 'Processor' || rel.fromPin === 'RAM'));

	// Gather Functions in Zone
	const funcs = def.RelationsOf('ZHab1', 'Zone')
		.map(rel => def.FindObject(rel.fromNode))
		.filter(o => o.type === 'function');

	// Gather Equipment in Zone which need Initialization code.
	const initEquip = funcs.flatMap(f => def.RelationsOf(f.id))
		.map(rel => def.FindObject(rel.toNode))
		.filter(o => o.type === 'equipment' && o.properties?.Initialize);
	
	initEquip.forEach(eq => {
		// Add Equipment Initialization functions for each 
		for(var initKey in eq.properties.Initialize) {
			const f = {
				id: def.NewId(),
				type: 'function',
				kind: 'EI',
				properties:{Name: `Init ${eq.id} ${initKey}`, Value: eq.properties.Initialize[initKey]},
				transient: true,
			};

			def.AddObject(f);
			def.AddRel({fromNode:f.id, fromPin:'Destination', toNode:eq.id, toPin:initKey});
			funcs.push(f);
		}
	});

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
				const LoCPerTick = n?.properties?.LoCPerTick ?? 128;
				const maxLines = n?.properties?.Lines ?? 128;
				const avail = [];
				for(var i = 0, m = n?.properties?.Registers ?? 16; i < m; ++i)
					avail.push(i);
				processors.push({
					node: ar.toNode,
					blocks: [],
					varsByFType: {},
					registersFree: avail,
					capacity: maxLines, free: maxLines,
					LoCPerTick: LoCPerTick,
				});
			} else if( ar.fromPin === 'RAM' ) {
				const maxSlots = n?.properties?.Memory ?? 512;
				storages.push({node: ar.toNode, buffers: [{id:null, name:'-BLOCK-NULLPTR-ALLOC-', addr:0, size:1}], capacity: maxSlots, free: maxSlots - 1});
			}
		});
	}

	const funcsByDep = [];
	if( ! rc.fatal ) {
		rc.setCategory('Dependency Graph');
		// Pull dependency strings to sequence related function code blocks.
		const fQueue = funcs.map(f => ({
			func: f,
			refs: def.RelationsOf(f.id)
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
							innerQueue.unshift(fQueue[i].func);
							fQueue.splice(i, 1);
							--i;
						}
					}
				}
			}
		}

		rc.report('info', `${rc.fatal ? 'Incompletely sequenced':'Sequenced'} functions as (${funcsByDep.map(f => f.id).join("; ")})`);
	}

	if( ! rc.fatal ) {
		rc.setCategory('Allocation');

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
				.map(r => def.FindObject(r.toNode))
				.filter(o => o?.type === 'data');
			datum.forEach(d => CheckAndValidateDatum(d, rc, storages));

			if( !typesOnce[f.kind] ) {
				// Process processor-wide register allocations
				typesOnce[f.kind] = true;
				functiondef_db[f.kind].properties?.forEach(pdef => {
					if( pdef.type !== 'register' ) return;
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
						rc.report('info', `Assigning Register r${nval} to Function Type "${f.kind}" Variable "${pdef.name}" in Processor "${proc.node}"`);
						const reg = proc.registersFree[idx];
						proc.registersFree.splice(idx, 1);
						const vlist = proc.varsByFType[f.kind] ?? (proc.varsByFType[f.kind] = {});
						vlist[pdef.name] = `r${reg}`;
					}
				});
			}
		});
	}

	// Table of processor compilation data {processor:, (each code block scope):[],}
	// Code blocks are wrapped with {func:, block:}, so substitution and arrays can be processed in scope.
	const procTables = {};

	if( ! rc.fatal ) {
		rc.setCategory('Code Sequencing');

		funcsByDep.forEach(fnObj => {
			const fproc = def.ReadRelation(fnObj.id, 'Processor');
			const fnDef = functiondef_db[fnObj.kind];

			const proc = procTables[fproc.id] = procTables[fproc.id] ?? {
				processor: processors.find(p => p.node === fproc.id),
				instances: {}, typesSeen: {},
				'zone-init': [], 'processor-init': [],
				'cycle-init': [], 'instance': [], 'cycle-outro': [],
			};

			proc.instances[fnObj.id] = fnObj;

			const CheckConstraint = c => {
				if( c.kind === 'different-processor' ) {
					const otherFn = def.ReadRelation(fnObj.id, c.target);
					if( !otherFn || fproc === def.ReadRelation(otherFn, 'Processor') ) {
						rc.report('warn', `Function "${fnObj.id}" is on same processor as "${c.target}"`);
						return false;
					}

				} else if( c.kind === 'same-processor' ) {
					const otherFn = def.ReadRelation(fnObj.id, c.target);
					if( !otherFn || fproc !== def.ReadRelation(otherFn, 'Processor') ) {
						rc.report('warn', `Function "${fnObj.id}" is on a different processor from "${c.target}"`);
						return false;
					}

				} else if( c.kind === 'immediately-after' ) {
					// Would be solved (if possible) by the function ordering phase.
					return true;

				} else if( c.kind === 'array-plural' || c.kind === 'array-singular' ) {
					var arity;
					if( fnDef.rels.find(r => r.name === c.target) ) {
						arity = def.RelationsOf(fnObj.id, c.target).length;
					} else if( fnDef.properties.find(r => r.name === c.target) ) {
						const a = fnObj.properties?.[c.target];
						if( a instanceof Array ) {
							arity = a.length;
						} else {
							arity = 0;
						}
					} else {
						rc.report('error', `Unable to find Relation or Property matching the constraint target "${c.target}"`);
						return false;
					}

					if( c.kind === 'array-plural' && arity > 1 ) return true;
					if( c.kind === 'array-singular' && arity === 1 ) return true;
					return false;

				} else {
					rc.report('error', `Unsupported function code block constraint type "${c.kind}"`);
				}
				return true;
			};

			const DistributeBlocks = blocks => {
				const groups = blocks.reduce((gs,b) => {
					const g = gs[b.group ?? ''] = gs[b.group ?? ''] ?? [];
					g.push(b);
					return gs;
				}, {});

				for(var gName in groups) {
					// Sanity-check, in case of refactoring above.
					if( groups[gName].length === 0 ) continue;

					// Evaluate constraints of blocks in this group. When a constraint fails,
					// remove that block from the `blocks` array.
					const goodBlocks = groups[gName].filter(f => {
						if( !f.constraints || f.constraints.length === 0 )
							return true;
						if( f.constraints.find(c => !CheckConstraint(c))) {
							blocks.splice(blocks.indexOf(f), 1);
							return false;
						} else {
							return true;
						}
					});

					if( gName === '' && goodBlocks.length < groups[gName].length ) {
						// If the group name is '' and any blocks failed constraints, report error.
						rc.report('error', `Function "${fnObj.id}" of type "${fnObj.kind}" failed some ungrouped code block constraints; see documentation.`);

					} else if( gName !== '' && goodBlocks.length === 0 ) {
						// If the gorup name is not '' and all blocks failed constraints, report error.
						rc.report('error', `Function "${fnObj.id}" of type "${fnObj.kind}" failed all code blocks in group "${gName}"; see documentation.`);

					} else if( gName !== '' ) {
						// If the group name is not '' and at least one block passed constraints, pick one
						// of those with the highest number of constraints, and remove all others from `blocks`.

						// Sort by constraint count ascending.
						goodBlocks.sort((a,b) => (a.constraints?.length ?? 0) - (b.constraints?.length ?? 0));
						// Keep one with a highest constraint count.
						goodBlocks.pop();
						// Remove all others.
						goodBlocks.forEach(gb => blocks.splice(blocks.indexOf(gb), 1));
					}
				}

				// Add all remaining `blocks` to processor code segments.
				blocks.forEach(b => {
					// Interpret 'array' scopes as though they were 'instance'; otherwise, use scopes as-is.
					const list = proc[b.scope === 'array' ? 'instance' : b.scope];
					if( !(list instanceof Array) ) {
						rc.report('error', `Unknown code block scope "${b.scope}" in function type "${fnObj.kind}"`);
						return;
					}

					var cnt = 1;
					if( b.scope === 'array' ) {
						const arel = def.RelationsOf(fnObj.id, b.target);
						const acfg = fnObj.properties?.[b.target];
						if( acfg instanceof Array && arel.length === 0 ) {
							cnt = acfg.length;
						} else if( arel.length > 0 && !(acfg instanceof Array) ) {
							cnt = arel.length;
						} else {
							rc.report('error', `Failed to infer arity source for Array scope block on function "${fnObj.id}", target "${b.target}"`);
							cnt = 0;
						}
					}
					list.push({func: fnObj, block:b, count:cnt});
				});
			};

			// Add 'code block index' to each block for debug purposes.
			const fblk = fnDef.blocks.map((b,i) => ({...b, index:i}));
			
			// Once-per-processor blocks.
			const IsProcScope = b => b.scope === 'processor-init' || b.scope === 'cycle-init' || b.scope === 'cycle-outro';
			if( !proc.typesSeen[fnObj.kind] ) {
				proc.typesSeen[fnObj.kind] = true;
				DistributeBlocks(fblk.filter(b => IsProcScope(b)));
				//TODO: for custom-code functions, insert processing here for the custom list in fnObj
			}

			// Once-per-instance blocks
			DistributeBlocks(fblk.filter(b => !IsProcScope(b)));
			//TODO: for custom-code functions, insert processing here for the custom list in fnObj
		});

		for(var procid in procTables) {
			const proc = procTables[procid];
			const CodeLen = L => L.reduce((t,b) => t + (b.count ?? 1) * b.block.code.length, 0);

			// Zone-init; once per function instance, once per processor power-up.
			const ziLen = CodeLen(proc['zone-init']);

			// Processor-init; once per function type, once per processor power-up.
			const piLen = CodeLen(proc['processor-init']);
			if( ziLen+piLen > 0) {
				rc.report('info', `Processor "${procid}" has ${ziLen+piLen} LoC of on-powerup init code`);
			}

			// Add yield to start of cycle-init.
			proc['cycle-init'].unshift({func:null, block:{scope:'cycle-init',code:[`yield`]}});

			// Add a jump (to that yield) to the end of cycle-outro.
			proc['cycle-outro'].push({func:null, block:{scope:'cycle-outro',code:[`j ${ziLen+piLen}`]}});

			// Total up all other code.
			const remLen = ['cycle-init','instance','cycle-outro'].reduce((t,L) => t + CodeLen(proc[L]), 0);

			if( ziLen+piLen+remLen > proc.processor.capacity ) {
				rc.report('error', `Processor "${proc.processor.node}" is allocated ${ziLen} zone-init LoC, ${piLen} processor-init LoC, and ${remLen} cycle LoC: but this puts it ${ziLen+piLen+remLen - proc.processor.capacity} over its LoC budget!`);
				continue;
			}

			// Calculate the best servable priority (how many ticks it takes to execute all code). Is always 1
			// in vanilla Stationeers, but we are aware of mods that e.g. increase the LoC limit to 512 without
			// changing the execution speed; such chips could run down to priority 4.
			proc.bestPriority = Math.ceil(remLen / proc.processor.LoCPerTick);
			rc.report('info', `Processor "${procid}" capable of serving Priority "${proc.bestPriority}" or worse, at ${remLen} LoC/cycle versus ${proc.processor.LoCPerTick} LoC/tick.`);

			for(var fnId in proc.instances) {
				const fnObj = proc.instances[fnId];
				const fnDef = functiondef_db[fnObj.kind];
				const pval = (fnDef.requiredPriority ?? fnObj.properties?.Priority) || 0;
				if( pval > 0 && pval < proc.bestPriority ) {
					rc.report('error', `Function "${fnId}" demands priority "${pval}" or better, but is assigned to Processor "${procid}" which can serve at best priority "${proc.bestPriority}"`);
				}
			}
		}
	}

	if( ! rc.fatal ) {
		rc.setCategory('Code Generation');
		const varsByFunc = {};

		const setter = (tgt, fnObj) => (k,v) => {
			if( tgt[k] === v ) {
				return;
			} else if( tgt[k] !== undefined ) {
				rc.report('warn', `Function "${fnObj.id}" Variable "${k}" was assigned multiple times!`);
			}
			
			if( typeof v === 'string' || typeof v === 'number' ) {
				tgt[k] = v;
			} else if( v === undefined ) {
				rc.report('error', `Function "${fnObj.id}" Variable "${k}" could not be evaluated?`);
			} else {
				rc.report('error', `Function "${fnObj.id}" Variable "${k}" was provided unusable value of type "${typeof v}"`);
			}
		}
		
		const ReduceArray = (vars, fnObj, def, vals, callback) => {
			if( def.array ) {
				const v = vars[def.name] = [];
				vals.forEach(r => {
					const cg = {};
					v.push(cg)
					callback(r, setter(cg, fnObj));
				});
			} else {
				callback(vals[0], setter(vars, fnObj));
			}
		};

		function SetRelsVariables(rc, proc, fnObj, vars, relDef, rels) {
			if( !relDef.array && rels.length > 1 ) {
				rc.report('error', `Function "${fnObj.id}" Relation "${relDef.name}" has bad relation arity; expected 1, saw ${rels.length}!`);
				return;
			} else if( !relDef.optional && rels.length === 0 ) {
				rc.report('error', `Function "${fnObj.id}" Relation "${relDef.name}" missing at least one required value.`);
				return;
			}

			switch(relDef.type) {
				case 'equipment':
					ReduceArray(vars, fnObj, relDef, rels, (rel, set) => {
						const ref = def.FindObject(rel.toNode)?.properties?.ReferenceId;
						set(rel.fromPin, ref);
						set(`${rel.fromPin}.ReferenceId`, ref);
						if( rel.toPin ) {
							set(`${rel.fromPin}.Logic`, rel.toPin);
						}
					});
					break;

				case 'data':
					ReduceArray(vars, fnObj, relDef, rels, (rel, set) => {
						const dataNode = def.FindObject(rel.toNode);
						set(`${rel.fromPin}.RAM`, def.FindObject(dataNode?.properties?.node)?.properties?.ReferenceId);
						set(`${rel.fromPin}.Addr`, dataNode?.properties?.addr)
					});
					break;
				
				case 'function':
					ReduceArray(vars, fnObj, relDef, rels, (rel, set) => {
						const itsVars = varsByFunc[rel.toNode];
						if( ! itsVars ) {
							rc.report('error', `Failed to look up variables of related function "${rel.toNode}"!`);
						} else {
							for(var k in itsVars) {
								const val = itsVars[k];
								// Make sure we don't inherit Array properties, which isn't allowed.
								if( typeof val !== 'string' && typeof val !== 'number' ) continue;
								// Enforce Law of Demeter, by excluding variables which were inherited from a third function?
								if( k.indexOf('.') !== k.lastIndexOf('.') ) continue;
								set(`${rel.fromPin}.${k}`, val);
							}
						}
					});
					break;
			}
		}

		function SetPropVariables(rc, proc, fnObj, vars, propDef, val) {
			if( !propDef.array && val instanceof Array ) {
				rc.report('error', `Function "${fnObj.id}" Property "${propDef.name}" has bad arity; expected single value, saw an array.`);
				return;
			} else if( propDef.array && !(val instanceof Array) ) {
				rc.report('error', `Function "${fnObj.id}" Property "${propDef.name}" has bad arity; expected array, saw a single value.`);
				return;
			}

			// Fall back on defaults when provided.
			if( val === undefined ) val = propDef.value;

			// For consistent `ReduceArray` interface compared to relations,
			// wrap a single value into an array.
			if( !propDef.array ) val = [val];

			switch(propDef.type) {
				case 'constant':
					ReduceArray(vars, fnObj, propDef, val, (v, set) => {
						set(propDef.name, v);
					});
					break;
				
				case 'register':
					// Nothing to be done; allocation was done earlier.
					break;

				case 'buffer':
					const data = def.ReadRelation(fnObj.id, propDef.name);
					const ram = def.FindObject(data.properties.node);
					ReduceArray(vars, fnObj, propDef, val, (v, set) => {
						set(`B.RAM`, ram.properties?.ReferenceId);
						set(`B.${propDef.name}`, data.properties.addr);
					});
					break;
			}
		}

		// Generate code
		funcsByDep.forEach(fnObj => {
			const vars = varsByFunc[fnObj.id] = {};
			const fnDef = functiondef_db[fnObj.kind];
			const fproc = def.ReadRelation(fnObj.id, 'Processor');
			const proc = processors.find(p => p.node === fproc.id);
			
			// Copy variables allocated at processor scope to each function vars
			const procFuncVars = proc.varsByFType[fnObj.kind] ?? {};
			for(var ftk in procFuncVars) vars[ftk] = procFuncVars[ftk];
			
			// Populate relation-based variables
			for(var rd of fnDef.rels)
				SetRelsVariables(rc, proc, fnObj, vars, rd, def.RelationsOf(fnObj.id, rd.name));

			// Populate property-based variables (which includes instance-scope register allocations)
			for(var pd of fnDef.properties)
				SetPropVariables(rc, proc, fnObj, vars, pd, fnObj.properties?.[pd.name]);

			//DEBUG: for(var k in vars) rc.report('debug', `Fn "${fnObj.id}" Variable "${k}" = "${vars[k]}"`);
		});

		const lpad = (n,s,r) => (r??' ').repeat(Math.max(0, n-String(s).length)) + s;
		const rpad = (n,s,r) => s + (r??' ').repeat(Math.max(0, n-String(s).length));
		
		for(var procid in procTables) {
			const proc = procTables[procid];
			const all_lines = [];
			['zone-init','processor-init','cycle-init','instance','cycle-outro'].forEach(section => {
				proc[section].forEach(({func,block,count}) => {
					const o_vars = (func && varsByFunc[func.id]) ?? {};
					const comments = true; //DEBUG:

					var next_comment = null;
					if( comments ) {
						if( !func ) {
							next_comment = `# (cycle control)`;
						} else if( block.scope === 'processor-init' || block.scope === 'cycle-init' ) {
							next_comment = `# [${func.kind}] (per-processor) CB#${block.index}${block.scope !== 'array'?'':` array:${block.target}`}`;
						} else {
							next_comment = `# [${func.kind}] "${func.properties?.Name ?? func.id}" CB#${block.index}${block.scope !== 'array'?'':` array:${block.target}`}`;
						}
					}
					
					const generate = (a_vars, code) => {
						code.forEach(line => {
							var ln = line.replaceAll(/%([^% ]*)%/g, (_, name) => {
								return a_vars[name] ?? `%FAILED: ${name}%`;
							});

							if( next_comment ) {
								ln = rpad(32,ln) + next_comment;
								next_comment = null;
							}
							all_lines.push(ln);
						});
					}

					if( block.scope === 'array' ) {
						for(var repl of o_vars[block.target]) {
							generate({...o_vars, ...repl}, block.code);
						}
					} else {
						generate(o_vars, block.code);
					}
				})
			});

			cc[procid] = all_lines.join('\n');
			if( /*DEBUG*/ false ) {
				console.log(`Processor "${procid}" Code:\n`,
					all_lines.reduce(([lst,acc],ln) => {
						if( ln[0] === '#' ) {
							lst.push([-1,ln]);
						} else {
							lst.push([acc++,ln]);
						}
						return [lst, acc];
					},[[],0])[0]
					.map(([lineNo,text],i) => `${lineNo < 0 ? '  ' : (lpad(3,lineNo,'0')+':')} ${text}`)
					.join('\n'));
			}
		}
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
				.RelationsOf(scopeTarget, 'Scope')
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

	if( 'function' === typeof fdef.validate ) {
		try {
			fdef.validate.call(fnObj, report, layer);
		} catch( e ) {
			report('error', `Exception in validation function of function "${fnObj.kind}": ${e}`);
		}
	}
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

/* DEBUG: run compiler on test data
(function() {
	// Create graph layer from prototype test data.
	const db = new GraphLayer();
	db.Deserialize(JSON.stringify(test_workspace));

	const timeStart = performance.now();
	// Make a sublayer upon the original graph.
	const def = new GraphLayer(db);
	const rc = new ReportReceiver();
	const cc = {};
	ZoneCodeCompile(def, rc, cc);
	const timeEnd = performance.now();

	rc.reports.forEach(e => console.log(`[${e.category}] ${e.severity}: ${e.message}`));
	console.log(`Done 1st prototype compile (${timeEnd - timeStart}ms)`);
	for(var proc in cc) {
		console.log(`Processor "${proc}" Code:`);
		console.log(cc[proc]);
	}
})();
*/
