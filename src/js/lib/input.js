import * as dom from './dom.js';
import * as suggestion from './suggestion.js';
import * as utils from './utils.js'

let state;

export async function onInput() {
  const input = dom.input.value;
  dom.query.textContent = input;
  dom.query.style.backgroundColor = "transparent";
  dom.clearOutput();

  if(input.length == 0) return;

  // Check if input matches command
  const isCommand = suggestion.isCommand(input);
  if(isCommand) {
    state = isCommand;
  } else {
    const pick = await Promise.all([suggestion.commands(input), suggestion.links(input), suggestion.search(input)]).then(results => {
      return results.flat()[0];
    });

    if(pick) {
      state = pick;
    }
  }

  if(state && state.cmd) {
    if(state.cmd.autoexec) {
      const result = await state.cmd.fn(state.args);
      dom.output.textContent = result;
    } else {
      if (state.args && state.args.length == 0) {
        dom.output.textContent = state.cmd.format();
      }
    }
  } else if(state) {
    dom.suggestion.textContent = state.name.substr(input.length, state.name.length);
  }

  if(isCommand || input == state.name) {
    dom.query.style.color = suggestion.color(state.source);
  } else {
    dom.query.style.color = "#979c9b";
  }

  dom.suggestion.style.color = suggestion.color(state.source);
}

export async function onKeyEvent(event) {
  const shift = event.shiftKey;
  const ctrl = event.ctrlKey;
  const alt = event.altkey;
  const space = event.key == ' ';
  const tab = event.key == 'Tab';
  const enter = event.key == 'Enter';
  const leftArrow = event.key == 'ArrowLeft';
  const rightArrow = event.key == 'ArrowRight';

  if(leftArrow) {
    dom.suggestion.textContent = dom.query.textContent.slice(-1) + dom.suggestion.textContent;
    dom.query.textContent = dom.query.textContent.substr(0, dom.query.textContent.length - 1);
  }
  else if(rightArrow) {
    dom.suggestion.textContent = dom.suggestion.textContent.substr(0, dom.suggestion.textContent.length - 1);
    dom.query.textContent = dom.input.value.substr(0, dom.query.textContent.length + 1);
  }

  // Show/Hide links
  if(space) {
    if(dom.query.textContent.length == 0) {
        event.preventDefault();
        dom.toggleLinks();
    }
  }

  // Autocomplete suggestion
  // Show/Hide links
  if(tab) {
      event.preventDefault();
      if(dom.query.textContent.length == 0) {
          event.preventDefault();
          dom.toggleLinks();
        // Grab suggestion from state
      } else if (state) {
        dom.input.value = state.name;
        onInput();
      }
      return;
  }
  // ENTER
  // Redirects based on given input and if a match occurs
  if(enter) {
      // Hide/Unhide Links
      if(dom.query.textContent.length == 0) {
          event.preventDefault();
          invertLinks();
      }
      // Command match
      if(state.cmd) {
        const output = await state.cmd.fn(state.args);
        dom.output.textContent = output;
      }
      // Config links match
      else {
        utils.redirect(state.url);
      }
      return;
  }

  // CTRL+A
  // Highlights all text in query_el
  if(ctrl && event.key == 'a') {
    dom.query.style.color = "#474747";
    dom.query.style.backgroundColor = "#979c9b";
  }

  // CTRL+L
  // Clears input & output
  if(ctrl && event.key == 'l') {
      event.preventDefault();
      dom.clearInput();
      dom.clearOutput();
  }

  // CTRL+C
  // Copies value output from cmd, if avaviable
  if(ctrl && event.key == 'c') {

  }
}