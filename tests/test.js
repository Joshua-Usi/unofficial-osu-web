define(function(require) {
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
	var ARGUMENT_NAMES = /([^\s,]+)/g;
	function getParamNames(func) {
		var fnStr = func.toString().replace(STRIP_COMMENTS, '');
		var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
		if ( result === null)
				result = [];
		return result;
	}


	return {
		table: function(callback, callbackArguments, expected) {
			if (typeof(callback) !== "function") {
				return new TypeError("callback needs to be a function");
			}
			if (callbackArguments.length != expected.length) {
				return new Error("argument length and expected values length are not the same");
			}
			for (var i = 0; i < callbackArguments.length; i++) {
				if (typeof callbackArguments[i] === "object") {
					let evaluation = (JSON.stringify(callback(...callbackArguments[i])) === JSON.stringify(expected[i]));
					let diff = callback(...callbackArguments[i]) - expected[i];
					if (Math.abs(diff) <= Number.EPSILON) {
						evaluation = true;
					}
					let tableRow = `<tr>
						<th>${callback.name}</th>
						<th>${JSON.stringify(callbackArguments[i])}</th>
						<th>${expected[i]}</th>
						<th>${callback(...callbackArguments[i])}</th>
						<th style=\"background-color: ${(evaluation) ? "#0f0" : "#f00"};\">Passed: ${evaluation}</th>
					</tr>`;
					document.querySelector("table").innerHTML += tableRow;
				} else {
					let evaluation = (JSON.stringify(callback(callbackArguments[i])) === JSON.stringify(expected[i]));
					let diff = callback(callbackArguments[i]) - expected[i];
					if (Math.abs(diff) <= Number.EPSILON) {
						evaluation = true;
					}
					let tableRow = `<tr>
						<th>${callback.name}</th>
						<th>${JSON.stringify(callbackArguments[i])}</th>
						<th>${expected[i]}</th>
						<th>${callback(callbackArguments[i])}</th>
						<th style=\"background-color: ${(evaluation) ? "#0f0" : "#f00"};\">Passed: ${evaluation}</th>
					</tr>`;
					document.querySelector("table").innerHTML += tableRow;
				}
			}
		}
	}
});