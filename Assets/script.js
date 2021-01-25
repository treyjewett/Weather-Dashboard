// Setting global variables
var date = moment().format('MM/DD/YYYY');
var apiKey = '7719db6fa8f9f37f5cec7c50a9d6cc86';
var cityNameEl = $('#cityName');
var tempEl = $('#temp');
var humidEl = $('#humidity');
var windEl = $('#wind');
var uvEl = $('#uv');


// Create the function to get weather using ajax
function getWeather(city) {
    var weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
    $.ajax({
        url: weatherURL,
        method: 'GET',
    }).then(function (weatherResponse) {
        weather = weatherResponse;
        // Convert the temperature variable given from kelvin to fahrenheit
        var temp = ((weather.main.temp - 273.15) * (9 / 5) + 32).toFixed(0);
        // Get the weather icon from the response
        var icon = weatherResponse.weather[0].icon;
        var iconSrc = 'https://openweathermap.org/img/wn/' + icon + '@2x.png';
        // Now populate the page.
        cityNameEl.text(weather.name + ' (' + date + ')');
        cityNameEl.append('<img id="icon" src= \'' + iconSrc + '\'/>');
        tempEl.text('Temperature: ' + temp + '\xB0F');
        humidEl.text('Humidity: ' + weather.main.humidity + '%');
        windEl.text('Wind Speed: ' + weather.wind.speed + 'MPH');
        $('#forecastHeader').text('5-Day Forecast:');
        // Set lat and lon variables from weatherResponse to be used in the uvResponse.
        var lon = weather.coord.lon;
        var lat = weather.coord.lat;
        var uvURL = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
        $.ajax({
            url: uvURL,
            method: 'GET'
        }).then(function (uvResponse) {
            uvEl.text('UV Index: ' + uvResponse.value);
            // Create the logic behind the coloring of the uv indexes.
            if (uvResponse.value < 3) {
                $('#uv').attr('class', 'low');
            } else if (uvResponse.value >= 3 && uvResponse.value <= 5) {
                $('#uv').attr('class', 'moderate');
            } else if (uvResponse.value > 5 && uvResponse.value <= 7) {
                $('#uv').attr('class', 'high');
            } else if (uvResponse.value > 7) {
                $('#uv').attr('class', 'severe');
            }
        })
    })

    var forecastURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey;
    $.ajax({
        url: forecastURL,
        method: 'GET'
    }).then(function (forecastResponse) {
        $('#forecastDisplay').empty();
        var forecast = forecastResponse;
        // logic for getting 5 day forecast
        // The forecast response gives weather every 3 hours. 24 / 3 = 8. Hence why increasing i by 8 each loop.
        for (i = 0; i < forecast.list.length; i += 8) {
            // Create the elements to populate onto the page later.
            var card = $('<div class="col-2" id="cardContainer">');
            var day = $('<h4>');
            var dayTemp = $('<p>');
            var dayHumidity = $('<p>');
            var tempK = forecast.list[i].main.temp;
            var dateTime = forecast.list[i].dt;
            var formattedDate = moment.unix(dateTime).format('MM/DD/YYYY');
            var iconSrc = 'https://openweathermap.org/img/wn/' + forecastResponse.list[i].weather[0].icon + '@2x.png';
            // Now populate the page.
            day.text(formattedDate);
            dayTemp.text('Temp: ' + ((tempK - 273.15) * (9 / 5) + 32).toFixed(0) + '\xB0F');
            dayHumidity.text('Humidity: ' + forecast.list[i].main.humidity + '%');
            card.append(day, '<img id="forecastIcon" src= \'' + iconSrc + '\'/>', dayTemp, dayHumidity);
            $('#forecastDisplay').append(card);
        }
    })
}

// Create a listener for when the user clicks the search button.
$('#btn').on('click', function (event) {
    event.preventDefault();
    var city = $('#input').val().trim();
    var citiesSearched = JSON.parse(localStorage.getItem('citiesSearched'));
    if (citiesSearched == null) {
        citiesSearched = [];
    }
    citiesSearched.unshift(city);
    var citiesPast = localStorage.setItem('citiesSearched', JSON.stringify(citiesSearched));
    addCityButton(city);
    getWeather(city);
})

// Create the new cityButtons once the user has searched for a city.
function addCityButton(city) {
    $('#th').text('Previous Cities Searched');
    var newSearch = $('<tr id="previousSearch">');
    var cityButton = $('<button id=' + city + ' class=btn>').text(city);
    newSearch.append(cityButton);
    cityButton.on('click', function () {
        getWeather(city);
    })
    $('#cityButton').prepend(newSearch);
}

// Populate the buttons from local storage on load
window.onload = function () {
    var citiesPast = JSON.parse(localStorage.getItem('citiesSearched'));
    console.log(citiesPast);
    if (citiesPast == null) {
        citiesPast = [];
    }

    for (i = 0; i < citiesPast.length; i++) {
        if (citiesPast[i] != null) {
            addCityButton(citiesPast[i]);
        }
    }

    if (citiesPast.length > 0) {
        getWeather(citiesPast[0]);
    }
}