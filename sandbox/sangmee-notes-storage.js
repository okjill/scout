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