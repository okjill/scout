var ref = new Firebase('https://scout-1d20f.firebaseio.com');
var usersRef = ref.child('users');
var destinationsRef = ref.child('destinations');

function showUserDestinations(uid) {
  usersRef.child(uid + '/destinations').orderByKey().on('child_added', function(snapshot){
      destinationsRef.orderByKey().equalTo(snapshot.key()).on('child_added', function(snapshot){
          var destinationName = snapshot.val().name;
          $('#user-destinations').append('<p>' + destinationName + '</p>');
      });
  });
}

function showAllDestinations() {
  destinationsRef.on("child_added", function(snapshot){
    $("#all-destinations").append("<p>" + snapshot.val().name + "<span><button onclick=\"saveDestination('" + snapshot.key() + "')\">Save</button></span></p>");
  });
}

function saveDestination(destination) {
  uid = "jill";
  usersRef.child(uid + '/destinations').update({[destination]: true});
  destinationsRef.child(destination).child('users').update({[uid]: true});
}
