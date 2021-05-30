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

var getCityWeather = function (city) {
  // format the github api url
  var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

  // make a request to the url
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      return response.json()
    }
    else {
      alert("Error: City Not Found");
        }
  })
  .then(function(data){
    console.log(data);
    temp.textContent = "Temp:  " + Math.floor(data.main.temp)+ " F";
    wind.textContent = "Wind:  " + Math.floor(data.wind.speed)+ " MPH";
    humidity.textContent = "Humidity  :" + Math.floor(data.main.humidity)+ " %";
    citySearchTerm.innerHTML = city;
    currentDate.innerHTML = "(" + moment().format('l') + ") ☁️";

    lat=data.coord.lat;
    lon=data.coord.lon;
    
    getCurrentWeather(lon, lat)
    // displayCity(data, city);

  })

}

var formSubmitHandler = function (event) {
  event.preventDefault();
  //get value from input element
  var cityname = nameCityEl.value.trim();
console.log(cityname);
  if (cityname) {
    getCityWeather(cityname);
    nameCityEl.value = "";
  } else {
    alert("Please enter a Required City Name");
  }
  console.log(event);
}

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

          var fiveDayTempEl = document.createElement("div");
          fiveDayTempEl.innerHTML = "Temp: " + data.daily[i].temp.day + "  F";
          fiveDayEl.appendChild(fiveDayTempEl);
  
          var fiveDayHumidEl = document.createElement("div");
          fiveDayHumidEl.innerHTML = "Humidity:  " + data.daily[i].humidity + "  %";
          fiveDayEl.appendChild(fiveDayHumidEl);

          var fiveDayWindEl = document.createElement("div");
          fiveDayWindEl.innerHTML = "Wind Speed:  " + data.daily[i].wind_speed+ "  MPH";
          fiveDayEl.appendChild(fiveDayWindEl);
          
          fiveDay.append(fiveDayEl);
        }
        
      });
    }
  })
};



userFormEl.addEventListener("submit", formSubmitHandler);
