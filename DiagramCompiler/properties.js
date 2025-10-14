
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

	MP.forEach(pin => {
		if( pin.passive ) return;
		const Vs = D.RelationsOf(editing.id, pin.name);

		$(E, "div", {className:'label'}, '='+pin.name);

		Vs.forEach(rel => {
			$(E, "div", {className:'value'}, '=TODO '+rel.toNode);
		});

		if( Vs.length === 0 || pin.array )
			$(E, "div", {className:'value'}, '=(add)');
	});


	return [E];
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
