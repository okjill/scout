// add a new note for a destination
// OVERWRITES ANY OLD NOTES!!!!!!
function addDestinationNote(place, note) {
  currentUserNode.child(place).set({notes: note});
};

// edit a destination's notes
function editDestinationNote(place, newNote) {
  currentUserNode.child(place).set({notes: newNote});
};

// show a destination's notes
function showDestinationNote(place) {
  currentUserNode.child(place).on("child_added", function(snapshot) {
    var destinationNotes = snapshot.val();  
    // console.log(destinationNotes);
    // var html = "<p>" + destinationNotes + "</p>";;
    
    // $("#user-destination-notes").append(html);
  });
};

// delete a destination's notes
function deleteDestinationNote(place) {
  var currentUserNodeCity = currentUserNode.child(place);
  currentUserNodeCity.update({notes: "You have no notes yet!"});
};

// show all destination note titles












