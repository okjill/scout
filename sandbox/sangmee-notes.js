var ref = new Firebase('https://scout-1d20f.firebaseio.com');
var usersRef = ref.child('users');
// NEED TO REPLACE WITH CURRENT USER UID
var uid = "sangmee";
var currentUserNode = usersRef.child(uid + '/destinations');
var destinationsRef = ref.child('destinations');

function showUserDestinations() {
  currentUserNode.orderByKey().on('child_added', function(snapshot) {
    destinationsRef.orderByKey().equalTo(snapshot.key()).on('child_added', function(snapshot) {
      var destinationName = snapshot.val().name;  
      var destinationKey = snapshot.key();
      var html = "<p class='remove' id='" + destinationKey + "'>" + destinationName + "</p>";
      
      $("#user-destinations").append(html);
      dealWithButtons("remove", destinationKey);
    });
  });
}

function showAllDestinations() {
  destinationsRef.on("child_added", function(snapshot) {
    var destinationName = snapshot.val().name;  
    var destinationKey = snapshot.key();
    var html = "<p class='save' id='" + destinationKey + "'>" + destinationName + "</p>";
    
    $("#all-destinations").append(html);
    dealWithButtons("save", destinationKey);
  });
}

function saveDestination(destination) {
  currentUserNode.update({[destination]: true});
  destinationsRef.child(destination).child('users').update({[uid]: true});
}

function deleteDestination(destination) {
  currentUserNode.update({[destination]: null});
  destinationsRef.child(destination).child('users').update({[uid]: null});
}

function dealWithButtons(action, destinationKey) {
  if (action === "save") {
    currentUserNode.once("value", function(snapshot) {
      if (!snapshot.hasChild(destinationKey)) {
        $("#all-destinations p#" + destinationKey).after("<button class='save' id='" + destinationKey + "'>Save</button>");
      }
    });
  } else if (action === "remove") {
    currentUserNode.once("value", function(snapshot) {
      if (snapshot.hasChild(destinationKey)) {
        $("#user-destinations p#" + destinationKey).after("<button class='remove' id='" + destinationKey + "'>Remove</button>");
      }
    });
  }
}

function listenForButtonClicks() {
  $(document).on("click", ".save", function() {
    var $this = $(this);
    saveDestination(this.id);
    $this.remove();

  });

  $(document).on("click", ".remove", function() {
    var $this = $(this);
    deleteDestination(this.id);
    $("#user-destinations p#" + this.id).remove();
    $("#all-destinations p#" + this.id).after("<button class='save' id='" + this.id + "'>Save</button>");
    $this.remove();
  });
}

$(document).ready(function() {

  listenForButtonClicks();

});

// ===========================

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












