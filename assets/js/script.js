// pick up HTML  variables
var userFormEl = document.querySelector("#user-form");
var nameCityEl = document.querySelector("#city");
var cityContainerEl = document.querySelector("#city-container");
var citySearchTerm = document.querySelector("#city-search-term");
var currentDate = document.querySelector("#current-date");
var temp = document.querySelector("#temp");
var wind = document.querySelector("#wind");
var humidity = document.querySelector("#humidity");
var uv = document.querySelector("#uv");
var fiveDay= document.querySelector("#forecast");
var lat;
var lon;
var apiKey = "7c50bb9f233d432bdcfb028d809dd667"

// weather fetch function with city input
var getCityWeather = function (city) {
  // format the github api url
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

  // api fetch with lat and lon input 
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      return response.json()
    }
    else {
      alert("Error: City Not Found");
        }
  })
  // to obtain temp, wind and humidity from api
  .then(function(data){
    console.log(data);
    temp.textContent = "Temp:  " + Math.floor(data.main.temp)+ " F";
    wind.textContent = "Wind:  " + Math.floor(data.wind.speed)+ " MPH";
    humidity.textContent = "Humidity  :" + Math.floor(data.main.humidity)+ " %";
    citySearchTerm.innerHTML = city;
    currentDate.innerHTML = "(" + moment().format('l') + ") ☁️";

    // obtain lat and lon data from api
    lat=data.coord.lat;
    lon=data.coord.lon;
    
    getCurrentWeather(lon, lat)
    // displayCity(data, city);
  })
}

// search function
var formSubmitHandler = function (event) {
  event.preventDefault();
  //get value from input element
  var cityname = nameCityEl.value.trim();
console.log(cityname);
  if (cityname) {
    getCityWeather(cityname);
    nameCityEl.value = "";

    localStorage.setItem("city", JSON.stringify(cityname));
  } else {
    alert("Please enter a Required City Name");
  }
  console.log(event);
  JSON.parse(localStorage.getItem(cityname))
}

// fetch function to obtain uv index 
var getCurrentWeather = function (lat, lon) {
  var apiUrl1 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  fetch(apiUrl1).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);
        uv.textContent = "UV Index:  " + data.current.uvi;
      });
    }
  })
  forecast();
};

// fetch function to obtain five day forecast api 
var forecast = function () {
  var apiUrl2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
  fetch(apiUrl2).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log(data);

        for (var i=0; i < 5; i++){
          var fiveDayEl = document.createElement("div");
          fiveDayEl.classList.add("card");
          fiveDayEl.classList.add("col-2")
          fiveDayEl.classList.add("fiveday")

          // creating date div and appending to eavh daily forecast div
          var fiveDayTitle = document.createElement("div");
          fiveDayTitle.textContent = moment().add(1+i,'days').format("l") + "🌤"; 
          fiveDayEl.appendChild(fiveDayTitle);
          
          // creating temp div and appending to eavh daily forecast div
          var fiveDayTempEl = document.createElement("div");
          fiveDayTempEl.innerHTML = "Temp: " + data.daily[i].temp.day + "  F";
          fiveDayEl.appendChild(fiveDayTempEl);
  
          // creating humidity div and appending to eavh daily forecast div
          var fiveDayHumidEl = document.createElement("div");
          fiveDayHumidEl.innerHTML = "Humidity:  " + data.daily[i].humidity + "  %";
          fiveDayEl.appendChild(fiveDayHumidEl);

          // creating wind speed div and appending to eavh daily forecast div
          var fiveDayWindEl = document.createElement("div");
          fiveDayWindEl.innerHTML = "Wind Speed:  " + data.daily[i].wind_speed+ "  MPH";
          fiveDayEl.appendChild(fiveDayWindEl);

          // appending each daily forecast div into the main div on HTML
          fiveDay.append(fiveDayEl);
        }
        
      });
    }
  })
};

// event listener for search function
userFormEl.addEventListener("submit", formSubmitHandler);
