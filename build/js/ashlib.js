// GENERAL
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function (action, array) {
		for (var e in array) {
			action(array[e], e, array);
		}
	}
}

// GENERAL
if (!Array.prototype.random) {
	Array.prototype.random = function () {
		return this[Math.floor(Math.random()*this.length)];
	}
}

// GENERAL
if (!Array.prototype.randomModulus) {
	Array.prototype.randomModulus = function (mod) {
		var index = Math.floor( Math.random() * this.length );
		//console.log(' ', index,  mod, (index % mod))
		index -= (index % mod);
		return this[index];
	}
}


var AshLib = (function () {
	// STRING SUBS HELPER
	function tm(string, context, split) {
	 
		var variables = string.split('{');
		
		variables.forEach( function(el, index, array) {
			var words = el.split('}'),
				word = words[0];
				
			if (words.length == 2) {
				words[0] = context[word];
				array[index] = words.join('');	
			}

		});
		return variables.join('');
	}



	// TYPE CHECKING
	function is_TypeOn_() {
		return true;
	}
	function isDefined(val) {
		if (val === undefined ) throw new Error('val: not defined')
		return val;
	}

	function is_Contains_(string, match, msg) {
		if (string.indexOf(match) == -1) {
			throw new Error( msg || 'No '+match+' found in '+string);
		}
	}

	return {
		tm: tm
	}
}());





