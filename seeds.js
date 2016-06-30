// initialize data

var defaultNoteText = "<p class='note-text'>Add notes about your trip here! We got you started with a few handy links.</p>"

var allDestinations;
chrome.storage.sync.get({"allDestinationsLocal":
 [{"name":"Bangkok", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/thailand/bangkok' target='_blank'>Lonely Planet - Bangkok</a><br><a class='note-text' href='https://www.airbnb.com/s/Bangkok--Thailand' target='_blank'>Airbnb - Bangkok Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/bangkok' target='_blank'>Frommer's - Bangkok</a>"},
  {"name":"Barcelona", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/spain/barcelona' target='_blank'>Lonely Planet - Barcelona</a><br><a class='note-text' href='https://www.airbnb.com/s/Barcelona--Spain' target='_blank'>Airbnb - Barcelona Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/barcelona' target='_blank'>Frommer's - Barcelona</a>"},
  {"name":"Berlin", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/germany/berlin' target='_blank'>Lonely Planet - Berlin</a><br><a class='note-text' href='https://www.airbnb.com/s/Berlin--Germany' target='_blank'>Airbnb - Berlin Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/berlin' target='_blank'>Frommer's - Berlin</a>"},
  {"name":"Bora Bora", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/tahiti-and-french-polynesia/bora-bora' target='_blank'>Lonely Planet - Bora Bora</a><br><a class='note-text' href='https://www.airbnb.com/s/Bora-Bora--French-Polynesia' target='_blank'>Airbnb - Bora Bora Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/bora-bora' target='_blank'>Frommer's - Bora Bora</a>"},
  {"name":"Cape Town", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/south-africa/cape-town' target='_blank'>Lonely Planet - Cape Town</a><br><a class='note-text' href='https://www.airbnb.com/s/Cape-Town--South-Africa' target='_blank'>Airbnb - Cape Town Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/cape-town' target='_blank'>Frommer's - Cape Town</a>"},
  {"name":"Chicago", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/usa/chicago' target='_blank'>Lonely Planet - Chicago</a><br><a class='note-text' href='https://www.airbnb.com/s/Chicago--IL' target='_blank'>Airbnb - Chicago Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/chicago' target='_blank'>Frommer's - Chicago</a>"},
  {"name":"Costa Rica", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/costa-rica' target='_blank'>Lonely Planet - Costa Rica</a><br><a class='note-text' href='https://www.airbnb.com/s/Costa-Rica' target='_blank'>Airbnb - Costa Rica Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/costa-rica' target='_blank'>Frommer's - Costa Rica</a>"},
  {"name":"Cusco", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/peru/machu-picchu' target='_blank'>Lonely Planet - Cusco</a><br><a class='note-text' href='https://www.airbnb.com/s/Cusco--Peru' target='_blank'>Airbnb - Cusco Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/machu-picchu' target='_blank'>Frommer's - Cusco</a>"},
  {"name":"London", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/england/london' target='_blank'>Lonely Planet - London</a><br><a class='note-text' href='https://www.airbnb.com/s/London--United-Kingdom' target='_blank'>Airbnb - London Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/london' target='_blank'>Frommer's - London</a>"},
  {"name":"Marrakesh", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/morocco/marrakesh' target='_blank'>Lonely Planet - Marrakesh</a><br><a class='note-text' href='https://www.airbnb.com/s/Marrakesh--Morocco' target='_blank'>Airbnb - Marrakesh Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/marrakech' target='_blank'>Frommer's - Marrakesh</a>"},
  {"name":"Paris", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/france/paris' target='_blank'>Lonely Planet - Paris</a><br><a class='note-text' href='https://www.airbnb.com/s/Paris--France' target='_blank'>Airbnb - Paris Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/paris' target='_blank'>Frommer's - Paris</a>"},
  {"name":"San Francisco", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/usa/san-francisco' target='_blank'>Lonely Planet - San Francisco</a><br><a class='note-text' href='https://www.airbnb.com/s/San-Francisco--CA' target='_blank'>Airbnb - San Francisco Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/san-francisco' target='_blank'>Frommer's - San Francisco</a>"},
  {"name":"Seattle", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/usa/seattle' target='_blank'>Lonely Planet - Seattle</a><br><a class='note-text' href='https://www.airbnb.com/s/Seattle--WA' target='_blank'>Airbnb - Seattle Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/seattle' target='_blank'>Frommer's - Seattle</a>"},
  {"name":"Sydney", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/australia/sydney' target='_blank'>Lonely Planet - Sydney</a><br><a class='note-text' href=' https://www.airbnb.com/s/Sydney--Australia' target='_blank'>Airbnb - Sydney Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/sydney' target='_blank'>Frommer's - Sydney</a>"},
  {"name":"Tokyo", "note": defaultNoteText + "<a class='note-text' href='https://www.lonelyplanet.com/japan/tokyo' target='_blank'>Lonely Planet - Tokyo</a><br><a class='note-text' href='https://www.airbnb.com/s/Tokyo--Japan' target='_blank'>Airbnb - Tokyo Vacation Rentals & Short-Term Rentals</a><br><a class='note-text' href='http://www.frommers.com/destinations/tokyo' target='_blank'>Frommer's - Tokyo</a>"}
 ]}, function(data) {
  allDestinations = data.allDestinationsLocal;
  chrome.storage.sync.set({"allDestinationsLocal": allDestinations});
});

  chrome.storage.sync.getBytesInUse(function(bytes){
    console.log(bytes);
    console.log(chrome.storage.sync);
  });


var myDestinations;
chrome.storage.sync.get({"myDestinationsLocal": [{"name":"", "note":""}]}, function(data) {
  myDestinations = data.myDestinationsLocal;
  chrome.storage.sync.set({"myDestinationsLocal": myDestinations});
});

var availableDestinations = [];
