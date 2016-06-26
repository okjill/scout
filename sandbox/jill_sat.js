var ref = new Firebase('https://scout-1d20f.firebaseio.com');
var usersRef = ref.child('users');
// NEED TO REPLACE WITH CURRENT USER UID
var uid = "jill";
var currentUserNode = usersRef.child(uid + '/destinations');
var destinationsRef = ref.child('destinations');

function showUserDestinations() {
  currentUserNode.orderByKey().on('child_added', function(snapshot) {
    destinationsRef.orderByKey().equalTo(snapshot.key()).on('child_added', function(snapshot) {
      var destinationName = snapshot.val().name;  
      var destinationKey = snapshot.key();
      $("#user-destinations").append("<p id=\"single-user-destination\">" + destinationName + " <button id=\"remove\" onclick=\"deleteDestination('" + destinationKey + "')\">Remove</button></p>");
      $("button#remove").click(function() {
        var $this = $(this);
        var node = $(this).closest("p").remove();
        $(this).remove();
      })
    });
  });
}

function showAllDestinations() {
  destinationsRef.on("child_added", function(snapshot) {
    var destinationName = snapshot.val().name;  
    var destinationKey = snapshot.key();
    
    $("#all-destinations").append("<p>" + destinationName + " <button onclick=\"saveDestination('" + destinationKey + "')\">Save</button></p>");
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
