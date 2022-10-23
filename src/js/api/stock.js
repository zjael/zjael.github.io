// async function createCryptos() {
//   fetch('https://api.coinmarketcap.com/v1/ticker/?limit=10')
//   .then(response => response.json())
//   .then(data => {
//       data.map(function(crypto) {
//           let li = document.createElement('li');

//           let name = document.createElement('a');
//           name.innerHTML = `${crypto.name} <span>${crypto.symbol}</span>`;
//           name.onclick = function(){
//               search_el.innerHTML = '';
//               input_el.value = '';
//               input_el.focus();
//           };
//           name.setAttribute("href", `https://coinmarketcap.com/currencies/${crypto.id}`);

//           let price = document.createElement('p');
//           price.innerHTML = "$" + toFixed(`${crypto.price_usd}`, 2);

//           let change = document.createElement('p');

//           let change_7d = document.createElement('span');
//           change_7d.innerHTML = `7d: (${crypto.percent_change_7d}%)`;
//           valueColor(change_7d, `${crypto.percent_change_7d}`);
//           change_7d.setAttribute("class", "price_change");

//           let change_24h = document.createElement('span');
//           change_24h.innerHTML = `24h: (${crypto.percent_change_24h}%)`;
//           valueColor(change_24h, `${crypto.percent_change_24h}`);
//           change_24h.setAttribute("class", "price_change");

//           change.append(change_7d);
//           change.append(change_24h);
//           name.append(change);

//           li.append(name);
//           li.append(price);

//           document.getElementById("cryptos").append(li);
//       })
//   });
// }
