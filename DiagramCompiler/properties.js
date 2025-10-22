
function renderProperties(D, S) {
	const selected = S.selection ?? (S.selection = []);
	const opts = S.propertyEdit ?? (S.propertyEdit = {});

	if( selected.length === 0 ) return [];
	const editing = D.FindObject(selected[0]);
	if( ! editing ) return [];
	const meta = metanode_db[editing.type];
	if( ! meta ) return [];
	const E = $("div", { className:'properties-table', });

	const MF = meta.Fields(editing) ?? [], MP = meta.Pins(editing) ?? [];
	
	MF.forEach(f => {
		if( f.hidden && !opts.ShowAll ) return;

		$(E, [
			["div", { className:'label', }, '='+f.name],
			EditorFor($("div", { className:'value', }), f, editing, editing.properties?.[f.name] ?? f.value, v => {
				if( v === editing.properties?.[f.name] ) return;
				editing.properties = editing.properties ?? {};
				editing.properties[f.name] = v;
				rerender();
			}),
		]);

		if( f.name === 'Name' ) {
			$(E, "div", {className:'shortcut'}, '=F2');
		} else if( f.name === 'HideUnused' ) {
			$(E, "div", {className:'shortcut'}, '=H');
		}
	});

	if( MF.length + MP.length > 0 ) $(E, "hr");

	function rm(rel) {
		D.RemoveRel(rel);
		rerender();
	}

	MP.forEach(pin => {
		if( pin.passive ) return;
		const Vs = D.RelationsOf(editing.id, pin.name);

		$(E, "div", {className:'label'}, '='+pin.name);

		Vs.forEach(rel => {
			const to = rel.toNode && D.FindObject(rel.toNode);
			const via = rel.viaNode && D.FindObject(rel.viaNode);

			if( to ) {
				$(E, "div", {className:'value'}, [
					["button", "=X", {'?click': () => rm(rel)}],
					["span", "=" + metanode_db[to.type].Name(to) + (rel.toPin ? ` (${rel.toPin})` : ''), {
						className: 'link',
						'?click': () => {
							selected.length = 0; selected.push(to.id);
							rerender();
						},
					}],
				]);
			}

			if( via ) {
				$(E, "div", {className:'value via'}, [
					["span", '=via '],
					["span", '=' + metanode_db[via.type].Name(via), {
						className: 'link',
						'?click': () => {
							selected.length = 0; selected.push(via.id);
							rerender();
						},
					}],
					rel.viaPin && ["span", `= (${rel.viaPin})`],
				]);
			}
		});

		if( Vs.length === 0 ) {
			$(E, "div", {className:'value'}, "=(unconnected)");
		}
	});

	return [E];
}

function makePicker(D, objId, pin, values, cval) {
	//TODO: filter down to valid options
	const opts = D.Objects(o =>
		(cval?.toNode === o.id || !values.find(r => r.toNode === o.id))
		&& ObjectValidForPin(o, pin)
	);

	if( opts.length === 0 && !!cval ) {
		// The current value is NOT valid; let's move toward sanity by removing it.
		D.RemoveRel(cval);
	}
	if( opts.length === 0 ) {
		// There are no legal options; show no picker.
		return ['span', '=(none)'];
	}

	function onChange(evt) {

	}

	console.log(`Pin`, pin, `Val`, cval);
	opts.sort((a,b) => (a.properties?.Name ?? a.id) < (b.properties?.Name ?? b.id) ? -1 : +1);
	const sel = $('select', {'?change': onChangeObject}, opts.map(o => ["option", {value:o.id}]));
	
	return sel;
}


function commitString(setter) {
	return (evt) => {
		setter(evt.currentTarget.value);
	};
}

function commitCheck(setter) {
	return (evt) => {
		setter(evt.currentTarget.checked ? 1 : 0);
	};
}

function commitNumber(setter) {
	return (evt) => {
		const v = parseFloat(evt.currentTarget.value);
		if( isNaN(v) ) {
			evt.currentTarget.value = evt.currentTarget.defaultValue;
		} else {
			setter(v);
		}
	}
}

function EditorFor(tgt, field, object, val, setter)
{
	switch(field.type) {
		case 'constant':
			return ConstantEditor(tgt, field, val, setter);
		
		case 'map':
			return MapEditor(tgt, field, object, val, setter);

		case 'register':
		case 'buffer':
		default:
			$(tgt, "pre", "= ?" + field.type);
	}
	return tgt;
}

function ConstantEditor(tgt, field, val, setter)
{
	if( field.subtype === 'string' ) {
		const S = $(tgt, "input", {
			type: 'text',
			defaultValue:String(val),
			value: String(val),
			'?blur': commitString(setter),
		});

		function PickMe(evt) {
			if( evt.code === 'F2' && field.name === 'Name' ) {
				S.focus();
				S.setSelectionRange(0,-1);
			}
		}

		preRerender(() => window.removeEventListener('keyup', PickMe));
		postRender(() => window.addEventListener('keyup', PickMe));
	
	} else if( field.subtype === 'number' ) {
		$(tgt, "input", {type: 'text', defaultValue:String(val), value: String(val), '?blur': commitNumber(setter),});
		if( field.unit ) $(tgt, "span", {className:'unit', }, "="+field.unit);

	} else if( field.subtype === 'list' ) {
		const S = $(tgt, "select", {'?change': commitString(setter)}, field.options.map(opt => ["option", {value:opt.name}, "="+opt.label]));
		S.value = val;

	} else if( field.subtype === 'boolean' ) {
		$(tgt, "input", {type: 'checkbox', value:1, checked: !!val, '?change': commitCheck(setter),});

	} else {
		$(tgt, "pre", "= ??" + field.subtype);
	}

	return tgt;
}

function MapEditor(tgt, field, object, val, setter)
{
	const G = $(tgt, "div", {className: 'map-grid'});

	const remover = k => () => {
		delete val[k];
		rerender();
	};

	const writer = k => nv => {
		if( nv === '' || nv === null || nv === undefined ) {
			delete val[k];
			rerender();
		} else if( nv !== val[k] ) {
			val[k] = nv;
			rerender();
		}
	};

	if( !(field.keys instanceof Array) || !field.values )
		return $(tgt, [["pre", "=? bad map field spec"]]);

	var opts = field.keys.slice();
	if( val ) {
		for(var i = 0; i < opts.length; ++i) {
			const k = opts[i];
			const kv = val[opts[i]];
			if( kv === undefined ) continue;
			opts.splice(i--, 1);
			
			$(G, "div", {className:'map-key'}, [
				["button", "=X", {'?click': remover(k)}],
				document.createTextNode(k),
			]);
			const VE = $(G, "div", {className:'map-val'});
			ConstantEditor(VE, ('function' === typeof field.values ? field.values(object, k) : field.values) ?? {type:'constant', subtype:'string'}, kv, writer(k));
		}
	}

	if( opts.length > 0 ) {
		$(G, "div", {className:'adder'}, "select", {'?change': evt => {
			if( ! evt.currentTarget.value ) return;
			setter({
				...(val ?? {}),
				[evt.currentTarget.value]: '',
			});
		}}, [
			["option", {value:''}, "=Add..."],
			...opts.map(o => ["option", {value:o}, "="+o]),
		]);
	}

	return tgt;
}
