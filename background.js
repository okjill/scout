window.onload = function() {

  getCurrentLocation();

  grabPhotoTag();
};

$(document).ready(function(){

  $("body").css("background", "darkgray");
  $("#note-editor").jqte();
  $("head").append("<script src='https://use.fontawesome.com/8e7d53f080.js'></script>");

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

var destinationTag;
// BACKGROUND IMAGE \/
function grabPhotoTag() {
  chrome.storage.sync.get("myDestinationsLocal", function(object){
    var myDestinations = object["myDestinationsLocal"];
    if (myDestinations.length === 1 && myDestinations[0].name == "") {
      destinationTag = allDestinations[Math.floor((Math.random() * allDestinations.length))].name;
    }
    else {
      destinationTag = myDestinations[Math.floor((Math.random() * myDestinations.length))].name;
    }
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
    var temp = Math.round(weather.main.temp)
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
        $(".jqte_editor").html(country.note);
        $("#note-description").html(country.note);
      };
    });
  });
};

// show all destinations that have notes or display message if there are no destinations
function showAllNotes() {
  console.log("hello!");
  chrome.storage.sync.get(function(database) {
    if(database.myDestinationsLocal.length === 1 && database.myDestinationsLocal[0].name === "") {
      $('#notes').append('<p id="no-message">You have no destinations saved yet.</p>');
    };
    database.myDestinationsLocal.forEach(function(country){
      if (country.name != "") {
        $('#notes').append('<div class="destination destination-name"><a href="#view-note" rel="modal:open">'+country.name+'</a></div>');
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
// initialize data
  var allDestinations;
  chrome.storage.sync.get({"allDestinationsLocal":
   [{"name":"Barcelona", "note":""},
    {"name":"Bangkok", "note":""},
    {"name":"Berlin", "note":""},
    {"name":"Bora Bora", "note":""},
    {"name":"Cape Town", "note":""},
    {"name":"Chicago", "note":""},
    {"name":"Costa Rica", "note":""},
    {"name":"London", "note":""},
    {"name":"Machu Picchu", "note":""},
    {"name":"Marrakesh", "note":""},
    {"name":"Paris", "note":""},
    {"name":"San Francisco", "note":""},
    {"name":"Seattle", "note":""},
    {"name":"Sydney", "note":""},
    {"name":"Tokyo", "note":""}
   ]}, function(data) {
    allDestinations = data.allDestinationsLocal;
    chrome.storage.sync.set({"allDestinationsLocal": allDestinations});
  });

  var myDestinations;
  chrome.storage.sync.get({"myDestinationsLocal": [{"name":"", "note":""}]}, function(data) {
    myDestinations = data.myDestinationsLocal;
    chrome.storage.sync.set({"myDestinationsLocal": myDestinations});
  });

  var availableDestinations = [];

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
        var html = "<div class='destination mine' id='" + destination.name + "'><a href='#view-note' rel='modal:open'>" + destination.name + "</a><a href='#view-note' rel='modal:open' id='note-icon' class='fa fa-sticky-note-o sticky' aria-hidden='true'></a><a href='#' id='trash' class='fa fa-trash-o trash' aria-hidden='true'></a></div>";
        $("#my-destinations").append(html);
      }
    });
  }

  function updateDestinationsView() {
    var lastDestination = myDestinations[myDestinations.length - 1];
    var html = "<div class='destination mine' id='" + lastDestination.name + "'><a href='#view-note' rel='modal:open'>" + lastDestination.name + "</a><a href='#view-note' rel='modal:open' id='note-icon' class='fa fa-sticky-note-o sticky' aria-hidden='true'></a><a href='#' id='trash' class='fa fa-trash-o trash' aria-hidden='true'></a></div>"
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

    $(document).on("click", ".destination.mine", function(event) {
      var $this = $(this);
      textShowDestinationNote($this.closest("div").attr("id"));
    });

    $(document).on("click", "a#note-icon", function() {
      var $this = $(this);
      textShowDestinationNote($this.closest("div").attr("id"));
    });
    // END DESTINATIONS /\
  }
