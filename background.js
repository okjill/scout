$(document).ready(function(){
  $("#notes").click(".destination-name", function(event){
    var placeName = $(event.target).text();
    textShowDestinationNote(placeName);
  });

  $("#save-button").click(function(){
    newNote = $(".jqte_editor").html();
    editDestinationNote("Paris", newNote);
    $.modal.close();
  });

  // SANGMEE - NOTE SHOW/ADD/EDIT/DELETE
  document.body.onload = function() {
  // var allDestinations = [
  //   {"name":"Paris", "note":""}, 
  //   {"name":"San Francisco", "note":""}, 
  //   {"name":"Chicago", "note":""}
  // ];
    // showDestinationNote("Paris");
    // addDestinationNote("Paris", "Paris notes");
    // deleteDestinationNote("San Francisco");
    showAllNotes();
    // appendDestinationNote();
    // textShowDestinationNote("Paris");

  };

// replace note text with particular country text
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

  function showDestinationNote(place) {
    chrome.storage.sync.get(function(database) {
      database.allDestinations.forEach(function(country){
        if(country.name == place) {
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


  // ===============



  $("body").css("background", "darkgray");

  $("#note-editor").jqte();

  $("#fakeLoader").fakeLoader({
            timeToHide:1200, //Time in milliseconds for fakeLoader disappear
            zIndex:999, // Default zIndex
            spinner:"spinner1",//Options: 'spinner1', 'spinner2', 'spinner3', 'spinner4', 'spinner5', 'spinner6', 'spinner7'
            bgColor:"#6E6464", //Hex, RGB or RGBA colors
            // imagePath:"icon-sm.png" //If you want can you insert your custom image
    });


  var response = $.ajax({url: "https://api.flickr.com/services/rest/?method=flickr.favorites.getList&api_key=15814abffa9beab837cad31506bd4eca&user_id=87845824%40N05&extras=tags&format=json&nojsoncallback=1", method: "get"});

  var allPhotos = response.done(function(photos) {
    var pArray = getMatchingTagArray(grabPhotoObjects(photos));
    var background = returnSpecificImage(pArray);
    var image = "https://farm"+background.farm+".staticflickr.com/"+background.server+"/"+background.id+"_"+background.secret+"_b.jpg"
    $.backstretch(image);

  });
});

function grabPhotoObjects(response) {
  // console.log(response.photos.photo)
  return response.photos.photo;
};


function getMatchingTagArray(allObjects) {
  var countryPics = [];
  allObjects.forEach(function(picture){
    if(picture.tags.includes("barcelona")){
      countryPics.push(picture);
    };
  });
  return countryPics;
};

function returnSpecificImage(array) {
  var image = array[Math.floor(Math.random() * array.length)];
  return image
};

