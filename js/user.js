$(document).ready(function(){

// Get current user profile
  var user = firebase.auth().currentUser;
  var name, email, photoUrl, uid;

  if (user != null) {
    name = user.displayName;
    email = user.email;
    photoUrl = user.photoURL;
    uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                     // this value to authenticate with your backend server, if
                     // you have one. Use User.getToken() instead.
  }


  // Delete a user
  var user = firebase.auth().currentUser;

  user.delete().then(function() {
    // User deleted.
  }, function(error) {
    // An error happened.
    // So re-authenticate user
    var user = firebase.auth().currentUser;
    var credential;

    // Prompt the user to re-provide their sign-in credentials

    user.reauthenticate(credential).then(function() {
      // User re-authenticated.
    }, function(error) {
      // An error happened.
    });
  });git
});
