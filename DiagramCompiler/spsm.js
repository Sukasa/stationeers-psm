
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
				if (!(carried instanceof Node))
					throw new Error("can only set text content of HTML elements");
				carried.append(document.createTextNode(a.slice(1)));
			} else {
				// Create a new element in the document.
				const n = document.createElement(a);
				if (carried instanceof Node) carried.appendChild(n);
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
				} else if (i instanceof Node) {
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
			} else if (a instanceof Node) {
				// Add an HTML element, then use it as the new target.
				carried.appendChild(a);
				carried = a;
			} else if (a) {
				// Set properties or add listeners.
				Object.keys(a).forEach(k => k[0] === '?'
					? carried.addEventListener(k.slice(1), a[k])
					: carried instanceof Node && carried[k] === undefined
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
	_prerender_teardowns.push(cb ?? obj);
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
	$(document.body, "pre", `=window.workspace_failover = ${active_workspace.data.Serialize()};\n\nwindow.state_failover = ${JSON.stringify(active_workspace.state,null,2)};\n`);
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
	const activeDiagram = workspace.data.FindObject(workspace.state?.diagram?.view?.drawing);
	const dwndTitle = (activeDiagram && metanode_db['drawing'].Name(activeDiagram)) ?? 'Diagram';
	renderWindow(target, { title: dwndTitle, className: 'psm-diagram printable xyscroll', scrollLeft: workspace.state.scrollX??0, scrollTop: workspace.state.scrollY??0 }, renderDiagramView(workspace.data, workspace.state));
	renderWindow(target, { title: 'Properties', className: 'psm-properties vscroll' }, renderProperties(workspace.data, workspace.state));
	renderWindow(target, { title: 'Navigation', className: 'psm-navigation vscroll' }, renderNavigation(workspace.data, workspace.state));
	workspace.save();
}

function stringSequentialMatch(query, candidate) {
	var i = 0, j = 0;
	while( i < query.length ) {
		const q = query[i++];
		if( q <= ' ' ) continue;
		const p = candidate.indexOf(q, j);
		if( p === -1 ) return false;
		j = p + 1;
	}
	return true;
}

function AddCommit(D,S,recipe) {
	//TODO:
	rerender();
}

var addInProgress = false;
function AddProcess(D,S) {
	if( addInProgress ) return;
	addInProgress = true;

	const resultBox = $("div", {className:'add-list'});
	const filterBox = $("input", {
		type:'text', className:'add-filter',
		'?blur': onblur,
		'?keyup': onkeyup
	});
	const resList = [];
	var lastFilter = null;

	function onblur() {
		updateFilter();
	}
	function onkeyup(evt) {
		if( evt.key === 'Escape' ) {
			filterBox.removeEventListener('blur', onblur);
			return rerender();
		}

		if( evt.key >= '1' && evt.key <= '9' && evt.ctrlKey ) {
			// Create nth search result immediately!
			var idx = evt.key.charCodeAt(0) - 49;
			if( resList.length > idx ) {
				evt.preventDefault();
				AddCommit(D,S,resList[idx]);
			}
		
		} else if( evt.key === 'Enter' && resList.length === 1 && filterBox.value === lastFilter ) {
			// User accepts this single result
			evt.preventDefault();
			AddCommit(D,S,resList[0]);

		} else if( evt.key === 'Enter' ) {
			// User wants to update search
			lastFilter = filterBox.value;
			evt.preventDefault();
			updateFilter();
		}
	};

	const sortRecipes = (a,b) => {
		if( a.priority === b.priority ) return a.label < b.label ? -1 : +1;
		return a.priority - b.priority;
	}
	const recipes = Object.values(metanode_db)
		.flatMap(meta => meta.Addable?.() ?? []);

	function updateFilter() {
		resultBox.innerHTML = '';
		const term = filterBox.value.toLowerCase();

		resList.length = 0;
		recipes.forEach(r => {
			if( stringSequentialMatch(term, r.label.toLowerCase()) ) resList.push(r);
		})
		resList.sort(sortRecipes);

		var lastGroup = null;
		resList.forEach((r,i) => {
			if( r.group !== lastGroup ) {
				$(resultBox, "div", "="+r.group, {
					className: 'search-group',
				});
				lastGroup = r.group;
			}

			$(resultBox, "div", {
				className: 'search-result',
				'?click': () => AddCommit(D,S,r)
			}, [
				["div", {className:'index'}, "=" + (i < 9 ? (i+1) : '')],
				["div", {className:'icon' }], //TODO: icon
				["div", {className:'label'}, "="+r.label],
			]);
		});
	};

	renderWindow(document.body, {
		title: 'Add New',
		className: 'psm-add-object dialog modal'
	}, [
		["div", {className: 'filters'}, [filterBox]],
		resultBox,
	]);

	setTimeout(() => {
		filterBox.focus();
		updateFilter();
	}, 1);
	preRerender(() => {
		addInProgress = false;
	});
}
