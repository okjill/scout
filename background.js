// window.onload = function() {

// };

$(document).ready(function(){
  pageAddOnHandler();
  currentWeatherRunner();

  $("body").css("background", "darkgray");
  $("#note-editor").jqte();
  $("head").append("<script src='https://use.fontawesome.com/8e7d53f080.js'></script>");

  $("#fakeLoader").fakeLoader({
            timeToHide:2000, //Time in milliseconds for fakeLoader disappear
            zIndex:999, // Default zIndex
            spinner:"spinner1",//Options: 'spinner1', 'spinner2', 'spinner3', 'spinner4', 'spinner5', 'spinner6', 'spinner7'
            bgColor:"#6E6464", //Hex, RGB or RGBA colors
            // imagePath:"icon-sm.png" //If you want can you insert your custom image
    });

  // populate notes from menu with places that have notes
  $("#note-menu").click(function() {
    $(".destination-name").remove();
    $('#no-message').remove();
    showAllNotes();
  });

  // fill note info with place title, note, and edit button with place name
  $("#notes").click(".destination-name", function(event){
    var placeName = $(event.target).text();
    textShowDestinationNote(placeName);
  });

  // populate edit form with note
  $("#edit-note-button").click(function(){
    var place = $("#note-place-title").text();
    showDestinationNote(place);
    saveNote(place);
  });

  listenForClick();
  findAvailableDestinations();
  showMyDestinations();
});


function getAndApplyPhoto(tag) {
  return $.ajax({url: "https://api.flickr.com/services/rest/?method=flickr.favorites.getList&api_key=15814abffa9beab837cad31506bd4eca&user_id=87845824%40N05&extras=tags&format=json&nojsoncallback=1", method: "get"});
};

function grabPhotoObjects(response) {
  return response.photos.photo;
};

function getMatchingTagArray(allObjects, tag) {
  var countryPics = [];
  allObjects.forEach(function(picture){
    if(picture.tags.replace(/\s+/, "").includes(tag.replace(/\s+/, ""))){
      countryPics.push(picture);
    };
  });
  return countryPics;
};

function returnSpecificImage(array) {
  var image = array[Math.floor(Math.random() * array.length)];
  return image
};
// BACKGROUND IMAGE ^^

// WEATHER API \/
function handleWeather(city) {
   return $.ajax({url:"http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=76b001f2621941cd5d249226db15ed15", method: "get"});
};

function currentWeatherRunner() {
  getCurrentLocation(function(position){
    getCurrentCityName(position.coords.latitude, position.coords.longitude).done(function (city){ 
      var cityName = city.results[0].address_components[3].long_name
      handleWeather(city.results[0].address_components[3].long_name).done(function(weather){
        var temp = Math.round(weather.main.temp)
        appendCurrent(cityName, temp);
        });
      });
    });
  };

  
function appendCurrent(city, temp) {
  $("#current-city").text(city);
  $("#current-temp").text(temp+"°")
};

function appendDestination(city, temp) {
  $("#destination-city").text(city);
  $("#destination-temp").text(temp+"°")
};

// WEATHER API ^^

function getCurrentLocation(success){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success);
  };
};

function getCurrentCityName(lat, long){
  return $.ajax({ url:"http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&sensor=true", method: "get"});
};

// BEGIN NOTES \/

// save edited note w jQuery
function saveNote(place) {
  $("#save-button").click(function(){
    var newNote = $(".jqte_editor").html();
    editDestinationNote(place, newNote);
    $.modal.close();
  });
};
// replace note text with particular country note info
function textShowDestinationNote(place) {
  $("#note-place-title").text(place);
  showDestinationNote(place);
  $("#edit-note-button").text("Edit Note");
};

// edit a particular destination's notes
function editDestinationNote(place, note) {
  chrome.storage.sync.get(function(database) {
    database.myDestinationsLocal.forEach(function(country){
      if(country.name == place) {
        country.note = note;
      };
    });
    chrome.storage.sync.set(database);
  });
};

