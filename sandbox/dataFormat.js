var allDestinations = [
  {"name":"Paris", "note":""}, 
  {"name":"San Francisco", "note":""}, 
  {"name":"Chicago", "note":""}
];

// function pickBackground() {

// chrome.storage.sync.get("allDestinations", function(allDestinations){
// 	console.log(allDestinations.length)
// 	allDestinations.forEach(function(destination) {
// 	    console.log(destination.name);
// 	});
//   });
// };

// document.body.onload = function(){
//   chrome.storage.sync.get("destinations", function(items) {
//       console.log("??")
//       console.log("allthings", items);
//       // items.something = 1234;
//       // chrome.storage.sync.set({'value': items});
//   });
//   var place = "boraBora"
//   chrome.storage.sync.set({'Chicago': ""}, function() {
//       // Notify that we saved.
//       console.log('Settings saved');
//     });
// //   {
// //     defaultDestinations : ["Chicago", "Bora Bora", "Tokyo"], 
// //     userDestinations : ["chicago": "", "bora bora": "bring swimsuit"]
// // }