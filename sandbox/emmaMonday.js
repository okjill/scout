  var city = INPUT
  var weatherResponse = $.get({url:"http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=76b001f2621941cd5d249226db15ed15", method: "get"});

  weatherResponse.done(function(weather){
    console.log("weather!", weather.main.temp)
    var temp = weather.main.temp
    $("#weather-city").text(city.toUpperCase());
    $("#weather").text("")
  });



// function getLocation() {
//   if (navigator.geolocation) {
//     console.log(navigator.geolocation.getCurrentPosition(showPosition));
//   } else {
//     console.log("Geolocation is not supported by this browser.");
//   };
// };

// function showPosition(position) {
//     var x = document.getElementById("#weather");
//     x.innerHTML = "Latitude: " + position.coords.latitude + 
//     "<br>Longitude: " + position.coords.longitude; 
// };