// show note for particular destination & populate textbox with note
function showDestinationNote(place) {
  chrome.storage.sync.get(function(database) {
    database.myDestinationsLocal.forEach(function(country){
      if(country.name == place) {
        $(".jqte_editor").html("<p class='note-text'>Add notes about your trip here! We got you started with a few handy links.</p>" + country.note);
        $("#note-description").html("<p class='note-text'>Add notes about your trip here! We got you started with a few handy links.</p>" + country.note);
      };
    });
  });
};

// show all destinations that have notes or display message if there are no destinations
function showAllNotes() {
  chrome.storage.sync.get(function(database) {
    if(database.myDestinationsLocal.length === 1 && database.myDestinationsLocal[0].name === "") {
      $('#notes').append('<p class="note-text" id="no-message">You haven\'t saved any destinations yet. <a class="note-text" href="#destinations" rel="modal:open">Start adding now!</a></p>');
    };
    database.myDestinationsLocal.forEach(function(country){
      if (country.name != "") {
        $('#notes').append('<div class="destination destination-name"><a href="#view-note" rel="modal:open">'+country.name+'</a><a href="#view-note" rel="modal:open" id="note-icon" class="fa fa-sticky-note-o sticky" aria-hidden="true"></a></div>');
      }
    });
  });
};

// delete a particular destination's notes (replace destination notes with a blank string)
// NOT NEEDED FOR NOW
function deleteDestinationNote(place) {
  chrome.storage.sync.get(function(database) {
    database.myDestinationsLocal.forEach(function(country){
      if(country.name == place) {
        country.note = "";
      };
    });
    chrome.storage.sync.set(database);
  });
};

// END NOTES /\

// BEGIN DESTINATIONS \/

  // functions
  function findAvailableDestinations() {
    var myNames = [];
    myDestinations.forEach(function(dest) {
      myNames.push(dest.name);
    });

    allDestinations.forEach(function(destination) {
      if (!myNames.includes(destination.name)) {
        availableDestinations.push(destination);
      }
    });
    showAvailableDestinations(availableDestinations);
  }

  function showAvailableDestinations(available) {
    available.forEach(function(destination) {
      var html = "<div class='destination save'><a href='#'>" + destination.name + "</a><a href='#' id='plus-icon' class='fa fa-plus-square-o plus' aria-hidden='true'></a></div>";
      $("#available-destinations").append(html);
    })
  }

  function showMyDestinations() {
    myDestinations.forEach(function(destination) {
      if (destination.name != "") {
        var html = "<div class='destination mine' id='" + destination.name + "'><a href='#view-note' rel='modal:open' title='view destination note'>" + destination.name + "</a><a href='#view-note' rel='modal:open' title='remove from saved destinations' id='note-icon' class='fa fa-sticky-note-o sticky' aria-hidden='true'></a><a href='#' id='trash' class='fa fa-trash-o trash' aria-hidden='true'></a></div>";
        $("#my-destinations").append(html);
      }
    });
  }

  function updateDestinationsView() {
    var lastDestination = myDestinations[myDestinations.length - 1];
    var html = "<div class='destination mine' id='" + lastDestination.name + "'><a href='#view-note' rel='modal:open' title='view destination note'>" + lastDestination.name + "</a><a href='#view-note' rel='modal:open' title='remove from saved destinations' id='note-icon' class='fa fa-sticky-note-o sticky' aria-hidden='true'></a><a href='#' id='trash' class='fa fa-trash-o trash' aria-hidden='true'></a></div>"
    $("#my-destinations").append(html);
  }

  function findDestinationMatch(newDestinationName) {
    var result = {};
    allDestinations.forEach(function(destinationObject) {
      if (destinationObject.name === newDestinationName) {
        result = destinationObject;
      }
    });
    return result;
  }

  function saveDestination(destination) {
    myDestinations.push(destination);
    chrome.storage.sync.set({"myDestinationsLocal": myDestinations});
    updateDestinationsView();
  }

  function deleteDestination(destination) {
    var index = myDestinations.indexOf(destination);
    myDestinations.splice(index, 1);
    chrome.storage.sync.set({"myDestinationsLocal": myDestinations});
    var html = "<div class='destination save'><a href='#'>" + destination.name + "</a><a href='#' id='plus-icon' class='fa fa-plus-square-o plus' aria-hidden='true'></a></div>";
      $("#available-destinations").append(html);
  }

  function listenForClick() {

    $(document).on("click", ".save", function() {
      var $this = $(this);
      var destinationName = $this[0].innerText;
      var destinationObject = findDestinationMatch(destinationName);
      saveDestination(destinationObject);
      $this.remove();
    });

    $(document).on("click", "a.trash", function() {
      var $this = $(this);
      var destinationName = $this.closest("div").attr("id");
      var deleteCheck = confirm("Are you sure you want to remove " + destinationName + " from your destinations?");
      if (deleteCheck == true) {
        var destinationObject = findDestinationMatch(destinationName);
        deleteDestination(destinationObject);
        $this.closest("div").remove();
        $this.remove();
      }
    });

    $(document).on("click", ".destination.mine", function() {
      var $this = $(this);
      textShowDestinationNote($this.closest("div").attr("id"));
    });

    $(document).on("click", "div#notes.modal a#note-icon", function() {
      var $this = $(this);
      textShowDestinationNote($this[0].parentNode.innerText);
    });
    // END DESTINATIONS /\
  }


