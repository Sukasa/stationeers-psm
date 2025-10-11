
// Get/Set functions for the IndexedDB-based Key/Value store.
const PSSet = IDB_KEYVAL.set;
const PSGet = IDB_KEYVAL.get;

// Rendering function for extremely shorthand HTML DOM generation.
function $() {
	var carried = null;
	for (var i = 0; i < arguments.length; ++i) {
		const a = arguments[i];
		if (typeof a === 'string') {
			if (a[0] === '#') {
				// Find a specific named element in the document.
				carried = document.getElementById(a.slice(1));
			} else if (a[0] === '=') {
				if (!(carried instanceof HTMLElement))
					throw new Error("can only set text content of HTML elements");
				carried.append(document.createTextNode(a.slice(1)));
			} else {
				// Create a new element in the document.
				const n = document.createElement(a);
				if (carried instanceof HTMLElement) carried.appendChild(n);
				carried = n;
			}

		} else if (a instanceof Array) {
			if (typeof carried !== 'object')
				throw new Error("array spread can only be meaningfully applied to an object");
			if (i < arguments.length - 1)
				throw new Error("array spread must be last `$` argument if present");
			a.forEach(i => {
				if (i === undefined || i === null || i === true || i === false) {
					// Ignore safely.
				} else if (i instanceof HTMLElement) {
					// Add this element, keep the same target for later elements.
					carried.appendChild(i);
				} else if (i instanceof Array) {
					// Recurse the $ script with the current target and the contents of this array.
					$(carried, ...i);
				} else {
					throw new Error("array spread must have only HTML elements or arrays of `$` expressions");
				}
			});
			return carried;

		} else if (typeof a === 'object') {
			if (carried === null) {
				// Make this object the new target.
				carried = a;
			} else if (a instanceof HTMLElement) {
				// Add an HTML element, then use it as the new target.
				carried.appendChild(a);
				carried = a;
			} else if (a) {
				// Set properties or add listeners.
				Object.keys(a).forEach(k => k[0] === '?'
					? carried.addEventListener(k.slice(1), a[k])
					: carried instanceof HTMLElement && carried[k] === undefined
						? carried.setAttribute(k, a[k])
						: carried[k] = a[k]);
			}

		} else if (a === undefined || a === null || a === true || a === false) {
			// Ignore safely.

		} else {
			throw new Error("couldn't understand intent behind `$` argument #" + i);
		}
	}
	return carried;
}

var avail_workspaces = [], active_workspace = null, active_data = null;

window.onload = () => {
	PSGet('workspaces').then(async workspaces => {
		avail_workspaces = workspaces ?? [];
		rerender();
	}, err => {
		avail_workspaces = [];
		PSSet('workspaces', []);
		rerender();
	});

	onResize();
}

window.onresize = onResize;
function onResize() {
	document.body.className = window.innerWidth < 1.4 * window.innerHeight
		? 'narrow-viewport' : 'wide-viewport';
}

const _prerender_teardowns = [];
function preRerender(obj, cb) {
	_prerender_teardowns.push(cb);
	return obj;
}

const _postrender_setups = [];
function postRender(cb) {
	_postrender_setups.push(cb);
}

var isRenderQueued = false, isRendering = false;
function rerender() {
	if( isRendering ) {
		console.warn(`rerender() attempted while rendering; ignoring!`);
		return;
	}
	if( isRenderQueued ) return;
	isRenderQueued = true;

	requestAnimationFrame(() => {
		const _s = performance.now();

		isRenderQueued = false;
		_prerender_teardowns.forEach(cb => {try{cb()} catch(e) { console.error("During pre-rerender callback:", e);}});
		_prerender_teardowns.length = 0;

		isRendering = true;
		try {
			render();
		} finally {
			isRendering = false;
		}
		
		_postrender_setups.forEach(cb => {try{cb()} catch(e) { console.error("During post-render callback:", e);}});
		_postrender_setups.length = 0;

		const _e = performance.now();
		console.debug(`Rerender took ~${Math.round((_e - _s)*1000)/1000}ms`);
	});
}

function forgetWorkspace(w) {
	var idx = avail_workspaces.indexOf(w);
	if( idx >= 0 ) {
		avail_workspaces.splice(idx, 1);
		PSSet('workspaces', avail_workspaces);
		rerender();
	}
}

async function addNewWorkspace() {
	showDirectoryPicker({mode: 'readwrite'})
		.then(d => {
			const w = {handle:d, name: new Date().toString(), data:{}};
			avail_workspaces.push(w)
			PSSet('workspaces', avail_workspaces);
			active_workspace = w;
			rerender();
		}, err => {
			// Nothing to be done.
		});
}

function renameWorkspace(w) {
	const nname = prompt("New name for the workspace?", w.name);
	if( !nname ) return;
	w.name = nname;
	PSSet('workspaces', avail_workspaces);
	rerender();
}

