var ref = new Firebase("https://scout-1d20f.firebaseio.com");
var usersRef = ref.child("users");
var destinationsRef = ref.child("destinations");


function addNewUser(emailAddress) {
	var info = { email: emailAddress, destinations: {'boraBora': true} }

	usersRef.push(info)
	console.log(emailAddress)
};

function getCurrentUser() {
	var currentUser = ref.getAuth().uid;
	console.log(currentUser)
};

function addDestination(currentUser, place) {
	usersRef.child(currentUser+"/destinations").push({[place]: true});
	destinationsRef.child(place).child("users").push({[currentUser]: true});
};

function showAllDestinations() {
	destinationsRef.on('child_added', function(snapshot){
		$("body").append("<div>"+snapshot.val().name+"</div>")
	});
};n


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

function deleteUser(userKey) {
	usersRef.child(userKey).remove();
};

