
function LinkButton(D, S, obj) {
	const {drawFromPin} = DrawRelationState(D,S);

	if( drawFromPin && ObjectValidForPin(obj, drawFromPin) ) {
		return ["button", "=L", {
			'?click': () => CompleteDrawRelation(D, S, obj.id, null, null, null),
		}];
	}

	//TODO: if we are in a relation-drawing state, and this object qualifies as a destination of that link,
	// return a button which completes that linking action!
	return false;
}

function DeleteButton(D, S, obj) {
	return ["button", "=X", {
		"?click": () => {
			D.RemoveObject(obj);
			const i = S.selection.indexOf(obj.id);
			if( i > -1 ) S.selection.splice(i, 1);
			rerender();
		}
	}];
}

function ViewButton(D, S, obj) {
	return false;
	/*
	["button", "=V", {"?click": () => {

		//TODO: enumerate drawings mentioning this equipment,
		// find the one after the active one, make it the active one,
		// and center the view on an instance in that drawing.
	}}];
	*/
}

const categories = [
	{
		name:"Zones",
		iconClass: 'zone',
		gen(D) {
			return D.Objects(o => o.type === 'zone')
				.sort((a,b) => (a.properties?.Name ?? a.id) < (b.properties?.Name ?? b.id) ? -1 : +1);
		},
		actions(tgt,obj,D,S) {
			$(tgt, [
				DeleteButton(D, S, obj),
				LinkButton(D, S, obj),
			]);
		},
	},
	{
		name:"Drawings",
		iconClass: 'drawing',
		gen(D) {
			return D
				.Objects(o => o.type === 'drawing')
				.sort((a,b) => (a.properties?.Name ?? a.id) < (b.properties?.Name ?? b.id) ? -1 : +1);
		},
		actions(tgt,obj,D,S) {
			$(tgt, [
				["button", "=V", {"?click": () => {
					S.diagram.view = {drawing:obj.id, zoom:1};
					rerender();
				}}],
				DeleteButton(D, S, obj),
				LinkButton(D, S, obj),
			]);
		},
	},
	{
		name:"Equipment",
		iconClass: 'equipment',
		gen(D) {
			return D
				.Objects(o => o.type === 'equipment' || o.type === 'network')
				.sort((a,b) => (a.properties?.Name ?? a.id) < (b.properties?.Name ?? b.id) ? -1 : +1);
		},
		actions(tgt, obj, D, S) {
			$(tgt, [
				ViewButton(D, S, obj),
				DeleteButton(D, S, obj),
				LinkButton(D, S, obj),
			]);
		},
	},
	{
		name: "Functional",
		iconClass: 'functional',
		gen(D) {
			return D.Objects(o => o.type === 'data' || o.type === 'function' || o.type === 'metafunction')
				.sort((a,b) => (a.properties?.Name ?? a.id) < (b.properties?.Name ?? b.id) ? -1 :
				               (a.properties?.Name ?? a.id) > (b.properties?.Name ?? b.id) ? +1 :
							   (a.kind < b.kind) ? -1 : +1);
		},
		actions(tgt, obj, D, S) {
			$(tgt, [
				ViewButton(D, S, obj),
				DeleteButton(D, S, obj),
				LinkButton(D, S, obj),
			]);
		},
	}
];

function makeToggler(list, id) {
	return (evt) => {
		if( !(evt.ctrlKey || evt.shiftKey) ) {
			list.length = 0;
			list.push(id);
		} else if( list.includes(id) ) {
			list.splice(list.indexOf(id), 1);
		} else {
			list.push(id);
		}
		rerender();
	};
}

function renderNavigation(D, S) {
	const selected = S.selection ?? [];
	if( ! S.navigation ) S.navigation = {filters:{}};
	const togs = S.navigation.filters;

	const makeToggle = id => ["div", {
		className:`toggle toggle-${id.replaceAll('_','-')} ${togs[id]?'active':'inactive'}`,
		'?click': () => {togs[id]=!togs[id]; rerender()},
	}];

	const navRoot = $("div", { className:'nav-list' });
	const navMenu = $("div", {className:'nav-options'}, [
		["div", {
			className: `action action-compile`,
			'?click': () => {
				//TODO: compile, and pop-up the results
			}
		}],
		["div", {
			className: `action action-create`,
			'?click': () => AddProcess(D,S),
		}],
		
		["div", { style: "flex-grow: 1; "}],

		makeToggle('same_drawing'),
	]);

	const filterByToggles = (tog, item) => {
		//TODO: toggles (e.g. active diagram, active zone, related to selection)
		return true;
	};

	var text = (S.navigation?.text ?? '').toLowerCase();
	const defaultFilterByText = (text,item) =>
		(-1 !== item.id.toLowerCase().indexOf(text))
		|| (-1 !== (item.properties?.Name??'').indexOf(text));

	var lastCat = NaN;
	categories.forEach(cat => {
		var lastGroup = NaN;
		cat.gen(D).forEach(item => {
			if( ! filterByToggles(togs, item) )
				return;

			if( text && !(cat.filterByText ?? defaultFilterByText)(text,item) )
				return;

			if( lastCat !== cat ) {
				lastCat = cat; lastGroup = NaN;
				$(navRoot, "div", {className:'nav-cat item'}, [
					["div", {className: 'icon category ' + cat.iconClass}],
					["div", '='+cat.name, {
						className: 'label',
						//TODO: folding
					}],
				]);
			}

			//TODO: configurable grouping
			//TODO: category/group/tree indent

			const lhs = $(navRoot, "div", {className:"item"});

			$(lhs, "div", {className: 'icon object ' + cat.iconClass});
			$(lhs, "div", '='+metanode_db[item.type].Name(item), {
				className:'label ' + (selected.includes(item.id)?'selected':''),
				'?click': makeToggler(selected, item.id),
			});

			const atgt = $(navRoot, "div", {className:'actions'});
			cat.actions(atgt, item, D, S);
		});
	});

	postRender(() => {
		navRoot.parentNode.scrollTop = S.scrollN;
		navRoot.parentNode.parentNode.insertBefore(navMenu, navRoot.parentNode);
	});

	return preRerender(navRoot, () => {
		S.scrollN = navRoot.parentNode.scrollTop;
	});
}
