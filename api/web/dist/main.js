(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bF.aX === region.bY.aX)
	{
		return 'on line ' + region.bF.aX;
	}
	return 'on lines ' + region.bF.aX + ' through ' + region.bY.aX;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (Object.prototype.hasOwnProperty.call(value, key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	var unwrapped = _Json_unwrap(value);
	if (!(key === 'toJSON' && typeof unwrapped === 'function'))
	{
		object[key] = unwrapped;
	}
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dp,
		impl.dY,
		impl.dT,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (
		(typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		||
		(Array.isArray(_Json_unwrap(value)) && _VirtualDom_RE_js_html.test(String(_Json_unwrap(value))))
	)
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		ac: func(record.ac),
		bG: record.bG,
		bD: record.bD
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.ac;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.bG;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bD) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dp,
		impl.dY,
		impl.dT,
		function(sendToApp, initialModel) {
			var view = impl.d$;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.dp,
		impl.dY,
		impl.dT,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bE && impl.bE(sendToApp)
			var view = impl.d$;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.a6);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.Z) && (_VirtualDom_doc.title = title = doc.Z);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.dw;
	var onUrlRequest = impl.dx;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bE: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.cr === next.cr
							&& curr.b5 === next.b5
							&& curr.ck.a === next.ck.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		dp: function(flags)
		{
			return A3(impl.dp, flags, _Browser_getUrl(), key);
		},
		d$: impl.d$,
		dY: impl.dY,
		dT: impl.dT
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { dm: 'hidden', cY: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { dm: 'mozHidden', cY: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { dm: 'msHidden', cY: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { dm: 'webkitHidden', cY: 'webkitvisibilitychange' }
		: { dm: 'hidden', cY: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		cx: _Browser_getScene(),
		cF: {
			cJ: _Browser_window.pageXOffset,
			cK: _Browser_window.pageYOffset,
			cI: _Browser_doc.documentElement.clientWidth,
			b3: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		cI: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		b3: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			cx: {
				cI: node.scrollWidth,
				b3: node.scrollHeight
			},
			cF: {
				cJ: node.scrollLeft,
				cK: node.scrollTop,
				cI: node.clientWidth,
				b3: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			cx: _Browser_getScene(),
			cF: {
				cJ: x,
				cK: y,
				cI: _Browser_doc.documentElement.clientWidth,
				b3: _Browser_doc.documentElement.clientHeight
			},
			c7: {
				cJ: x + rect.left,
				cK: y + rect.top,
				cI: rect.width,
				b3: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// SEND REQUEST

var _Http_toTask = F3(function(router, toTask, request)
{
	return _Scheduler_binding(function(callback)
	{
		function done(response) {
			callback(toTask(request.bc.a(response)));
		}

		var xhr = new XMLHttpRequest();
		xhr.addEventListener('error', function() { done($elm$http$Http$NetworkError_); });
		xhr.addEventListener('timeout', function() { done($elm$http$Http$Timeout_); });
		xhr.addEventListener('load', function() { done(_Http_toResponse(request.bc.b, xhr)); });
		$elm$core$Maybe$isJust(request.bp) && _Http_track(router, xhr, request.bp.a);

		try {
			xhr.open(request.bi, request.bq, true);
		} catch (e) {
			return done($elm$http$Http$BadUrl_(request.bq));
		}

		_Http_configureRequest(xhr, request);

		request.a6.a && xhr.setRequestHeader('Content-Type', request.a6.a);
		xhr.send(request.a6.b);

		return function() { xhr.c = true; xhr.abort(); };
	});
});


// CONFIGURE

function _Http_configureRequest(xhr, request)
{
	for (var headers = request.bf; headers.b; headers = headers.b) // WHILE_CONS
	{
		xhr.setRequestHeader(headers.a.a, headers.a.b);
	}
	xhr.timeout = request.bn.a || 0;
	xhr.responseType = request.bc.d;
	xhr.withCredentials = request.cO;
}


// RESPONSES

function _Http_toResponse(toBody, xhr)
{
	return A2(
		200 <= xhr.status && xhr.status < 300 ? $elm$http$Http$GoodStatus_ : $elm$http$Http$BadStatus_,
		_Http_toMetadata(xhr),
		toBody(xhr.response)
	);
}


// METADATA

function _Http_toMetadata(xhr)
{
	return {
		bq: xhr.responseURL,
		aM: xhr.status,
		dS: xhr.statusText,
		bf: _Http_parseHeaders(xhr.getAllResponseHeaders())
	};
}


// HEADERS

function _Http_parseHeaders(rawHeaders)
{
	if (!rawHeaders)
	{
		return $elm$core$Dict$empty;
	}

	var headers = $elm$core$Dict$empty;
	var headerPairs = rawHeaders.split('\r\n');
	for (var i = headerPairs.length; i--; )
	{
		var headerPair = headerPairs[i];
		var index = headerPair.indexOf(': ');
		if (index > 0)
		{
			var key = headerPair.substring(0, index);
			var value = headerPair.substring(index + 2);

			headers = A3($elm$core$Dict$update, key, function(oldValue) {
				return $elm$core$Maybe$Just($elm$core$Maybe$isJust(oldValue)
					? value + ', ' + oldValue.a
					: value
				);
			}, headers);
		}
	}
	return headers;
}


// EXPECT

var _Http_expect = F3(function(type, toBody, toValue)
{
	return {
		$: 0,
		d: type,
		b: toBody,
		a: toValue
	};
});

var _Http_mapExpect = F2(function(func, expect)
{
	return {
		$: 0,
		d: expect.d,
		b: expect.b,
		a: function(x) { return func(expect.a(x)); }
	};
});

function _Http_toDataView(arrayBuffer)
{
	return new DataView(arrayBuffer);
}


// BODY and PARTS

var _Http_emptyBody = { $: 0 };
var _Http_pair = F2(function(a, b) { return { $: 0, a: a, b: b }; });

function _Http_toFormData(parts)
{
	for (var formData = new FormData(); parts.b; parts = parts.b) // WHILE_CONS
	{
		var part = parts.a;
		formData.append(part.a, part.b);
	}
	return formData;
}

var _Http_bytesToBlob = F2(function(mime, bytes)
{
	return new Blob([bytes], { type: mime });
});


// PROGRESS

function _Http_track(router, xhr, tracker)
{
	// TODO check out lengthComputable on loadstart event

	xhr.upload.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Sending({
			dJ: event.loaded,
			dK: event.total
		}))));
	});
	xhr.addEventListener('progress', function(event) {
		if (xhr.c) { return; }
		_Scheduler_rawSpawn(A2($elm$core$Platform$sendToSelf, router, _Utils_Tuple2(tracker, $elm$http$Http$Receiving({
			dD: event.loaded,
			dK: event.lengthComputable ? $elm$core$Maybe$Just(event.total) : $elm$core$Maybe$Nothing
		}))));
	});
}

function _Url_percentEncode(string)
{
	return encodeURIComponent(string);
}

function _Url_percentDecode(string)
{
	try
	{
		return $elm$core$Maybe$Just(decodeURIComponent(string));
	}
	catch (e)
	{
		return $elm$core$Maybe$Nothing;
	}
}


function _Time_now(millisToPosix)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(millisToPosix(Date.now())));
	});
}

var _Time_setInterval = F2(function(interval, task)
{
	return _Scheduler_binding(function(callback)
	{
		var id = setInterval(function() { _Scheduler_rawSpawn(task); }, interval);
		return function() { clearInterval(id); };
	});
});

function _Time_here()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(
			A2($elm$time$Time$customZone, -(new Date().getTimezoneOffset()), _List_Nil)
		));
	});
}


function _Time_getZoneName()
{
	return _Scheduler_binding(function(callback)
	{
		try
		{
			var name = $elm$time$Time$Name(Intl.DateTimeFormat().resolvedOptions().timeZone);
		}
		catch (e)
		{
			var name = $elm$time$Time$Offset(new Date().getTimezoneOffset());
		}
		callback(_Scheduler_succeed(name));
	});
}




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}




var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $author$project$State$LinkClicked = function (a) {
	return {$: 56, a: a};
};
var $author$project$State$UrlChanged = function (a) {
	return {$: 57, a: a};
};
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.h) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.j),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.j);
		} else {
			var treeLen = builder.h * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.m) : builder.m;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.h);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.j) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.j);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{m: nodeList, h: (len / $elm$core$Array$branchFactor) | 0, j: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {be: fragment, b5: host, r: path, ck: port_, cr: protocol, ag: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $author$project$State$ClockLoaded = function (a) {
	return {$: 170, a: a};
};
var $author$project$State$ClockTick = function (a) {
	return {$: 167, a: a};
};
var $author$project$State$PortalExchange = function (a) {
	return {$: 46, a: a};
};
var $author$project$State$PortalLoaded = function (a) {
	return {$: 48, a: a};
};
var $author$project$State$AcceptLoad = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(0),
				entries));
	});
var $elm$core$Tuple$mapSecond = F2(
	function (func, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return _Utils_Tuple2(
			x,
			func(y));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $author$project$Main$loadKey = function (model) {
	return A2(
		$elm$json$Json$Encode$encode,
		0,
		A2(
			$elm$json$Json$Encode$list,
			$elm$json$Json$Encode$string,
			_List_fromArray(
				[
					model.bq.r,
					A2($elm$core$Maybe$withDefault, '', model.dU),
					$elm$core$String$fromInt(model.aY),
					$elm$core$String$fromInt(model.dB),
					model.dC,
					model.a8,
					model.df,
					model.dd,
					model.de,
					A2(
					$elm$json$Json$Encode$encode,
					0,
					$elm$json$Json$Encode$object(
						A2(
							$elm$core$List$map,
							$elm$core$Tuple$mapSecond($elm$json$Json$Encode$string),
							$elm$core$Dict$toList(model.cP)))),
					model.dM,
					model.bg,
					model.ab,
					model.aq,
					model.dL ? 'asc' : 'desc'
				])));
};
var $author$project$Main$loadKeyFor = F2(
	function (msg, model) {
		if (msg.$ === 68) {
			return A2(
				$elm$json$Json$Encode$encode,
				0,
				A2(
					$elm$json$Json$Encode$list,
					$elm$json$Json$Encode$string,
					_List_fromArray(
						[
							A2($elm$core$Maybe$withDefault, '', model.dU),
							$elm$core$String$fromInt(model.a4)
						])));
		} else {
			return $author$project$Main$loadKey(model);
		}
	});
var $author$project$Main$acceptLoad = F3(
	function (model, constructor, result) {
		var loaded = constructor(result);
		return A2(
			$author$project$State$AcceptLoad,
			A2($author$project$Main$loadKeyFor, loaded, model),
			loaded);
	});
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $author$project$Release$contract = 'ecc-crm-20261019-v1';
var $elm$http$Http$BadStatus_ = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$http$Http$BadUrl_ = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$GoodStatus_ = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $elm$http$Http$NetworkError_ = {$: 2};
var $elm$http$Http$Receiving = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$Sending = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$Timeout_ = {$: 1};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Maybe$isJust = function (maybe) {
	if (!maybe.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $elm$http$Http$emptyBody = _Http_emptyBody;
var $elm$http$Http$BadBody = function (a) {
	return {$: 4, a: a};
};
var $elm$http$Http$BadStatus = function (a) {
	return {$: 3, a: a};
};
var $elm$http$Http$BadUrl = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$NetworkError = {$: 2};
var $elm$http$Http$Timeout = {$: 1};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$json$Json$Decode$decodeString = _Json_runOnString;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Api$decodeResponse = F2(
	function (decoder, response) {
		switch (response.$) {
			case 0:
				var url = response.a;
				return $elm$core$Result$Err(
					$elm$http$Http$BadUrl(url));
			case 1:
				return $elm$core$Result$Err($elm$http$Http$Timeout);
			case 2:
				return $elm$core$Result$Err($elm$http$Http$NetworkError);
			case 3:
				var metadata = response.a;
				var body = response.b;
				return A2(
					$elm$core$List$member,
					metadata.aM,
					_List_fromArray(
						[401, 409])) ? $elm$core$Result$Err(
					$elm$http$Http$BadStatus(metadata.aM)) : $elm$core$Result$Err(
					$elm$http$Http$BadBody(
						A2(
							$elm$core$Result$withDefault,
							'Request failed (' + ($elm$core$String$fromInt(metadata.aM) + ')'),
							A2(
								$elm$json$Json$Decode$decodeString,
								A2($elm$json$Json$Decode$field, 'error', $elm$json$Json$Decode$string),
								body))));
			default:
				var body = response.b;
				return A2(
					$elm$core$Result$mapError,
					A2($elm$core$Basics$composeR, $elm$json$Json$Decode$errorToString, $elm$http$Http$BadBody),
					A2($elm$json$Json$Decode$decodeString, decoder, body));
		}
	});
var $elm$http$Http$expectStringResponse = F2(
	function (toMsg, toResult) {
		return A3(
			_Http_expect,
			'',
			$elm$core$Basics$identity,
			A2($elm$core$Basics$composeR, toResult, toMsg));
	});
var $author$project$Api$expectJson = F2(
	function (toMsg, decoder) {
		return A2(
			$elm$http$Http$expectStringResponse,
			toMsg,
			$author$project$Api$decodeResponse(decoder));
	});
var $elm$http$Http$Header = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$header = $elm$http$Http$Header;
var $elm$http$Http$Request = function (a) {
	return {$: 1, a: a};
};
var $elm$http$Http$State = F2(
	function (reqs, subs) {
		return {ct: reqs, cA: subs};
	});
var $elm$http$Http$init = $elm$core$Task$succeed(
	A2($elm$http$Http$State, $elm$core$Dict$empty, _List_Nil));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$http$Http$updateReqs = F3(
	function (router, cmds, reqs) {
		updateReqs:
		while (true) {
			if (!cmds.b) {
				return $elm$core$Task$succeed(reqs);
			} else {
				var cmd = cmds.a;
				var otherCmds = cmds.b;
				if (!cmd.$) {
					var tracker = cmd.a;
					var _v2 = A2($elm$core$Dict$get, tracker, reqs);
					if (_v2.$ === 1) {
						var $temp$router = router,
							$temp$cmds = otherCmds,
							$temp$reqs = reqs;
						router = $temp$router;
						cmds = $temp$cmds;
						reqs = $temp$reqs;
						continue updateReqs;
					} else {
						var pid = _v2.a;
						return A2(
							$elm$core$Task$andThen,
							function (_v3) {
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A2($elm$core$Dict$remove, tracker, reqs));
							},
							$elm$core$Process$kill(pid));
					}
				} else {
					var req = cmd.a;
					return A2(
						$elm$core$Task$andThen,
						function (pid) {
							var _v4 = req.bp;
							if (_v4.$ === 1) {
								return A3($elm$http$Http$updateReqs, router, otherCmds, reqs);
							} else {
								var tracker = _v4.a;
								return A3(
									$elm$http$Http$updateReqs,
									router,
									otherCmds,
									A3($elm$core$Dict$insert, tracker, pid, reqs));
							}
						},
						$elm$core$Process$spawn(
							A3(
								_Http_toTask,
								router,
								$elm$core$Platform$sendToApp(router),
								req)));
				}
			}
		}
	});
var $elm$http$Http$onEffects = F4(
	function (router, cmds, subs, state) {
		return A2(
			$elm$core$Task$andThen,
			function (reqs) {
				return $elm$core$Task$succeed(
					A2($elm$http$Http$State, reqs, subs));
			},
			A3($elm$http$Http$updateReqs, router, cmds, state.ct));
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (!_v0.$) {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$http$Http$maybeSend = F4(
	function (router, desiredTracker, progress, _v0) {
		var actualTracker = _v0.a;
		var toMsg = _v0.b;
		return _Utils_eq(desiredTracker, actualTracker) ? $elm$core$Maybe$Just(
			A2(
				$elm$core$Platform$sendToApp,
				router,
				toMsg(progress))) : $elm$core$Maybe$Nothing;
	});
var $elm$http$Http$onSelfMsg = F3(
	function (router, _v0, state) {
		var tracker = _v0.a;
		var progress = _v0.b;
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$filterMap,
					A3($elm$http$Http$maybeSend, router, tracker, progress),
					state.cA)));
	});
var $elm$http$Http$Cancel = function (a) {
	return {$: 0, a: a};
};
var $elm$http$Http$cmdMap = F2(
	function (func, cmd) {
		if (!cmd.$) {
			var tracker = cmd.a;
			return $elm$http$Http$Cancel(tracker);
		} else {
			var r = cmd.a;
			return $elm$http$Http$Request(
				{
					cO: r.cO,
					a6: r.a6,
					bc: A2(_Http_mapExpect, func, r.bc),
					bf: r.bf,
					bi: r.bi,
					bn: r.bn,
					bp: r.bp,
					bq: r.bq
				});
		}
	});
var $elm$http$Http$MySub = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$http$Http$subMap = F2(
	function (func, _v0) {
		var tracker = _v0.a;
		var toMsg = _v0.b;
		return A2(
			$elm$http$Http$MySub,
			tracker,
			A2($elm$core$Basics$composeR, toMsg, func));
	});
_Platform_effectManagers['Http'] = _Platform_createManager($elm$http$Http$init, $elm$http$Http$onEffects, $elm$http$Http$onSelfMsg, $elm$http$Http$cmdMap, $elm$http$Http$subMap);
var $elm$http$Http$command = _Platform_leaf('Http');
var $elm$http$Http$subscription = _Platform_leaf('Http');
var $elm$http$Http$request = function (r) {
	return $elm$http$Http$command(
		$elm$http$Http$Request(
			{cO: false, a6: r.a6, bc: r.bc, bf: r.bf, bi: r.bi, bn: r.bn, bp: r.bp, bq: r.bq}));
};
var $author$project$Api$authedRequest = F6(
	function (ctx, method, path, body, decoder, toMsg) {
		return $elm$http$Http$request(
			{
				a6: A2($elm$core$Maybe$withDefault, $elm$http$Http$emptyBody, body),
				bc: A2($author$project$Api$expectJson, toMsg, decoder),
				bf: _List_fromArray(
					[
						A2($elm$http$Http$header, 'X-ECC-Contract', $author$project$Release$contract)
					]),
				bi: method,
				bn: $elm$core$Maybe$Just(30000),
				bp: $elm$core$Maybe$Nothing,
				bq: _Utils_ap(ctx.ao, path)
			});
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $author$project$Api$clock = F2(
	function (ctx, toMsg) {
		return A6($author$project$Api$authedRequest, ctx, 'GET', '/api/time', $elm$core$Maybe$Nothing, $elm$json$Json$Decode$value, toMsg);
	});
var $author$project$Api$computeBase = function (_v0) {
	return '';
};
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $elm$url$Url$percentDecode = _Url_percentDecode;
var $author$project$State$applicationFiltersForUrl = function (url) {
	return $elm$core$Dict$fromList(
		A2(
			$elm$core$List$filterMap,
			function (part) {
				var _v0 = A2($elm$core$String$split, '=', part);
				if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
					var key = _v0.a;
					var _v1 = _v0.b;
					var value = _v1.a;
					return A2(
						$elm$core$List$member,
						key,
						_List_fromArray(
							['client', 'officer', 'destination', 'stage', 'intake'])) ? $elm$core$Maybe$Just(
						_Utils_Tuple2(
							key,
							A2(
								$elm$core$Maybe$withDefault,
								'',
								$elm$url$Url$percentDecode(value)))) : $elm$core$Maybe$Nothing;
				} else {
					return $elm$core$Maybe$Nothing;
				}
			},
			A2(
				$elm$core$String$split,
				'&',
				A2($elm$core$Maybe$withDefault, '', url.ag))));
};
var $author$project$Features$defaults = function (section) {
	return $elm$core$Dict$fromList(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'status',
				function () {
					switch (section) {
						case 'applications':
							return 'Pending';
						case 'documents':
							return 'Missing';
						case 'appointments':
							return 'Scheduled';
						case 'invoices':
							return 'Draft';
						default:
							return 'Pending';
					}
				}()),
				_Utils_Tuple2('expectedRevision', '0'),
				_Utils_Tuple2('category', 'Student Visa'),
				_Utils_Tuple2('destination', 'Canada'),
				_Utils_Tuple2('stage', 'Documents Under Review'),
				_Utils_Tuple2('required', 'true'),
				_Utils_Tuple2('enabled', 'true'),
				_Utils_Tuple2('priority', 'Medium'),
				_Utils_Tuple2(
				'entity',
				(section === 'merge') ? 'leads' : 'tasks'),
				_Utils_Tuple2('currency', 'PHP'),
				_Utils_Tuple2('daysBefore', '1'),
				_Utils_Tuple2('escalateAfter', '2'),
				_Utils_Tuple2('days', '7'),
				_Utils_Tuple2('mine', 'true'),
				_Utils_Tuple2('overdue', 'false'),
				_Utils_Tuple2('assignments', 'true'),
				_Utils_Tuple2('deadlines', 'true'),
				_Utils_Tuple2('documents', 'true'),
				_Utils_Tuple2('escalations', 'true'),
				_Utils_Tuple2('emailEnabled', 'true')
			]));
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$State$Dashboard = {$: 0};
var $elm$url$Url$Parser$State = F5(
	function (visited, unvisited, params, frag, value) {
		return {ar: frag, at: params, ak: unvisited, _: value, ay: visited};
	});
var $elm$url$Url$Parser$getFirstMatch = function (states) {
	getFirstMatch:
	while (true) {
		if (!states.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var state = states.a;
			var rest = states.b;
			var _v1 = state.ak;
			if (!_v1.b) {
				return $elm$core$Maybe$Just(state._);
			} else {
				if ((_v1.a === '') && (!_v1.b.b)) {
					return $elm$core$Maybe$Just(state._);
				} else {
					var $temp$states = rest;
					states = $temp$states;
					continue getFirstMatch;
				}
			}
		}
	}
};
var $elm$url$Url$Parser$removeFinalEmpty = function (segments) {
	if (!segments.b) {
		return _List_Nil;
	} else {
		if ((segments.a === '') && (!segments.b.b)) {
			return _List_Nil;
		} else {
			var segment = segments.a;
			var rest = segments.b;
			return A2(
				$elm$core$List$cons,
				segment,
				$elm$url$Url$Parser$removeFinalEmpty(rest));
		}
	}
};
var $elm$url$Url$Parser$preparePath = function (path) {
	var _v0 = A2($elm$core$String$split, '/', path);
	if (_v0.b && (_v0.a === '')) {
		var segments = _v0.b;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	} else {
		var segments = _v0;
		return $elm$url$Url$Parser$removeFinalEmpty(segments);
	}
};
var $elm$url$Url$Parser$addToParametersHelp = F2(
	function (value, maybeList) {
		if (maybeList.$ === 1) {
			return $elm$core$Maybe$Just(
				_List_fromArray(
					[value]));
		} else {
			var list = maybeList.a;
			return $elm$core$Maybe$Just(
				A2($elm$core$List$cons, value, list));
		}
	});
var $elm$url$Url$Parser$addParam = F2(
	function (segment, dict) {
		var _v0 = A2($elm$core$String$split, '=', segment);
		if ((_v0.b && _v0.b.b) && (!_v0.b.b.b)) {
			var rawKey = _v0.a;
			var _v1 = _v0.b;
			var rawValue = _v1.a;
			var _v2 = $elm$url$Url$percentDecode(rawKey);
			if (_v2.$ === 1) {
				return dict;
			} else {
				var key = _v2.a;
				var _v3 = $elm$url$Url$percentDecode(rawValue);
				if (_v3.$ === 1) {
					return dict;
				} else {
					var value = _v3.a;
					return A3(
						$elm$core$Dict$update,
						key,
						$elm$url$Url$Parser$addToParametersHelp(value),
						dict);
				}
			}
		} else {
			return dict;
		}
	});
var $elm$url$Url$Parser$prepareQuery = function (maybeQuery) {
	if (maybeQuery.$ === 1) {
		return $elm$core$Dict$empty;
	} else {
		var qry = maybeQuery.a;
		return A3(
			$elm$core$List$foldr,
			$elm$url$Url$Parser$addParam,
			$elm$core$Dict$empty,
			A2($elm$core$String$split, '&', qry));
	}
};
var $elm$url$Url$Parser$parse = F2(
	function (_v0, url) {
		var parser = _v0;
		return $elm$url$Url$Parser$getFirstMatch(
			parser(
				A5(
					$elm$url$Url$Parser$State,
					_List_Nil,
					$elm$url$Url$Parser$preparePath(url.r),
					$elm$url$Url$Parser$prepareQuery(url.ag),
					url.be,
					$elm$core$Basics$identity)));
	});
var $author$project$State$AuditPage = {$: 7};
var $author$project$State$ClientDetailPage = function (a) {
	return {$: 4, a: a};
};
var $author$project$State$ClientsPage = {$: 3};
var $author$project$State$LeadDetailPage = function (a) {
	return {$: 2, a: a};
};
var $author$project$State$LeadsPage = {$: 1};
var $author$project$State$TasksPage = {$: 5};
var $author$project$State$UsersPage = {$: 6};
var $author$project$State$WorkspacePage = function (a) {
	return {$: 8, a: a};
};
var $elm$url$Url$Parser$Parser = $elm$core$Basics$identity;
var $elm$url$Url$Parser$custom = F2(
	function (tipe, stringToSomething) {
		return function (_v0) {
			var visited = _v0.ay;
			var unvisited = _v0.ak;
			var params = _v0.at;
			var frag = _v0.ar;
			var value = _v0._;
			if (!unvisited.b) {
				return _List_Nil;
			} else {
				var next = unvisited.a;
				var rest = unvisited.b;
				var _v2 = stringToSomething(next);
				if (!_v2.$) {
					var nextValue = _v2.a;
					return _List_fromArray(
						[
							A5(
							$elm$url$Url$Parser$State,
							A2($elm$core$List$cons, next, visited),
							rest,
							params,
							frag,
							value(nextValue))
						]);
				} else {
					return _List_Nil;
				}
			}
		};
	});
var $elm$url$Url$Parser$int = A2($elm$url$Url$Parser$custom, 'NUMBER', $elm$core$String$toInt);
var $elm$url$Url$Parser$mapState = F2(
	function (func, _v0) {
		var visited = _v0.ay;
		var unvisited = _v0.ak;
		var params = _v0.at;
		var frag = _v0.ar;
		var value = _v0._;
		return A5(
			$elm$url$Url$Parser$State,
			visited,
			unvisited,
			params,
			frag,
			func(value));
	});
var $elm$url$Url$Parser$map = F2(
	function (subValue, _v0) {
		var parseArg = _v0;
		return function (_v1) {
			var visited = _v1.ay;
			var unvisited = _v1.ak;
			var params = _v1.at;
			var frag = _v1.ar;
			var value = _v1._;
			return A2(
				$elm$core$List$map,
				$elm$url$Url$Parser$mapState(value),
				parseArg(
					A5($elm$url$Url$Parser$State, visited, unvisited, params, frag, subValue)));
		};
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $elm$url$Url$Parser$oneOf = function (parsers) {
	return function (state) {
		return A2(
			$elm$core$List$concatMap,
			function (_v0) {
				var parser = _v0;
				return parser(state);
			},
			parsers);
	};
};
var $elm$url$Url$Parser$s = function (str) {
	return function (_v0) {
		var visited = _v0.ay;
		var unvisited = _v0.ak;
		var params = _v0.at;
		var frag = _v0.ar;
		var value = _v0._;
		if (!unvisited.b) {
			return _List_Nil;
		} else {
			var next = unvisited.a;
			var rest = unvisited.b;
			return _Utils_eq(next, str) ? _List_fromArray(
				[
					A5(
					$elm$url$Url$Parser$State,
					A2($elm$core$List$cons, next, visited),
					rest,
					params,
					frag,
					value)
				]) : _List_Nil;
		}
	};
};
var $elm$url$Url$Parser$slash = F2(
	function (_v0, _v1) {
		var parseBefore = _v0;
		var parseAfter = _v1;
		return function (state) {
			return A2(
				$elm$core$List$concatMap,
				parseAfter,
				parseBefore(state));
		};
	});
var $elm$url$Url$Parser$string = A2($elm$url$Url$Parser$custom, 'STRING', $elm$core$Maybe$Just);
var $elm$url$Url$Parser$top = function (state) {
	return _List_fromArray(
		[state]);
};
var $author$project$State$routeParser = $elm$url$Url$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$url$Url$Parser$map,
			$author$project$State$WorkspacePage('work/applications'),
			$elm$url$Url$Parser$s('applications')),
			A2(
			$elm$url$Url$Parser$map,
			function (section) {
				return $author$project$State$WorkspacePage('work/' + section);
			},
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('work'),
				$elm$url$Url$Parser$string)),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$State$WorkspacePage('reminders'),
			$elm$url$Url$Parser$s('reminders')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$State$WorkspacePage('duplicates'),
			$elm$url$Url$Parser$s('duplicates')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$State$WorkspacePage('archive'),
			$elm$url$Url$Parser$s('archive')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$State$WorkspacePage('metrics'),
			$elm$url$Url$Parser$s('system')),
			A2($elm$url$Url$Parser$map, $author$project$State$Dashboard, $elm$url$Url$Parser$top),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$State$LeadsPage,
			$elm$url$Url$Parser$s('leads')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$State$LeadDetailPage,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('leads'),
				$elm$url$Url$Parser$int)),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$State$ClientsPage,
			$elm$url$Url$Parser$s('clients')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$State$ClientDetailPage,
			A2(
				$elm$url$Url$Parser$slash,
				$elm$url$Url$Parser$s('clients'),
				$elm$url$Url$Parser$int)),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$State$TasksPage,
			$elm$url$Url$Parser$s('tasks')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$State$UsersPage,
			$elm$url$Url$Parser$s('users')),
			A2(
			$elm$url$Url$Parser$map,
			$author$project$State$AuditPage,
			$elm$url$Url$Parser$s('audit'))
		]));
var $author$project$State$routeOf = function (url) {
	return A2(
		$elm$core$Maybe$withDefault,
		$author$project$State$Dashboard,
		A2($elm$url$Url$Parser$parse, $author$project$State$routeParser, url));
};
var $author$project$Main$sectionForUrl = function (url) {
	var _v0 = $author$project$State$routeOf(url);
	if (_v0.$ === 8) {
		var kind = _v0.a;
		return A2($elm$core$String$startsWith, 'work/', kind) ? A2($elm$core$String$dropLeft, 5, kind) : kind;
	} else {
		return 'tasks';
	}
};
var $author$project$Main$featureDefaultsForUrl = function (url) {
	var defaults = $author$project$Features$defaults(
		$author$project$Main$sectionForUrl(url));
	return ($author$project$Main$sectionForUrl(url) === 'applications') ? A2(
		$elm$core$Maybe$withDefault,
		defaults,
		A2(
			$elm$core$Maybe$map,
			function (cid) {
				return A3($elm$core$Dict$insert, 'owner', 'client:' + cid, defaults);
			},
			A2(
				$elm$core$Dict$get,
				'client',
				$author$project$State$applicationFiltersForUrl(url)))) : defaults;
};
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $author$project$State$emptyAddLead = {bb: 'Canada', J: '', aV: '', cd: '', aF: '', ci: '', aH: 'Warm', aJ: 'Student Visa', aL: 'Website', dO: 'New Lead'};
var $author$project$State$emptyAddTask = {cS: '', aU: '', aC: '', aW: '', a$: 'Medium', dF: '', Z: ''};
var $author$project$State$emptyClientForm = {J: '', aV: '', cg: '', ci: '', t: 1};
var $author$project$State$emptyEditLeadFrom = {bs: $elm$core$Maybe$Nothing, bb: 'Canada', J: '', aV: '', ds: '', cd: '', aF: '', ci: '', aH: 'Warm', t: 1, aJ: 'Student Visa', aL: 'Website', dO: 'New Lead'};
var $author$project$State$emptyUserForm = {J: '', x: '', ad: '', t: 1, H: 'consultant', cE: $elm$core$Maybe$Nothing};
var $elm$json$Json$Encode$null = _Json_encodeNull;
var $author$project$State$initialModel = F2(
	function (key, url) {
		return {
			y: $author$project$State$emptyAddLead,
			f: $author$project$State$emptyAddTask,
			am: '',
			cP: $author$project$State$applicationFiltersForUrl(url),
			a5: _List_Nil,
			an: false,
			k: $elm$core$Maybe$Nothing,
			c_: $elm$core$Maybe$Nothing,
			c$: $elm$core$Maybe$Nothing,
			Q: $elm$core$Maybe$Nothing,
			g: $author$project$State$emptyClientForm,
			aQ: false,
			a7: '',
			bN: $elm$core$Maybe$Nothing,
			bO: '',
			aR: $elm$json$Json$Encode$null,
			a8: '',
			aS: _List_Nil,
			bP: 480,
			bQ: 0,
			a9: false,
			bR: 'Asia/Manila',
			W: $elm$core$Maybe$Nothing,
			bT: $elm$json$Json$Encode$null,
			c0: $elm$core$Dict$empty,
			c1: '',
			bU: $elm$core$Dict$empty,
			bV: '',
			aB: false,
			R: $elm$core$Maybe$Nothing,
			z: false,
			l: $author$project$State$emptyEditLeadFrom,
			S: false,
			A: false,
			dd: 'All',
			de: 'All',
			df: 'All',
			B: $elm$core$Dict$empty,
			u: false,
			p: $elm$json$Json$Encode$null,
			b0: '',
			dg: $elm$core$Dict$empty,
			dh: $elm$core$Dict$empty,
			bd: $elm$json$Json$Encode$null,
			aq: '',
			dj: 0,
			dk: '',
			b1: _List_Nil,
			dl: $elm$core$Maybe$Nothing,
			b: false,
			ab: function () {
				var _v0 = $author$project$State$routeOf(url);
				if (_v0.$ === 4) {
					var cid = _v0.a;
					return 'client:' + $elm$core$String$fromInt(cid);
				} else {
					return '';
				}
			}(),
			bg: 'tasks',
			v: key,
			as: _List_Nil,
			aY: 0,
			F: false,
			aZ: '',
			w: '',
			cb: A2(
				$elm$core$String$startsWith,
				'reset=',
				A2($elm$core$Maybe$withDefault, '', url.ag)) ? 'reset' : 'login',
			aE: '',
			a_: '',
			L: '',
			G: '',
			bl: false,
			bm: _List_Nil,
			q: '',
			bB: true,
			dB: 0,
			M: $elm$core$Maybe$Nothing,
			ae: $elm$core$Maybe$Nothing,
			aG: url.r === '/portal',
			bC: $elm$json$Json$Encode$null,
			cl: '',
			cm: $elm$core$Maybe$Nothing,
			cn: '',
			au: '',
			av: '',
			V: '',
			dC: '',
			n: $elm$json$Json$Encode$null,
			aI: $elm$core$Dict$empty,
			N: $elm$core$Set$empty,
			ah: $elm$core$Maybe$Nothing,
			Y: false,
			O: false,
			P: false,
			ax: false,
			ai: false,
			dL: true,
			dM: 'name',
			dQ: $elm$core$Maybe$Nothing,
			aj: _List_Nil,
			cC: 0,
			bo: _List_Nil,
			bH: '',
			dU: $elm$core$Maybe$Nothing,
			bq: url,
			I: $elm$core$Maybe$Nothing,
			a4: 0,
			o: $author$project$State$emptyUserForm,
			al: _List_Nil
		};
	});
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$time$Time$Name = function (a) {
	return {$: 0, a: a};
};
var $elm$time$Time$Offset = function (a) {
	return {$: 1, a: a};
};
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$customZone = $elm$time$Time$Zone;
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$now = _Time_now($elm$time$Time$millisToPosix);
var $author$project$Api$portalGet = function (ctx) {
	return A5($author$project$Api$authedRequest, ctx, 'GET', '/api/portal', $elm$core$Maybe$Nothing, $elm$json$Json$Decode$value);
};
var $author$project$Main$init = F3(
	function (_v0, url, key) {
		var proto = function () {
			var _v2 = url.cr;
			if (!_v2) {
				return 'http';
			} else {
				return 'https';
			}
		}();
		var base = $author$project$Api$computeBase(
			{b5: url.b5, ck: url.ck, cr: proto});
		return _Utils_Tuple2(
			function (m) {
				return _Utils_update(
					m,
					{
						am: base,
						dh: $author$project$Main$featureDefaultsForUrl(url)
					});
			}(
				A2($author$project$State$initialModel, key, url)),
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						A2($elm$core$Task$perform, $author$project$State$ClockTick, $elm$time$Time$now),
						A2(
						$author$project$Api$clock,
						{ao: base, dU: $elm$core$Maybe$Nothing},
						$author$project$State$ClockLoaded),
						function () {
						if (url.r === '/portal') {
							var _v1 = url.be;
							if (!_v1.$) {
								var fragment = _v1.a;
								return A2(
									$elm$core$Task$perform,
									$elm$core$Basics$always(
										$author$project$State$PortalExchange(
											A2($elm$core$String$dropLeft, 6, fragment))),
									$elm$core$Task$succeed(0));
							} else {
								return A2(
									$author$project$Api$portalGet,
									{ao: base, dU: $elm$core$Maybe$Nothing},
									A2(
										$author$project$Main$acceptLoad,
										A2($author$project$State$initialModel, key, url),
										$author$project$State$PortalLoaded));
							}
						} else {
							return $elm$core$Platform$Cmd$none;
						}
					}()
					])));
	});
var $author$project$State$ClockRefresh = function (a) {
	return {$: 168, a: a};
};
var $author$project$State$ClockRefreshRequested = {$: 169};
var $author$project$State$GotStoredDark = function (a) {
	return {$: 59, a: a};
};
var $author$project$State$GotStoredToken = function (a) {
	return {$: 58, a: a};
};
var $author$project$State$ReportSettingsLoaded = function (a) {
	return {$: 34, a: a};
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$time$Time$Every = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$State = F2(
	function (taggers, processes) {
		return {cq: processes, cB: taggers};
	});
var $elm$time$Time$init = $elm$core$Task$succeed(
	A2($elm$time$Time$State, $elm$core$Dict$empty, $elm$core$Dict$empty));
var $elm$time$Time$addMySub = F2(
	function (_v0, state) {
		var interval = _v0.a;
		var tagger = _v0.b;
		var _v1 = A2($elm$core$Dict$get, interval, state);
		if (_v1.$ === 1) {
			return A3(
				$elm$core$Dict$insert,
				interval,
				_List_fromArray(
					[tagger]),
				state);
		} else {
			var taggers = _v1.a;
			return A3(
				$elm$core$Dict$insert,
				interval,
				A2($elm$core$List$cons, tagger, taggers),
				state);
		}
	});
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Dict$merge = F6(
	function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(
			function (rKey, rValue, _v0) {
				stepState:
				while (true) {
					var list = _v0.a;
					var result = _v0.b;
					if (!list.b) {
						return _Utils_Tuple2(
							list,
							A3(rightStep, rKey, rValue, result));
					} else {
						var _v2 = list.a;
						var lKey = _v2.a;
						var lValue = _v2.b;
						var rest = list.b;
						if (_Utils_cmp(lKey, rKey) < 0) {
							var $temp$rKey = rKey,
								$temp$rValue = rValue,
								$temp$_v0 = _Utils_Tuple2(
								rest,
								A3(leftStep, lKey, lValue, result));
							rKey = $temp$rKey;
							rValue = $temp$rValue;
							_v0 = $temp$_v0;
							continue stepState;
						} else {
							if (_Utils_cmp(lKey, rKey) > 0) {
								return _Utils_Tuple2(
									list,
									A3(rightStep, rKey, rValue, result));
							} else {
								return _Utils_Tuple2(
									rest,
									A4(bothStep, lKey, lValue, rValue, result));
							}
						}
					}
				}
			});
		var _v3 = A3(
			$elm$core$Dict$foldl,
			stepState,
			_Utils_Tuple2(
				$elm$core$Dict$toList(leftDict),
				initialResult),
			rightDict);
		var leftovers = _v3.a;
		var intermediateResult = _v3.b;
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v4, result) {
					var k = _v4.a;
					var v = _v4.b;
					return A3(leftStep, k, v, result);
				}),
			intermediateResult,
			leftovers);
	});
var $elm$time$Time$setInterval = _Time_setInterval;
var $elm$time$Time$spawnHelp = F3(
	function (router, intervals, processes) {
		if (!intervals.b) {
			return $elm$core$Task$succeed(processes);
		} else {
			var interval = intervals.a;
			var rest = intervals.b;
			var spawnTimer = $elm$core$Process$spawn(
				A2(
					$elm$time$Time$setInterval,
					interval,
					A2($elm$core$Platform$sendToSelf, router, interval)));
			var spawnRest = function (id) {
				return A3(
					$elm$time$Time$spawnHelp,
					router,
					rest,
					A3($elm$core$Dict$insert, interval, id, processes));
			};
			return A2($elm$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
var $elm$time$Time$onEffects = F3(
	function (router, subs, _v0) {
		var processes = _v0.cq;
		var rightStep = F3(
			function (_v6, id, _v7) {
				var spawns = _v7.a;
				var existing = _v7.b;
				var kills = _v7.c;
				return _Utils_Tuple3(
					spawns,
					existing,
					A2(
						$elm$core$Task$andThen,
						function (_v5) {
							return kills;
						},
						$elm$core$Process$kill(id)));
			});
		var newTaggers = A3($elm$core$List$foldl, $elm$time$Time$addMySub, $elm$core$Dict$empty, subs);
		var leftStep = F3(
			function (interval, taggers, _v4) {
				var spawns = _v4.a;
				var existing = _v4.b;
				var kills = _v4.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, interval, spawns),
					existing,
					kills);
			});
		var bothStep = F4(
			function (interval, taggers, id, _v3) {
				var spawns = _v3.a;
				var existing = _v3.b;
				var kills = _v3.c;
				return _Utils_Tuple3(
					spawns,
					A3($elm$core$Dict$insert, interval, id, existing),
					kills);
			});
		var _v1 = A6(
			$elm$core$Dict$merge,
			leftStep,
			bothStep,
			rightStep,
			newTaggers,
			processes,
			_Utils_Tuple3(
				_List_Nil,
				$elm$core$Dict$empty,
				$elm$core$Task$succeed(0)));
		var spawnList = _v1.a;
		var existingDict = _v1.b;
		var killTask = _v1.c;
		return A2(
			$elm$core$Task$andThen,
			function (newProcesses) {
				return $elm$core$Task$succeed(
					A2($elm$time$Time$State, newTaggers, newProcesses));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v2) {
					return A3($elm$time$Time$spawnHelp, router, spawnList, existingDict);
				},
				killTask));
	});
var $elm$time$Time$onSelfMsg = F3(
	function (router, interval, state) {
		var _v0 = A2($elm$core$Dict$get, interval, state.cB);
		if (_v0.$ === 1) {
			return $elm$core$Task$succeed(state);
		} else {
			var taggers = _v0.a;
			var tellTaggers = function (time) {
				return $elm$core$Task$sequence(
					A2(
						$elm$core$List$map,
						function (tagger) {
							return A2(
								$elm$core$Platform$sendToApp,
								router,
								tagger(time));
						},
						taggers));
			};
			return A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$succeed(state);
				},
				A2($elm$core$Task$andThen, tellTaggers, $elm$time$Time$now));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$time$Time$subMap = F2(
	function (f, _v0) {
		var interval = _v0.a;
		var tagger = _v0.b;
		return A2(
			$elm$time$Time$Every,
			interval,
			A2($elm$core$Basics$composeL, f, tagger));
	});
_Platform_effectManagers['Time'] = _Platform_createManager($elm$time$Time$init, $elm$time$Time$onEffects, $elm$time$Time$onSelfMsg, 0, $elm$time$Time$subMap);
var $elm$time$Time$subscription = _Platform_leaf('Time');
var $elm$time$Time$every = F2(
	function (interval, tagger) {
		return $elm$time$Time$subscription(
			A2($elm$time$Time$Every, interval, tagger));
	});
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $author$project$Main$loadDark = _Platform_incomingPort('loadDark', $elm$json$Json$Decode$bool);
var $author$project$Main$loadReportLayout = _Platform_incomingPort('loadReportLayout', $elm$json$Json$Decode$value);
var $elm$json$Json$Decode$null = _Json_decodeNull;
var $elm$json$Json$Decode$oneOf = _Json_oneOf;
var $author$project$Main$loadToken = _Platform_incomingPort(
	'loadToken',
	$elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$string)
			])));
var $elm$browser$Browser$Events$Document = 0;
var $elm$browser$Browser$Events$MySub = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$browser$Browser$Events$State = F2(
	function (subs, pids) {
		return {cj: pids, cA: subs};
	});
var $elm$browser$Browser$Events$init = $elm$core$Task$succeed(
	A2($elm$browser$Browser$Events$State, _List_Nil, $elm$core$Dict$empty));
var $elm$browser$Browser$Events$nodeToKey = function (node) {
	if (!node) {
		return 'd_';
	} else {
		return 'w_';
	}
};
var $elm$browser$Browser$Events$addKey = function (sub) {
	var node = sub.a;
	var name = sub.b;
	return _Utils_Tuple2(
		_Utils_ap(
			$elm$browser$Browser$Events$nodeToKey(node),
			name),
		sub);
};
var $elm$browser$Browser$Events$Event = F2(
	function (key, event) {
		return {bZ: event, v: key};
	});
var $elm$browser$Browser$Events$spawn = F3(
	function (router, key, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var actualNode = function () {
			if (!node) {
				return _Browser_doc;
			} else {
				return _Browser_window;
			}
		}();
		return A2(
			$elm$core$Task$map,
			function (value) {
				return _Utils_Tuple2(key, value);
			},
			A3(
				_Browser_on,
				actualNode,
				name,
				function (event) {
					return A2(
						$elm$core$Platform$sendToSelf,
						router,
						A2($elm$browser$Browser$Events$Event, key, event));
				}));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$browser$Browser$Events$onEffects = F3(
	function (router, subs, state) {
		var stepRight = F3(
			function (key, sub, _v6) {
				var deads = _v6.a;
				var lives = _v6.b;
				var news = _v6.c;
				return _Utils_Tuple3(
					deads,
					lives,
					A2(
						$elm$core$List$cons,
						A3($elm$browser$Browser$Events$spawn, router, key, sub),
						news));
			});
		var stepLeft = F3(
			function (_v4, pid, _v5) {
				var deads = _v5.a;
				var lives = _v5.b;
				var news = _v5.c;
				return _Utils_Tuple3(
					A2($elm$core$List$cons, pid, deads),
					lives,
					news);
			});
		var stepBoth = F4(
			function (key, pid, _v2, _v3) {
				var deads = _v3.a;
				var lives = _v3.b;
				var news = _v3.c;
				return _Utils_Tuple3(
					deads,
					A3($elm$core$Dict$insert, key, pid, lives),
					news);
			});
		var newSubs = A2($elm$core$List$map, $elm$browser$Browser$Events$addKey, subs);
		var _v0 = A6(
			$elm$core$Dict$merge,
			stepLeft,
			stepBoth,
			stepRight,
			state.cj,
			$elm$core$Dict$fromList(newSubs),
			_Utils_Tuple3(_List_Nil, $elm$core$Dict$empty, _List_Nil));
		var deadPids = _v0.a;
		var livePids = _v0.b;
		var makeNewPids = _v0.c;
		return A2(
			$elm$core$Task$andThen,
			function (pids) {
				return $elm$core$Task$succeed(
					A2(
						$elm$browser$Browser$Events$State,
						newSubs,
						A2(
							$elm$core$Dict$union,
							livePids,
							$elm$core$Dict$fromList(pids))));
			},
			A2(
				$elm$core$Task$andThen,
				function (_v1) {
					return $elm$core$Task$sequence(makeNewPids);
				},
				$elm$core$Task$sequence(
					A2($elm$core$List$map, $elm$core$Process$kill, deadPids))));
	});
var $elm$browser$Browser$Events$onSelfMsg = F3(
	function (router, _v0, state) {
		var key = _v0.v;
		var event = _v0.bZ;
		var toMessage = function (_v2) {
			var subKey = _v2.a;
			var _v3 = _v2.b;
			var node = _v3.a;
			var name = _v3.b;
			var decoder = _v3.c;
			return _Utils_eq(subKey, key) ? A2(_Browser_decodeEvent, decoder, event) : $elm$core$Maybe$Nothing;
		};
		var messages = A2($elm$core$List$filterMap, toMessage, state.cA);
		return A2(
			$elm$core$Task$andThen,
			function (_v1) {
				return $elm$core$Task$succeed(state);
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Platform$sendToApp(router),
					messages)));
	});
var $elm$browser$Browser$Events$subMap = F2(
	function (func, _v0) {
		var node = _v0.a;
		var name = _v0.b;
		var decoder = _v0.c;
		return A3(
			$elm$browser$Browser$Events$MySub,
			node,
			name,
			A2($elm$json$Json$Decode$map, func, decoder));
	});
_Platform_effectManagers['Browser.Events'] = _Platform_createManager($elm$browser$Browser$Events$init, $elm$browser$Browser$Events$onEffects, $elm$browser$Browser$Events$onSelfMsg, 0, $elm$browser$Browser$Events$subMap);
var $elm$browser$Browser$Events$subscription = _Platform_leaf('Browser.Events');
var $elm$browser$Browser$Events$on = F3(
	function (node, name, decoder) {
		return $elm$browser$Browser$Events$subscription(
			A3($elm$browser$Browser$Events$MySub, node, name, decoder));
	});
var $elm$browser$Browser$Events$Hidden = 1;
var $elm$browser$Browser$Events$Visible = 0;
var $elm$browser$Browser$Events$withHidden = F2(
	function (func, isHidden) {
		return func(
			isHidden ? 1 : 0);
	});
var $elm$browser$Browser$Events$onVisibilityChange = function (func) {
	var info = _Browser_visibilityInfo(0);
	return A3(
		$elm$browser$Browser$Events$on,
		0,
		info.cY,
		A2(
			$elm$json$Json$Decode$map,
			$elm$browser$Browser$Events$withHidden(func),
			A2(
				$elm$json$Json$Decode$field,
				'target',
				A2($elm$json$Json$Decode$field, info.dm, $elm$json$Json$Decode$bool))));
};
var $author$project$Main$subscriptions = function (_v0) {
	return $elm$core$Platform$Sub$batch(
		_List_fromArray(
			[
				A2($elm$time$Time$every, 1000, $author$project$State$ClockTick),
				A2($elm$time$Time$every, 60000, $author$project$State$ClockRefresh),
				$elm$browser$Browser$Events$onVisibilityChange(
				$elm$core$Basics$always($author$project$State$ClockRefreshRequested)),
				$author$project$Main$loadToken($author$project$State$GotStoredToken),
				$author$project$Main$loadReportLayout($author$project$State$ReportSettingsLoaded),
				$author$project$Main$loadDark($author$project$State$GotStoredDark)
			]));
};
var $author$project$State$AddLeadDone = function (a) {
	return {$: 79, a: a};
};
var $author$project$State$AddTaskDone = function (a) {
	return {$: 121, a: a};
};
var $author$project$State$AdvanceDone = function (a) {
	return {$: 87, a: a};
};
var $author$project$State$BulkDone = function (a) {
	return {$: 111, a: a};
};
var $author$project$State$CaseFormSaved = function (a) {
	return {$: 135, a: a};
};
var $author$project$State$ClientDocUploaded = function (a) {
	return {$: 143, a: a};
};
var $author$project$State$ClientFormSaved = function (a) {
	return {$: 127, a: a};
};
var $author$project$State$ClientPhotoDone = F2(
	function (a, b) {
		return {$: 91, a: a, b: b};
	});
var $author$project$State$ClientProfileLoaded = function (a) {
	return {$: 88, a: a};
};
var $author$project$State$ClientUpdated = function (a) {
	return {$: 128, a: a};
};
var $author$project$State$ClientsLoaded = function (a) {
	return {$: 70, a: a};
};
var $author$project$State$ClockAligned = F4(
	function (a, b, c, d) {
		return {$: 171, a: a, b: b, c: c, d: d};
	});
var $author$project$State$ConvertDone = function (a) {
	return {$: 95, a: a};
};
var $author$project$State$DeleteCaseDone = function (a) {
	return {$: 137, a: a};
};
var $author$project$State$DeleteClientDone = function (a) {
	return {$: 130, a: a};
};
var $author$project$State$DeleteLeadDone = function (a) {
	return {$: 85, a: a};
};
var $author$project$State$DeleteUserDone = function (a) {
	return {$: 157, a: a};
};
var $author$project$State$DiscardChanges = function (a) {
	return {$: 38, a: a};
};
var $author$project$State$DocDeleteDone = function (a) {
	return {$: 145, a: a};
};
var $author$project$State$EditLeadDone = function (a) {
	return {$: 83, a: a};
};
var $author$project$State$FeatureDone = function (a) {
	return {$: 44, a: a};
};
var $author$project$State$FeatureLoaded = function (a) {
	return {$: 15, a: a};
};
var $author$project$State$LeadDocUploaded = function (a) {
	return {$: 142, a: a};
};
var $author$project$State$LeadsImported = function (a) {
	return {$: 148, a: a};
};
var $author$project$State$LeadsLoaded = function (a) {
	return {$: 67, a: a};
};
var $author$project$State$LoginDone = function (a) {
	return {$: 64, a: a};
};
var $author$project$State$LogoutDone = function (a) {
	return {$: 9, a: a};
};
var $author$project$State$MeDone = function (a) {
	return {$: 65, a: a};
};
var $author$project$State$NavigateTo = function (a) {
	return {$: 165, a: a};
};
var $author$project$State$NoteDone = function (a) {
	return {$: 98, a: a};
};
var $author$project$State$OperationDone = function (a) {
	return {$: 14, a: a};
};
var $author$project$State$PasswordChangeDone = function (a) {
	return {$: 163, a: a};
};
var $author$project$State$PortalExchanged = function (a) {
	return {$: 47, a: a};
};
var $author$project$State$PortalLogoutDone = function (a) {
	return {$: 54, a: a};
};
var $author$project$State$PortalUploaded = function (a) {
	return {$: 51, a: a};
};
var $author$project$State$RecoveryDone = function (a) {
	return {$: 7, a: a};
};
var $author$project$State$ResetDone = function (a) {
	return {$: 8, a: a};
};
var $author$project$State$SearchReady = F2(
	function (a, b) {
		return {$: 11, a: a, b: b};
	});
var $author$project$State$TaskDeleteDone = function (a) {
	return {$: 115, a: a};
};
var $author$project$State$TaskEditorLoaded = function (a) {
	return {$: 40, a: a};
};
var $author$project$State$TaskStatusDone = function (a) {
	return {$: 113, a: a};
};
var $author$project$State$UserSaved = function (a) {
	return {$: 154, a: a};
};
var $author$project$State$UserUpdatedDone = function (a) {
	return {$: 155, a: a};
};
var $author$project$State$UsersLoaded = function (a) {
	return {$: 68, a: a};
};
var $author$project$Types$encodeNote = function (note) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'nrNote',
				$elm$json$Json$Encode$string(note))
			]));
};
var $elm$json$Json$Decode$keyValuePairs = _Json_decodeKeyValuePairs;
var $elm$json$Json$Decode$dict = function (decoder) {
	return A2(
		$elm$json$Json$Decode$map,
		$elm$core$Dict$fromList,
		$elm$json$Json$Decode$keyValuePairs(decoder));
};
var $author$project$Api$ignoreDecoder = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$json$Json$Decode$map,
			function (_v0) {
				return 0;
			},
			$elm$json$Json$Decode$dict($elm$json$Json$Decode$value)),
			$elm$json$Json$Decode$succeed(0)
		]));
var $elm$http$Http$jsonBody = function (value) {
	return A2(
		_Http_pair,
		'application/json',
		A2($elm$json$Json$Encode$encode, 0, value));
};
var $author$project$Api$addNote = F3(
	function (ctx, id, note) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/leads/' + ($elm$core$String$fromInt(id) + '/notes'),
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(
					$author$project$Types$encodeNote(note))),
			$author$project$Api$ignoreDecoder);
	});
var $author$project$Types$Lead = function (id) {
	return function (number) {
		return function (fullName) {
			return function (email) {
				return function (phone) {
					return function (source) {
						return function (consultantId) {
							return function (consultantName) {
								return function (quality) {
									return function (stage) {
										return function (destination) {
											return function (service) {
												return function (notes) {
													return function (lastContact) {
														return function (nextFollowup) {
															return function (createdAt) {
																return function (updatedAt) {
																	return function (revision) {
																		return {bs: consultantId, c2: consultantName, aA: createdAt, bb: destination, J: email, aV: fullName, bu: id, ds: lastContact, cd: nextFollowup, aF: notes, ce: number, ci: phone, aH: quality, t: revision, aJ: service, aL: source, dO: stage, dZ: updatedAt};
																	};
																};
															};
														};
													};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Types$dateStr = $elm$json$Json$Decode$string;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Types$maybeInt = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$int),
			$elm$json$Json$Decode$null($elm$core$Maybe$Nothing)
		]));
var $author$project$Types$maybeString = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, $elm$json$Json$Decode$string),
			$elm$json$Json$Decode$null($elm$core$Maybe$Nothing)
		]));
var $elm$json$Json$Decode$nullable = function (decoder) {
	return $elm$json$Json$Decode$oneOf(
		_List_fromArray(
			[
				$elm$json$Json$Decode$null($elm$core$Maybe$Nothing),
				A2($elm$json$Json$Decode$map, $elm$core$Maybe$Just, decoder)
			]));
};
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom = $elm$json$Json$Decode$map2($elm$core$Basics$apR);
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder = F3(
	function (path, valDecoder, fallback) {
		var nullOr = function (decoder) {
			return $elm$json$Json$Decode$oneOf(
				_List_fromArray(
					[
						decoder,
						$elm$json$Json$Decode$null(fallback)
					]));
		};
		var handleResult = function (input) {
			var _v0 = A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$at, path, $elm$json$Json$Decode$value),
				input);
			if (!_v0.$) {
				var rawValue = _v0.a;
				var _v1 = A2(
					$elm$json$Json$Decode$decodeValue,
					nullOr(valDecoder),
					rawValue);
				if (!_v1.$) {
					var finalResult = _v1.a;
					return $elm$json$Json$Decode$succeed(finalResult);
				} else {
					return A2(
						$elm$json$Json$Decode$at,
						path,
						nullOr(valDecoder));
				}
			} else {
				return $elm$json$Json$Decode$succeed(fallback);
			}
		};
		return A2($elm$json$Json$Decode$andThen, handleResult, $elm$json$Json$Decode$value);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional = F4(
	function (key, valDecoder, fallback, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optionalDecoder,
				_List_fromArray(
					[key]),
				valDecoder,
				fallback),
			decoder);
	});
var $NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required = F3(
	function (key, valDecoder, decoder) {
		return A2(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$custom,
			A2($elm$json$Json$Decode$field, key, valDecoder),
			decoder);
	});
var $author$project$Types$leadDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'revision',
	$elm$json$Json$Decode$int,
	1,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'updatedAt',
		$author$project$Types$dateStr,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'createdAt',
			$author$project$Types$dateStr,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'nextFollowup',
				$elm$json$Json$Decode$nullable($author$project$Types$dateStr),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'lastContact',
					$elm$json$Json$Decode$nullable($author$project$Types$dateStr),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'notes',
						$author$project$Types$maybeString,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'service',
							$author$project$Types$maybeString,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'destination',
								$author$project$Types$maybeString,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'stage',
									$elm$json$Json$Decode$string,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'quality',
										$author$project$Types$maybeString,
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'consultantName',
											$author$project$Types$maybeString,
											A3(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'consultantId',
												$author$project$Types$maybeInt,
												A3(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
													'source',
													$author$project$Types$maybeString,
													A3(
														$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
														'phone',
														$author$project$Types$maybeString,
														A3(
															$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
															'email',
															$author$project$Types$maybeString,
															A3(
																$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																'fullName',
																$elm$json$Json$Decode$string,
																A3(
																	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																	'leadNumber',
																	$elm$json$Json$Decode$string,
																	A3(
																		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
																		'leadId',
																		$elm$json$Json$Decode$int,
																		$elm$json$Json$Decode$succeed($author$project$Types$Lead)))))))))))))))))));
var $author$project$Api$advanceLead = F2(
	function (ctx, id) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/leads/' + ($elm$core$String$fromInt(id) + '/advance'),
			$elm$core$Maybe$Nothing,
			$author$project$Types$leadDecoder);
	});
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Result$andThen = F2(
	function (callback, result) {
		if (!result.$) {
			var value = result.a;
			return callback(value);
		} else {
			var msg = result.a;
			return $elm$core$Result$Err(msg);
		}
	});
var $author$project$State$ConflictLoaded = function (a) {
	return {$: 26, a: a};
};
var $elm$url$Url$percentEncode = _Url_percentEncode;
var $author$project$Api$featureGet = F4(
	function (ctx, section, query, offset) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'GET',
			'/api/workspace/' + (section + ('?q=' + ($elm$url$Url$percentEncode(query) + ('&offset=' + $elm$core$String$fromInt(offset))))),
			$elm$core$Maybe$Nothing,
			$elm$json$Json$Decode$value);
	});
var $elm$core$Dict$map = F2(
	function (func, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				A2(func, key, value),
				A2($elm$core$Dict$map, func, left),
				A2($elm$core$Dict$map, func, right));
		}
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$json$Json$Decode$float = _Json_decodeFloat;
var $elm$core$String$fromFloat = _String_fromNumber;
var $author$project$Features$scalar = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			$elm$json$Json$Decode$string,
			A2($elm$json$Json$Decode$map, $elm$core$String$fromInt, $elm$json$Json$Decode$int),
			A2($elm$json$Json$Decode$map, $elm$core$String$fromFloat, $elm$json$Json$Decode$float),
			A2(
			$elm$json$Json$Decode$map,
			function (b) {
				return b ? 'true' : 'false';
			},
			$elm$json$Json$Decode$bool),
			$elm$json$Json$Decode$null('')
		]));
var $elm$core$Result$toMaybe = function (result) {
	if (!result.$) {
		var v = result.a;
		return $elm$core$Maybe$Just(v);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Features$formValues = function (row) {
	return A2(
		$elm$core$Dict$map,
		F2(
			function (key, value_) {
				return A2(
					$elm$core$List$member,
					key,
					_List_fromArray(
						['required', 'enabled', 'assignments', 'deadlines', 'documents', 'escalations', 'emailEnabled'])) ? ((value_ === '1') ? 'true' : ((value_ === '0') ? 'false' : value_)) : value_;
			}),
		$elm$core$Dict$fromList(
			A2(
				$elm$core$List$filterMap,
				function (_v0) {
					var key = _v0.a;
					var value = _v0.b;
					return A2(
						$elm$core$Maybe$map,
						$elm$core$Tuple$pair(key),
						$elm$core$Result$toMaybe(
							A2($elm$json$Json$Decode$decodeValue, $author$project$Features$scalar, value)));
				},
				A2(
					$elm$core$Result$withDefault,
					_List_Nil,
					A2(
						$elm$json$Json$Decode$decodeValue,
						$elm$json$Json$Decode$keyValuePairs($elm$json$Json$Decode$value),
						row)))));
};
var $author$project$Main$beginConflict = F5(
	function (model, kind, rid, original, edited) {
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					bT: $elm$json$Json$Encode$null,
					c0: $author$project$Features$formValues(edited),
					c1: kind,
					bU: $author$project$Features$formValues(original)
				}),
			A5(
				$author$project$Api$featureGet,
				{ao: model.am, dU: model.dU},
				'conflict/' + (kind + ('/' + $elm$core$String$fromInt(rid))),
				'',
				0,
				A2($author$project$Main$acceptLoad, model, $author$project$State$ConflictLoaded)));
	});
var $elm$json$Json$Encode$int = _Json_wrap;
var $author$project$Types$encodeBulkRequest = function (b) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'brOp',
				$elm$json$Json$Encode$string(b.bz)),
				_Utils_Tuple2(
				'brIds',
				A2($elm$json$Json$Encode$list, $elm$json$Json$Encode$int, b.bv)),
				_Utils_Tuple2(
				'brConsultantId',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $elm$json$Json$Encode$int, b.bs)))
			]));
};
var $author$project$Api$bulkLeads = F2(
	function (ctx, spec) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/bulk/leads',
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(
					$author$project$Types$encodeBulkRequest(spec))),
			$author$project$Api$ignoreDecoder);
	});
var $elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3($elm$core$Dict$insert, k, v, d) : d;
				}),
			$elm$core$Dict$empty,
			dict);
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$String$toLower = _String_toLower;
var $author$project$Main$draftFields = $elm$core$Dict$filter(
	F2(
		function (key, _v0) {
			return !A2(
				$elm$core$List$member,
				$elm$core$String$toLower(key),
				_List_fromArray(
					['password', 'code', 'secret', 'currentpassword', 'newpassword', 'pwcurrent', 'pwnew', 'pwconfirm', 'token', 'url']));
		}));
var $author$project$Main$featureSection = function (model) {
	var _v0 = $author$project$State$routeOf(model.bq);
	switch (_v0.$) {
		case 4:
			return model.bg;
		case 5:
			return 'tasks';
		case 8:
			var kind = _v0.a;
			return A2($elm$core$String$startsWith, 'work/', kind) ? A2($elm$core$String$dropLeft, 5, kind) : kind;
		default:
			return '';
	}
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Main$hasDraftChanges = function (model) {
	return model.b || ((model.G !== '') || ((!_Utils_eq(model.M, $elm$core$Maybe$Nothing)) || ((!_Utils_eq(model.c_, $elm$core$Maybe$Nothing)) || ((!_Utils_eq(model.bN, $elm$core$Maybe$Nothing)) || ((!_Utils_eq(model.dl, $elm$core$Maybe$Nothing)) || (!_Utils_eq(model.ae, $elm$core$Maybe$Nothing)))))));
};
var $elm$url$Url$addPort = F2(
	function (maybePort, starter) {
		if (maybePort.$ === 1) {
			return starter;
		} else {
			var port_ = maybePort.a;
			return starter + (':' + $elm$core$String$fromInt(port_));
		}
	});
var $elm$url$Url$addPrefixed = F3(
	function (prefix, maybeSegment, starter) {
		if (maybeSegment.$ === 1) {
			return starter;
		} else {
			var segment = maybeSegment.a;
			return _Utils_ap(
				starter,
				_Utils_ap(prefix, segment));
		}
	});
var $elm$url$Url$toString = function (url) {
	var http = function () {
		var _v0 = url.cr;
		if (!_v0) {
			return 'http://';
		} else {
			return 'https://';
		}
	}();
	return A3(
		$elm$url$Url$addPrefixed,
		'#',
		url.be,
		A3(
			$elm$url$Url$addPrefixed,
			'?',
			url.ag,
			_Utils_ap(
				A2(
					$elm$url$Url$addPort,
					url.ck,
					_Utils_ap(http, url.b5)),
				url.r)));
};
var $author$project$Main$captureSessionDraft = function (model) {
	return (_Utils_eq(model.I, $elm$core$Maybe$Nothing) || (!$author$project$Main$hasDraftChanges(model))) ? model.ah : A2(
		$elm$core$Maybe$map,
		function (user) {
			var safeFeature = A2(
				$elm$core$List$member,
				$author$project$Main$featureSection(model),
				_List_fromArray(
					['tasks', 'history', 'documents', 'applications', 'invoices', 'payments', 'payment-history', 'expenses', 'periods', 'reconciliation', 'appointments']));
			return {
				y: model.y,
				f: model.f,
				k: model.k,
				Q: model.Q,
				g: model.g,
				l: model.l,
				S: model.S,
				A: model.A,
				B: safeFeature ? $author$project$Main$draftFields(model.B) : $elm$core$Dict$empty,
				dh: safeFeature ? $author$project$Main$draftFields(model.dh) : $elm$core$Dict$empty,
				b: model.b,
				ab: model.ab,
				bg: model.bg,
				G: model.G,
				ch: user.bu,
				r: $elm$url$Url$toString(model.bq),
				n: ($author$project$Main$featureSection(model) === 'security') ? $elm$json$Json$Encode$null : model.n,
				Y: model.Y,
				O: model.O,
				P: model.P
			};
		},
		model.I);
};
var $author$project$State$caseFormOf = function (cr) {
	return {
		aP: $elm$core$Maybe$Just(cr.bu),
		cX: A2($elm$core$Maybe$withDefault, 'Student Visa', cr.cX),
		aT: A2($elm$core$Maybe$withDefault, '', cr.aT),
		bb: A2($elm$core$Maybe$withDefault, 'Canada', cr.bb),
		t: cr.t,
		dO: cr.dO
	};
};
var $elm$core$String$trim = _String_trim;
var $author$project$Types$encodeNonEmpty = function (s) {
	return ($elm$core$String$trim(s) === '') ? $elm$json$Json$Encode$null : $elm$json$Json$Encode$string(s);
};
var $author$project$Types$maybeDate = function (s) {
	return ($elm$core$String$trim(s) === '') ? $elm$json$Json$Encode$null : $elm$json$Json$Encode$string(s);
};
var $author$project$Types$encodeCaseInput = function (f) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'ciServiceCategory',
				$author$project$Types$encodeNonEmpty(f.cX)),
				_Utils_Tuple2(
				'ciDestination',
				$author$project$Types$encodeNonEmpty(f.bb)),
				_Utils_Tuple2(
				'ciStage',
				$author$project$Types$encodeNonEmpty(f.dO)),
				_Utils_Tuple2(
				'ciNextDeadline',
				$author$project$Types$maybeDate(f.aT)),
				_Utils_Tuple2(
				'ciCaseId',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $elm$json$Json$Encode$int, f.aP)))
			]));
};
var $author$project$Main$casePayload = function (cf) {
	return $author$project$Types$encodeCaseInput(
		{aP: cf.aP, cX: cf.cX, aT: cf.aT, bb: cf.bb, dO: cf.dO});
};
var $author$project$Types$encodePasswordChange = function (f) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'pcCurrent',
				$elm$json$Json$Encode$string(f.c4)),
				_Utils_Tuple2(
				'pcNew',
				$elm$json$Json$Encode$string(f.dv))
			]));
};
var $author$project$Api$changePassword = F3(
	function (ctx, current, _new) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'PUT',
			'/api/auth/password',
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(
					$author$project$Types$encodePasswordChange(
						{c4: current, dv: _new}))),
			$author$project$Api$ignoreDecoder);
	});
var $elm$http$Http$filePart = _Http_pair;
var $elm$http$Http$multipartBody = function (parts) {
	return A2(
		_Http_pair,
		'',
		_Http_toFormData(parts));
};
var $elm$http$Http$stringPart = _Http_pair;
var $author$project$Api$checklistUpload = F4(
	function (ctx, rid, revision, file) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/workspace/documents/' + ($elm$core$String$fromInt(rid) + '/upload'),
			$elm$core$Maybe$Just(
				$elm$http$Http$multipartBody(
					_List_fromArray(
						[
							A2($elm$http$Http$filePart, 'file', file),
							A2(
							$elm$http$Http$stringPart,
							'expectedRevision',
							$elm$core$String$fromInt(revision))
						]))),
			$elm$json$Json$Decode$value);
	});
var $author$project$Main$clearDraftInputs = function (model) {
	var empty = A2($author$project$State$initialModel, model.v, model.bq);
	return _Utils_update(
		model,
		{y: empty.y, f: empty.f, k: empty.k, c_: empty.c_, Q: empty.Q, g: empty.g, bN: empty.bN, W: $elm$core$Maybe$Nothing, bT: empty.bT, c0: empty.c0, bU: empty.bU, l: empty.l, S: empty.S, A: empty.A, B: empty.B, dh: empty.dh, dl: empty.dl, b: empty.b, ab: empty.ab, bg: empty.bg, G: empty.G, M: empty.M, ae: empty.ae, au: empty.au, av: empty.av, V: empty.V, n: empty.n, Y: empty.Y, O: empty.O, P: empty.P, ax: empty.ax, ai: empty.ai, o: empty.o});
};
var $author$project$State$clientFormOf = function (c) {
	return {
		J: A2($elm$core$Maybe$withDefault, '', c.J),
		aV: c.aV,
		cg: A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Maybe$map, $elm$core$String$fromInt, c.cU)),
		ci: A2($elm$core$Maybe$withDefault, '', c.ci),
		t: c.t
	};
};
var $author$project$Types$encodeNewClient = function (f) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'ncFullName',
				$elm$json$Json$Encode$string(f.aV)),
				_Utils_Tuple2(
				'ncEmail',
				$author$project$Types$encodeNonEmpty(f.J)),
				_Utils_Tuple2(
				'ncPhone',
				$author$project$Types$encodeNonEmpty(f.ci)),
				_Utils_Tuple2(
				'ncCaseOfficer',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $elm$json$Json$Encode$int, f.cg)))
			]));
};
var $author$project$Main$withRevision = F2(
	function (revision, value) {
		return $elm$json$Json$Encode$object(
			A2(
				$elm$core$List$cons,
				_Utils_Tuple2(
					'expectedRevision',
					$elm$json$Json$Encode$int(revision)),
				A2(
					$elm$core$Result$withDefault,
					_List_Nil,
					A2(
						$elm$json$Json$Decode$decodeValue,
						$elm$json$Json$Decode$keyValuePairs($elm$json$Json$Decode$value),
						value))));
	});
var $author$project$Main$clientPayload = function (model) {
	return A2(
		$author$project$Main$withRevision,
		model.g.t,
		$author$project$Types$encodeNewClient(
			{
				J: model.g.J,
				aV: model.g.aV,
				cg: $elm$core$String$toInt(model.g.cg),
				ci: model.g.ci
			}));
};
var $author$project$Api$clientProfile = F2(
	function (ctx, cid) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'GET',
			'/api/clients/' + ($elm$core$String$fromInt(cid) + '/profile'),
			$elm$core$Maybe$Nothing,
			$elm$json$Json$Decode$value);
	});
var $author$project$Main$clientTaskBody = F2(
	function (model, cid) {
		var form = model.f;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2('ntLeadId', $elm$json$Json$Encode$null),
					_Utils_Tuple2(
					'ntClientId',
					$elm$json$Json$Encode$int(cid)),
					_Utils_Tuple2(
					'ntTitle',
					$elm$json$Json$Encode$string(form.Z)),
					_Utils_Tuple2(
					'ntDescription',
					$elm$json$Json$Encode$string(form.aU)),
					_Utils_Tuple2(
					'ntDueDate',
					(form.aC === '') ? $elm$json$Json$Encode$null : $elm$json$Json$Encode$string(form.aC)),
					_Utils_Tuple2(
					'ntPriority',
					$elm$json$Json$Encode$string(form.a$))
				]));
	});
var $author$project$Types$Client = F9(
	function (id, number, fullName, email, phone, caseOfficerId, caseOfficerName, createdAt, revision) {
		return {cU: caseOfficerId, cV: caseOfficerName, aA: createdAt, J: email, aV: fullName, bu: id, ce: number, ci: phone, t: revision};
	});
var $author$project$Types$clientDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'revision',
	$elm$json$Json$Decode$int,
	1,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'createdAt',
		$author$project$Types$dateStr,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'caseOfficerName',
			$author$project$Types$maybeString,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'caseOfficerId',
				$author$project$Types$maybeInt,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'phone',
					$author$project$Types$maybeString,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'email',
						$author$project$Types$maybeString,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'fullName',
							$elm$json$Json$Decode$string,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'number',
								$elm$json$Json$Decode$string,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'id',
									$elm$json$Json$Decode$int,
									$elm$json$Json$Decode$succeed($author$project$Types$Client))))))))));
var $author$project$Api$convertLead = F2(
	function (ctx, id) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/leads/' + ($elm$core$String$fromInt(id) + '/convert'),
			$elm$core$Maybe$Nothing,
			$author$project$Types$clientDecoder);
	});
var $author$project$Api$createClient = F2(
	function (ctx, body) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/clients',
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(body)),
			$author$project$Types$clientDecoder);
	});
var $author$project$Api$createLead = F2(
	function (ctx, body) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/leads',
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(body)),
			$author$project$Types$leadDecoder);
	});
var $author$project$Types$Task = function (id) {
	return function (leadId) {
		return function (leadName) {
			return function (title) {
				return function (description) {
					return function (dueDate) {
						return function (priority) {
							return function (status) {
								return function (assignedTo) {
									return function (assigneeName) {
										return function (createdAt) {
											return function (clientId) {
												return function (revision) {
													return {cR: assignedTo, cT: assigneeName, br: clientId, aA: createdAt, aU: description, aC: dueDate, bu: id, aW: leadId, ca: leadName, a$: priority, t: revision, dR: status, Z: title};
												};
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Types$taskDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'revision',
	$elm$json$Json$Decode$int,
	1,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'clientId',
		$author$project$Types$maybeInt,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'createdAt',
			$author$project$Types$dateStr,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'assigneeName',
				$author$project$Types$maybeString,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'assignedTo',
					$author$project$Types$maybeInt,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'status',
						$elm$json$Json$Decode$string,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'priority',
							$elm$json$Json$Decode$string,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'dueDate',
								$elm$json$Json$Decode$nullable($author$project$Types$dateStr),
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'description',
									$author$project$Types$maybeString,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'title',
										$elm$json$Json$Decode$string,
										A3(
											$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
											'leadName',
											$author$project$Types$maybeString,
											A3(
												$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
												'leadId',
												$elm$json$Json$Decode$int,
												A3(
													$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
													'id',
													$elm$json$Json$Decode$int,
													$elm$json$Json$Decode$succeed($author$project$Types$Task))))))))))))));
var $author$project$Api$createTask = F2(
	function (ctx, body) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/tasks',
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(body)),
			$author$project$Types$taskDecoder);
	});
var $author$project$Types$User = F6(
	function (id, email, name, role, revision, mfaRequired) {
		return {J: email, bu: id, bj: mfaRequired, x: name, t: revision, H: role};
	});
var $author$project$Types$userDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'mfaRequired',
	$elm$json$Json$Decode$bool,
	false,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'revision',
		$elm$json$Json$Decode$int,
		1,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'role',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'name',
				$elm$json$Json$Decode$string,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'email',
					$elm$json$Json$Decode$string,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'id',
						$elm$json$Json$Decode$int,
						$elm$json$Json$Decode$succeed($author$project$Types$User)))))));
var $author$project$Api$createUser = F2(
	function (ctx, body) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/users',
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(body)),
			$author$project$Types$userDecoder);
	});
var $author$project$Api$deleteCase = F2(
	function (ctx, id) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'DELETE',
			'/api/cases/' + $elm$core$String$fromInt(id),
			$elm$core$Maybe$Nothing,
			$author$project$Api$ignoreDecoder);
	});
var $author$project$Api$deleteClient = F2(
	function (ctx, id) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'DELETE',
			'/api/clients/' + $elm$core$String$fromInt(id),
			$elm$core$Maybe$Nothing,
			$author$project$Api$ignoreDecoder);
	});
var $author$project$Api$deleteDocument = F2(
	function (ctx, id) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'DELETE',
			'/api/documents/' + $elm$core$String$fromInt(id),
			$elm$core$Maybe$Nothing,
			$author$project$Api$ignoreDecoder);
	});
var $author$project$Api$deleteLead = F2(
	function (ctx, id) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'DELETE',
			'/api/leads/' + $elm$core$String$fromInt(id),
			$elm$core$Maybe$Nothing,
			$author$project$Api$ignoreDecoder);
	});
var $author$project$Api$deleteTask = F2(
	function (ctx, id) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'DELETE',
			'/api/tasks/' + $elm$core$String$fromInt(id),
			$elm$core$Maybe$Nothing,
			$author$project$Api$ignoreDecoder);
	});
var $author$project$Api$deleteUser = F2(
	function (ctx, id) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'DELETE',
			'/api/users/' + $elm$core$String$fromInt(id),
			$elm$core$Maybe$Nothing,
			$author$project$Api$ignoreDecoder);
	});
var $elm$json$Json$Encode$dict = F3(
	function (toKey, toValue, dictionary) {
		return _Json_wrap(
			A3(
				$elm$core$Dict$foldl,
				F3(
					function (key, value, obj) {
						return A3(
							_Json_addField,
							toKey(key),
							toValue(value),
							obj);
					}),
				_Json_emptyObject(0),
				dictionary));
	});
var $author$project$Main$dictValue = function (fields) {
	return $elm$json$Json$Encode$object(
		A2(
			$elm$core$List$map,
			$elm$core$Tuple$mapSecond($elm$json$Json$Encode$string),
			$elm$core$Dict$toList(fields)));
};
var $author$project$State$editLeadOf = function (l) {
	return {
		bs: l.bs,
		bb: A2($elm$core$Maybe$withDefault, 'Canada', l.bb),
		J: A2($elm$core$Maybe$withDefault, '', l.J),
		aV: l.aV,
		ds: A2($elm$core$Maybe$withDefault, '', l.ds),
		cd: A2($elm$core$Maybe$withDefault, '', l.cd),
		aF: A2($elm$core$Maybe$withDefault, '', l.aF),
		ci: A2($elm$core$Maybe$withDefault, '', l.ci),
		aH: A2($elm$core$Maybe$withDefault, 'Warm', l.aH),
		t: l.t,
		aJ: A2($elm$core$Maybe$withDefault, 'Student Visa', l.aJ),
		aL: A2($elm$core$Maybe$withDefault, 'Website', l.aL),
		dO: l.dO
	};
};
var $author$project$State$emptyCaseForm = {aP: $elm$core$Maybe$Nothing, cX: 'Student Visa', aT: '', bb: 'Canada', t: 1, dO: 'Documents Under Review'};
var $author$project$Types$encodeNewLead = function (f) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'nlFullName',
				$elm$json$Json$Encode$string(f.aV)),
				_Utils_Tuple2(
				'nlEmail',
				$author$project$Types$encodeNonEmpty(f.J)),
				_Utils_Tuple2(
				'nlPhone',
				$author$project$Types$encodeNonEmpty(f.ci)),
				_Utils_Tuple2(
				'nlSource',
				$author$project$Types$encodeNonEmpty(f.aL)),
				_Utils_Tuple2(
				'nlQuality',
				$author$project$Types$encodeNonEmpty(f.aH)),
				_Utils_Tuple2(
				'nlStage',
				$author$project$Types$encodeNonEmpty(f.dO)),
				_Utils_Tuple2(
				'nlDestination',
				$author$project$Types$encodeNonEmpty(f.bb)),
				_Utils_Tuple2(
				'nlService',
				$author$project$Types$encodeNonEmpty(f.aJ)),
				_Utils_Tuple2(
				'nlNotes',
				$author$project$Types$encodeNonEmpty(f.aF)),
				_Utils_Tuple2(
				'nlNextFollowup',
				$author$project$Types$maybeDate(f.cd)),
				_Utils_Tuple2('nlConsultantId', $elm$json$Json$Encode$null)
			]));
};
var $author$project$Types$encodeNewUser = function (f) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'nuName',
				$elm$json$Json$Encode$string(f.x)),
				_Utils_Tuple2(
				'nuEmail',
				$elm$json$Json$Encode$string(f.J)),
				_Utils_Tuple2(
				'nuRole',
				$elm$json$Json$Encode$string(f.H)),
				_Utils_Tuple2(
				'nuPassword',
				$elm$json$Json$Encode$string(f.ad))
			]));
};
var $author$project$Types$encodeUpdateLead = function (f) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'expectedRevision',
				$elm$json$Json$Encode$int(f.t)),
				_Utils_Tuple2(
				'ulFullName',
				$author$project$Types$encodeNonEmpty(f.aV)),
				_Utils_Tuple2(
				'ulEmail',
				$author$project$Types$encodeNonEmpty(f.J)),
				_Utils_Tuple2(
				'ulPhone',
				$author$project$Types$encodeNonEmpty(f.ci)),
				_Utils_Tuple2(
				'ulSource',
				$author$project$Types$encodeNonEmpty(f.aL)),
				_Utils_Tuple2(
				'ulQuality',
				$author$project$Types$encodeNonEmpty(f.aH)),
				_Utils_Tuple2(
				'ulStage',
				$author$project$Types$encodeNonEmpty(f.dO)),
				_Utils_Tuple2(
				'ulDestination',
				$author$project$Types$encodeNonEmpty(f.bb)),
				_Utils_Tuple2(
				'ulService',
				$author$project$Types$encodeNonEmpty(f.aJ)),
				_Utils_Tuple2(
				'ulNotes',
				$author$project$Types$encodeNonEmpty(f.aF)),
				_Utils_Tuple2(
				'ulLastContact',
				$author$project$Types$maybeDate(f.ds)),
				_Utils_Tuple2(
				'ulNextFollowup',
				$author$project$Types$maybeDate(f.cd)),
				_Utils_Tuple2(
				'ulConsultantId',
				A2(
					$elm$core$Maybe$withDefault,
					$elm$json$Json$Encode$null,
					A2($elm$core$Maybe$map, $elm$json$Json$Encode$int, f.bs)))
			]));
};
var $author$project$Types$encodeUpdateUser = function (f) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'uuName',
				$elm$json$Json$Encode$string(f.x)),
				_Utils_Tuple2(
				'uuRole',
				$elm$json$Json$Encode$string(f.H)),
				_Utils_Tuple2(
				'uuPassword',
				$author$project$Types$encodeNonEmpty(f.ad))
			]));
};
var $author$project$Main$expiredSession = function (msg) {
	_v0$16:
	while (true) {
		switch (msg.$) {
			case 26:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 44:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 15:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 40:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 88:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 91:
				if (((msg.b.$ === 1) && (msg.b.a.$ === 3)) && (msg.b.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 67:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 70:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 69:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 72:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 71:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 73:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 12:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 14:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 68:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			case 74:
				if (((msg.a.$ === 1) && (msg.a.a.$ === 3)) && (msg.a.a.a === 401)) {
					return true;
				} else {
					break _v0$16;
				}
			default:
				break _v0$16;
		}
	}
	return false;
};
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$UnexpectedChar = {$: 11};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {bS: col, c3: contextStack, co: problem, dH: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.dH, s.bS, x, s.d));
	});
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return function (s) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.c, s.a);
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{bS: 1, d: s.d, e: s.e, c: s.c + 1, dH: s.dH + 1, a: s.a}) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{bS: s.bS + 1, d: s.d, e: s.e, c: newOffset, dH: s.dH, a: s.a}));
		};
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $justinmimbs$date$Date$deadEndToString = function (_v0) {
	var problem = _v0.co;
	if (problem.$ === 12) {
		var message = problem.a;
		return message;
	} else {
		return 'Expected a date in ISO 8601 format';
	}
};
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.a),
			s.c) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $justinmimbs$date$Date$MonthAndDay = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $justinmimbs$date$Date$OrdinalDay = function (a) {
	return {$: 2, a: a};
};
var $justinmimbs$date$Date$WeekAndWeekday = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$backtrackable = function (_v0) {
	var parse = _v0;
	return function (s0) {
		var _v1 = parse(s0);
		if (_v1.$ === 1) {
			var x = _v1.b;
			return A2($elm$parser$Parser$Advanced$Bad, false, x);
		} else {
			var a = _v1.b;
			var s1 = _v1.c;
			return A3($elm$parser$Parser$Advanced$Good, false, a, s1);
		}
	};
};
var $elm$parser$Parser$backtrackable = $elm$parser$Parser$Advanced$backtrackable;
var $elm$parser$Parser$Advanced$commit = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, true, a, s);
	};
};
var $elm$parser$Parser$commit = $elm$parser$Parser$Advanced$commit;
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.c, s1.c, s0.a),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$mapChompedString = $elm$parser$Parser$Advanced$mapChompedString;
var $justinmimbs$date$Date$int1 = A2(
	$elm$parser$Parser$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	$elm$parser$Parser$chompIf($elm$core$Char$isDigit));
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $justinmimbs$date$Date$int2 = A2(
	$elm$parser$Parser$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			$elm$parser$Parser$succeed(0),
			$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
		$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
var $justinmimbs$date$Date$int3 = A2(
	$elm$parser$Parser$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(0),
				$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
			$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
		$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.c, s.dH, s.bS, s.a);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{bS: newCol, d: s.d, e: s.e, c: newOffset, dH: newRow, a: s.a});
	};
};
var $elm$parser$Parser$token = function (str) {
	return $elm$parser$Parser$Advanced$token(
		$elm$parser$Parser$toToken(str));
};
var $justinmimbs$date$Date$dayOfYear = $elm$parser$Parser$oneOf(
	_List_fromArray(
		[
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed($elm$core$Basics$identity),
				$elm$parser$Parser$token('-')),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$elm$parser$Parser$backtrackable(
						A2(
							$elm$parser$Parser$andThen,
							$elm$parser$Parser$commit,
							A2($elm$parser$Parser$map, $justinmimbs$date$Date$OrdinalDay, $justinmimbs$date$Date$int3))),
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							$elm$parser$Parser$succeed($justinmimbs$date$Date$MonthAndDay),
							$justinmimbs$date$Date$int2),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed($elm$core$Basics$identity),
										$elm$parser$Parser$token('-')),
									$justinmimbs$date$Date$int2),
									$elm$parser$Parser$succeed(1)
								]))),
						A2(
						$elm$parser$Parser$keeper,
						A2(
							$elm$parser$Parser$keeper,
							A2(
								$elm$parser$Parser$ignorer,
								$elm$parser$Parser$succeed($justinmimbs$date$Date$WeekAndWeekday),
								$elm$parser$Parser$token('W')),
							$justinmimbs$date$Date$int2),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									A2(
									$elm$parser$Parser$keeper,
									A2(
										$elm$parser$Parser$ignorer,
										$elm$parser$Parser$succeed($elm$core$Basics$identity),
										$elm$parser$Parser$token('-')),
									$justinmimbs$date$Date$int1),
									$elm$parser$Parser$succeed(1)
								])))
					]))),
			$elm$parser$Parser$backtrackable(
			A2(
				$elm$parser$Parser$andThen,
				$elm$parser$Parser$commit,
				A2(
					$elm$parser$Parser$keeper,
					A2(
						$elm$parser$Parser$keeper,
						$elm$parser$Parser$succeed($justinmimbs$date$Date$MonthAndDay),
						$justinmimbs$date$Date$int2),
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								$justinmimbs$date$Date$int2,
								$elm$parser$Parser$succeed(1)
							]))))),
			A2($elm$parser$Parser$map, $justinmimbs$date$Date$OrdinalDay, $justinmimbs$date$Date$int3),
			A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$succeed($justinmimbs$date$Date$WeekAndWeekday),
					$elm$parser$Parser$token('W')),
				$justinmimbs$date$Date$int2),
			$elm$parser$Parser$oneOf(
				_List_fromArray(
					[
						$justinmimbs$date$Date$int1,
						$elm$parser$Parser$succeed(1)
					]))),
			$elm$parser$Parser$succeed(
			$justinmimbs$date$Date$OrdinalDay(1))
		]));
var $justinmimbs$date$Date$RD = $elm$core$Basics$identity;
var $elm$core$Basics$modBy = _Basics_modBy;
var $justinmimbs$date$Date$isLeapYear = function (y) {
	return ((!A2($elm$core$Basics$modBy, 4, y)) && (!(!A2($elm$core$Basics$modBy, 100, y)))) || (!A2($elm$core$Basics$modBy, 400, y));
};
var $justinmimbs$date$Date$daysBeforeMonth = F2(
	function (y, m) {
		var leapDays = $justinmimbs$date$Date$isLeapYear(y) ? 1 : 0;
		switch (m) {
			case 0:
				return 0;
			case 1:
				return 31;
			case 2:
				return 59 + leapDays;
			case 3:
				return 90 + leapDays;
			case 4:
				return 120 + leapDays;
			case 5:
				return 151 + leapDays;
			case 6:
				return 181 + leapDays;
			case 7:
				return 212 + leapDays;
			case 8:
				return 243 + leapDays;
			case 9:
				return 273 + leapDays;
			case 10:
				return 304 + leapDays;
			default:
				return 334 + leapDays;
		}
	});
var $justinmimbs$date$Date$floorDiv = F2(
	function (a, b) {
		return $elm$core$Basics$floor(a / b);
	});
var $justinmimbs$date$Date$daysBeforeYear = function (y1) {
	var y = y1 - 1;
	var leapYears = (A2($justinmimbs$date$Date$floorDiv, y, 4) - A2($justinmimbs$date$Date$floorDiv, y, 100)) + A2($justinmimbs$date$Date$floorDiv, y, 400);
	return (365 * y) + leapYears;
};
var $justinmimbs$date$Date$daysInMonth = F2(
	function (y, m) {
		switch (m) {
			case 0:
				return 31;
			case 1:
				return $justinmimbs$date$Date$isLeapYear(y) ? 29 : 28;
			case 2:
				return 31;
			case 3:
				return 30;
			case 4:
				return 31;
			case 5:
				return 30;
			case 6:
				return 31;
			case 7:
				return 31;
			case 8:
				return 30;
			case 9:
				return 31;
			case 10:
				return 30;
			default:
				return 31;
		}
	});
var $justinmimbs$date$Date$isBetweenInt = F3(
	function (a, b, x) {
		return (_Utils_cmp(a, x) < 1) && (_Utils_cmp(x, b) < 1);
	});
var $justinmimbs$date$Date$monthToName = function (m) {
	switch (m) {
		case 0:
			return 'January';
		case 1:
			return 'February';
		case 2:
			return 'March';
		case 3:
			return 'April';
		case 4:
			return 'May';
		case 5:
			return 'June';
		case 6:
			return 'July';
		case 7:
			return 'August';
		case 8:
			return 'September';
		case 9:
			return 'October';
		case 10:
			return 'November';
		default:
			return 'December';
	}
};
var $elm$time$Time$Apr = 3;
var $elm$time$Time$Aug = 7;
var $elm$time$Time$Dec = 11;
var $elm$time$Time$Feb = 1;
var $elm$time$Time$Jan = 0;
var $elm$time$Time$Jul = 6;
var $elm$time$Time$Jun = 5;
var $elm$time$Time$Mar = 2;
var $elm$time$Time$May = 4;
var $elm$time$Time$Nov = 10;
var $elm$time$Time$Oct = 9;
var $elm$time$Time$Sep = 8;
var $justinmimbs$date$Date$numberToMonth = function (mn) {
	var _v0 = A2($elm$core$Basics$max, 1, mn);
	switch (_v0) {
		case 1:
			return 0;
		case 2:
			return 1;
		case 3:
			return 2;
		case 4:
			return 3;
		case 5:
			return 4;
		case 6:
			return 5;
		case 7:
			return 6;
		case 8:
			return 7;
		case 9:
			return 8;
		case 10:
			return 9;
		case 11:
			return 10;
		default:
			return 11;
	}
};
var $justinmimbs$date$Date$fromCalendarParts = F3(
	function (y, mn, d) {
		return (!A3($justinmimbs$date$Date$isBetweenInt, 1, 12, mn)) ? $elm$core$Result$Err(
			'Invalid date: ' + (('month ' + ($elm$core$String$fromInt(mn) + ' is out of range')) + (' (1 to 12)' + ('; received (year ' + ($elm$core$String$fromInt(y) + (', month ' + ($elm$core$String$fromInt(mn) + (', day ' + ($elm$core$String$fromInt(d) + ')'))))))))) : ((!A3(
			$justinmimbs$date$Date$isBetweenInt,
			1,
			A2(
				$justinmimbs$date$Date$daysInMonth,
				y,
				$justinmimbs$date$Date$numberToMonth(mn)),
			d)) ? $elm$core$Result$Err(
			'Invalid date: ' + (('day ' + ($elm$core$String$fromInt(d) + ' is out of range')) + ((' (1 to ' + ($elm$core$String$fromInt(
				A2(
					$justinmimbs$date$Date$daysInMonth,
					y,
					$justinmimbs$date$Date$numberToMonth(mn))) + ')')) + ((' for ' + $justinmimbs$date$Date$monthToName(
				$justinmimbs$date$Date$numberToMonth(mn))) + ((((mn === 2) && (d === 29)) ? (' (' + ($elm$core$String$fromInt(y) + ' is not a leap year)')) : '') + ('; received (year ' + ($elm$core$String$fromInt(y) + (', month ' + ($elm$core$String$fromInt(mn) + (', day ' + ($elm$core$String$fromInt(d) + ')'))))))))))) : $elm$core$Result$Ok(
			($justinmimbs$date$Date$daysBeforeYear(y) + A2(
				$justinmimbs$date$Date$daysBeforeMonth,
				y,
				$justinmimbs$date$Date$numberToMonth(mn))) + d));
	});
var $justinmimbs$date$Date$fromOrdinalParts = F2(
	function (y, od) {
		var daysInYear = $justinmimbs$date$Date$isLeapYear(y) ? 366 : 365;
		return (!A3($justinmimbs$date$Date$isBetweenInt, 1, daysInYear, od)) ? $elm$core$Result$Err(
			'Invalid ordinal date: ' + (('ordinal-day ' + ($elm$core$String$fromInt(od) + ' is out of range')) + ((' (1 to ' + ($elm$core$String$fromInt(daysInYear) + ')')) + ((' for ' + $elm$core$String$fromInt(y)) + ('; received (year ' + ($elm$core$String$fromInt(y) + (', ordinal-day ' + ($elm$core$String$fromInt(od) + ')')))))))) : $elm$core$Result$Ok(
			$justinmimbs$date$Date$daysBeforeYear(y) + od);
	});
var $justinmimbs$date$Date$weekdayNumber = function (_v0) {
	var rd = _v0;
	var _v1 = A2($elm$core$Basics$modBy, 7, rd);
	if (!_v1) {
		return 7;
	} else {
		var n = _v1;
		return n;
	}
};
var $justinmimbs$date$Date$daysBeforeWeekYear = function (y) {
	var jan4 = $justinmimbs$date$Date$daysBeforeYear(y) + 4;
	return jan4 - $justinmimbs$date$Date$weekdayNumber(jan4);
};
var $justinmimbs$date$Date$firstOfYear = function (y) {
	return $justinmimbs$date$Date$daysBeforeYear(y) + 1;
};
var $justinmimbs$date$Date$is53WeekYear = function (y) {
	var wdnJan1 = $justinmimbs$date$Date$weekdayNumber(
		$justinmimbs$date$Date$firstOfYear(y));
	return (wdnJan1 === 4) || ((wdnJan1 === 3) && $justinmimbs$date$Date$isLeapYear(y));
};
var $justinmimbs$date$Date$fromWeekParts = F3(
	function (wy, wn, wdn) {
		var weeksInYear = $justinmimbs$date$Date$is53WeekYear(wy) ? 53 : 52;
		return (!A3($justinmimbs$date$Date$isBetweenInt, 1, weeksInYear, wn)) ? $elm$core$Result$Err(
			'Invalid week date: ' + (('week ' + ($elm$core$String$fromInt(wn) + ' is out of range')) + ((' (1 to ' + ($elm$core$String$fromInt(weeksInYear) + ')')) + ((' for ' + $elm$core$String$fromInt(wy)) + ('; received (year ' + ($elm$core$String$fromInt(wy) + (', week ' + ($elm$core$String$fromInt(wn) + (', weekday ' + ($elm$core$String$fromInt(wdn) + ')')))))))))) : ((!A3($justinmimbs$date$Date$isBetweenInt, 1, 7, wdn)) ? $elm$core$Result$Err(
			'Invalid week date: ' + (('weekday ' + ($elm$core$String$fromInt(wdn) + ' is out of range')) + (' (1 to 7)' + ('; received (year ' + ($elm$core$String$fromInt(wy) + (', week ' + ($elm$core$String$fromInt(wn) + (', weekday ' + ($elm$core$String$fromInt(wdn) + ')'))))))))) : $elm$core$Result$Ok(
			($justinmimbs$date$Date$daysBeforeWeekYear(wy) + ((wn - 1) * 7)) + wdn));
	});
var $justinmimbs$date$Date$fromYearAndDayOfYear = function (_v0) {
	var y = _v0.a;
	var doy = _v0.b;
	switch (doy.$) {
		case 0:
			var mn = doy.a;
			var d = doy.b;
			return A3($justinmimbs$date$Date$fromCalendarParts, y, mn, d);
		case 1:
			var wn = doy.a;
			var wdn = doy.b;
			return A3($justinmimbs$date$Date$fromWeekParts, y, wn, wdn);
		default:
			var od = doy.a;
			return A2($justinmimbs$date$Date$fromOrdinalParts, y, od);
	}
};
var $justinmimbs$date$Date$int4 = A2(
	$elm$parser$Parser$mapChompedString,
	F2(
		function (str, _v0) {
			return A2(
				$elm$core$Maybe$withDefault,
				0,
				$elm$core$String$toInt(str));
		}),
	A2(
		$elm$parser$Parser$ignorer,
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				A2(
					$elm$parser$Parser$ignorer,
					A2(
						$elm$parser$Parser$ignorer,
						$elm$parser$Parser$succeed(0),
						$elm$parser$Parser$oneOf(
							_List_fromArray(
								[
									$elm$parser$Parser$chompIf(
									function (c) {
										return c === '-';
									}),
									$elm$parser$Parser$succeed(0)
								]))),
					$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
				$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
			$elm$parser$Parser$chompIf($elm$core$Char$isDigit)),
		$elm$parser$Parser$chompIf($elm$core$Char$isDigit)));
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $justinmimbs$date$Date$resultToParser = function (result) {
	if (!result.$) {
		var x = result.a;
		return $elm$parser$Parser$succeed(x);
	} else {
		var message = result.a;
		return $elm$parser$Parser$problem(message);
	}
};
var $justinmimbs$date$Date$parser = A2(
	$elm$parser$Parser$andThen,
	A2($elm$core$Basics$composeR, $justinmimbs$date$Date$fromYearAndDayOfYear, $justinmimbs$date$Date$resultToParser),
	A2(
		$elm$parser$Parser$keeper,
		A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($elm$core$Tuple$pair),
			$justinmimbs$date$Date$int4),
		$justinmimbs$date$Date$dayOfYear));
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {bS: col, co: problem, dH: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.dH, p.bS, p.co);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{bS: 1, d: _List_Nil, e: 1, c: 0, dH: 1, a: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $justinmimbs$date$Date$fromIsoString = A2(
	$elm$core$Basics$composeR,
	$elm$parser$Parser$run(
		A2(
			$elm$parser$Parser$keeper,
			$elm$parser$Parser$succeed($elm$core$Basics$identity),
			A2(
				$elm$parser$Parser$ignorer,
				$justinmimbs$date$Date$parser,
				A2(
					$elm$parser$Parser$andThen,
					$justinmimbs$date$Date$resultToParser,
					$elm$parser$Parser$oneOf(
						_List_fromArray(
							[
								A2($elm$parser$Parser$map, $elm$core$Result$Ok, $elm$parser$Parser$end),
								A2(
								$elm$parser$Parser$map,
								$elm$core$Basics$always(
									$elm$core$Result$Err('Expected a date only, not a date and time')),
								$elm$parser$Parser$chompIf(
									$elm$core$Basics$eq('T'))),
								$elm$parser$Parser$succeed(
								$elm$core$Result$Err('Expected a date only'))
							])))))),
	$elm$core$Result$mapError(
		A2(
			$elm$core$Basics$composeR,
			$elm$core$List$head,
			A2(
				$elm$core$Basics$composeR,
				$elm$core$Maybe$map($justinmimbs$date$Date$deadEndToString),
				$elm$core$Maybe$withDefault('')))));
var $elm$core$Basics$ge = _Utils_ge;
var $elm$core$String$toFloat = _String_toFloat;
var $author$project$Validation$feature = F4(
	function (section, action, inlineOwner, values) {
		var get = function (key) {
			return $elm$core$String$trim(
				A2(
					$elm$core$Maybe$withDefault,
					'',
					A2($elm$core$Dict$get, key, values)));
		};
		var integer = F3(
			function (key, low, high) {
				if (get(key) === '') {
					return $elm$core$Maybe$Nothing;
				} else {
					var _v2 = $elm$core$String$toInt(
						get(key));
					if (!_v2.$) {
						var n = _v2.a;
						return ((_Utils_cmp(n, low) > -1) && (_Utils_cmp(n, high) < 1)) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
							_Utils_Tuple2(
								key,
								'Use a whole number from ' + ($elm$core$String$fromInt(low) + (' to ' + ($elm$core$String$fromInt(high) + '.')))));
					} else {
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(key, 'Enter a whole number.'));
					}
				}
			});
		var required = F2(
			function (key, label) {
				return (get(key) === '') ? $elm$core$Maybe$Just(
					_Utils_Tuple2(key, label + ' is required.')) : $elm$core$Maybe$Nothing;
			});
		var owner = (inlineOwner === '') ? A2(required, 'owner', 'Record') : $elm$core$Maybe$Nothing;
		var selected = function (key) {
			return A2(required, key, 'Select an item first');
		};
		var date = function (key) {
			if (get(key) === '') {
				return $elm$core$Maybe$Nothing;
			} else {
				var _v1 = $justinmimbs$date$Date$fromIsoString(
					get(key));
				if (!_v1.$) {
					return $elm$core$Maybe$Nothing;
				} else {
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(key, 'Enter a valid date.'));
				}
			}
		};
		var range = _List_fromArray(
			[
				date('from'),
				date('to'),
				(!_Utils_eq(
				get('from') === '',
				get('to') === '')) ? $elm$core$Maybe$Just(
				_Utils_Tuple2(
					(get('from') === '') ? 'from' : 'to',
					'Choose both dates, or clear both to use the default range.')) : $elm$core$Maybe$Nothing,
				((get('from') !== '') && ((get('to') !== '') && (_Utils_cmp(
				get('from'),
				get('to')) > 0))) ? $elm$core$Maybe$Just(
				_Utils_Tuple2('to', 'End date must be on or after the start date.')) : $elm$core$Maybe$Nothing
			]);
		var checks = function () {
			if (action === 'range') {
				return range;
			} else {
				var _v0 = _Utils_Tuple2(section, action);
				_v0$41:
				while (true) {
					switch (_v0.a) {
						case 'tasks':
							switch (_v0.b) {
								case 'save':
									return _List_fromArray(
										[
											selected('id'),
											A2(required, 'title', 'Title'),
											A2(required, 'assignee', 'Staff member'),
											date('dueDate'),
											A3(integer, 'recurrenceDays', 1, 366),
											(get('recurrenceDays') !== '') ? A2(required, 'dueDate', 'A deadline for repeating tasks') : $elm$core$Maybe$Nothing
										]);
								case 'create':
									return _List_fromArray(
										[
											owner,
											A2(required, 'title', 'Title'),
											A2(required, 'assignee', 'Staff member'),
											date('dueDate'),
											A3(integer, 'recurrenceDays', 1, 366),
											(get('recurrenceDays') !== '') ? A2(required, 'dueDate', 'A deadline for repeating tasks') : $elm$core$Maybe$Nothing
										]);
								default:
									break _v0$41;
							}
						case 'applications':
							if (_v0.b === 'checklist') {
								return _List_fromArray(
									[
										selected('id'),
										A2(required, 'template', 'Checklist template')
									]);
							} else {
								return _List_fromArray(
									[
										owner,
										A2(required, 'category', 'Application type'),
										A2(required, 'destination', 'Destination'),
										A2(required, 'stage', 'Stage'),
										date('intakeDate'),
										date('deadline')
									]);
							}
						case 'checklist-templates':
							return _List_fromArray(
								[
									A2(required, 'name', 'Checklist name'),
									((get('requiredDocuments') === '') && (get('optionalDocuments') === '')) ? $elm$core$Maybe$Just(
									_Utils_Tuple2('requiredDocuments', 'Add at least one document requirement.')) : $elm$core$Maybe$Nothing
								]);
						case 'history':
							return _List_fromArray(
								[
									owner,
									A2(required, 'note', 'Note')
								]);
						case 'documents':
							if (_v0.b === 'save') {
								return _List_fromArray(
									[
										owner,
										A2(required, 'title', 'Document title'),
										date('expiresOn'),
										(get('status') === 'Rejected') ? A2(required, 'reviewNote', 'Feedback explaining the rejection') : $elm$core$Maybe$Nothing
									]);
							} else {
								return _List_fromArray(
									[
										selected('id'),
										(action === 'attach') ? A2(required, 'document', 'File') : $elm$core$Maybe$Nothing
									]);
							}
						case 'reminders':
							return _List_fromArray(
								[
									A2(required, 'task', 'Task'),
									A3(integer, 'daysBefore', 0, 365),
									A3(integer, 'escalateAfter', 1, 365)
								]);
						case 'appointments':
							return _List_fromArray(
								[
									owner,
									A2(required, 'title', 'Appointment title'),
									A2(required, 'assignee', 'Staff member'),
									A2(required, 'startsAt', 'Start time'),
									A2(required, 'endsAt', 'End time'),
									((get('startsAt') !== '') && (_Utils_cmp(
									get('endsAt'),
									get('startsAt')) < 1)) ? $elm$core$Maybe$Just(
									_Utils_Tuple2('endsAt', 'End time must be after the start time.')) : $elm$core$Maybe$Nothing
								]);
						case 'communication':
							return _List_fromArray(
								[
									owner,
									A2(required, 'subject', 'Subject'),
									A2(required, 'message', 'Message')
								]);
						case 'portal':
							switch (_v0.b) {
								case 'create':
									return _List_fromArray(
										[
											owner,
											A3(integer, 'days', 1, 30)
										]);
								case 'grant':
									return _List_fromArray(
										[
											selected('id'),
											A2(required, 'document', 'Approved file')
										]);
								default:
									return _List_fromArray(
										[
											selected('id')
										]);
							}
						case 'mail':
							return _List_fromArray(
								[
									selected('id')
								]);
						case 'merge':
							return _List_fromArray(
								[
									A2(required, 'source', 'Source record'),
									A2(required, 'target', 'Surviving record'),
									((get('source') !== '') && _Utils_eq(
									get('source'),
									get('target'))) ? $elm$core$Maybe$Just(
									_Utils_Tuple2('target', 'Choose two different records.')) : $elm$core$Maybe$Nothing,
									((action === 'confirm') && (get('confirmation') !== 'MERGE')) ? $elm$core$Maybe$Just(
									_Utils_Tuple2('confirmation', 'Type MERGE after reviewing the preview.')) : $elm$core$Maybe$Nothing
								]);
						case 'payment-history':
							if (_v0.b === 'reverse') {
								return _List_fromArray(
									[
										selected('id'),
										A2(required, 'payment', 'Receipt'),
										A2(required, 'paidOn', 'Reversal date'),
										date('paidOn'),
										A2(required, 'reason', 'Reason')
									]);
							} else {
								break _v0$41;
							}
						case 'periods':
							return _List_fromArray(
								[
									A2(required, 'month', 'Financial month'),
									A2(required, 'reason', 'Reason')
								]);
						case 'reconciliation':
							switch (_v0.b) {
								case 'import':
									return _List_fromArray(
										[
											A2(required, 'account', 'Bank account'),
											A2(required, 'currency', 'Currency'),
											A2(required, 'csv', 'Statement CSV')
										]);
								case 'match':
									return _List_fromArray(
										[
											selected('id'),
											A2(required, 'match', 'Matching recorded entry'),
											A2(required, 'reason', 'Reason')
										]);
								default:
									return _List_fromArray(
										[
											selected('id'),
											A2(required, 'reason', 'Reason')
										]);
							}
						case 'payments':
							switch (_v0.b) {
								case 'record':
									return _List_fromArray(
										[
											selected('id'),
											A2(required, 'amount', 'Payment amount'),
											A2(required, 'paidOn', 'Payment date'),
											date('paidOn'),
											A2(required, 'method', 'Payment method')
										]);
								case 'reverse':
									return _List_fromArray(
										[
											selected('id'),
											A2(required, 'payment', 'Receipt'),
											A2(required, 'paidOn', 'Reversal date'),
											date('paidOn'),
											A2(required, 'reason', 'Reason')
										]);
								default:
									break _v0$41;
							}
						case 'expenses':
							switch (_v0.b) {
								case 'submit':
									return _List_fromArray(
										[
											A2(required, 'supplier', 'Supplier'),
											A2(required, 'description', 'Description'),
											A2(required, 'category', 'Category'),
											A2(required, 'amount', 'Amount'),
											A2(required, 'expenseOn', 'Expense date'),
											date('expenseOn')
										]);
								case 'pay':
									return _List_fromArray(
										[
											selected('id'),
											A2(required, 'paidOn', 'Payment date'),
											date('paidOn'),
											A2(required, 'method', 'Payment method')
										]);
								case 'reverse-expense':
									return _List_fromArray(
										[
											selected('id'),
											A2(required, 'paidOn', 'Reversal date'),
											date('paidOn'),
											A2(required, 'reason', 'Reason')
										]);
								case 'reject':
									return _List_fromArray(
										[
											selected('id'),
											A2(required, 'reason', 'Reason')
										]);
								case 'approve':
									return _List_fromArray(
										[
											selected('id')
										]);
								default:
									break _v0$41;
							}
						case 'invoices':
							if (_v0.b === 'send') {
								return _List_fromArray(
									[
										selected('id')
									]);
							} else {
								return _List_fromArray(
									[
										owner,
										A2(required, 'description', 'Description'),
										A2(required, 'amount', 'Amount'),
										(A2(
										$elm$core$Maybe$withDefault,
										0,
										$elm$core$String$toFloat(
											get('amount'))) <= 0) ? $elm$core$Maybe$Just(
										_Utils_Tuple2('amount', 'Enter an amount greater than zero.')) : $elm$core$Maybe$Nothing,
										A2(required, 'dueDate', 'Due date'),
										date('dueDate')
									]);
							}
						case 'search':
							switch (_v0.b) {
								case 'save':
									return _List_fromArray(
										[
											A2(required, 'name', 'View name')
										]);
								case 'views':
									return _List_Nil;
								default:
									return _List_fromArray(
										[
											selected('id')
										]);
							}
						case 'security':
							switch (_v0.b) {
								case 'access':
									return _List_fromArray(
										[
											A2(required, 'user', 'Team account'),
											A2(required, 'password', 'Your current password'),
											A2(required, 'accessLevel', 'Record access')
										]);
								case 'reset-mfa':
									return _List_fromArray(
										[
											A2(required, 'user', 'Team account'),
											A2(required, 'password', 'Your current password'),
											A2(required, 'code', 'Your authenticator or recovery code'),
											A2(required, 'reason', 'Recovery reason')
										]);
								case 'revoke-user':
									return _List_fromArray(
										[
											A2(required, 'user', 'Team account')
										]);
								case 'suspend':
									return _List_fromArray(
										[
											A2(required, 'user', 'Team account')
										]);
								case 'resume':
									return _List_fromArray(
										[
											A2(required, 'user', 'Team account')
										]);
								case 'revoke':
									return _List_fromArray(
										[
											selected('session')
										]);
								default:
									return _List_fromArray(
										[
											A2(required, 'password', 'Current password'),
											(action !== 'setup') ? A2(required, 'code', 'Authenticator or recovery code') : $elm$core$Maybe$Nothing
										]);
							}
						case 'notifications':
							if (_v0.b === 'read') {
								return _List_fromArray(
									[
										selected('id')
									]);
							} else {
								break _v0$41;
							}
						default:
							break _v0$41;
					}
				}
				return _List_Nil;
			}
		}();
		return $elm$core$Dict$fromList(
			A2($elm$core$List$filterMap, $elm$core$Basics$identity, checks));
	});
var $author$project$Api$featurePost = F3(
	function (ctx, path, value) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/workspace/' + path,
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(value)),
			$elm$json$Json$Decode$value);
	});
var $elm$json$Json$Decode$list = _Json_decodeList;
var $author$project$Api$fetchClientsPage = F3(
	function (ctx, offset, query) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'GET',
			'/api/clients?limit=50&offset=' + ($elm$core$String$fromInt(offset) + ('&q=' + $elm$url$Url$percentEncode(query))),
			$elm$core$Maybe$Nothing,
			$elm$json$Json$Decode$list($author$project$Types$clientDecoder));
	});
var $author$project$Api$fetchFilteredLeads = F3(
	function (ctx, filters, offset) {
		var pick = function (value) {
			return (value === 'All') ? '' : $elm$url$Url$percentEncode(value);
		};
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'GET',
			'/api/leads?limit=50&offset=' + ($elm$core$String$fromInt(offset) + ('&q=' + ($elm$url$Url$percentEncode(filters.dC) + ('&stage=' + (pick(filters.df) + ('&quality=' + (pick(filters.dd) + ('&source=' + (pick(filters.de) + ('&sort=' + ($elm$url$Url$percentEncode(filters.dM) + ('&direction=' + (filters.dL ? 'asc' : 'desc'))))))))))))),
			$elm$core$Maybe$Nothing,
			$elm$json$Json$Decode$list($author$project$Types$leadDecoder));
	});
var $author$project$Api$fetchUsers = function (ctx) {
	return A5(
		$author$project$Api$authedRequest,
		ctx,
		'GET',
		'/api/users',
		$elm$core$Maybe$Nothing,
		$elm$json$Json$Decode$list($author$project$Types$userDecoder));
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$sortWith = _List_sortWith;
var $author$project$Views$filteredLeads = function (model) {
	var qLower = $elm$core$String$toLower(
		$elm$core$String$trim(model.dC));
	var matchesQ = function (l) {
		return (qLower === '') || (A2(
			$elm$core$String$contains,
			qLower,
			$elm$core$String$toLower(l.aV)) || (A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$map,
				function (e) {
					return A2(
						$elm$core$String$contains,
						qLower,
						$elm$core$String$toLower(e));
				},
				l.J)) || (A2(
			$elm$core$Maybe$withDefault,
			false,
			A2(
				$elm$core$Maybe$map,
				function (p) {
					return A2(
						$elm$core$String$contains,
						qLower,
						$elm$core$String$toLower(p));
				},
				l.ci)) || A2(
			$elm$core$String$contains,
			qLower,
			$elm$core$String$toLower(l.ce)))));
	};
	var matches = F2(
		function (f, val) {
			return (f === 'All') || _Utils_eq(
				$elm$core$Maybe$Just(val),
				$elm$core$Maybe$Just(f));
		});
	var keyOf = function (l) {
		var _v0 = model.dM;
		switch (_v0) {
			case 'stage':
				return $elm$core$String$toLower(l.dO);
			case 'quality':
				var _v1 = l.aH;
				_v1$3:
				while (true) {
					if (!_v1.$) {
						switch (_v1.a) {
							case 'Hot':
								return '0';
							case 'Warm':
								return '1';
							case 'Cold':
								return '2';
							default:
								break _v1$3;
						}
					} else {
						break _v1$3;
					}
				}
				return '3';
			case 'followup':
				return A2($elm$core$Maybe$withDefault, '9999', l.cd);
			default:
				return $elm$core$String$toLower(l.aV);
		}
	};
	var base = A2(
		$elm$core$List$filter,
		function (l) {
			return matchesQ(l) && (A2(matches, model.df, l.dO) && (A2(
				matches,
				model.dd,
				A2($elm$core$Maybe$withDefault, '', l.aH)) && A2(
				matches,
				model.de,
				A2($elm$core$Maybe$withDefault, '', l.aL))));
		},
		model.as);
	return A2(
		$elm$core$List$sortWith,
		F2(
			function (a, b) {
				return model.dL ? A2(
					$elm$core$Basics$compare,
					keyOf(a),
					keyOf(b)) : A2(
					$elm$core$Basics$compare,
					keyOf(b),
					keyOf(a));
			}),
		base);
};
var $author$project$Api$financeAttachment = F5(
	function (ctx, expenseId, revision, file, toMsg) {
		return A6(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/finance/expenses/' + ($elm$core$String$fromInt(expenseId) + '/attachments'),
			$elm$core$Maybe$Just(
				$elm$http$Http$multipartBody(
					_List_fromArray(
						[
							A2(
							$elm$http$Http$stringPart,
							'expectedRevision',
							$elm$core$String$fromInt(revision)),
							A2($elm$http$Http$filePart, 'file', file)
						]))),
			$elm$json$Json$Decode$value,
			toMsg);
	});
var $author$project$Main$financeCandidateTag = function (model) {
	return A2(
		$elm$core$String$join,
		':',
		_List_fromArray(
			[
				A2($elm$core$Maybe$withDefault, '', model.dU),
				A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Dict$get, 'id', model.dh)),
				model.dk,
				$elm$core$String$fromInt(model.dj)
			]));
};
var $author$project$Main$focusFeatureForm = _Platform_outgoingPort(
	'focusFeatureForm',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $author$project$Main$hasUnsavedWork = function (model) {
	return $author$project$Main$hasDraftChanges(model) || (!_Utils_eq(model.ah, $elm$core$Maybe$Nothing));
};
var $author$project$Main$httpError = function (err) {
	switch (err.$) {
		case 0:
			var url = err.a;
			return 'Bad URL: ' + url;
		case 1:
			return 'Request timed out';
		case 2:
			return 'Network error — is the API running?';
		case 3:
			var code = err.a;
			switch (code) {
				case 401:
					return 'Not authenticated — sign in again';
				case 403:
					return 'You don\'t have permission for that';
				case 404:
					return 'Not found';
				case 409:
					return 'This record or action changed. Refresh and review the latest version before trying again.';
				case 428:
					return 'Reload this record to obtain its current version before saving.';
				case 429:
					return 'Too many requests. Wait before trying again.';
				case 423:
					return 'File quarantined: wait for a successful malware scan. Infected files and failed scans stay blocked.';
				default:
					return 'Server error (' + ($elm$core$String$fromInt(code) + ')');
			}
		default:
			var body = err.a;
			return A2($elm$core$String$left, 240, body);
	}
};
var $author$project$Types$ImportResult = F2(
	function (imported, failed) {
		return {b$: failed, b6: imported};
	});
var $author$project$Types$ImportRowError = F2(
	function (row, error) {
		return {db: error, dH: row};
	});
var $author$project$Types$importResultDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'failed',
	$elm$json$Json$Decode$list(
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'error',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'row',
				$elm$json$Json$Decode$int,
				$elm$json$Json$Decode$succeed($author$project$Types$ImportRowError)))),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'imported',
		$elm$json$Json$Decode$int,
		$elm$json$Json$Decode$succeed($author$project$Types$ImportResult)));
var $author$project$Api$importLeads = F3(
	function (ctx, file, toMsg) {
		return $elm$http$Http$request(
			{
				a6: $elm$http$Http$multipartBody(
					_List_fromArray(
						[
							A2($elm$http$Http$filePart, 'file', file)
						])),
				bc: A2($author$project$Api$expectJson, toMsg, $author$project$Types$importResultDecoder),
				bf: _List_fromArray(
					[
						A2($elm$http$Http$header, 'X-ECC-Contract', $author$project$Release$contract)
					]),
				bi: 'POST',
				bn: $elm$core$Maybe$Just(30000),
				bp: $elm$core$Maybe$Nothing,
				bq: ctx.ao + '/api/import/leads'
			});
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $author$project$Main$inlinePath = F2(
	function (model, cid) {
		return 'record/' + ((A2($elm$core$String$startsWith, 'case:', model.ab) ? A3($elm$core$String$replace, ':', '/', model.ab) : ('client/' + $elm$core$String$fromInt(cid))) + ('/' + model.bg));
	});
var $elm$core$Dict$isEmpty = function (dict) {
	if (dict.$ === -2) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $author$project$Main$justOf = function (r) {
	return $elm$core$Result$toMaybe(r);
};
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $author$project$State$FinanceCandidatesLoaded = F2(
	function (a, b) {
		return {$: 20, a: a, b: b};
	});
var $author$project$Main$loadFinanceCandidates = function (model) {
	var ident = A2(
		$elm$core$Maybe$withDefault,
		'',
		A2($elm$core$Dict$get, 'id', model.dh));
	var ctx = {ao: model.am, dU: model.dU};
	return (ident === '') ? $elm$core$Platform$Cmd$none : A5(
		$author$project$Api$featureGet,
		ctx,
		'reconciliation/candidates/' + ident,
		model.dk,
		model.dj,
		$author$project$State$FinanceCandidatesLoaded(
			$author$project$Main$financeCandidateTag(model)));
};
var $author$project$Types$LoginResponse = F2(
	function (token, user) {
		return {dU: token, I: user};
	});
var $author$project$Types$loginResponseDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'user',
	$author$project$Types$userDecoder,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'token',
		$elm$json$Json$Decode$string,
		$elm$json$Json$Decode$succeed($author$project$Types$LoginResponse)));
var $author$project$Api$login = F5(
	function (ctx, email, password, otp, toMsg) {
		return A6(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/auth/login',
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'lrEmail',
								$elm$json$Json$Encode$string(email)),
								_Utils_Tuple2(
								'lrPassword',
								$elm$json$Json$Encode$string(password)),
								_Utils_Tuple2(
								'lrOtp',
								$elm$json$Json$Encode$string(otp))
							])))),
			$author$project$Types$loginResponseDecoder,
			toMsg);
	});
var $author$project$Api$logout = function (ctx) {
	return A5($author$project$Api$authedRequest, ctx, 'POST', '/api/auth/logout', $elm$core$Maybe$Nothing, $author$project$Api$ignoreDecoder);
};
var $elm$json$Json$Decode$map3 = _Json_map3;
var $author$project$Api$me = F2(
	function (ctx, toMsg) {
		return A6($author$project$Api$authedRequest, ctx, 'GET', '/api/auth/me', $elm$core$Maybe$Nothing, $author$project$Types$userDecoder, toMsg);
	});
var $elm$file$File$mime = _File_mime;
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $author$project$Main$navigateTo = F2(
	function (key, path) {
		return A2($elm$browser$Browser$Navigation$pushUrl, key, path);
	});
var $author$project$Api$operation = F2(
	function (ctx, path) {
		return A5($author$project$Api$authedRequest, ctx, 'POST', '/api/' + path, $elm$core$Maybe$Nothing, $author$project$Api$ignoreDecoder);
	});
var $author$project$Main$ownerForUrl = function (url) {
	var _v0 = $author$project$State$routeOf(url);
	if (_v0.$ === 4) {
		var cid = _v0.a;
		return 'client:' + $elm$core$String$fromInt(cid);
	} else {
		return '';
	}
};
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $author$project$Validation$passwordError = function (value) {
	var bytes = $elm$core$List$sum(
		A2(
			$elm$core$List$map,
			function (c) {
				var n = $elm$core$Char$toCode(c);
				return (n < 128) ? 1 : ((n < 2048) ? 2 : ((n < 65536) ? 3 : 4));
			},
			$elm$core$String$toList(value)));
	return ($elm$core$String$length(value) < 12) ? 'Use at least 12 characters.' : ((bytes > 72) ? 'Use a password no longer than 72 UTF-8 bytes.' : '');
};
var $author$project$Reports$cell = F2(
	function (key, row) {
		return A2(
			$elm$core$Result$withDefault,
			'—',
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2(
					$elm$json$Json$Decode$field,
					key,
					$elm$json$Json$Decode$oneOf(
						_List_fromArray(
							[
								$elm$json$Json$Decode$string,
								A2($elm$json$Json$Decode$map, $elm$core$String$fromInt, $elm$json$Json$Decode$int),
								A2($elm$json$Json$Decode$map, $elm$core$String$fromFloat, $elm$json$Json$Decode$float),
								$elm$json$Json$Decode$null('—')
							]))),
				row));
	});
var $author$project$Reports$columns = function (kind) {
	switch (kind) {
		case 'ageing':
			return _List_fromArray(
				[
					_Utils_Tuple2('title', 'Client / application'),
					_Utils_Tuple2('staff', 'Case officer'),
					_Utils_Tuple2('stage', 'Stage'),
					_Utils_Tuple2('ageDays', 'Age (days)'),
					_Utils_Tuple2('overdueDays', 'Overdue (days)')
				]);
		case 'bottlenecks':
			return _List_fromArray(
				[
					_Utils_Tuple2('title', 'Stage'),
					_Utils_Tuple2('cases', 'Cases'),
					_Utils_Tuple2('averageAgeDays', 'Average stage days'),
					_Utils_Tuple2('oldestDays', 'Oldest stage days')
				]);
		case 'trends':
			return _List_fromArray(
				[
					_Utils_Tuple2('date', 'Snapshot date'),
					_Utils_Tuple2('title', 'Staff member'),
					_Utils_Tuple2('openTasks', 'Open tasks'),
					_Utils_Tuple2('overdueTasks', 'Overdue tasks'),
					_Utils_Tuple2('openCases', 'Open cases')
				]);
		default:
			return _List_fromArray(
				[
					_Utils_Tuple2('title', 'Staff member'),
					_Utils_Tuple2('leads', 'Leads in cohort'),
					_Utils_Tuple2('converted', 'Converted leads'),
					_Utils_Tuple2('openTasks', 'Open tasks'),
					_Utils_Tuple2('overdueTasks', 'Overdue tasks'),
					_Utils_Tuple2('completedCases', 'Completed cases'),
					_Utils_Tuple2('averageCaseDays', 'Average case days')
				]);
	}
};
var $author$project$Reports$get = F3(
	function (model, key, fallback) {
		return A2(
			$elm$core$Maybe$withDefault,
			fallback,
			A2($elm$core$Dict$get, key, model.aI));
	});
var $author$project$Reports$reportRows = F2(
	function (model, kind) {
		var threshold = A2(
			$elm$core$Maybe$withDefault,
			0,
			$elm$core$String$toFloat(
				A3($author$project$Reports$get, model, 'minimum', '')));
		var query = $elm$core$String$toLower(
			A3($author$project$Reports$get, model, 'filter', ''));
		var metric = A2(
			$elm$core$List$member,
			A3($author$project$Reports$get, model, 'metric', ''),
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				$author$project$Reports$columns(kind))) ? A3($author$project$Reports$get, model, 'metric', '') : '';
		var key = A2(
			$elm$core$List$member,
			A3($author$project$Reports$get, model, 'sort', 'title'),
			A2(
				$elm$core$List$map,
				$elm$core$Tuple$first,
				$author$project$Reports$columns(kind))) ? A3($author$project$Reports$get, model, 'sort', 'title') : 'title';
		var compareRows = F2(
			function (a, b) {
				var _v1 = _Utils_Tuple2(
					$elm$core$String$toFloat(
						A2($author$project$Reports$cell, key, a)),
					$elm$core$String$toFloat(
						A2($author$project$Reports$cell, key, b)));
				if ((!_v1.a.$) && (!_v1.b.$)) {
					var x = _v1.a.a;
					var y = _v1.b.a;
					return A2($elm$core$Basics$compare, x, y);
				} else {
					return A2(
						$elm$core$Basics$compare,
						$elm$core$String$toLower(
							A2($author$project$Reports$cell, key, a)),
						$elm$core$String$toLower(
							A2($author$project$Reports$cell, key, b)));
				}
			});
		var sorted = A2(
			$elm$core$List$sortWith,
			compareRows,
			A2(
				$elm$core$List$filter,
				function (row) {
					return A2(
						$elm$core$String$contains,
						query,
						$elm$core$String$toLower(
							A2(
								$elm$core$String$join,
								' ',
								A2(
									$elm$core$List$map,
									function (_v0) {
										var k = _v0.a;
										return A2($author$project$Reports$cell, k, row);
									},
									$author$project$Reports$columns(kind))))) && ((metric === '') || (_Utils_cmp(
						A2(
							$elm$core$Maybe$withDefault,
							0,
							$elm$core$String$toFloat(
								A2($author$project$Reports$cell, metric, row))),
						threshold) > -1));
				},
				model.bm));
		return (A3($author$project$Reports$get, model, 'direction', 'ascending') === 'descending') ? $elm$core$List$reverse(sorted) : sorted;
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Reports$visible = F2(
	function (model, kind) {
		return A2(
			$elm$core$List$filter,
			function (_v0) {
				var key = _v0.a;
				return A3($author$project$Reports$get, model, kind + (':hide:' + key), 'false') !== 'true';
			},
			$author$project$Reports$columns(kind));
	});
var $author$project$Reports$payload = F3(
	function (model, kind, action) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'action',
					$elm$json$Json$Encode$string(action)),
					_Utils_Tuple2(
					'title',
					$elm$json$Json$Encode$string(
						A3($author$project$Reports$get, model, 'title', 'ECC Management report'))),
					_Utils_Tuple2(
					'subtitle',
					$elm$json$Json$Encode$string(
						A3($author$project$Reports$get, model, 'subtitle', ''))),
					_Utils_Tuple2(
					'footer',
					$elm$json$Json$Encode$string(
						A3($author$project$Reports$get, model, 'footer', 'Confidential · Internal use'))),
					_Utils_Tuple2(
					'paper',
					$elm$json$Json$Encode$string(
						A3($author$project$Reports$get, model, 'paper', 'A4'))),
					_Utils_Tuple2(
					'orientation',
					$elm$json$Json$Encode$string(
						A3($author$project$Reports$get, model, 'orientation', 'portrait'))),
					_Utils_Tuple2(
					'density',
					$elm$json$Json$Encode$string(
						A3($author$project$Reports$get, model, 'density', 'comfortable'))),
					_Utils_Tuple2(
					'range',
					$elm$json$Json$Encode$string(
						(model.aq === '') ? ((kind === 'reports') ? 'Last 30 days' : 'All dates') : A3($elm$core$String$replace, ',', ' to ', model.aq))),
					_Utils_Tuple2(
					'kind',
					$elm$json$Json$Encode$string(
						function () {
							switch (kind) {
								case 'ageing':
									return 'Application ageing';
								case 'bottlenecks':
									return 'Application bottlenecks';
								case 'trends':
									return 'Historical workload';
								default:
									return 'Management summary';
							}
						}())),
					_Utils_Tuple2(
					'criteria',
					$elm$json$Json$Encode$string(
						'Search: ' + (A3($author$project$Reports$get, model, 'filter', 'All') + (' · Minimum ' + (A2(
							$elm$core$Maybe$withDefault,
							'(no numeric filter)',
							A2(
								$elm$core$Maybe$map,
								$elm$core$Tuple$second,
								$elm$core$List$head(
									A2(
										$elm$core$List$filter,
										function (_v1) {
											var k = _v1.a;
											return _Utils_eq(
												k,
												A3($author$project$Reports$get, model, 'metric', ''));
										},
										$author$project$Reports$columns(kind))))) + (': ' + A3($author$project$Reports$get, model, 'minimum', '0'))))))),
					_Utils_Tuple2(
					'headers',
					A2(
						$elm$json$Json$Encode$list,
						A2($elm$core$Basics$composeR, $elm$core$Tuple$second, $elm$json$Json$Encode$string),
						A2($author$project$Reports$visible, model, kind))),
					_Utils_Tuple2(
					'rows',
					A2(
						$elm$json$Json$Encode$list,
						function (row) {
							return A2(
								$elm$json$Json$Encode$list,
								function (_v2) {
									var key = _v2.a;
									return $elm$json$Json$Encode$string(
										A2($author$project$Reports$cell, key, row));
								},
								A2($author$project$Reports$visible, model, kind));
						},
						A2($author$project$Reports$reportRows, model, kind)))
				]));
	});
var $author$project$Api$portalPost = F3(
	function (ctx, action, value) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/portal/' + action,
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(value)),
			$elm$json$Json$Decode$value);
	});
var $author$project$Api$portalUpload = F3(
	function (ctx, rid, file) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/portal/requests/' + ($elm$core$String$fromInt(rid) + '/upload'),
			$elm$core$Maybe$Just(
				$elm$http$Http$multipartBody(
					_List_fromArray(
						[
							A2($elm$http$Http$filePart, 'file', file)
						]))),
			$elm$json$Json$Decode$value);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $author$project$State$ToastExpired = function (a) {
	return {$: 174, a: a};
};
var $elm$core$Process$sleep = _Process_sleep;
var $author$project$Main$pushToast = F3(
	function (model, kind, textMsg) {
		var id = model.cC + 1;
		var newToast = {bu: id, dr: kind, du: textMsg};
		return _Utils_Tuple2(
			_Utils_update(
				model,
				{
					cC: id,
					bo: _Utils_ap(
						model.bo,
						_List_fromArray(
							[newToast]))
				}),
			A2(
				$elm$core$Task$perform,
				$elm$core$Basics$always(
					$author$project$State$ToastExpired(id)),
				$elm$core$Process$sleep(3500)));
	});
var $author$project$Main$recordValidation = F2(
	function (msg, model) {
		var required = F3(
			function (key, label, value) {
				return ($elm$core$String$trim(value) === '') ? $elm$core$Maybe$Just(
					_Utils_Tuple2(key, label + ' is required.')) : $elm$core$Maybe$Nothing;
			});
		var password = F2(
			function (key, value) {
				return ($author$project$Validation$passwordError(value) === '') ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
					_Utils_Tuple2(
						key,
						$author$project$Validation$passwordError(value)));
			});
		var email = function (value) {
			if (value === '') {
				return $elm$core$Maybe$Nothing;
			} else {
				var _v2 = A2($elm$core$String$split, '@', value);
				if ((_v2.b && _v2.b.b) && (!_v2.b.b.b)) {
					var name = _v2.a;
					var _v3 = _v2.b;
					var domain = _v3.a;
					return ((name !== '') && ((domain !== '') && (!A2($elm$core$String$contains, ' ', value)))) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
						_Utils_Tuple2('email', 'Enter a valid email address.'));
				} else {
					return $elm$core$Maybe$Just(
						_Utils_Tuple2('email', 'Enter a valid email address.'));
				}
			}
		};
		var date = F2(
			function (key, value) {
				if (value === '') {
					return $elm$core$Maybe$Nothing;
				} else {
					var _v1 = $justinmimbs$date$Date$fromIsoString(value);
					if (!_v1.$) {
						return $elm$core$Maybe$Nothing;
					} else {
						return $elm$core$Maybe$Just(
							_Utils_Tuple2(key, 'Enter a valid date.'));
					}
				}
			});
		var contact = F2(
			function (name, address) {
				return _List_fromArray(
					[
						A3(required, 'fullName', 'Full name', name),
						email(address)
					]);
			});
		var errors = function () {
			switch (msg.$) {
				case 78:
					return _Utils_ap(
						A2(contact, model.y.aV, model.y.J),
						_List_fromArray(
							[
								A2(date, 'nextFollowup', model.y.cd)
							]));
				case 82:
					return _Utils_ap(
						A2(contact, model.l.aV, model.l.J),
						_List_fromArray(
							[
								A2(date, 'lastContact', model.l.ds),
								A2(date, 'nextFollowup', model.l.cd)
							]));
				case 126:
					return A2(contact, model.g.aV, model.g.J);
				case 134:
					return _List_fromArray(
						[
							A2(
							$elm$core$Maybe$andThen,
							function (f) {
								return A2(date, 'deadline', f.aT);
							},
							model.k)
						]);
				case 153:
					return _List_fromArray(
						[
							A3(required, 'name', 'Name', model.o.x),
							A3(required, 'email', 'Email', model.o.J),
							email(model.o.J),
							(model.o.ad === '') ? $elm$core$Maybe$Nothing : A2(password, 'password', model.o.ad)
						]);
				case 162:
					return _List_fromArray(
						[
							A3(required, 'pwCurrent', 'Current password', model.av),
							A2(password, 'pwNew', model.V),
							(!_Utils_eq(model.V, model.au)) ? $elm$core$Maybe$Just(
							_Utils_Tuple2('pwConfirm', 'Passwords do not match.')) : $elm$core$Maybe$Nothing
						]);
				case 118:
					return _List_fromArray(
						[
							A3(required, 'title', 'Task title', model.f.Z)
						]);
				case 119:
					return _List_fromArray(
						[
							A3(required, 'title', 'Task title', model.f.Z)
						]);
				default:
					return _List_Nil;
			}
		}();
		return $elm$core$Dict$fromList(
			A2($elm$core$List$filterMap, $elm$core$Basics$identity, errors));
	});
var $author$project$Api$recover = F2(
	function (ctx, email) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/auth/recover',
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'email',
								$elm$json$Json$Encode$string(email))
							])))),
			$author$project$Api$ignoreDecoder);
	});
var $author$project$State$AuditLoaded = function (a) {
	return {$: 74, a: a};
};
var $author$project$State$ClientDetailLoaded = function (a) {
	return {$: 71, a: a};
};
var $author$project$State$DetailLoaded = function (a) {
	return {$: 72, a: a};
};
var $author$project$State$OperationsLoaded = function (a) {
	return {$: 12, a: a};
};
var $author$project$State$StatsLoaded = function (a) {
	return {$: 73, a: a};
};
var $author$project$State$TasksLoaded = function (a) {
	return {$: 69, a: a};
};
var $elm$core$String$concat = function (strings) {
	return A2($elm$core$String$join, '', strings);
};
var $author$project$Api$fetchApplications = F5(
	function (ctx, search, filters, offset, toMsg) {
		var params = $elm$core$String$concat(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var key = _v0.a;
					var value = _v0.b;
					return '&' + ($elm$url$Url$percentEncode(key) + ('=' + $elm$url$Url$percentEncode(value)));
				},
				A2(
					$elm$core$List$filter,
					A2(
						$elm$core$Basics$composeR,
						$elm$core$Tuple$second,
						$elm$core$Basics$neq('')),
					$elm$core$Dict$toList(filters))));
		return A6(
			$author$project$Api$authedRequest,
			ctx,
			'GET',
			'/api/workspace/applications?q=' + ($elm$url$Url$percentEncode(search) + ('&offset=' + ($elm$core$String$fromInt(offset) + params))),
			$elm$core$Maybe$Nothing,
			$elm$json$Json$Decode$value,
			toMsg);
	});
var $author$project$Types$AuditEntry = F8(
	function (id, entityType, entityId, entityName, action, changes, actorName, createdAt) {
		return {cM: action, cN: actorName, cZ: changes, aA: createdAt, c8: entityId, c9: entityName, da: entityType, bu: id};
	});
var $author$project$Types$auditDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'createdAt',
	$author$project$Types$dateStr,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'actorName',
		$author$project$Types$maybeString,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'changes',
			$elm$json$Json$Decode$nullable($elm$json$Json$Decode$value),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'action',
				$elm$json$Json$Decode$string,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'entityName',
					$author$project$Types$maybeString,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'entityId',
						$elm$json$Json$Decode$int,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'entityType',
							$elm$json$Json$Decode$string,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'id',
								$elm$json$Json$Decode$int,
								$elm$json$Json$Decode$succeed($author$project$Types$AuditEntry)))))))));
var $author$project$Api$fetchAudit = F2(
	function (ctx, limit) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'GET',
			'/api/audit?limit=' + $elm$core$String$fromInt(limit),
			$elm$core$Maybe$Nothing,
			$elm$json$Json$Decode$list($author$project$Types$auditDecoder));
	});
var $author$project$Types$ClientDetail = F5(
	function (client, cases, documents, tasks, activities) {
		return {bJ: activities, cW: cases, ap: client, bX: documents, aj: tasks};
	});
var $author$project$Types$Activity = F6(
	function (id, leadId, leadName, kind, description, date) {
		return {c5: date, aU: description, bu: id, dr: kind, aW: leadId, ca: leadName};
	});
var $author$project$Types$activityDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'date',
	$author$project$Types$dateStr,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'description',
		$author$project$Types$maybeString,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'kind',
			$elm$json$Json$Decode$string,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'leadName',
				$author$project$Types$maybeString,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'leadId',
					$elm$json$Json$Decode$int,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'id',
						$elm$json$Json$Decode$int,
						$elm$json$Json$Decode$succeed($author$project$Types$Activity)))))));
var $author$project$Types$CaseRow = F8(
	function (id, clientId, category, destination, stage, deadline, createdAt, revision) {
		return {cX: category, br: clientId, aA: createdAt, aT: deadline, bb: destination, bu: id, t: revision, dO: stage};
	});
var $author$project$Types$caseDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'revision',
	$elm$json$Json$Decode$int,
	1,
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'createdAt',
		$author$project$Types$dateStr,
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'deadline',
			$elm$json$Json$Decode$nullable($author$project$Types$dateStr),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'stage',
				$elm$json$Json$Decode$string,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'destination',
					$author$project$Types$maybeString,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'category',
						$author$project$Types$maybeString,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'clientId',
							$elm$json$Json$Decode$int,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'id',
								$elm$json$Json$Decode$int,
								$elm$json$Json$Decode$succeed($author$project$Types$CaseRow)))))))));
var $author$project$Types$Document = function (id) {
	return function (leadId) {
		return function (clientId) {
			return function (filename) {
				return function (mimeType) {
					return function (size) {
						return function (uploaderName) {
							return function (createdAt) {
								return function (scanStatus) {
									return function (revision) {
										return {br: clientId, aA: createdAt, di: filename, bu: id, aW: leadId, dt: mimeType, t: revision, dI: scanStatus, dK: size, d_: uploaderName};
									};
								};
							};
						};
					};
				};
			};
		};
	};
};
var $author$project$Types$documentDecoder = A4(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
	'revision',
	$elm$json$Json$Decode$int,
	1,
	A4(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$optional,
		'scanStatus',
		$elm$json$Json$Decode$string,
		'Pending',
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'createdAt',
			$author$project$Types$dateStr,
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'uploader',
				$author$project$Types$maybeString,
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'size',
					$elm$json$Json$Decode$int,
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'mimeType',
						$elm$json$Json$Decode$string,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'filename',
							$elm$json$Json$Decode$string,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'clientId',
								$author$project$Types$maybeInt,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'leadId',
									$author$project$Types$maybeInt,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'id',
										$elm$json$Json$Decode$int,
										$elm$json$Json$Decode$succeed($author$project$Types$Document)))))))))));
var $author$project$Types$clientDetailDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'activities',
	$elm$json$Json$Decode$list($author$project$Types$activityDecoder),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'tasks',
		$elm$json$Json$Decode$list($author$project$Types$taskDecoder),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'documents',
			$elm$json$Json$Decode$list($author$project$Types$documentDecoder),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'cases',
				$elm$json$Json$Decode$list($author$project$Types$caseDecoder),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'client',
					$author$project$Types$clientDecoder,
					$elm$json$Json$Decode$succeed($author$project$Types$ClientDetail))))));
var $author$project$Api$fetchClientDetail = F2(
	function (ctx, id) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'GET',
			'/api/clients/' + $elm$core$String$fromInt(id),
			$elm$core$Maybe$Nothing,
			$author$project$Types$clientDetailDecoder);
	});
var $author$project$Api$fetchClients = function (ctx) {
	return A5(
		$author$project$Api$authedRequest,
		ctx,
		'GET',
		'/api/clients',
		$elm$core$Maybe$Nothing,
		$elm$json$Json$Decode$list($author$project$Types$clientDecoder));
};
var $author$project$Types$LeadDetail = F4(
	function (lead, tasks, activities, documents) {
		return {bJ: activities, bX: documents, bh: lead, aj: tasks};
	});
var $author$project$Types$leadDetailDecoder = A3(
	$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
	'documents',
	$elm$json$Json$Decode$list($author$project$Types$documentDecoder),
	A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'activities',
		$elm$json$Json$Decode$list($author$project$Types$activityDecoder),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'tasks',
			$elm$json$Json$Decode$list($author$project$Types$taskDecoder),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'lead',
				$author$project$Types$leadDecoder,
				$elm$json$Json$Decode$succeed($author$project$Types$LeadDetail)))));
var $author$project$Api$fetchLeadDetail = F2(
	function (ctx, id) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'GET',
			'/api/leads/' + $elm$core$String$fromInt(id),
			$elm$core$Maybe$Nothing,
			$author$project$Types$leadDetailDecoder);
	});
var $author$project$Api$fetchLeads = function (ctx) {
	return A5(
		$author$project$Api$authedRequest,
		ctx,
		'GET',
		'/api/leads',
		$elm$core$Maybe$Nothing,
		$elm$json$Json$Decode$list($author$project$Types$leadDecoder));
};
var $author$project$Api$fetchOperations = F3(
	function (ctx, kind, offset) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'GET',
			'/api/' + (kind + ('?limit=50&offset=' + $elm$core$String$fromInt(offset))),
			$elm$core$Maybe$Nothing,
			$elm$json$Json$Decode$list($elm$json$Json$Decode$value));
	});
var $author$project$Types$Stats = F9(
	function (totalLeads, hotLeads, totalClients, openTasks, overdueTasks, stageCounts, sourceCounts, upcomingTasks, recentActivity) {
		return {dn: hotLeads, dz: openTasks, dA: overdueTasks, dE: recentActivity, dN: sourceCounts, dP: stageCounts, dV: totalClients, dW: totalLeads, dX: upcomingTasks};
	});
var $author$project$Types$statsDecoder = function () {
	var stageCount = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (s, c) {
				return {ba: c, dO: s};
			}),
		A2($elm$json$Json$Decode$field, 'scStage', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'scCount', $elm$json$Json$Decode$int));
	var sourceCount = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (s, c) {
				return {ba: c, aL: s};
			}),
		A2($elm$json$Json$Decode$field, 'srcSource', $elm$json$Json$Decode$string),
		A2($elm$json$Json$Decode$field, 'srcCount', $elm$json$Json$Decode$int));
	return A3(
		$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
		'stRecentActivity',
		$elm$json$Json$Decode$list($author$project$Types$activityDecoder),
		A3(
			$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
			'stUpcomingTasks',
			$elm$json$Json$Decode$list($author$project$Types$taskDecoder),
			A3(
				$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
				'stSourceCounts',
				$elm$json$Json$Decode$list(sourceCount),
				A3(
					$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
					'stStageCounts',
					$elm$json$Json$Decode$list(stageCount),
					A3(
						$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
						'stOverdueTasks',
						$elm$json$Json$Decode$int,
						A3(
							$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
							'stOpenTasks',
							$elm$json$Json$Decode$int,
							A3(
								$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
								'stTotalClients',
								$elm$json$Json$Decode$int,
								A3(
									$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
									'stHotLeads',
									$elm$json$Json$Decode$int,
									A3(
										$NoRedInk$elm_json_decode_pipeline$Json$Decode$Pipeline$required,
										'stTotalLeads',
										$elm$json$Json$Decode$int,
										$elm$json$Json$Decode$succeed($author$project$Types$Stats))))))))));
}();
var $author$project$Api$fetchStats = function (ctx) {
	return A5($author$project$Api$authedRequest, ctx, 'GET', '/api/stats', $elm$core$Maybe$Nothing, $author$project$Types$statsDecoder);
};
var $author$project$Api$fetchTasksPage = F2(
	function (ctx, offset) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'GET',
			'/api/tasks?limit=50&offset=' + $elm$core$String$fromInt(offset),
			$elm$core$Maybe$Nothing,
			$elm$json$Json$Decode$list($author$project$Types$taskDecoder));
	});
var $author$project$Api$financialHistory = F5(
	function (ctx, invoice, query, offset, toMsg) {
		return A6(
			$author$project$Api$authedRequest,
			ctx,
			'GET',
			'/api/workspace/payment-history?q=' + ($elm$url$Url$percentEncode(query) + ('&offset=' + ($elm$core$String$fromInt(offset) + A2(
				$elm$core$Maybe$withDefault,
				'',
				A2(
					$elm$core$Maybe$map,
					function (ident) {
						return '&invoice=' + $elm$url$Url$percentEncode(ident);
					},
					invoice))))),
			$elm$core$Maybe$Nothing,
			$elm$json$Json$Decode$value,
			toMsg);
	});
var $author$project$Main$routeCmd = F2(
	function (model, route) {
		var ctx = {ao: model.am, dU: model.dU};
		var alwaysFetch = $elm$core$Platform$Cmd$batch(
			_List_fromArray(
				[
					A3(
					$author$project$Api$fetchTasksPage,
					ctx,
					model.dB,
					A2($author$project$Main$acceptLoad, model, $author$project$State$TasksLoaded))
				]));
		switch (route.$) {
			case 0:
				return $elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							A2(
							$author$project$Api$fetchStats,
							ctx,
							A2($author$project$Main$acceptLoad, model, $author$project$State$StatsLoaded)),
							A2(
							$author$project$Api$fetchLeads,
							ctx,
							A2($author$project$Main$acceptLoad, model, $author$project$State$LeadsLoaded))
						]));
			case 1:
				return $elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							A4(
							$author$project$Api$fetchFilteredLeads,
							ctx,
							model,
							model.dB,
							A2($author$project$Main$acceptLoad, model, $author$project$State$LeadsLoaded)),
							A2(
							$author$project$Api$fetchUsers,
							ctx,
							A2($author$project$Main$acceptLoad, model, $author$project$State$UsersLoaded))
						]));
			case 2:
				var id = route.a;
				return $elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							A3(
							$author$project$Api$fetchLeadDetail,
							ctx,
							id,
							A2($author$project$Main$acceptLoad, model, $author$project$State$DetailLoaded)),
							A2(
							$author$project$Api$fetchUsers,
							ctx,
							A2($author$project$Main$acceptLoad, model, $author$project$State$UsersLoaded))
						]));
			case 3:
				return $elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							A4(
							$author$project$Api$fetchClientsPage,
							ctx,
							model.dB,
							model.a8,
							A2($author$project$Main$acceptLoad, model, $author$project$State$ClientsLoaded)),
							A2(
							$author$project$Api$fetchUsers,
							ctx,
							A2($author$project$Main$acceptLoad, model, $author$project$State$UsersLoaded))
						]));
			case 4:
				var id = route.a;
				return A3(
					$author$project$Api$fetchClientDetail,
					ctx,
					id,
					A2($author$project$Main$acceptLoad, model, $author$project$State$ClientDetailLoaded));
			case 5:
				return $elm$core$Platform$Cmd$batch(
					_List_fromArray(
						[
							A3(
							$author$project$Api$fetchTasksPage,
							ctx,
							model.dB,
							A2($author$project$Main$acceptLoad, model, $author$project$State$TasksLoaded)),
							A2(
							$author$project$Api$fetchUsers,
							ctx,
							A2($author$project$Main$acceptLoad, model, $author$project$State$UsersLoaded)),
							A2(
							$author$project$Api$fetchLeads,
							ctx,
							A2($author$project$Main$acceptLoad, model, $author$project$State$LeadsLoaded)),
							A2(
							$author$project$Api$fetchClients,
							ctx,
							A2($author$project$Main$acceptLoad, model, $author$project$State$ClientsLoaded))
						]));
			case 6:
				return A2(
					$author$project$Api$fetchUsers,
					ctx,
					A2($author$project$Main$acceptLoad, model, $author$project$State$UsersLoaded));
			case 7:
				return A3(
					$author$project$Api$fetchAudit,
					ctx,
					200,
					A2($author$project$Main$acceptLoad, model, $author$project$State$AuditLoaded));
			default:
				var kind = route.a;
				return (kind === 'work/applications') ? A5(
					$author$project$Api$fetchApplications,
					ctx,
					model.aq,
					model.cP,
					model.dB,
					A2($author$project$Main$acceptLoad, model, $author$project$State$FeatureLoaded)) : ((kind === 'work/payment-history') ? A5(
					$author$project$Api$financialHistory,
					ctx,
					$elm$core$List$head(
						A2(
							$elm$core$List$filterMap,
							function (part) {
								return A2($elm$core$String$startsWith, 'invoice=', part) ? $elm$url$Url$percentDecode(
									A2($elm$core$String$dropLeft, 8, part)) : $elm$core$Maybe$Nothing;
							},
							A2(
								$elm$core$String$split,
								'&',
								A2($elm$core$Maybe$withDefault, '', model.bq.ag)))),
					model.aq,
					model.dB,
					A2($author$project$Main$acceptLoad, model, $author$project$State$FeatureLoaded)) : (A2($elm$core$String$startsWith, 'work/', kind) ? A5(
					$author$project$Api$featureGet,
					ctx,
					A2($elm$core$String$dropLeft, 5, kind),
					model.aq,
					model.dB,
					A2($author$project$Main$acceptLoad, model, $author$project$State$FeatureLoaded)) : A4(
					$author$project$Api$fetchOperations,
					ctx,
					kind,
					model.dB,
					A2($author$project$Main$acceptLoad, model, $author$project$State$OperationsLoaded))));
		}
	});
var $author$project$Main$reloadCurrent = function (model) {
	return A2(
		$author$project$Main$routeCmd,
		model,
		$author$project$State$routeOf(model.bq));
};
var $author$project$Main$reloadPanel = function (model) {
	var _v0 = _Utils_Tuple2(
		$author$project$State$routeOf(model.bq),
		model.c$);
	if ((_v0.a.$ === 4) && (!_v0.b.$)) {
		var cid = _v0.a.a;
		var detail = _v0.b.a;
		return _Utils_eq(detail.ap.bu, cid) ? A5(
			$author$project$Api$featureGet,
			{ao: model.am, dU: model.dU},
			A2($author$project$Main$inlinePath, model, cid),
			model.aq,
			model.dB,
			A2($author$project$Main$acceptLoad, model, $author$project$State$FeatureLoaded)) : $author$project$Main$reloadCurrent(model);
	} else {
		return $author$project$Main$reloadCurrent(model);
	}
};
var $elm$core$Set$remove = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$remove, key, dict);
	});
var $elm$browser$Browser$Navigation$replaceUrl = _Browser_replaceUrl;
var $author$project$Main$reportOutput = _Platform_outgoingPort('reportOutput', $elm$core$Basics$identity);
var $author$project$Main$requestReportLayout = _Platform_outgoingPort(
	'requestReportLayout',
	function ($) {
		return $elm$json$Json$Encode$null;
	});
var $author$project$Api$rescanFinancialFile = F2(
	function (ctx, ident) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/finance/attachments/' + (ident + '/rescan'),
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(
					$elm$json$Json$Encode$object(_List_Nil))),
			$elm$json$Json$Decode$value);
	});
var $author$project$Api$resetPassword = F3(
	function (ctx, token, password) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/auth/reset',
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'token',
								$elm$json$Json$Encode$string(token)),
								_Utils_Tuple2(
								'password',
								$elm$json$Json$Encode$string(password))
							])))),
			$author$project$Api$ignoreDecoder);
	});
var $author$project$Main$restoreSessionDraft = F2(
	function (uid, model) {
		var _v0 = model.ah;
		if (!_v0.$) {
			var draft = _v0.a;
			return (_Utils_eq(draft.ch, uid) && _Utils_eq(
				draft.r,
				$elm$url$Url$toString(model.bq))) ? _Utils_update(
				model,
				{y: draft.y, f: draft.f, k: draft.k, Q: draft.Q, g: draft.g, l: draft.l, S: draft.S, A: draft.A, B: draft.B, dh: draft.dh, b: draft.b, ab: draft.ab, bg: draft.bg, G: draft.G, n: draft.n, ah: $elm$core$Maybe$Nothing, Y: draft.Y, O: draft.O, P: draft.P}) : _Utils_update(
				model,
				{ah: $elm$core$Maybe$Nothing});
		} else {
			return model;
		}
	});
var $author$project$Main$resultError = function (result) {
	if (!result.$) {
		return '';
	} else {
		var err = result.a;
		return $author$project$Main$httpError(err);
	}
};
var $author$project$Api$retryClientPhoto = F2(
	function (ctx, cid) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/clients/' + ($elm$core$String$fromInt(cid) + '/photo/rescan'),
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(
					$elm$json$Json$Encode$object(_List_Nil))),
			$elm$json$Json$Decode$value);
	});
var $author$project$Features$str = F2(
	function (key, item) {
		return A2(
			$elm$core$Result$withDefault,
			'',
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$field, key, $author$project$Features$scalar),
				item));
	});
var $author$project$Features$rowForm = function (row) {
	var values = $author$project$Features$formValues(row);
	var rid = A2($author$project$Features$str, 'id', row);
	return A3(
		$elm$core$Dict$insert,
		'user',
		rid,
		A3(
			$elm$core$Dict$insert,
			'session',
			rid,
			A3(
				$elm$core$Dict$insert,
				'request',
				'request:' + rid,
				A3(
					$elm$core$Dict$insert,
					'expectedRevision',
					A2($author$project$Features$str, 'revision', row),
					values))));
};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $author$project$Main$saveDark = _Platform_outgoingPort('saveDark', $elm$json$Json$Encode$bool);
var $author$project$Main$saveReportLayout = _Platform_outgoingPort('saveReportLayout', $elm$core$Basics$identity);
var $elm$core$Maybe$destruct = F3(
	function (_default, func, maybe) {
		if (!maybe.$) {
			var a = maybe.a;
			return func(a);
		} else {
			return _default;
		}
	});
var $author$project$Main$saveToken = _Platform_outgoingPort(
	'saveToken',
	function ($) {
		return A3($elm$core$Maybe$destruct, $elm$json$Json$Encode$null, $elm$json$Json$Encode$string, $);
	});
var $author$project$Api$setTaskStatus = F4(
	function (ctx, id, revision, status) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'PATCH',
			'/api/tasks/' + $elm$core$String$fromInt(id),
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(
					$elm$json$Json$Encode$object(
						_List_fromArray(
							[
								_Utils_Tuple2(
								'tsrStatus',
								$elm$json$Json$Encode$string(status)),
								_Utils_Tuple2(
								'expectedRevision',
								$elm$json$Json$Encode$int(revision))
							])))),
			$author$project$Api$ignoreDecoder);
	});
var $elm$file$File$size = _File_size;
var $author$project$Main$startsLoad = function (msg) {
	_v0$59:
	while (true) {
		switch (msg.$) {
			case 92:
				return true;
			case 90:
				return true;
			case 93:
				return true;
			case 91:
				if (!msg.b.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 94:
				return true;
			case 39:
				return true;
			case 41:
				return true;
			case 57:
				return true;
			case 10:
				return true;
			case 11:
				return true;
			case 37:
				return true;
			case 42:
				return true;
			case 16:
				return true;
			case 17:
				return true;
			case 30:
				return true;
			case 31:
				return true;
			case 36:
				return true;
			case 46:
				return true;
			case 50:
				return true;
			case 52:
				return true;
			case 53:
				return true;
			case 54:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 51:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 44:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 99:
				return true;
			case 122:
				return true;
			case 100:
				return true;
			case 101:
				return true;
			case 102:
				return true;
			case 103:
				return true;
			case 104:
				return true;
			case 105:
				return true;
			case 66:
				return true;
			case 9:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 163:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 165:
				return true;
			case 14:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 79:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 83:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 85:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 87:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 95:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 98:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 111:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 113:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 115:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 121:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 128:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 127:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 130:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 135:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 137:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 142:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 143:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 145:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 148:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 154:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 155:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			case 157:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$59;
				}
			default:
				break _v0$59;
		}
	}
	return false;
};
var $author$project$Main$startsUserLoad = function (msg) {
	_v0$7:
	while (true) {
		switch (msg.$) {
			case 154:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$7;
				}
			case 155:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$7;
				}
			case 157:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$7;
				}
			case 66:
				return true;
			case 9:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$7;
				}
			case 163:
				if (!msg.a.$) {
					return true;
				} else {
					break _v0$7;
				}
			case 57:
				return true;
			default:
				break _v0$7;
		}
	}
	return false;
};
var $author$project$Types$encodeNewTask = function (f) {
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'ntLeadId',
				$elm$json$Json$Encode$int(f.aW)),
				_Utils_Tuple2(
				'ntTitle',
				$elm$json$Json$Encode$string(f.Z)),
				_Utils_Tuple2(
				'ntDescription',
				$author$project$Types$encodeNonEmpty(f.aU)),
				_Utils_Tuple2(
				'ntDueDate',
				$author$project$Types$maybeDate(f.aC)),
				_Utils_Tuple2(
				'ntPriority',
				$author$project$Types$encodeNonEmpty(f.a$))
			]));
};
var $author$project$Main$submitTask = F3(
	function (model, ctx, leadId) {
		return ($elm$core$String$trim(model.f.Z) === '') ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
			model,
			A3(
				$author$project$Api$createTask,
				ctx,
				$author$project$Types$encodeNewTask(
					{aU: model.f.aU, aC: model.f.aC, aW: leadId, a$: model.f.a$, Z: model.f.Z}),
				$author$project$State$AddTaskDone));
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$State$ToastPushed = F2(
	function (a, b) {
		return {$: 173, a: a, b: b};
	});
var $author$project$Main$toast = F2(
	function (kind, textMsg) {
		return A2(
			$elm$core$Task$perform,
			$elm$core$Basics$identity,
			$elm$core$Task$succeed(
				A2($author$project$State$ToastPushed, kind, textMsg)));
	});
var $author$project$Main$unsavedChanges = _Platform_outgoingPort('unsavedChanges', $elm$json$Json$Encode$bool);
var $author$project$Api$updateClient = F3(
	function (ctx, id, body) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'PATCH',
			'/api/clients/' + $elm$core$String$fromInt(id),
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(body)),
			$author$project$Api$ignoreDecoder);
	});
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $justinmimbs$date$Date$fromCalendarDate = F3(
	function (y, m, d) {
		return ($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + A3(
			$elm$core$Basics$clamp,
			1,
			A2($justinmimbs$date$Date$daysInMonth, y, m),
			d);
	});
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.bF, posixMinutes) < 0) {
					return posixMinutes + era.c;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		bW: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		cc: month,
		cL: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).bW;
	});
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).cc;
		switch (_v0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).cL;
	});
var $justinmimbs$date$Date$fromPosix = F2(
	function (zone, posix) {
		return A3(
			$justinmimbs$date$Date$fromCalendarDate,
			A2($elm$time$Time$toYear, zone, posix),
			A2($elm$time$Time$toMonth, zone, posix),
			A2($elm$time$Time$toDay, zone, posix));
	});
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $elm$time$Time$toHour = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			24,
			A2(
				$elm$time$Time$flooredDiv,
				A2($elm$time$Time$toAdjustedMinutes, zone, time),
				60));
	});
var $justinmimbs$date$Date$monthToNumber = function (m) {
	switch (m) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		case 6:
			return 7;
		case 7:
			return 8;
		case 8:
			return 9;
		case 9:
			return 10;
		case 10:
			return 11;
		default:
			return 12;
	}
};
var $justinmimbs$date$Date$toCalendarDateHelp = F3(
	function (y, m, d) {
		toCalendarDateHelp:
		while (true) {
			var monthDays = A2($justinmimbs$date$Date$daysInMonth, y, m);
			var mn = $justinmimbs$date$Date$monthToNumber(m);
			if ((mn < 12) && (_Utils_cmp(d, monthDays) > 0)) {
				var $temp$y = y,
					$temp$m = $justinmimbs$date$Date$numberToMonth(mn + 1),
					$temp$d = d - monthDays;
				y = $temp$y;
				m = $temp$m;
				d = $temp$d;
				continue toCalendarDateHelp;
			} else {
				return {bW: d, cc: m, cL: y};
			}
		}
	});
var $justinmimbs$date$Date$divWithRemainder = F2(
	function (a, b) {
		return _Utils_Tuple2(
			A2($justinmimbs$date$Date$floorDiv, a, b),
			A2($elm$core$Basics$modBy, b, a));
	});
var $justinmimbs$date$Date$year = function (_v0) {
	var rd = _v0;
	var _v1 = A2($justinmimbs$date$Date$divWithRemainder, rd, 146097);
	var n400 = _v1.a;
	var r400 = _v1.b;
	var _v2 = A2($justinmimbs$date$Date$divWithRemainder, r400, 36524);
	var n100 = _v2.a;
	var r100 = _v2.b;
	var _v3 = A2($justinmimbs$date$Date$divWithRemainder, r100, 1461);
	var n4 = _v3.a;
	var r4 = _v3.b;
	var _v4 = A2($justinmimbs$date$Date$divWithRemainder, r4, 365);
	var n1 = _v4.a;
	var r1 = _v4.b;
	var n = (!r1) ? 0 : 1;
	return ((((n400 * 400) + (n100 * 100)) + (n4 * 4)) + n1) + n;
};
var $justinmimbs$date$Date$toOrdinalDate = function (_v0) {
	var rd = _v0;
	var y = $justinmimbs$date$Date$year(rd);
	return {
		bA: rd - $justinmimbs$date$Date$daysBeforeYear(y),
		cL: y
	};
};
var $justinmimbs$date$Date$toCalendarDate = function (_v0) {
	var rd = _v0;
	var date = $justinmimbs$date$Date$toOrdinalDate(rd);
	return A3($justinmimbs$date$Date$toCalendarDateHelp, date.cL, 0, date.bA);
};
var $justinmimbs$date$Date$day = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toCalendarDate,
	function ($) {
		return $.bW;
	});
var $justinmimbs$date$Date$month = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toCalendarDate,
	function ($) {
		return $.cc;
	});
var $justinmimbs$date$Date$monthNumber = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$month, $justinmimbs$date$Date$monthToNumber);
var $justinmimbs$date$Date$ordinalDay = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toOrdinalDate,
	function ($) {
		return $.bA;
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $justinmimbs$date$Date$padSignedInt = F2(
	function (length, _int) {
		return _Utils_ap(
			(_int < 0) ? '-' : '',
			A3(
				$elm$core$String$padLeft,
				length,
				'0',
				$elm$core$String$fromInt(
					$elm$core$Basics$abs(_int))));
	});
var $justinmimbs$date$Date$monthToQuarter = function (m) {
	return (($justinmimbs$date$Date$monthToNumber(m) + 2) / 3) | 0;
};
var $justinmimbs$date$Date$quarter = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$month, $justinmimbs$date$Date$monthToQuarter);
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $elm$time$Time$Fri = 4;
var $elm$time$Time$Mon = 0;
var $elm$time$Time$Sat = 5;
var $elm$time$Time$Sun = 6;
var $elm$time$Time$Thu = 3;
var $elm$time$Time$Tue = 1;
var $elm$time$Time$Wed = 2;
var $justinmimbs$date$Date$numberToWeekday = function (wdn) {
	var _v0 = A2($elm$core$Basics$max, 1, wdn);
	switch (_v0) {
		case 1:
			return 0;
		case 2:
			return 1;
		case 3:
			return 2;
		case 4:
			return 3;
		case 5:
			return 4;
		case 6:
			return 5;
		default:
			return 6;
	}
};
var $justinmimbs$date$Date$toWeekDate = function (_v0) {
	var rd = _v0;
	var wdn = $justinmimbs$date$Date$weekdayNumber(rd);
	var wy = $justinmimbs$date$Date$year(rd + (4 - wdn));
	var week1Day1 = $justinmimbs$date$Date$daysBeforeWeekYear(wy) + 1;
	return {
		cG: 1 + (((rd - week1Day1) / 7) | 0),
		cH: wy,
		d0: $justinmimbs$date$Date$numberToWeekday(wdn)
	};
};
var $justinmimbs$date$Date$weekNumber = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toWeekDate,
	function ($) {
		return $.cG;
	});
var $justinmimbs$date$Date$weekYear = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toWeekDate,
	function ($) {
		return $.cH;
	});
var $justinmimbs$date$Date$weekday = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$weekdayNumber, $justinmimbs$date$Date$numberToWeekday);
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $justinmimbs$date$Date$ordinalSuffix = function (n) {
	var nn = A2($elm$core$Basics$modBy, 100, n);
	var _v0 = A2(
		$elm$core$Basics$min,
		(nn < 20) ? nn : A2($elm$core$Basics$modBy, 10, nn),
		4);
	switch (_v0) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
};
var $justinmimbs$date$Date$withOrdinalSuffix = function (n) {
	return _Utils_ap(
		$elm$core$String$fromInt(n),
		$justinmimbs$date$Date$ordinalSuffix(n));
};
var $justinmimbs$date$Date$formatField = F4(
	function (language, _char, length, date) {
		switch (_char) {
			case 'y':
				if (length === 2) {
					return A2(
						$elm$core$String$right,
						2,
						A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$year(date))));
				} else {
					return A2(
						$justinmimbs$date$Date$padSignedInt,
						length,
						$justinmimbs$date$Date$year(date));
				}
			case 'Y':
				if (length === 2) {
					return A2(
						$elm$core$String$right,
						2,
						A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$weekYear(date))));
				} else {
					return A2(
						$justinmimbs$date$Date$padSignedInt,
						length,
						$justinmimbs$date$Date$weekYear(date));
				}
			case 'Q':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 2:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 3:
						return 'Q' + $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 4:
						return $justinmimbs$date$Date$withOrdinalSuffix(
							$justinmimbs$date$Date$quarter(date));
					case 5:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					default:
						return '';
				}
			case 'M':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$monthNumber(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$monthNumber(date)));
					case 3:
						return language.bk(
							$justinmimbs$date$Date$month(date));
					case 4:
						return language.bx(
							$justinmimbs$date$Date$month(date));
					case 5:
						return A2(
							$elm$core$String$left,
							1,
							language.bk(
								$justinmimbs$date$Date$month(date)));
					default:
						return '';
				}
			case 'w':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekNumber(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$weekNumber(date)));
					default:
						return '';
				}
			case 'd':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$day(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$day(date)));
					case 3:
						return language.bt(
							$justinmimbs$date$Date$day(date));
					default:
						return '';
				}
			case 'D':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$ordinalDay(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$ordinalDay(date)));
					case 3:
						return A3(
							$elm$core$String$padLeft,
							3,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$ordinalDay(date)));
					default:
						return '';
				}
			case 'E':
				switch (length) {
					case 1:
						return language.az(
							$justinmimbs$date$Date$weekday(date));
					case 2:
						return language.az(
							$justinmimbs$date$Date$weekday(date));
					case 3:
						return language.az(
							$justinmimbs$date$Date$weekday(date));
					case 4:
						return language.bI(
							$justinmimbs$date$Date$weekday(date));
					case 5:
						return A2(
							$elm$core$String$left,
							1,
							language.az(
								$justinmimbs$date$Date$weekday(date)));
					case 6:
						return A2(
							$elm$core$String$left,
							2,
							language.az(
								$justinmimbs$date$Date$weekday(date)));
					default:
						return '';
				}
			case 'e':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekdayNumber(date));
					case 2:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekdayNumber(date));
					default:
						return A4($justinmimbs$date$Date$formatField, language, 'E', length, date);
				}
			default:
				return '';
		}
	});
var $justinmimbs$date$Date$formatWithTokens = F3(
	function (language, tokens, date) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (token, formatted) {
					if (!token.$) {
						var _char = token.a;
						var length = token.b;
						return _Utils_ap(
							A4($justinmimbs$date$Date$formatField, language, _char, length, date),
							formatted);
					} else {
						var str = token.a;
						return _Utils_ap(str, formatted);
					}
				}),
			'',
			tokens);
	});
var $justinmimbs$date$Pattern$Literal = function (a) {
	return {$: 1, a: a};
};
var $justinmimbs$date$Pattern$escapedQuote = A2(
	$elm$parser$Parser$ignorer,
	$elm$parser$Parser$succeed(
		$justinmimbs$date$Pattern$Literal('\'')),
	$elm$parser$Parser$token('\'\''));
var $justinmimbs$date$Pattern$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.a);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.c, offset) < 0,
					0,
					{bS: col, d: s0.d, e: s0.e, c: offset, dH: row, a: s0.a});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.c, s.dH, s.bS, s);
	};
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$parser$Parser$Advanced$getOffset = function (s) {
	return A3($elm$parser$Parser$Advanced$Good, false, s.c, s);
};
var $elm$parser$Parser$getOffset = $elm$parser$Parser$Advanced$getOffset;
var $justinmimbs$date$Pattern$fieldRepeats = function (str) {
	var _v0 = $elm$core$String$toList(str);
	if (_v0.b && (!_v0.b.b)) {
		var _char = _v0.a;
		return A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (x, y) {
							return A2($justinmimbs$date$Pattern$Field, _char, 1 + (y - x));
						})),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$getOffset,
					$elm$parser$Parser$chompWhile(
						$elm$core$Basics$eq(_char)))),
			$elm$parser$Parser$getOffset);
	} else {
		return $elm$parser$Parser$problem('expected exactly one char');
	}
};
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $justinmimbs$date$Pattern$field = A2(
	$elm$parser$Parser$andThen,
	$justinmimbs$date$Pattern$fieldRepeats,
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompIf($elm$core$Char$isAlpha)));
var $justinmimbs$date$Pattern$finalize = A2(
	$elm$core$List$foldl,
	F2(
		function (token, tokens) {
			var _v0 = _Utils_Tuple2(token, tokens);
			if (((_v0.a.$ === 1) && _v0.b.b) && (_v0.b.a.$ === 1)) {
				var x = _v0.a.a;
				var _v1 = _v0.b;
				var y = _v1.a.a;
				var rest = _v1.b;
				return A2(
					$elm$core$List$cons,
					$justinmimbs$date$Pattern$Literal(
						_Utils_ap(x, y)),
					rest);
			} else {
				return A2($elm$core$List$cons, token, tokens);
			}
		}),
	_List_Nil);
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return function (s) {
		var _v0 = thunk(0);
		var parse = _v0;
		return parse(s);
	};
};
var $elm$parser$Parser$lazy = $elm$parser$Parser$Advanced$lazy;
var $justinmimbs$date$Pattern$isLiteralChar = function (_char) {
	return (_char !== '\'') && (!$elm$core$Char$isAlpha(_char));
};
var $justinmimbs$date$Pattern$literal = A2(
	$elm$parser$Parser$map,
	$justinmimbs$date$Pattern$Literal,
	$elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(0),
				$elm$parser$Parser$chompIf($justinmimbs$date$Pattern$isLiteralChar)),
			$elm$parser$Parser$chompWhile($justinmimbs$date$Pattern$isLiteralChar))));
var $justinmimbs$date$Pattern$quotedHelp = function (result) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				function (str) {
					return $justinmimbs$date$Pattern$quotedHelp(
						_Utils_ap(result, str));
				},
				$elm$parser$Parser$getChompedString(
					A2(
						$elm$parser$Parser$ignorer,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed(0),
							$elm$parser$Parser$chompIf(
								$elm$core$Basics$neq('\''))),
						$elm$parser$Parser$chompWhile(
							$elm$core$Basics$neq('\''))))),
				A2(
				$elm$parser$Parser$andThen,
				function (_v0) {
					return $justinmimbs$date$Pattern$quotedHelp(result + '\'');
				},
				$elm$parser$Parser$token('\'\'')),
				$elm$parser$Parser$succeed(result)
			]));
};
var $justinmimbs$date$Pattern$quoted = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($justinmimbs$date$Pattern$Literal),
		$elm$parser$Parser$chompIf(
			$elm$core$Basics$eq('\''))),
	A2(
		$elm$parser$Parser$ignorer,
		$justinmimbs$date$Pattern$quotedHelp(''),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$chompIf(
					$elm$core$Basics$eq('\'')),
					$elm$parser$Parser$end
				]))));
var $justinmimbs$date$Pattern$patternHelp = function (tokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				function (token) {
					return $justinmimbs$date$Pattern$patternHelp(
						A2($elm$core$List$cons, token, tokens));
				},
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[$justinmimbs$date$Pattern$field, $justinmimbs$date$Pattern$literal, $justinmimbs$date$Pattern$escapedQuote, $justinmimbs$date$Pattern$quoted]))),
				$elm$parser$Parser$lazy(
				function (_v0) {
					return $elm$parser$Parser$succeed(
						$justinmimbs$date$Pattern$finalize(tokens));
				})
			]));
};
var $justinmimbs$date$Pattern$fromString = function (str) {
	return A2(
		$elm$core$Result$withDefault,
		_List_fromArray(
			[
				$justinmimbs$date$Pattern$Literal(str)
			]),
		A2(
			$elm$parser$Parser$run,
			$justinmimbs$date$Pattern$patternHelp(_List_Nil),
			str));
};
var $justinmimbs$date$Date$formatWithLanguage = F2(
	function (language, pattern) {
		var tokens = $elm$core$List$reverse(
			$justinmimbs$date$Pattern$fromString(pattern));
		return A2($justinmimbs$date$Date$formatWithTokens, language, tokens);
	});
var $justinmimbs$date$Date$weekdayToName = function (wd) {
	switch (wd) {
		case 0:
			return 'Monday';
		case 1:
			return 'Tuesday';
		case 2:
			return 'Wednesday';
		case 3:
			return 'Thursday';
		case 4:
			return 'Friday';
		case 5:
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var $justinmimbs$date$Date$language_en = {
	bt: $justinmimbs$date$Date$withOrdinalSuffix,
	bx: $justinmimbs$date$Date$monthToName,
	bk: A2(
		$elm$core$Basics$composeR,
		$justinmimbs$date$Date$monthToName,
		$elm$core$String$left(3)),
	bI: $justinmimbs$date$Date$weekdayToName,
	az: A2(
		$elm$core$Basics$composeR,
		$justinmimbs$date$Date$weekdayToName,
		$elm$core$String$left(3))
};
var $justinmimbs$date$Date$format = function (pattern) {
	return A2($justinmimbs$date$Date$formatWithLanguage, $justinmimbs$date$Date$language_en, pattern);
};
var $justinmimbs$date$Date$toIsoString = $justinmimbs$date$Date$format('yyyy-MM-dd');
var $elm$time$Time$toMinute = F2(
	function (zone, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2($elm$time$Time$toAdjustedMinutes, zone, time));
	});
var $elm$time$Time$toSecond = F2(
	function (_v0, time) {
		return A2(
			$elm$core$Basics$modBy,
			60,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				1000));
	});
var $author$project$Main$updateClock = F2(
	function (instant, model) {
		var zone = A2($elm$time$Time$customZone, model.bP, _List_Nil);
		var pad = function (number) {
			return A3(
				$elm$core$String$padLeft,
				2,
				'0',
				$elm$core$String$fromInt(number));
		};
		var now = $elm$time$Time$millisToPosix(
			$elm$time$Time$posixToMillis(instant) + model.bQ);
		return _Utils_update(
			model,
			{
				bV: A2(
					$elm$core$String$join,
					':',
					_List_fromArray(
						[
							pad(
							A2($elm$time$Time$toHour, zone, now)),
							pad(
							A2($elm$time$Time$toMinute, zone, now)),
							pad(
							A2($elm$time$Time$toSecond, zone, now))
						])),
				bH: $justinmimbs$date$Date$toIsoString(
					A2($justinmimbs$date$Date$fromPosix, zone, now))
			});
	});
var $author$project$Api$updateLead = F3(
	function (ctx, id, body) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'PATCH',
			'/api/leads/' + $elm$core$String$fromInt(id),
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(body)),
			$author$project$Types$leadDecoder);
	});
var $author$project$Api$updateUser = F3(
	function (ctx, id, body) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'PATCH',
			'/api/users/' + $elm$core$String$fromInt(id),
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(body)),
			$author$project$Api$ignoreDecoder);
	});
var $author$project$Api$uploadDocument = F5(
	function (ctx, path, file, decoder, toMsg) {
		return $elm$http$Http$request(
			{
				a6: $elm$http$Http$multipartBody(
					_List_fromArray(
						[
							A2($elm$http$Http$filePart, 'file', file)
						])),
				bc: A2($author$project$Api$expectJson, toMsg, decoder),
				bf: _List_fromArray(
					[
						A2($elm$http$Http$header, 'X-ECC-Contract', $author$project$Release$contract)
					]),
				bi: 'POST',
				bn: $elm$core$Maybe$Just(30000),
				bp: $elm$core$Maybe$Nothing,
				bq: _Utils_ap(ctx.ao, path)
			});
	});
var $author$project$Api$uploadClientDocument = F3(
	function (ctx, id, file) {
		return A4(
			$author$project$Api$uploadDocument,
			ctx,
			'/api/clients/' + ($elm$core$String$fromInt(id) + '/documents'),
			file,
			$author$project$Types$clientDetailDecoder);
	});
var $author$project$Api$uploadClientPhoto = F5(
	function (ctx, cid, expected, file, toMsg) {
		return $elm$http$Http$request(
			{
				a6: $elm$http$Http$multipartBody(
					_List_fromArray(
						[
							A2(
							$elm$http$Http$stringPart,
							'expectedDocumentId',
							$elm$core$String$fromInt(expected)),
							A2($elm$http$Http$filePart, 'file', file)
						])),
				bc: A2($author$project$Api$expectJson, toMsg, $elm$json$Json$Decode$value),
				bf: _List_fromArray(
					[
						A2($elm$http$Http$header, 'X-ECC-Contract', $author$project$Release$contract)
					]),
				bi: 'POST',
				bn: $elm$core$Maybe$Just(60000),
				bp: $elm$core$Maybe$Nothing,
				bq: ctx.ao + ('/api/clients/' + ($elm$core$String$fromInt(cid) + '/photo'))
			});
	});
var $author$project$Api$uploadLeadDocument = F3(
	function (ctx, id, file) {
		return A4(
			$author$project$Api$uploadDocument,
			ctx,
			'/api/leads/' + ($elm$core$String$fromInt(id) + '/documents'),
			file,
			$author$project$Types$leadDetailDecoder);
	});
var $author$project$Api$upsertCase = F3(
	function (ctx, clientId, body) {
		return A5(
			$author$project$Api$authedRequest,
			ctx,
			'POST',
			'/api/clients/' + ($elm$core$String$fromInt(clientId) + '/cases'),
			$elm$core$Maybe$Just(
				$elm$http$Http$jsonBody(body)),
			$author$project$Types$clientDetailDecoder);
	});
var $author$project$State$userFormOf = function (u) {
	return {
		J: u.J,
		x: u.x,
		ad: '',
		t: u.t,
		H: u.H,
		cE: $elm$core$Maybe$Just(u.bu)
	};
};
var $elm$core$Dict$values = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, valueList) {
				return A2($elm$core$List$cons, value, valueList);
			}),
		_List_Nil,
		dict);
};
var $author$project$Main$update = F2(
	function (msg, model) {
		if (msg.$ === 57) {
			var url = msg.a;
			return (_Utils_eq(url.r, model.bq.r) && (_Utils_eq(url.ag, model.bq.ag) && ($author$project$Main$hasDraftChanges(model) || (!_Utils_eq(url.be, model.bq.be))))) ? _Utils_Tuple2(
				_Utils_update(
					model,
					{bq: url}),
				$elm$core$Platform$Cmd$none) : ($author$project$Main$hasDraftChanges(model) ? _Utils_Tuple2(
				_Utils_update(
					model,
					{
						W: $elm$core$Maybe$Just(
							_Utils_Tuple2(
								'Discard your unsaved changes?',
								$author$project$State$DiscardChanges(
									$author$project$State$NavigateTo(
										$elm$url$Url$toString(url)))))
					}),
				A2(
					$elm$browser$Browser$Navigation$replaceUrl,
					model.v,
					$elm$url$Url$toString(model.bq))) : A2($author$project$Main$updateNormal, msg, model));
		} else {
			return A2($author$project$Main$updateNormal, msg, model);
		}
	});
var $author$project$Main$updateCore = F2(
	function (msg, model) {
		if (!msg.$) {
			var key = msg.a;
			var loaded = msg.b;
			return _Utils_eq(
				key,
				A2($author$project$Main$loadKeyFor, loaded, model)) ? A2($author$project$Main$update, loaded, model) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		} else {
			if ($author$project$Main$expiredSession(msg)) {
				var draft = $author$project$Main$captureSessionDraft(model);
				var cleared = $author$project$Main$clearDraftInputs(model);
				return _Utils_Tuple2(
					_Utils_update(
						cleared,
						{
							a5: _List_Nil,
							an: true,
							c_: $elm$core$Maybe$Nothing,
							c$: $elm$core$Maybe$Nothing,
							aQ: false,
							a7: '',
							bN: $elm$core$Maybe$Nothing,
							bO: '',
							aR: $elm$json$Json$Encode$null,
							aS: _List_Nil,
							bT: $elm$json$Json$Encode$null,
							c0: $elm$core$Dict$empty,
							bU: $elm$core$Dict$empty,
							R: $elm$core$Maybe$Nothing,
							z: false,
							A: false,
							B: $elm$core$Dict$empty,
							u: false,
							p: $elm$json$Json$Encode$null,
							dh: $elm$core$Dict$empty,
							bd: $elm$json$Json$Encode$null,
							dj: 0,
							dk: '',
							b1: _List_Nil,
							dl: $elm$core$Maybe$Nothing,
							b: false,
							as: _List_Nil,
							aY: model.aY + 1,
							w: 'Your session has expired. Please sign in again.',
							aE: (!_Utils_eq(draft, $elm$core$Maybe$Nothing)) ? 'Your unsaved text is held in this tab. Sign in to the same account to recover it. Re-select any attachments.' : '',
							a_: '',
							L: '',
							bm: _List_Nil,
							aG: false,
							bC: $elm$json$Json$Encode$null,
							cm: $elm$core$Maybe$Nothing,
							n: $elm$json$Json$Encode$null,
							aI: $elm$core$Dict$empty,
							ah: draft,
							aj: _List_Nil,
							dU: $elm$core$Maybe$Nothing,
							I: $elm$core$Maybe$Nothing,
							a4: model.a4 + 1,
							al: _List_Nil
						}),
					$author$project$Main$saveToken($elm$core$Maybe$Nothing));
			} else {
				return A2(
					$author$project$Main$updateHelp,
					msg,
					_Utils_update(
						model,
						{
							aY: model.aY + ($author$project$Main$startsLoad(msg) ? 1 : 0),
							a4: model.a4 + ($author$project$Main$startsUserLoad(msg) ? 1 : 0)
						}));
			}
		}
	});
var $author$project$Main$updateHelp = F2(
	function (msg, model) {
		var ctx = {ao: model.am, dU: model.dU};
		switch (msg.$) {
			case 1:
				var message = msg.a;
				var action = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							W: $elm$core$Maybe$Just(
								_Utils_Tuple2(message, action))
						}),
					$elm$core$Platform$Cmd$none);
			case 3:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{W: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 2:
				var _v4 = model.W;
				if (!_v4.$) {
					var _v5 = _v4.a;
					var action = _v5.b;
					return A2(
						$author$project$Main$update,
						action,
						_Utils_update(
							model,
							{W: $elm$core$Maybe$Nothing}));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 0:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 45:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a_: value}),
					$elm$core$Platform$Cmd$none);
			case 15:
				var result = msg.a;
				if (!result.$) {
					var value = result.a;
					var pref = A2(
						$elm$core$Dict$map,
						F2(
							function (key, v) {
								return A2(
									$elm$core$List$member,
									key,
									_List_fromArray(
										['assignments', 'deadlines', 'documents', 'escalations', 'emailEnabled'])) ? (((v === '1') || (v === 'true')) ? 'true' : 'false') : v;
							}),
						$author$project$Features$rowForm(
							A2(
								$elm$core$Result$withDefault,
								$elm$json$Json$Encode$null,
								A2(
									$elm$json$Json$Decode$decodeValue,
									A2($elm$json$Json$Decode$field, 'security', $elm$json$Json$Decode$value),
									value))));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								p: value,
								dh: (($author$project$Main$featureSection(model) === 'notifications') && (!model.b)) ? A2($elm$core$Dict$union, pref, model.dh) : (((model.ab !== '') && _Utils_eq(
									A2($elm$core$Dict$get, 'owner', model.dh),
									$elm$core$Maybe$Nothing)) ? A3($elm$core$Dict$insert, 'owner', model.ab, model.dh) : ((($author$project$Main$featureSection(model) === 'expenses') && (A2(
									$elm$core$Maybe$withDefault,
									'',
									A2($elm$core$Dict$get, 'submissionKey', model.dh)) === '')) ? A3(
									$elm$core$Dict$insert,
									'submissionKey',
									A2($author$project$Features$str, 'submissionKey', value),
									model.dh) : model.dh)),
								bm: A2(
									$elm$core$Result$withDefault,
									_List_Nil,
									A2(
										$elm$json$Json$Decode$decodeValue,
										A2(
											$elm$json$Json$Decode$field,
											'rows',
											$elm$json$Json$Decode$list($elm$json$Json$Decode$value)),
										value)),
								q: '',
								bB: false
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								q: $author$project$Main$httpError(err),
								bB: false
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 16:
				var section = msg.a;
				var own = (section === 'applications') ? A2(
					$elm$core$Maybe$withDefault,
					model.ab,
					A2(
						$elm$core$Maybe$map,
						function (detail) {
							return 'client:' + $elm$core$String$fromInt(detail.ap.bu);
						},
						model.c$)) : model.ab;
				var next = _Utils_update(
					model,
					{
						c_: $elm$core$Maybe$Nothing,
						u: false,
						b0: '',
						dg: $elm$core$Dict$empty,
						dh: A3(
							$elm$core$Dict$insert,
							'owner',
							own,
							$author$project$Features$defaults(section)),
						bd: $elm$json$Json$Encode$null,
						aq: '',
						ab: own,
						bg: section,
						dB: 0
					});
				return _Utils_Tuple2(
					next,
					$author$project$Main$reloadPanel(next));
			case 17:
				var own = msg.a;
				var next = _Utils_update(
					model,
					{
						u: false,
						b0: '',
						dh: A3(
							$elm$core$Dict$insert,
							'owner',
							own,
							$author$project$Features$defaults(model.bg)),
						bd: $elm$json$Json$Encode$null,
						aq: '',
						ab: own,
						dB: 0
					});
				return _Utils_Tuple2(
					next,
					$author$project$Main$reloadPanel(next));
			case 24:
				var file = msg.a;
				return (($elm$file$File$size(file) <= 0) || (_Utils_cmp(
					$elm$file$File$size(file),
					(25 * 1024) * 1024) > 0)) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{c_: $elm$core$Maybe$Nothing, b0: 'Choose a nonempty file up to 25 MB.'}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							c_: $elm$core$Maybe$Just(file),
							b: true
						}),
					$elm$core$Platform$Cmd$none);
			case 25:
				var rid = msg.a;
				var revision = msg.b;
				var _v7 = model.c_;
				if (!_v7.$) {
					var file = _v7.a;
					return model.u ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{
								u: true,
								b0: '',
								dh: A3(
									$elm$core$Dict$insert,
									'id',
									$elm$core$String$fromInt(rid),
									model.dh)
							}),
						A5(
							$author$project$Api$checklistUpload,
							ctx,
							rid,
							revision,
							file,
							A2($author$project$Main$acceptLoad, model, $author$project$State$FeatureDone)));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{b0: 'Choose a file to upload.'}),
						$elm$core$Platform$Cmd$none);
				}
			case 26:
				var result = msg.a;
				if (!result.$) {
					var current = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{bT: current}),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								b0: $author$project$Main$httpError(err)
							}),
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(err)));
				}
			case 28:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bT: $elm$json$Json$Encode$null}),
					$elm$core$Platform$Cmd$none);
			case 29:
				var key = msg.a;
				var latest = A2(
					$elm$core$Maybe$withDefault,
					'',
					A2(
						$elm$core$Dict$get,
						key,
						$author$project$Features$formValues(model.bT)));
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							c0: A3($elm$core$Dict$insert, key, latest, model.c0),
							dh: A3($elm$core$Dict$insert, key, latest, model.dh)
						}),
					$elm$core$Platform$Cmd$none);
			case 27:
				var uf = model.o;
				var revision = A2(
					$elm$core$Result$withDefault,
					0,
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2($elm$json$Json$Decode$field, 'revision', $elm$json$Json$Decode$int),
						model.bT));
				var ef = model.l;
				var cf = model.g;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							k: A2(
								$elm$core$Maybe$map,
								function (f) {
									return _Utils_update(
										f,
										{
											t: (model.c1 === 'cases') ? revision : f.t
										});
								},
								model.k),
							g: _Utils_update(
								cf,
								{
									t: (model.c1 === 'clients') ? revision : cf.t
								}),
							bT: $elm$json$Json$Encode$null,
							l: _Utils_update(
								ef,
								{
									t: (model.c1 === 'leads') ? revision : ef.t
								}),
							B: $author$project$Features$formValues(model.bT),
							b0: 'Comparison accepted. Review your form and save when ready.',
							dh: A3(
								$elm$core$Dict$insert,
								'expectedRevision',
								$elm$core$String$fromInt(revision),
								model.dh),
							n: model.bT,
							o: _Utils_update(
								uf,
								{
									t: (model.c1 === 'users') ? revision : uf.t
								})
						}),
					$elm$core$Platform$Cmd$none);
			case 30:
				var key = msg.a;
				var value = msg.b;
				var next = _Utils_update(
					model,
					{
						cP: A3($elm$core$Dict$insert, key, value, model.cP),
						bB: true,
						dB: 0
					});
				return _Utils_Tuple2(
					next,
					$author$project$Main$reloadPanel(next));
			case 31:
				var next = _Utils_update(
					model,
					{cP: $elm$core$Dict$empty, aq: '', bB: true, dB: 0});
				return _Utils_Tuple2(
					next,
					$author$project$Main$reloadPanel(next));
			case 32:
				var key = msg.a;
				var value = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aI: A3($elm$core$Dict$insert, key, value, model.aI)
						}),
					$elm$core$Platform$Cmd$none);
			case 34:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aI: A2(
								$elm$core$Result$withDefault,
								$elm$core$Dict$empty,
								A2(
									$elm$json$Json$Decode$decodeValue,
									$elm$json$Json$Decode$dict($elm$json$Json$Decode$string),
									value))
						}),
					$elm$core$Platform$Cmd$none);
			case 33:
				var action = msg.a;
				return (action === 'save-template') ? _Utils_Tuple2(
					model,
					$author$project$Main$saveReportLayout(
						A3($elm$json$Json$Encode$dict, $elm$core$Basics$identity, $elm$json$Json$Encode$string, model.aI))) : ((action === 'load-template') ? _Utils_Tuple2(
					model,
					$author$project$Main$requestReportLayout(0)) : ((model.bB || (model.q !== '')) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					model,
					$author$project$Main$reportOutput(
						A3(
							$author$project$Reports$payload,
							model,
							$author$project$Main$featureSection(model),
							action)))));
			case 35:
				var key = msg.a;
				var value = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							dg: A2($elm$core$Dict$remove, key, model.dg),
							dh: A3($elm$core$Dict$insert, key, value, model.dh),
							b: true
						}),
					$elm$core$Platform$Cmd$none);
			case 36:
				var query = msg.a;
				var next = _Utils_update(
					model,
					{aq: query, bB: true, dB: 0});
				return _Utils_Tuple2(
					next,
					$author$project$Main$reloadPanel(next));
			case 37:
				var row = msg.a;
				var next = _Utils_update(
					model,
					{
						bT: $elm$json$Json$Encode$null,
						B: $author$project$Features$formValues(row),
						u: false,
						b0: '',
						dg: $elm$core$Dict$empty,
						dh: A2(
							$elm$core$Dict$union,
							$author$project$Features$rowForm(row),
							A3(
								$elm$core$Dict$insert,
								'owner',
								model.ab,
								$author$project$Features$defaults(
									$author$project$Main$featureSection(model)))),
						bd: $elm$json$Json$Encode$null,
						dj: 0,
						dk: '',
						b1: _List_Nil,
						dl: $elm$core$Maybe$Nothing,
						b: false
					});
				return _Utils_Tuple2(
					next,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								$author$project$Main$focusFeatureForm(0),
								($author$project$Main$featureSection(model) === 'reconciliation') ? $author$project$Main$loadFinanceCandidates(next) : $elm$core$Platform$Cmd$none
							])));
			case 18:
				var file = msg.a;
				return (($elm$file$File$size(file) <= 0) || (_Utils_cmp(
					$elm$file$File$size(file),
					(10 * 1024) * 1024) > 0)) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{b0: 'Choose a nonempty PDF, PNG or JPEG up to 10 MB.', dl: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							dl: $elm$core$Maybe$Just(file)
						}),
					$elm$core$Platform$Cmd$none);
			case 19:
				var eid = msg.a;
				var revision = msg.b;
				var _v9 = model.dl;
				if (!_v9.$) {
					var file = _v9.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{u: true, b0: ''}),
						A5(
							$author$project$Api$financeAttachment,
							ctx,
							eid,
							revision,
							file,
							A2($author$project$Main$acceptLoad, model, $author$project$State$FeatureDone)));
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{b0: 'Choose a supporting file first.'}),
						$elm$core$Platform$Cmd$none);
				}
			case 20:
				var tag = msg.a;
				var result = msg.b;
				if (!_Utils_eq(
					tag,
					$author$project$Main$financeCandidateTag(model))) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (!result.$) {
						var value = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									b1: A2(
										$elm$core$Result$withDefault,
										_List_Nil,
										A2(
											$elm$json$Json$Decode$decodeValue,
											A2(
												$elm$json$Json$Decode$field,
												'rows',
												$elm$json$Json$Decode$list($elm$json$Json$Decode$value)),
											value))
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var err = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									b0: $author$project$Main$httpError(err)
								}),
							$elm$core$Platform$Cmd$none);
					}
				}
			case 21:
				var query = msg.a;
				var next = _Utils_update(
					model,
					{dj: 0, dk: query});
				return _Utils_Tuple2(
					next,
					$author$project$Main$loadFinanceCandidates(next));
			case 22:
				var direction = msg.a;
				var next = _Utils_update(
					model,
					{
						dj: A2($elm$core$Basics$max, 0, model.dj + (direction * 50))
					});
				return _Utils_Tuple2(
					next,
					$author$project$Main$loadFinanceCandidates(next));
			case 23:
				var value = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							dh: A3(
								$elm$core$Dict$insert,
								'matchLabel',
								A2($author$project$Features$str, 'label', value),
								A3(
									$elm$core$Dict$insert,
									'match',
									A2($author$project$Features$str, 'value', value),
									model.dh)),
							b: true
						}),
					$elm$core$Platform$Cmd$none);
			case 38:
				var action = msg.a;
				return A2(
					$author$project$Main$update,
					action,
					_Utils_update(
						model,
						{c_: $elm$core$Maybe$Nothing, bN: $elm$core$Maybe$Nothing, W: $elm$core$Maybe$Nothing, dl: $elm$core$Maybe$Nothing, b: false, G: '', M: $elm$core$Maybe$Nothing, ae: $elm$core$Maybe$Nothing, ah: $elm$core$Maybe$Nothing}));
			case 39:
				var task = msg.a;
				var next = _Utils_update(
					model,
					{
						A: true,
						u: true,
						b0: '',
						dg: $elm$core$Dict$empty,
						dh: $elm$core$Dict$fromList(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'id',
									$elm$core$String$fromInt(task.bu)),
									_Utils_Tuple2(
									'expectedRevision',
									$elm$core$String$fromInt(task.t)),
									_Utils_Tuple2('title', task.Z),
									_Utils_Tuple2(
									'description',
									A2($elm$core$Maybe$withDefault, '', task.aU)),
									_Utils_Tuple2(
									'dueDate',
									A2($elm$core$Maybe$withDefault, '', task.aC)),
									_Utils_Tuple2('priority', task.a$),
									_Utils_Tuple2('status', task.dR),
									_Utils_Tuple2(
									'assignee',
									A2(
										$elm$core$Maybe$withDefault,
										'',
										A2($elm$core$Maybe$map, $elm$core$String$fromInt, task.cR))),
									_Utils_Tuple2('recurrenceDays', '')
								])),
						bd: $elm$json$Json$Encode$null
					});
				return _Utils_Tuple2(
					next,
					A5(
						$author$project$Api$featureGet,
						ctx,
						'conflict/tasks/' + $elm$core$String$fromInt(task.bu),
						'',
						0,
						A2($author$project$Main$acceptLoad, next, $author$project$State$TaskEditorLoaded)));
			case 40:
				var result = msg.a;
				if (!result.$) {
					var row = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								B: $author$project$Features$formValues(row),
								u: false,
								dh: $author$project$Features$rowForm(row)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{A: false, u: false}),
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(err)));
				}
			case 41:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{A: false, b0: '', dg: $elm$core$Dict$empty, b: false}),
					$elm$core$Platform$Cmd$none);
			case 42:
				var next = _Utils_update(
					model,
					{
						bT: $elm$json$Json$Encode$null,
						u: false,
						b0: '',
						dg: $elm$core$Dict$empty,
						dh: A3(
							$elm$core$Dict$insert,
							'owner',
							model.ab,
							A3(
								$elm$core$Dict$insert,
								'submissionKey',
								A2($author$project$Features$str, 'submissionKey', model.p),
								$author$project$Features$defaults(
									$author$project$Main$featureSection(model)))),
						bd: $elm$json$Json$Encode$null,
						dj: 0,
						dk: '',
						b1: _List_Nil,
						dl: $elm$core$Maybe$Nothing,
						b: false
					});
				return _Utils_Tuple2(
					next,
					$author$project$Main$reloadCurrent(next));
			case 43:
				var action = msg.a;
				var errors = A4(
					$author$project$Validation$feature,
					$author$project$Main$featureSection(model),
					action,
					model.ab,
					model.dh);
				if (model.u) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if (!$elm$core$Dict$isEmpty(errors)) {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									b0: A2(
										$elm$core$Maybe$withDefault,
										'Check the highlighted fields before continuing.',
										$elm$core$List$head(
											$elm$core$Dict$values(errors))),
									dg: errors
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						if (A2($elm$core$String$startsWith, 'rescan-file:', action)) {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{u: true}),
								A3(
									$author$project$Api$rescanFinancialFile,
									ctx,
									A2($elm$core$String$dropLeft, 12, action),
									A2($author$project$Main$acceptLoad, model, $author$project$State$FeatureDone)));
						} else {
							if ((action === 'apply') && ($author$project$Main$featureSection(model) === 'search')) {
								var next = _Utils_update(
									model,
									{
										bd: $elm$json$Json$Encode$null,
										aq: '@view:' + A2(
											$elm$core$Maybe$withDefault,
											'',
											A2($elm$core$Dict$get, 'id', model.dh)),
										bB: true,
										dB: 0
									});
								return _Utils_Tuple2(
									next,
									$author$project$Main$reloadCurrent(next));
							} else {
								if (action === 'range') {
									var next = _Utils_update(
										model,
										{
											aq: ((A2(
												$elm$core$Maybe$withDefault,
												'',
												A2($elm$core$Dict$get, 'from', model.dh)) === '') && (A2(
												$elm$core$Maybe$withDefault,
												'',
												A2($elm$core$Dict$get, 'to', model.dh)) === '')) ? '' : (A2(
												$elm$core$Maybe$withDefault,
												'',
												A2($elm$core$Dict$get, 'from', model.dh)) + (',' + A2(
												$elm$core$Maybe$withDefault,
												'',
												A2($elm$core$Dict$get, 'to', model.dh)))),
											b: false,
											bB: true
										});
									return _Utils_Tuple2(
										next,
										$author$project$Main$reloadCurrent(next));
								} else {
									return _Utils_Tuple2(
										_Utils_update(
											model,
											{u: true, b0: ''}),
										A4(
											$author$project$Api$featurePost,
											ctx,
											(($author$project$Main$featureSection(model) === 'payment-history') ? 'payments' : $author$project$Main$featureSection(model)) + ('/' + action),
											$elm$json$Json$Encode$object(
												A2(
													$elm$core$List$map,
													$elm$core$Tuple$mapSecond($elm$json$Json$Encode$string),
													$elm$core$Dict$toList(
														((model.ab !== '') && (A2(
															$elm$core$Maybe$withDefault,
															'',
															A2($elm$core$Dict$get, 'owner', model.dh)) === '')) ? A3($elm$core$Dict$insert, 'owner', model.ab, model.dh) : model.dh))),
											A2($author$project$Main$acceptLoad, model, $author$project$State$FeatureDone)));
								}
							}
						}
					}
				}
			case 44:
				var result = msg.a;
				if (!result.$) {
					var value = result.a;
					var addRevision = F2(
						function (key, fields) {
							var _v13 = A2(
								$elm$json$Json$Decode$decodeValue,
								A2($elm$json$Json$Decode$field, key, $elm$json$Json$Decode$int),
								value);
							if (!_v13.$) {
								var n = _v13.a;
								return A3(
									$elm$core$Dict$insert,
									key,
									$elm$core$String$fromInt(n),
									fields);
							} else {
								return fields;
							}
						});
					var form = A2(
						$elm$core$List$member,
						$author$project$Main$featureSection(model),
						_List_fromArray(
							['merge', 'security', 'notifications', 'search'])) ? A3(
						$elm$core$List$foldl,
						addRevision,
						model.dh,
						_List_fromArray(
							['sourceRevision', 'targetRevision'])) : A3(
						$elm$core$Dict$insert,
						'owner',
						model.ab,
						$author$project$Features$defaults(
							$author$project$Main$featureSection(model)));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								f: $author$project$State$emptyAddTask,
								c_: $elm$core$Maybe$Nothing,
								A: false,
								u: false,
								b0: '',
								dg: $elm$core$Dict$empty,
								dh: A2(
									$elm$core$Dict$remove,
									'password',
									A2($elm$core$Dict$remove, 'code', form)),
								bd: value,
								dl: $elm$core$Maybe$Nothing,
								b: false,
								P: false
							}),
						$author$project$Main$reloadCurrent(model));
				} else {
					if ((result.a.$ === 3) && (result.a.a === 409)) {
						if (!A2(
							$elm$core$List$member,
							$author$project$Main$featureSection(model),
							_List_fromArray(
								['checklist-templates', 'applications', 'tasks', 'documents', 'reminders', 'appointments', 'invoices', 'notifications']))) {
							return _Utils_Tuple2(
								_Utils_update(
									model,
									{
										u: false,
										b0: A2(
											$elm$core$List$member,
											$author$project$Main$featureSection(model),
											_List_fromArray(
												['payments', 'expenses', 'payment-history', 'periods', 'reconciliation'])) ? 'This financial record changed or the entry was already submitted. Reload the list and select the current record before trying again. Your form has been kept.' : 'This action is unavailable in its current state. Refresh or preview the latest records. Email retries require an exhausted failure, no active send, and fewer than three manual retries spaced 15 minutes apart.'
									}),
								$elm$core$Platform$Cmd$none);
						} else {
							var rid = A2(
								$elm$core$Maybe$withDefault,
								0,
								A2(
									$elm$core$Maybe$andThen,
									$elm$core$String$toInt,
									A2(
										$elm$core$Dict$get,
										($author$project$Main$featureSection(model) === 'reminders') ? 'task' : 'id',
										model.dh)));
							return A5(
								$author$project$Main$beginConflict,
								_Utils_update(
									model,
									{u: false, b0: 'The item changed. Compare the current version below.'}),
								$author$project$Main$featureSection(model),
								rid,
								$author$project$Main$dictValue(model.B),
								$author$project$Main$dictValue(model.dh));
						}
					} else {
						var err = result.a;
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									u: false,
									b0: $author$project$Main$httpError(err)
								}),
							A2(
								$author$project$Main$toast,
								'error',
								$author$project$Main$httpError(err)));
					}
				}
			case 46:
				var token = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aG: true, cl: ''}),
					A4(
						$author$project$Api$portalPost,
						ctx,
						'exchange',
						$elm$json$Json$Encode$object(
							_List_fromArray(
								[
									_Utils_Tuple2(
									'token',
									$elm$json$Json$Encode$string(token))
								])),
						$author$project$State$PortalExchanged));
			case 47:
				var result = msg.a;
				if (!result.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aG: false, cl: ''}),
						A2($elm$browser$Browser$Navigation$replaceUrl, model.v, '/portal'));
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aG: false, cl: 'This sign-in link is invalid, expired, or already used. Ask your case officer for a new link.'}),
						A2($elm$browser$Browser$Navigation$replaceUrl, model.v, '/portal'));
				}
			case 48:
				var result = msg.a;
				if (!result.$) {
					var value = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aG: false, bC: value, cl: ''}),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aG: false,
								bC: $elm$json$Json$Encode$null,
								cl: (model.cl !== '') ? model.cl : 'Your client access has expired or been revoked. Ask your case officer for a new sign-in link.'
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 49:
				var file = msg.a;
				return (($elm$file$File$size(file) <= 0) || (_Utils_cmp(
					$elm$file$File$size(file),
					(25 * 1024) * 1024) > 0)) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{cl: 'Choose a nonempty file up to 25 MB.', cm: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							cl: '',
							cm: $elm$core$Maybe$Just(file),
							cn: ''
						}),
					$elm$core$Platform$Cmd$none);
			case 50:
				var rid = msg.a;
				var _v16 = model.cm;
				if (!_v16.$) {
					var file = _v16.a;
					return model.aG ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
						_Utils_update(
							model,
							{aG: true, cl: '', cn: ''}),
						A4(
							$author$project$Api$portalUpload,
							ctx,
							rid,
							file,
							A2($author$project$Main$acceptLoad, model, $author$project$State$PortalUploaded)));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 51:
				var result = msg.a;
				if (!result.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aG: false, cm: $elm$core$Maybe$Nothing, cn: 'File received. It will be scanned before your case officer reviews it.'}),
						A2(
							$author$project$Api$portalGet,
							ctx,
							A2($author$project$Main$acceptLoad, model, $author$project$State$PortalLoaded)));
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aG: false,
								cl: $author$project$Main$httpError(err)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 52:
				return model.aG ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{aG: true}),
					A2(
						$author$project$Api$portalGet,
						ctx,
						A2($author$project$Main$acceptLoad, model, $author$project$State$PortalLoaded)));
			case 53:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aG: true}),
					A4(
						$author$project$Api$portalPost,
						ctx,
						'logout',
						$elm$json$Json$Encode$object(_List_Nil),
						$author$project$State$PortalLogoutDone));
			case 54:
				var result = msg.a;
				if (!result.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aG: false, bC: $elm$json$Json$Encode$null, cl: 'Signed out. Ask your case officer for a new link when you need access again.', cm: $elm$core$Maybe$Nothing, cn: ''}),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aG: false,
								cl: 'Sign-out failed. Please try again. ' + $author$project$Main$httpError(err)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 4:
				var mode = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{w: '', cb: mode, aE: '', L: ''}),
					$elm$core$Platform$Cmd$none);
			case 5:
				return model.F ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : ((!A2($elm$core$String$contains, '@', model.aZ)) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{w: 'Enter your account email address.'}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{F: true, w: ''}),
					A3($author$project$Api$recover, ctx, model.aZ, $author$project$State$RecoveryDone)));
			case 6:
				if (model.F) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					if ($author$project$Validation$passwordError(model.L) !== '') {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{
									w: $author$project$Validation$passwordError(model.L)
								}),
							$elm$core$Platform$Cmd$none);
					} else {
						var resetToken = A2(
							$elm$core$Maybe$withDefault,
							'',
							$elm$url$Url$percentDecode(
								A2(
									$elm$core$String$dropLeft,
									6,
									A2($elm$core$Maybe$withDefault, '', model.bq.ag))));
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{F: true, w: ''}),
							A4($author$project$Api$resetPassword, ctx, resetToken, model.L, $author$project$State$ResetDone));
					}
				}
			case 7:
				var result = msg.a;
				if (!result.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{F: false, aE: 'If your account exists, you’ll receive an email with a link that expires in one hour.'}),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								F: false,
								w: $author$project$Main$httpError(err)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 8:
				var result = msg.a;
				if (!result.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{F: false, cb: 'login', aE: 'Password updated. Sign in with your new password.', L: ''}),
						A2($elm$browser$Browser$Navigation$replaceUrl, model.v, '/'));
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								F: false,
								w: $author$project$Main$httpError(err)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 9:
				var result = msg.a;
				var cleared = $author$project$Main$clearDraftInputs(model);
				if (!result.$) {
					return _Utils_Tuple2(
						_Utils_update(
							cleared,
							{a5: _List_Nil, an: true, c_: $elm$core$Maybe$Nothing, c$: $elm$core$Maybe$Nothing, aQ: false, a7: '', bN: $elm$core$Maybe$Nothing, bO: '', aR: $elm$json$Json$Encode$null, aS: _List_Nil, bT: $elm$json$Json$Encode$null, c0: $elm$core$Dict$empty, bU: $elm$core$Dict$empty, R: $elm$core$Maybe$Nothing, z: false, A: false, B: $elm$core$Dict$empty, u: false, p: $elm$json$Json$Encode$null, dh: $elm$core$Dict$empty, bd: $elm$json$Json$Encode$null, dj: 0, dk: '', b1: _List_Nil, dl: $elm$core$Maybe$Nothing, b: false, as: _List_Nil, a_: '', L: '', bm: _List_Nil, aG: false, bC: $elm$json$Json$Encode$null, cm: $elm$core$Maybe$Nothing, n: $elm$json$Json$Encode$null, aI: $elm$core$Dict$empty, ah: $elm$core$Maybe$Nothing, aj: _List_Nil, dU: $elm$core$Maybe$Nothing, I: $elm$core$Maybe$Nothing, al: _List_Nil}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Main$saveToken($elm$core$Maybe$Nothing),
									A2($elm$browser$Browser$Navigation$pushUrl, model.v, '/')
								])));
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(err)));
				}
			case 10:
				var step = msg.a;
				var next = _Utils_update(
					model,
					{
						bB: true,
						dB: A2($elm$core$Basics$max, 0, model.dB + (step * 50)),
						N: $elm$core$Set$empty
					});
				return _Utils_Tuple2(
					next,
					$author$project$Main$reloadPanel(next));
			case 11:
				var kind = msg.a;
				var query = msg.b;
				return (((kind === 'leads') && _Utils_eq(query, model.dC)) || ((kind === 'clients') && _Utils_eq(query, model.a8))) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{bB: true}),
					(kind === 'leads') ? A4(
						$author$project$Api$fetchFilteredLeads,
						ctx,
						model,
						0,
						A2($author$project$Main$acceptLoad, model, $author$project$State$LeadsLoaded)) : A4(
						$author$project$Api$fetchClientsPage,
						ctx,
						0,
						query,
						A2($author$project$Main$acceptLoad, model, $author$project$State$ClientsLoaded))) : _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 12:
				var result = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bm: A2($elm$core$Result$withDefault, _List_Nil, result),
							q: $author$project$Main$resultError(result),
							bB: false
						}),
					$elm$core$Platform$Cmd$none);
			case 13:
				var path = msg.a;
				return _Utils_Tuple2(
					model,
					A3($author$project$Api$operation, ctx, path, $author$project$State$OperationDone));
			case 14:
				var result = msg.a;
				if (!result.$) {
					return _Utils_Tuple2(
						model,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Saved successfully'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(err)));
				}
			case 55:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			case 56:
				var request = msg.a;
				if (!request.$) {
					var url = request.a;
					return (_Utils_eq(url.r, model.bq.r) && _Utils_eq(url.ag, model.bq.ag)) ? _Utils_Tuple2(
						model,
						A2(
							$elm$browser$Browser$Navigation$pushUrl,
							model.v,
							$elm$url$Url$toString(url))) : A2(
						$author$project$Main$update,
						$author$project$State$NavigateTo(
							$elm$url$Url$toString(url)),
						model);
				} else {
					var href = request.a;
					return _Utils_Tuple2(
						model,
						$elm$browser$Browser$Navigation$load(href));
				}
			case 57:
				var url = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							cP: $author$project$State$applicationFiltersForUrl(url),
							c_: $elm$core$Maybe$Nothing,
							c$: $elm$core$Maybe$Nothing,
							aQ: false,
							a7: '',
							bN: $elm$core$Maybe$Nothing,
							bO: '',
							aR: $elm$json$Json$Encode$null,
							bT: $elm$json$Json$Encode$null,
							R: $elm$core$Maybe$Nothing,
							A: false,
							B: $elm$core$Dict$empty,
							u: false,
							b0: '',
							dg: $elm$core$Dict$empty,
							dh: $author$project$Main$featureDefaultsForUrl(url),
							bd: $elm$json$Json$Encode$null,
							aq: '',
							b: false,
							ab: $author$project$Main$ownerForUrl(url),
							bl: false,
							bm: _List_Nil,
							q: '',
							bB: true,
							dB: 0,
							M: $elm$core$Maybe$Nothing,
							ae: $elm$core$Maybe$Nothing,
							N: $elm$core$Set$empty,
							bq: url
						}),
					function () {
						if (url.r === '/portal') {
							var _v24 = url.be;
							if (!_v24.$) {
								var fragment = _v24.a;
								return A2(
									$elm$core$Task$perform,
									$elm$core$Basics$always(
										$author$project$State$PortalExchange(
											A2($elm$core$String$dropLeft, 6, fragment))),
									$elm$core$Task$succeed(0));
							} else {
								return A2(
									$author$project$Api$portalGet,
									ctx,
									A2(
										$author$project$Main$acceptLoad,
										_Utils_update(
											model,
											{aq: '', dB: 0, bq: url}),
										$author$project$State$PortalLoaded));
							}
						} else {
							if (_Utils_eq(model.I, $elm$core$Maybe$Nothing)) {
								return $elm$core$Platform$Cmd$none;
							} else {
								return A2(
									$author$project$Main$routeCmd,
									_Utils_update(
										model,
										{
											cP: $author$project$State$applicationFiltersForUrl(url),
											aq: '',
											dB: 0,
											bq: url
										}),
									$author$project$State$routeOf(url));
							}
						}
					}());
			case 58:
				var t = msg.a;
				return _Utils_eq(t, $elm$core$Maybe$Nothing) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{an: true}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{dU: t}),
					A2(
						$author$project$Api$me,
						{ao: model.am, dU: t},
						$author$project$State$MeDone));
			case 59:
				var flag = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aB: flag}),
					$elm$core$Platform$Cmd$none);
			case 60:
				var newFlag = !model.aB;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aB: newFlag}),
					$author$project$Main$saveDark(newFlag));
			case 166:
				var iso = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bH: iso}),
					$elm$core$Platform$Cmd$none);
			case 167:
				var instant = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$updateClock, instant, model),
					$elm$core$Platform$Cmd$none);
			case 168:
				var instant = msg.a;
				return _Utils_Tuple2(
					A2($author$project$Main$updateClock, instant, model),
					A2($author$project$Api$clock, ctx, $author$project$State$ClockLoaded));
			case 169:
				return _Utils_Tuple2(
					model,
					$elm$core$Platform$Cmd$batch(
						_List_fromArray(
							[
								A2($elm$core$Task$perform, $author$project$State$ClockTick, $elm$time$Time$now),
								A2($author$project$Api$clock, ctx, $author$project$State$ClockLoaded)
							])));
			case 170:
				var result = msg.a;
				var _v25 = A2(
					$elm$core$Result$andThen,
					A2(
						$elm$core$Basics$composeR,
						$elm$json$Json$Decode$decodeValue(
							A4(
								$elm$json$Json$Decode$map3,
								F3(
									function (millis, offset, zone) {
										return _Utils_Tuple3(millis, offset, zone);
									}),
								A2($elm$json$Json$Decode$field, 'unixMillis', $elm$json$Json$Decode$int),
								A2($elm$json$Json$Decode$field, 'offsetMinutes', $elm$json$Json$Decode$int),
								A2($elm$json$Json$Decode$field, 'timezone', $elm$json$Json$Decode$string))),
						$elm$core$Result$mapError(
							$elm$core$Basics$always($elm$http$Http$NetworkError))),
					result);
				if (!_v25.$) {
					var _v26 = _v25.a;
					var millis = _v26.a;
					var offset = _v26.b;
					var zone = _v26.c;
					return ((_Utils_cmp(offset, -720) > -1) && (offset <= 840)) ? _Utils_Tuple2(
						model,
						A2(
							$elm$core$Task$perform,
							A3($author$project$State$ClockAligned, millis, offset, zone),
							$elm$time$Time$now)) : _Utils_Tuple2(
						_Utils_update(
							model,
							{a9: false}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a9: false}),
						$elm$core$Platform$Cmd$none);
				}
			case 171:
				var millis = msg.a;
				var offset = msg.b;
				var zone = msg.c;
				var received = msg.d;
				var synced = _Utils_update(
					model,
					{
						bP: offset,
						bQ: millis - $elm$time$Time$posixToMillis(received),
						a9: true,
						bR: zone
					});
				return _Utils_Tuple2(
					A2($author$project$Main$updateClock, received, synced),
					$elm$core$Platform$Cmd$none);
			case 61:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aZ: v, w: ''}),
					$elm$core$Platform$Cmd$none);
			case 62:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{w: '', L: v}),
					$elm$core$Platform$Cmd$none);
			case 63:
				return model.F ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : ((($elm$core$String$trim(model.aZ) === '') || (model.L === '')) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{w: 'Enter your email address and password.'}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{F: true, w: ''}),
					A5($author$project$Api$login, ctx, model.aZ, model.L, model.a_, $author$project$State$LoginDone)));
			case 64:
				if (!msg.a.$) {
					var resp = msg.a.a;
					var authenticated = A2(
						$author$project$Main$restoreSessionDraft,
						resp.I.bu,
						_Utils_update(
							model,
							{
								an: true,
								F: false,
								w: '',
								aE: '',
								a_: '',
								L: '',
								dU: $elm$core$Maybe$Just(resp.dU),
								I: $elm$core$Maybe$Just(resp.I)
							}));
					return _Utils_Tuple2(
						authenticated,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									$author$project$Main$saveToken(
									$elm$core$Maybe$Just(resp.dU)),
									A2($author$project$Main$toast, 'success', 'Welcome back, ' + resp.I.x),
									resp.I.bj ? A2($elm$browser$Browser$Navigation$pushUrl, model.v, '/work/security') : A2(
									$author$project$Main$routeCmd,
									authenticated,
									$author$project$State$routeOf(model.bq))
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								F: false,
								w: _Utils_eq(
									e,
									$elm$http$Http$BadStatus(401)) ? 'Check your email, password, and authenticator or recovery code.' : $author$project$Main$httpError(e)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 65:
				if (!msg.a.$) {
					var u = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								an: true,
								I: $elm$core$Maybe$Just(u)
							}),
						u.bj ? A2($elm$browser$Browser$Navigation$pushUrl, model.v, '/work/security') : A2(
							$author$project$Main$routeCmd,
							model,
							$author$project$State$routeOf(model.bq)));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{an: true, dU: $elm$core$Maybe$Nothing, I: $elm$core$Maybe$Nothing}),
						$author$project$Main$saveToken($elm$core$Maybe$Nothing));
				}
			case 66:
				return _Utils_Tuple2(
					model,
					A2($author$project$Api$logout, ctx, $author$project$State$LogoutDone));
			case 67:
				var result = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							as: A2($elm$core$Result$withDefault, model.as, result),
							q: $author$project$Main$resultError(result),
							bB: false
						}),
					$elm$core$Platform$Cmd$none);
			case 68:
				var result = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							q: $author$project$Main$resultError(result),
							bB: false,
							al: A2($elm$core$Result$withDefault, model.al, result)
						}),
					$elm$core$Platform$Cmd$none);
			case 69:
				var result = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							q: $author$project$Main$resultError(result),
							bB: false,
							aj: A2($elm$core$Result$withDefault, model.aj, result)
						}),
					$elm$core$Platform$Cmd$none);
			case 70:
				var result = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							aS: A2($elm$core$Result$withDefault, model.aS, result),
							q: $author$project$Main$resultError(result),
							bB: false
						}),
					$elm$core$Platform$Cmd$none);
			case 71:
				var result = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							c$: $author$project$Main$justOf(result),
							q: $author$project$Main$resultError(result),
							bB: false
						}),
					function () {
						if (!result.$) {
							var detail = result.a;
							return $elm$core$Platform$Cmd$batch(
								_List_fromArray(
									[
										A3(
										$author$project$Api$clientProfile,
										ctx,
										detail.ap.bu,
										A2($author$project$Main$acceptLoad, model, $author$project$State$ClientProfileLoaded)),
										A5(
										$author$project$Api$featureGet,
										ctx,
										A2($author$project$Main$inlinePath, model, detail.ap.bu),
										model.aq,
										model.dB,
										A2($author$project$Main$acceptLoad, model, $author$project$State$FeatureLoaded)),
										$elm$core$List$isEmpty(model.al) ? A2(
										$author$project$Api$fetchUsers,
										ctx,
										A2($author$project$Main$acceptLoad, model, $author$project$State$UsersLoaded)) : $elm$core$Platform$Cmd$none
									]));
						} else {
							return $elm$core$Platform$Cmd$none;
						}
					}());
			case 72:
				var result = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							R: $author$project$Main$justOf(result),
							q: $author$project$Main$resultError(result),
							bB: false
						}),
					$elm$core$Platform$Cmd$none);
			case 73:
				var result = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							q: $author$project$Main$resultError(result),
							bB: false,
							dQ: $author$project$Main$justOf(result)
						}),
					$elm$core$Platform$Cmd$none);
			case 74:
				var result = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a5: A2($elm$core$Result$withDefault, model.a5, result)
						}),
					$elm$core$Platform$Cmd$none);
			case 75:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{y: $author$project$State$emptyAddLead, Y: true}),
					$elm$core$Platform$Cmd$none);
			case 76:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b: false, Y: false}),
					$elm$core$Platform$Cmd$none);
			case 77:
				var f = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							y: f(model.y),
							dg: $elm$core$Dict$empty,
							b: true
						}),
					$elm$core$Platform$Cmd$none);
			case 78:
				return _Utils_Tuple2(
					model,
					A3(
						$author$project$Api$createLead,
						ctx,
						$author$project$Types$encodeNewLead(model.y),
						$author$project$State$AddLeadDone));
			case 79:
				if (!msg.a.$) {
					var lead = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								b: false,
								as: A2($elm$core$List$cons, lead, model.as),
								Y: false
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Lead ' + (lead.ce + ' created')),
									A2($author$project$Main$navigateTo, model.v, '/leads')
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 80:
				var _v28 = model.R;
				if (_v28.$ === 1) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var d = _v28.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								l: $author$project$State$editLeadOf(d.bh),
								S: !model.S,
								n: $author$project$Types$encodeUpdateLead(
									$author$project$State$editLeadOf(d.bh))
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 81:
				var f = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							l: f(model.l),
							dg: $elm$core$Dict$empty,
							b: true
						}),
					$elm$core$Platform$Cmd$none);
			case 82:
				var _v29 = model.R;
				if (_v29.$ === 1) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var d = _v29.a;
					return _Utils_Tuple2(
						model,
						A4(
							$author$project$Api$updateLead,
							ctx,
							d.bh.bu,
							$author$project$Types$encodeUpdateLead(model.l),
							$author$project$State$EditLeadDone));
				}
			case 83:
				if (!msg.a.$) {
					var lead = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{S: false, b: false}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Lead updated'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					if ((msg.a.a.$ === 3) && (msg.a.a.a === 409)) {
						return A5(
							$author$project$Main$beginConflict,
							model,
							'leads',
							A2(
								$elm$core$Maybe$withDefault,
								0,
								A2(
									$elm$core$Maybe$map,
									A2(
										$elm$core$Basics$composeR,
										function ($) {
											return $.bh;
										},
										function ($) {
											return $.bu;
										}),
									model.R)),
							model.n,
							$author$project$Types$encodeUpdateLead(model.l));
					} else {
						var e = msg.a.a;
						return _Utils_Tuple2(
							model,
							A2(
								$author$project$Main$toast,
								'error',
								$author$project$Main$httpError(e)));
					}
				}
			case 84:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A3($author$project$Api$deleteLead, ctx, id, $author$project$State$DeleteLeadDone));
			case 85:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						model,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Lead deleted'),
									A2($author$project$Main$navigateTo, model.v, '/leads')
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 86:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A3($author$project$Api$advanceLead, ctx, id, $author$project$State$AdvanceDone));
			case 87:
				if (!msg.a.$) {
					var lead = msg.a.a;
					return _Utils_Tuple2(
						model,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Advanced to ' + lead.dO),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 88:
				var result = msg.a;
				if (!result.$) {
					var value = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a7: '', aR: value}),
						$elm$core$Platform$Cmd$none);
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								a7: $author$project$Main$httpError(err)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 89:
				var file = msg.a;
				return (($elm$file$File$size(file) <= 0) || ((_Utils_cmp(
					$elm$file$File$size(file),
					(2 * 1024) * 1024) > 0) || (!A2(
					$elm$core$List$member,
					$elm$file$File$mime(file),
					_List_fromArray(
						['image/jpeg', 'image/png']))))) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{a7: 'Choose a PNG or JPEG up to 2 MB and 4096 × 4096 pixels.', bN: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a7: '',
							bN: $elm$core$Maybe$Just(file),
							b: true
						}),
					$elm$core$Platform$Cmd$none);
			case 90:
				var cid = msg.a;
				var _v31 = model.bN;
				if (_v31.$ === 1) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{a7: 'Choose a client photo first.'}),
						$elm$core$Platform$Cmd$none);
				} else {
					var file = _v31.a;
					var expected = A2(
						$elm$core$Result$withDefault,
						0,
						A2(
							$elm$json$Json$Decode$decodeValue,
							A2(
								$elm$json$Json$Decode$at,
								_List_fromArray(
									['photo', 'documentId']),
								$elm$json$Json$Decode$int),
							model.aR));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aQ: true, a7: '', bO: ''}),
						A5(
							$author$project$Api$uploadClientPhoto,
							ctx,
							cid,
							expected,
							file,
							A2(
								$author$project$Main$acceptLoad,
								model,
								$author$project$State$ClientPhotoDone(cid))));
				}
			case 91:
				var cid = msg.a;
				var result = msg.b;
				if (!result.$) {
					var value = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aQ: false,
								bN: $elm$core$Maybe$Nothing,
								bO: A2($author$project$Features$str, 'message', value),
								b: false
							}),
						A3(
							$author$project$Api$clientProfile,
							ctx,
							cid,
							A2($author$project$Main$acceptLoad, model, $author$project$State$ClientProfileLoaded)));
				} else {
					var err = result.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								aQ: false,
								a7: _Utils_eq(
									err,
									$elm$http$Http$BadStatus(400)) ? 'Use a valid PNG or JPEG up to 2 MB and 4096 × 4096 pixels.' : $author$project$Main$httpError(err)
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 92:
				var cid = msg.a;
				return _Utils_Tuple2(
					model,
					A3(
						$author$project$Api$clientProfile,
						ctx,
						cid,
						A2($author$project$Main$acceptLoad, model, $author$project$State$ClientProfileLoaded)));
			case 93:
				var cid = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{aQ: true, a7: ''}),
					A3(
						$author$project$Api$retryClientPhoto,
						ctx,
						cid,
						A2(
							$author$project$Main$acceptLoad,
							model,
							$author$project$State$ClientPhotoDone(cid))));
			case 94:
				var id = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{u: true}),
					A3(
						$author$project$Api$convertLead,
						ctx,
						id,
						A2($author$project$Main$acceptLoad, model, $author$project$State$ConvertDone)));
			case 95:
				if (!msg.a.$) {
					var client = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{u: false, b: false}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Converted to client ' + client.ce),
									A2(
									$author$project$Main$navigateTo,
									model.v,
									'/clients/' + $elm$core$String$fromInt(client.bu))
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{u: false}),
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 96:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b: true, G: v}),
					$elm$core$Platform$Cmd$none);
			case 97:
				var id = msg.a;
				return ($elm$core$String$trim(model.G) === '') ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					model,
					A4($author$project$Api$addNote, ctx, id, model.G, $author$project$State$NoteDone));
			case 98:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{b: false, G: ''}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Note added'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 99:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dB: 0, dC: v}),
					A2(
						$elm$core$Task$perform,
						function (_v33) {
							return A2($author$project$State$SearchReady, 'leads', v);
						},
						$elm$core$Process$sleep(300)));
			case 100:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{df: v, bB: true, dB: 0}),
					A4(
						$author$project$Api$fetchFilteredLeads,
						ctx,
						_Utils_update(
							model,
							{df: v}),
						0,
						A2(
							$author$project$Main$acceptLoad,
							_Utils_update(
								model,
								{df: v, dB: 0}),
							$author$project$State$LeadsLoaded)));
			case 101:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dd: v, bB: true, dB: 0}),
					A4(
						$author$project$Api$fetchFilteredLeads,
						ctx,
						_Utils_update(
							model,
							{dd: v}),
						0,
						A2(
							$author$project$Main$acceptLoad,
							_Utils_update(
								model,
								{dd: v, dB: 0}),
							$author$project$State$LeadsLoaded)));
			case 102:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{de: v, bB: true, dB: 0}),
					A4(
						$author$project$Api$fetchFilteredLeads,
						ctx,
						_Utils_update(
							model,
							{de: v}),
						0,
						A2(
							$author$project$Main$acceptLoad,
							_Utils_update(
								model,
								{de: v, dB: 0}),
							$author$project$State$LeadsLoaded)));
			case 103:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bB: true, dB: 0, dM: v}),
					A4(
						$author$project$Api$fetchFilteredLeads,
						ctx,
						_Utils_update(
							model,
							{dM: v}),
						0,
						A2(
							$author$project$Main$acceptLoad,
							_Utils_update(
								model,
								{dB: 0, dM: v}),
							$author$project$State$LeadsLoaded)));
			case 104:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dB: 0, dL: !model.dL}),
					A4(
						$author$project$Api$fetchFilteredLeads,
						ctx,
						_Utils_update(
							model,
							{dL: !model.dL}),
						0,
						A2(
							$author$project$Main$acceptLoad,
							_Utils_update(
								model,
								{dB: 0, dL: !model.dL}),
							$author$project$State$LeadsLoaded)));
			case 105:
				var next = _Utils_update(
					model,
					{dd: 'All', de: 'All', df: 'All', bB: true, dB: 0, dC: '', N: $elm$core$Set$empty});
				return _Utils_Tuple2(
					next,
					A4(
						$author$project$Api$fetchFilteredLeads,
						ctx,
						next,
						0,
						A2($author$project$Main$acceptLoad, next, $author$project$State$LeadsLoaded)));
			case 106:
				var id = msg.a;
				var flag = msg.b;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							N: flag ? A2($elm$core$Set$insert, id, model.N) : A2($elm$core$Set$remove, id, model.N)
						}),
					$elm$core$Platform$Cmd$none);
			case 107:
				var flag = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							N: flag ? $elm$core$Set$fromList(
								A2(
									$elm$core$List$map,
									function ($) {
										return $.bu;
									},
									$author$project$Views$filteredLeads(model))) : $elm$core$Set$empty
						}),
					$elm$core$Platform$Cmd$none);
			case 108:
				return _Utils_Tuple2(
					model,
					A3(
						$author$project$Api$bulkLeads,
						ctx,
						{
							bs: $elm$core$Maybe$Nothing,
							bv: $elm$core$Set$toList(model.N),
							bz: 'advance'
						},
						$author$project$State$BulkDone));
			case 109:
				var userIdStr = msg.a;
				var _v34 = $elm$core$String$toInt(userIdStr);
				if (_v34.$ === 1) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var uid = _v34.a;
					return _Utils_Tuple2(
						model,
						A3(
							$author$project$Api$bulkLeads,
							ctx,
							{
								bs: $elm$core$Maybe$Just(uid),
								bv: $elm$core$Set$toList(model.N),
								bz: 'assign'
							},
							$author$project$State$BulkDone));
				}
			case 110:
				return _Utils_Tuple2(
					model,
					A3(
						$author$project$Api$bulkLeads,
						ctx,
						{
							bs: $elm$core$Maybe$Nothing,
							bv: $elm$core$Set$toList(model.N),
							bz: 'delete'
						},
						$author$project$State$BulkDone));
			case 111:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{N: $elm$core$Set$empty}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Bulk action applied'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 112:
				var id = msg.a;
				var status = msg.b;
				var allTasks = _Utils_ap(
					model.aj,
					_Utils_ap(
						A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.aj;
								},
								model.R)),
						A2(
							$elm$core$Maybe$withDefault,
							_List_Nil,
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.aj;
								},
								model.c$))));
				var revision = A2(
					$elm$core$Maybe$withDefault,
					0,
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.t;
						},
						$elm$core$List$head(
							A2(
								$elm$core$List$filter,
								function (task) {
									return _Utils_eq(task.bu, id);
								},
								allTasks))));
				return _Utils_Tuple2(
					model,
					A5($author$project$Api$setTaskStatus, ctx, id, revision, status, $author$project$State$TaskStatusDone));
			case 113:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						model,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Task updated'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 114:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A3($author$project$Api$deleteTask, ctx, id, $author$project$State$TaskDeleteDone));
			case 115:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						model,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Task deleted'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 116:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{f: $author$project$State$emptyAddTask, b0: '', dg: $elm$core$Dict$empty, P: !model.P}),
					$elm$core$Platform$Cmd$none);
			case 117:
				var f = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							f: f(model.f),
							dg: $elm$core$Dict$empty,
							b: true
						}),
					$elm$core$Platform$Cmd$none);
			case 118:
				var leadId = msg.a;
				return A3($author$project$Main$submitTask, model, ctx, leadId);
			case 119:
				var cid = msg.a;
				return _Utils_Tuple2(
					model,
					A3(
						$author$project$Api$createTask,
						ctx,
						A2($author$project$Main$clientTaskBody, model, cid),
						$author$project$State$AddTaskDone));
			case 120:
				var form = model.f;
				var own = A2($elm$core$String$startsWith, 'client:', form.aW) ? form.aW : ((form.aW === '') ? '' : ('lead:' + form.aW));
				var values = $elm$core$Dict$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2('owner', own),
							_Utils_Tuple2('title', form.Z),
							_Utils_Tuple2('description', form.aU),
							_Utils_Tuple2('dueDate', form.aC),
							_Utils_Tuple2('priority', form.a$),
							_Utils_Tuple2('assignee', form.cS),
							_Utils_Tuple2('recurrenceDays', form.dF),
							_Utils_Tuple2('status', 'Pending')
						]));
				var errors = A4($author$project$Validation$feature, 'tasks', 'create', '', values);
				return model.u ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : ((!$elm$core$Dict$isEmpty(errors)) ? _Utils_Tuple2(
					_Utils_update(
						model,
						{b0: 'Check the highlighted task fields.', dg: errors}),
					$elm$core$Platform$Cmd$none) : _Utils_Tuple2(
					_Utils_update(
						model,
						{u: true, b0: '', dg: $elm$core$Dict$empty}),
					A4(
						$author$project$Api$featurePost,
						ctx,
						'tasks/create',
						$author$project$Main$dictValue(values),
						A2($author$project$Main$acceptLoad, model, $author$project$State$FeatureDone))));
			case 121:
				if (!msg.a.$) {
					var task = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{f: $author$project$State$emptyAddTask, b: false, P: false}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Task created'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 122:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a8: v, dB: 0}),
					A2(
						$elm$core$Task$perform,
						function (_v35) {
							return A2($author$project$State$SearchReady, 'clients', v);
						},
						$elm$core$Process$sleep(300)));
			case 123:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{Q: $elm$core$Maybe$Nothing, g: $author$project$State$emptyClientForm, O: true}),
					$elm$core$Platform$Cmd$none);
			case 172:
				var _v36 = model.c$;
				if (_v36.$ === 1) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var cd = _v36.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								Q: $elm$core$Maybe$Just(cd.ap.bu),
								g: $author$project$State$clientFormOf(cd.ap),
								n: $author$project$Main$clientPayload(
									_Utils_update(
										model,
										{
											g: $author$project$State$clientFormOf(cd.ap)
										})),
								O: true
							}),
						$elm$core$Platform$Cmd$none);
				}
			case 124:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b: false, O: false}),
					$elm$core$Platform$Cmd$none);
			case 125:
				var f = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							g: f(model.g),
							dg: $elm$core$Dict$empty,
							b: true
						}),
					$elm$core$Platform$Cmd$none);
			case 126:
				var _v37 = model.Q;
				if (!_v37.$) {
					var cid = _v37.a;
					return _Utils_Tuple2(
						model,
						A4(
							$author$project$Api$updateClient,
							ctx,
							cid,
							$author$project$Main$clientPayload(model),
							$author$project$State$ClientUpdated));
				} else {
					return _Utils_Tuple2(
						model,
						A3(
							$author$project$Api$createClient,
							ctx,
							$author$project$Main$clientPayload(model),
							$author$project$State$ClientFormSaved));
				}
			case 128:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{b: false, O: false}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Client saved'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					if ((msg.a.a.$ === 3) && (msg.a.a.a === 409)) {
						return A5(
							$author$project$Main$beginConflict,
							model,
							'clients',
							A2($elm$core$Maybe$withDefault, 0, model.Q),
							model.n,
							$author$project$Main$clientPayload(model));
					} else {
						var e = msg.a.a;
						return _Utils_Tuple2(
							model,
							A2(
								$author$project$Main$toast,
								'error',
								$author$project$Main$httpError(e)));
					}
				}
			case 127:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{b: false, O: false}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Client saved'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 129:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A3($author$project$Api$deleteClient, ctx, id, $author$project$State$DeleteClientDone));
			case 130:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						model,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Client deleted'),
									A2($author$project$Main$navigateTo, model.v, '/clients')
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 131:
				var mcase = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							k: $elm$core$Maybe$Just(
								A2(
									$elm$core$Maybe$withDefault,
									$author$project$State$emptyCaseForm,
									A2($elm$core$Maybe$map, $author$project$State$caseFormOf, mcase))),
							n: A2(
								$elm$core$Maybe$withDefault,
								$elm$json$Json$Encode$null,
								A2(
									$elm$core$Maybe$map,
									A2($elm$core$Basics$composeR, $author$project$State$caseFormOf, $author$project$Main$casePayload),
									mcase))
						}),
					$elm$core$Platform$Cmd$none);
			case 132:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{k: $elm$core$Maybe$Nothing, b: false}),
					$elm$core$Platform$Cmd$none);
			case 133:
				var f = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							k: A2($elm$core$Maybe$map, f, model.k),
							dg: $elm$core$Dict$empty,
							b: true
						}),
					$elm$core$Platform$Cmd$none);
			case 134:
				var clientId = msg.a;
				var _v38 = model.k;
				if (_v38.$ === 1) {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				} else {
					var cf = _v38.a;
					return _Utils_Tuple2(
						model,
						A4(
							$author$project$Api$upsertCase,
							ctx,
							clientId,
							A2(
								$author$project$Main$withRevision,
								cf.t,
								$author$project$Types$encodeCaseInput(
									{aP: cf.aP, cX: cf.cX, aT: cf.aT, bb: cf.bb, dO: cf.dO})),
							$author$project$State$CaseFormSaved));
				}
			case 135:
				if (!msg.a.$) {
					var cd = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								k: $elm$core$Maybe$Nothing,
								c$: $elm$core$Maybe$Just(cd),
								b: false
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Case saved'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					if ((msg.a.a.$ === 3) && (msg.a.a.a === 409)) {
						return A5(
							$author$project$Main$beginConflict,
							model,
							'cases',
							A2(
								$elm$core$Maybe$withDefault,
								0,
								A2(
									$elm$core$Maybe$andThen,
									function ($) {
										return $.aP;
									},
									model.k)),
							model.n,
							A2(
								$elm$core$Maybe$withDefault,
								$elm$json$Json$Encode$null,
								A2($elm$core$Maybe$map, $author$project$Main$casePayload, model.k)));
					} else {
						var e = msg.a.a;
						return _Utils_Tuple2(
							model,
							A2(
								$author$project$Main$toast,
								'error',
								$author$project$Main$httpError(e)));
					}
				}
			case 136:
				var caseId = msg.a;
				return _Utils_Tuple2(
					model,
					A3($author$project$Api$deleteCase, ctx, caseId, $author$project$State$DeleteCaseDone));
			case 137:
				if (!msg.a.$) {
					var next = _Utils_update(
						model,
						{
							dh: A3(
								$elm$core$Dict$insert,
								'owner',
								$author$project$Main$ownerForUrl(model.bq),
								$author$project$Features$defaults(model.bg)),
							ab: $author$project$Main$ownerForUrl(model.bq)
						});
					return _Utils_Tuple2(
						next,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Case deleted'),
									$author$project$Main$reloadCurrent(next)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 138:
				var file = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							M: $elm$core$Maybe$Just(file)
						}),
					$elm$core$Platform$Cmd$none);
			case 139:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{M: $elm$core$Maybe$Nothing}),
					$elm$core$Platform$Cmd$none);
			case 140:
				var id = msg.a;
				var _v39 = model.M;
				if (_v39.$ === 1) {
					return _Utils_Tuple2(
						model,
						A2($author$project$Main$toast, 'error', 'Choose a file first'));
				} else {
					var file = _v39.a;
					return model.z ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : ((($elm$file$File$size(file) <= 0) || (_Utils_cmp(
						$elm$file$File$size(file),
						(25 * 1024) * 1024) > 0)) ? _Utils_Tuple2(
						model,
						A2($author$project$Main$toast, 'error', 'Choose a nonempty file up to 25 MB')) : _Utils_Tuple2(
						_Utils_update(
							model,
							{z: true}),
						A4($author$project$Api$uploadLeadDocument, ctx, id, file, $author$project$State$LeadDocUploaded)));
				}
			case 141:
				var id = msg.a;
				var _v40 = model.M;
				if (_v40.$ === 1) {
					return _Utils_Tuple2(
						model,
						A2($author$project$Main$toast, 'error', 'Choose a file first'));
				} else {
					var file = _v40.a;
					return model.z ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : ((($elm$file$File$size(file) <= 0) || (_Utils_cmp(
						$elm$file$File$size(file),
						(25 * 1024) * 1024) > 0)) ? _Utils_Tuple2(
						model,
						A2($author$project$Main$toast, 'error', 'Choose a nonempty file up to 25 MB')) : _Utils_Tuple2(
						_Utils_update(
							model,
							{z: true}),
						A4($author$project$Api$uploadClientDocument, ctx, id, file, $author$project$State$ClientDocUploaded)));
				}
			case 142:
				if (!msg.a.$) {
					var detail = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								R: $elm$core$Maybe$Just(detail),
								z: false,
								M: $elm$core$Maybe$Nothing
							}),
						A2($author$project$Main$toast, 'success', 'File uploaded. Scanning must finish before download or approval.'));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{z: false}),
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 143:
				if (!msg.a.$) {
					var cd = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								c$: $elm$core$Maybe$Just(cd),
								z: false,
								M: $elm$core$Maybe$Nothing
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Document uploaded for malware scanning'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{z: false}),
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 144:
				var id = msg.a;
				return _Utils_Tuple2(
					model,
					A3($author$project$Api$deleteDocument, ctx, id, $author$project$State$DocDeleteDone));
			case 145:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						model,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'Document deleted'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 146:
				var file = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							ae: $elm$core$Maybe$Just(file)
						}),
					$elm$core$Platform$Cmd$none);
			case 147:
				var _v41 = model.ae;
				if (_v41.$ === 1) {
					return _Utils_Tuple2(
						model,
						A2($author$project$Main$toast, 'error', 'Choose a CSV file first'));
				} else {
					var file = _v41.a;
					return _Utils_Tuple2(
						model,
						A3($author$project$Api$importLeads, ctx, file, $author$project$State$LeadsImported));
				}
			case 148:
				if (!msg.a.$) {
					var res = msg.a.a;
					var failureSummary = A2(
						$elm$core$String$join,
						'; ',
						A2(
							$elm$core$List$map,
							function (fe) {
								return 'row ' + ($elm$core$String$fromInt(fe.dH) + (': ' + fe.db));
							},
							A2($elm$core$List$take, 3, res.b$)));
					var failCount = $elm$core$List$length(res.b$);
					var failToast = (!failCount) ? $elm$core$Platform$Cmd$none : A2(
						$author$project$Main$toast,
						'error',
						'Rows failed (' + ($elm$core$String$fromInt(failCount) + (') — ' + failureSummary)));
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ae: $elm$core$Maybe$Nothing}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2(
									$author$project$Main$toast,
									'success',
									'Imported ' + ($elm$core$String$fromInt(res.b6) + (' lead' + ((res.b6 === 1) ? '' : 's')))),
									failToast,
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 149:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{ai: true, o: $author$project$State$emptyUserForm}),
					$elm$core$Platform$Cmd$none);
			case 150:
				var uid = msg.a;
				var _v42 = A2(
					$elm$core$List$filter,
					function (u) {
						return _Utils_eq(u.bu, uid);
					},
					model.al);
				if (_v42.b) {
					var u = _v42.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								n: $elm$json$Json$Encode$object(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'uuName',
											$elm$json$Json$Encode$string(u.x)),
											_Utils_Tuple2(
											'uuRole',
											$elm$json$Json$Encode$string(u.H))
										])),
								ai: true,
								o: $author$project$State$userFormOf(u)
							}),
						$elm$core$Platform$Cmd$none);
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 151:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{b: false, ai: false}),
					$elm$core$Platform$Cmd$none);
			case 152:
				var f = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							dg: $elm$core$Dict$empty,
							b: true,
							o: f(model.o)
						}),
					$elm$core$Platform$Cmd$none);
			case 153:
				var f = model.o;
				var _v43 = f.cE;
				if (_v43.$ === 1) {
					return ((f.ad !== '') && ($elm$core$String$length(f.ad) < 12)) ? _Utils_Tuple2(
						model,
						A2($author$project$Main$toast, 'error', 'Password must be at least 12 characters')) : _Utils_Tuple2(
						model,
						A3(
							$author$project$Api$createUser,
							ctx,
							$author$project$Types$encodeNewUser(
								{J: f.J, x: f.x, ad: f.ad, H: f.H}),
							$author$project$State$UserSaved));
				} else {
					var uid = _v43.a;
					return _Utils_Tuple2(
						model,
						A4(
							$author$project$Api$updateUser,
							ctx,
							uid,
							A2(
								$author$project$Main$withRevision,
								f.t,
								$author$project$Types$encodeUpdateUser(
									{x: f.x, ad: f.ad, H: f.H})),
							$author$project$State$UserUpdatedDone));
				}
			case 154:
				if (!msg.a.$) {
					var u = msg.a.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{
								b: false,
								ai: false,
								al: _Utils_ap(
									model.al,
									_List_fromArray(
										[u]))
							}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'User ' + (u.x + ' created')),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 155:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{b: false, ai: false}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'User saved'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					if ((msg.a.a.$ === 3) && (msg.a.a.a === 409)) {
						return A5(
							$author$project$Main$beginConflict,
							model,
							'users',
							A2($elm$core$Maybe$withDefault, 0, model.o.cE),
							model.n,
							$elm$json$Json$Encode$object(
								_List_fromArray(
									[
										_Utils_Tuple2(
										'uuName',
										$elm$json$Json$Encode$string(model.o.x)),
										_Utils_Tuple2(
										'uuRole',
										$elm$json$Json$Encode$string(model.o.H))
									])));
					} else {
						var e = msg.a.a;
						return _Utils_Tuple2(
							model,
							A2(
								$author$project$Main$toast,
								'error',
								$author$project$Main$httpError(e)));
					}
				}
			case 156:
				var uid = msg.a;
				return _Utils_Tuple2(
					model,
					A3($author$project$Api$deleteUser, ctx, uid, $author$project$State$DeleteUserDone));
			case 157:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						model,
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Main$toast, 'success', 'User deleted'),
									$author$project$Main$reloadCurrent(model)
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 158:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{au: '', av: '', V: '', ax: !model.ax}),
					$elm$core$Platform$Cmd$none);
			case 159:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dg: $elm$core$Dict$empty, b: true, av: v}),
					$elm$core$Platform$Cmd$none);
			case 160:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dg: $elm$core$Dict$empty, b: true, V: v}),
					$elm$core$Platform$Cmd$none);
			case 161:
				var v = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{dg: $elm$core$Dict$empty, b: true, au: v}),
					$elm$core$Platform$Cmd$none);
			case 162:
				var validationError = ($elm$core$String$length(model.V) < 12) ? 'New password must be at least 12 characters' : ((!_Utils_eq(model.V, model.au)) ? 'Passwords do not match' : '');
				return (validationError !== '') ? _Utils_Tuple2(
					model,
					A2($author$project$Main$toast, 'error', validationError)) : _Utils_Tuple2(
					model,
					A4($author$project$Api$changePassword, ctx, model.av, model.V, $author$project$State$PasswordChangeDone));
			case 163:
				if (!msg.a.$) {
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{aE: 'Your password was updated. Sign in with your new password.', au: '', av: '', V: '', ax: false}),
						$elm$core$Platform$Cmd$batch(
							_List_fromArray(
								[
									A2($author$project$Api$logout, ctx, $author$project$State$LogoutDone),
									A2($author$project$Main$toast, 'success', 'Password updated. Sign in again.')
								])));
				} else {
					var e = msg.a.a;
					return _Utils_Tuple2(
						model,
						A2(
							$author$project$Main$toast,
							'error',
							$author$project$Main$httpError(e)));
				}
			case 164:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bl: !model.bl}),
					$elm$core$Platform$Cmd$none);
			case 165:
				var path = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{bl: false, q: ''}),
					_Utils_eq(path, model.bq.r) ? $author$project$Main$reloadCurrent(model) : A2($elm$browser$Browser$Navigation$pushUrl, model.v, path));
			case 173:
				var kind = msg.a;
				var textMsg = msg.b;
				return A3($author$project$Main$pushToast, model, kind, textMsg);
			default:
				var id = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							bo: A2(
								$elm$core$List$filter,
								function (t) {
									return !_Utils_eq(t.bu, id);
								},
								model.bo)
						}),
					$elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Main$updateNormal = F2(
	function (msg, model) {
		var recordErrors = A2($author$project$Main$recordValidation, msg, model);
		var guarded = function () {
			switch (msg.$) {
				case 56:
					if (!msg.a.$) {
						var url = msg.a.a;
						return (!_Utils_eq(url.r, model.bq.r)) || (!_Utils_eq(url.ag, model.bq.ag));
					} else {
						return true;
					}
				case 165:
					return true;
				case 66:
					return true;
				case 42:
					return true;
				case 37:
					return true;
				case 16:
					return true;
				case 17:
					return true;
				case 41:
					return true;
				case 39:
					return true;
				case 76:
					return true;
				case 124:
					return true;
				case 132:
					return true;
				case 151:
					return true;
				case 116:
					return model.P;
				case 80:
					return model.S;
				case 158:
					return model.ax;
				default:
					return false;
			}
		}();
		var busyRequest = function () {
			switch (msg.$) {
				case 50:
					return model.aG;
				case 52:
					return model.aG;
				case 43:
					return model.u;
				case 25:
					return model.u;
				case 42:
					return model.u;
				case 37:
					return model.u;
				case 16:
					return model.u;
				case 17:
					return model.u;
				case 30:
					return model.u;
				case 31:
					return model.u;
				case 36:
					return model.u;
				case 10:
					return model.u || model.z;
				case 140:
					return model.z;
				case 141:
					return model.z;
				case 94:
					return model.u;
				case 90:
					return model.aQ;
				case 93:
					return model.aQ;
				case 92:
					return model.aQ;
				case 120:
					return model.u;
				default:
					return false;
			}
		}();
		var _v0 = busyRequest ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : ((!$elm$core$Dict$isEmpty(recordErrors)) ? _Utils_Tuple2(
			_Utils_update(
				model,
				{dg: recordErrors}),
			$elm$core$Platform$Cmd$none) : ((guarded && $author$project$Main$hasDraftChanges(model)) ? _Utils_Tuple2(
			_Utils_update(
				model,
				{
					W: $elm$core$Maybe$Just(
						_Utils_Tuple2(
							'Discard your unsaved changes?',
							$author$project$State$DiscardChanges(msg)))
				}),
			$elm$core$Platform$Cmd$none) : A2($author$project$Main$updateCore, msg, model)));
		var next = _v0.a;
		var command = _v0.b;
		return _Utils_eq(
			$author$project$Main$hasUnsavedWork(next),
			$author$project$Main$hasUnsavedWork(model)) ? _Utils_Tuple2(next, command) : _Utils_Tuple2(
			next,
			$elm$core$Platform$Cmd$batch(
				_List_fromArray(
					[
						command,
						$author$project$Main$unsavedChanges(
						$author$project$Main$hasUnsavedWork(next))
					])));
	});
var $author$project$State$ConfirmAccepted = {$: 2};
var $author$project$State$ConfirmDismissed = {$: 3};
var $elm$html$Html$a = _VirtualDom_node('a');
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$html$Html$Attributes$attribute = $elm$virtual_dom$VirtualDom$attribute;
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $author$project$State$ConfirmRequested = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$State$ConflictDismiss = {$: 28};
var $author$project$State$ConflictRebase = {$: 27};
var $author$project$State$ConflictUseCurrent = function (a) {
	return {$: 29, a: a};
};
var $elm$html$Html$caption = _VirtualDom_node('caption');
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$core$String$fromList = _String_fromList;
var $elm$core$Char$toLower = _Char_toLower;
var $author$project$Features$fieldLabel = function (key) {
	switch (key) {
		case 'conversionRate':
			return 'Conversion (%)';
		case 'legacyUndated':
			return 'Legacy payments with unknown dates';
		case 'invoiced':
			return 'Invoiced in period';
		case 'collected':
			return 'Net receipts in period';
		case 'outstanding':
			return 'Current outstanding';
		case 'overdue':
			return 'Current overdue';
		case 'expenses':
			return 'Paid expenses in period';
		case 'net':
			return 'Receipts less paid expenses';
		case 'createdBy':
			return 'Submitted by';
		case 'expenseOn':
			return 'Expense date';
		case 'reviewNote':
			return 'Review note';
		case 'total':
			return 'Invoice total';
		case 'paid':
			return 'Net payments';
		case 'balance':
			return 'Outstanding balance';
		case 'clientName':
			return 'Client';
		case 'category':
			return 'Application type';
		case 'intakeDate':
			return 'Intake date';
		case 'deadline':
			return 'Next deadline';
		case 'officer':
			return 'Officer';
		case 'requiredDocuments':
			return 'Required documents';
		case 'optionalDocuments':
			return 'Optional documents';
		case 'ncFullName':
			return 'Client name';
		case 'ncEmail':
			return 'Email';
		case 'ncPhone':
			return 'Phone';
		case 'ncCaseOfficer':
			return 'Case officer';
		case 'ciServiceCategory':
			return 'Service';
		case 'ciDestination':
			return 'Destination';
		case 'ciStage':
			return 'Application stage';
		case 'ciNextDeadline':
			return 'Deadline';
		case 'ulFullName':
			return 'Lead name';
		case 'ulConsultantId':
			return 'Consultant';
		case 'uuName':
			return 'Staff name';
		case 'uuRole':
			return 'Role';
		case 'ageDays':
			return 'Age (days)';
		case 'overdueDays':
			return 'Overdue (days)';
		case 'averageAgeDays':
			return 'Average days in stage';
		case 'oldestDays':
			return 'Longest time in stage (days)';
		case 'openTasks':
			return 'Open tasks';
		case 'overdueTasks':
			return 'Overdue tasks';
		case 'openCases':
			return 'Open cases';
		case 'scanStatus':
			return 'Malware scan';
		case 'expiryWarning':
			return 'Expiry warning';
		case 'expiresOn':
			return 'Expires';
		case 'lastError':
			return 'Last error';
		case 'nextAttempt':
			return 'Next attempt';
		case 'sentAt':
			return 'Accepted at';
		default:
			return $elm$core$String$trim(
				$elm$core$String$fromList(
					A2(
						$elm$core$List$concatMap,
						function (c) {
							return $elm$core$Char$isUpper(c) ? _List_fromArray(
								[
									' ',
									$elm$core$Char$toLower(c)
								]) : _List_fromArray(
								[c]);
						},
						$elm$core$String$toList(key))));
	}
};
var $elm$html$Html$h3 = _VirtualDom_node('h3');
var $elm$html$Html$Attributes$tabindex = function (n) {
	return A2(
		_VirtualDom_attribute,
		'tabIndex',
		$elm$core$String$fromInt(n));
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $author$project$Ui$modal = F2(
	function (title, content) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('modal-overlay')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('modal-content'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'dialog'),
							A2($elm$html$Html$Attributes$attribute, 'aria-modal', 'true'),
							A2($elm$html$Html$Attributes$attribute, 'aria-label', title),
							$elm$html$Html$Attributes$tabindex(-1)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('section-head')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(title)
										]))
								])),
							content
						]))
				]));
	});
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$Attributes$scope = $elm$html$Html$Attributes$stringProperty('scope');
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$tbody = _VirtualDom_node('tbody');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$th = _VirtualDom_node('th');
var $elm$html$Html$thead = _VirtualDom_node('thead');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$Features$conflictView = function (model) {
	var workflow = A2(
		$elm$core$List$member,
		model.c1,
		_List_fromArray(
			['tasks', 'documents', 'reminders']));
	var latest = $author$project$Features$formValues(model.bT);
	var hidden = function (key) {
		return A2(
			$elm$core$List$member,
			key,
			_List_fromArray(
				['id', 'revision', 'expectedRevision', 'request', 'session', 'user', 'password', 'uuPassword']));
	};
	var get = F2(
		function (values_, key) {
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Dict$get, key, values_));
		});
	var changed = A2(
		$elm$core$List$filter,
		function (key) {
			return (!hidden(key)) && (!_Utils_eq(
				A2(get, model.bU, key),
				A2(get, latest, key)));
		},
		$elm$core$Dict$keys(latest));
	var cell_ = F2(
		function (values_, key) {
			return A2(
				$elm$html$Html$td,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						A2(get, values_, key))
					]));
		});
	return _Utils_eq(
		$elm$core$Maybe$Nothing,
		$elm$core$Result$toMaybe(
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$field, 'revision', $elm$json$Json$Decode$int),
				model.bT))) ? $elm$html$Html$text('') : A2(
		$author$project$Ui$modal,
		'Review changes before saving',
		A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Your save was rejected because this record changed. Review the original, your draft and the latest version. Accepting a version does not submit the form.')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('table-scroll')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('data-table')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$caption,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Fields changed since the form was opened')
										])),
									A2(
									$elm$html$Html$thead,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											A2(
												$elm$core$List$map,
												function (labelText) {
													return A2(
														$elm$html$Html$th,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$scope('col')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(labelText)
															]));
												},
												_List_fromArray(
													['Field', 'Original', 'Your draft', 'Latest', 'Action'])))
										])),
									A2(
									$elm$html$Html$tbody,
									_List_Nil,
									A2(
										$elm$core$List$map,
										function (key) {
											return A2(
												$elm$html$Html$tr,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$th,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$scope('row')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(
																$author$project$Features$fieldLabel(key))
															])),
														A2(cell_, model.bU, key),
														A2(cell_, model.c0, key),
														A2(cell_, latest, key),
														A2(
														$elm$html$Html$td,
														_List_Nil,
														_List_fromArray(
															[
																workflow ? A2(
																$elm$html$Html$button,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$class('btn btn-outline'),
																		$elm$html$Html$Events$onClick(
																		$author$project$State$ConflictUseCurrent(key))
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Use latest value')
																	])) : $elm$html$Html$text('Review in your form')
															]))
													]));
										},
										changed))
								]))
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$List$isEmpty(changed) ? 'The revision changed because related work changed. Your fields are unchanged in the latest version.' : 'Keeping your draft can replace the latest values for these fields.')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn btn-primary'),
							$elm$html$Html$Events$onClick(
							A2($author$project$State$ConfirmRequested, 'Use the latest version number with the reviewed draft? Save the form separately when ready.', $author$project$State$ConflictRebase))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Accept comparison and return to form')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn btn-outline'),
							$elm$html$Html$Events$onClick($author$project$State$ConflictDismiss)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Keep reviewing later')
						]))
				])));
};
var $author$project$State$LogoutClicked = {$: 66};
var $author$project$State$ToggleDarkMode = {$: 60};
var $author$project$State$TogglePwModal = {$: 158};
var $elm$core$String$toUpper = _String_toUpper;
var $elm$core$String$words = _String_words;
var $author$project$Ui$initials = function (name) {
	return $elm$core$String$toUpper(
		$elm$core$String$concat(
			A2(
				$elm$core$List$map,
				$elm$core$String$left(1),
				A2(
					$elm$core$List$take,
					2,
					$elm$core$String$words(name)))));
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Ui$avatar = function (name) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('avatar'),
				A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(
				$author$project$Ui$initials(name))
			]));
};
var $elm$html$Html$details = _VirtualDom_node('details');
var $elm$html$Html$Attributes$href = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'href',
		_VirtualDom_noJavaScriptUri(url));
};
var $elm$virtual_dom$VirtualDom$nodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_nodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $author$project$Ui$icon = function (name) {
	var paths = function () {
		switch (name) {
			case 'dashboard':
				return _List_fromArray(
					['M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z']);
			case 'leads':
				return _List_fromArray(
					['M4 4h16v4l-6 6v6l-4-2v-4L4 8z']);
			case 'more':
				return _List_fromArray(
					['M4 6h16M4 12h16M4 18h16']);
			case 'clients':
				return _List_fromArray(
					['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87', 'M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0']);
			case 'tasks':
				return _List_fromArray(
					['M9 5H5v16h14V5h-4M9 3h6v4H9zM8 12l2 2 6-5M8 18h8']);
			case 'reminders':
				return _List_fromArray(
					['M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4']);
			case 'duplicates':
				return _List_fromArray(
					['M9 9h12v12H9zM15 5V3H3v12h2']);
			case 'archive':
				return _List_fromArray(
					['M3 3h18v5H3zM5 8v13h14V8M10 12h4']);
			case 'system':
				return _List_fromArray(
					['M3 12h4l3-8 4 16 3-8h4']);
			case 'audit':
				return _List_fromArray(
					['M14 2H6v20h12V6zM14 2v5h5M9 12h6M9 16h6']);
			case 'search':
				return _List_fromArray(
					['M21 21l-5-5', 'M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0']);
			case 'arrow':
				return _List_fromArray(
					['M5 12h14M13 6l6 6-6 6']);
			case 'clock':
				return _List_fromArray(
					['M12 8v5l3 2', 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0']);
			case 'check':
				return _List_fromArray(
					['M5 12l4 4L19 6']);
			case 'plus':
				return _List_fromArray(
					['M12 5v14M5 12h14']);
			default:
				return _List_fromArray(
					['M12 3v18M3 12h18']);
		}
	}();
	return A4(
		$elm$virtual_dom$VirtualDom$nodeNS,
		'http://www.w3.org/2000/svg',
		'svg',
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$attribute, 'viewBox', '0 0 24 24'),
				A2($elm$html$Html$Attributes$attribute, 'width', '18'),
				A2($elm$html$Html$Attributes$attribute, 'height', '18'),
				A2($elm$html$Html$Attributes$attribute, 'fill', 'none'),
				A2($elm$html$Html$Attributes$attribute, 'stroke', 'currentColor'),
				A2($elm$html$Html$Attributes$attribute, 'stroke-width', '1.6'),
				A2($elm$html$Html$Attributes$attribute, 'stroke-linecap', 'round'),
				A2($elm$html$Html$Attributes$attribute, 'stroke-linejoin', 'round'),
				A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true'),
				A2($elm$html$Html$Attributes$attribute, 'focusable', 'false'),
				A2($elm$html$Html$Attributes$attribute, 'class', 'ui-icon')
			]),
		A2(
			$elm$core$List$map,
			function (path) {
				return A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					'http://www.w3.org/2000/svg',
					'path',
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'd', path)
						]),
					_List_Nil);
			},
			paths));
};
var $elm$html$Html$nav = _VirtualDom_node('nav');
var $elm$html$Html$strong = _VirtualDom_node('strong');
var $elm$html$Html$summary = _VirtualDom_node('summary');
var $author$project$Main$headerBar = function (model) {
	var user_ = A2(
		$elm$core$Maybe$withDefault,
		{J: '', bu: 0, bj: false, x: '', t: 1, H: ''},
		model.I);
	var current = model.bq.r;
	var isActive = function (path) {
		return (path === '/') ? (current === '/') : ((path === '/work/notifications') ? A2(
			$elm$core$List$member,
			current,
			_List_fromArray(
				['/work/notifications', '/reminders', '/work/reminders'])) : ((path === '/work/payments') ? A2(
			$elm$core$List$member,
			current,
			_List_fromArray(
				['/work/payments', '/work/payment-history', '/work/balances', '/work/expenses', '/work/cashflow', '/work/finance-audit', '/work/periods', '/work/reconciliation'])) : ((path === '/work/reports') ? A2(
			$elm$core$List$member,
			current,
			_List_fromArray(
				['/work/reports', '/work/ageing', '/work/bottlenecks', '/work/trends'])) : ((path === '/duplicates') ? A2(
			$elm$core$List$member,
			current,
			_List_fromArray(
				['/duplicates', '/work/merge'])) : ((path === '/system') ? A2(
			$elm$core$List$member,
			current,
			_List_fromArray(
				['/system', '/work/mail'])) : A2($elm$core$String$startsWith, path, current))))));
	};
	var navBtn = F2(
		function (path, label) {
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						isActive(path) ? 'nav-link active' : 'nav-link'),
						$elm$html$Html$Attributes$href(path),
						A2(
						$elm$html$Html$Attributes$attribute,
						'aria-current',
						isActive(path) ? 'page' : 'false')
					]),
				_List_fromArray(
					[
						$author$project$Ui$icon(
						(path === '/') ? 'dashboard' : ((path === '/users') ? 'clients' : A2($elm$core$String$dropLeft, 1, path))),
						A2(
						$elm$html$Html$span,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(label)
							]))
					]));
		});
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('header')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('logo')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('logo-icon')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('E')
							])),
						A2(
						$elm$html$Html$strong,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('ECC CRM')
							]))
					])),
				A2(
				$elm$html$Html$nav,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('nav'),
						A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Main navigation')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nav-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nav-section-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('WORKSPACE')
									])),
								A2(navBtn, '/', 'Dashboard'),
								A2(navBtn, '/leads', 'Leads'),
								A2(navBtn, '/clients', 'Clients'),
								A2(navBtn, '/applications', 'Applications'),
								A2(navBtn, '/tasks', 'Tasks')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nav-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nav-section-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('FOLLOW UP')
									])),
								A2(navBtn, '/work/notifications', 'Inbox'),
								A2(navBtn, '/work/documents', 'Documents')
							])),
						A2(
						$elm$html$Html$details,
						_Utils_ap(
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('workspace-tools')
								]),
							A2(
								$elm$core$List$member,
								current,
								_List_fromArray(
									['/work/sales', '/work/payments', '/work/payment-history', '/work/balances', '/work/expenses', '/work/cashflow', '/work/finance-audit', '/work/periods', '/work/reconciliation', '/work/tasks', '/work/appointments', '/work/invoices', '/work/search', '/work/communication', '/work/portal', '/work/security', '/work/history'])) ? _List_fromArray(
								[
									A2($elm$html$Html$Attributes$attribute, 'open', '')
								]) : _List_Nil),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$summary,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('More tools')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('tools-menu')
									]),
								_List_fromArray(
									[
										A2(navBtn, '/work/tasks', 'Task assignments'),
										A2(navBtn, '/work/history', 'Notes and history'),
										A2(navBtn, '/work/communication', 'Send email'),
										A2(navBtn, '/work/portal', 'Client portal'),
										A2(navBtn, '/work/appointments', 'Appointments'),
										(user_.H === 'admin') ? A2(navBtn, '/work/invoices', 'Invoices') : $elm$html$Html$text(''),
										A2(navBtn, '/work/sales', 'Sales report'),
										A2(navBtn, '/work/payments', 'Payments and accounting'),
										A2(navBtn, '/work/search', 'Advanced search'),
										A2(navBtn, '/work/security', 'Account security')
									]))
							])),
						(user_.H === 'admin') ? A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nav-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nav-section-label')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('ADMINISTRATION')
									])),
								A2(navBtn, '/work/reports', 'Reports'),
								A2(navBtn, '/duplicates', 'Review duplicates'),
								A2(navBtn, '/users', 'Team'),
								A2(navBtn, '/work/checklist-templates', 'Checklist templates'),
								A2(navBtn, '/archive', 'Archive'),
								A2(navBtn, '/system', 'System and delivery'),
								A2(navBtn, '/audit', 'Audit')
							])) : $elm$html$Html$text('')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('header-right')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-sm btn-outline'),
								$elm$html$Html$Events$onClick($author$project$State$TogglePwModal)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Password')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-sm btn-outline dark-toggle'),
								$elm$html$Html$Events$onClick($author$project$State$ToggleDarkMode)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								model.aB ? '☀ Light' : '☾ Dark')
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('user-chip')
							]),
						_List_fromArray(
							[
								$author$project$Ui$avatar(user_.x),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('user-identity')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$strong,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(user_.x)
											])),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('user-role')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(user_.H)
											]))
									]))
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn-logout'),
								$elm$html$Html$Events$onClick($author$project$State$LogoutClicked)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Log out')
							]))
					]))
			]));
};
var $elm$html$Html$Attributes$id = $elm$html$Html$Attributes$stringProperty('id');
var $author$project$State$LoginClicked = {$: 63};
var $author$project$State$LoginEmailChanged = function (a) {
	return {$: 61, a: a};
};
var $author$project$State$LoginModeChanged = function (a) {
	return {$: 4, a: a};
};
var $author$project$State$LoginOtpChanged = function (a) {
	return {$: 45, a: a};
};
var $author$project$State$LoginPasswordChanged = function (a) {
	return {$: 62, a: a};
};
var $author$project$State$RecoverClicked = {$: 5};
var $author$project$State$ResetClicked = {$: 6};
var $elm$html$Html$br = _VirtualDom_node('br');
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$form = _VirtualDom_node('form');
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $elm$html$Html$h2 = _VirtualDom_node('h2');
var $elm$html$Html$Attributes$for = $elm$html$Html$Attributes$stringProperty('htmlFor');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$type_ = $elm$html$Html$Attributes$stringProperty('type');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Ui$inputField = F4(
	function (label, val, typ, onInputMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('form-group')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$for(
							'field-' + $elm$core$String$toLower(
								A3($elm$core$String$replace, ' ', '-', label)))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id(
							'field-' + $elm$core$String$toLower(
								A3($elm$core$String$replace, ' ', '-', label))),
							A2(
							$elm$html$Html$Attributes$attribute,
							'autocomplete',
							(typ === 'password') ? ((A2(
								$elm$core$String$contains,
								'new password',
								$elm$core$String$toLower(label)) || A2(
								$elm$core$String$contains,
								'confirm',
								$elm$core$String$toLower(label))) ? 'new-password' : 'current-password') : ((typ === 'email') ? 'email' : 'off')),
							$elm$html$Html$Attributes$type_(typ),
							$elm$html$Html$Attributes$class('input'),
							$elm$html$Html$Attributes$value(val),
							$elm$html$Html$Events$onInput(onInputMsg)
						]),
					_List_Nil)
				]));
	});
var $elm$html$Html$Events$alwaysPreventDefault = function (msg) {
	return _Utils_Tuple2(msg, true);
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 2, a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $elm$html$Html$Events$onSubmit = function (msg) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'submit',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysPreventDefault,
			$elm$json$Json$Decode$succeed(msg)));
};
var $author$project$Views$loginView = function (model) {
	var resetting = model.cb === 'reset';
	var recovering = model.cb === 'recover';
	var subtitle = resetting ? 'Choose a new password for your account.' : (recovering ? 'We’ll email you a secure link to reset your password.' : 'Sign in to your client workspace.');
	var heading = resetting ? 'A fresh start.' : (recovering ? 'Let’s get you back in.' : 'Good to see you.');
	var action = resetting ? $author$project$State$ResetClicked : (recovering ? $author$project$State$RecoverClicked : $author$project$State$LoginClicked);
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('login-wrap')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('login-story')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('login-brand')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('logo-icon')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('E')
									])),
								A2(
								$elm$html$Html$strong,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('ECC')
									])),
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('CLIENT WORKSPACE')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('login-story-copy')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('eyebrow')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('BUILT AROUND PEOPLE')
									])),
								A2(
								$elm$html$Html$h1,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Every journey.'),
										A2($elm$html$Html$br, _List_Nil, _List_Nil),
										$elm$html$Html$text('A little clearer.')
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Keep your relationships, cases and next steps together. Make every client feel remembered.')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('login-story-footer')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('A thoughtful way to work.')
									])),
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('ECC / 01')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('login-panel')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('login-card')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('eyebrow')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('YOUR WORK, CONNECTED')
									])),
								A2(
								$elm$html$Html$h2,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(heading)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('login-sub')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(subtitle)
									])),
								A2(
								$elm$html$Html$form,
								_List_fromArray(
									[
										$elm$html$Html$Events$onSubmit(action)
									]),
								_List_fromArray(
									[
										resetting ? A2($elm$html$Html$span, _List_Nil, _List_Nil) : A4($author$project$Ui$inputField, 'Email address', model.aZ, 'email', $author$project$State$LoginEmailChanged),
										recovering ? A2($elm$html$Html$span, _List_Nil, _List_Nil) : A4(
										$author$project$Ui$inputField,
										resetting ? 'New password · at least 12 characters' : 'Password',
										model.L,
										'password',
										$author$project$State$LoginPasswordChanged),
										(recovering || resetting) ? A2($elm$html$Html$span, _List_Nil, _List_Nil) : A4($author$project$Ui$inputField, 'Authenticator or recovery code (if enabled)', model.a_, 'text', $author$project$State$LoginOtpChanged),
										(model.w !== '') ? A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('login-error'),
												A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(model.w)
											])) : A2($elm$html$Html$span, _List_Nil, _List_Nil),
										(model.aE !== '') ? A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('notice-banner'),
												A2($elm$html$Html$Attributes$attribute, 'role', 'status')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(model.aE)
											])) : A2($elm$html$Html$span, _List_Nil, _List_Nil),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn btn-primary login-submit'),
												$elm$html$Html$Attributes$type_('submit'),
												$elm$html$Html$Attributes$disabled(model.F)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												model.F ? 'Please wait…' : (resetting ? 'Set new password →' : (recovering ? 'Send recovery link →' : 'Sign in →')))
											]))
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-button'),
										$elm$html$Html$Events$onClick(
										$author$project$State$LoginModeChanged(
											(recovering || resetting) ? 'login' : 'recover'))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										(recovering || resetting) ? '← Back to sign in' : 'Forgot your password?')
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('login-hint')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Need access? Ask your workspace administrator for an invitation. '),
										$elm$html$Html$text(
										recovering ? 'Check your spam folder. Links expire after one hour and can be used once; request a new link if necessary.' : 'Lost your authenticator? Use an unused recovery code in the code field. If you lost both, contact another administrator to verify your identity and reset MFA.')
									]))
							]))
					]))
			]));
};
var $elm$html$Html$main_ = _VirtualDom_node('main');
var $author$project$Main$mobileNavigation = function (model) {
	var user = A2(
		$elm$core$Maybe$withDefault,
		{J: '', bu: 0, bj: false, x: '', t: 1, H: ''},
		model.I);
	var current = model.bq.r;
	var primary = F3(
		function (path, label, iconName) {
			var active = (path === '/') ? (current === '/') : A2($elm$core$String$startsWith, path, current);
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(path),
						$elm$html$Html$Attributes$class(
						'mobile-tab' + (active ? ' is-active' : '')),
						A2(
						$elm$html$Html$Attributes$attribute,
						'aria-current',
						active ? 'page' : 'false')
					]),
				_List_fromArray(
					[
						$author$project$Ui$icon(iconName),
						A2(
						$elm$html$Html$span,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(label)
							]))
					]));
		});
	var tool = F2(
		function (path, label) {
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$href(path),
						$elm$html$Html$Attributes$class('mobile-menu-link'),
						A2(
						$elm$html$Html$Attributes$attribute,
						'aria-current',
						_Utils_eq(current, path) ? 'page' : 'false')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(label),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('›')
							]))
					]));
		});
	return A2(
		$elm$html$Html$nav,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('mobile-bottom-nav'),
				A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Mobile navigation')
			]),
		_List_fromArray(
			[
				A3(primary, '/', 'Home', 'dashboard'),
				A3(primary, '/leads', 'Leads', 'leads'),
				A3(primary, '/clients', 'Clients', 'clients'),
				A3(primary, '/tasks', 'Tasks', 'tasks'),
				A2(
				$elm$html$Html$details,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						'mobile-more' + (((current !== '/') && (!A2(
							$elm$core$List$any,
							function (path) {
								return A2($elm$core$String$startsWith, path, current);
							},
							_List_fromArray(
								['/leads', '/clients', '/tasks'])))) ? ' is-active' : ''))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$summary,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mobile-tab')
							]),
						_List_fromArray(
							[
								$author$project$Ui$icon('more'),
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('More')
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('mobile-menu-panel'),
								A2($elm$html$Html$Attributes$attribute, 'aria-label', 'More workspace tools')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mobile-menu-heading')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$strong,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Your workspace')
											])),
										A2(
										$elm$html$Html$span,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(user.x)
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mobile-menu-grid')
									]),
								_List_fromArray(
									[
										A2(tool, '/applications', 'Applications'),
										A2(tool, '/work/notifications', 'Inbox'),
										A2(tool, '/work/documents', 'Documents'),
										A2(tool, '/work/appointments', 'Appointments'),
										A2(tool, '/work/tasks', 'Task assignments'),
										A2(tool, '/work/history', 'Notes and history'),
										A2(tool, '/work/sales', 'Sales report'),
										A2(tool, '/work/payments', 'Payments and accounting'),
										A2(tool, '/work/payment-history', 'Payment history'),
										A2(tool, '/work/expenses', 'Expenses'),
										A2(tool, '/work/periods', 'Period closing'),
										A2(tool, '/work/reconciliation', 'Bank reconciliation'),
										A2(tool, '/work/search', 'Advanced search'),
										A2(tool, '/work/communication', 'Send email'),
										A2(tool, '/work/portal', 'Client portal'),
										A2(tool, '/work/security', 'Account security')
									])),
								(user.H === 'admin') ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mobile-menu-grid mobile-menu-admin')
									]),
								_List_fromArray(
									[
										A2(tool, '/work/reports', 'Reports'),
										A2(tool, '/users', 'Team'),
										A2(tool, '/duplicates', 'Review duplicates'),
										A2(tool, '/work/checklist-templates', 'Checklist templates'),
										A2(tool, '/work/invoices', 'Invoices'),
										A2(tool, '/archive', 'Archive'),
										A2(tool, '/system', 'System and delivery'),
										A2(tool, '/audit', 'Audit')
									])) : $elm$html$Html$text(''),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('mobile-menu-account')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn btn-outline'),
												$elm$html$Html$Events$onClick($author$project$State$TogglePwModal)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Password')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn btn-outline'),
												$elm$html$Html$Events$onClick($author$project$State$ToggleDarkMode)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												model.aB ? 'Light mode' : 'Dark mode')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn btn-outline'),
												$elm$html$Html$Events$onClick($author$project$State$LogoutClicked)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Log out')
											]))
									]))
							]))
					]))
			]));
};
var $author$project$Views$auditValueStr = $elm$json$Json$Decode$oneOf(
	_List_fromArray(
		[
			$elm$json$Json$Decode$string,
			$elm$json$Json$Decode$null('—'),
			A2($elm$json$Json$Decode$map, $elm$core$String$fromInt, $elm$json$Json$Decode$int),
			A2(
			$elm$json$Json$Decode$map,
			function (b) {
				return b ? 'yes' : 'no';
			},
			$elm$json$Json$Decode$bool)
		]));
var $author$project$Views$changeEntry = A3(
	$elm$json$Json$Decode$map2,
	F2(
		function (from, to) {
			return from + (' → ' + to);
		}),
	A2($elm$json$Json$Decode$field, 'from', $author$project$Views$auditValueStr),
	A2($elm$json$Json$Decode$field, 'to', $author$project$Views$auditValueStr));
var $author$project$Views$changeLines = function (mv) {
	if (mv.$ === 1) {
		return _List_Nil;
	} else {
		var v = mv.a;
		var _v1 = A2(
			$elm$json$Json$Decode$decodeValue,
			$elm$json$Json$Decode$keyValuePairs($author$project$Views$changeEntry),
			v);
		if (!_v1.$) {
			var pairs = _v1.a;
			return A2(
				$elm$core$List$map,
				function (_v2) {
					var field = _v2.a;
					var diff = _v2.b;
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('activity-desc')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(field + (': ' + diff))
							]));
				},
				pairs);
		} else {
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('activity-desc')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('(unparsable change)')
						]))
				]);
		}
	}
};
var $author$project$Ui$emptyNote = function (msg) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('empty-note')
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(msg)
			]));
};
var $author$project$Views$entityHref = function (e) {
	var _v0 = e.da;
	switch (_v0) {
		case 'lead':
			return $elm$core$Maybe$Just(
				'/leads/' + $elm$core$String$fromInt(e.c8));
		case 'client':
			return $elm$core$Maybe$Just(
				'/clients/' + $elm$core$String$fromInt(e.c8));
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Ui$fmtDateTime = function (iso) {
	return A3($elm$core$String$slice, 0, 10, iso);
};
var $author$project$Views$auditView = function (model) {
	var me_ = A2(
		$elm$core$Maybe$withDefault,
		{J: '', bu: 0, bj: false, x: '', t: 1, H: ''},
		model.I);
	if (me_.H !== 'admin') {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card')
				]),
			_List_fromArray(
				[
					$author$project$Ui$emptyNote('Admin access required.')
				]));
	} else {
		var entityLink = function (e) {
			var _v0 = $author$project$Views$entityHref(e);
			if (!_v0.$) {
				var path = _v0.a;
				return A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tag tag-id'),
							$elm$html$Html$Attributes$href(path)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							e.da + (' #' + $elm$core$String$fromInt(e.c8)))
						]));
			} else {
				return A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tag tag-id')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(e.da)
						]));
			}
		};
		var actionTag = function (action) {
			return A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						(action === 'deleted') ? 'tag tag-lost' : ((action === 'created') ? 'tag tag-converted' : 'tag tag-stage-blue'))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(action)
					]));
		};
		var auditRow = function (e) {
			return A2(
				$elm$html$Html$tr,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Ui$fmtDateTime(e.aA))
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2($elm$core$Maybe$withDefault, '—', e.cN))
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								actionTag(e.cM)
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2($elm$core$Maybe$withDefault, '', e.c9))
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								entityLink(e)
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						$author$project$Views$changeLines(e.cZ))
					]));
		};
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('page-head')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Audit Trail')
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('empty-note')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Every lead and client edit and deletion, with before/after values.')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card table-card')
						]),
					_List_fromArray(
						[
							$elm$core$List$isEmpty(model.a5) ? $author$project$Ui$emptyNote('No changes recorded yet.') : A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('data-table')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$thead,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$th,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('When')
														])),
													A2(
													$elm$html$Html$th,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Who')
														])),
													A2(
													$elm$html$Html$th,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Action')
														])),
													A2(
													$elm$html$Html$th,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Record')
														])),
													A2(
													$elm$html$Html$th,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Entity')
														])),
													A2(
													$elm$html$Html$th,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Changes')
														]))
												]))
										])),
									A2(
									$elm$html$Html$tbody,
									_List_Nil,
									A2($elm$core$List$map, auditRow, model.a5))
								]))
						]))
				]));
	}
};
var $author$project$State$DeleteCaseClicked = function (a) {
	return {$: 136, a: a};
};
var $author$project$State$DeleteClientConfirmed = function (a) {
	return {$: 129, a: a};
};
var $author$project$State$OpenCaseForm = function (a) {
	return {$: 131, a: a};
};
var $author$project$State$OpenClientEditor = function (a) {
	return {$: 172, a: a};
};
var $author$project$State$SubmitClientTask = function (a) {
	return {$: 119, a: a};
};
var $author$project$State$UploadClientDocClicked = function (a) {
	return {$: 141, a: a};
};
var $author$project$State$CloseCaseForm = {$: 132};
var $author$project$State$SubmitCaseForm = function (a) {
	return {$: 134, a: a};
};
var $author$project$State$UpdateCaseForm = function (a) {
	return {$: 133, a: a};
};
var $author$project$Types$caseStages = _List_fromArray(
	['Documents Under Review', 'Submitted', 'Decision Pending', 'Approved', 'Rejected']);
var $author$project$Views$checkedInputField = F6(
	function (model, key, labelText, current, kind, changed) {
		var fieldId = 'record-field-' + key;
		var error = A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Dict$get, key, model.dg));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('form-group')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$for(fieldId)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(labelText)
						])),
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id(fieldId),
							$elm$html$Html$Attributes$class('input'),
							$elm$html$Html$Attributes$type_(kind),
							$elm$html$Html$Attributes$value(current),
							$elm$html$Html$Events$onInput(changed),
							A2(
							$elm$html$Html$Attributes$attribute,
							'aria-invalid',
							(error === '') ? 'false' : 'true'),
							A2($elm$html$Html$Attributes$attribute, 'aria-describedby', fieldId + '-error'),
							A2(
							$elm$html$Html$Attributes$attribute,
							'autocomplete',
							(kind === 'password') ? ((key === 'pwCurrent') ? 'current-password' : 'new-password') : ((kind === 'email') ? 'email' : 'off'))
						]),
					_List_Nil),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id(fieldId + '-error'),
							$elm$html$Html$Attributes$class('field-error'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'status')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(error)
						]))
				]));
	});
var $author$project$Types$destinations = _List_fromArray(
	['Canada', 'Australia', 'New Zealand', 'UAE', 'UK', 'Schengen']);
var $author$project$Views$isReadOnly = function (model) {
	return _Utils_eq(
		A2(
			$elm$core$Maybe$map,
			function ($) {
				return $.H;
			},
			model.I),
		$elm$core$Maybe$Just('viewer'));
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$select = _VirtualDom_node('select');
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$Ui$selectField = F4(
	function (label, opts, current, onInputMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('form-group')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$for(
							'field-' + $elm$core$String$toLower(
								A3($elm$core$String$replace, ' ', '-', label)))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$select,
					_List_fromArray(
						[
							$elm$html$Html$Events$onInput(onInputMsg)
						]),
					A2(
						$elm$core$List$map,
						function (o) {
							return A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value(o),
										$elm$html$Html$Attributes$selected(
										_Utils_eq(o, current))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(o)
									]));
						},
						opts))
				]));
	});
var $author$project$Types$services = _List_fromArray(
	['Student Visa', 'Work Visa', 'Tourist Visa', 'Immigration Consultation', 'School Admission']);
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Views$caseModal = F3(
	function (model, cf, cd) {
		return A2(
			$author$project$Ui$modal,
			_Utils_eq(cf.aP, $elm$core$Maybe$Nothing) ? 'Add Application' : 'Edit Application',
			A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A4(
						$author$project$Ui$selectField,
						'Service Category',
						$author$project$Types$services,
						cf.cX,
						function (v) {
							return $author$project$State$UpdateCaseForm(
								function (f) {
									return _Utils_update(
										f,
										{cX: v});
								});
						}),
						A4(
						$author$project$Ui$selectField,
						'Destination',
						$author$project$Types$destinations,
						cf.bb,
						function (v) {
							return $author$project$State$UpdateCaseForm(
								function (f) {
									return _Utils_update(
										f,
										{bb: v});
								});
						}),
						A4(
						$author$project$Ui$selectField,
						'Stage',
						$author$project$Types$caseStages,
						cf.dO,
						function (v) {
							return $author$project$State$UpdateCaseForm(
								function (f) {
									return _Utils_update(
										f,
										{dO: v});
								});
						}),
						A6(
						$author$project$Views$checkedInputField,
						model,
						'deadline',
						'Next Deadline',
						cf.aT,
						'date',
						function (v) {
							return $author$project$State$UpdateCaseForm(
								function (f) {
									return _Utils_update(
										f,
										{aT: v});
								});
						}),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '14px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$disabled(
										$author$project$Views$isReadOnly(model)),
										$elm$html$Html$Attributes$class('btn btn-primary'),
										$elm$html$Html$Events$onClick(
										$author$project$State$SubmitCaseForm(cd.ap.bu))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Save Application')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-outline'),
										$elm$html$Html$Events$onClick($author$project$State$CloseCaseForm)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Cancel')
									]))
							]))
					])));
	});
var $author$project$State$ClientProfileRefresh = function (a) {
	return {$: 92, a: a};
};
var $author$project$State$InlineSection = function (a) {
	return {$: 16, a: a};
};
var $author$project$Features$clientNextSteps = F2(
	function (model, cid) {
		var waiting = _Utils_eq(
			A2(
				$elm$json$Json$Decode$decodeValue,
				$elm$json$Json$Decode$null(0),
				model.aR),
			$elm$core$Result$Ok(0));
		var steps = A2(
			$elm$core$Result$withDefault,
			model.aR,
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$field, 'nextSteps', $elm$json$Json$Decode$value),
				model.aR));
		var task = A2(
			$elm$core$Result$withDefault,
			steps,
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$field, 'task', $elm$json$Json$Decode$value),
				steps));
		var application = A2(
			$elm$core$Result$withDefault,
			steps,
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$field, 'application', $elm$json$Json$Decode$value),
				steps));
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card client-next-steps')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h3,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Next steps')
						])),
					waiting ? A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('status-help')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									(model.a7 === '') ? 'Loading the latest application and task…' : 'Next steps could not be loaded. Refresh to try again.')
								])),
							(model.a7 !== '') ? A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Events$onClick(
									$author$project$State$ClientProfileRefresh(cid))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Retry next steps')
								])) : $elm$html$Html$text('')
						])) : A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('next-step-grid')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Current application')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											(A2($author$project$Features$str, 'id', application) === '') ? 'No active application. Create one when the client is ready.' : A2(
												$elm$core$String$join,
												' · ',
												A2(
													$elm$core$List$filter,
													$elm$core$Basics$neq(''),
													_List_fromArray(
														[
															A2($author$project$Features$str, 'category', application),
															A2($author$project$Features$str, 'destination', application),
															A2($author$project$Features$str, 'stage', application)
														]))))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											(A2($author$project$Features$str, 'deadline', application) === '') ? 'No application deadline set.' : ('Next deadline: ' + A2($author$project$Features$str, 'deadline', application)))
										])),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-outline'),
											$elm$html$Html$Attributes$href(
											'/applications?client=' + $elm$core$String$fromInt(cid))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Manage applications')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Next task')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											(A2($author$project$Features$str, 'id', task) === '') ? 'No open task. Add a next step below.' : A2($author$project$Features$str, 'title', task))
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											(A2($author$project$Features$str, 'dueDate', task) === '') ? 'No task deadline set.' : ('Due: ' + A2($author$project$Features$str, 'dueDate', task)))
										])),
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-outline'),
											$elm$html$Html$Attributes$href('#client-tasks')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('View client tasks')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Documents')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											((A2($author$project$Features$str, 'outstandingDocuments', steps) === '') ? '0' : A2($author$project$Features$str, 'outstandingDocuments', steps)) + ' required documents still need approval.')
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-outline'),
											$elm$html$Html$Events$onClick(
											$author$project$State$InlineSection('documents'))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Review checklist')
										]))
								]))
						]))
				]));
	});
var $author$project$State$ClientPhotoPicked = function (a) {
	return {$: 89, a: a};
};
var $author$project$State$ClientPhotoRetry = function (a) {
	return {$: 93, a: a};
};
var $author$project$State$ClientPhotoUpload = function (a) {
	return {$: 90, a: a};
};
var $elm$html$Html$Attributes$accept = $elm$html$Html$Attributes$stringProperty('accept');
var $elm$html$Html$Attributes$alt = $elm$html$Html$Attributes$stringProperty('alt');
var $elm$file$File$decoder = _File_decoder;
var $elm$html$Html$img = _VirtualDom_node('img');
var $elm$json$Json$Decode$index = _Json_decodeIndex;
var $elm$file$File$name = _File_name;
var $author$project$Features$scanHelp = function (status) {
	switch (status) {
		case 'Pending':
			return 'Waiting for malware scanning. Downloads and approval remain blocked. Refresh to check progress.';
		case 'Scanning':
			return 'Malware scanning is in progress. Downloads and approval remain blocked.';
		case 'Error':
			return 'Scanning failed. An administrator can select this requirement and retry the scan.';
		case 'Infected':
			return 'This file was blocked by malware scanning. Upload a safe replacement.';
		case 'Clean':
			return 'Malware scan passed. Your case officer can review the document.';
		default:
			return 'Add a file to this requirement to begin scanning and review.';
	}
};
var $elm$html$Html$Attributes$src = function (url) {
	return A2(
		$elm$html$Html$Attributes$stringProperty,
		'src',
		_VirtualDom_noJavaScriptOrHtmlUri(url));
};
var $author$project$Features$clientPhotoCard = F2(
	function (model, cid) {
		var writable = !_Utils_eq(
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.H;
				},
				model.I),
			$elm$core$Maybe$Just('viewer'));
		var photo = A2(
			$elm$core$Result$withDefault,
			model.aR,
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$field, 'photo', $elm$json$Json$Decode$value),
				model.aR));
		var scan = A2($author$project$Features$str, 'scanStatus', photo);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card client-photo-card')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h3,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Client photo')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('client-photo-row')
						]),
					_List_fromArray(
						[
							(scan === 'Clean') ? A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('button'),
									$elm$html$Html$Attributes$class('photo-preview-trigger'),
									A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Enlarge client profile photo')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$img,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$src(
											'/api/clients/' + ($elm$core$String$fromInt(cid) + ('/photo?v=' + A2($author$project$Features$str, 'documentId', photo)))),
											$elm$html$Html$Attributes$alt('Client profile photo'),
											$elm$html$Html$Attributes$class('client-photo')
										]),
									_List_Nil)
								])) : A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('client-photo-placeholder'),
									A2($elm$html$Html$Attributes$attribute, 'aria-label', 'No approved profile photo')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Photo')
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('status-help')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									(A2($author$project$Features$str, 'documentId', photo) === '') ? 'Add a PNG or JPEG profile photo up to 2 MB and 4096 × 4096 pixels.' : $author$project$Features$scanHelp(scan))
								]))
						])),
					(model.a7 !== '') ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('error-banner'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(model.a7)
						])) : $elm$html$Html$text(''),
					(model.bO !== '') ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('notice-banner'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'status')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(model.bO)
						])) : $elm$html$Html$text(''),
					writable ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$for('client-photo-file')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Client profile photo')
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('client-photo-file'),
									$elm$html$Html$Attributes$type_('file'),
									$elm$html$Html$Attributes$accept('image/png,image/jpeg'),
									$elm$html$Html$Attributes$disabled(model.aQ),
									A2(
									$elm$html$Html$Events$on,
									'change',
									A2(
										$elm$json$Json$Decode$map,
										$author$project$State$ClientPhotoPicked,
										A2(
											$elm$json$Json$Decode$at,
											_List_fromArray(
												['target', 'files']),
											A2($elm$json$Json$Decode$index, 0, $elm$file$File$decoder))))
								]),
							_List_Nil),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2(
										$elm$core$Maybe$withDefault,
										'No replacement photo selected',
										A2($elm$core$Maybe$map, $elm$file$File$name, model.bN)))
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-primary'),
									$elm$html$Html$Attributes$disabled(
									model.aQ || _Utils_eq(model.bN, $elm$core$Maybe$Nothing)),
									$elm$html$Html$Events$onClick(
									$author$project$State$ClientPhotoUpload(cid))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									model.aQ ? 'Uploading…' : 'Upload photo')
								]))
						])) : $elm$html$Html$text(''),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-actions')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(model.aQ),
									$elm$html$Html$Events$onClick(
									$author$project$State$ClientProfileRefresh(cid))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Refresh photo status')
								])),
							((scan === 'Error') && _Utils_eq(
							A2(
								$elm$core$Maybe$map,
								function ($) {
									return $.H;
								},
								model.I),
							$elm$core$Maybe$Just('admin'))) ? A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(model.aQ),
									$elm$html$Html$Events$onClick(
									$author$project$State$ClientPhotoRetry(cid))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Retry failed photo scan')
								])) : $elm$html$Html$text('')
						]))
				]));
	});
var $author$project$State$DocPicked = function (a) {
	return {$: 138, a: a};
};
var $author$project$State$DocDeleted = function (a) {
	return {$: 144, a: a};
};
var $author$project$Api$documentDownloadUrl = F2(
	function (ctx, id) {
		return ctx.ao + ('/api/documents/' + ($elm$core$String$fromInt(id) + '/download'));
	});
var $elm$html$Html$Attributes$download = function (fileName) {
	return A2($elm$html$Html$Attributes$stringProperty, 'download', fileName);
};
var $author$project$Views$fmtSize = function (bytes) {
	return (bytes >= 1048576) ? ($elm$core$String$fromInt((bytes / 1048576) | 0) + ' MB') : ((bytes >= 1024) ? ($elm$core$String$fromInt((bytes / 1024) | 0) + ' KB') : ($elm$core$String$fromInt(bytes) + ' B'));
};
var $elm$html$Html$Attributes$title = $elm$html$Html$Attributes$stringProperty('title');
var $author$project$Views$documentRow = F2(
	function (model, d) {
		var ctx = {ao: model.am, dU: model.dU};
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('task-row')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$title(d.di)
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$strong,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(d.di)
								]))
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('activity-date')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Views$fmtSize(d.dK))
						])),
					A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('activity-date')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$String$left, 10, d.aA))
						])),
					A2(
					$elm$html$Html$span,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$Maybe$withDefault, '', d.d_))
						])),
					(d.dI !== 'Clean') ? A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tag')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Scan: ' + (d.dI + ((d.dI === 'Error') ? ' · Ask an administrator to retry' : ((d.dI === 'Infected') ? ' · Upload a safe replacement' : ' · Download unavailable until scanning passes'))))
						])) : A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn btn-sm btn-outline'),
							$elm$html$Html$Attributes$href(
							A2($author$project$Api$documentDownloadUrl, ctx, d.bu)),
							$elm$html$Html$Attributes$download('')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Download')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$disabled(
							$author$project$Views$isReadOnly(model)),
							$elm$html$Html$Attributes$class('btn btn-sm btn-danger'),
							$elm$html$Html$Events$onClick(
							A2(
								$author$project$State$ConfirmRequested,
								'Delete this document? This action cannot be undone.',
								$author$project$State$DocDeleted(d.bu)))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Delete')
						]))
				]));
	});
var $author$project$Views$documentRows = F2(
	function (model, docs) {
		return $elm$core$List$isEmpty(docs) ? $author$project$Ui$emptyNote('No documents yet — upload a passport, form, or scan.') : A2(
			$elm$html$Html$div,
			_List_Nil,
			A2(
				$elm$core$List$map,
				$author$project$Views$documentRow(model),
				docs));
	});
var $author$project$Views$documentsCard = F3(
	function (model, docs, uploadMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('section-head')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Documents')
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('lead-count')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromInt(
										$elm$core$List$length(docs)))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('inline-form'),
							A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$disabled(
									$author$project$Views$isReadOnly(model)),
									$elm$html$Html$Attributes$type_('file'),
									A2(
									$elm$html$Html$Events$on,
									'change',
									A2(
										$elm$json$Json$Decode$map,
										$author$project$State$DocPicked,
										A2(
											$elm$json$Json$Decode$at,
											_List_fromArray(
												['target', 'files']),
											A2($elm$json$Json$Decode$index, 0, $elm$file$File$decoder))))
								]),
							_List_Nil),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('empty-note')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									function () {
										var _v0 = model.M;
										if (!_v0.$) {
											var file = _v0.a;
											return $elm$file$File$name(file);
										} else {
											return 'No file chosen';
										}
									}())
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$disabled(
									$author$project$Views$isReadOnly(model) || (model.z || _Utils_eq(model.M, $elm$core$Maybe$Nothing))),
									$elm$html$Html$Attributes$class('btn btn-sm btn-primary'),
									$elm$html$Html$Events$onClick(uploadMsg)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									model.z ? 'Uploading…' : 'Upload')
								]))
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('status-help'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'status')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							model.z ? 'Uploading your file. Please wait before leaving this record.' : 'Files up to 25 MB are scanned before download. Failed scans need an administrator’s retry; infected files need a safe replacement.')
						])),
					A2($author$project$Views$documentRows, model, docs)
				]));
	});
var $author$project$State$InlineOwner = function (a) {
	return {$: 17, a: a};
};
var $author$project$State$PageStep = function (a) {
	return {$: 10, a: a};
};
var $author$project$State$ChecklistFile = function (a) {
	return {$: 24, a: a};
};
var $author$project$State$ChecklistUpload = F2(
	function (a, b) {
		return {$: 25, a: a, b: b};
	});
var $author$project$State$FeatureEdit = function (a) {
	return {$: 37, a: a};
};
var $author$project$State$FeatureField = F2(
	function (a, b) {
		return {$: 35, a: a, b: b};
	});
var $author$project$State$FeatureReset = {$: 42};
var $author$project$State$FeatureRun = function (a) {
	return {$: 43, a: a};
};
var $author$project$State$FeatureSearch = function (a) {
	return {$: 36, a: a};
};
var $author$project$State$FinanceCandidateQuery = function (a) {
	return {$: 21, a: a};
};
var $author$project$State$FinanceCandidateSelected = function (a) {
	return {$: 23, a: a};
};
var $author$project$State$FinanceCandidateStep = function (a) {
	return {$: 22, a: a};
};
var $author$project$State$FinanceFile = function (a) {
	return {$: 18, a: a};
};
var $author$project$State$FinanceUpload = F2(
	function (a, b) {
		return {$: 19, a: a, b: b};
	});
var $author$project$State$ApplicationFilter = F2(
	function (a, b) {
		return {$: 30, a: a, b: b};
	});
var $author$project$State$ClearApplicationFilters = {$: 31};
var $author$project$Features$items = F2(
	function (key, item) {
		return A2(
			$elm$core$Result$withDefault,
			_List_Nil,
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2(
					$elm$json$Json$Decode$field,
					key,
					$elm$json$Json$Decode$list($elm$json$Json$Decode$value)),
				item));
	});
var $author$project$Features$applicationOverview = function (model) {
	var summary = $elm$core$List$head(
		A2($author$project$Features$items, 'summary', model.p));
	var options = function (prefix) {
		return A2(
			$elm$core$List$map,
			function (item) {
				return _Utils_Tuple2(
					A2(
						$elm$core$String$dropLeft,
						$elm$core$String$length(prefix) + 1,
						A2($author$project$Features$str, 'value', item)),
					A2($author$project$Features$str, 'label', item));
			},
			A2(
				$elm$core$List$filter,
				function (item) {
					return A2(
						$elm$core$String$startsWith,
						prefix + ':',
						A2($author$project$Features$str, 'value', item));
				},
				A2($author$project$Features$items, 'options', model.p)));
	};
	var metric = F2(
		function (key, labelText) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('stat')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stat-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(labelText)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stat-value')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2(
									$elm$core$Maybe$withDefault,
									'0',
									A2(
										$elm$core$Maybe$map,
										$author$project$Features$str(key),
										summary)))
							]))
					]));
		});
	var filterValue = function (key) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Dict$get, key, model.cP));
	};
	var optionFilter = F3(
		function (key, labelText, kind) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$for('application-filter-' + key)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(labelText)
							])),
						A2(
						$elm$html$Html$select,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('application-filter-' + key),
								$elm$html$Html$Attributes$value(
								filterValue(key)),
								$elm$html$Html$Attributes$disabled(model.u),
								$elm$html$Html$Events$onInput(
								$author$project$State$ApplicationFilter(key))
							]),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										'All ' + $elm$core$String$toLower(labelText))
									])),
							A2(
								$elm$core$List$map,
								function (_v0) {
									var v = _v0.a;
									var l = _v0.b;
									return A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(v),
												$elm$html$Html$Attributes$selected(
												_Utils_eq(
													filterValue(key),
													v))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(l)
											]));
								},
								kind)))
					]));
		});
	var deadlines = F2(
		function (key, title) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('card')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h3,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(title)
							])),
						$elm$core$List$isEmpty(
						A2($author$project$Features$items, key, model.p)) ? A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('empty-note')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								(key === 'overdue') ? 'No overdue applications in this view.' : 'No application deadlines in the next seven days.')
							])) : A2(
						$elm$html$Html$div,
						_List_Nil,
						A2(
							$elm$core$List$map,
							function (item) {
								return A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('operation-row')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$h3,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text(
															A2($author$project$Features$str, 'title', item))
														])),
													A2(
													$elm$html$Html$p,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text(
															A2($author$project$Features$str, 'stage', item) + (' · ' + A2($author$project$Features$str, 'deadline', item)))
														]))
												])),
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('btn btn-outline'),
													$elm$html$Html$Attributes$disabled(model.u),
													$elm$html$Html$Events$onClick(
													$author$project$State$FeatureEdit(item))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Review application')
												]))
										]));
							},
							A2($author$project$Features$items, key, model.p)))
					]));
		});
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('application-overview'),
				A2(
				$elm$html$Html$Attributes$attribute,
				'aria-busy',
				model.bB ? 'true' : 'false')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('application-filters card')
					]),
				_List_fromArray(
					[
						A3(
						optionFilter,
						'client',
						'Clients',
						options('client')),
						A3(
						optionFilter,
						'officer',
						'Officers',
						options('staff')),
						A3(
						optionFilter,
						'destination',
						'Destinations',
						A2(
							$elm$core$List$map,
							function (v) {
								return _Utils_Tuple2(v, v);
							},
							_List_fromArray(
								['Canada', 'Australia', 'New Zealand', 'UAE', 'UK', 'Schengen']))),
						A3(
						optionFilter,
						'stage',
						'Stages',
						A2(
							$elm$core$List$map,
							function (v) {
								return _Utils_Tuple2(v, v);
							},
							_List_fromArray(
								['Documents Under Review', 'Submitted', 'Decision Pending', 'Approved', 'Rejected']))),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$for('application-filter-intake')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Intake month')
									])),
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('application-filter-intake'),
										$elm$html$Html$Attributes$type_('month'),
										$elm$html$Html$Attributes$value(
										filterValue('intake')),
										$elm$html$Html$Attributes$disabled(model.u),
										$elm$html$Html$Events$onInput(
										$author$project$State$ApplicationFilter('intake'))
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-outline'),
								$elm$html$Html$Attributes$disabled(model.u),
								$elm$html$Html$Events$onClick($author$project$State$ClearApplicationFilters)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Clear filters')
							]))
					])),
				model.bB ? A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('status-help'),
						A2($elm$html$Html$Attributes$attribute, 'role', 'status')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Updating application overview…')
					])) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('stats')
					]),
				_List_fromArray(
					[
						A2(metric, 'total', 'Applications'),
						A2(metric, 'upcoming', 'Due in the next 7 days'),
						A2(metric, 'overdue', 'Overdue applications')
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('stage-counts'),
						A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Application counts by stage')
					]),
				A2(
					$elm$core$List$map,
					function (item) {
						return A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(model.u),
									$elm$html$Html$Events$onClick(
									A2(
										$author$project$State$ApplicationFilter,
										'stage',
										A2($author$project$Features$str, 'stage', item)))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2($author$project$Features$str, 'stage', item) + (' · ' + A2($author$project$Features$str, 'count', item)))
								]));
					},
					A2($author$project$Features$items, 'stages', model.p))),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('application-deadlines')
					]),
				_List_fromArray(
					[
						A2(deadlines, 'upcoming', 'Upcoming deadlines'),
						A2(deadlines, 'overdue', 'Overdue work')
					])),
				A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('status-help')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Counts and deadlines follow the current filters and your record permissions. Each deadline panel shows up to five applications. Approved and rejected applications are excluded from overdue work.')
					]))
			]));
};
var $author$project$Features$columns = function (section) {
	switch (section) {
		case 'payment-history':
			return _List_fromArray(
				['currency', 'amount', 'paidOn', 'method', 'reference', 'actor', 'reason', 'reversesId', 'reversed']);
		case 'periods':
			return _List_fromArray(
				['status', 'changedBy', 'changedAt', 'reason']);
		case 'reconciliation':
			return _List_fromArray(
				['currency', 'amount', 'postedOn', 'reference', 'description', 'status', 'reason']);
		case 'sales':
			return _List_fromArray(
				['kind', 'leads', 'converted', 'conversionRate', 'currency', 'invoiced', 'collected', 'outstanding', 'overdue', 'legacyUndated']);
		case 'cashflow':
			return _List_fromArray(
				['currency', 'invoiced', 'collected', 'expenses', 'net', 'outstanding', 'overdue', 'legacyUndated']);
		case 'payments':
			return _List_fromArray(
				['currency', 'total', 'paid', 'balance', 'dueDate', 'overdueDays', 'status']);
		case 'balances':
			return _List_fromArray(
				['currency', 'total', 'paid', 'balance', 'dueDate', 'overdueDays', 'status']);
		case 'expenses':
			return _List_fromArray(
				['currency', 'amount', 'category', 'expenseOn', 'status', 'createdBy', 'reviewNote']);
		case 'finance-audit':
			return _List_fromArray(
				['date', 'actor', 'details']);
		case 'applications':
			return _List_fromArray(
				['clientName', 'category', 'destination', 'stage', 'intakeDate', 'deadline', 'officer']);
		case 'checklist-templates':
			return _List_fromArray(
				['category', 'destination', 'requiredDocuments', 'optionalDocuments']);
		case 'tasks':
			return _List_fromArray(
				['recordName', 'assigneeName', 'status', 'priority', 'dueDate']);
		case 'history':
			return _List_fromArray(
				['actor', 'kind', 'date', 'note']);
		case 'documents':
			return _List_fromArray(
				['status', 'scanStatus', 'expiryWarning', 'expiresOn', 'reviewNote']);
		case 'mail':
			return _List_fromArray(
				['recipient', 'status', 'attempts', 'lastError', 'nextAttempt', 'sentAt']);
		case 'notifications':
			return _List_fromArray(
				['kind', 'status', 'date']);
		case 'ageing':
			return _List_fromArray(
				['stage', 'ageDays', 'overdueDays', 'staff']);
		case 'bottlenecks':
			return _List_fromArray(
				['cases', 'averageAgeDays', 'oldestDays']);
		case 'trends':
			return _List_fromArray(
				['date', 'openTasks', 'overdueTasks', 'openCases']);
		case 'reports':
			return _List_fromArray(
				['from', 'to', 'summary']);
		case 'security':
			return _List_fromArray(
				['created', 'expires']);
		case 'invoices':
			return _List_fromArray(
				['currency', 'amount', 'paid', 'balance', 'status', 'dueDate', 'description']);
		case 'appointments':
			return _List_fromArray(
				['startsAt', 'endsAt', 'location', 'status']);
		default:
			return _List_fromArray(
				['status', 'expires', 'kind', 'phone', 'email']);
	}
};
var $author$project$Features$emptyMessage = F2(
	function (section, query) {
		if (section === 'trends') {
			return 'No historical snapshots exist for this range. Enable the scheduler; history starts when snapshots are collected and cannot be reconstructed for earlier dates.';
		} else {
			if (A2(
				$elm$core$List$member,
				section,
				_List_fromArray(
					['reports', 'ageing', 'bottlenecks']))) {
				return 'There is no data for this range. Try a broader date range; an empty report does not mean the request failed.';
			} else {
				if (query !== '') {
					return 'Try another search, clear the filter, or check your record access.';
				} else {
					switch (section) {
						case 'checklist-templates':
							return 'No checklist templates match this view. An administrator can create a reusable checklist here.';
						case 'applications':
							return 'No applications match this view. Choose a client and complete the form to create their first application, or clear the search to see more records.';
						case 'documents':
							return 'Choose a record and add its document requirements. Uploaded files must pass scanning before review or download.';
						case 'mail':
							return 'No messages are visible yet. Invitations, reminders and contact emails appear here after they are queued.';
						case 'portal':
							return 'Choose a client to create a private, one-use sign-in link. Only approved files you explicitly share become available.';
						case 'notifications':
							return 'You have no notifications. Preferences determine which categories appear.';
						case 'tasks':
							return 'Create a task from Tasks or from a lead or client record.';
						default:
							return 'New records will appear here. Your permissions determine what you can see.';
					}
				}
			}
		}
	});
var $author$project$Ui$emptyState = F3(
	function (symbol, title, description) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('empty-state')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('empty-state-icon')
						]),
					_List_fromArray(
						[
							$author$project$Ui$icon(symbol)
						])),
					A2(
					$elm$html$Html$h3,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(description)
						]))
				]));
	});
var $author$project$Features$fields = function (section) {
	switch (section) {
		case 'sales':
			return _List_fromArray(
				[
					_Utils_Tuple3('From date', 'from', 'date'),
					_Utils_Tuple3('To date', 'to', 'date')
				]);
		case 'cashflow':
			return _List_fromArray(
				[
					_Utils_Tuple3('From date', 'from', 'date'),
					_Utils_Tuple3('To date', 'to', 'date')
				]);
		case 'balances':
			return _List_Nil;
		case 'finance-audit':
			return _List_Nil;
		case 'payment-history':
			return _List_fromArray(
				[
					_Utils_Tuple3('Reversal date', 'paidOn', 'date'),
					_Utils_Tuple3('Reason for reversal', 'reason', 'textarea')
				]);
		case 'periods':
			return _List_fromArray(
				[
					_Utils_Tuple3('Financial month', 'month', 'month'),
					_Utils_Tuple3('Reason for closing or reopening', 'reason', 'textarea')
				]);
		case 'reconciliation':
			return _List_fromArray(
				[
					_Utils_Tuple3('Bank account label', 'account', 'text'),
					_Utils_Tuple3('Currency', 'currency', 'PHP|USD|EUR|GBP|AUD|CAD|NZD'),
					_Utils_Tuple3('Statement CSV (transactionId,date,amount,reference,description)', 'csv', 'textarea'),
					_Utils_Tuple3('Matching or exclusion reason', 'reason', 'textarea')
				]);
		case 'payments':
			return _List_fromArray(
				[
					_Utils_Tuple3('Payment amount', 'amount', 'text'),
					_Utils_Tuple3('Payment / reversal date', 'paidOn', 'date'),
					_Utils_Tuple3('Payment method', 'method', 'Cash|Bank transfer|Card|Cheque|Other'),
					_Utils_Tuple3('Payment reference', 'reference', 'text'),
					_Utils_Tuple3('Reason for reversal', 'reason', 'textarea')
				]);
		case 'expenses':
			return _List_fromArray(
				[
					_Utils_Tuple3('Supplier / payee', 'supplier', 'text'),
					_Utils_Tuple3('Description', 'description', 'textarea'),
					_Utils_Tuple3('Expense category', 'category', 'text'),
					_Utils_Tuple3('Currency', 'currency', 'PHP|USD|EUR|GBP|AUD|CAD|NZD'),
					_Utils_Tuple3('Amount', 'amount', 'text'),
					_Utils_Tuple3('Expense date', 'expenseOn', 'date'),
					_Utils_Tuple3('Invoice / supplier reference', 'reference', 'text'),
					_Utils_Tuple3('Payment / reversal date', 'paidOn', 'date'),
					_Utils_Tuple3('Payment method', 'method', 'Cash|Bank transfer|Card|Cheque|Other'),
					_Utils_Tuple3('Payment reference', 'paymentReference', 'text'),
					_Utils_Tuple3('Review or reversal reason', 'reason', 'textarea')
				]);
		case 'applications':
			return _List_fromArray(
				[
					_Utils_Tuple3('Client', 'owner', 'client'),
					_Utils_Tuple3('Service / application type', 'category', 'Student Visa|Work Visa|Tourist Visa|Immigration Consultation|School Admission'),
					_Utils_Tuple3('Destination', 'destination', 'Canada|Australia|New Zealand|UAE|UK|Schengen'),
					_Utils_Tuple3('Stage', 'stage', 'Documents Under Review|Submitted|Decision Pending|Approved|Rejected'),
					_Utils_Tuple3('Intake date', 'intakeDate', 'date'),
					_Utils_Tuple3('Next deadline', 'deadline', 'date'),
					_Utils_Tuple3('Checklist template', 'template', 'template')
				]);
		case 'checklist-templates':
			return _List_fromArray(
				[
					_Utils_Tuple3('Checklist name', 'name', 'text'),
					_Utils_Tuple3('Application type', 'category', 'Any|Student Visa|Work Visa|Tourist Visa|Immigration Consultation|School Admission'),
					_Utils_Tuple3('Destination (blank for all)', 'destination', 'text'),
					_Utils_Tuple3('Required documents (one per line)', 'requiredDocuments', 'textarea'),
					_Utils_Tuple3('Optional documents (one per line)', 'optionalDocuments', 'textarea')
				]);
		case 'tasks':
			return _List_fromArray(
				[
					_Utils_Tuple3('Title', 'title', 'text'),
					_Utils_Tuple3('Description', 'description', 'textarea'),
					_Utils_Tuple3('Due date', 'dueDate', 'date'),
					_Utils_Tuple3('Priority', 'priority', 'Low|Medium|High|Urgent'),
					_Utils_Tuple3('Status', 'status', 'Pending|In Progress|Done'),
					_Utils_Tuple3('Assigned to', 'assignee', 'staff'),
					_Utils_Tuple3('Repeat every (days; blank for one time)', 'recurrenceDays', 'number')
				]);
		case 'history':
			return _List_fromArray(
				[
					_Utils_Tuple3('Record', 'owner', 'record'),
					_Utils_Tuple3('Note or conversation summary', 'note', 'textarea')
				]);
		case 'documents':
			return _List_fromArray(
				[
					_Utils_Tuple3('Record', 'owner', 'record'),
					_Utils_Tuple3('Required document', 'title', 'text'),
					_Utils_Tuple3('Required?', 'required', 'true|false'),
					_Utils_Tuple3('Review status', 'status', 'Missing|Received|Approved|Rejected'),
					_Utils_Tuple3('Expires on', 'expiresOn', 'date'),
					_Utils_Tuple3('Feedback for the client', 'reviewNote', 'textarea'),
					_Utils_Tuple3('Existing file to attach as a new version', 'document', 'document')
				]);
		case 'reminders':
			return _List_fromArray(
				[
					_Utils_Tuple3('Task', 'task', 'task'),
					_Utils_Tuple3('Days before deadline', 'daysBefore', 'number'),
					_Utils_Tuple3('Escalate to administrators after overdue days', 'escalateAfter', 'number'),
					_Utils_Tuple3('Email reminders enabled?', 'enabled', 'true|false')
				]);
		case 'merge':
			return _List_fromArray(
				[
					_Utils_Tuple3('Record type', 'entity', 'leads|clients'),
					_Utils_Tuple3('Source to archive', 'source', 'merge'),
					_Utils_Tuple3('Surviving record', 'target', 'merge'),
					_Utils_Tuple3('Type MERGE after reviewing the preview', 'confirmation', 'text')
				]);
		case 'reports':
			return _List_fromArray(
				[
					_Utils_Tuple3('From date', 'from', 'date'),
					_Utils_Tuple3('To date', 'to', 'date')
				]);
		case 'search':
			return _List_fromArray(
				[
					_Utils_Tuple3('View name', 'name', 'text'),
					_Utils_Tuple3('Records', 'entity', 'leads|clients|tasks|cases'),
					_Utils_Tuple3('Contains', 'query', 'text'),
					_Utils_Tuple3('Assigned to me?', 'mine', 'true|false'),
					_Utils_Tuple3('Overdue only?', 'overdue', 'true|false')
				]);
		case 'security':
			return _Utils_ap(
				_List_fromArray(
					[
						_Utils_Tuple3('Your current password', 'password', 'password'),
						_Utils_Tuple3('Your authenticator or recovery code', 'code', 'text')
					]),
				_List_fromArray(
					[
						_Utils_Tuple3('Reason for resetting another account’s authenticator', 'reason', 'textarea')
					]));
		case 'appointments':
			return _List_fromArray(
				[
					_Utils_Tuple3('Record', 'owner', 'record'),
					_Utils_Tuple3('Appointment', 'title', 'text'),
					_Utils_Tuple3('Staff member', 'assignee', 'staff'),
					_Utils_Tuple3('Starts (UTC)', 'startsAt', 'datetime-local'),
					_Utils_Tuple3('Ends (UTC)', 'endsAt', 'datetime-local'),
					_Utils_Tuple3('Location or meeting link', 'location', 'text'),
					_Utils_Tuple3('Status', 'status', 'Scheduled|Completed|Cancelled')
				]);
		case 'invoices':
			return _List_fromArray(
				[
					_Utils_Tuple3('Client', 'owner', 'client'),
					_Utils_Tuple3('Description', 'description', 'textarea'),
					_Utils_Tuple3('Currency', 'currency', 'PHP|USD|EUR|GBP|AUD|CAD|NZD'),
					_Utils_Tuple3('Amount', 'amount', 'text'),
					_Utils_Tuple3('Due date', 'dueDate', 'date'),
					_Utils_Tuple3('Status', 'status', 'Draft|Issued|Paid|Void')
				]);
		case 'portal':
			return _List_fromArray(
				[
					_Utils_Tuple3('Client', 'owner', 'client'),
					_Utils_Tuple3('Access duration (days)', 'days', 'number'),
					_Utils_Tuple3('Approved file to share', 'document', 'document')
				]);
		case 'notifications':
			return _List_fromArray(
				[
					_Utils_Tuple3('Task assignments', 'assignments', 'true|false'),
					_Utils_Tuple3('Upcoming deadlines', 'deadlines', 'true|false'),
					_Utils_Tuple3('Document rejections', 'documents', 'true|false'),
					_Utils_Tuple3('Overdue escalation', 'escalations', 'true|false'),
					_Utils_Tuple3('Reminder emails', 'emailEnabled', 'true|false')
				]);
		case 'mail':
			return _List_Nil;
		case 'ageing':
			return _List_fromArray(
				[
					_Utils_Tuple3('Created from', 'from', 'date'),
					_Utils_Tuple3('Created to', 'to', 'date')
				]);
		case 'bottlenecks':
			return _List_fromArray(
				[
					_Utils_Tuple3('Created from', 'from', 'date'),
					_Utils_Tuple3('Created to', 'to', 'date')
				]);
		case 'trends':
			return _List_fromArray(
				[
					_Utils_Tuple3('From', 'from', 'date'),
					_Utils_Tuple3('To', 'to', 'date')
				]);
		case 'communication':
			return _List_fromArray(
				[
					_Utils_Tuple3('Contact record', 'owner', 'record'),
					_Utils_Tuple3('Subject', 'subject', 'text'),
					_Utils_Tuple3('Message', 'message', 'textarea')
				]);
		default:
			return _List_Nil;
	}
};
var $author$project$Features$financeReport = F2(
	function (section, rows_) {
		var tableFor = F3(
			function (title_, keys, entries) {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card table-card')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(title_)
								])),
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('data-table')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$thead,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											A2(
												$elm$core$List$map,
												function (key) {
													return A2(
														$elm$html$Html$th,
														_List_fromArray(
															[
																$elm$html$Html$Attributes$scope('col')
															]),
														_List_fromArray(
															[
																$elm$html$Html$text(
																(key === 'title') ? 'Group' : $author$project$Features$fieldLabel(key))
															]));
												},
												keys))
										])),
									A2(
									$elm$html$Html$tbody,
									_List_Nil,
									A2(
										$elm$core$List$map,
										function (entry) {
											return A2(
												$elm$html$Html$tr,
												_List_Nil,
												A2(
													$elm$core$List$map,
													function (key) {
														return A2(
															$elm$html$Html$td,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text(
																	A2($author$project$Features$str, key, entry))
																]));
													},
													keys));
										},
										entries))
								]))
						]));
			});
		var moneyColumns = _Utils_ap(
			_List_fromArray(
				['currency', 'invoiced', 'collected']),
			_Utils_ap(
				(section === 'cashflow') ? _List_fromArray(
					['expenses', 'net']) : _List_Nil,
				_List_fromArray(
					['outstanding', 'overdue', 'legacyUndated'])));
		var currencyRows = A2(
			$elm$core$List$filter,
			function (entry) {
				return A2($author$project$Features$str, 'kind', entry) === 'Currency';
			},
			rows_);
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_Utils_ap(
				(section === 'sales') ? A2(
					$elm$core$List$map,
					function (kind) {
						return A3(
							tableFor,
							(kind === 'Source') ? 'Leads by source' : ((kind === 'Consultant') ? 'Leads by consultant' : 'Pipeline stages'),
							_List_fromArray(
								['title', 'leads', 'converted', 'conversionRate']),
							A2(
								$elm$core$List$filter,
								function (entry) {
									return _Utils_eq(
										A2($author$project$Features$str, 'kind', entry),
										kind);
								},
								rows_));
					},
					_List_fromArray(
						['Source', 'Consultant', 'Pipeline'])) : _List_Nil,
				_List_fromArray(
					[
						A3(tableFor, 'Amounts by currency', moneyColumns, currencyRows)
					])));
	});
var $author$project$Features$heading = function (section) {
	switch (section) {
		case 'sales':
			return _Utils_Tuple2('Sales report', 'Lead cohorts by source and consultant, conversion rates and pipeline stages. Archived records remain in financial history; merged duplicates are excluded. Invoiced and net receipts use their own posting dates; balances are current. Each currency is shown separately.');
		case 'payment-history':
			return _Utils_Tuple2('Searchable payment history', 'Search receipts by client, reference, recorder or receipt number. Every entry remains available through pagination. Select an unreversed receipt to correct it, or print its acknowledgement.');
		case 'periods':
			return _Utils_Tuple2('Financial period closing', 'Close completed months after bank reconciliation. Closed months reject backdated financial entries. Reopening requires an authorized user with company-wide access and an audit reason. Saved closing totals appear below.');
		case 'reconciliation':
			return _Utils_Tuple2('Bank statement reconciliation', 'Paste a statement CSV with transactionId,date,amount,reference,description columns. Credits are positive, debits negative. Select a bank entry, choose a matching recorded payment below and enter a reason. Exclude non-CRM entries explicitly with a reason.');
		case 'payments':
			return _Utils_Tuple2('Payments and history', 'Select an invoice below to record a full or partial payment. Overpayments are blocked. Open Payment history to reverse an incorrect receipt with a date and reason; its original entry remains visible. These records do not charge a card or move money.');
		case 'balances':
			return _Utils_Tuple2('Balances and overdue accounts', 'Current invoice totals, net payments and outstanding balances. Overdue amounts are unpaid balances past the due date. Use Payments to record receipts.');
		case 'expenses':
			return _Utils_Tuple2('Expenses and approvals', 'Submit an expense, select it for approval, then record its payment. Non-admin approvers cannot approve their own expenses. Posted payments are corrected through reversals. Clear the form to submit a new expense.');
		case 'cashflow':
			return _Utils_Tuple2('Receipts and expenses', 'Net payment entries received minus visible paid expenses for the selected period, grouped by currency. Company approvers see all expenses; other users see their own. Pending and approved-but-unpaid expenses are excluded. This is a cash activity report, not a profit or tax statement.');
		case 'finance-audit':
			return _Utils_Tuple2('Financial audit trail', 'Payment receipts, expense reviews and reversals retain their dates, references, reasons and the person who recorded them.');
		case 'applications':
			return _Utils_Tuple2('Applications', 'Each application belongs to a client. A client can have multiple applications. Create one here, or select an application below to update its stage and deadline.');
		case 'checklist-templates':
			return _Utils_Tuple2('Document checklist templates', 'Administrators maintain reusable document lists. Apply a matching template from a selected application. Existing requirements and reviews are preserved when a checklist is applied again.');
		case 'tasks':
			return _Utils_Tuple2('Edit and assign tasks', 'Select a task below to edit its deadline, owner and recurrence. A completed recurring task creates its next occurrence automatically.');
		case 'history':
			return _Utils_Tuple2('Client and application history', 'Keep conversations, decisions and next steps together. Notes are attributed to their author.');
		case 'documents':
			return _Utils_Tuple2('Document checklist and review', 'Create requirements, upload directly into an item, and record approval or feedback once scanning succeeds.');
		case 'reminders':
			return _Utils_Tuple2('Email reminders and escalation', 'Send deadline reminders to the assigned staff member and escalate overdue work to administrators.');
		case 'merge':
			return _Utils_Tuple2('Merge duplicate records', 'Preview both records before confirming. Children are preserved; the source is archived and its original fields remain available in the audit trail.');
		case 'reports':
			return _Utils_Tuple2('Management reports', 'Choose a date range. Lead conversions use the cohort created in that range; workload and overdue counts show the current position.');
		case 'search':
			return _Utils_Tuple2('Advanced search', 'Search contacts, phone numbers, tasks and cases. Save personal views for work such as your overdue cases.');
		case 'security':
			return _Utils_Tuple2('Account security', 'Set up a SHA-256 compatible authenticator, keep recovery codes offline, and review or revoke active sessions.');
		case 'appointments':
			return _Utils_Tuple2('Appointments and calendar', 'Schedule appointments in UTC. Overlapping appointments for the same staff member are prevented.');
		case 'invoices':
			return _Utils_Tuple2('Invoices', 'Create drafts and issue invoices. Issued amounts are locked. Record full or partial receipts in Payments; Paid status is calculated from the payment history.');
		case 'portal':
			return _Utils_Tuple2('Client portal access', 'Create a private, one-use sign-in link. Only explicitly shared, approved files become downloadable by the client.');
		case 'notifications':
			return _Utils_Tuple2('Notification centre', 'Review assignments, deadlines, document rejections and overdue work. Preferences hide selected categories and control reminder emails.');
		case 'mail':
			return _Utils_Tuple2('Email delivery', 'Track queue status and failures. Accepted by SMTP means the mail server accepted the message; inbox delivery is not confirmed.');
		case 'ageing':
			return _Utils_Tuple2('Application ageing', 'Review open cases, their age and overdue deadlines. Exports contain up to 10,000 rows; narrow the date range for larger datasets.');
		case 'bottlenecks':
			return _Utils_Tuple2('Application bottlenecks', 'Cases grouped by stage, with time in the current stage. Legacy cases without stage history use their creation date.');
		case 'trends':
			return _Utils_Tuple2('Historical workload', 'Daily snapshots begin when the scheduler is enabled. Today updates during the day; previous days retain their last recorded workload.');
		case 'communication':
			return _Utils_Tuple2('Email a contact', 'Send through the configured mail service. Delivery is queued and the conversation is recorded in the shared history.');
		default:
			return _Utils_Tuple2('Workspace', '');
	}
};
var $author$project$Features$mailHelp = function (status) {
	switch (status) {
		case 'Queued':
			return 'Waiting for the mail worker. If messages stay queued, ask an administrator to check the worker and SMTP configuration.';
		case 'Retry scheduled':
			return 'A delivery attempt failed. The worker will retry at the scheduled time.';
		case 'Sending':
			return 'The mail worker is sending this message.';
		case 'Failed':
			return 'Automatic attempts are exhausted. An administrator should correct the delivery problem, select this message, and request a retry.';
		case 'Accepted by SMTP':
			return 'Your mail server accepted this message. This does not confirm arrival in the recipient’s inbox.';
		default:
			return 'Check the status and next-attempt time for delivery progress.';
	}
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$rel = _VirtualDom_attribute('rel');
var $elm$core$Basics$round = _Basics_round;
var $author$project$Features$reportRow = function (item) {
	var n = function (key) {
		return A2(
			$elm$core$Result$withDefault,
			0,
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$field, key, $elm$json$Json$Decode$float),
				item));
	};
	var percentage = (!n('leads')) ? '0' : $elm$core$String$fromInt(
		$elm$core$Basics$round(
			(100 * n('converted')) / n('leads')));
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_Utils_ap(
			A2(
				$elm$core$List$map,
				function (_v0) {
					var key = _v0.a;
					var labelText = _v0.b;
					return A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$strong,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(labelText + ': ')
									])),
								$elm$html$Html$text(
								A2($author$project$Features$str, key, item))
							]));
				},
				_List_fromArray(
					[
						_Utils_Tuple2('leads', 'Leads in cohort'),
						_Utils_Tuple2('converted', 'Converted leads'),
						_Utils_Tuple2('openTasks', 'Open tasks'),
						_Utils_Tuple2('overdueTasks', 'Overdue tasks'),
						_Utils_Tuple2('completedCases', 'Cases completed'),
						_Utils_Tuple2('averageCaseDays', 'Average case days')
					])),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Conversion rate: ' + (percentage + '%'))
						]))
				])));
};
var $elm$html$Html$code = _VirtualDom_node('code');
var $author$project$Features$resultView = function (result) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card'),
				A2($elm$html$Html$Attributes$attribute, 'role', 'status')
			]),
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($author$project$Features$str, 'message', result))
						]))
				]),
			_Utils_ap(
				A2(
					$elm$core$List$filterMap,
					function (key) {
						var value_ = A2($author$project$Features$str, key, result);
						return (value_ === '') ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
							A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$strong,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												(key === 'secret') ? 'Authenticator key: ' : ((key === 'uri') ? 'Authenticator setup URI: ' : 'Private client sign-in link: '))
											])),
										A2(
										$elm$html$Html$code,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(value_)
											]))
									])));
					},
					_List_fromArray(
						['secret', 'uri', 'url'])),
				_Utils_ap(
					$elm$core$List$isEmpty(
						A2($author$project$Features$items, 'counts', result)) ? _List_Nil : A2(
						$elm$core$List$map,
						function (counts) {
							return A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2(
											$elm$core$String$join,
											' · ',
											A2(
												$elm$core$List$map,
												function (key) {
													return key + (': ' + A2($author$project$Features$str, key, counts));
												},
												_List_fromArray(
													['documents', 'tasks', 'cases', 'notes', 'activities', 'invoices']))))
									]));
						},
						A2($author$project$Features$items, 'counts', result)),
					A2(
						$elm$core$List$map,
						function (value_) {
							return A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$code,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(value_)
											]))
									]));
						},
						A2(
							$elm$core$Result$withDefault,
							_List_Nil,
							A2(
								$elm$json$Json$Decode$decodeValue,
								A2(
									$elm$json$Json$Decode$field,
									'recoveryCodes',
									$elm$json$Json$Decode$list($elm$json$Json$Decode$string)),
								result)))))));
};
var $elm$html$Html$Attributes$rows = function (n) {
	return A2(
		_VirtualDom_attribute,
		'rows',
		$elm$core$String$fromInt(n));
};
var $author$project$Ui$spinner = A2(
	$elm$html$Html$div,
	_List_fromArray(
		[
			$elm$html$Html$Attributes$class('loading-state'),
			A2($elm$html$Html$Attributes$attribute, 'role', 'status'),
			A2($elm$html$Html$Attributes$attribute, 'aria-live', 'polite')
		]),
	_List_fromArray(
		[
			A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('spinner'),
					A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
				]),
			_List_Nil),
			A2(
			$elm$html$Html$span,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Loading your workspace…')
				]))
		]));
var $elm$html$Html$Attributes$target = $elm$html$Html$Attributes$stringProperty('target');
var $elm$html$Html$textarea = _VirtualDom_node('textarea');
var $author$project$State$ReportOutput = function (a) {
	return {$: 33, a: a};
};
var $author$project$State$ReportSetting = F2(
	function (a, b) {
		return {$: 32, a: a, b: b};
	});
var $elm$html$Html$Attributes$checked = $elm$html$Html$Attributes$boolProperty('checked');
var $elm$html$Html$fieldset = _VirtualDom_node('fieldset');
var $elm$html$Html$legend = _VirtualDom_node('legend');
var $elm$html$Html$section = _VirtualDom_node('section');
var $author$project$Reports$view = F2(
	function (model, kind) {
		var setting = F3(
			function (labelText, key, fallback) {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$for('report-' + key)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(labelText)
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('report-' + key),
									$elm$html$Html$Attributes$class('input'),
									$elm$html$Html$Attributes$value(
									A3($author$project$Reports$get, model, key, fallback)),
									$elm$html$Html$Events$onInput(
									$author$project$State$ReportSetting(key))
								]),
							_List_Nil)
						]));
			});
		var rows_ = A2($author$project$Reports$reportRows, model, kind);
		var cols = A2($author$project$Reports$visible, model, kind);
		var choose = F4(
			function (labelText, key, fallback, choices) {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$for('report-' + key)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(labelText)
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('report-' + key),
									$elm$html$Html$Attributes$class('input'),
									$elm$html$Html$Attributes$value(
									A3($author$project$Reports$get, model, key, fallback)),
									$elm$html$Html$Events$onInput(
									$author$project$State$ReportSetting(key))
								]),
							A2(
								$elm$core$List$map,
								function (_v4) {
									var v = _v4.a;
									var l = _v4.b;
									return A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(v),
												$elm$html$Html$Attributes$selected(
												_Utils_eq(
													v,
													A3($author$project$Reports$get, model, key, fallback)))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(l)
											]));
								},
								choices))
						]));
			});
		return A2(
			$elm$html$Html$section,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('report-designer card'),
					A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Custom report designer')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h3,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Customize report and printing')
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('status-help')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Filter, sort and choose columns. Preview, CSV and printing use exactly the same rows and columns. Data is limited to 10,000 rows; narrow the date range when the limit is reached. Workload figures show the current position; trends use daily snapshots.')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('report-controls')
						]),
					_List_fromArray(
						[
							A3(setting, 'Report title', 'title', 'ECC Management report'),
							A3(setting, 'Subtitle / organization', 'subtitle', ''),
							A3(setting, 'Find staff, client or stage', 'filter', ''),
							A4(
							choose,
							'Sort by',
							'sort',
							'title',
							$author$project$Reports$columns(kind)),
							A4(
							choose,
							'Sort direction',
							'direction',
							'ascending',
							_List_fromArray(
								[
									_Utils_Tuple2('ascending', 'Ascending'),
									_Utils_Tuple2('descending', 'Descending')
								])),
							A4(
							choose,
							'Numeric filter',
							'metric',
							'',
							A2(
								$elm$core$List$cons,
								_Utils_Tuple2('', 'No numeric filter'),
								A2(
									$elm$core$List$filter,
									function (_v0) {
										var k = _v0.a;
										return !A2(
											$elm$core$List$member,
											k,
											_List_fromArray(
												['title', 'staff', 'stage', 'date']));
									},
									$author$project$Reports$columns(kind)))),
							A3(setting, 'Minimum value (inclusive)', 'minimum', '0'),
							A4(
							choose,
							'Paper',
							'paper',
							'A4',
							_List_fromArray(
								[
									_Utils_Tuple2('A4', 'A4'),
									_Utils_Tuple2('Letter', 'US Letter'),
									_Utils_Tuple2('Legal', 'US Legal')
								])),
							A4(
							choose,
							'Orientation',
							'orientation',
							'portrait',
							_List_fromArray(
								[
									_Utils_Tuple2('portrait', 'Portrait'),
									_Utils_Tuple2('landscape', 'Landscape')
								])),
							A4(
							choose,
							'Spacing',
							'density',
							'comfortable',
							_List_fromArray(
								[
									_Utils_Tuple2('comfortable', 'Comfortable'),
									_Utils_Tuple2('compact', 'Compact')
								])),
							A3(setting, 'Footer note', 'footer', 'Confidential · Internal use'),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-group')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$label,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$for('report-logo')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Header logo / picture (this session only)')
										])),
									A2(
									$elm$html$Html$input,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$id('report-logo'),
											$elm$html$Html$Attributes$type_('file'),
											$elm$html$Html$Attributes$accept('image/png,image/jpeg,image/webp')
										]),
									_List_Nil),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$type_('button'),
											$elm$html$Html$Attributes$class('btn btn-outline'),
											A2($elm$html$Html$Attributes$attribute, 'data-clear-report-logo', '')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Remove picture')
										]))
								]))
						])),
					A2(
					$elm$html$Html$fieldset,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('report-columns')
						]),
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$legend,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Visible columns')
								])),
						A2(
							$elm$core$List$map,
							function (_v1) {
								var key = _v1.a;
								var labelText = _v1.b;
								return A2(
									$elm$html$Html$label,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$input,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$type_('checkbox'),
													$elm$html$Html$Attributes$checked(
													A3($author$project$Reports$get, model, kind + (':hide:' + key), 'false') !== 'true'),
													$elm$html$Html$Events$onClick(
													A2(
														$author$project$State$ReportSetting,
														kind + (':hide:' + key),
														(A3($author$project$Reports$get, model, kind + (':hide:' + key), 'false') === 'true') ? 'false' : 'true'))
												]),
											_List_Nil),
											$elm$html$Html$text(labelText)
										]));
							},
							$author$project$Reports$columns(kind)))),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-actions')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-primary'),
									$elm$html$Html$Attributes$disabled(
									model.bB || ((model.q !== '') || ($elm$core$List$isEmpty(cols) || $elm$core$List$isEmpty(rows_)))),
									$elm$html$Html$Events$onClick(
									$author$project$State$ReportOutput('preview'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Print preview / Save PDF')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(
									model.bB || ((model.q !== '') || ($elm$core$List$isEmpty(cols) || $elm$core$List$isEmpty(rows_)))),
									$elm$html$Html$Events$onClick(
									$author$project$State$ReportOutput('csv'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Export customized CSV')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Events$onClick(
									$author$project$State$ReportOutput('save-template'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Save layout on this device')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Events$onClick(
									$author$project$State$ReportOutput('load-template'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Load saved layout')
								]))
						])),
					A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('status-help'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'status')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							model.bB ? 'Updating report…' : ($elm$core$String$fromInt(
								$elm$core$List$length(rows_)) + (' matching rows from ' + ($elm$core$String$fromInt(
								$elm$core$List$length(model.bm)) + ' loaded rows. Layout saving excludes report data, title, subtitle, search text, footer and pictures.'))))
						])),
					($elm$core$List$length(model.bm) >= 10000) ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('error-banner')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('10,000-row limit reached. Narrow the date range before printing or exporting.')
						])) : $elm$html$Html$text(''),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('table-scroll report-table')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('data-table')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$thead,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											A2(
												$elm$core$List$map,
												function (_v2) {
													var l = _v2.b;
													return A2(
														$elm$html$Html$th,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text(l)
															]));
												},
												cols))
										])),
									A2(
									$elm$html$Html$tbody,
									_List_Nil,
									A2(
										$elm$core$List$map,
										function (row) {
											return A2(
												$elm$html$Html$tr,
												_List_Nil,
												A2(
													$elm$core$List$map,
													function (_v3) {
														var key = _v3.a;
														return A2(
															$elm$html$Html$td,
															_List_Nil,
															_List_fromArray(
																[
																	$elm$html$Html$text(
																	A2($author$project$Reports$cell, key, row))
																]));
													},
													cols));
										},
										A2($elm$core$List$take, 100, rows_)))
								]))
						])),
					($elm$core$List$length(rows_) > 100) ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('status-help')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('On-screen preview shows the first 100 matches. Print preview and customized CSV include all matches.')
						])) : $elm$html$Html$text('')
				]));
	});
var $author$project$Features$view = F2(
	function (model, section) {
		var options = A2($author$project$Features$items, 'options', model.p);
		var isViewer = _Utils_eq(
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.H;
				},
				model.I),
			$elm$core$Maybe$Just('viewer'));
		var get = function (key) {
			return A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Dict$get, key, model.dh));
		};
		var extraUsers = A2(
			$elm$core$Result$withDefault,
			_List_Nil,
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2(
					$elm$json$Json$Decode$at,
					_List_fromArray(
						['security', 'users']),
					$elm$json$Json$Decode$list($elm$json$Json$Decode$value)),
				model.p));
		var canWrite = ((!isViewer) || A2(
			$elm$core$List$member,
			section,
			_List_fromArray(
				['security', 'search', 'notifications', 'sales', 'cashflow', 'balances', 'finance-audit']))) && ((section !== 'checklist-templates') || _Utils_eq(
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.H;
				},
				model.I),
			$elm$core$Maybe$Just('admin')));
		var control = function (_v8) {
			var labelText = _v8.a;
			var key = _v8.b;
			var kind = _v8.c;
			var selectedValue = get(key);
			var fieldError = A2(
				$elm$core$Maybe$withDefault,
				'',
				A2($elm$core$Dict$get, key, model.dg));
			var choices = A2($elm$core$String$contains, '|', kind) ? A2(
				$elm$core$List$map,
				function (v) {
					return _Utils_Tuple2(
						v,
						(v === 'true') ? 'Yes' : ((v === 'false') ? 'No' : ((v === 'all') ? 'All workspace records' : ((v === 'assigned') ? 'Assigned records' : ((v === 'allowed') ? 'Allowed' : ((v === 'denied') ? 'Denied' : v))))));
				},
				A2($elm$core$String$split, '|', kind)) : A2(
				$elm$core$List$map,
				function (item) {
					var v = A2($author$project$Features$str, 'value', item);
					return _Utils_Tuple2(
						A2(
							$elm$core$List$member,
							key,
							_List_fromArray(
								['assignee', 'task', 'source', 'target', 'template', 'payment'])) ? A2(
							$elm$core$Maybe$withDefault,
							v,
							$elm$core$List$head(
								$elm$core$List$reverse(
									A2($elm$core$String$split, ':', v)))) : v,
						A2($author$project$Features$str, 'label', item));
				},
				A2(
					$elm$core$List$filter,
					function (item) {
						var v = A2($author$project$Features$str, 'value', item);
						switch (kind) {
							case 'record':
								return A2(
									$elm$core$List$any,
									function (prefix) {
										return A2($elm$core$String$startsWith, prefix, v);
									},
									_List_fromArray(
										['lead:', 'client:', 'case:']));
							case 'merge':
								return A2(
									$elm$core$String$startsWith,
									(get('entity') === 'clients') ? 'client:' : 'lead:',
									v);
							default:
								return A2($elm$core$String$startsWith, kind + ':', v);
						}
					},
					options));
			var attrs = _List_fromArray(
				[
					$elm$html$Html$Attributes$class('input'),
					$elm$html$Html$Attributes$value(selectedValue),
					$elm$html$Html$Events$onInput(
					$author$project$State$FeatureField(key)),
					$elm$html$Html$Attributes$id('work-' + key),
					$elm$html$Html$Attributes$disabled(
					(!canWrite) || (model.u || (((section === 'expenses') && ((get('id') !== '') && A2(
						$elm$core$List$member,
						key,
						_List_fromArray(
							['supplier', 'description', 'category', 'currency', 'amount', 'expenseOn', 'reference'])))) || ((section === 'applications') && ((key === 'owner') && (get('id') !== '')))))),
					A2(
					$elm$html$Html$Attributes$attribute,
					'aria-invalid',
					(fieldError === '') ? 'false' : 'true'),
					A2($elm$html$Html$Attributes$attribute, 'aria-describedby', 'error-' + key)
				]);
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$for('work-' + key)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(labelText)
							])),
						(kind === 'textarea') ? A2(
						$elm$html$Html$textarea,
						_Utils_ap(
							attrs,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$rows(4)
								])),
						_List_Nil) : ((A2(
						$elm$core$List$member,
						kind,
						_List_fromArray(
							['record', 'staff', 'task', 'client', 'document', 'merge', 'template', 'payment'])) || A2($elm$core$String$contains, '|', kind)) ? A2(
						$elm$html$Html$select,
						attrs,
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value('')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Choose…')
									])),
							A2(
								$elm$core$List$map,
								function (_v6) {
									var v = _v6.a;
									var l = _v6.b;
									return A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(v),
												$elm$html$Html$Attributes$selected(
												_Utils_eq(v, selectedValue))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(l)
											]));
								},
								choices))) : A2(
						$elm$html$Html$input,
						_Utils_ap(
							attrs,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_(kind)
								])),
						_List_Nil)),
						A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$id('error-' + key),
								$elm$html$Html$Attributes$class('field-error'),
								A2($elm$html$Html$Attributes$attribute, 'role', 'status')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(fieldError)
							]))
					]));
		};
		var row = function (item) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('operation-row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$h3,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2($author$project$Features$str, 'title', item))
									])),
								(section === 'documents') ? A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('status-help')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Features$scanHelp(
											A2($author$project$Features$str, 'scanStatus', item)))
									])) : ((section === 'mail') ? A2(
								$elm$html$Html$p,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('status-help')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Features$mailHelp(
											A2($author$project$Features$str, 'status', item)))
									])) : $elm$html$Html$text('')),
								A2(
								$elm$core$List$member,
								section,
								_List_fromArray(
									['payments', 'expenses'])) ? A2(
								$elm$html$Html$div,
								_List_Nil,
								A2(
									$elm$core$List$map,
									function (entry) {
										return A2(
											$elm$html$Html$p,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('history-entry')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													'Entry #' + (A2($author$project$Features$str, 'id', entry) + (' · ' + (A2($author$project$Features$str, 'amount', entry) + (' · ' + (((A2($author$project$Features$str, 'date', entry) === '') ? 'Undated legacy payment' : A2($author$project$Features$str, 'date', entry)) + (' · ' + (A2($author$project$Features$str, 'method', entry) + (' · ' + (A2($author$project$Features$str, 'reference', entry) + (' · ' + (A2($author$project$Features$str, 'actor', entry) + (' · ' + (A2($author$project$Features$str, 'reason', entry) + ((A2($author$project$Features$str, 'reversesId', entry) === '') ? '' : (' · Reverses #' + A2($author$project$Features$str, 'reversesId', entry)))))))))))))))))
												]));
									},
									A2($author$project$Features$items, 'history', item))) : $elm$html$Html$text(''),
								A2(
								$elm$core$List$member,
								section,
								_List_fromArray(
									['payments', 'balances'])) ? A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('form-actions')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn btn-outline'),
												$elm$html$Html$Attributes$href(
												A2($author$project$Features$str, 'historyUrl', item))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Payment history')
											])),
										_Utils_eq(
										A2(
											$elm$json$Json$Decode$decodeValue,
											A2(
												$elm$json$Json$Decode$at,
												_List_fromArray(
													['permissions', 'export']),
												$elm$json$Json$Decode$bool),
											model.p),
										$elm$core$Result$Ok(true)) ? A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn btn-outline'),
												$elm$html$Html$Attributes$href(
												A2($author$project$Features$str, 'printUrl', item)),
												$elm$html$Html$Attributes$target('_blank'),
												$elm$html$Html$Attributes$rel('noopener')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Print invoice')
											])) : $elm$html$Html$text('')
									])) : $elm$html$Html$text(''),
								(section === 'payment-history') ? A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										(A2($author$project$Features$str, 'duplicateReference', item) === '1') ? A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('notice-banner')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('This reference is used by more than one receipt. Verify it against the bank statement.')
											])) : $elm$html$Html$text(''),
										_Utils_eq(
										A2(
											$elm$json$Json$Decode$decodeValue,
											A2(
												$elm$json$Json$Decode$at,
												_List_fromArray(
													['permissions', 'export']),
												$elm$json$Json$Decode$bool),
											model.p),
										$elm$core$Result$Ok(true)) ? A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn btn-outline'),
												$elm$html$Html$Attributes$href(
												A2($author$project$Features$str, 'printUrl', item)),
												$elm$html$Html$Attributes$target('_blank'),
												$elm$html$Html$Attributes$rel('noopener')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Print acknowledgement')
											])) : $elm$html$Html$text('')
									])) : $elm$html$Html$text(''),
								(section === 'expenses') ? A2(
								$elm$html$Html$div,
								_List_Nil,
								A2(
									$elm$core$List$map,
									function (file) {
										return A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													A2($author$project$Features$str, 'filename', file) + (' · ' + A2($author$project$Features$str, 'scanStatus', file))),
													((A2($author$project$Features$str, 'scanStatus', file) === 'Clean') && _Utils_eq(
													A2(
														$elm$json$Json$Decode$decodeValue,
														A2(
															$elm$json$Json$Decode$at,
															_List_fromArray(
																['permissions', 'download']),
															$elm$json$Json$Decode$bool),
														model.p),
													$elm$core$Result$Ok(true))) ? A2(
													$elm$html$Html$a,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$href(
															'/api/finance/attachments/' + A2($author$project$Features$str, 'id', file)),
															$elm$html$Html$Attributes$class('btn btn-outline')
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Download supporting file')
														])) : (((A2($author$project$Features$str, 'scanStatus', file) === 'Error') && _Utils_eq(
													A2(
														$elm$core$Maybe$map,
														function ($) {
															return $.H;
														},
														model.I),
													$elm$core$Maybe$Just('admin'))) ? A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('btn btn-outline'),
															$elm$html$Html$Events$onClick(
															$author$project$State$FeatureRun(
																'rescan-file:' + A2($author$project$Features$str, 'id', file)))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Retry scan')
														])) : $elm$html$Html$text(''))
												]));
									},
									A2($author$project$Features$items, 'files', item))) : $elm$html$Html$text(''),
								(section === 'periods') ? A2(
								$elm$html$Html$div,
								_List_Nil,
								A2(
									$elm$core$List$map,
									function (summary) {
										return A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													A2($author$project$Features$str, 'currency', summary) + (' · Invoiced ' + (A2($author$project$Features$str, 'invoiced', summary) + (' · Receipts ' + (A2($author$project$Features$str, 'receipts', summary) + (' · Paid expenses ' + A2($author$project$Features$str, 'expenses', summary)))))))
												]));
									},
									A2($author$project$Features$items, 'snapshot', item))) : $elm$html$Html$text(''),
								(section === 'reports') ? $author$project$Features$reportRow(item) : A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2(
											$elm$core$String$join,
											' · ',
											A2(
												$elm$core$List$filter,
												$elm$core$Basics$neq(''),
												A2(
													$elm$core$List$map,
													function (key) {
														var v = A2($author$project$Features$str, key, item);
														return (v === '') ? '' : ($author$project$Features$fieldLabel(key) + (': ' + v));
													},
													$author$project$Features$columns(section)))))
									])),
								(A2($author$project$Features$str, 'path', item) !== '') ? A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-outline'),
										$elm$html$Html$Attributes$href(
										A2($author$project$Features$str, 'path', item))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Open record')
									])) : $elm$html$Html$text(''),
								A2(
								$elm$html$Html$div,
								_List_Nil,
								A2(
									$elm$core$List$map,
									function (file) {
										return (A2($author$project$Features$str, 'scanStatus', file) === 'Clean') ? A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('btn btn-outline'),
													$elm$html$Html$Attributes$href(
													'/api/documents/' + (A2($author$project$Features$str, 'documentId', file) + '/download'))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													'Version ' + (A2($author$project$Features$str, 'version', file) + (' · ' + A2($author$project$Features$str, 'filename', file))))
												])) : A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													'Version ' + (A2($author$project$Features$str, 'version', file) + (' · ' + (A2($author$project$Features$str, 'filename', file) + (' · ' + A2($author$project$Features$str, 'scanStatus', file))))))
												]));
									},
									A2($author$project$Features$items, 'versions', item))),
								((section === 'documents') && canWrite) ? A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-outline'),
										$elm$html$Html$Attributes$disabled(
										(!canWrite) || (model.u || _Utils_eq(model.c_, $elm$core$Maybe$Nothing))),
										$elm$html$Html$Events$onClick(
										A2(
											$author$project$State$ChecklistUpload,
											A2(
												$elm$core$Maybe$withDefault,
												0,
												$elm$core$String$toInt(
													A2($author$project$Features$str, 'id', item))),
											A2(
												$elm$core$Maybe$withDefault,
												0,
												$elm$core$String$toInt(
													A2($author$project$Features$str, 'revision', item)))))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Upload selected file to this requirement')
									])) : $elm$html$Html$text('')
							])),
						(A2(
						$elm$core$List$member,
						section,
						_List_fromArray(
							['history', 'reports', 'communication', 'ageing', 'bottlenecks', 'trends', 'sales', 'cashflow', 'balances', 'finance-audit'])) || (!canWrite)) ? $elm$html$Html$text('') : A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-outline'),
								$elm$html$Html$Attributes$disabled(model.u),
								$elm$html$Html$Events$onClick(
								$author$project$State$FeatureEdit(item))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								(section === 'search') ? 'Select view' : 'Select / edit')
							]))
					]));
		};
		var action = F2(
			function (name, labelText) {
				return ((!canWrite) || (A2(
					$elm$core$List$member,
					section,
					_List_fromArray(
						['payments', 'expenses', 'payment-history', 'periods', 'reconciliation'])) && (!_Utils_eq(
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2(
							$elm$json$Json$Decode$at,
							_List_fromArray(
								['permissions', name]),
							$elm$json$Json$Decode$bool),
						model.p),
					$elm$core$Result$Ok(true))))) ? $elm$html$Html$text('') : A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn btn-primary'),
							$elm$html$Html$Attributes$disabled(model.u),
							$elm$html$Html$Events$onClick(
							A2(
								$elm$core$List$member,
								name,
								_List_fromArray(
									['close', 'reopen', 'match', 'unmatch', 'ignore', 'import', 'record', 'reverse', 'submit', 'approve', 'reject', 'pay', 'reverse-expense', 'confirm', 'suspend', 'revoke-user', 'reset-mfa', 'access', 'grant', 'revoke', 'retry'])) ? A2(
								$author$project$State$ConfirmRequested,
								'Confirm: ' + (labelText + '?'),
								$author$project$State$FeatureRun(name)) : $author$project$State$FeatureRun(name))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							model.u ? 'Working…' : labelText)
						]));
			});
		var actions = function () {
			switch (section) {
				case 'sales':
					return _List_fromArray(
						[
							A2(action, 'range', 'Update report')
						]);
				case 'cashflow':
					return _List_fromArray(
						[
							A2(action, 'range', 'Update report')
						]);
				case 'balances':
					return _List_Nil;
				case 'finance-audit':
					return _List_Nil;
				case 'payments':
					return _List_fromArray(
						[
							A2(action, 'record', 'Record payment')
						]);
				case 'payment-history':
					return ((get('reversed') === '1') || (get('reversesId') !== '')) ? _List_Nil : _List_fromArray(
						[
							A2(action, 'reverse', 'Reverse selected receipt')
						]);
				case 'periods':
					return _List_fromArray(
						[
							A2(action, 'close', 'Close month'),
							A2(action, 'reopen', 'Reopen month')
						]);
				case 'reconciliation':
					return (get('id') === '') ? _List_fromArray(
						[
							A2(action, 'import', 'Import bank statement')
						]) : _List_fromArray(
						[
							A2(action, 'match', 'Confirm selected match'),
							A2(action, 'unmatch', 'Unmatch transaction'),
							A2(action, 'ignore', 'Exclude transaction with reason')
						]);
				case 'expenses':
					return (get('id') === '') ? _List_fromArray(
						[
							A2(action, 'submit', 'Submit expense')
						]) : _List_fromArray(
						[
							A2(action, 'approve', 'Approve expense'),
							A2(action, 'reject', 'Reject expense'),
							A2(action, 'pay', 'Record expense payment'),
							A2(action, 'reverse-expense', 'Reverse expense payment')
						]);
				case 'applications':
					return _List_fromArray(
						[
							A2(
							action,
							'save',
							(get('id') === '') ? 'Create application' : 'Save application'),
							A2(action, 'checklist', 'Apply selected checklist')
						]);
				case 'tasks':
					return _Utils_ap(
						(model.ab !== '') ? _List_fromArray(
							[
								A2(action, 'create', 'Create task here')
							]) : _List_Nil,
						_List_fromArray(
							[
								A2(action, 'save', 'Save selected task')
							]));
				case 'history':
					return _List_fromArray(
						[
							A2(action, 'add', 'Add note')
						]);
				case 'merge':
					return _List_fromArray(
						[
							A2(action, 'preview', 'Preview merge'),
							A2(action, 'confirm', 'Confirm merge')
						]);
				case 'reports':
					return _List_fromArray(
						[
							A2(action, 'range', 'Update report')
						]);
				case 'ageing':
					return _List_fromArray(
						[
							A2(action, 'range', 'Update report')
						]);
				case 'bottlenecks':
					return _List_fromArray(
						[
							A2(action, 'range', 'Update report')
						]);
				case 'trends':
					return _List_fromArray(
						[
							A2(action, 'range', 'Update report')
						]);
				case 'mail':
					return _Utils_eq(
						A2(
							$elm$core$Maybe$map,
							function ($) {
								return $.H;
							},
							model.I),
						$elm$core$Maybe$Just('admin')) ? _List_fromArray(
						[
							A2(action, 'retry', 'Retry selected failed message')
						]) : _List_Nil;
				case 'notifications':
					return _List_fromArray(
						[
							A2(action, 'preferences', 'Save notification preferences'),
							A2(action, 'read', 'Mark selected notification read')
						]);
				case 'search':
					return _List_fromArray(
						[
							A2(action, 'views', 'Show saved views'),
							A2(action, 'save', 'Save personal view'),
							A2(action, 'apply', 'Open selected view'),
							A2(action, 'delete', 'Delete selected view')
						]);
				case 'security':
					return _List_fromArray(
						[
							A2(action, 'setup', 'Start authenticator setup'),
							A2(action, 'enable', 'Enable MFA'),
							A2(action, 'disable', 'Disable MFA'),
							A2(action, 'revoke', 'Revoke selected session')
						]);
				case 'documents':
					return _Utils_ap(
						_List_fromArray(
							[
								A2(action, 'save', 'Save checklist item')
							]),
						_Utils_ap(
							(model.ab === '') ? _List_fromArray(
								[
									A2(action, 'attach', 'Attach selected file as a new version')
								]) : _List_Nil,
							_Utils_eq(
								A2(
									$elm$core$Maybe$map,
									function ($) {
										return $.H;
									},
									model.I),
								$elm$core$Maybe$Just('admin')) ? _List_fromArray(
								[
									A2(action, 'rescan', 'Retry failed scan for selected item')
								]) : _List_Nil));
				case 'portal':
					return _List_fromArray(
						[
							A2(action, 'create', 'Create private sign-in link'),
							A2(action, 'grant', 'Share selected approved file'),
							A2(action, 'revoke', 'Revoke selected link')
						]);
				case 'communication':
					return _List_fromArray(
						[
							A2(action, 'send', 'Queue email')
						]);
				case 'invoices':
					return _List_fromArray(
						[
							A2(action, 'save', 'Save invoice'),
							A2(action, 'send', 'Email selected invoice')
						]);
				default:
					return _List_fromArray(
						[
							A2(action, 'save', 'Save changes')
						]);
			}
		}();
		var _v0 = $author$project$Features$heading(section);
		var title = _v0.a;
		var description = _v0.b;
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('page-head')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(title)
										])),
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('page-description')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(description)
										]))
								]))
						])),
					(section === 'appointments') ? A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn btn-outline'),
							$elm$html$Html$Attributes$href('/api/workspace/calendar.ics')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Download calendar (.ics)')
						])) : $elm$html$Html$text(''),
					(section === 'security') ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('notice-banner')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Keep recovery codes somewhere safe. Lost both your authenticator and codes? Another administrator with MFA can reset your account after verifying your identity. Password recovery does not bypass MFA.')
						])) : $elm$html$Html$text(''),
					(section === 'security') ? A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							_Utils_eq(
								A2(
									$elm$json$Json$Decode$decodeValue,
									A2(
										$elm$json$Json$Decode$at,
										_List_fromArray(
											['security', 'enabled']),
										$elm$json$Json$Decode$bool),
									model.p),
								$elm$core$Result$Ok(true)) ? 'Authenticator protection is enabled.' : 'Authenticator protection is not enabled. Administrators may be required to set it up before opening records.')
						])) : $elm$html$Html$text(''),
					(!A2(
					$elm$core$List$member,
					section,
					_List_fromArray(
						['security', 'reports', 'ageing', 'bottlenecks', 'trends', 'sales', 'cashflow']))) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$for('feature-search')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Search this list and record choices')
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('feature-search'),
									$elm$html$Html$Attributes$class('input'),
									$elm$html$Html$Attributes$value(model.aq),
									$elm$html$Html$Events$onInput($author$project$State$FeatureSearch),
									$elm$html$Html$Attributes$placeholder('Name, phone, task, case or file…')
								]),
							_List_Nil)
						])) : $elm$html$Html$text(''),
					(!canWrite) ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('notice-banner'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'status')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							(section === 'checklist-templates') ? 'Only administrators can edit templates. Available checklists can be applied from an application.' : 'You have view-only access. Ask a consultant or administrator to make changes.')
						])) : $elm$html$Html$text(''),
					A2(
					$elm$core$List$member,
					section,
					_List_fromArray(
						['reports', 'ageing', 'bottlenecks', 'trends', 'sales', 'cashflow'])) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('notice-banner')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Active date range: ' + (((model.aq === '') ? ((section === 'reports') ? 'last 30 days' : 'all dates') : A3($elm$core$String$replace, ',', ' to ', model.aq)) + ((section === 'reports') ? '. Summary exports use this same date range.' : '. CSV exports contain up to 10,000 rows; narrow the range for larger reports.')))
						])) : $elm$html$Html$text(''),
					(get('id') !== '') ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('summary-strip')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							'Selected: ' + ((get('title') !== '') ? get('title') : ((get('name') !== '') ? get('name') : ('item ' + get('id')))))
						])) : $elm$html$Html$text(''),
					((section === 'applications') && (model.ab === '')) ? $author$project$Features$applicationOverview(model) : $elm$html$Html$text(''),
					(section === 'search') ? A2(
					$elm$html$Html$details,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('saved-view-tools')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$summary,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Saved views (optional)')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('card feature-editor')
								]),
							_Utils_ap(
								A2(
									$elm$core$List$map,
									control,
									A2(
										$elm$core$List$filter,
										function (_v1) {
											var key = _v1.b;
											return ((model.ab === '') || (key !== 'document')) && ((section !== 'security') || ((key !== 'reason') || _Utils_eq(
												A2(
													$elm$core$Maybe$map,
													function ($) {
														return $.H;
													},
													model.I),
												$elm$core$Maybe$Just('admin'))));
										},
										$author$project$Features$fields(section))),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('form-actions')
											]),
										_Utils_ap(
											actions,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('btn btn-outline'),
															$elm$html$Html$Events$onClick($author$project$State$FeatureReset)
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('New / clear form')
														]))
												])))
									])))
						])) : A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card feature-editor')
						]),
					_Utils_ap(
						A2(
							$elm$core$List$map,
							control,
							A2(
								$elm$core$List$filter,
								function (_v2) {
									var key = _v2.b;
									return ((model.ab === '') || (key !== 'document')) && ((section !== 'security') || ((key !== 'reason') || _Utils_eq(
										A2(
											$elm$core$Maybe$map,
											function ($) {
												return $.H;
											},
											model.I),
										$elm$core$Maybe$Just('admin'))));
								},
								$author$project$Features$fields(section))),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('form-actions')
									]),
								_Utils_ap(
									actions,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$button,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('btn btn-outline'),
													$elm$html$Html$Events$onClick($author$project$State$FeatureReset)
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('New / clear form')
												]))
										])))
							]))),
					(model.b0 !== '') ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('feature-error'),
							$elm$html$Html$Attributes$class('error-banner'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(model.b0)
						])) : A2(
					$elm$html$Html$span,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('feature-error')
						]),
					_List_Nil),
					(section === 'payments') ? A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn btn-outline'),
							$elm$html$Html$Attributes$href('/work/payment-history')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Search all payment history')
						])) : $elm$html$Html$text(''),
					((section === 'reconciliation') && (get('id') !== '')) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Matching recorded entries')
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									'Selected: ' + get('matchLabel'))
								])),
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$for('reconcile-search')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Search matching receipts and expense payments')
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('reconcile-search'),
									$elm$html$Html$Attributes$class('input'),
									$elm$html$Html$Attributes$value(model.dk),
									$elm$html$Html$Events$onInput($author$project$State$FinanceCandidateQuery)
								]),
							_List_Nil),
							A2(
							$elm$html$Html$div,
							_List_Nil,
							A2(
								$elm$core$List$map,
								function (entry) {
									return A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn btn-outline'),
												$elm$html$Html$Events$onClick(
												$author$project$State$FinanceCandidateSelected(entry))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												A2($author$project$Features$str, 'label', entry) + (' · ' + A2($author$project$Features$str, 'date', entry)))
											]));
								},
								model.b1)),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(!model.dj),
									$elm$html$Html$Events$onClick(
									$author$project$State$FinanceCandidateStep(-1))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Previous matches')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(
									$elm$core$List$length(model.b1) < 50),
									$elm$html$Html$Events$onClick(
									$author$project$State$FinanceCandidateStep(1))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('More matches')
								]))
						])) : $elm$html$Html$text(''),
					((section === 'expenses') && ((get('id') !== '') && _Utils_eq(
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2(
							$elm$json$Json$Decode$at,
							_List_fromArray(
								['permissions', 'submit']),
							$elm$json$Json$Decode$bool),
						model.p),
					$elm$core$Result$Ok(true)))) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$for('financial-file')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Expense receipt or supporting document (PDF, PNG, JPEG; up to 10 MB)')
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('financial-file'),
									$elm$html$Html$Attributes$type_('file'),
									$elm$html$Html$Attributes$accept('application/pdf,image/png,image/jpeg'),
									A2(
									$elm$html$Html$Events$on,
									'change',
									A2(
										$elm$json$Json$Decode$map,
										$author$project$State$FinanceFile,
										A2(
											$elm$json$Json$Decode$at,
											_List_fromArray(
												['target', 'files']),
											A2($elm$json$Json$Decode$index, 0, $elm$file$File$decoder))))
								]),
							_List_Nil),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(
									model.u || _Utils_eq(model.dl, $elm$core$Maybe$Nothing)),
									$elm$html$Html$Events$onClick(
									A2(
										$author$project$State$FinanceUpload,
										A2(
											$elm$core$Maybe$withDefault,
											0,
											$elm$core$String$toInt(
												get('id'))),
										A2(
											$elm$core$Maybe$withDefault,
											0,
											$elm$core$String$toInt(
												get('expectedRevision')))))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Attach supporting document')
								]))
						])) : $elm$html$Html$text(''),
					((section === 'documents') && canWrite) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$for('checklist-file')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Upload directly into a checklist item (up to 25 MB)')
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('checklist-file'),
									$elm$html$Html$Attributes$type_('file'),
									A2(
									$elm$html$Html$Events$on,
									'change',
									A2(
										$elm$json$Json$Decode$map,
										$author$project$State$ChecklistFile,
										A2(
											$elm$json$Json$Decode$at,
											_List_fromArray(
												['target', 'files']),
											A2($elm$json$Json$Decode$index, 0, $elm$file$File$decoder))))
								]),
							_List_Nil),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									model.u ? 'Uploading or saving… Please wait before leaving this page.' : 'Choose a file, then upload it to its requirement. Pending scans block download and approval. Replace infected files; ask an administrator to retry failed scans.')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-actions')
								]),
							A2(
								$elm$core$List$map,
								function (_v3) {
									var filter = _v3.a;
									var labelText = _v3.b;
									return A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn btn-outline'),
												$elm$html$Html$Events$onClick(
												$author$project$State$FeatureSearch(filter))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(labelText)
											]));
								},
								_List_fromArray(
									[
										_Utils_Tuple2('review', 'Review queue'),
										_Utils_Tuple2('expiring', 'Expiring documents'),
										_Utils_Tuple2('outstanding', 'Outstanding requirements'),
										_Utils_Tuple2('', 'All documents')
									]))),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(model.u),
									$elm$html$Html$Events$onClick(
									$author$project$State$PageStep(0))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Refresh scan status')
								]))
						])) : $elm$html$Html$text(''),
					A2(
					$elm$core$List$member,
					section,
					_List_fromArray(
						['reports', 'ageing', 'bottlenecks', 'trends'])) ? A2($author$project$Reports$view, model, section) : $elm$html$Html$text(''),
					(A2(
					$elm$core$List$member,
					section,
					_List_fromArray(
						['sales', 'cashflow', 'payments', 'balances', 'expenses', 'finance-audit'])) && _Utils_eq(
					A2(
						$elm$json$Json$Decode$decodeValue,
						A2(
							$elm$json$Json$Decode$at,
							_List_fromArray(
								['permissions', 'export']),
							$elm$json$Json$Decode$bool),
						model.p),
					$elm$core$Result$Ok(true))) ? A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn btn-outline'),
							$elm$html$Html$Attributes$href(
							'/api/workspace/finance-export/' + (section + ('?q=' + $elm$url$Url$percentEncode(model.aq))))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Export CSV (up to 10,000 rows)')
						])) : $elm$html$Html$text(''),
					A2(
					$elm$core$List$member,
					section,
					_List_fromArray(
						['payments', 'balances'])) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('summary-strip')
						]),
					_Utils_ap(
						A2(
							$elm$core$List$map,
							function (summary) {
								return A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											A2($author$project$Features$str, 'currency', summary) + (' · Outstanding: ' + (A2($author$project$Features$str, 'outstanding', summary) + (' · Overdue: ' + A2($author$project$Features$str, 'overdue', summary)))))
										]));
							},
							A2($author$project$Features$items, 'summary', model.p)),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-outline'),
										$elm$html$Html$Events$onClick(
										$author$project$State$FeatureSearch('overdue'))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Overdue accounts')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-outline'),
										$elm$html$Html$Events$onClick(
										$author$project$State$FeatureSearch(''))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('All invoices')
									]))
							]))) : $elm$html$Html$text(''),
					(section === 'reports') ? A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn btn-outline'),
							$elm$html$Html$Attributes$href(
							'/api/workspace/reports.csv?q=' + $elm$url$Url$percentEncode(model.aq))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Export original summary CSV')
						])) : $elm$html$Html$text(''),
					(section === 'documents') ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('summary-strip')
						]),
					A2(
						$elm$core$List$map,
						function (summary) {
							return A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										'Required: ' + (A2($author$project$Features$str, 'required', summary) + (' · Outstanding: ' + (A2($author$project$Features$str, 'outstanding', summary) + (' · Awaiting review: ' + (A2($author$project$Features$str, 'review', summary) + (' · Expiring: ' + A2($author$project$Features$str, 'expiring', summary))))))))
									]));
						},
						A2($author$project$Features$items, 'summary', model.p))) : $elm$html$Html$text(''),
					A2(
					$elm$core$List$member,
					section,
					_List_fromArray(
						['ageing', 'bottlenecks', 'trends'])) ? A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn btn-outline'),
							$elm$html$Html$Attributes$href(
							'/api/workspace/report-export/' + (section + ('?q=' + $elm$url$Url$percentEncode(model.aq))))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Export original CSV')
						])) : $elm$html$Html$text(''),
					_Utils_eq(
					A2(
						$elm$json$Json$Decode$decodeValue,
						$elm$json$Json$Decode$null(0),
						model.bd),
					$elm$core$Result$Ok(0)) ? $elm$html$Html$text('') : $author$project$Features$resultView(model.bd),
					model.bB ? $author$project$Ui$spinner : (($elm$core$List$isEmpty(model.bm) && (!A2(
					$elm$core$List$member,
					section,
					_List_fromArray(
						['communication', 'security'])))) ? A3(
					$author$project$Ui$emptyState,
					'check',
					'No matching records',
					A2($author$project$Features$emptyMessage, section, model.aq)) : (A2(
					$elm$core$List$member,
					section,
					_List_fromArray(
						['sales', 'cashflow'])) ? A2($author$project$Features$financeReport, section, model.bm) : (A2(
					$elm$core$List$member,
					section,
					_List_fromArray(
						['reports', 'ageing', 'bottlenecks', 'trends'])) ? $elm$html$Html$text('') : A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('operations-list')
						]),
					A2($elm$core$List$map, row, model.bm))))),
					(section === 'search') ? A2(
					$elm$html$Html$div,
					_List_Nil,
					A2(
						$elm$core$List$map,
						row,
						A2(
							$elm$core$Result$withDefault,
							_List_Nil,
							A2(
								$elm$json$Json$Decode$decodeValue,
								$elm$json$Json$Decode$list($elm$json$Json$Decode$value),
								model.bd)))) : $elm$html$Html$text(''),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					A2(
						$elm$core$List$map,
						row,
						A2($author$project$Features$items, 'results', model.bd))),
					((section === 'security') && _Utils_eq(
					A2(
						$elm$core$Maybe$map,
						function ($) {
							return $.H;
						},
						model.I),
					$elm$core$Maybe$Just('admin'))) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card')
						]),
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$h3,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Team access')
								])),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Select an account, choose its record access and privileges, then enter your current password above. Administrators retain full access; Viewers remain read-only. The server’s assigned-only setting always takes precedence.')
									])),
							_Utils_ap(
								A2(
									$elm$core$List$map,
									function (item) {
										return A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('operation-row')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$span,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text(
															A2($author$project$Features$str, 'name', item) + (' · ' + (A2($author$project$Features$str, 'role', item) + ((A2($author$project$Features$str, 'suspended', item) === '1') ? ' · Suspended' : ' · Active'))))
														])),
													A2(
													$elm$html$Html$button,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('btn btn-outline'),
															$elm$html$Html$Attributes$disabled(model.u),
															$elm$html$Html$Events$onClick(
															$author$project$State$FeatureEdit(item))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Select account')
														]))
												]));
									},
									extraUsers),
								_Utils_ap(
									A2(
										$elm$core$List$map,
										control,
										A2(
											$elm$core$List$cons,
											_Utils_Tuple3('Record access', 'accessLevel', 'all|assigned'),
											A2(
												$elm$core$List$map,
												function (_v4) {
													var key = _v4.a;
													var labelText = _v4.b;
													return _Utils_Tuple3(labelText, key, 'allowed|denied');
												},
												_List_fromArray(
													[
														_Utils_Tuple2('finance_periods', 'Close and reopen financial months'),
														_Utils_Tuple2('finance_reconcile', 'Reconcile company bank statements'),
														_Utils_Tuple2('sales_view', 'View sales reports'),
														_Utils_Tuple2('finance_view', 'View invoices, payments and financial reports'),
														_Utils_Tuple2('payments_record', 'Record and reverse client payments'),
														_Utils_Tuple2('expenses_record', 'Submit expenses and record expense payments'),
														_Utils_Tuple2('expenses_approve', 'Approve, reject and reverse company expenses'),
														_Utils_Tuple2('edit', 'Create and edit records'),
														_Utils_Tuple2('delete', 'Delete, archive and bulk update records'),
														_Utils_Tuple2('download', 'Download files and photos'),
														_Utils_Tuple2('export', 'Export records and calendars'),
														_Utils_Tuple2('email', 'Send email to contacts'),
														_Utils_Tuple2('portal', 'Manage client portal access')
													])))),
									_Utils_eq(
										A2(
											$elm$core$Maybe$map,
											function ($) {
												return $.H;
											},
											model.I),
										$elm$core$Maybe$Just('admin')) ? _List_fromArray(
										[
											A2(action, 'access', 'Save access and privileges'),
											A2(action, 'suspend', 'Suspend selected account'),
											A2(action, 'resume', 'Resume selected account'),
											A2(action, 'revoke-user', 'Revoke selected account sessions'),
											A2(action, 'reset-mfa', 'Reset selected account’s authenticator')
										]) : _List_Nil))))) : $elm$html$Html$text('')
				]));
	});
var $author$project$Features$embedded = F2(
	function (model, cid) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('inline-workspace'),
					A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Client and case work')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h2,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Work on this record or case')
						])),
					A2(
					$elm$html$Html$label,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$for('case-work-scope')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Scope')
						])),
					A2(
					$elm$html$Html$select,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$id('case-work-scope'),
							$elm$html$Html$Attributes$class('input'),
							$elm$html$Html$Attributes$disabled(model.bg === 'applications'),
							$elm$html$Html$Attributes$value(model.ab),
							$elm$html$Html$Events$onInput($author$project$State$InlineOwner)
						]),
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$option,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$value(
									'client:' + $elm$core$String$fromInt(cid)),
									$elm$html$Html$Attributes$selected(
									_Utils_eq(
										model.ab,
										'client:' + $elm$core$String$fromInt(cid)))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Whole client')
								])),
						A2(
							$elm$core$List$map,
							function (c) {
								return A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value(
											'case:' + $elm$core$String$fromInt(c.bu)),
											$elm$html$Html$Attributes$selected(
											_Utils_eq(
												model.ab,
												'case:' + $elm$core$String$fromInt(c.bu)))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											A2($elm$core$Maybe$withDefault, 'Application', c.cX) + (' · ' + (c.dO + (' · ' + $elm$core$String$fromInt(c.bu)))))
										]));
							},
							A2(
								$elm$core$Maybe$withDefault,
								_List_Nil,
								A2(
									$elm$core$Maybe$map,
									function ($) {
										return $.cW;
									},
									model.c$))))),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-actions'),
							A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Client work sections')
						]),
					A2(
						$elm$core$List$map,
						function (_v0) {
							var section = _v0.a;
							var labelText = _v0.b;
							return A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(
										_Utils_eq(model.bg, section) ? 'btn btn-primary' : 'btn btn-outline'),
										A2(
										$elm$html$Html$Attributes$attribute,
										'aria-pressed',
										_Utils_eq(model.bg, section) ? 'true' : 'false'),
										$elm$html$Html$Events$onClick(
										$author$project$State$InlineSection(section))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(labelText)
									]));
						},
						_List_fromArray(
							[
								_Utils_Tuple2('applications', 'Applications'),
								_Utils_Tuple2('tasks', 'Edit tasks'),
								_Utils_Tuple2('history', 'Conversation history'),
								_Utils_Tuple2('documents', 'Document checklist')
							]))),
					A2(
					$elm$html$Html$details,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$summary,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Scheduling and billing')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('form-actions')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-outline'),
											$elm$html$Html$Attributes$href('/work/appointments')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Appointments')
										])),
									_Utils_eq(
									A2(
										$elm$core$Maybe$map,
										function ($) {
											return $.H;
										},
										model.I),
									$elm$core$Maybe$Just('admin')) ? A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-outline'),
											$elm$html$Html$Attributes$href('/work/invoices')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Invoices')
										])) : $elm$html$Html$text('')
								]))
						])),
					A2($author$project$Features$view, model, model.bg),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-actions')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(!model.dB),
									$elm$html$Html$Events$onClick(
									$author$project$State$PageStep(-1))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Previous work page')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(
									$elm$core$List$length(model.bm) < 50),
									$elm$html$Html$Events$onClick(
									$author$project$State$PageStep(1))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Next work page')
								]))
						]))
				]));
	});
var $author$project$Ui$fmtDate = function (md) {
	return A2(
		$elm$core$Maybe$withDefault,
		'—',
		A2(
			$elm$core$Maybe$map,
			$elm$core$String$left(10),
			md));
};
var $author$project$State$UpdateAddTask = function (a) {
	return {$: 117, a: a};
};
var $author$project$Views$plainOptions = $elm$core$List$map(
	function (s) {
		return _Utils_Tuple2(s, s);
	});
var $author$project$Types$priorities = _List_fromArray(
	['Low', 'Medium', 'High']);
var $author$project$Views$selectFieldMsg = F4(
	function (lbl, opts, current, onChange) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('filter-group')
				]),
			_List_fromArray(
				[
					(lbl === '') ? A2($elm$html$Html$span, _List_Nil, _List_Nil) : A2(
					$elm$html$Html$label,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(lbl)
						])),
					A2(
					$elm$html$Html$select,
					_List_fromArray(
						[
							$elm$html$Html$Events$onInput(onChange)
						]),
					A2(
						$elm$core$List$map,
						function (_v0) {
							var v = _v0.a;
							var optLbl = _v0.b;
							return A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value(v),
										$elm$html$Html$Attributes$selected(
										_Utils_eq(v, current))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(optLbl)
									]));
						},
						opts))
				]));
	});
var $author$project$Views$taskComposer = F2(
	function (model, submitMsg) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('inline-form'),
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '10px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-group'),
							A2($elm$html$Html$Attributes$style, 'flex', '2')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('input'),
									$elm$html$Html$Attributes$placeholder('New task title…'),
									$elm$html$Html$Attributes$value(model.f.Z),
									$elm$html$Html$Events$onInput(
									function (v) {
										return $author$project$State$UpdateAddTask(
											function (f) {
												return _Utils_update(
													f,
													{Z: v});
											});
									})
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('date'),
									$elm$html$Html$Attributes$class('input'),
									$elm$html$Html$Attributes$value(model.f.aC),
									$elm$html$Html$Events$onInput(
									function (v) {
										return $author$project$State$UpdateAddTask(
											function (f) {
												return _Utils_update(
													f,
													{aC: v});
											});
									})
								]),
							_List_Nil)
						])),
					A4(
					$author$project$Views$selectFieldMsg,
					'',
					$author$project$Views$plainOptions($author$project$Types$priorities),
					model.f.a$,
					function (v) {
						return $author$project$State$UpdateAddTask(
							function (f) {
								return _Utils_update(
									f,
									{a$: v});
							});
					}),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$disabled(
							$author$project$Views$isReadOnly(model)),
							$elm$html$Html$Attributes$class('btn btn-sm btn-primary'),
							$elm$html$Html$Events$onClick(submitMsg)
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Add Task')
						]))
				]));
	});
var $author$project$State$TaskDeleted = function (a) {
	return {$: 114, a: a};
};
var $author$project$State$TaskStatusPicked = F2(
	function (a, b) {
		return {$: 112, a: a, b: b};
	});
var $author$project$Ui$priorityBadge = function (priority) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				'task-priority-badge ' + $elm$core$String$toLower(priority))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(priority)
			]));
};
var $author$project$Types$taskStatuses = _List_fromArray(
	['Pending', 'In Progress', 'Done']);
var $author$project$Views$taskRows = F2(
	function (model, tasks) {
		return $elm$core$List$isEmpty(tasks) ? $author$project$Ui$emptyNote('No tasks yet.') : A2(
			$elm$html$Html$div,
			_List_Nil,
			A2(
				$elm$core$List$map,
				function (t) {
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('task-row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$disabled(
										$author$project$Views$isReadOnly(model)),
										A2($elm$html$Html$Attributes$style, 'padding', '4px'),
										A2($elm$html$Html$Attributes$style, 'border-radius', '6px'),
										A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Status for ' + t.Z),
										$elm$html$Html$Events$onInput(
										$author$project$State$TaskStatusPicked(t.bu))
									]),
								A2(
									$elm$core$List$map,
									function (s) {
										return A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value(s),
													$elm$html$Html$Attributes$selected(
													_Utils_eq(s, t.dR))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(s)
												]));
									},
									$author$project$Types$taskStatuses)),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(
										(t.dR === 'Done') ? 'done-title' : '')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(t.Z)
									])),
								$author$project$Ui$priorityBadge(t.a$),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('activity-date')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										$author$project$Ui$fmtDate(t.aC))
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$disabled(
										$author$project$Views$isReadOnly(model)),
										$elm$html$Html$Attributes$class('btn btn-sm btn-outline'),
										$elm$html$Html$Events$onClick(
										A2(
											$author$project$State$ConfirmRequested,
											'Delete this task? This action cannot be undone.',
											$author$project$State$TaskDeleted(t.bu)))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('✕')
									]))
							]));
				},
				tasks));
	});
var $author$project$Views$clientDetailView = F2(
	function (model, cid) {
		var _v0 = model.c$;
		if (_v0.$ === 1) {
			return $author$project$Ui$spinner;
		} else {
			var cd = _v0.a;
			var caseRow = function (cr) {
				return A2(
					$elm$html$Html$tr,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$td,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$attribute, 'data-label', 'Service')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2($elm$core$Maybe$withDefault, '—', cr.cX))
								])),
							A2(
							$elm$html$Html$td,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$attribute, 'data-label', 'Destination')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2($elm$core$Maybe$withDefault, '—', cr.bb))
								])),
							A2(
							$elm$html$Html$td,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$attribute, 'data-label', 'Stage')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('tag tag-stage-blue')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(cr.dO)
										]))
								])),
							A2(
							$elm$html$Html$td,
							_List_fromArray(
								[
									A2($elm$html$Html$Attributes$attribute, 'data-label', 'Deadline')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$author$project$Ui$fmtDate(cr.aT))
								])),
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$disabled(
											$author$project$Views$isReadOnly(model)),
											$elm$html$Html$Attributes$class('btn btn-sm btn-outline'),
											$elm$html$Html$Events$onClick(
											$author$project$State$OpenCaseForm(
												$elm$core$Maybe$Just(cr)))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Edit')
										]))
								])),
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$disabled(
											$author$project$Views$isReadOnly(model)),
											$elm$html$Html$Attributes$class('btn btn-sm btn-danger'),
											$elm$html$Html$Events$onClick(
											A2(
												$author$project$State$ConfirmRequested,
												'Delete this case? This action cannot be undone.',
												$author$project$State$DeleteCaseClicked(cr.bu)))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Delete')
										]))
								]))
						]));
			};
			var c = cd.ap;
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('client-detail-page')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('back-link'),
								$elm$html$Html$Attributes$href('/clients')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('← Back to Clients')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('page-head')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h2,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(c.aV)
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('lead-detail-badges')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('tag tag-id')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(c.ce)
													]))
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$disabled(
												$author$project$Views$isReadOnly(model)),
												$elm$html$Html$Attributes$class('btn'),
												$elm$html$Html$Events$onClick(
												$author$project$State$OpenCaseForm($elm$core$Maybe$Nothing))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('+ Add Application')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$disabled(
												$author$project$Views$isReadOnly(model)),
												$elm$html$Html$Attributes$class('btn'),
												$elm$html$Html$Events$onClick(
												$author$project$State$OpenClientEditor(c.bu))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Edit')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$disabled(
												$author$project$Views$isReadOnly(model)),
												$elm$html$Html$Attributes$class('btn btn-danger'),
												$elm$html$Html$Events$onClick(
												A2(
													$author$project$State$ConfirmRequested,
													'Move this client to the archive? Its cases, documents and history will be preserved.',
													$author$project$State$DeleteClientConfirmed(c.bu)))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Delete')
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('detail-grid')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('card')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('section-head')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h3,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Details')
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('kv-grid')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('kv')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Email')
															])),
														A2(
														$elm$html$Html$div,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$core$Maybe$withDefault,
																$elm$html$Html$text('—'),
																A2(
																	$elm$core$Maybe$map,
																	function (email) {
																		return A2(
																			$elm$html$Html$a,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$href('mailto:' + email)
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text(email)
																				]));
																	},
																	c.J))
															]))
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('kv')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Phone')
															])),
														A2(
														$elm$html$Html$div,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$core$Maybe$withDefault,
																$elm$html$Html$text('—'),
																A2(
																	$elm$core$Maybe$map,
																	function (phone) {
																		return A2(
																			$elm$html$Html$a,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$href('tel:' + phone)
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text(phone)
																				]));
																	},
																	c.ci))
															]))
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('kv')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Case Officer')
															])),
														A2(
														$elm$html$Html$div,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text(
																A2($elm$core$Maybe$withDefault, '—', c.cV))
															]))
													])),
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('kv')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$div,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text('Since')
															])),
														A2(
														$elm$html$Html$div,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text(
																$author$project$Ui$fmtDateTime(c.aA))
															]))
													]))
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('card table-card')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('section-head')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h3,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Applications')
													]))
											])),
										$elm$core$List$isEmpty(cd.cW) ? $author$project$Ui$emptyNote('No applications yet — add one.') : A2(
										$elm$html$Html$table,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('data-table client-applications-table')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$thead,
												_List_Nil,
												_List_fromArray(
													[
														A2(
														$elm$html$Html$tr,
														_List_Nil,
														_List_fromArray(
															[
																A2(
																$elm$html$Html$th,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$scope('col')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Service')
																	])),
																A2(
																$elm$html$Html$th,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$scope('col')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Destination')
																	])),
																A2(
																$elm$html$Html$th,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$scope('col')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Stage')
																	])),
																A2(
																$elm$html$Html$th,
																_List_fromArray(
																	[
																		$elm$html$Html$Attributes$scope('col')
																	]),
																_List_fromArray(
																	[
																		$elm$html$Html$text('Deadline')
																	])),
																A2($elm$html$Html$th, _List_Nil, _List_Nil),
																A2($elm$html$Html$th, _List_Nil, _List_Nil)
															]))
													])),
												A2(
												$elm$html$Html$tbody,
												_List_Nil,
												A2($elm$core$List$map, caseRow, cd.cW))
											]))
									]))
							])),
						A2($author$project$Features$clientNextSteps, model, c.bu),
						A2($author$project$Features$clientPhotoCard, model, c.bu),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('detail-grid'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '16px')
							]),
						_List_fromArray(
							[
								A3(
								$author$project$Views$documentsCard,
								model,
								cd.bX,
								$author$project$State$UploadClientDocClicked(cd.ap.bu)),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('card'),
										$elm$html$Html$Attributes$id('client-tasks')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('section-head')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h3,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Tasks & follow-ups')
													])),
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('btn btn-sm btn-outline'),
														$elm$html$Html$Events$onClick(
														$author$project$State$NavigateTo('/tasks'))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Manage tasks ↗')
													]))
											])),
										A2(
										$author$project$Views$taskComposer,
										model,
										$author$project$State$SubmitClientTask(cd.ap.bu)),
										A2($author$project$Views$taskRows, model, cd.aj)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('card')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h3,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Journey history')
											])),
										$elm$core$List$isEmpty(cd.bJ) ? $author$project$Ui$emptyNote('Activity will appear here as the relationship grows.') : A2(
										$elm$html$Html$div,
										_List_Nil,
										A2(
											$elm$core$List$map,
											function (activity) {
												return A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('activity-item')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$span,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('activity-date')
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text(activity.c5)
																])),
															$elm$html$Html$text(
															A2($elm$core$Maybe$withDefault, '', activity.aU))
														]));
											},
											cd.bJ))
									]))
							])),
						A2($author$project$Features$embedded, model, cid),
						function () {
						var _v1 = model.k;
						if (!_v1.$) {
							var cf = _v1.a;
							return A3($author$project$Views$caseModal, model, cf, cd);
						} else {
							return A2($elm$html$Html$div, _List_Nil, _List_Nil);
						}
					}()
					]));
		}
	});
var $author$project$State$ClientSearchChanged = function (a) {
	return {$: 122, a: a};
};
var $author$project$State$OpenAddClient = {$: 123};
var $author$project$State$CloseClientForm = {$: 124};
var $author$project$State$SubmitClientForm = {$: 126};
var $author$project$State$UpdateClientForm = function (a) {
	return {$: 125, a: a};
};
var $author$project$Views$clientFormModal = function (model) {
	var title = function () {
		var _v0 = model.Q;
		if (!_v0.$) {
			return 'Edit Client';
		} else {
			return 'Add Client';
		}
	}();
	var f = model.g;
	return A2(
		$author$project$Ui$modal,
		title,
		A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A6(
					$author$project$Views$checkedInputField,
					model,
					'fullName',
					'Full Name *',
					f.aV,
					'text',
					function (v) {
						return $author$project$State$UpdateClientForm(
							function (g) {
								return _Utils_update(
									g,
									{aV: v});
							});
					}),
					A6(
					$author$project$Views$checkedInputField,
					model,
					'email',
					'Email',
					f.J,
					'email',
					function (v) {
						return $author$project$State$UpdateClientForm(
							function (g) {
								return _Utils_update(
									g,
									{J: v});
							});
					}),
					A4(
					$author$project$Ui$inputField,
					'Phone',
					f.ci,
					'tel',
					function (v) {
						return $author$project$State$UpdateClientForm(
							function (g) {
								return _Utils_update(
									g,
									{ci: v});
							});
					}),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Case Officer')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									function (v) {
										return $author$project$State$UpdateClientForm(
											function (g) {
												return _Utils_update(
													g,
													{cg: v});
											});
									})
								]),
							A2(
								$elm$core$List$cons,
								A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('— none —')
										])),
								A2(
									$elm$core$List$map,
									function (u) {
										return A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value(
													$elm$core$String$fromInt(u.bu)),
													$elm$html$Html$Attributes$selected(
													_Utils_eq(
														A2(
															$elm$core$Maybe$withDefault,
															'',
															A2(
																$elm$core$Maybe$map,
																$elm$core$String$fromInt,
																$elm$core$Maybe$Just(u.bu))),
														f.cg))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(u.x)
												]));
									},
									model.al)))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '14px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$disabled(
									$author$project$Views$isReadOnly(model)),
									$elm$html$Html$Attributes$class('btn btn-primary'),
									$elm$html$Html$Events$onClick($author$project$State$SubmitClientForm)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Save')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Events$onClick($author$project$State$CloseClientForm)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Cancel')
								]))
						]))
				])));
};
var $author$project$Api$exportCsvUrl = F2(
	function (ctx, kind) {
		return ctx.ao + ('/api/export/' + (kind + '.csv'));
	});
var $author$project$Views$clientsView = function (model) {
	var row = function (c) {
		return A2(
			$elm$html$Html$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('contact-identity'),
									$elm$html$Html$Attributes$href(
									'/clients/' + $elm$core$String$fromInt(c.bu))
								]),
							_List_fromArray(
								[
									$author$project$Ui$avatar(c.aV),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('lead-name')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(c.aV)
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('lead-source')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													A2($elm$core$Maybe$withDefault, 'No email added', c.J))
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'data-label', 'Client number')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(c.ce)
						])),
					A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'data-label', 'Phone')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$Maybe$withDefault, '—', c.ci))
						])),
					A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							A2($elm$html$Html$Attributes$attribute, 'data-label', 'Case officer')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$Maybe$withDefault, '—', c.cV))
						])),
					A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('lead-source'),
							A2($elm$html$Html$Attributes$attribute, 'data-label', 'Client since')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Ui$fmtDateTime(c.aA))
						]))
				]));
	};
	var q = $elm$core$String$toLower(
		$elm$core$String$trim(model.a8));
	var visible = A2(
		$elm$core$List$filter,
		function (c) {
			return (q === '') || (A2(
				$elm$core$String$contains,
				q,
				$elm$core$String$toLower(c.aV)) || A2(
				$elm$core$String$contains,
				q,
				$elm$core$String$toLower(c.ce)));
		},
		model.aS);
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('page-head')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Clients')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('flex')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-outline'),
										$elm$html$Html$Attributes$href(
										A2(
											$author$project$Api$exportCsvUrl,
											{ao: model.am, dU: model.dU},
											'clients')),
										$elm$html$Html$Attributes$download('')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Export CSV')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$disabled(
										$author$project$Views$isReadOnly(model)),
										$elm$html$Html$Attributes$class('btn btn-primary'),
										$elm$html$Html$Events$onClick($author$project$State$OpenAddClient)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('+ Add Client')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('search-container')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('search-row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('search-input-wrapper')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('search-input'),
												A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Search clients'),
												$elm$html$Html$Attributes$placeholder('Search clients…'),
												$elm$html$Html$Attributes$value(model.a8),
												$elm$html$Html$Events$onInput($author$project$State$ClientSearchChanged)
											]),
										_List_Nil)
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('card table-card'),
						A2($elm$html$Html$Attributes$style, 'margin-top', '12px')
					]),
				_List_fromArray(
					[
						$elm$core$List$isEmpty(visible) ? A3($author$project$Ui$emptyState, 'clients', 'No clients to show', 'Try another search, add a client, or convert a qualified lead.') : A2(
						$elm$html$Html$table,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('data-table clients-table')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$thead,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$tr,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$th,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$scope('col')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Record')
													])),
												A2(
												$elm$html$Html$th,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$scope('col')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Number')
													])),
												A2(
												$elm$html$Html$th,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$scope('col')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Phone')
													])),
												A2(
												$elm$html$Html$th,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$scope('col')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Case Officer')
													])),
												A2(
												$elm$html$Html$th,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$scope('col')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Since')
													]))
											]))
									])),
								A2(
								$elm$html$Html$tbody,
								_List_Nil,
								A2($elm$core$List$map, row, visible))
							]))
					])),
				model.O ? $author$project$Views$clientFormModal(model) : A2($elm$html$Html$div, _List_Nil, _List_Nil)
			]));
};
var $author$project$Types$leadStages = _List_fromArray(
	['New Lead', 'Contacted', 'Initial Assessment', 'Qualified', 'Consultation Booked', 'Proposal Sent', 'Converted', 'Closed/Lost']);
var $elm$core$List$maximum = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(
			A3($elm$core$List$foldl, $elm$core$Basics$max, x, xs));
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Views$statCard = F5(
	function (symbol, label, sub, value, path) {
		return A2(
			$elm$html$Html$a,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('stat stat-' + symbol),
					$elm$html$Html$Attributes$href(path)
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('stat-top')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('stat-label')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(label)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('stat-icon')
								]),
							_List_fromArray(
								[
									$author$project$Ui$icon(symbol)
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('stat-value')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(value)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('stat-sub')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(sub)
								])),
							$author$project$Ui$icon('arrow')
						]))
				]));
	});
var $author$project$Views$dashboardView = function (model) {
	var _v0 = model.dQ;
	if (_v0.$ === 1) {
		return $author$project$Ui$spinner;
	} else {
		var stats = _v0.a;
		var totalSources = A2(
			$elm$core$Basics$max,
			1,
			$elm$core$List$sum(
				A2(
					$elm$core$List$map,
					function ($) {
						return $.ba;
					},
					stats.dN)));
		var taskRow = function (task) {
			return A2(
				$elm$html$Html$a,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('priority-task'),
						$elm$html$Html$Attributes$href(
						A2(
							$elm$core$Maybe$withDefault,
							'/leads/' + $elm$core$String$fromInt(task.aW),
							A2(
								$elm$core$Maybe$map,
								function (id) {
									return '/clients/' + $elm$core$String$fromInt(id);
								},
								task.br)))
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('task-checkbox'),
								A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
							]),
						_List_Nil),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('priority-task-copy')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$strong,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(task.Z)
									])),
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2($elm$core$Maybe$withDefault, 'Unlinked task', task.ca))
									]))
							])),
						$author$project$Ui$priorityBadge(task.a$),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								(_Utils_cmp(
									A2($elm$core$Maybe$withDefault, '9999', task.aC),
									model.bH) < 0) ? 'due-label overdue' : 'due-label')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$author$project$Ui$fmtDate(task.aC))
							])),
						$author$project$Ui$icon('arrow')
					]));
		};
		var sourceRow = function (sc) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('source-row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('source-symbol')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								A2($elm$core$String$left, 1, sc.aL))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('source-info')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$strong,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(sc.aL)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('source-track')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$Attributes$style,
												'width',
												$elm$core$String$fromInt(
													$elm$core$Basics$round((100 * sc.ba) / totalSources)) + '%')
											]),
										_List_Nil)
									]))
							])),
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('source-count')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(sc.ba))
							]))
					]));
		};
		var panelTitle = F3(
			function (title, subtitle, path) {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('panel-heading')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h3,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(title)
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(subtitle)
										]))
								])),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('panel-link'),
									$elm$html$Html$Attributes$href(path)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('View all'),
									$author$project$Ui$icon('arrow')
								]))
						]));
			});
		var orderedStages = A2(
			$elm$core$List$concatMap,
			function (stageName) {
				return A2(
					$elm$core$List$filter,
					function (item) {
						return _Utils_eq(item.dO, stageName);
					},
					stats.dP);
			},
			$author$project$Types$leadStages);
		var maxStage = A2(
			$elm$core$Maybe$withDefault,
			1,
			$elm$core$List$maximum(
				A2(
					$elm$core$List$map,
					function ($) {
						return $.ba;
					},
					stats.dP)));
		var stageRow = function (sc) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('pipeline-row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('pipeline-label')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(sc.dO)
									])),
								A2(
								$elm$html$Html$strong,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(sc.ba))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stage-bar'),
								A2($elm$html$Html$Attributes$attribute, 'role', 'meter'),
								A2($elm$html$Html$Attributes$attribute, 'aria-label', sc.dO),
								A2(
								$elm$html$Html$Attributes$attribute,
								'aria-valuenow',
								$elm$core$String$fromInt(sc.ba)),
								A2($elm$html$Html$Attributes$attribute, 'aria-valuemin', '0'),
								A2(
								$elm$html$Html$Attributes$attribute,
								'aria-valuemax',
								$elm$core$String$fromInt(
									A2($elm$core$Basics$max, 1, maxStage)))
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('stage-fill'),
										A2(
										$elm$html$Html$Attributes$style,
										'width',
										$elm$core$String$fromInt(
											$elm$core$Basics$round(
												(100 * sc.ba) / A2($elm$core$Basics$max, 1, maxStage))) + '%')
									]),
								_List_Nil)
							]))
					]));
		};
		var activityRow = function (activity) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('feed-item')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('feed-dot'),
								A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
							]),
						_List_Nil),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('feed-copy')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('feed-meta')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												A3($elm$core$String$replace, '_', ' ', activity.dr))
											])),
										A2(
										$elm$html$Html$span,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												$author$project$Ui$fmtDate(
													$elm$core$Maybe$Just(activity.c5)))
											]))
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2($elm$core$Maybe$withDefault, 'Activity recorded', activity.aU))
									])),
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('text-muted')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2($elm$core$Maybe$withDefault, '', activity.ca))
									]))
							]))
					]));
		};
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('dashboard')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('stats dashboard-stats')
						]),
					_List_fromArray(
						[
							A5(
							$author$project$Views$statCard,
							'leads',
							'Active leads',
							$elm$core$String$fromInt(stats.dn) + ' high-priority relationships',
							$elm$core$String$fromInt(stats.dW),
							'/leads'),
							A5(
							$author$project$Views$statCard,
							'clients',
							'Clients',
							'People you’re helping move forward',
							$elm$core$String$fromInt(stats.dV),
							'/clients'),
							A5(
							$author$project$Views$statCard,
							'tasks',
							'Open tasks',
							'Your next steps, in one place',
							$elm$core$String$fromInt(stats.dz),
							'/tasks'),
							A5(
							$author$project$Views$statCard,
							'clock',
							'Overdue tasks',
							(!stats.dA) ? 'No overdue tasks' : 'A little attention goes a long way',
							$elm$core$String$fromInt(stats.dA),
							'/tasks')
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							(stats.dA > 0) ? 'attention-strip' : 'attention-strip on-track')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('attention-icon')
								]),
							_List_fromArray(
								[
									$author$project$Ui$icon(
									(stats.dA > 0) ? 'clock' : 'check')
								])),
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$strong,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											(stats.dA > 0) ? ($elm$core$String$fromInt(stats.dA) + ' tasks need your attention') : 'You’re on top of your tasks')
										])),
									A2(
									$elm$html$Html$p,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											(stats.dA > 0) ? 'Start with overdue work, then make space for what’s next.' : 'Keep the momentum going. Review upcoming work and follow-ups.')
										]))
								])),
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('attention-link'),
									$elm$html$Html$Attributes$href('/tasks')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Review tasks'),
									$author$project$Ui$icon('arrow')
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('dashboard-grid')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('card pipeline-panel')
								]),
							_List_fromArray(
								[
									A3(panelTitle, 'Your pipeline', 'Where every relationship stands', '/leads'),
									$elm$core$List$isEmpty(orderedStages) ? A3($author$project$Ui$emptyState, 'leads', 'Your pipeline starts here', 'Add your first lead to see your relationships take shape.') : A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('pipeline-list')
										]),
									A2($elm$core$List$map, stageRow, orderedStages))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('card sources-panel')
								]),
							_List_fromArray(
								[
									A3(panelTitle, 'Where leads find you', 'Your sources at a glance', '/leads'),
									$elm$core$List$isEmpty(stats.dN) ? A3($author$project$Ui$emptyState, 'clients', 'No sources yet', 'Sources appear when you start adding leads.') : A2(
									$elm$html$Html$div,
									_List_Nil,
									A2($elm$core$List$map, sourceRow, stats.dN))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('card priorities-panel')
								]),
							_List_fromArray(
								[
									A3(panelTitle, 'Next on your list', 'The next steps on your schedule', '/tasks'),
									$elm$core$List$isEmpty(stats.dX) ? A3($author$project$Ui$emptyState, 'check', 'A little breathing room', 'No upcoming tasks. Add a next step when you’re ready.') : A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('priority-list')
										]),
									A2($elm$core$List$map, taskRow, stats.dX))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('card activity-panel')
								]),
							_List_fromArray(
								[
									A3(panelTitle, 'Latest activity', 'The small steps that move things forward', '/leads'),
									$elm$core$List$isEmpty(stats.dE) ? A3($author$project$Ui$emptyState, 'clock', 'Your story starts here', 'Notes, conversations and updates will appear as you work.') : A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('activity-feed')
										]),
									A2($elm$core$List$map, activityRow, stats.dE))
								]))
						]))
				]));
	}
};
var $author$project$State$AdvanceClicked = function (a) {
	return {$: 86, a: a};
};
var $author$project$State$ConvertClicked = function (a) {
	return {$: 94, a: a};
};
var $author$project$State$DeleteLeadConfirmed = function (a) {
	return {$: 84, a: a};
};
var $author$project$State$EditLeadToggled = {$: 80};
var $author$project$State$UploadLeadDocClicked = function (a) {
	return {$: 140, a: a};
};
var $author$project$State$SubmitAddTaskFor = function (a) {
	return {$: 118, a: a};
};
var $author$project$Views$addTaskInline = F2(
	function (model, leadId) {
		return A2(
			$author$project$Views$taskComposer,
			model,
			$author$project$State$SubmitAddTaskFor(leadId));
	});
var $author$project$Views$contactGrid = function (detail) {
	var l = detail.bh;
	var kv = F2(
		function (k, v) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('kv')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(k)
							])),
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(v)
							]))
					]));
		});
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('kv-grid')
			]),
		_List_fromArray(
			[
				A2(
				kv,
				'Email',
				A2($elm$core$Maybe$withDefault, '—', l.J)),
				A2(
				kv,
				'Phone',
				A2($elm$core$Maybe$withDefault, '—', l.ci)),
				A2(
				kv,
				'Source',
				A2($elm$core$Maybe$withDefault, '—', l.aL)),
				A2(
				kv,
				'Destination',
				A2($elm$core$Maybe$withDefault, '—', l.bb)),
				A2(
				kv,
				'Service',
				A2($elm$core$Maybe$withDefault, '—', l.aJ)),
				A2(
				kv,
				'Consultant',
				A2($elm$core$Maybe$withDefault, '—', l.c2)),
				A2(
				kv,
				'Last Contact',
				$author$project$Ui$fmtDate(l.ds)),
				A2(
				kv,
				'Next Follow-up',
				$author$project$Ui$fmtDate(l.cd)),
				A2(
				kv,
				'Notes',
				A2($elm$core$Maybe$withDefault, '—', l.aF))
			]));
};
var $author$project$State$SubmitEditLead = {$: 82};
var $author$project$State$UpdateEditLead = function (a) {
	return {$: 81, a: a};
};
var $author$project$Types$qualities = _List_fromArray(
	['Hot', 'Warm', 'Cold']);
var $author$project$Types$sources = _List_fromArray(
	['Website', 'Facebook', 'Instagram', 'WhatsApp', 'Referring Agent', 'School Partner', 'Walk-in', 'Referral']);
var $author$project$Views$editLeadForm = F2(
	function (model, f) {
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A6(
					$author$project$Views$checkedInputField,
					model,
					'fullName',
					'Full Name',
					f.aV,
					'text',
					function (v) {
						return $author$project$State$UpdateEditLead(
							function (g) {
								return _Utils_update(
									g,
									{aV: v});
							});
					}),
					A6(
					$author$project$Views$checkedInputField,
					model,
					'email',
					'Email',
					f.J,
					'email',
					function (v) {
						return $author$project$State$UpdateEditLead(
							function (g) {
								return _Utils_update(
									g,
									{J: v});
							});
					}),
					A4(
					$author$project$Ui$inputField,
					'Phone',
					f.ci,
					'tel',
					function (v) {
						return $author$project$State$UpdateEditLead(
							function (g) {
								return _Utils_update(
									g,
									{ci: v});
							});
					}),
					A4(
					$author$project$Ui$selectField,
					'Stage',
					$author$project$Types$leadStages,
					f.dO,
					function (v) {
						return $author$project$State$UpdateEditLead(
							function (g) {
								return _Utils_update(
									g,
									{dO: v});
							});
					}),
					A4(
					$author$project$Ui$selectField,
					'Quality',
					$author$project$Types$qualities,
					f.aH,
					function (v) {
						return $author$project$State$UpdateEditLead(
							function (g) {
								return _Utils_update(
									g,
									{aH: v});
							});
					}),
					A4(
					$author$project$Ui$selectField,
					'Source',
					$author$project$Types$sources,
					f.aL,
					function (v) {
						return $author$project$State$UpdateEditLead(
							function (g) {
								return _Utils_update(
									g,
									{aL: v});
							});
					}),
					A4(
					$author$project$Ui$selectField,
					'Destination',
					$author$project$Types$destinations,
					f.bb,
					function (v) {
						return $author$project$State$UpdateEditLead(
							function (g) {
								return _Utils_update(
									g,
									{bb: v});
							});
					}),
					A4(
					$author$project$Ui$selectField,
					'Service',
					$author$project$Types$services,
					f.aJ,
					function (v) {
						return $author$project$State$UpdateEditLead(
							function (g) {
								return _Utils_update(
									g,
									{aJ: v});
							});
					}),
					A6(
					$author$project$Views$checkedInputField,
					model,
					'lastContact',
					'Last Contact',
					f.ds,
					'date',
					function (v) {
						return $author$project$State$UpdateEditLead(
							function (g) {
								return _Utils_update(
									g,
									{ds: v});
							});
					}),
					A6(
					$author$project$Views$checkedInputField,
					model,
					'nextFollowup',
					'Next Follow-up',
					f.cd,
					'date',
					function (v) {
						return $author$project$State$UpdateEditLead(
							function (g) {
								return _Utils_update(
									g,
									{cd: v});
							});
					}),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-group'),
							A2($elm$html$Html$Attributes$style, 'grid-column', '1 / -1')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Notes')
								])),
							A2(
							$elm$html$Html$textarea,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('input'),
									$elm$html$Html$Attributes$rows(3),
									$elm$html$Html$Attributes$value(f.aF),
									$elm$html$Html$Events$onInput(
									function (v) {
										return $author$project$State$UpdateEditLead(
											function (g) {
												return _Utils_update(
													g,
													{aF: v});
											});
									})
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex'),
							A2($elm$html$Html$Attributes$style, 'grid-column', '1 / -1'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '8px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$disabled(
									$author$project$Views$isReadOnly(model)),
									$elm$html$Html$Attributes$class('btn btn-primary'),
									$elm$html$Html$Events$onClick($author$project$State$SubmitEditLead)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Save Changes')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$disabled(
									$author$project$Views$isReadOnly(model)),
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Events$onClick($author$project$State$EditLeadToggled)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Cancel')
								]))
						]))
				]));
	});
var $author$project$State$NoteDraftChanged = function (a) {
	return {$: 96, a: a};
};
var $author$project$State$NoteSubmitted = function (a) {
	return {$: 97, a: a};
};
var $author$project$Views$noteComposer = F2(
	function (model, leadId) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('add-note'),
					A2($elm$html$Html$Attributes$style, 'margin-bottom', '12px')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$input,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('input'),
							$elm$html$Html$Attributes$placeholder('Log a note, call summary…'),
							$elm$html$Html$Attributes$value(model.G),
							$elm$html$Html$Events$onInput($author$project$State$NoteDraftChanged)
						]),
					_List_Nil),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$disabled(
							$author$project$Views$isReadOnly(model)),
							$elm$html$Html$Attributes$class('btn btn-sm btn-primary'),
							$elm$html$Html$Events$onClick(
							$author$project$State$NoteSubmitted(leadId))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Add Note')
						]))
				]));
	});
var $author$project$Ui$qualityTag = function (q) {
	if (!q.$) {
		var quality = q.a;
		var cls = function () {
			var _v1 = $elm$core$String$toLower(quality);
			switch (_v1) {
				case 'hot':
					return 'tag tag-hot';
				case 'warm':
					return 'tag tag-warm';
				case 'cold':
					return 'tag tag-cold';
				default:
					return 'tag tag-cold';
			}
		}();
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(cls)
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(quality)
				]));
	} else {
		return A2($elm$html$Html$span, _List_Nil, _List_Nil);
	}
};
var $author$project$Ui$stageClass = function (stage) {
	switch (stage) {
		case 'Converted':
			return 'tag tag-converted';
		case 'Closed/Lost':
			return 'tag tag-lost';
		default:
			return 'tag tag-stage-blue';
	}
};
var $author$project$Ui$stageTag = function (stage) {
	return A2(
		$elm$html$Html$span,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class(
				$author$project$Ui$stageClass(stage))
			]),
		_List_fromArray(
			[
				$elm$html$Html$text(stage)
			]));
};
var $author$project$Views$timeline = function (activities) {
	return $elm$core$List$isEmpty(activities) ? $author$project$Ui$emptyNote('No activity recorded.') : A2(
		$elm$html$Html$div,
		_List_Nil,
		A2(
			$elm$core$List$map,
			function (act) {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('tl-item')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('tl-date')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(act.c5)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('tl-type')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(act.dr)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('activity-desc')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2($elm$core$Maybe$withDefault, '', act.aU))
								]))
						]));
			},
			activities));
};
var $author$project$Views$leadDetailView = F2(
	function (model, id) {
		var _v0 = model.R;
		if (_v0.$ === 1) {
			return $author$project$Ui$spinner;
		} else {
			var detail = _v0.a;
			var l = detail.bh;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('back-link'),
								$elm$html$Html$Attributes$href('#'),
								$elm$html$Html$Events$onClick(
								$author$project$State$NavigateTo('/leads'))
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('← Back to Leads')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('page-head')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h2,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(l.aV)
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('lead-detail-badges')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$span,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('tag tag-id')
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(l.ce)
													])),
												$author$project$Ui$stageTag(l.dO),
												$author$project$Ui$qualityTag(l.aH)
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('flex')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$disabled(
												$author$project$Views$isReadOnly(model)),
												$elm$html$Html$Attributes$class('btn'),
												$elm$html$Html$Events$onClick($author$project$State$EditLeadToggled)
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												model.S ? 'Close Editor' : 'Edit')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$disabled(
												$author$project$Views$isReadOnly(model)),
												$elm$html$Html$Attributes$class('btn'),
												$elm$html$Html$Events$onClick(
												$author$project$State$AdvanceClicked(l.bu))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Advance ▸')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$disabled(
												$author$project$Views$isReadOnly(model) || model.u),
												$elm$html$Html$Attributes$class('btn btn-primary'),
												$elm$html$Html$Events$onClick(
												A2(
													$author$project$State$ConfirmRequested,
													'Convert this lead to a client? Documents, tasks and history will be preserved.',
													$author$project$State$ConvertClicked(l.bu)))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												model.u ? 'Converting…' : 'Convert to client')
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$disabled(
												$author$project$Views$isReadOnly(model)),
												$elm$html$Html$Attributes$class('btn btn-danger'),
												$elm$html$Html$Events$onClick(
												A2(
													$author$project$State$ConfirmRequested,
													'Move this lead to the archive? Its history will be preserved.',
													$author$project$State$DeleteLeadConfirmed(l.bu)))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Delete')
											]))
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('detail-grid')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('card')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('section-head')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h3,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Contact & Pipeline')
													]))
											])),
										model.S ? A2($author$project$Views$editLeadForm, model, model.l) : $author$project$Views$contactGrid(detail)
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('card')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('section-head')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$h3,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text('Tasks')
													])),
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('btn btn-sm btn-outline'),
														$elm$html$Html$Events$onClick(
														$author$project$State$UpdateAddTask(
															function (f) {
																return _Utils_update(
																	f,
																	{Z: f.Z});
															}))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('+')
													]))
											])),
										A2($author$project$Views$addTaskInline, model, id),
										A2($author$project$Views$taskRows, model, detail.aj)
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('detail-grid'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '16px')
							]),
						_List_fromArray(
							[
								A3(
								$author$project$Views$documentsCard,
								model,
								detail.bX,
								$author$project$State$UploadLeadDocClicked(id))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('card'),
								A2($elm$html$Html$Attributes$style, 'margin-top', '16px')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('section-head')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$h3,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text('Activity Timeline')
											]))
									])),
								A2($author$project$Views$noteComposer, model, id),
								$author$project$Views$timeline(detail.bJ)
							]))
					]));
		}
	});
var $author$project$State$CloseAddLead = {$: 76};
var $author$project$State$SubmitAddLead = {$: 78};
var $author$project$State$UpdateAddLead = function (a) {
	return {$: 77, a: a};
};
var $author$project$Views$addLeadModal = function (model) {
	var f = model.y;
	return A2(
		$author$project$Ui$modal,
		'Add Lead',
		A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A6(
					$author$project$Views$checkedInputField,
					model,
					'fullName',
					'Full Name *',
					f.aV,
					'text',
					function (v) {
						return $author$project$State$UpdateAddLead(
							function (g) {
								return _Utils_update(
									g,
									{aV: v});
							});
					}),
					A6(
					$author$project$Views$checkedInputField,
					model,
					'email',
					'Email',
					f.J,
					'email',
					function (v) {
						return $author$project$State$UpdateAddLead(
							function (g) {
								return _Utils_update(
									g,
									{J: v});
							});
					}),
					A4(
					$author$project$Ui$inputField,
					'Phone',
					f.ci,
					'tel',
					function (v) {
						return $author$project$State$UpdateAddLead(
							function (g) {
								return _Utils_update(
									g,
									{ci: v});
							});
					}),
					A4(
					$author$project$Ui$selectField,
					'Source',
					$author$project$Types$sources,
					f.aL,
					function (v) {
						return $author$project$State$UpdateAddLead(
							function (g) {
								return _Utils_update(
									g,
									{aL: v});
							});
					}),
					A4(
					$author$project$Ui$selectField,
					'Quality',
					$author$project$Types$qualities,
					f.aH,
					function (v) {
						return $author$project$State$UpdateAddLead(
							function (g) {
								return _Utils_update(
									g,
									{aH: v});
							});
					}),
					A4(
					$author$project$Ui$selectField,
					'Stage',
					$author$project$Types$leadStages,
					f.dO,
					function (v) {
						return $author$project$State$UpdateAddLead(
							function (g) {
								return _Utils_update(
									g,
									{dO: v});
							});
					}),
					A4(
					$author$project$Ui$selectField,
					'Destination',
					$author$project$Types$destinations,
					f.bb,
					function (v) {
						return $author$project$State$UpdateAddLead(
							function (g) {
								return _Utils_update(
									g,
									{bb: v});
							});
					}),
					A4(
					$author$project$Ui$selectField,
					'Service',
					$author$project$Types$services,
					f.aJ,
					function (v) {
						return $author$project$State$UpdateAddLead(
							function (g) {
								return _Utils_update(
									g,
									{aJ: v});
							});
					}),
					A6(
					$author$project$Views$checkedInputField,
					model,
					'nextFollowup',
					'Next Follow-up',
					f.cd,
					'date',
					function (v) {
						return $author$project$State$UpdateAddLead(
							function (g) {
								return _Utils_update(
									g,
									{cd: v});
							});
					}),
					A4(
					$author$project$Ui$inputField,
					'Notes',
					f.aF,
					'text',
					function (v) {
						return $author$project$State$UpdateAddLead(
							function (g) {
								return _Utils_update(
									g,
									{aF: v});
							});
					}),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '14px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$disabled(
									$author$project$Views$isReadOnly(model)),
									$elm$html$Html$Attributes$class('btn btn-primary'),
									$elm$html$Html$Events$onClick($author$project$State$SubmitAddLead)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Save Lead')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Events$onClick($author$project$State$CloseAddLead)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Cancel')
								]))
						]))
				])));
};
var $author$project$State$BulkAdvanceClicked = {$: 108};
var $author$project$State$BulkAssignPicked = function (a) {
	return {$: 109, a: a};
};
var $author$project$State$BulkDeleteClicked = {$: 110};
var $elm$core$Set$isEmpty = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$isEmpty(dict);
};
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $elm$core$Set$size = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$size(dict);
};
var $author$project$Views$bulkBar = function (model) {
	return $elm$core$Set$isEmpty(model.N) ? A2($elm$html$Html$div, _List_Nil, _List_Nil) : A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('bulk-actions')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$strong,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(
							$elm$core$Set$size(model.N)) + ' selected')
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$disabled(
						$author$project$Views$isReadOnly(model)),
						$elm$html$Html$Attributes$class('btn btn-sm btn-success'),
						$elm$html$Html$Events$onClick($author$project$State$BulkAdvanceClicked)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Advance')
					])),
				A2(
				$elm$html$Html$select,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$disabled(
						$author$project$Views$isReadOnly(model)),
						$elm$html$Html$Events$onInput($author$project$State$BulkAssignPicked)
					]),
				A2(
					$elm$core$List$cons,
					A2(
						$elm$html$Html$option,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value('')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Assign consultant…')
							])),
					A2(
						$elm$core$List$map,
						function (u) {
							return A2(
								$elm$html$Html$option,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$value(
										$elm$core$String$fromInt(u.bu))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(u.x)
									]));
						},
						model.al))),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$disabled(
						$author$project$Views$isReadOnly(model)),
						$elm$html$Html$Attributes$class('btn btn-sm btn-danger'),
						$elm$html$Html$Events$onClick(
						A2($author$project$State$ConfirmRequested, 'Archive the selected leads and preserve their history?', $author$project$State$BulkDeleteClicked))
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Delete')
					]))
			]));
};
var $author$project$State$RowChecked = F2(
	function (a, b) {
		return {$: 106, a: a, b: b};
	});
var $author$project$State$SelectAllChecked = function (a) {
	return {$: 107, a: a};
};
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $elm$html$Html$Events$targetChecked = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'checked']),
	$elm$json$Json$Decode$bool);
var $elm$html$Html$Events$onCheck = function (tagger) {
	return A2(
		$elm$html$Html$Events$on,
		'change',
		A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetChecked));
};
var $author$project$Views$leadsTable = function (model) {
	var row = function (l) {
		return A2(
			$elm$html$Html$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$type_('checkbox'),
									$elm$html$Html$Attributes$class('row-check'),
									A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Select ' + l.aV),
									$elm$html$Html$Attributes$checked(
									A2($elm$core$Set$member, l.bu, model.N)),
									A2(
									$elm$html$Html$Events$stopPropagationOn,
									'click',
									$elm$json$Json$Decode$succeed(
										_Utils_Tuple2(
											A2(
												$author$project$State$RowChecked,
												l.bu,
												!A2($elm$core$Set$member, l.bu, model.N)),
											true)))
								]),
							_List_Nil)
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('contact-identity'),
									$elm$html$Html$Attributes$href(
									'/leads/' + $elm$core$String$fromInt(l.bu))
								]),
							_List_fromArray(
								[
									$author$project$Ui$avatar(l.aV),
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('lead-name')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(l.aV)
												])),
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('lead-source')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													A2($elm$core$Maybe$withDefault, 'No email added', l.J))
												]))
										]))
								]))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(l.ce)
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$author$project$Ui$stageTag(l.dO)
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$author$project$Ui$qualityTag(l.aH)
						])),
					A2(
					$elm$html$Html$td,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('lead-source')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$Maybe$withDefault, '—', l.aL))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2($elm$core$Maybe$withDefault, '—', l.c2))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Ui$fmtDate(l.cd))
						]))
				]));
	};
	var leads = $author$project$Views$filteredLeads(model);
	var allChecked = (!$elm$core$List$isEmpty(leads)) && A2(
		$elm$core$List$all,
		function (l) {
			return A2($elm$core$Set$member, l.bu, model.N);
		},
		leads);
	return $elm$core$List$isEmpty(leads) ? A3($author$project$Ui$emptyState, 'search', 'No leads to show', 'Try a different search or adjust your filters. Add a lead to start a new relationship.') : A2(
		$elm$html$Html$table,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('data-table leads-table')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$thead,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$tr,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$input,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$type_('checkbox'),
												$elm$html$Html$Attributes$class('row-check'),
												A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Select all leads on this page'),
												$elm$html$Html$Attributes$checked(allChecked),
												$elm$html$Html$Events$onCheck($author$project$State$SelectAllChecked)
											]),
										_List_Nil)
									])),
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Lead')
									])),
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Number')
									])),
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Stage')
									])),
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Quality')
									])),
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Source')
									])),
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Consultant')
									])),
								A2(
								$elm$html$Html$th,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Follow-up')
									]))
							]))
					])),
				A2(
				$elm$html$Html$tbody,
				_List_Nil,
				A2($elm$core$List$map, row, leads))
			]));
};
var $author$project$State$ImportFilePicked = function (a) {
	return {$: 146, a: a};
};
var $author$project$State$LeadImportClicked = {$: 147};
var $author$project$State$OpenAddLead = {$: 75};
var $author$project$State$QualityFilterChanged = function (a) {
	return {$: 101, a: a};
};
var $author$project$State$SearchChanged = function (a) {
	return {$: 99, a: a};
};
var $author$project$State$SortByChanged = function (a) {
	return {$: 103, a: a};
};
var $author$project$State$SortDirToggled = {$: 104};
var $author$project$State$SourceFilterChanged = function (a) {
	return {$: 102, a: a};
};
var $author$project$State$StageFilterChanged = function (a) {
	return {$: 100, a: a};
};
var $author$project$Views$leadsToolbar = function (model) {
	var ctx = {ao: model.am, dU: model.dU};
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('search-container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('search-row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('search-input-wrapper')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('search-input'),
										A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Search leads'),
										$elm$html$Html$Attributes$placeholder('Search name, email, phone, lead number…'),
										$elm$html$Html$Attributes$value(model.dC),
										$elm$html$Html$Events$onInput($author$project$State$SearchChanged)
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-outline'),
								$elm$html$Html$Attributes$href(
								A2($author$project$Api$exportCsvUrl, ctx, 'leads')),
								$elm$html$Html$Attributes$download('')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Export CSV')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('import-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$disabled(
										$author$project$Views$isReadOnly(model)),
										$elm$html$Html$Attributes$type_('file'),
										A2($elm$html$Html$Attributes$attribute, 'accept', '.csv,text/csv'),
										$elm$html$Html$Attributes$title('Pick a CSV of leads to import'),
										A2(
										$elm$html$Html$Events$on,
										'change',
										A2(
											$elm$json$Json$Decode$map,
											$author$project$State$ImportFilePicked,
											A2(
												$elm$json$Json$Decode$at,
												_List_fromArray(
													['target', 'files']),
												A2($elm$json$Json$Decode$index, 0, $elm$file$File$decoder))))
									]),
								_List_Nil),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$disabled(
										$author$project$Views$isReadOnly(model)),
										$elm$html$Html$Attributes$class('btn btn-outline'),
										$elm$html$Html$Attributes$title(
										function () {
											var _v0 = model.ae;
											if (!_v0.$) {
												var f = _v0.a;
												return 'Import ' + $elm$file$File$name(f);
											} else {
												return 'Import leads from the selected CSV file';
											}
										}()),
										$elm$html$Html$Events$onClick($author$project$State$LeadImportClicked)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										function () {
											var _v1 = model.ae;
											if (!_v1.$) {
												var f = _v1.a;
												return 'Import (' + ($elm$file$File$name(f) + ')');
											} else {
												return 'Import';
											}
										}())
									]))
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$disabled(
								$author$project$Views$isReadOnly(model)),
								$elm$html$Html$Attributes$class('btn btn-primary'),
								$elm$html$Html$Events$onClick($author$project$State$OpenAddLead)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('+ Add Lead')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('filter-row')
					]),
				_List_fromArray(
					[
						A4(
						$author$project$Views$selectFieldMsg,
						'Stage',
						$author$project$Views$plainOptions(
							A2($elm$core$List$cons, 'All', $author$project$Types$leadStages)),
						model.df,
						$author$project$State$StageFilterChanged),
						A4(
						$author$project$Views$selectFieldMsg,
						'Quality',
						$author$project$Views$plainOptions(
							A2($elm$core$List$cons, 'All', $author$project$Types$qualities)),
						model.dd,
						$author$project$State$QualityFilterChanged),
						A4(
						$author$project$Views$selectFieldMsg,
						'Source',
						$author$project$Views$plainOptions(
							A2($elm$core$List$cons, 'All', $author$project$Types$sources)),
						model.de,
						$author$project$State$SourceFilterChanged),
						A4(
						$author$project$Views$selectFieldMsg,
						'Sort By',
						_List_fromArray(
							[
								_Utils_Tuple2('name', 'Name'),
								_Utils_Tuple2('stage', 'Stage'),
								_Utils_Tuple2('quality', 'Quality'),
								_Utils_Tuple2('followup', 'Follow-up')
							]),
						model.dM,
						$author$project$State$SortByChanged),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('filter-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Direction')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-outline'),
										A2($elm$html$Html$Attributes$style, 'width', '100%'),
										$elm$html$Html$Events$onClick($author$project$State$SortDirToggled)
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										model.dL ? '↑ Ascending' : '↓ Descending')
									]))
							]))
					]))
			]));
};
var $author$project$Views$leadsView = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('page-head')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Leads')
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('results-summary')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$elm$core$String$fromInt(
									$elm$core$List$length(
										$author$project$Views$filteredLeads(model))) + ' shown')
							]))
					])),
				$author$project$Views$leadsToolbar(model),
				$author$project$Views$bulkBar(model),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('card table-card'),
						A2($elm$html$Html$Attributes$style, 'margin-top', '12px')
					]),
				_List_fromArray(
					[
						$author$project$Views$leadsTable(model)
					])),
				model.Y ? $author$project$Views$addLeadModal(model) : A2($elm$html$Html$div, _List_Nil, _List_Nil)
			]));
};
var $author$project$State$EditTask = function (a) {
	return {$: 39, a: a};
};
var $author$project$State$ToggleGlobalAddTask = {$: 116};
var $author$project$State$SubmitAddTaskGlobal = {$: 120};
var $author$project$Views$taskFieldError = F2(
	function (model, key) {
		var _v0 = A2($elm$core$Dict$get, key, model.dg);
		if (!_v0.$) {
			var message = _v0.a;
			return A2(
				$elm$html$Html$p,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$id('task-error-' + key),
						$elm$html$Html$Attributes$class('field-error'),
						A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(message)
					]));
		} else {
			return $elm$html$Html$text('');
		}
	});
var $author$project$Views$globalAddTaskForm = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('card'),
				A2($elm$html$Html$Attributes$style, 'margin-bottom', '16px')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$h3,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Create and assign a task')
					])),
				A2($author$project$Views$taskFieldError, model, 'owner'),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('inline-form')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group'),
								A2($elm$html$Html$Attributes$style, 'flex', '1.5')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('Lead or client')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Events$onInput(
										function (v) {
											return $author$project$State$UpdateAddTask(
												function (f) {
													return _Utils_update(
														f,
														{aW: v});
												});
										})
									]),
								A2(
									$elm$core$List$cons,
									A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Choose a lead or client…')
											])),
									_Utils_ap(
										A2(
											$elm$core$List$map,
											function (l) {
												return A2(
													$elm$html$Html$option,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$value(
															$elm$core$String$fromInt(l.bu)),
															$elm$html$Html$Attributes$selected(
															_Utils_eq(
																model.f.aW,
																$elm$core$String$fromInt(l.bu)))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(l.ce + (' — ' + l.aV))
														]));
											},
											model.as),
										A2(
											$elm$core$List$map,
											function (client) {
												return A2(
													$elm$html$Html$option,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$value(
															'client:' + $elm$core$String$fromInt(client.bu)),
															$elm$html$Html$Attributes$selected(
															_Utils_eq(
																model.f.aW,
																'client:' + $elm$core$String$fromInt(client.bu)))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text('Client · ' + client.aV)
														]));
											},
											model.aS))))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group'),
								A2($elm$html$Html$Attributes$style, 'flex', '2')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('input'),
										$elm$html$Html$Attributes$placeholder('Task title…'),
										$elm$html$Html$Attributes$value(model.f.Z),
										$elm$html$Html$Events$onInput(
										function (v) {
											return $author$project$State$UpdateAddTask(
												function (f) {
													return _Utils_update(
														f,
														{Z: v});
												});
										})
									]),
								_List_Nil)
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$input,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$type_('date'),
										$elm$html$Html$Attributes$class('input'),
										$elm$html$Html$Attributes$value(model.f.aC),
										$elm$html$Html$Events$onInput(
										function (v) {
											return $author$project$State$UpdateAddTask(
												function (f) {
													return _Utils_update(
														f,
														{aC: v});
												});
										})
									]),
								_List_Nil)
							])),
						A4(
						$author$project$Views$selectFieldMsg,
						'',
						$author$project$Views$plainOptions($author$project$Types$priorities),
						model.f.a$,
						function (v) {
							return $author$project$State$UpdateAddTask(
								function (f) {
									return _Utils_update(
										f,
										{a$: v});
								});
						}),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('form-group')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$label,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$for('new-task-assignee')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Assign to')
									])),
								A2(
								$elm$html$Html$select,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$id('new-task-assignee'),
										$elm$html$Html$Attributes$value(model.f.cS),
										$elm$html$Html$Events$onInput(
										function (v) {
											return $author$project$State$UpdateAddTask(
												function (f) {
													return _Utils_update(
														f,
														{cS: v});
												});
										})
									]),
								A2(
									$elm$core$List$cons,
									A2(
										$elm$html$Html$option,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value('')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Choose staff…')
											])),
									A2(
										$elm$core$List$map,
										function (u) {
											return A2(
												$elm$html$Html$option,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$value(
														$elm$core$String$fromInt(u.bu)),
														$elm$html$Html$Attributes$selected(
														_Utils_eq(
															model.f.cS,
															$elm$core$String$fromInt(u.bu)))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(u.x + (' · ' + u.J))
													]));
										},
										A2(
											$elm$core$List$filter,
											function (u) {
												return u.H !== 'viewer';
											},
											model.al))))
							])),
						A4(
						$author$project$Ui$inputField,
						'Repeat every days (optional)',
						model.f.dF,
						'number',
						function (v) {
							return $author$project$State$UpdateAddTask(
								function (f) {
									return _Utils_update(
										f,
										{dF: v});
								});
						}),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$disabled(
								$author$project$Views$isReadOnly(model) || model.u),
								$elm$html$Html$Attributes$class('btn btn-primary'),
								$elm$html$Html$Events$onClick($author$project$State$SubmitAddTaskGlobal)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								model.u ? 'Creating…' : 'Create task')
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-feedback')
					]),
				A2(
					$elm$core$List$map,
					$author$project$Views$taskFieldError(model),
					_List_fromArray(
						['title', 'assignee', 'dueDate', 'recurrenceDays']))),
				(model.b0 !== '') ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('error-banner'),
						A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text(model.b0)
					])) : $elm$html$Html$text('')
			]));
};
var $author$project$State$CloseTaskEditor = {$: 41};
var $author$project$Views$taskEditor = function (model) {
	var get = function (key) {
		return A2(
			$elm$core$Maybe$withDefault,
			'',
			A2($elm$core$Dict$get, key, model.dh));
	};
	var field = F3(
		function (labelText, key, kind) {
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A4(
						$author$project$Ui$inputField,
						labelText,
						get(key),
						kind,
						$author$project$State$FeatureField(key)),
						A2($author$project$Views$taskFieldError, model, key)
					]));
		});
	return A2(
		$author$project$Ui$modal,
		'Edit and assign task',
		A2(
			$elm$html$Html$fieldset,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$disabled(model.u),
					$elm$html$Html$Attributes$class('editor-fields')
				]),
			_List_fromArray(
				[
					A3(field, 'Task title', 'title', 'text'),
					A3(field, 'Description', 'description', 'text'),
					A3(field, 'Due date', 'dueDate', 'date'),
					A4(
					$author$project$Ui$selectField,
					'Priority',
					_Utils_ap(
						$author$project$Types$priorities,
						_List_fromArray(
							['Urgent'])),
					get('priority'),
					$author$project$State$FeatureField('priority')),
					A4(
					$author$project$Ui$selectField,
					'Status',
					$author$project$Types$taskStatuses,
					get('status'),
					$author$project$State$FeatureField('status')),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$for('task-editor-assignee')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Assign to')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('task-editor-assignee'),
									$elm$html$Html$Attributes$value(
									get('assignee')),
									$elm$html$Html$Attributes$disabled(model.u),
									$elm$html$Html$Events$onInput(
									$author$project$State$FeatureField('assignee'))
								]),
							A2(
								$elm$core$List$cons,
								A2(
									$elm$html$Html$option,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$value('')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Choose staff…')
										])),
								A2(
									$elm$core$List$map,
									function (u) {
										return A2(
											$elm$html$Html$option,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$value(
													$elm$core$String$fromInt(u.bu)),
													$elm$html$Html$Attributes$selected(
													_Utils_eq(
														get('assignee'),
														$elm$core$String$fromInt(u.bu)))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(u.x + (' · ' + u.J))
												]));
									},
									A2(
										$elm$core$List$filter,
										function (u) {
											return u.H !== 'viewer';
										},
										model.al)))),
							A2($author$project$Views$taskFieldError, model, 'assignee')
						])),
					A3(field, 'Repeat every days (optional)', 'recurrenceDays', 'number'),
					(model.b0 !== '') ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('error-banner'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(model.b0)
						])) : $elm$html$Html$text(''),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-actions')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-primary'),
									$elm$html$Html$Attributes$disabled(model.u),
									$elm$html$Html$Events$onClick(
									$author$project$State$FeatureRun('save'))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									model.u ? 'Please wait…' : 'Save task')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(model.u),
									$elm$html$Html$Events$onClick($author$project$State$CloseTaskEditor)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Cancel')
								]))
						]))
				])));
};
var $author$project$Views$tasksView = function (model) {
	var section = function (status) {
		var items = A2(
			$elm$core$List$filter,
			function (t) {
				return _Utils_eq(t.dR, status);
			},
			model.aj);
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class(
					'card task-column task-column-' + $elm$core$String$toLower(
						A3($elm$core$String$replace, ' ', '-', status)))
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('section-head')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$h3,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('status-dot'),
											A2($elm$html$Html$Attributes$attribute, 'aria-hidden', 'true')
										]),
									_List_Nil),
									$elm$html$Html$text(status)
								])),
							A2(
							$elm$html$Html$span,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('lead-count')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromInt(
										$elm$core$List$length(items)))
								]))
						])),
					$elm$core$List$isEmpty(items) ? A3($author$project$Ui$emptyState, 'check', 'Nothing here yet', 'Tasks appear here as work moves forward.') : A2(
					$elm$html$Html$div,
					_List_Nil,
					A2(
						$elm$core$List$map,
						function (t) {
							return A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('task-row')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$select,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$disabled(
												$author$project$Views$isReadOnly(model)),
												A2($elm$html$Html$Attributes$style, 'padding', '4px'),
												A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Status for ' + t.Z),
												$elm$html$Html$Events$onInput(
												$author$project$State$TaskStatusPicked(t.bu))
											]),
										A2(
											$elm$core$List$map,
											function (s) {
												return A2(
													$elm$html$Html$option,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$value(s),
															$elm$html$Html$Attributes$selected(
															_Utils_eq(s, t.dR))
														]),
													_List_fromArray(
														[
															$elm$html$Html$text(s)
														]));
											},
											$author$project$Types$taskStatuses)),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class(
												(t.dR === 'Done') ? 'done-title' : '')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$strong,
												_List_Nil,
												_List_fromArray(
													[
														$elm$html$Html$text(t.Z)
													]))
											])),
										A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('task-lead'),
												$elm$html$Html$Attributes$href(
												A2(
													$elm$core$Maybe$withDefault,
													'/leads/' + $elm$core$String$fromInt(t.aW),
													A2(
														$elm$core$Maybe$map,
														function (id) {
															return '/clients/' + $elm$core$String$fromInt(id);
														},
														t.br)))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												A2($elm$core$Maybe$withDefault, '', t.ca))
											])),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('task-assignee')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												A2($elm$core$Maybe$withDefault, 'Unassigned', t.cT))
											])),
										$author$project$Views$isReadOnly(model) ? $elm$html$Html$text('') : A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('btn btn-sm btn-outline'),
												$elm$html$Html$Events$onClick(
												$author$project$State$EditTask(t))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Edit / assign')
											])),
										$author$project$Ui$priorityBadge(t.a$),
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('activity-date')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$author$project$Ui$fmtDate(t.aC))
											])),
										A2(
										$elm$html$Html$button,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$disabled(
												$author$project$Views$isReadOnly(model)),
												$elm$html$Html$Attributes$class('btn btn-sm btn-outline'),
												$elm$html$Html$Events$onClick(
												A2(
													$author$project$State$ConfirmRequested,
													'Delete this task? This action cannot be undone.',
													$author$project$State$TaskDeleted(t.bu)))
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('✕')
											]))
									]));
						},
						items))
				]));
	};
	return A2(
		$elm$html$Html$div,
		_List_Nil,
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('page-head')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Tasks')
							])),
						A2(
						$elm$html$Html$button,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$disabled(
								$author$project$Views$isReadOnly(model)),
								$elm$html$Html$Attributes$class('btn btn-primary'),
								$elm$html$Html$Events$onClick($author$project$State$ToggleGlobalAddTask)
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								model.P ? 'Close' : '+ New Task')
							]))
					])),
				model.P ? $author$project$Views$globalAddTaskForm(model) : A2($elm$html$Html$div, _List_Nil, _List_Nil),
				model.A ? $author$project$Views$taskEditor(model) : $elm$html$Html$text(''),
				$author$project$Views$isReadOnly(model) ? A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('notice-banner')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('You can view tasks. Ask a consultant or administrator to create, assign or complete work.')
					])) : $elm$html$Html$text(''),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('task-board')
					]),
				_List_fromArray(
					[
						section('Pending'),
						section('In Progress'),
						section('Done')
					]))
			]));
};
var $author$project$State$DeleteUserConfirmed = function (a) {
	return {$: 156, a: a};
};
var $author$project$State$OpenAddUser = {$: 149};
var $author$project$State$OpenUserEditor = function (a) {
	return {$: 150, a: a};
};
var $author$project$State$RunOperation = function (a) {
	return {$: 13, a: a};
};
var $author$project$Views$usersView = function (model) {
	var me_ = A2(
		$elm$core$Maybe$withDefault,
		{J: '', bu: 0, bj: false, x: '', t: 1, H: ''},
		model.I);
	if (me_.H !== 'admin') {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('card')
				]),
			_List_fromArray(
				[
					$author$project$Ui$emptyNote('Admin access required.')
				]));
	} else {
		var userRow = function (u) {
			return A2(
				$elm$html$Html$tr,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(u.x)
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(u.J)
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$span,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class(
										(u.H === 'admin') ? 'tag tag-hot' : ((u.H === 'viewer') ? 'tag tag-cold' : 'tag tag-warm'))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(u.H)
									]))
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-sm btn-outline'),
										$elm$html$Html$Events$onClick(
										$author$project$State$OpenUserEditor(u.bu))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Edit')
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-sm btn-outline'),
										$elm$html$Html$Events$onClick(
										$author$project$State$RunOperation(
											'users/' + ($elm$core$String$fromInt(u.bu) + '/invite')))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Send invitation')
									]))
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-sm btn-danger'),
										$elm$html$Html$Events$onClick(
										A2(
											$author$project$State$ConfirmRequested,
											'Delete this account and revoke its sessions? Existing activity will remain in the audit trail.',
											$author$project$State$DeleteUserConfirmed(u.bu))),
										$elm$html$Html$Attributes$disabled(
										_Utils_eq(u.bu, me_.bu))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										_Utils_eq(u.bu, me_.bu) ? 'You' : 'Delete')
									]))
							]))
					]));
		};
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('page-head')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text('Users')
										])),
									A2(
									$elm$html$Html$span,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('empty-note')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Admins manage accounts. Viewers are read-only. Set record access and privileges in Account security → Team access.'),
											A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$href('/work/security'),
													$elm$html$Html$Attributes$class('btn btn-sm btn-outline')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text('Manage access and privileges')
												]))
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('flex')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-primary'),
											$elm$html$Html$Events$onClick($author$project$State$OpenAddUser)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('+ Add User')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card table-card')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$table,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('data-table')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$thead,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$tr,
											_List_Nil,
											_List_fromArray(
												[
													A2(
													$elm$html$Html$th,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Name')
														])),
													A2(
													$elm$html$Html$th,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Email')
														])),
													A2(
													$elm$html$Html$th,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Role')
														])),
													A2($elm$html$Html$th, _List_Nil, _List_Nil),
													A2($elm$html$Html$th, _List_Nil, _List_Nil)
												]))
										])),
									A2(
									$elm$html$Html$tbody,
									_List_Nil,
									A2($elm$core$List$map, userRow, model.al))
								]))
						]))
				]));
	}
};
var $author$project$Operations$flag = F2(
	function (key, value) {
		return A2(
			$elm$core$Result$withDefault,
			false,
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$field, key, $elm$json$Json$Decode$bool),
				value));
	});
var $author$project$Operations$metric = F2(
	function (label, value) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('stat')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('stat-label')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(label)
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('stat-value')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$elm$core$String$fromInt(value))
						]))
				]));
	});
var $author$project$Operations$num = F2(
	function (key, value) {
		return A2(
			$elm$core$Result$withDefault,
			0,
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$field, key, $elm$json$Json$Decode$int),
				value));
	});
var $author$project$Operations$str = F2(
	function (key, value) {
		return A2(
			$elm$core$Result$withDefault,
			'—',
			A2(
				$elm$json$Json$Decode$decodeValue,
				A2($elm$json$Json$Decode$field, key, $elm$json$Json$Decode$string),
				value));
	});
var $author$project$Operations$view = F2(
	function (model, kind) {
		var row = function (item) {
			switch (kind) {
				case 'archive':
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('operation-row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('eyebrow')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												A2($author$project$Operations$str, 'kind', item) + (' / ' + A2($author$project$Operations$str, 'number', item)))
											])),
										A2(
										$elm$html$Html$h3,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												A2($author$project$Operations$str, 'name', item))
											])),
										A2(
										$elm$html$Html$p,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('text-muted')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												'Archived ' + A2(
													$elm$core$String$left,
													10,
													A2($author$project$Operations$str, 'date', item)))
											]))
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-outline'),
										$elm$html$Html$Events$onClick(
										$author$project$State$RunOperation(
											((A2($author$project$Operations$str, 'kind', item) === 'lead') ? 'leads/' : 'clients/') + ($elm$core$String$fromInt(
												A2($author$project$Operations$num, 'id', item)) + '/restore')))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Restore record ↗')
									]))
							]));
				case 'duplicates':
					var records = A2(
						$elm$core$Result$withDefault,
						_List_Nil,
						A2(
							$elm$json$Json$Decode$decodeValue,
							A2(
								$elm$json$Json$Decode$field,
								'records',
								$elm$json$Json$Decode$list($elm$json$Json$Decode$value)),
							item));
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('operation-row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('eyebrow')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												'MATCHING ' + $elm$core$String$toUpper(
													A2($author$project$Operations$str, 'field', item)))
											])),
										A2(
										$elm$html$Html$h3,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(
												A2($author$project$Operations$str, 'value', item))
											]))
									])),
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('duplicate-links')
									]),
								A2(
									$elm$core$List$map,
									function (record) {
										return A2(
											$elm$html$Html$a,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('btn btn-outline'),
													$elm$html$Html$Attributes$href(
													_Utils_ap(
														(A2($author$project$Operations$str, 'kind', record) === 'lead') ? '/leads/' : '/clients/',
														$elm$core$String$fromInt(
															A2($author$project$Operations$num, 'id', record))))
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													A2($author$project$Operations$str, 'name', record) + ' ↗')
												]));
									},
									records))
							]));
				case 'metrics':
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('stats')
							]),
						_List_fromArray(
							[
								A2(
								$author$project$Operations$metric,
								'Pending emails',
								A2($author$project$Operations$num, 'pendingMail', item)),
								A2(
								$author$project$Operations$metric,
								'Failed deliveries',
								A2($author$project$Operations$num, 'failedMail', item)),
								A2(
								$author$project$Operations$metric,
								'Active sessions',
								A2($author$project$Operations$num, 'activeSessions', item)),
								A2(
								$author$project$Operations$metric,
								'Database · MB',
								(A2($author$project$Operations$num, 'databaseBytes', item) / 1048576) | 0)
							]));
				default:
					return A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class(
								A2($author$project$Operations$flag, 'read', item) ? 'operation-row reminder-read' : 'operation-row')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$span,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('eyebrow')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text(
												$elm$core$String$toUpper(
													A2($author$project$Operations$str, 'kind', item)) + (' / DUE ' + A2($author$project$Operations$str, 'due', item)))
											])),
										A2(
										$elm$html$Html$h3,
										_List_Nil,
										_List_fromArray(
											[
												A2(
												$elm$html$Html$a,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$href(
														A2($author$project$Operations$str, 'path', item))
													]),
												_List_fromArray(
													[
														$elm$html$Html$text(
														A2($author$project$Operations$str, 'title', item))
													]))
											]))
									])),
								A2(
								$elm$html$Html$button,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('btn btn-outline'),
										$elm$html$Html$Attributes$disabled(
										A2($author$project$Operations$flag, 'read', item)),
										$elm$html$Html$Events$onClick(
										$author$project$State$RunOperation(
											'reminders/' + (A2($author$project$Operations$str, 'kind', item) + ('/' + ($elm$core$String$fromInt(
												A2($author$project$Operations$num, 'id', item)) + '/read')))))
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(
										A2($author$project$Operations$flag, 'read', item) ? '✓ Read' : 'Mark as read')
									]))
							]));
			}
		};
		var _v0 = function () {
			switch (kind) {
				case 'archive':
					return _Utils_Tuple3('Archive', 'Deleted leads and clients stay here with their history. Restore a record to continue working.', 'No archived records. Your workspace is up to date.');
				case 'duplicates':
					return _Utils_Tuple3('Possible duplicates', 'Review shared email addresses and phone numbers before creating another record.', 'No matching contacts found. Looking good.');
				case 'metrics':
					return _Utils_Tuple3('System overview', 'Delivery queue, database storage and active sessions. Failed email deliveries need attention.', 'No system information available.');
				default:
					return _Utils_Tuple3('Your reminders', 'Follow-ups and tasks due in the next seven days. Mark reminders as read without completing the underlying task.', 'You’re all caught up. No upcoming reminders.');
			}
		}();
		var title = _v0.a;
		var description = _v0.b;
		var empty = _v0.c;
		return A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('page-head')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									A2(
									$elm$html$Html$h2,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(title)
										])),
									A2(
									$elm$html$Html$p,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('page-description')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(description)
										]))
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Events$onClick(
									$author$project$State$NavigateTo(model.bq.r))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Refresh ↻')
								]))
						])),
					model.bB ? $author$project$Ui$spinner : (($elm$core$List$isEmpty(model.bm) && (model.q === '')) ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('empty-state card')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('empty-state-icon')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('✓')
								])),
							A2(
							$elm$html$Html$h3,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(empty)
								])),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Everything you need will appear here.')
								]))
						])) : A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('operations-list')
						]),
					A2($elm$core$List$map, row, model.bm)))
				]));
	});
var $author$project$Main$workspaceSections = F2(
	function (model, kind) {
		var isAdmin = _Utils_eq(
			A2(
				$elm$core$Maybe$map,
				function ($) {
					return $.H;
				},
				model.I),
			$elm$core$Maybe$Just('admin'));
		var _v0 = A2(
			$elm$core$List$member,
			kind,
			_List_fromArray(
				['work/notifications', 'reminders', 'work/reminders'])) ? _Utils_Tuple2(
			'Inbox',
			_List_fromArray(
				[
					_Utils_Tuple3('work/notifications', '/work/notifications', 'Updates'),
					_Utils_Tuple3('reminders', '/reminders', 'Upcoming work'),
					_Utils_Tuple3('work/reminders', '/work/reminders', 'Email rules')
				])) : ((isAdmin && A2(
			$elm$core$List$member,
			kind,
			_List_fromArray(
				['work/reports', 'work/ageing', 'work/bottlenecks', 'work/trends']))) ? _Utils_Tuple2(
			'Reports',
			_List_fromArray(
				[
					_Utils_Tuple3('work/reports', '/work/reports', 'Overview'),
					_Utils_Tuple3('work/ageing', '/work/ageing', 'Application ageing'),
					_Utils_Tuple3('work/bottlenecks', '/work/bottlenecks', 'Bottlenecks'),
					_Utils_Tuple3('work/trends', '/work/trends', 'Historical workload')
				])) : (A2(
			$elm$core$List$member,
			kind,
			_List_fromArray(
				['work/invoices', 'work/sales', 'work/payments', 'work/payment-history', 'work/balances', 'work/expenses', 'work/cashflow', 'work/finance-audit', 'work/periods', 'work/reconciliation'])) ? _Utils_Tuple2(
			'Sales and accounting',
			_Utils_ap(
				isAdmin ? _List_fromArray(
					[
						_Utils_Tuple3('work/invoices', '/work/invoices', 'Invoices')
					]) : _List_Nil,
				_List_fromArray(
					[
						_Utils_Tuple3('work/sales', '/work/sales', 'Sales report'),
						_Utils_Tuple3('work/payments', '/work/payments', 'Payments'),
						_Utils_Tuple3('work/balances', '/work/balances', 'Balances'),
						_Utils_Tuple3('work/expenses', '/work/expenses', 'Expenses'),
						_Utils_Tuple3('work/cashflow', '/work/cashflow', 'Receipts and expenses'),
						_Utils_Tuple3('work/finance-audit', '/work/finance-audit', 'Financial audit'),
						_Utils_Tuple3('work/periods', '/work/periods', 'Period closing'),
						_Utils_Tuple3('work/reconciliation', '/work/reconciliation', 'Bank reconciliation')
					]))) : ((isAdmin && A2(
			$elm$core$List$member,
			kind,
			_List_fromArray(
				['duplicates', 'work/merge']))) ? _Utils_Tuple2(
			'Review duplicates',
			_List_fromArray(
				[
					_Utils_Tuple3('duplicates', '/duplicates', '1. Find matches'),
					_Utils_Tuple3('work/merge', '/work/merge', '2. Compare and merge')
				])) : ((isAdmin && A2(
			$elm$core$List$member,
			kind,
			_List_fromArray(
				['metrics', 'work/mail']))) ? _Utils_Tuple2(
			'Administration',
			_List_fromArray(
				[
					_Utils_Tuple3('metrics', '/system', 'System overview'),
					_Utils_Tuple3('work/mail', '/work/mail', 'Email delivery')
				])) : _Utils_Tuple2('', _List_Nil)))));
		var title = _v0.a;
		var sections = _v0.b;
		return $elm$core$List$isEmpty(sections) ? $elm$html$Html$text('') : A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('workspace-sections')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h2,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(title)
						])),
					A2(
					$elm$html$Html$nav,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-actions'),
							A2($elm$html$Html$Attributes$attribute, 'aria-label', title + ' sections')
						]),
					A2(
						$elm$core$List$map,
						function (_v1) {
							var section = _v1.a;
							var path = _v1.b;
							var label = _v1.c;
							return A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href(path),
										$elm$html$Html$Attributes$class(
										_Utils_eq(section, kind) ? 'btn btn-primary' : 'btn btn-outline'),
										A2(
										$elm$html$Html$Attributes$attribute,
										'aria-current',
										_Utils_eq(section, kind) ? 'page' : 'false')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text(label)
									]));
						},
						sections))
				]));
	});
var $author$project$Main$pageView = function (model) {
	var _v0 = $author$project$State$routeOf(model.bq);
	switch (_v0.$) {
		case 0:
			return $author$project$Views$dashboardView(model);
		case 1:
			return $author$project$Views$leadsView(model);
		case 2:
			var id = _v0.a;
			return A2($author$project$Views$leadDetailView, model, id);
		case 3:
			return $author$project$Views$clientsView(model);
		case 4:
			var id = _v0.a;
			return A2($author$project$Views$clientDetailView, model, id);
		case 5:
			return $author$project$Views$tasksView(model);
		case 6:
			return $author$project$Views$usersView(model);
		case 7:
			return $author$project$Views$auditView(model);
		default:
			var kind = _v0.a;
			return A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						A2($author$project$Main$workspaceSections, model, kind),
						A2($elm$core$String$startsWith, 'work/', kind) ? A2(
						$author$project$Features$view,
						model,
						A2($elm$core$String$dropLeft, 5, kind)) : A2($author$project$Operations$view, model, kind)
					]));
	}
};
var $author$project$Main$pagination = function (model) {
	var size = function () {
		var _v1 = $author$project$State$routeOf(model.bq);
		switch (_v1.$) {
			case 1:
				return $elm$core$Maybe$Just(
					$elm$core$List$length(model.as));
			case 3:
				return $elm$core$Maybe$Just(
					$elm$core$List$length(model.aS));
			case 5:
				return $elm$core$Maybe$Just(
					$elm$core$List$length(model.aj));
			case 8:
				var kind = _v1.a;
				return A2(
					$elm$core$List$member,
					kind,
					_List_fromArray(
						['metrics', 'work/reports', 'work/ageing', 'work/bottlenecks', 'work/trends', 'work/sales', 'work/cashflow'])) ? $elm$core$Maybe$Nothing : $elm$core$Maybe$Just(
					$elm$core$List$length(model.bm));
			default:
				return $elm$core$Maybe$Nothing;
		}
	}();
	if (size.$ === 1) {
		return A2($elm$html$Html$span, _List_Nil, _List_Nil);
	} else {
		var count = size.a;
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('pagination'),
					A2($elm$html$Html$Attributes$attribute, 'aria-label', 'Pagination')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$span,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							model.bB ? 'Loading records…' : ($elm$core$String$fromInt(count) + (' records · page ' + $elm$core$String$fromInt(1 + ((model.dB / 50) | 0)))))
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn btn-outline'),
							$elm$html$Html$Attributes$disabled((!model.dB) || model.bB),
							$elm$html$Html$Events$onClick(
							$author$project$State$PageStep(-1))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('← Previous')
						])),
					A2(
					$elm$html$Html$button,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('btn btn-outline'),
							$elm$html$Html$Attributes$disabled((count < 50) || model.bB),
							$elm$html$Html$Events$onClick(
							$author$project$State$PageStep(1))
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Next →')
						]))
				]));
	}
};
var $author$project$State$PwConfirmChanged = function (a) {
	return {$: 161, a: a};
};
var $author$project$State$PwCurrentChanged = function (a) {
	return {$: 159, a: a};
};
var $author$project$State$PwNewChanged = function (a) {
	return {$: 160, a: a};
};
var $author$project$State$SubmitPasswordChange = {$: 162};
var $author$project$Views$passwordModal = function (model) {
	return A2(
		$author$project$Ui$modal,
		'Change Password',
		A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A6($author$project$Views$checkedInputField, model, 'pwCurrent', 'Current Password', model.av, 'password', $author$project$State$PwCurrentChanged),
					A6($author$project$Views$checkedInputField, model, 'pwNew', 'New Password (min 12 characters)', model.V, 'password', $author$project$State$PwNewChanged),
					A6($author$project$Views$checkedInputField, model, 'pwConfirm', 'Confirm New Password', model.au, 'password', $author$project$State$PwConfirmChanged),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '14px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-primary'),
									$elm$html$Html$Events$onClick($author$project$State$SubmitPasswordChange)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Update Password')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Events$onClick($author$project$State$TogglePwModal)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Cancel')
								]))
						]))
				])));
};
var $author$project$State$PortalFile = function (a) {
	return {$: 49, a: a};
};
var $author$project$State$PortalLogout = {$: 53};
var $author$project$State$PortalRefresh = {$: 52};
var $author$project$State$PortalUpload = function (a) {
	return {$: 50, a: a};
};
var $author$project$Features$portalView = function (model) {
	var connected = !$elm$core$List$isEmpty(
		A2($author$project$Features$items, 'client', model.bC));
	var block = F3(
		function (name, key, render) {
			return A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('card')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$h2,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text(name)
							])),
						$elm$core$List$isEmpty(
						A2($author$project$Features$items, key, model.bC)) ? A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('empty-note')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								(key === 'documents') ? 'No approved documents have been shared with you yet.' : ((key === 'checklist') ? 'Your case officer has not requested documents yet.' : 'Nothing to show yet.'))
							])) : A2(
						$elm$html$Html$div,
						_List_Nil,
						A2(
							$elm$core$List$map,
							render,
							A2($author$project$Features$items, key, model.bC)))
					]));
		});
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('portal-container')
			]),
		_Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$h1,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Your client workspace')
						])),
					(model.cl !== '') ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('error-banner'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(model.cl)
						])) : $elm$html$Html$text(''),
					(model.cn !== '') ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('notice-banner'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'status')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(model.cn)
						])) : $elm$html$Html$text(''),
					model.aG ? A2(
					$elm$html$Html$p,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('notice-banner'),
							A2($elm$html$Html$Attributes$attribute, 'role', 'status')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Please wait… Your request is in progress.')
						])) : $elm$html$Html$text('')
				]),
			(!connected) ? _List_fromArray(
				[
					A2(
					$elm$html$Html$p,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text('Open the private sign-in link supplied by your case officer. Each link can be used once. Access may expire or be revoked; contact your case officer for a replacement.')
						]))
				]) : _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-actions')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(model.aG),
									$elm$html$Html$Events$onClick($author$project$State$PortalRefresh)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Refresh status')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$disabled(model.aG),
									$elm$html$Html$Events$onClick($author$project$State$PortalLogout)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Sign out')
								]))
						])),
					A3(
					block,
					'Your details',
					'client',
					function (item) {
						return A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2($author$project$Features$str, 'name', item) + (' · ' + A2($author$project$Features$str, 'number', item)))
								]));
					}),
					A3(
					block,
					'Applications',
					'cases',
					function (item) {
						return A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2($author$project$Features$str, 'title', item) + (' · ' + (A2($author$project$Features$str, 'stage', item) + ((A2($author$project$Features$str, 'deadline', item) === '') ? '' : (' · Next deadline: ' + A2($author$project$Features$str, 'deadline', item))))))
								]));
					}),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('card')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$for('portal-file')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Choose a file to submit (up to 25 MB)')
								])),
							A2(
							$elm$html$Html$input,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$id('portal-file'),
									$elm$html$Html$Attributes$type_('file'),
									$elm$html$Html$Attributes$disabled(model.aG),
									A2(
									$elm$html$Html$Events$on,
									'change',
									A2(
										$elm$json$Json$Decode$map,
										$author$project$State$PortalFile,
										A2(
											$elm$json$Json$Decode$at,
											_List_fromArray(
												['target', 'files']),
											A2($elm$json$Json$Decode$index, 0, $elm$file$File$decoder))))
								]),
							_List_Nil),
							A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2(
										$elm$core$Maybe$withDefault,
										'Choose a file, then submit it to the matching requirement below.',
										A2($elm$core$Maybe$map, $elm$file$File$name, model.cm)))
								])),
							A2(
							$elm$html$Html$p,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('status-help')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Files are scanned before review. A rejected document needs a replacement that addresses the feedback. Refresh to see progress.')
								]))
						])),
					A3(
					block,
					'Document checklist',
					'checklist',
					function (item) {
						return A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('operation-row')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_Nil,
									_List_fromArray(
										[
											A2(
											$elm$html$Html$h3,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													A2($author$project$Features$str, 'title', item))
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													_Utils_ap(
														A2($author$project$Features$str, 'status', item),
														(A2($author$project$Features$str, 'required', item) === '1') ? ' · Required' : ' · Optional'))
												])),
											A2(
											$elm$html$Html$p,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('status-help')
												]),
											_List_fromArray(
												[
													$elm$html$Html$text(
													$author$project$Features$scanHelp(
														A2($author$project$Features$str, 'scanStatus', item)))
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													A2($author$project$Features$str, 'feedback', item))
												])),
											A2(
											$elm$html$Html$p,
											_List_Nil,
											_List_fromArray(
												[
													$elm$html$Html$text(
													(A2($author$project$Features$str, 'expiresOn', item) === '') ? '' : ('Expires: ' + A2($author$project$Features$str, 'expiresOn', item)))
												]))
										])),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-primary'),
											$elm$html$Html$Attributes$disabled(
											_Utils_eq(model.cm, $elm$core$Maybe$Nothing) || model.aG),
											$elm$html$Html$Events$onClick(
											$author$project$State$PortalUpload(
												A2(
													$elm$core$Maybe$withDefault,
													0,
													$elm$core$String$toInt(
														A2($author$project$Features$str, 'id', item)))))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text(
											model.aG ? 'Please wait…' : 'Submit selected file')
										]))
								]));
					}),
					A3(
					block,
					'Shared documents',
					'documents',
					function (item) {
						return A2(
							$elm$html$Html$a,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Attributes$href(
									'/api/portal/documents/' + A2($author$project$Features$str, 'id', item))
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(
									A2($author$project$Features$str, 'title', item))
								]));
					}),
					A3(
					block,
					'Invoices',
					'invoices',
					function (item) {
						return A2(
							$elm$html$Html$p,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									'INV-' + (A2($author$project$Features$str, 'id', item) + (' · ' + (A2($author$project$Features$str, 'description', item) + (' · ' + (A2($author$project$Features$str, 'currency', item) + (' ' + (A2($author$project$Features$str, 'amount', item) + (' · ' + (A2($author$project$Features$str, 'status', item) + (' · Paid ' + (A2($author$project$Features$str, 'paid', item) + (' · Balance ' + (A2($author$project$Features$str, 'balance', item) + (' · Due ' + A2($author$project$Features$str, 'dueDate', item))))))))))))))))
								]));
					})
				])));
};
var $author$project$Views$toastStack = function (model) {
	return $elm$core$List$isEmpty(model.bo) ? A2($elm$html$Html$span, _List_Nil, _List_Nil) : A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('toast-container')
			]),
		A2(
			$elm$core$List$map,
			function (t) {
				return A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class(
							'toast toast-' + function () {
								var _v0 = t.dr;
								switch (_v0) {
									case 'success':
										return 'success';
									case 'error':
										return 'error';
									default:
										return 'info';
								}
							}())
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(t.du)
						]));
			},
			model.bo));
};
var $author$project$State$CloseUserForm = {$: 151};
var $author$project$State$SubmitUserForm = {$: 153};
var $author$project$State$UpdateUserForm = function (a) {
	return {$: 152, a: a};
};
var $author$project$Types$roles = _List_fromArray(
	['admin', 'consultant', 'viewer']);
var $author$project$Views$userFormModal = function (model) {
	var f = model.o;
	var editing = !_Utils_eq(f.cE, $elm$core$Maybe$Nothing);
	var pwField = editing ? A6(
		$author$project$Views$checkedInputField,
		model,
		'password',
		'Password (leave blank to keep current)',
		f.ad,
		'password',
		function (v) {
			return $author$project$State$UpdateUserForm(
				function (g) {
					return _Utils_update(
						g,
						{ad: v});
				});
		}) : A6(
		$author$project$Views$checkedInputField,
		model,
		'password',
		'Password (12+ characters, or leave blank to email an invitation)',
		f.ad,
		'password',
		function (v) {
			return $author$project$State$UpdateUserForm(
				function (g) {
					return _Utils_update(
						g,
						{ad: v});
				});
		});
	return A2(
		$author$project$Ui$modal,
		editing ? 'Edit User' : 'Add User',
		A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A6(
					$author$project$Views$checkedInputField,
					model,
					'name',
					'Full Name',
					f.x,
					'text',
					function (v) {
						return $author$project$State$UpdateUserForm(
							function (g) {
								return _Utils_update(
									g,
									{x: v});
							});
					}),
					editing ? A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('form-group')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$label,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Email')
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('input'),
									A2($elm$html$Html$Attributes$style, 'color', '#5B6572')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(f.J)
								]))
						])) : A6(
					$author$project$Views$checkedInputField,
					model,
					'email',
					'Email',
					f.J,
					'email',
					function (v) {
						return $author$project$State$UpdateUserForm(
							function (g) {
								return _Utils_update(
									g,
									{J: v});
							});
					}),
					A4(
					$author$project$Ui$selectField,
					'Role',
					$author$project$Types$roles,
					f.H,
					function (v) {
						return $author$project$State$UpdateUserForm(
							function (g) {
								return _Utils_update(
									g,
									{H: v});
							});
					}),
					pwField,
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('flex'),
							A2($elm$html$Html$Attributes$style, 'margin-top', '14px')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-primary'),
									$elm$html$Html$Events$onClick($author$project$State$SubmitUserForm)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Save')
								])),
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('btn btn-outline'),
									$elm$html$Html$Events$onClick($author$project$State$CloseUserForm)
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('Cancel')
								]))
						]))
				])));
};
var $author$project$Main$workspaceHeading = function (model) {
	var section = function () {
		var _v2 = $author$project$State$routeOf(model.bq);
		switch (_v2.$) {
			case 0:
				return 'Overview';
			case 1:
				return 'Leads';
			case 2:
				return 'Lead details';
			case 3:
				return 'Clients';
			case 4:
				return 'Client details';
			case 5:
				return 'Tasks';
			case 6:
				return 'Team';
			case 7:
				return 'Audit history';
			default:
				var kind = _v2.a;
				return A2($elm$core$String$startsWith, 'work/', kind) ? $author$project$Features$heading(
					A2($elm$core$String$dropLeft, 5, kind)).a : ((kind === 'metrics') ? 'System' : _Utils_ap(
					$elm$core$String$toUpper(
						A2($elm$core$String$left, 1, kind)),
					A2($elm$core$String$dropLeft, 1, kind)));
		}
	}();
	var _v0 = function () {
		var _v1 = $author$project$State$routeOf(model.bq);
		_v1$8:
		while (true) {
			switch (_v1.$) {
				case 0:
					return _Utils_Tuple2('A clear view of what’s next.', 'Your relationships, progress and priorities in one place.');
				case 1:
					return _Utils_Tuple2('Build your next relationship.', 'Keep every conversation moving toward a clear next step.');
				case 3:
					return _Utils_Tuple2('Great service starts here.', 'A shared view of every client and their journey.');
				case 5:
					return _Utils_Tuple2('Make room for your best work.', 'Turn follow-ups and deadlines into progress.');
				case 6:
					return _Utils_Tuple2('Your people, connected.', 'Invite colleagues and manage their access.');
				case 8:
					if (_v1.a === 'work/applications') {
						return _Utils_Tuple2('Every application, moving forward.', 'Manage each client’s applications, stages and next deadlines.');
					} else {
						break _v1$8;
					}
				case 4:
					return _Utils_Tuple2('Client record', 'Applications, documents, tasks and history in one place.');
				case 7:
					return _Utils_Tuple2('Every change, accounted for.', 'A complete history of activity across your workspace.');
				default:
					break _v1$8;
			}
		}
		return _Utils_Tuple2('Your client workspace.', 'Keep the details close and the next step clear.');
	}();
	var title = _v0.a;
	var subtitle = _v0.b;
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('workspace-heading')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('workspace-topline')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('breadcrumb')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$href('/')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Workspace')
									])),
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text('/')
									])),
								A2(
								$elm$html$Html$span,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(section)
									]))
							])),
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('workspace-date')
							]),
						_List_fromArray(
							[
								$author$project$Ui$icon('clock'),
								$elm$html$Html$text(
								model.bH + (' ' + (model.bV + (' · ' + (model.bR + (model.a9 ? '' : ' · local clock'))))))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('heading-content')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('eyebrow')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('ECC / CLIENT OPERATIONS')
									])),
								A2(
								$elm$html$Html$h1,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(title)
									])),
								A2(
								$elm$html$Html$p,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(subtitle)
									]))
							])),
						_Utils_eq(
						$author$project$State$routeOf(model.bq),
						$author$project$State$Dashboard) ? A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('btn btn-primary heading-action'),
								$elm$html$Html$Attributes$href('/leads')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('View pipeline'),
								$author$project$Ui$icon('arrow')
							])) : A2($elm$html$Html$span, _List_Nil, _List_Nil)
					]))
			]));
};
var $author$project$Main$bodyView = function (model) {
	return (model.bq.r === '/portal') ? _List_fromArray(
		[
			$author$project$Features$portalView(model)
		]) : ((!model.an) ? _List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('login-wrap')
				]),
			_List_fromArray(
				[$author$project$Ui$spinner]))
		]) : (_Utils_eq(model.I, $elm$core$Maybe$Nothing) ? _List_fromArray(
		[
			$author$project$Views$loginView(model)
		]) : $elm$core$List$concat(
		_List_fromArray(
			[
				_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$href('#main-content'),
							$elm$html$Html$Attributes$class('skip-link')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Skip to content')
						])),
					$author$project$Main$headerBar(model),
					$author$project$Main$mobileNavigation(model),
					A2(
					$elm$html$Html$main_,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('container'),
							$elm$html$Html$Attributes$id('main-content'),
							$elm$html$Html$Attributes$tabindex(-1)
						]),
					_List_fromArray(
						[
							$author$project$Main$workspaceHeading(model),
							(model.q !== '') ? A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('error-banner'),
									A2($elm$html$Html$Attributes$attribute, 'role', 'alert')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text(model.q),
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-sm btn-outline'),
											$elm$html$Html$Events$onClick(
											$author$project$State$NavigateTo(model.bq.r))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Try again')
										]))
								])) : A2($elm$html$Html$span, _List_Nil, _List_Nil),
							((model.q !== '') && (_Utils_eq(model.R, $elm$core$Maybe$Nothing) && _Utils_eq(model.c$, $elm$core$Maybe$Nothing))) ? A2($elm$html$Html$span, _List_Nil, _List_Nil) : $author$project$Main$pageView(model),
							$author$project$Main$pagination(model)
						]))
				]),
				model.ai ? _List_fromArray(
				[
					$author$project$Views$userFormModal(model)
				]) : _List_Nil,
				model.ax ? _List_fromArray(
				[
					$author$project$Views$passwordModal(model)
				]) : _List_Nil,
				_List_fromArray(
				[
					$author$project$Features$conflictView(model)
				]),
				function () {
				var _v0 = model.W;
				if (!_v0.$) {
					var _v1 = _v0.a;
					var message = _v1.a;
					return _List_fromArray(
						[
							A2(
							$author$project$Ui$modal,
							'Confirm this action',
							A2(
								$elm$html$Html$div,
								_List_Nil,
								_List_fromArray(
									[
										A2(
										$elm$html$Html$p,
										_List_Nil,
										_List_fromArray(
											[
												$elm$html$Html$text(message)
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('flex'),
												A2($elm$html$Html$Attributes$style, 'margin-top', '20px')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('btn btn-outline'),
														$elm$html$Html$Events$onClick($author$project$State$ConfirmDismissed)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Cancel')
													])),
												A2(
												$elm$html$Html$button,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('btn btn-primary'),
														$elm$html$Html$Events$onClick($author$project$State$ConfirmAccepted)
													]),
												_List_fromArray(
													[
														$elm$html$Html$text('Confirm')
													]))
											]))
									])))
						]);
				} else {
					return _List_Nil;
				}
			}(),
				_List_fromArray(
				[
					$author$project$Views$toastStack(model)
				])
			]))));
};
var $author$project$Main$view = function (model) {
	return {
		a6: _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class(
						model.aB ? 'app-root dark-mode' : 'app-root')
					]),
				$author$project$Main$bodyView(model))
			]),
		Z: 'ECC · Client workspace'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{dp: $author$project$Main$init, dw: $author$project$State$UrlChanged, dx: $author$project$State$LinkClicked, dT: $author$project$Main$subscriptions, dY: $author$project$Main$update, d$: $author$project$Main$view});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));