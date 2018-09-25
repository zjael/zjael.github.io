async function inputHandler() {
	console.time('timer1');
	console.clear();

    let input = input_el.value;
    query_el.textContent = input;
    query_el.style.backgroundColor = "transparent";
    suggestion.name = null;
    
	if(input.length == 0) {
		clearOutput();
		return;
	}

    let match = suggestion.isCmd = await matchCmd(input);
    output_el.textContent = ' ';
    
	if(match) {
        suggestion_el.textContent = '';

        cmd = commands[suggestion.isCmd.name](false);
        if(cmd.autocall == true) {
            cmd = commands[suggestion.isCmd.name](suggestion.isCmd.query);
        }
        
		if(match.query.length == 0) {
			output_el.textContent = cmd.name.toLowerCase() + " " + cmd.usage;
		} else {
			if(!isURL(cmd.output)) {
				output_el.textContent = cmd.output;
			}
		}
	} else {
		cmd = null;
	}

    // Get config & search suggestions
	if(!cmd) {
		suggestion = await getSuggestions(input);
		autoComplete(input, suggestion);
	}
	console.timeEnd('timer1');

    // Color query element - based on Influence from suggestion
    queryColor();
}

function keyEvent(event) {
    let key = event.keyCode;
    let shift = event.shiftKey;
    let ctrl = event.ctrlKey;
    let alt = event.altkey;

    const leftArrow = key == 37;
    const rightArrow = key == 39;
    if(leftArrow) {
        suggestion_el.textContent = query_el.textContent.slice(-1) + suggestion_el.textContent;
        query_el.textContent = query_el.textContent.substr(0, query_el.textContent.length - 1);
    }
    else if(rightArrow) {
        // utilize input_el for full string
        suggestion_el.textContent = suggestion_el.textContent.substr(0, suggestion_el.textContent.length - 1);
        query_el.textContent = input_el.value.substr(0, query_el.textContent.length + 1);

    }

    // SPACE
    if(key == 32) {
        // Hide/Unhide Links
        if(query_el.textContent.length == 0) {
            event.preventDefault();
            invertLinks();
        }
    }

    // TAB
    // Assigns autoCompletes suggestion to query_el
    if(key == 9) {
        event.preventDefault();
        // Hide/Unhide Links
        if(query_el.textContent.length == 0) {
            event.preventDefault();
            invertLinks();
        } else if (suggestion) { 
            input_el.value = suggestion.name;
            inputHandler();
        }
        return;
    }
    // ENTER
    // Redirects based on given input and if a match occurs
    if(key == 13) {
        // Hide/Unhide Links
        if(query_el.textContent.length == 0) {
            event.preventDefault();
            invertLinks();
        }
        // Command match
        if(suggestion.isCmd) {
            cmd = commands[suggestion.isCmd.name](suggestion.isCmd.query);
            output_el.textContent = cmd.output;
        } 
        // Config links match
        else {
            redirect(suggestion.url);
        }
        return;
    }
    // CTRL+A
    // Highlights all text in query_el
    if(key == 65 && ctrl) {
        query_el.style.color = "#474747";
        query_el.style.backgroundColor = "#979c9b";
    }
    // CTRL+L
    // Clears input & output
    if(key == 76 && ctrl) {
        event.preventDefault(); 
        clearInput();
        clearOutput();
    }
    // CTRL+C
    // Copies value output from cmd, if avaviable
    if(key == 67 && ctrl) {

    }
}