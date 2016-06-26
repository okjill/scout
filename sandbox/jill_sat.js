var ref = new Firebase('https://scout-1d20f.firebaseio.com');
var usersRef = ref.child('users');
// NEED TO REPLACE WITH CURRENT USER UID
var uid = "jill";
var currentUserNode = usersRef.child(uid + '/destinations');
var destinationsRef = ref.child('destinations');

function showUserDestinations() {
  currentUserNode.orderByKey().on('child_added', function(snapshot){
    destinationsRef.orderByKey().equalTo(snapshot.key()).on('child_added', function(snapshot){
        var destinationName = snapshot.val().name;
        $('#user-destinations').append('<p>' + destinationName + '</p>');
    });
  });
}

function showAllDestinations() {
  destinationsRef.on("child_added", function(snapshot){
    var destinationName = snapshot.val().name;  
    var destinationKey = snapshot.key();

    $("#all-destinations").append("<p>" + destinationName + " <button onclick=\"saveDestination('" + destinationKey + "')\">Save</button></p>");
  });
}

function saveDestination(destination) {
  currentUserNode.update({[destination]: true});
  destinationsRef.child(destination).child('users').update({[uid]: true});
}

function deleteDestination(place) {
  function placeToDelete() {
    return place;
  };

  // delete user's destination
    currentUserNode.orderByKey().on('child_added', function(snapshot) {
    
    snapshot.forEach(function(destination){
      if(destination.key() == placeToDelete()) {
        var snapshotKey = snapshot.key();
        var removeRef = usersRef.child("sangmee/destinations/" + snapshotKey + "/" + placeToDelete());
        removeRef.remove();
      };
    });
  });

  // delete destination's user
    destinationsRef.orderByKey().equalTo(placeToDelete()).on('child_added', function(snapshot) {
    var removeRef = destinationsRef.child(placeToDelete() + "/users/" + uid);
    removeRef.remove();
  });
};