function deleteDestination(place) {
  function placeToDelete(){
    return place;
  };

// delete user's destination
// NEED TO REPLACE USERNAME WITH CURRENT USER UID
  usersRef.child('sangmee/destinations').orderByKey().on('child_added', function(snapshot){
    
    snapshot.forEach(function(destination){
      if(destination.key() == placeToDelete()){
        var snapshotKey = snapshot.key();
        var removeRef = usersRef.child("sangmee/destinations/"+snapshotKey+"/"+placeToDelete());
        removeRef.remove();
      };
    });
  });

// delete destination's user
// NEED TO REPLACE USERNAME WITH CURRENT USER UID
destinationsRef.orderByKey().equalTo(placeToDelete()).on('child_added', function(snapshot){
  var removeRef = destinationsRef.child(placeToDelete()+"/users/sangmee")
  removeRef.remove();
  });
};



  