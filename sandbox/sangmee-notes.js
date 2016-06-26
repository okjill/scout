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
function addDestinationNote(place, note) {
// find the users's destination
// append a new note
  usersRef.child("jen/destinations").push({[place]: true});
  currentUserNode.child(place).push({[note]: true})
// PUSH IN CURRENT USER INSTEAD OF HARD CODE
  destinationsRef.child(place).child("users").push({"jen": true});
};

var currentUserNode = usersRef.child(uid + '/destinations');
// edit a destination's notes

// show a destination's notes

// delete a destination's notes












