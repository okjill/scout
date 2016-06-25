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

	// console.log(user)
};