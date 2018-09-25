async function matchCmd(query) {
    let matches = [];
    let cmd_query = query.toLowerCase().split(" ");
    if(CONFIG.prefix) {
        if(query.charAt(0) != CONFIG.search_prefix) {
            return;
        }
        cmd_query = query.split(CONFIG.search_prefix)[1].toLowerCase().split(" ");
    }
    const cmds = Object.keys(commands);
    for (let i=0; i<cmds.length; i++) {
        if (cmd_query[0] === cmds[i]) {
            let name = cmd_query.shift();
            matches.push({ name: name, query: cmd_query });
        }
    }
    return new Promise(resolve => {
        if(matches.length != 0) {
            resolve(matches[0]);
        } else {
            resolve();
        }
    });
}

function CMD(name, usage, output, autocall=false) {
    this.name = name;
    this.usage = usage;
    this.output = output;
    this.autocall = autocall
}

const commands = {
    // Help
    '?': (args) => {
    },

    // Config
    'config': (args) => {
        let output = ' ';
        if(args == false) {
            return new CMD("Config", "{set} {var} {value}", output);
        }

        let cmd = args[0];
        // set - "auth_token, gistid, booleans"
        if(cmd == "set" || cmd == "s") {
            switch (args[1].toLowerCase()) {
                case "auth_token":
                    console.log("auth");
                    auth_token = args[2];
                    localStorage.setItem("auth_token", auth_token);
                    output = "Succesfully changed auth_token";
                    break;
                case "gistid":
                    CONFIG.gistID = args[2];
                    saveConfig();
                    output = "Succesfully changed gistID";
                    break;
            }
        }

        return new CMD("Link", "{add/delete} {name} {url}", output);
    },

    // Links
    'link': (args) => {
        let output = ' ';
        if(args == false) {
            return new CMD("Link", "{add/delete} {name} {url}", output);
        }
        if(auth_token == null) {
            output = "Github auth_token missing!";
            return new CMD("Link", "{add/delete} {name} {url}", output);
        }

        let cmd = args[0];
        if(cmd == "add" || cmd == "a") {
            if(args[1] && args[2]) {
                // Check if already taken
                let taken = false;
                CONFIG.links.forEach(link => {
                    if(link.name == args[1]) {
                        taken = true;
                        output = "Already taken!";
                    }
                });
                if(!taken) {
                    if (isURL(args[2])) {
                        let url = buildURL(args[2]);
                        CONFIG.links.push({name: args[1], url: args[2]});
                        output = "Link added!";
                    } else {
                        output = "Invalid URL!";
                    }
                }
            } else {
                output = "Missing arguments!";
            }
        }

        if(cmd == "delete" || cmd == "del" || cmd == "d") {
            for (let i=0; i < CONFIG.links.length; i++) {
                if (args[0] == CONFIG.links[i].command) {
                    CONFIG.links.splice(i, 1);
                    output = "Link deleted!";
                }
            }
        }

        saveConfig();
        loadConfig();
        return new CMD("Link", "{add/delete} {name} {url}", output);
    },

    // Calculator
    'calc': (args) => {
        let output = new Function('return ' + args)();
        if (output == null) output = 0;
        return new CMD("Calculator", "{query}", output, true);
    },

    // Password Generator
    'pass': (args) => {
        length = 10;
        if(args > 0) length = args;
        let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + "!@#$%^&*()_+~`|}{[]\:;?><,./-=",
        password = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            password += charset.charAt(Math.floor(Math.random() * n));
        }
        return new CMD("Password Gen", "{length}", password, true);
    },

    // Get IP Address
    /*
    'ip': (args) => {
        let output = ' ';

        let callback = "getIP";
        let url = "https://api.ipify.org?format=jsonp&callback=" + callback;
        let script = document.createElement('script');
        script.src = url;
        document.querySelector('head').appendChild(script);

        window[callback] = res => {
            if(res.ip) {
                output = res.ip;
            } else {
                output = "Error occurred!";
            }

            return new CMD("Public IP Address", " ", output);
        }
    },
    */

    // HaveIBeenPwned
    'pwn': (args) => {

        return new CMD("Have I Been Pwned", "{email/password}", output);
    },

    // Currency Converter
    'cc': (args) => {
        let output = ' ';
        if(args == false) {
            return new CMD("Currency Converter", "{from=USD} {to=DKK} {value=1}", output);
        }

        let base = "USD";
        let target = "DKK";
        let value;
        if(isNumeric(args[0])) {
            value = args[0] || 1;
        } else if (isNumeric(args[1])) {
            target = args[0].toUpperCase();
            value = args[1] || 1;
        } else {
            base = args[0].toUpperCase();
            target = args[1].toUpperCase();
            value = args[2] || 1;
        }

        // Current Date - 1 hour
        const date = new Date();
        date.setHours(date.getHours() - 1);

        // Grab currency list from localStorage
        let currency_list = JSON.parse(localStorage.getItem('currency_list'));

        // Request new currency list
        if((!currency_list || date > currency_list.date || base != currency_list.base)) {
            let url = "https://api.exchangeratesapi.io/latest?base=" + base;
            var request = new XMLHttpRequest();
            request.open('GET', url, false);
            request.send(null);
            if (request.status === 200) {
                let json = JSON.parse(request.responseText);
                json.date = date;
                currency_list = json;

                // Write currency list to localStorage
                localStorage.setItem('currency_list', JSON.stringify(json));
            }
        }

        // Evaluate on input
        if(value <= 0 || currency_list.base != base || !currency_list.base) {
            output = "Missing Arguments!";
        } else {
            let rate = currency_list.rates[target];
            output = toFixed(rate * value, 2) + ` ${target}`;
        }

        return new CMD("Currency Converter", "{from=USD} {to=DKK} {value=1}", output);
    },

    // Translate
    'tr': (args) => {
        let output = ' ';
        if(args == false) {
            return new CMD("Translate", "{source=auto} {target=en} {query}", output);
        }

        let source = "auto";
        let target = "en";
        let query = "";
        let langCodes = ['af', 'sq', 'ar', 'az', 'eu', 'bn', 'be', 'bg', 'ca', 'zh-CN', 'zh-TW', 'hr', 'cs', 'da',
            'nl', 'en', 'eo', 'et', 'tl', 'fi', 'fr', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'iw', 'hi', 'hu', 'is', 'id'];
        let langArgs = 0;
        langCodes.forEach(lang => {
            if(lang == args[0] || lang == args[1]) {
                langArgs += 1;
            }
        });
        if(langArgs == 2) {
            source = args[0];
            target = args[1];
            for (let i=2; i<args.length; i++) {
                query += args[i] + " ";
            }
        } else if (langArgs == 1) {
            target = args[0];
            for (let i=1; i<args.length; i++) {
                query += args[i] + " ";
            }
        } else {
            target = "en";
            for (let i=0; i<args.length; i++) {
                query += args[i] + " ";
            }
        }

        let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" + source + "&tl=" + target + "&dt=t&q=" + encodeURI(query);
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        if (request.status === 200) {
            let json = JSON.parse(request.responseText);
            output = json[0][0][0];
        }
        return new CMD("Translate", "{source=auto} {target=en} {query}", output);
    },

    // Google
    'g': (args) => {
        if(args == false) {
            return new CMD("Google", "{query}", ' ');
        }
        const url = 'https://google.com', search = '/search?q=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // Google Maps
    'gm': (args) => {
        if(args == false) {
            return new CMD("Google Maps", "{query}", ' ');
        }
        const url = 'https://google.com/maps', search = '/search/';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // DuckDuckGo
    'dg': (args) => {
        if(args == false) {
            return new CMD("DuckDuckGo", "{query}", ' ');
        }
        const url = 'https://duckduckgo.com', search = '/?q=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // Stack Overflow
    'so': (args) => {
        if(args == false) {
            return new CMD("Stack Overflow", "{query}", ' ');
        }
        const url = 'https://stackoverflow.com', search = '/search?q=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // GitHub
    'gh': (args) => {
        if(args == false) {
            return new CMD("Github", "{query}", ' ');
        }
        const url = 'https://github.com', search = '/';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // MDN Web Docs
    'mdn': (args) => {
        if(args == false) {
            return new CMD("MDN WebDocs", "{query}", ' ');
        }
        const url = 'https://developer.mozilla.org', search = '/search?q=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // Amazon
    'a': (args) => {
        if(args == false) {
            return new CMD("Amazon", "{query}", ' ');
        }
        const url = 'https://www.amazon.com', search = '/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // Netflix
    'n': (args) => {
        if(args == false) {
            return new CMD("Netflix", "{query}", ' ');
        }
        const url = 'https://netflix.com', search = '/search?q=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // IMDB
    'imdb': (args) => {
        if(args == false) {
            return new CMD("IMDB", "{query}", ' ');
        }
        const url = 'http://imdb.com', search = '/find?s=all&q=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // Arch-wiki
    'aw': (args) => {
        if(args == false) {
            return new CMD("Arch-Wiki", "{query}", ' ');
        }
        const url = 'https://wiki.archlinux.org', search = '/index.php?search=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // Wikipedia
    'w': (args) => {
        if(args == false) {
            return new CMD("Wikipedia", "{query}", ' ');
        }
        const url = 'https://en.wikipedia.org', search = '/w/index.php?search=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // Youtube
    'y': (args) => {
        if(args == false) {
            return new CMD("Youtube", "{query}", ' ');
        }
        const url = 'https://www.youtube.com', search = '/results?search_query=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // Reddit
    'r': (args) => {
        if(args == false) {
            return new CMD("Reddit", "{query}", ' ');
        }
        const url = 'https://www.reddit.com', search = '/search?q=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // Word-defination
    'wd': (args) => {
        if(args == false) {
            return new CMD("Word-defination", "{query}", ' ');
        }
        const url = 'https://www.wordreference.com', search = '/definition/';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // Danish Dictionary
    'ob': (args) => {
        if(args == false) {
            return new CMD("Danish Dictionary", "{query}", ' ');
        }
        const url = 'https://ordnet.dk/ddo', search = '/ordbog?query=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // Node packages
    'npm': (args) => {
        if(args == false) {
            return new CMD("NPM Packages", "{query}", ' ');
        }
        const url = 'https://npmjs.org', search = '/search?q=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    },

    // Python packages
    'pip': (args) => {
        if(args == false) {
            return new CMD("Pip Packages", "{query}", ' ');
        }
        const url = 'https://pypi.org', search = '/search/?q=';
        let output = args.length == 0 ? url : buildURL(url, search, args);
        redirect(output);
    }
}
