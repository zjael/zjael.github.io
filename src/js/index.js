import '../scss/style.scss';
import * as config from './lib/config.js';
import * as dom from './lib/dom.js';
import * as caret from './lib/caret.js';

import { onInput, onKeyEvent } from './lib/input.js';

const modal = document.getElementById("settings");
const btn = document.getElementById("settings-btn");

(async () => {
	// Load config from localStorage or gist
	await config.load();

	// Create HTML elements
	dom.createLinks();
})();

// Input event
dom.input.addEventListener("input", onInput);
dom.input.addEventListener("keydown", onKeyEvent);


// Blinking caret
caret.init();

dom.input.onblur = function() {
	caret.hide();
}

dom.input.onfocus = function() {
	caret.show();
	caret.reset();
}

// Back/forward fix - Modern browsers utilize BFCache
window.addEventListener('pageshow', function() {
	dom.clearInput();
	dom.clearOutput();
});

// Focus input
['#hidden','#search-field','.links'].forEach(element =>
    document.querySelector(element).addEventListener('click', function() {
		dom.input.focus();
	})
);

btn.onclick = function() {
  modal.style.display = "block";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}