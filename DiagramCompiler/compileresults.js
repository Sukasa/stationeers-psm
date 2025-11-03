


function renderCompile(D, S) {
	const result = S.compilations[S.activeZone];
	console.log(result);

	document.body.classList.add('showing-compile');
	preRerender(() => document.body.classList.remove('showing-compile'));
	return [["div", "=TODO compilation result"]];
}
