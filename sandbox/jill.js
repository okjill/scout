var ref = new Firebase("https://scout-1d20f.firebaseio.com");
var usersRef = ref.child("users");
var destinationsRef = ref.child("destinations");

function addNewUsers() {
  usersRef.update({
    daniel: {
      email: "dan@dan.com",
      destinations: {
        "nairobi": true
      }
    },
    natalia: {
      email: "natalia@natalia.com",
      destinations: {
        "boraBora": true, 
        "delhi": true
      }
    }
  });

  usersRef.on("value", function(snapshot) {
    var data = snapshot.val();
    console.log(data);
    // var html = "<p>" + data.alanisawesome.full_name + "<br>" + data.alanisawesome.date_of_birth + "</p>";
    // $("#test").append(html);
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
  // usersRef.update({
  //   "alanisawesome/nickname": "Alan The Machine",
  //   "gracehop/nickname": "Amazing Grace"
  // });
}

function getValue() {
  ref.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
}

function showAllUsers() {
  usersRef.orderByChild("email").on("child_added", function(snapshot) {
    console.log(snapshot.key());
  });
}

function showAllDestinations() {
  destinationsRef.orderByChild("name").on("child_added", function(snapshot) {
    console.log(snapshot.key());
  });
}

function showEmmaDestinations() {
  ref.child("users/emma/destinations").on('child_added', function(snapshot) {
    // for each group, fetch the name and print it
    var destKey = snapshot.key();
    ref.child("destinations/" + destKey + "/name").once('value', function(snapshot) {
      console.log("Emma saved this location: " + snapshot.val());
    });
  });
}

function addJenDestination() {
  ref.child("users/jen/destinations").push({ 'paris': true });

  destinationsRef.update({
    tokyo: {
      name: "Tokyo",
      users: {
        jen: true
      }
    }
  });
}

function deleteSangMeeDestination() {
  var removeRef = ref.child("users/sangmee/destinations/nairobi");
  removeRef.remove();
}