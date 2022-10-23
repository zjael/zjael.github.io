import * as utils from './utils.js';
import { CONFIG, save } from './config.js';
import * as ip from '../api/ip.js';
import * as currency from '../api/currency.js';
import translate from '../api/translate.js';

class CMD {
  constructor(name, description, usage, fn, autoexec = false) {
    this.name = name;
    this.description = description;
    this.usage = usage;
    this.fn = fn;
    this.autoexec = autoexec;
  }

  format() {
    let output = `${this.name}\n`;
    for (const string of this.usage) {
      output += `${string}\n`;
    }
    return output;
  }
}

export const commands = {
  help: new CMD("Help", "Lists all commands", [], (args) => {
    let output = "";
    for (const command in commands) {
      if (["?", "help", "commands"].indexOf(command) !== -1) {
        const cmd = commands[command];
        output += `${cmd.name} - ${cmd.description}\n`;
      }
    }
    return output;
  }),
  link: new CMD("Link", "Add or remove shortcut links", [
      "{add/a} {name} {url}", "{del/d} {name}"
    ], async (args) => {
      if (!args || args.length < 3) {
        return "Missing arguments";
      }

      const [cmd, name, url] = args;
      try {
        if (cmd == "add" || cmd == "a") {
          CONFIG.links.forEach((link) => {
            if (link.name == name) {
              return "Name is already in use";
            }
          });

          if (utils.isURL(url)) {
            const url = utils.buildURL(url);
            CONFIG.links.push({ name: name, url: url });
            await save();
            return "Link added";
          } else {
            return "Invalid URL";
          }
        } else if (cmd == "del" || cmd == "d") {
          for (let i = 0; i < CONFIG.links.length; i++) {
            if (CONFIG.links[i].name == name) {
              CONFIG.links.splice(i, 1);
              await save();
              return "Link deleted";
            }
          }
        } else {
          return "Unknown command";
        }
      } catch (err) {
        return err.message;
      }
    }
  ),
  calc: new CMD("Calculator", "", [], (args) => {
      const valid = /^[-+]?[0-9]+([-+*\/]+[-+]?[0-9]+)+/.test(args);
      if(!valid) return 0;
      const output = new Function("return " + args)();
      if (!output) return 0;
      return output;
    },
    true
  ),
  pass: new CMD("Password generator", "", [
    "{length}"
  ], (args) => {
      let length = 10;
      if (args > 0) length = args;
      let charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" +
        "!@#$%^&*()_+~`|}{[]:;?><,./-=";
      let password = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
      }
      return password;
    },
    true
  ),
  ip: new CMD("IP", "Get IP address", [], async (args) => {
    try {
      const publicIP = await ip.publicIP();
      return publicIP;
    } catch (err) {
      return err.message;
    }
  }),
  cc: new CMD("Currency Converter", "", [
    "{from=USD} {to=DKK} {value=1}"
  ], async (args) => {
      let base = "USD";
      let target = "DKK";
      let value;

      if(args.length === 0) return;

      if (utils.isNumeric(args[0])) {
        value = args[0] || 1;
      } else if (utils.isNumeric(args[1])) {
        target = args[0].toUpperCase();
        value = args[1] || 1;
      } else {
        base = args[0].toUpperCase();
        target = args[1].toUpperCase();
        value = args[2] || 1;
      }

      try {
        const result = await currency.convert(base, target, value);
        return `${utils.toFixed(result, 2)} ${target}`;
      } catch (err) {
        return err.message;
      }
    }
  ),

  tr: new CMD("Translate", "", [
    "{source=auto} {target=en} {query}"
  ], async (args) => {
      let source = "auto";
      let target = "en";
      let query = "";

      const langCodes = [
        "af",
        "sq",
        "ar",
        "az",
        "eu",
        "bn",
        "be",
        "bg",
        "ca",
        "zh-CN",
        "zh-TW",
        "hr",
        "cs",
        "da",
        "nl",
        "en",
        "eo",
        "et",
        "tl",
        "fi",
        "fr",
        "gl",
        "ka",
        "de",
        "el",
        "gu",
        "ht",
        "iw",
        "hi",
        "hu",
        "is",
        "id",
      ];

      let langArgs = 0;
      langCodes.forEach((lang) => {
        if (lang == args[0] || lang == args[1]) {
          langArgs += 1;
        }
      });
      if (langArgs == 2) {
        source = args[0];
        target = args[1];
        for (let i = 2; i < args.length; i++) {
          query += args[i] + " ";
        }
      } else if (langArgs == 1) {
        target = args[0];
        for (let i = 1; i < args.length; i++) {
          query += args[i] + " ";
        }
      } else {
        target = "en";
        for (let i = 0; i < args.length; i++) {
          query += args[i] + " ";
        }
      }

      try {
        const result = await translate(source, target, query);
        return result;
      } catch (err) {
        return err.message;
      }
    }
  ),
  g: new CMD("Google", "", [
    "{query}"
  ], (args) => {
    const url = "https://google.com";
    const search = "/search?q=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  gm: new CMD("Google Maps", "", [
    "{query}"
  ], (args) => {
    const url = "https://google.com/maps";
    const search = "/search/";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  dg: new CMD("DuckDuckGo", "", [
    "{query}"
  ], (args) => {
    const url = "https://duckduckgo.com";
    const search = "/?q=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  so: new CMD("StackOverFlow", "", [
    "{query}"
  ], (args) => {
    const url = "https://stackoverflow.com";
    const search = "/search?q=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  gh: new CMD("Github", "", [
    "{query}"
  ], (args) => {
    const url = "https://github.com";
    const search = "/";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  mdn: new CMD("MDN WebDocs", "", [
    "{query}"
  ], (args) => {
    const url = "https://developer.mozilla.org";
    const search = "/search?q=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  a: new CMD("Amazon", "", [
    "{query}"
  ], (args) => {
    const url = "https://www.amazon.com";
    const search = "/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  n: new CMD("Netflix", "", [
    "{query}"
  ], (args) => {
    const url = "https://netflix.com";
    const search = "/search?q=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  imdb: new CMD("IMDB", "", [
    "{query}"
  ], (args) => {
    const url = "http://imdb.com";
    const search = "/find?s=all&q=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  w: new CMD("Wikipedia", "", [
    "{query}"
  ], (args) => {
    const url = "https://en.wikipedia.org";
    const search = "/w/index.php?search=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  y: new CMD("Youtube", "", [
    "{query}"
  ], (args) => {
    const url = "https://www.youtube.com";
    const search = "/results?search_query=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  r: new CMD("Reddit", "", [
    "{query}"
  ], (args) => {
    const url = "https://www.reddit.com";
    const search = "/search?q=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  wd: new CMD("Word Defination", "", [
    "{query}"
  ], (args) => {
    const url = "https://www.wordreference.com";
    const search = "/definition/";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  ob: new CMD("Danish Dictionary", "", [
    "{query}"
  ], (args) => {
    const url = "https://ordnet.dk/ddo";
    const search = "/ordbog?query=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  npm: new CMD("NPM Packages", "", [
    "{query}"
  ], (args) => {
    const url = "https://npmjs.org";
    const search = "/search?q=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  }),
  pip: new CMD("Pip Packages", "", [
    "{query}"
  ], (args) => {
    const url = "https://pypi.org";
    const search = "/search/?q=";
    const output = args.length == 0 ? url : utils.buildURL(url, search, args);
    utils.redirect(output);
  })
};
