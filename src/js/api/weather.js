{/* <div class="weather" style="visibility: hidden">
  <span><b class="weather_icon"></b> <b class="temperature"></b>°C [<b class="condition"></b>]</span>
</div> */}

// const weather_location = "Snedsted";
// const apixu_key = "b434aacd833e486192692232180109";
// const weather_request = `https://api.apixu.com/v1/current.json?key=${apixu_key}&q=${weather_location}`;

// fetch(weather_request)
// .then(response => response.json())
// .then(data => {
//     let condition = data.current.condition.text;
//     let icon = document.querySelector('.weather_icon');
//     document.querySelector('.condition').innerHTML = condition;
//     document.querySelector('.temperature').innerHTML = data.current.temp_c;
//     document.querySelector('.weather').style = "";

//     // 🌩 🌪 🌤
//     if (condition.includes('Sunny') || condition.includes('Clear')) {
//         icon.innerHTML = '☀';
//     }
//     if (condition.includes('snow')) {
//         icon.innerHTML = '🌨';
//     }
//     if (condition.includes('Cloud') || condition.includes('Mist') || condition.includes('cloudy') || condition.includes('Overcast')) {
//         icon.innerHTML = '☁';
//     }
//     if (condition.includes('Rain') || condition.includes('rain') || condition.includes('drizzle')) {
//         icon.innerHTML = '🌧';
//     }
// });