// FLIGHT API SECTION \/
function getTravelDates(){
  var today = new Date().getDay();
  var timeToFriday = (5 - today)*8.64e+7;
  var friday = new Date(+new Date + timeToFriday);
  var monthFromThen = (timeToFriday + 2.419e+9)
  var weekAfterMonth = (monthFromThen + 6.048e+8)
  var fullLeaveDate = new Date(+new Date + monthFromThen);
  var fullReturnDate = new Date(+new Date + weekAfterMonth);
  var niceDate = fullLeaveDate.toString().slice(0,10)
  var leaveDate = ""
  leaveDate = leaveDate.concat(setupDate(fullLeaveDate))

  var returnDate = ""
  returnDate = returnDate.concat(setupDate(fullReturnDate))
  return [leaveDate, returnDate, niceDate]
};

function formatDate(number) { return "0" + number };

function setupDate(longForm){
  var year = longForm.getFullYear();
  var month = longForm.getMonth();
  var day = longForm.getDate();
  if (month.toString().length<2) {
    month = formatDate((month+1).toString()) 
  };
  if (day.toString().length<2) {day = formatDate(day.toString())};
  return year+"-"+month+"-"+day
}

function getAirportCode(lat, long){
  return $.ajax({url:"https://airport.api.aero/airport/nearest/"+lat+"/"+long+"?maxAirports=2&user_key=6af0095cd237e754d20b7a2f4745110b",dataType: "json", method: "GET"});
};

function hardAirportCode(city, success) {
  var destinationKey = { "Barcelona": "BCN", "Bangkok": "BKK", "Berlin": "TXL", "Bora Bora": "BOB", "Cape Town": "CPT","Chicago": "ORD","Costa Rica": "SJO","London": "LHR","Machu Picchu": "CUZ","Marrakesh": "CMN","Paris": "CDG","San Francisco": "SFO","Seattle": "SEA","Sydney": "SYD","Tokyo": "HND",};
  success([city, destinationKey[city]])
};

