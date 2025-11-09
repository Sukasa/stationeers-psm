


function renderCompile(D, S) {
	const result = S.compilations[S.activeZone];
	let activeProc = S.compile_proc ?? undefined;
	console.log(result);

	document.body.classList.add('showing-compile');
	preRerender(() => document.body.classList.remove('showing-compile'));
	const root = [];

	if( !result?.reports?.length )
		return [["div", "=No compilation result; hit Compile to run!"]];

	const processors = Object.keys(result.code)
		.map(k => ({proc:D.FindObject(k), code:result.code[k]}))
		.map(({proc,code}) => ({proc, code, label: metanode_db[proc.type].Name(proc)}))
		.sort(({label:a}, {label:b}) => a < b ? -1 : +1);

	if( processors.length > 0 ) {
		if( !processors.find(({proc}) => proc.id === activeProc) )
			activeProc = processors[0].proc.id;
		const active = processors.find(({proc}) => proc.id === activeProc);
		
		const lines = active.code.split("\n");
		const [lnos,body,comment] = lines.reduce(([lnos,body,comment], line, i) => {
			lnos += '\n' + i + ': ';
			const s = line.indexOf('#');
			const before = s === -1 ? line : line.substr(0,s).trim();
			const after = s === -1 ? '' : line.substr(s);

			body += '\n' + before;
			comment += '\n' + (after ? ' '+after : '');
			
			return [lnos,body,comment];
		}, ["","",""]);

		root.push(
			$("select", {value: activeProc, '?change': evt => {
				S.compile_proc = evt.currentTarget.value;
				rerender();
			}}, processors.map(p => ["option", {value:p.proc.id}, `=${p.label} (${lines.length} LoC, ${active.code.length} B)`])),

			$("div", {className: 'code'}, [
				["pre", {className:'lnos'}, "="+lnos.substr(1)],
				["pre", {className:'content'}, "="+body.substr(1)],
				["pre", {className:'comment'}, "="+comment.substr(1)]
			]),
			$("hr")
		);
	}

	//TODO: filter and sort reports!
	const filteredReports = result.reports;

	let lastGroup = null;
	root.push($("div", {className: 'reports'}, filteredReports.flatMap(r => {
		//TODO: format report lines in detail!

		// For now, just splat out the raw text.
		return [["div", `=${r.severity}: ${r.message}`]];
	})));

	return root;
}
