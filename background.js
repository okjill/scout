window.onload = function() {

getCurrentLocation();
// getLocation()
  var allDestinations = 
     [{"name":"Paris", "note":""}, 
      {"name":"San Francisco", "note":""}, 
      {"name":"Chicago", "note":""},
      {"name":"London", "note":""}, 
      {"name":"Tokyo", "note":""}, 
      {"name":"Barcelona", "note":""},
      {"name":"Seattle", "note":""}, 
      {"name":"Sydney", "note":""}, 
      {"name":"Costa Rica", "note":""},
      {"name":"Machu Picchu", "note":""}, 
      {"name":"Marrakesh", "note":""}, 
      {"name":"Berlin", "note":""},
      {"name":"Bangkok", "note":""}, 
      {"name":"Bora Bora", "note":""}, 
      {"name":"Cape Town", "note":""}
     ];
  
  chrome.storage.sync.set({"allDestinations": allDestinations});
  myDestinations = [{"name":"Bora Bora", "note":""}];
  chrome.storage.sync.set({"myDestinationsLocal": myDestinations});

  function showAvailableDestinations() {
    allDestinations.forEach(function(destination) {
      for (var i = 0; i < myDestinations.length; i++) {
        if (myDestinations[i].name != destination.name) {
          var html = "<div class='destination save'><a href='#'>" + destination.name + "</a></div>";
          $("#available-destinations").append(html);
        }
      }
    });
  }

  function showMyDestinations() {
    chrome.storage.sync.get("myDestinationsLocal", function(object) {
      object.myDestinationsLocal.forEach(function(destination) {
        var html = "<div class='destination'><a href='#'>" + destination.name + "</a></div>";
        $("#my-destinations").append(html);
      });
    });
  }

  function updateDestinationsView() {
    chrome.storage.sync.get("myDestinationsLocal", function(object) {
      var array = object.myDestinationsLocal;
      var lastDestination = array[array.length - 1];
      var html = "<div class='destination'><a href='#'>" + lastDestination.name + "</a></div>";
      $("#my-destinations").append(html);
    });
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
  }

  function listenForClick() {
    $(document).on("click", ".save", function() {
      var $this = $(this);
      var destinationName = $this[0].innerText;
      var destinationObject = findDestinationMatch(destinationName);
      saveDestination(destinationObject);
      updateDestinationsView();
      $this.remove();
    });
  }

  showAvailableDestinations();
  showMyDestinations();
  listenForClick();
  grabPhotoTag();
};

$(document).ready(function(){

  $("body").css("background", "darkgray");
  $("#note-editor").jqte();
  $("#fakeLoader").fakeLoader({
            timeToHide:10, //Time in milliseconds for fakeLoader disappear
            zIndex:999, // Default zIndex
            spinner:"spinner1",//Options: 'spinner1', 'spinner2', 'spinner3', 'spinner4', 'spinner5', 'spinner6', 'spinner7'
            bgColor:"#6E6464", //Hex, RGB or RGBA colors
            // imagePath:"icon-sm.png" //If you want can you insert your custom image
    });
  // populate notes from menu with places that have notes
  $("#note-menu").click(function() {
    $(".destination-name").remove();
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
});


// BACKGROUND IMAGE \/

function grabPhotoTag() {
  chrome.storage.sync.get("myDestinationsLocal", function(object){
    var allDestinations = object["myDestinationsLocal"];
    var numberOfDestinations = allDestinations.length;
    var destinationTag = allDestinations[Math.floor((Math.random() * numberOfDestinations))].name;
    getAndApplyPhoto(destinationTag.toLowerCase());
    handleWeather("destin", destinationTag);
  });
};

function getAndApplyPhoto(tag) {
  console.log(tag)
  var response = $.ajax({url: "https://api.flickr.com/services/rest/?method=flickr.favorites.getList&api_key=15814abffa9beab837cad31506bd4eca&user_id=87845824%40N05&extras=tags&format=json&nojsoncallback=1", method: "get"});
  response.done(function(photos) {
    var photoInfo = returnSpecificImage(getMatchingTagArray(grabPhotoObjects(photos), tag));
    var image = "https://farm"+photoInfo.farm+".staticflickr.com/"+photoInfo.server+"/"+photoInfo.id+"_"+photoInfo.secret+"_b.jpg";
    $.backstretch(image);
  });
};

function grabPhotoObjects(response) {
  return response.photos.photo;
};

function getMatchingTagArray(allObjects, tag) {
  var countryPics = [];
  allObjects.forEach(function(picture){
    if(picture.tags.includes(tag)){
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
function handleWeather(where, city) {
   var weatherResponse = $.get({url:"http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=76b001f2621941cd5d249226db15ed15", method: "get"});

  weatherResponse.done(function(weather){
    console.log("weather!", weather.main.temp)
    var temp = weather.main.temp
    if (where === "current") {
      appendCurrent(city, temp);
    } else {
    appendDestination(city, temp);
    }
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

function getCurrentLocation(){
  // var options = {maximumAge: 3600000}
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      var latlong = [lat,long];
      getCurrentCityName(lat, long);
    });
  };
};

function getCurrentCityName(lat, long){
  $.ajax({ url:"http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+long+"&sensor=true", method: "get"}).done(function (city){
    var cityName = city.results[0].address_components[3].long_name
    handleWeather("current", cityName);
  });
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
  $("#edit-note-button").text("Edit the " +place+ " Note");
};

// add a new note for a particular destination
// WILL AUTOMATICALLY OVERWRITE ANY NOTES THAT ARE THERE ALREADY
function addDestinationNote(place, note) {
  chrome.storage.sync.get(function(database) {
    database.allDestinations.forEach(function(country){
      if(country.name == place) {
        country.note = note;
      };
    });
    chrome.storage.sync.set(database);
  });
};

// edit a particular destination's notes
// SAME AS ADD FUNCTION
// DOES NOT REMOVE TAGS FOR THINGS LIKE BOLD, ITALICS, ETC.!!!
function editDestinationNote(place, note) {
  chrome.storage.sync.get(function(database) {
    database.allDestinations.forEach(function(country){
      if(country.name == place) {
        country.note = note;
      };
    });
    chrome.storage.sync.set(database);
  });
};

// show note for particular destination & populates 
function showDestinationNote(place) {
  chrome.storage.sync.get(function(database) {
    database.allDestinations.forEach(function(country){
      if(country.name == place) {
        $(".jqte_editor").html(country.note);
        $("#note-description").text(country.note); 
      };
    });
  });
};

// delete a particular destination's notes (replace destination notes with a blank string)
function deleteDestinationNote(place) {
  chrome.storage.sync.get(function(database) {
    database.allDestinations.forEach(function(country){
      if(country.name == place) {
        country.note = "";
      };
    });
    chrome.storage.sync.set(database);
  });
};

// show all destinations that have notes
function showAllNotes() {
  chrome.storage.sync.get(function(database) {
    database.allDestinations.forEach(function(country){
      if(country.note != "") {
        $('#notes').append('<div class="destination destination-name"><a href="#view-note" rel="modal:open">'+country.name+'</a></div>');
      };
    });
  });
};
// END NOTES /\
