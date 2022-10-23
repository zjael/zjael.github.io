import * as dom from './dom.js';

export let caret;

const caretHandler = () => {
	dom.toggleVisibility(dom.caret);
}

export function show() {
  clearInterval(caret);
  dom.caret.style.visibility = 'visible';
}

export function hide() {
  clearInterval(caret);
  dom.caret.style.visibility = 'hidden';
}

export function toggle() {
  dom.toggleVisibility(dom.caret);
}

export function init() {
  caret = window.setInterval(caretHandler, 500);
}

export function reset() {
  caret = window.setInterval(caretHandler, 500);
}