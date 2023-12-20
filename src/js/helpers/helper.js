'use strict';

import gsap from 'gsap';

//! Helper variables
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const settings = ["dark-mode", "high-contrast", "underline-links", "reduce-motion"];

//! Helper functions
/**
 * Return an element object of HTML DOM
 * @param {string} argument HTML selector string
 * @returns
 */
function _q(argument) {
	return document.querySelector(argument);
}
function _qAll(argument) {
	return document.querySelectorAll(argument);
}

function removeClass(el, className) {
	if (typeof el == "string") el = _q(el);

	if (el.classList) {
		el
			.classList
			.remove(className)
	} else {
		el.className = el
			.className
			.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
	}
}
/**
 * Add class name to element of HTML DOM
 * @param {element} el Element object
 * @param {string} className Class name
 */
function addClass(el, className) {
	if (typeof el == "string") el = _q(el);

	if (el.classList) {
		el
			.classList
			.add(className)
	} else {
		var current = el.className,
			found = false;
		var all = current.split(' ');
		for (var i = 0; i < all.length, !found; i += 1) {
			found = all[i] === className
		}
		if (!found) {
			if (current === '') {
				el.className = className
			} else {
				el.className += ' ' + className
			}
		}
	}
}
function hasClass(el, className) {
	if (el.classList)
		return el.classList.contains(className);
	else
		return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
}
function nextElementSibling(el) {
	do {
		el = el.nextSibling
	} while (el && el.nodeType !== 1);
	return el
}
function hoverEvents(els, over, out) {
	els.forEach(function (el) {
		el.addEventListener("mouseover", function (e) {
			if (over) over(el, e);
		});
		el.addEventListener("mouseout", function (e) {
			if (out) out(el, e);
		});
	});
}

//! Clear the style
/**
 * Remove a class from elements in query selector
 * @param {element} el Elements from HTML DOM
 */
function removeStyle(el) {
	if (el.style) {
		el.style = {};
	} else {
		// gsap.utils.toArray(el).forEach(function (el) {
		// 	removeStyle(el);
		// });
	}
}


// Add plural to word
function plural(number, word, locale) {
	if (!locale) locale = "en-US";
	if (!word) {
		word = '';
	} else {
		word = ' ' + word;
		if (number > 1) word = word + 's';
	}
	return number.toLocaleString(locale) + word;
}
function pluralinwords(number, word, locale) {
	if (!locale) locale = "en-US";

	if (!word) {
		word = '';
	} else {
		word = ' ' + word;
		if (number > 1) word = word + 's';
	}

	if (Math.floor(number / 1000000) > 0) {
		number = plural(Math.floor(number / 1000000), "million");
	} else if (Math.floor(number / 1000) > 0) {
		number = plural(Math.floor(number / 1000), "thousand");
	}

	return number.toLocaleString(locale) + word;
}
// Humanize date difference
function datediff(date) {
	var when = "";
	var today = new Date();
	date = new Date(date);

	var diff = today.getTime() - date.getTime();
	var diffday = Math.round(diff / (1000 * 3600 * 24));
	var diffmonth = Math.round(diff / (30.5 * 1000 * 3600 * 24));
	var diffyear = Math.round(diff / (12 * 30.5 * 1000 * 3600 * 24));

	if (diffyear == 1) when = "A year ago";
	else if (diffyear > 1) when = diffyear + " years ago";
	else if (diffmonth > 1) when = diffmonth + " months ago";
	else if (diffmonth == 1) when = "A month ago";
	else if (diffday >= 14) when = Math.round(diffday / 7) + " weeks ago";
	else if (diffday >= 7) when = "A week ago";
	else if (diffday == 1) when = "Yesterday";
	else if (diffday > 1) when = diffday + " days ago";
	// else when = "Today at " + date_format(date,"H:i");
	else when = "Today";

	return when;
}
// Wait for image to load
// Parameter:
// 1. IMG Elements Object or String
// 2. On progress callback, or on done callback if there's only 2 parameter
// 3. On done callback
function waitForImg() {
	return new Promise(resolve => {
		var els,
			progress,
			els_count;

		if (arguments.length <= 0) {
			resolve(false);
		} else {
			els = typeof arguments[0] != "object" ? document.querySelectorAll(els) : arguments[0];
			els_count = els.length;
			progress = typeof arguments[1] == "function" ? arguments[1] : false;

			// At the beginning animate the progress a bit
			if (progress) progress(els_count, 100 - (els_count / els.length * 100));

			if (els_count > 0) {
				for (var i = 0; i < els.length; i++) {
					// When loaded report it as a progress
					if (els[i].complete) {
						if (progress) progress(els_count--, 100 - (els_count / els.length * 100));
						if (els_count == 0) resolve(true);
					} else {
						els[i].addEventListener("load", _ => {
							if (progress) progress(els_count--, 100 - (els_count / els.length * 100));
							if (els_count == 0) resolve(true);
						});
					}
				}
			} else {
				if (progress) progress(0, 100);
				resolve(true);
			}
		}
	});
}

//! Local storage

function get(name) {
	return localStorage ? localStorage.getItem(name) : false;
}
function set(name, value) {
	if (localStorage) localStorage.setItem(name, value);
}
function remove(name) {
	if (localStorage) localStorage.removeItem(name);
}


/**
 * Call konami code script
 */
function konami() {
	var konami = "38,38,40,40,37,39,37,39,66,65".split(","),
		keyIndex = 0;
	document.onkeydown = function (t) {
		konami[keyIndex] == t.keyCode
			? keyIndex++
			: keyIndex = 0,
			keyIndex == konami.length && (0 === _qAll("#konamicode").length && (_q("body").innerHTML += '<div id="konamicode"><iframe width="905" height="510" src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&controls=0" frameborder="0" allow="autoplay; picture-in-picture" allowfullscreen></iframe></div>'), keyIndex = 0);
		if (_q('#konamicode') != undefined) {
			const elem = _q('#konamicode');
			elem.onclick = _ => {
				gsap.to('#konamicode', {
					duration: reduceMotion() ? 0 : 1,
					ease: "expo.in",
					opacity: 0,
					onComplete: function () {
						elem
							.parentNode
							.removeChild(elem)
					}
				})
			}
		}
	};
}


//
//! Get reduce motion status
//

function reduceMotion() {
	return get(settings[3]) ? true : false;
}

export {
	monthNames,
	settings,
	_q,
	_qAll,
	removeClass,
	addClass,
	hasClass,
	nextElementSibling,
	hoverEvents,
	removeStyle,
	plural,
	pluralinwords,
	datediff,
	waitForImg,
	konami,
	get,
	set,
	remove,
	reduceMotion
};