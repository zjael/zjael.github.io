import { CONFIG } from './config.js';
import { commands as c } from './commands.js';

export function color(source) {
  switch (source) {
		case "command":
      return "#FF7B47";
		case "search":
      return "#90b6d6";
		case "config":
			return "#92d690";
		default:
			return "#979c9b";
	}
}

export function isCommand(query) {
  const matches = [];

  let cmd_query = query.toLowerCase().split(" ");
  if (CONFIG.prefix) {
    if (query.charAt(0) != CONFIG.search_prefix) {
      return;
    }
    cmd_query = query.split(CONFIG.search_prefix)[1].toLowerCase().split(" ");
  }

  const cmds = Object.keys(c);
  for (let i = 0; i < cmds.length; i++) {
    if (cmd_query[0] === cmds[i]) {
      let name = cmd_query.shift();
      matches.push({ name: name, args: cmd_query, cmd: c[name], source: "command" });
    }
  }

  return matches[0];
}

export function commands(query) {
  const matches = [];

  Object.keys(c).forEach((cmd) => {
    if (CONFIG.prefix) {
      cmd = CONFIG.search_prefix + cmd;
    }

    if (cmd.substr(0, query.length) == query) {
      matches.push({ name: cmd, source: "command" });
    }
  });

  return matches;
}

export function links(query) {
  const matches = [];

	CONFIG.links.forEach(link => {
		if (link.name.substr(0, query.length) == query) {
			matches.push({name: link.name, url: link.url, source: "config"});
		}
  });

  return matches;
}

export function search(query) {
	const suggestions = [];

	const callback = 'autocompleteCallback';
	const url = `https://duckduckgo.com/ac/?callback=${callback}&q=${query}`
	let script = document.createElement('script');
	script.src = url;
	document.querySelector('head').appendChild(script);

	return new Promise(resolve => {
		window[callback] = res => {
      const search_matches = res.map(result => result.phrase);

			search_matches.forEach(match => {
				suggestions.push({name: match, url: (CONFIG.searchURL + match.replace(/\s/g, "+")), source: "search"})
      });

			resolve(suggestions);
		}
	});
}