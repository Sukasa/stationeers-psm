
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

	const pad = window.innerWidth / 2;
	$(diagram, "div", {
		className: `drawing-br-anchor`,
		style: `left: ${pad*2 + maxX - minX}px; top: ${pad*2 + maxY - minY}px;`,
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

	function renderFunctionalComponent(target, comp) {
		const e = $(target, "div", {
			className: `drawing-node ${comp.properties.as}-node`,
			style: `left: ${pad + comp.properties.x - minX}px; top: ${pad + comp.properties.y - minY}px`,
		});

		$(e, "div", "="+comp.toNode, {
			className: 'title draggable selectable' + (-1 < selected.indexOf(comp.toNode) ? ' selected':''),
			'?click': titleClickHandler(comp),
			'?mousedown': titleDragHandler(e, comp),
		});

		var refComp = D.FindObject(comp.toNode);
		if( refComp.properties?.Name ) {
			$(e, "div", "="+refComp.properties.Name);
		}

		const metanode = metanode_db[refComp.type];
		metanode.Pins(refComp).forEach(pin => {
			const vals = D.RelationsOf(refComp, pin.name);
			
			// Each value connected gets a pin row
			vals.forEach(v => {
				$(e, "div", `=${v.toNode + (v.toPin?`:${v.toPin}`:'')} (${pin.name})`);
			});
			
			// Empty pin if values is empty or pin is 'array'.
			if( vals.length === 0 || pin.array ) {
				$(e, "div", `=(${pin.name})`);
			}
		});
	}

	content.forEach(c => {
		if( c.properties.as === 'functional' ) {
			renderFunctionalComponent(diagram, c);
		} else {
			//TODO: other component types
			console.warn(`unhandled diagram component type ${c.properties.as}`);
		}
	});

	//DEBUG: console.log(`Content:`, content);
	//DEBUG: console.log(`State:`, S);

	postRender(() => {
		diagram.parentNode.scrollLeft = S.scrollX;
		diagram.parentNode.scrollTop = S.scrollY;
	});
	return preRerender(diagram, () => {
		S.scrollX = diagram.parentNode.scrollLeft;
		S.scrollY = diagram.parentNode.scrollTop;
	});
}
