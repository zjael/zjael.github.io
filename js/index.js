let search_el = document.getElementById('search-suggestions');
let output_el = document.getElementById('output');
let input_el = document.querySelector('input');
let caret_el = document.getElementById('caret');
let query_el = document.getElementById('query');
let suggestion_el = document.getElementById('suggestion');

let cmd;
let suggestion = {
	name: '',
	influence: '',
	isCmd: '',
};

// Load config from localStorage or gist
loadConfig();

// Create HTML elements
if(CONFIG.cryptos) createCryptos();
if(CONFIG.weather) createWeather();
createLinks();

// Input event
input_el.addEventListener("input", inputHandler);
input_el.addEventListener("keydown", keyEvent);

let auth_token = localStorage.getItem('auth_token');

// Blinking caret
var caret = window.setInterval(function() {
	invertVisibility(caret_el);
}, 500);
input_el.onblur = function() {
	clearInterval(caret);
	caret_el.style.visibility = 'hidden';
}
input_el.onfocus = function() {
	clearInterval(caret);
	caret_el.style.visibility = 'visible';
	caret = window.setInterval(function() {
		invertVisibility(caret_el);
	}, 500);
}

// Back/forward fix - Modern browsers utilize BFCache
window.addEventListener('pageshow', function() {
	clearInput();
	clearOutput();
});

// Focus input
['#hidden','#search-field','.links'].forEach(element => 
    document.querySelector(element).addEventListener('click', function() {
		input_el.focus();
	})
);