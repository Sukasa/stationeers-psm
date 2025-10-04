
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

var isRenderQueued = false;
function rerender() {
	if( isRenderQueued ) return;
	isRenderQueued = true;
	requestAnimationFrame(() => {
		isRenderQueued = false;
		render();
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

function renderWorkspaceSelector(target) {
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
	workspace.save();

	renderWindow(target, { title: 'Diagram', className: 'psm-diagram printable xyscroll' }, renderDiagramView(workspace.data, workspace.state));
	renderWindow(target, { title: 'Properties', className: 'psm-properties vscroll' }, renderProperties(workspace.data, workspace.state));
	renderWindow(target, { title: 'Navigation', className: 'psm-navigation vscroll' }, renderNavigation(workspace.data, workspace.state));
}

function renderDiagramView(D, S) {
	const selected = S.selection ?? (S.selection = []);
	const {drawing,zoom} = S.diagram.view ?? (S.diagram.view = {drawing:null, zoom:1});
	const root = $("div", {className:'diagram-root',});

	const dgrams = D.Objects(o => o.type === 'drawing');
	var active = dgrams.find(d => d.id === drawing);
	if( dgrams.length === 0 ) {
		active = {type: 'drawing', id: D.NewId(), properties: {Name:'New Drawing', defaultNodeType:'functional'}};
		dgrams.push(active);
		D.AddObject(active);
	}
	if( !active ) {
		active = dgrams[0];
	}

	const content = D.FindRelations(active.id)
		.filter(r => r.fromNode === active.id && r.fromPin === 'Component');

	//TODO: render each content
	console.log(content);

	return [root];
}

function renderProperties(D, S) {
	return [["h2", "=props"]];
}

function renderNavigation(D, S) {
	return [["h2", "=nav"]];
}
