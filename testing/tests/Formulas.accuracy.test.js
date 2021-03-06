define(["../testLib.js", "../../src/scripts/Formulas.js"], function(Test, Formulas) {
	Test.table(Formulas.accuracy, [
		[0, 0, 0, 0],
		[100, 0, 0, 0],
		[95, 5, 0, 0],
		[89, 11, 0, 0],
		[99, 0, 0, 1],
		[99, 0, 1, 0],
		[99, 0, 2, 0],
		[71, 29, 0, 0],
		[81, 18, 0, 1],
		[61, 39, 0, 0],
		[0, 100, 0, 0],
		[0, 0, 100, 0],
		[0, 0, 0, 100],
		], [
		1,
		1,
		0.9666666666666667,
		0.9266666666666666,
		0.99,
		0.9916666666666667,
		0.9834983498349835,
		0.8066666666666666,
		0.87,
		0.74,
		0.3333333333333333,
		0.16666666666666666,
		0,
	]);
});