function getFlightInfo(currentLocationOne, currentLocationTwo, destination) {
  console.log(currentLocationOne);
  console.log(currentLocationTwo);
  var dates = getTravelDates()
  var leaveDate = dates[0];
  var returnDate = dates[1];
  var niceDate = dates[2];
  var response = $.ajax({url: "http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en_US/"+currentLocationOne+"/"+destination+"/"+leaveDate+"/"+returnDate+"/?apiKey=db645170358776132895925581771065", method: "get", contentType: "application/json", dataType: 'json'});
response.done(function(flightInfo){
  console.log("LENGTH", flightInfo.Quotes.length)

  if (flightInfo.Quotes.length < 1) {
    console.log("leading into the second try")
    console.log(currentLocationTwo)
    console.log(destination)
    response = $.ajax({url: "http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en_US/"+currentLocationTwo+"/"+destination+"/"+leaveDate+"/"+returnDate+"/?apiKey=db645170358776132895925581771065", method: "get", contentType: "application/json", dataType: 'json'}).done(function(flightInfo){
      console.log("TRY2");
      console.log(flightInfo)
       var price = flightInfo.Quotes[0].MinPrice;
       var destinName = flightInfo.Places[0].CityName;
       var current = flightInfo.Places[1].CityName;
       var link = "http://partners.api.skyscanner.net/apiservices/referral/v1.0/US/USD/en_US/"+currentLocationTwo+"/"+destination+"/"+leaveDate+"/"+returnDate+"/?apiKey=db64517035877613";
       if (flightInfo.Quotes.length < 1) {
        $("#flight-current").text("Check out SkyScanner for deals!");
        $("#flight-link").text("skyscanner.com")
       } else {
         $("#flight-price").text("$" + price);
         $("#flight-date").text(niceDate);
         $("#flight-current").text(current);
         $("#flight-destination").text(destinName);
         $("#flight-link").attr("href", link);
       }
    });
  }else {
    console.log("TRY1");

    var price = flightInfo.Quotes[0].MinPrice;
    var destinName = flightInfo.Places[0].CityName;
    var current = flightInfo.Places[1].CityName;
    var link = "http://partners.api.skyscanner.net/apiservices/referral/v1.0/US/USD/en_US/"+currentLocationOne+"/"+destination+"/"+leaveDate+"/"+returnDate+"/?apiKey=db64517035877613";
      if (flightInfo.Quotes.length < 1) {
        $("#flight-current").text("Check out SkyScanner for deals!");
        $("#flight-link").text("skyscanner.com")
      } else {
        $("#flight-price").text("$" + price);
        $("#flight-date").text(niceDate);
        $("#flight-current").text(current);
        $("#flight-destination").text(destinName);
        $("#flight-link").attr("href", link);
      }
    };


        // $(".plane-container").show();
        
      $(".plane-container").on("click", function(event){
        $(".plane-container").hide();
        $(".price-container").show();
      });
  })
}


function grabPhotoTag(success) {
  chrome.storage.sync.get("myDestinationsLocal", success);
};

function pageAddOnHandler() {
  grabPhotoTag(function(object){
    var myDestinations = object["myDestinationsLocal"];
    var airportCode = getCurrentLocation(function(position){
      getAirportCode(position.coords.latitude, position.coords.longitude).always(function(response) {
        if (myDestinations.length === 1 && myDestinations[0].name == ""){
          hardAirportCode(allDestinations[Math.floor(Math.random() * (allDestinations.length-1))].name, function(place) {
          getAndApplyPhoto(place[0]).done(function(photos) {
            var photoInfo = returnSpecificImage(getMatchingTagArray(grabPhotoObjects(photos), place[0].toLowerCase()));
            var image = "https://farm"+photoInfo.farm+".staticflickr.com/"+photoInfo.server+"/"+photoInfo.id+"_"+photoInfo.secret+"_b.jpg";
            $.backstretch(image);
          });
            handleWeather(place[0]).done(function(weather){
              var temp = Math.round(weather.main.temp);
              appendDestination(place[0], temp);
            getFlightInfo(response.airports[0].code, response.airports[1].code, place[1]);
            });
        });
        } else {
          hardAirportCode(myDestinations[Math.floor(Math.random() * (myDestinations.length-1))+1].name, function(place){
            getAndApplyPhoto(place[0]).done(function(photos) {
              var photoInfo = returnSpecificImage(getMatchingTagArray(grabPhotoObjects(photos), place[0].toLowerCase()));
              var image = "https://farm"+photoInfo.farm+".staticflickr.com/"+photoInfo.server+"/"+photoInfo.id+"_"+photoInfo.secret+"_b.jpg";
              $.backstretch(image);
            });
            handleWeather(place[0]).done(function(weather){
              var temp = Math.round(weather.main.temp);
              appendDestination(place[0], temp);
            getFlightInfo(response.airports[0].code, response.airports[1].code, place[1]); 
            });
          });
        }
      }
    );
  });
 })
}
// FLIGHT API SECTION ^^ 
