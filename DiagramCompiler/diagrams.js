
const RDVref = {diagram:null, data:null, pad:null};
function renderDiagramView(D, S) {
	const selected = S.selection ?? (S.selection = []);
	const {drawing,zoom} = S.diagram.view ?? (S.diagram.view = {drawing:null, zoom:1});

	const diagram = $("div", {
		className:'diagram-root',
		scrollLeft: S.scrollX ?? 0,
		scrollTop: S.scrollY ?? 0,
	});

	const dgrams = D.Objects(o => o.type === 'drawing');
	var active = dgrams.find(d => d.id === drawing);
	if( dgrams.length === 0 ) {
		const ins = {type: 'drawing', id: D.NewId(), properties: {Name:'New Drawing', defaultNodeType:'functional'}};
		dgrams.push(ins);
		D.AddObject(ins);
	}
	if( !active ) {
		active = dgrams[0];
		S.diagram.view = active.id;
	}

	const FUNCNODESZ = 150;
	const SCHEMNODESZ = 80;

	var minX = +Infinity, minY = +Infinity, maxX = -Infinity, maxY = -Infinity;
	const content = D.RelationsOf(active.id, 'Component');
	
	content.forEach(c => {
		// Assert sanity on x/y/as values, and gather range.
		if( ! c.properties ) c.properties = {};
		if( undefined === c.properties.as ) c.properties.as = 'functional';
		if( 'number' !== typeof c.properties.x ) c.properties.x = 0;
		if( 'number' !== typeof c.properties.y ) c.properties.y = 0;
		
		const {x,y,as} = c.properties;
		const sz = 'functional' === as ? FUNCNODESZ : SCHEMNODESZ;
		minX = Math.min(minX, x); maxX = Math.max(maxX, x+sz);
		minY = Math.min(minY, y); maxY = Math.max(maxY, y+sz);
	});

	const pad = Math.max(window.innerWidth, window.innerHeight) / 6;
	const totalWidth = pad*2 + maxX - minX, totalHeight = pad*2 + maxY - minY;
	$(diagram, "div", {
		className: `drawing-br-anchor`,
		style: `left: ${totalWidth}px; top: ${totalHeight}px;`,
	});

	const toggleSelect = id => {
		const idx = selected.indexOf(id);
		if( idx === -1 ) {
			selected.push(id);
		} else {
			selected.splice(idx, 1);
		}
		rerender();
	};

	const titleClickHandler = comp => evt => {
		if( evt.shiftKey ) {
			toggleSelect(comp.toNode);
		} else {
			selected.length = 0;
			selected.push(comp.toNode);
			rerender();
		}
	};

	const titleDragHandler = (el, comp) => evt => {
		if( selected.length !== 1 || selected[0] !== comp.toNode || evt.button !== 0 ) return;
		evt.preventDefault();

		var relX = evt.clientX, relY = evt.clientY;

		document.onmouseup = ed => {
			if( !ed.ctrlKey ) {
				// Snap final coordinates
				comp.properties.x = Math.round(comp.properties.x / 50) * 50;
				comp.properties.y = Math.round(comp.properties.y / 50) * 50;
			}
			document.onmouseup = document.onmousemove = null;
			rerender();
		};

		document.onmousemove = em => {
			em.preventDefault();
			const dx = relX - em.clientX;
			const dy = relY - em.clientY;
			relX = em.clientX;
			relY = em.clientY;
			comp.properties.x -= dx;
			comp.properties.y -= dy;

			var ex = !em.ctrlKey ? Math.round(comp.properties.x / 50) * 50 : comp.properties.x;
			var ey = !em.ctrlKey ? Math.round(comp.properties.y / 50) * 50 : comp.properties.y;
			el.style = `z-index: +999; left: ${pad + ex - minX}px; top: ${pad + ey - minY}px`;
		};
	};

	const pass_anchors = {};

	function renderFunctionalComponent(target, comp) {
		var refComp = D.FindObject(comp.toNode);
		const metanode = metanode_db[refComp.type];

		const e = $(target, "div", {
			className: `drawing-node ${comp.properties.as}-node ${refComp.type}-type selectable ${selected.includes(comp.toNode) ? 'selected' : ''}`,
			style: `left: ${pad + comp.properties.x - minX}px; top: ${pad + comp.properties.y - minY}px`,
		});

		const ni = $("div", {className: 'pin-output'});
		pass_anchors[`N/${refComp.id}`] = ni;
		$(e, "div", {
				className: `title draggable`,
				'?click': titleClickHandler(comp),
				'?mousedown': titleDragHandler(e, comp),
			}, [
				ni,
				["div", {className:'label'}, "="+(metanode?.Name(refComp) ?? refComp?.type)]
			]
		);

		metanode.Pins(refComp).forEach(pin => {
			const vals = D.RelationsOf(refComp.id, pin.name);
			
			const MakePin = (v) => {
				const pi = $("div", {className: 'pin-input'});
				const po = $("div", {className: 'pin-output'});
				if( !pin.inert ) pass_anchors[`L/${refComp.id}:${pin.name}:${v?.fromIndex ?? '-'}`] = pi;
				pass_anchors[`R/${refComp.id}:${pin.name}`] = po;
				return $(e, "div", {className: 'pin'}, [
					(pin.inert?null:pi), po, ["div", {className: 'label'}, '=' + pin.name + (pin.array?` [${v?.fromIndex??'+'}]`:'')],
				]);
			};

			// Each value connected gets a pin row
			vals.forEach(MakePin);

			// Add an empty pin if values is empty or pin is 'array'.
			if( vals.length === 0 || pin.array )
				MakePin(null);
		});
	}

	const rels = [];
	content.forEach(c => {
		D.RelationsOf(c.toNode).forEach(r => rels.push(r));
		if( c.properties.as === 'functional' ) {
			renderFunctionalComponent(diagram, c);
		} else {
			//TODO: other component types
			console.warn(`unhandled diagram component type ${c.properties.as}`);
		}
	});

	//const viewbox = `0 0 ${totalWidth} ${totalHeight}`;
	const SVGNS = 'http://www.w3.org/2000/svg';
	const svg = $(document.createElementNS(SVGNS, 'svg'), { class: 'zigzag' });

	const ZigZag = (a,b,selected) => postRender(() => {
		//TODO: autoroute zigzagline if missing
		//TODO: draw zigzagline
		const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
		const cr = diagram.getBoundingClientRect();
		const x1 = ar.x - cr.x + ar.width/2, y1 = ar.y - cr.y + ar.height / 2;
		const x2 = br.x - cr.x + br.width/2, y2 = br.y - cr.y + br.height / 2;
		const xM = (x1 + x2) / 2 + (Math.abs(y2) % 9 - 4) * 4;

		a.classList.add('on-page');
		b.classList.add('on-page');
		const p = $(svg, document.createElementNS(SVGNS, "path"),
			{d:`M ${x1} ${y1} H ${xM} V ${y2} H ${x2}`});
		if( selected ) p.classList.add('selected');
	});

	// Render relations between all nodes for which both ends are present.
	console.debug(`Routing ${rels.length} potential connections`);
	rels.forEach(rel => {
		// Ignore relations from drawings
		if( rel.fromPin === 'Component' && rel.properties ) return;

		const oS = selected.includes(rel.fromNode), vS = selected.includes(rel.viaNode), fS = selected.includes(rel.toNode);
		const o = pass_anchors[`L/${rel.fromNode}:${rel.fromPin}:${rel.fromIndex ?? '-'}`];
		const v = rel.viaNode && pass_anchors[`R/${rel.viaNode}:${rel.viaPin}`];
		const f = (rel.toPin === undefined && pass_anchors[`N/${rel.toNode}`])
			|| pass_anchors[`R/${rel.toNode}:${rel.toPin}`];

		if( o && v ) {
			// Route from O to V
			ZigZag(o, v, oS || vS);
			
			// Check for route from V's LHS to F
			const vl = pass_anchors[`L/${rel.viaNode}:${rel.viaPin}`];
			if( vl && f ) {
				// Route from VL to F
				ZigZag(vl, f, vS || fS);
			}

		} else if( o && f ) {
			// Route from O to F
			ZigZag(o, f, oS || fS);

		} else if( o && !v && !f ) {
			// FromNode needs off-page icon
			o.classList.add(`off-page`);

		} else {
			if( v ) {
				// V needs off-page icon
				v.classList.add(`off-page`);
			}
			if( f ) {
				// F needs off-page icon
				f.classList.add(`off-page`);
			}
		}
	});

	// Add the SVG to the document after all paths are rendered to it.
	postRender(() => setTimeout(() => diagram.append(svg), 0));

	function NextIndex() {
		return content.reduce((a,c) => Math.max(a, c.fromIndex + 1), 0);
	}

	function AddAction(evt) {
		if( ! evt.altKey ) return;
		const atX = evt.clientX, atY = evt.clientY;

		//TODO: show dialog to select the object to add
		
		// For now, pick any function/equipment component not already included in the diagram
		const choices = D.Objects(o => -1 !== ['equipment','function'].indexOf(o.type) && !content.find(c => c.toNode === o.id));
		if( choices.length === 0 ) return;
		const pickedNode = choices[0].id;

		D.AddRel({
			fromNode: active.id, fromPin: 'Component',
			fromIndex: NextIndex(), toNode: pickedNode,
			properties:{as: active.properties?.defaultNodeType ?? 'functional', x: atX - pad, y: atY - pad}
		});
		rerender();
	}

	//DEBUG: console.log(`Content:`, content);
	//DEBUG: console.log(`State:`, S);

	postRender(() => {
		diagram.parentNode.scrollLeft = S.scrollX;
		diagram.parentNode.scrollTop = S.scrollY;
		diagram.parentNode.onclick = AddAction;
	});
	return preRerender(diagram, () => {
		S.scrollX = diagram.parentNode.scrollLeft;
		S.scrollY = diagram.parentNode.scrollTop;
	});
}
