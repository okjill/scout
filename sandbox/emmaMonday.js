// NEEDS TO BE INTEGRATED
window.onload = function() {
  var prefix = chrome.storage.sync
  prefix.set({"allDestinations": [{"name": "London", "note": ""}, {"name": "Paris", "note": ""}, {"name": "Seattle", "note": ""}, {"name": "Barcelona", "note": ""}, {"name": "Berlin", "note": ""}]});

  grabPhotoTag();
};

// CHANGE FAKELOADER TO 3000
function grabPhotoTag() {
	// NEED TO CHANGE TO USER DESTINATIONS
  chrome.storage.sync.get("myDestinations", function(object){
    var allDestinations = object["myDestinations"];
    var numberOfDestinations = allDestinations.length;
    var destinationTag = allDestinations[Math.floor((Math.random() * numberOfDestinations))].name.toLowerCase();
    // USE LOCATION TO SHOW TO HIT API WITH TAG
    getAndApplyPhoto(destinationTag);
  });
};



function getAndApplyPhoto(tag) {
	console.log("HELLO");
	console.log(tag);
	var response = $.ajax({url: "https://api.flickr.com/services/rest/?method=flickr.favorites.getList&api_key=15814abffa9beab837cad31506bd4eca&user_id=87845824%40N05&extras=tags&format=json&nojsoncallback=1", method: "get"});

	  response.done(function(photos) {
	  	var photoInfo = returnSpecificImage(getMatchingTagArray(grabPhotoObjects(photos), tag));
	  	console.log("photoinfo",photoInfo);
	  	var image = "https://farm"+background.farm+".staticflickr.com/"+background.server+"/"+background.id+"_"+background.secret+"_b.jpg";
	  	$.backstretch(image);
	};
});


function grabPhotoObjects(response) {
  // console.log(response.photos.photo)
  return response.photos.photo;
};

  
function getMatchingTagArray(allObjects, tag) {
  var countryPics = [];
  allObjects.forEach(function(picture){
    if(picture.tags.includes(tag)){
      countryPics.push(picture);
    };
  });
  return countryPics;
};

function returnSpecificImage(array) {
  var image = array[Math.floor(Math.random() * array.length)];
  return image;
};

////////////////////////////////////////////////////////