async function loadWorkspace(w) {
	const opt = { mode: 'readwrite' };
	if( 'granted' !== await w.handle.queryPermission(opt) && 'granted' !== await w.handle.requestPermission(opt) )
		return forgetWorkspace(w);

	try {
		const fh = await w.handle.getFileHandle("workspace.json", {create:true});
		const rd = await fh.getFile();
		w.data = new GraphLayer();
		w.data.Deserialize(await rd.text());
	} catch {
		w.data = new GraphLayer();
	}

	try {
		const fh = await w.handle.getFileHandle("state.json", {create:true});
		const rd = await fh.getFile();
		w.state = JSON.parse(await rd.text());
	} catch {
		w.state = {diagram:{}, navigation:{}, properties:{}};
	}

	active_workspace = w;
	active_workspace.update = rerender;
	active_workspace.save = async function() {
		try {
			const fh = await w.handle.getFileHandle("workspace.json", {create:true});
			const wt = await fh.createWritable();
			await wt.write(this.data.Serialize());
			await wt.close();
		} catch { }
		try {
			const fh = await w.handle.getFileHandle("state.json", {create:true});
			const wt = await fh.createWritable();
			await wt.write(JSON.stringify(this.state, undefined, 2));
			await wt.close();
		} catch { }
	};

	rerender();
}

var windowZ;
function renderWindow(target, options, content) {
	if( !target || !options ) throw new Error("bad arguments to renderWindow()");
	return $(target, "div", { className: `window-outer ${options?.className ?? ''}`, style: `z-index: +${windowZ++}`, }, [
		["div", { className: `window-inner ${options?.className ?? ''}` }, [
			["div", { className: 'window-title' }, "=" + (options?.title ?? "SPSM")],
			["div", { className: 'window-body' }, content ?? undefined],
		]]
	]);
}

// A debug tool for generating a 'failover' script used for non-Chrome browsers
// Save in `./failover.js` relative to `index.html`
window.dump = () => {
	document.body.innerHTML = '';
	$(document.body, "pre", `=window.workspace_failover = ${w.data.Serialize()};\n\nwindow.state_failover = ${JSON.stringify(w.state,null,2)};\n`);
};

var failoverLoading = false;
function renderWorkspaceSelector(target) {
	if( window.showDirectoryPicker === undefined ) {
		// If no filesystem access API is available, try to load the `failover` script.
		if( window.failover_failed ) {
			return renderWindow(target, { title: "No Failover Available!", className: "center autosize dialog modal" }, [
				["div", "=You need to dump a functional workspace into `./failover.js` to operate without FilesystemAPI support."],
			]);

		} else if( window.workspace_failover && failoverLoading ) {
			failoverLoading = false;

			const w = {};
			w.data = new GraphLayer();
			w.data.Deserialize(JSON.stringify(window.workspace_failover));
			w.state = window.state_failover ?? {diagram:{}, navigation:{}, properties:{}};

			active_workspace = w;
			active_workspace.update = rerender;
			active_workspace.save = () => {};

			setTimeout(rerender, 0);
			return;

		} else if( !failoverLoading ) {
			failoverLoading = true;
			$(document.head, $("script", {src:"./failover.js", '?error': () => {
				failoverLoading = false;
				window.failover_failed = true;
			}}));
		}

		renderWindow(target, { title: "Loading failover...", className: "center autosize dialog modal"});
		setTimeout(rerender, 100);
		return;
	}

	renderWindow(target, { title: "Load Workspace", className: "center autosize dialog modal" }, [
		["h3", "=Recent"],
		...avail_workspaces.map(w => ["div", [
			["button", "=Load", {'?click': () => loadWorkspace(w)}],
			["button", "=Rename", {'?click': () => renameWorkspace(w)}],
			["button", "=Forget", {'?click': () => forgetWorkspace(w)}],
			["span", {className: 'label'}, "="+w.name],
		]]),
		["h3", "=Open New"],
		["button", "=Select", {'?click': addNewWorkspace}],
	]);
}

function render() {
	const root = document.body;
	root.innerHTML = '';
	windowZ = 1;

	if( ! active_workspace ) {
		renderWorkspaceSelector(root)
	} else {
		renderWorkspace(root, active_workspace)
	}
};


function renderWorkspace(target, workspace) {
	renderWindow(target, { title: 'Diagram', className: 'psm-diagram printable xyscroll', scrollLeft: workspace.state.scrollX??0, scrollTop: workspace.state.scrollY??0 }, renderDiagramView(workspace.data, workspace.state));
	renderWindow(target, { title: 'Properties', className: 'psm-properties vscroll' }, renderProperties(workspace.data, workspace.state));
	renderWindow(target, { title: 'Navigation', className: 'psm-navigation vscroll' }, renderNavigation(workspace.data, workspace.state));
	workspace.save();
}

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

function renderProperties(D, S) {
	const selected = S.selection ?? (S.selection = []);
	if( selected.length === 0 ) return [];

	const editing = selected[0];
	//TODO: determine what is being edited, and build property editor for it

	return [["h2", "=Props of " + String(editing)]];
}

function renderNavigation(D, S) {
	const selected = S.selection ?? (S.selection = []);

	return [["h2", "=nav"]];
}
