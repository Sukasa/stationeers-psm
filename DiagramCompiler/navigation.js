
const categories = [
	{name:"Drawings",
		gen(D) {
			return D
				.Objects(o => o.type === 'drawing')
				.sort((a,b) => (a.properties?.Name ?? a.id) < (b.properties?.Name ?? b.id) ? -1 : +1);
		},
		item(tgt,obj) {
			return $(tgt, "div", "="+(obj.properties?.Name ?? `Drawing ${obj.id}`));
		},
		actions(tgt,obj,D,S) {
			$(tgt, [
				["button", "=V", {"?click": () => {
					S.diagram.view = {drawing: obj.id};
					rerender();
				}}],
			])
		},
	}
];

function renderNavigation(D, S) {
	const selected = S.selection ?? [];
	const drawing = S.diagram?.view?.drawing;

	const list = $("div", {className:'nav-list'});

	var lastCat = NaN, ctgt;
	categories.forEach(cat => {
		var lastGroup = NaN;
		cat.gen(D).forEach(item => {
			//TODO: filter

			if( lastCat !== cat ) {
				lastCat = cat; lastGroup = NaN;
				ctgt = $(list, "div", {className:'nav-cat'});
				$(ctgt, "div", {className: 'heading'}, '='+cat.name);
			}

			const itgt = $(ctgt, "div", {className:'item'});
			cat.item(itgt, item);

			const atgt = $(ctgt, "div", {className:'actions'});
			cat.actions(atgt, item);
		});
	});

	return list;
}
