// FINDS COMMAND 'AUTOCOMPLETE' SUGGESTION BASED ON QUERY
async function cmdSuggest(query) {
    let matches = [];
	Object.keys(commands).forEach(cmd => {
        if(CONFIG.prefix) {
            cmd = CONFIG.search_prefix + cmd;
        }
		if (cmd.substr(0, query.length) == query) {
			matches.push({name: cmd, influence: "command"});
		}	
	});
	return new Promise(resolve => {
		if (matches.length == 0) {
			resolve();
		} else {
			resolve(matches);
		}
	});
}

// FINDS CONFIG 'AUTOCOMPLETE' SUGGESTION BASED ON QUERY
async function configSuggest(query) {
	let matches = [];
	CONFIG.links.forEach(link => {
		if (link.name.substr(0, query.length) == query) {
			matches.push({name: link.name, url: link.url, influence: "config"});
		}	
	});
	return new Promise(resolve => {
		if (matches.length == 0) {
			resolve();
		} else {
			resolve(matches);
		}
	});
}

// FINDS SEARCH 'AUTOCOMPLETE' SUGGESTION BASED ON QUERY
async function searchSuggest(query) {
	let suggestions = [];

	const callback = 'autocompleteCallback';
	const url = `https://duckduckgo.com/ac/?callback=${callback}&q=${query}`
	let script = document.createElement('script');
	script.src = url;
	document.querySelector('head').appendChild(script);
	
	return new Promise(resolve => {
		window[callback] = res => {
			const search_matches = res.map(result => result.phrase)
			.slice(0, 1)
				
			search_matches.forEach(match => {
				suggestions.push({name: match, url: (CONFIG.searchURL + match.replace(/\s/g, "+")), influence: "search"})
			});
			resolve(suggestions);
		}
	});
}

async function getSuggestions(input) {
	return new Promise(resolve => {
		Promise.all([cmdSuggest(input), configSuggest(input), searchSuggest(input)]).then(results => {
			for (let a of results) {
				if(a) {
					resolve(a[0]);
				}
			}
		});
	});
}

function autoComplete(input, suggestion="") {
	suggestion_el.textContent = suggestion.name.substr(input.length, suggestion.name.length);

	switch (suggestion.influence) {
		case "command":
			suggestion_el.style.color = "#ab8eda";
			break;
		case "search":
			suggestion_el.style.color = "#90b6d6";
			break;
		case "config":
			suggestion_el.style.color = "#92d690";
			break;
		default:
			suggestion_el.style.color = "#979c9b";
	}
}