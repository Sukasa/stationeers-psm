
function renderProperties(D, S) {
	const selected = S.selection ?? (S.selection = []);
	const opts = S.propertyEdit ?? (S.propertyEdit = {});

	if( selected.length === 0 ) return [];
	const editing = D.FindObject(selected[0]);
	if( ! editing ) return [];
	const meta = metanode_db[editing.type];
	if( ! meta ) return [];
	const E = $("div", { className:'properties-table', });

	const MF = meta.Fields(editing), MP = meta.Pins(editing);
	
	MF.forEach(f => {
		if( f.hidden && !opts.ShowAll ) return;

		$(E, [
			["div", { className:'label', }, '='+f.name],
			EditorFor($("div", { className:'value', }), f, editing.properties?.[f.name] ?? f.value, v => {
				if( v === editing.properties?.[f.name] ) return;
				editing.properties = editing.properties ?? {};
				editing.properties[f.name] = v;
				rerender();
			}),
		]);
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
			const to = D.FindObject(rel.toNode);
			const via = rel.viaNode && D.FindObject(rel.viaNode);

			$(E, "div", {className:'value'}, [
				["button", "=X", {'?click': () => rm(rel)}],
				["span", "=" + metanode_db[to.type].Name(to) + (rel.toPin ? ` (${rel.toPin})` : '')],
			]);

			if( via ) {
				$(E,
					"div", {className:'value via'},
					"span", `=via ${metanode_db[via.type].Name(via)}` + (rel.viaPin ? ` (${rel.viaPin})` : '')
				);
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
	const opts = D.Objects(o => (cval?.toNode === o.id || !values.find(r => r.toNode === o.id)) && ObjectValidForPin(o, pin));
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

function EditorFor(tgt, field, val, setter)
{
	switch(field.type) {
		case 'constant':
			return ConstantEditor(tgt, field, val, setter);
		
		case 'map':
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
		$(tgt, "input", {type: 'text', defaultValue:String(val), value: String(val), '?blur': commitString(setter),});
	
	} else if( field.subtype === 'number' ) {
		$(tgt, "input", {type: 'text', defaultValue:String(val), value: String(val), '?blur': commitNumber(setter),});
		if( field.unit ) $(tgt, "span", {className:'unit', }, "="+field.unit);

	} else if( field.subtype === 'list' ) {
		const S = $(tgt, "select", {'?change': commitString(setter)}, field.options.map(opt => ["option", {value:opt.name}, "="+opt.label]));
		S.value = val;

	} else {
		$(tgt, "pre", "= ??" + field.subtype);
	}

	return tgt;
}
