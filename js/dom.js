const positive = "#92d690";
const neutral = "#e5cb49"
const negative = "#f68678"

/*
    Assign color based on postive or negative number
*/
function valueColor(element, value) {
    if (value > 0 ) { 
        element.style.color = positive; 
    }
    else if (value < 0) { 
        element.style.color = negative; 
    }
    else { 
        element.style.color = neutral; 
    }
}

function queryColor() {
    if (cmd) {
		query_el.style.color = "#ab8eda";
	} else if(input_el.value == suggestion.name) {
		switch (suggestion.influence) {
			case "config":
				query_el.style.color = "#92d690";
				break;
			case "search":
				query_el.style.color = "#90b6d6";
				break;
		}
	} else {
		query_el.style.color = "#979c9b";
	}
}

function clearInput() {
	search_el.innerHTML = '';
	input_el.value = '';
	query_el.textContent = '';
	input_el.focus();
}

function clearOutput() {
	suggestion_el.textContent = "";
	output_el.textContent = " ";
}

function invertVisibility(el) {
	if (el.style.visibility == "visible") {
        el.style.visibility = 'hidden';
    }
    else {
        el.style.visibility = 'visible';
    }
}

function invertLinks() {
    let links = document.querySelector(".links");
    let footer = document.querySelector("footer");
    if(links.style.display == "") {
        links.style.display = "block"
        footer.style.display = "block"
    } else {
        links.style.display = ""
        footer.style.display = ""
    }
}

function getSelectedText() {
    let text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

/*
    Cryptocurrencys information "appends to ID: cryptos"
*/
async function createCryptos() {
    fetch('https://api.coinmarketcap.com/v1/ticker/?limit=10')
    .then(response => response.json())
    .then(data => {
        data.map(function(crypto) {
            let li = document.createElement('li');
    
            let name = document.createElement('a');
            name.innerHTML = `${crypto.name} <span>${crypto.symbol}</span>`;
            name.onclick = function(){
                search_el.innerHTML = '';
                input_el.value = '';
                input_el.focus();
            };
            name.setAttribute("href", `https://coinmarketcap.com/currencies/${crypto.id}`);
    
            let price = document.createElement('p');
            price.innerHTML = "$" + toFixed(`${crypto.price_usd}`, 2);
    
            let change = document.createElement('p');
    
            let change_7d = document.createElement('span');
            change_7d.innerHTML = `7d: (${crypto.percent_change_7d}%)`;
            valueColor(change_7d, `${crypto.percent_change_7d}`);
            change_7d.setAttribute("class", "price_change");
    
            let change_24h = document.createElement('span');
            change_24h.innerHTML = `24h: (${crypto.percent_change_24h}%)`;
            valueColor(change_24h, `${crypto.percent_change_24h}`);
            change_24h.setAttribute("class", "price_change");
            
            change.append(change_7d);
            change.append(change_24h);
            name.append(change);
    
            li.append(name);
            li.append(price);
    
            document.getElementById("cryptos").append(li);
        })
    });
}

/*
    Weather information "appends to Class: weather"
*/
async function createWeather() {
    const weather_location = "Snedsted";
    const apixu_key = "b434aacd833e486192692232180109";
    const weather_request = `https://api.apixu.com/v1/current.json?key=${apixu_key}&q=${weather_location}`;

    fetch(weather_request)
    .then(response => response.json())
    .then(data => {
        let condition = data.current.condition.text;
        let icon = document.querySelector('.weather_icon');
        document.querySelector('.condition').innerHTML = condition;
        document.querySelector('.temperature').innerHTML = data.current.temp_c;
        document.querySelector('.weather').style = "";

        // 🌩 🌪 🌤 
        if (condition.includes('Sunny') || condition.includes('Clear')) {
            icon.innerHTML = '☀';
        }
        if (condition.includes('snow')) {
            icon.innerHTML = '🌨';
        }
        if (condition.includes('Cloud') || condition.includes('Mist') || condition.includes('cloudy') || condition.includes('Overcast')) {
            icon.innerHTML = '☁';
        }
        if (condition.includes('Rain') || condition.includes('rain') || condition.includes('drizzle')) {
            icon.innerHTML = '🌧';
        }
    });
}

async function createLinks() {
    CONFIG.UIlinks.forEach(object => {
        let ul = document.getElementById(object.category);
        if(ul) {
            object.links.forEach(link => {
                let li = document.createElement('li');
                let a = document.createElement('a');
                a.innerText = link.name;
                a.onclick = function(){
                    search_el.innerHTML = '';
                    input_el.value = '';
                    input_el.focus();
                };
                a.href = link.url;
                li.appendChild(a);
                ul.appendChild(li);
            });
        }
    });
}