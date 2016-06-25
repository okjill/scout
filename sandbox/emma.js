var ref = new Firebase("https://scout-1d20f.firebaseio.com");
var usersRef = ref.child("users");
var destinationsRef = ref.child("destinations");


function addNewUser(emailAddress) {
	var info = { email: emailAddress, destinations: {'boraBora': true} }

	usersRef.push(info)
	console.log(emailAddress)
};

function addDestination(place) {
	// find user by their id through a current user function 
	// locate destination ID
	// push on destination true
	// add user to the destinations 
	// var user = FIND CURRENT USER METHOD
	usersRef.child("jen/destinations").push({[place]: true});
// PUSH IN CURRENT USER INSTEAD OF HARD CODE
	destinationsRef.child(place).child("users").push({"jen": true});
};


function showAllDestinations() {
	var destinations = [];
	destinationsRef.on('child_added', function(snapshot){
		destinations.push(snapshot.val().name);
		$("body").append("<div>"+destinations+"</div>")
	});
	return destinations 
};



function grabNameofDestination(placeKey){
	destinationsRef.orderByKey().equalTo(placeKey).on('child_added', function(snapshot){
			console.log(snapshot.val().name);
	});
};


function showAllOfUsersDestinations() {
	usersRef.child('jen/destinations').orderByKey().on('child_added', function(snapshot){
		snapshot.forEach(function(destination){
			var destinations = [];
			destinations.push(grabNameofDestination(destination.key()));
			$("body").append("<div>"+destinations+"</div>")
		return destinations
		});
	});
};





function deleteDestination() {

};

function deleteUser() {

};

