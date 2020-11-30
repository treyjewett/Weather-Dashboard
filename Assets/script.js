
var date = moment().format('MM/DD/YYYY');

$('#btn').on('click', function() {
    console.log('hello');
    console.log(date);
    console.log($('#input').val());
})

// var populate = function(data) {

// }

var getWeather = function(city) {
    var apiKey = '7719db6fa8f9f37f5cec7c50a9d6cc86';
    var weatherURL = 'api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey;
    var city = $('#input').val();
    $.ajax({
        url: weatherURL,
        method: 'GET'
    }).then(function(response) {
        populate(response);
    })
}

