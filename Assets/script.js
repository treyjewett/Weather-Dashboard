// Setting global variables
var date = moment().format('MM/DD/YYYY');

var cityNameEl = $('#cityName');
var tempEl = $('#temp');
var humidEl = $('#humidity');
var windEl = $('#wind');
var uvEl = $('#uv');

var apiKey = '7719db6fa8f9f37f5cec7c50a9d6cc86';

// create the function to fetch the weather at the current time.
function getWeather(city) {
    var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
    $.ajax({
        url: weatherURL,
        method: 'GET',
    }).then(function (weatherResponse) {
        weather = weatherResponse;
        console.log(weatherResponse);
        var temp = ((weather.main.temp - 273.15) * (9/5) + 32).toFixed(0);
        cityNameEl.text(weather.name + ' (' + date + ') ' + weather.weather[0].icon);
        tempEl.text('Temperature: ' + temp + '\xB0F');
        humidEl.text('Humidity: ' + weather.main.humidity + '%');
        windEl.text('Wind Speed: ' + weather.wind.speed + 'MPH');

        var lon = weather.coord.lon;
        var lat = weather.coord.lat;
        var uvURL = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
        $.ajax({
            url: uvURL,
            method: 'GET'
        }).then(function (uvResponse) {
            uvEl.text('UV Index: ' + uvResponse.value);
        })
    })
}

// create the funciton to fetch the weather forecast for the next 5 days.
function getForecast(city) {
    var forecastURL = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;
    $.ajax({
        url: forecastURL,
        method: 'GET'
    }).then(function (forecastResponse) {
        console.log(forecastResponse);
        // logic for getting 5 day forecast
        for (i = 0; i < forecastResponse.list.length; i += 8) {

        }
        var forecast = forecastResponse;
        console.log(forecast);
    })
}

function addCityButton(city) {
    var newSearch = $('<tr id="previousSearch">');
    var cityButton = $('<button id="cityButton">').text(city);
    newSearch.append(cityButton);
    $('#cityButton').append(newSearch);
}

$('#btn').on('click', function () {
    var city = $('#input').val();
    addCityButton(city);
    getWeather(city);
    getForecast(city);
})

// Still needs work. Will not populate the page with weather data when clicked.
$('#previousSearch').on('click', function () {
    var newCity = $('#cityButton');
    getWeather(newCity);
    getForecast(newCity);
})
