// NEEDS TO BE INTEGRATED
window.onload = function() {
  var prefix = chrome.storage.sync
  prefix.set({"allDestinations": [{"name": "London", "note": ""}, {"name": "Paris", "note": ""}, {"name": "Hawaii", "note": ""}, {"name": "San Francisco", "note": ""}, {"name": "New York", "note": ""}]});

// NEED TO CHANGE TO USER DESTINATIONS
  chrome.storage.sync.get("allDestinations", function(object){
    var allDestinations = object["allDestinations"]
    var numberOfDestinations = object["allDestinations"].length
    var destinationTag = allDestinations[Math.floor((Math.random() * numberOfDestinations) + 1)].name.toLowerCase();
    // USE LOCATION TO SHOW TO HIT API WITH TAG
  });

};
