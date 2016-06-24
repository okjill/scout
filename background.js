$(document).ready(function(){
  console.log("hello");
  $("body").css("background", "pink");


  // var photoCollection = getImages();
  

  var response = $.ajax({url: "https://api.flickr.com/services/rest/?method=flickr.favorites.getPublicList&api_key=e4aee99e08367dcf3791594e042828f2&user_id=87845824%40N05&extras=tags&format=json&nojsoncallback=1&auth_token=72157670098762976-5668f4a4d757dba0&api_sig=8d79789f68129a8d2aadf865f4fd355d", method: "get"});

  var allPhotos = response.done(function(photos) {
  var pArray = getMatchingTagArray(grabPhotoObjects(photos));
  appendCountryPicture(pArray);
  });

  
});

function grabPhotoObjects(response) {
  // console.log(response.photos.photo)
  return response.photos.photo;
};


function getMatchingTagArray(allObjects) {
  var countryPics = [];
  allObjects.forEach(function(picture){
    if(picture.tags.includes("korea")){
      countryPics.push(picture); 
    };
  });
  return countryPics;
};

function appendCountryPicture(array) {
  var image = array[Math.floor(Math.random() * array.length)];
  console.log(image) 
};

