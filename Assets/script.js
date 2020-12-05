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
    var weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
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
        $('#forecastHeader').text('5-Day Forecast:');

        var lon = weather.coord.lon;
        var lat = weather.coord.lat;
        var uvURL = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
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
    var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;
    $.ajax({
        url: forecastURL,
        method: 'GET'
    }).then(function (forecastResponse) {
        console.log(forecastResponse);
        var forecast = forecastResponse;
        // logic for getting 5 day forecast
        for (i = 2; i < forecast.list.length; i += 8) {
            var card = $('<div class="col-2">');
            var day = $('<h4>');
            var dayTemp = $('<p>');
            var dayHumidity = $('<p>');
            tempK = forecast.list[i].main.temp;
            day.text(forecast.list[i].dt);
            dayTemp.text('Temp: ' + ((tempK - 273.15) * (9/5) + 32).toFixed(0));
            dayHumidity.text('Humidity: ' + forecast.list[i].main.humidity + '%');
            card.append(day, dayTemp, dayHumidity);
            $('#forecast').append(card);
            console.log(i);
        }
    })
}

function addCityButton(city) {
    $('#th').text('Previous Cities Searched');
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

$('#previousSearch').on('click', function () {
    var newCity = $('#cityButton');
    getWeather(newCity);
    getForecast(newCity);
})
