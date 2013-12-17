//GENERAL 
function logg(msg) {
	var logger;
	if (! (logger = window.document.getElementById('logger'))) {
		logger = window.document.body.appendChild( window.document.createElement('div') );
		logger.style.position = 'fixed';
		logger.style.fontSize = '0.7em';
		logger.style.zIndex = '1';
		logger.style.top = '0';
		logger.style.left = '0';
		logger.style.padding = '1em';

	}
	logger.textContent = msg;
	console.log(msg);
}
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

//PROTOTYPE INHERITANCE
if (!Object.prototype.cloneConstructor) {
	Object.prototype.cloneConstructor = function (object) {
		function OneShotConstructor(){}
		OneShotConstructor.prototype = object;
		return new OneShotConstructor();
	}
}
//PROTOTYPE INHERITANCE
if (!Object.prototype.method) {
	Object.prototype.method = function(name, func) {
	  this.prototype[name] = func;
	};
}



//PROTOTYPE INHERITANCE
if (!Object.prototype.inherit) {
	Object.prototype.inherit = function (base) {
		this.prototype = cloneConstructor(base.prototype);
  		this.prototype.constructor = this;
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





