
var date = moment().format('MM/DD/YYYY');

var cityNameEl = $('#cityName');
var tempEl = $('#temp');
var humidEl = $('#humidity');
var windEl = $('#wind');
var uvEl = $('#uv');


// var populate = function(data) {

// }

var apiKey = '7719db6fa8f9f37f5cec7c50a9d6cc86';

// create the function to fetch the weather at the current time.
function getWeather(city) {
    var weatherURL = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
    $.ajax({
        url: weatherURL,
        method: 'GET',
    }).then(function (weatherResponse) {
        weather = weatherResponse;
        console.log(weather);
        cityNameEl.text(weather.name);
        var temp = 

        var lon = weather.coord.lon;
        var lat = weather.coord.lat;
        var uvURL = 'http://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
        $.ajax({
            url: uvURL,
            method: 'GET'
        }).then(function (uvResponse) {
            console.log('UV: ', uvResponse);
            console.log('UV Index: ', uvResponse.value);
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
        // var fiveDayResponse = fiveDayForcast(response);
        console.log('Forecast: ', forecastResponse);
        return forecastResponse;
    })
}

// logic for getting 5 day forecast
function fiveDayForcast(response) {
    var list = [];
    for (i = 0; i < response.list.length; i += 8) {
        list.append(i);
    }
}




$('#btn').on('click', function () {
    var city = $('#input').val();
    console.log($('#input').val());
    getWeather(city);
    getForecast(city);
})
