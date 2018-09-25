// Default settings
let CONFIG = {
    searchURL: "https://duckduckgo.com/?q=",
    prefix: false,
    search_prefix: "-",
    overlay: true,
    cryptos: true,
    weather: true,
    newtab: true,
    gistID: '9501ef7327224738d0bf050c1eb604a0'
}

function getGist() {
   let url = "https://api.github.com/gists/" + CONFIG.gistID;
   var request = new XMLHttpRequest();
   request.open('GET', url, false);
   request.send(null);

   if (request.status === 200) {
       let json = JSON.parse(request.responseText);
       let gist = json.files[Object.keys(json.files)[0]]; 
       return gist.content;
   } else {
       return false;
   }
}

function postGist() {
    let url = "https://api.github.com/gists" + "?access_token=" + auth_token;
    let request = new XMLHttpRequest();
    let body = JSON.stringify({
        "description": "Startpage config",
        "public": false,
        "files": {
            "config.json": {
                "content": JSON.stringify(CONFIG)
            }
        }
    });
    request.open('POST', url, false);
    request.send(body);
    if (request.status === 201) {
        let json = JSON.parse(request.responseText);
        CONFIG.gistID = json.id;
        return true;
    } else {
        return false;
    }
}

function patchGist() {
    let url = "https://api.github.com/gists/" + CONFIG.gistID + "?access_token=" + auth_token;
    let request = new XMLHttpRequest();
    let body = JSON.stringify({
        "files": {
            "config.json": {
                "content": JSON.stringify(CONFIG)
            }
        }
    });
    request.open('PATCH', url, false);
    request.send(body);
    if (request.status === 200) {
        let json = JSON.parse(request.responseText);
        console.log(json);
        return true;
    } else {
        return false;
    }
}

function loadConfig() {
    if(CONFIG.gistID != "") {
        CONFIG = JSON.parse(getGist()); 
    } else if (Storage) {
        // Create config object if it doesn't exist
        if (localStorage.getItem('settings') === null) {
        localStorage.setItem('settings', JSON.stringify(CONFIG));
        // Otherwise load saved config from localStorage
        } else {
        CONFIG = JSON.parse(localStorage.getItem('settings'));
        }
    }
}

function saveConfig() {
    localStorage.setItem('settings', JSON.stringify(CONFIG));
    if(auth_token) {
        if(CONFIG.gistID == "") {
            console.log("empty id");
            postGist();
        } else {
            patchGist();
        }   
    }
}