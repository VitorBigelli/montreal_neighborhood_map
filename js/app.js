// An array with the locations titles and positions
var locations = [
	{title: "The Tech Museum of Innovation", position: {lat: 37.3316, lng: -121.8901}},
	{title: "Computer History Museum", position: {lat: 37.4143, lng: -122.0774}}, 
	{title: "Happy Hollow Park & Zoo", position: {lat: 37.3257, lng: -121.8614}}, 
	{title: "Children's Discovery Museum of San Jose", position: {lat: 37.3268, lng: -121.8925}}, 
	{title: "Googleplex", position: {lat: 37.4220, lng: -122.0841}}, 
	{title: "Facebook HQ", position: {lat: 37.4847, lng: -122.1477}}, 
	{title: "Tesla, Inc.", position: {lat: 37.394705, lng: -122.150325}}, 
	{title: "Nvidia", position: {lat: 37.370728, lng: -121.963739}}
];

//----------------------MODEL-------------------//
var model = {
	map: null,
	markers: [],
	polygon: null,
	infowindow: null,
	bounds: null
};

//------------------ViewModel-------------------//
var ViewModel = function() {
	console.log("Initialize ViewModel")

	var self = this;

	this.locations = ko.observableArray([]); 
	this.filter = ko.observable("");

	// Create a
	for (var i=0; i < locations.length; i++) {
		var location = locations[i];
		location.id = i;
		self.locations.push(location);
	}

	// Computed array to the locations that will be displayed
	// It uses the this.location array and the string typed 
	// by the user to define which locations to display
	this.filteredLocations = ko.computed(filterLocations); 

	function filterLocations() {
		var filter = self.filter();
		// Check if the filter field is empty,
		// if so, return the full locations array.
		if (!filter) { 
			for (var i=0; i < model.markers.length; i++) {
				if (!model.markers[i].map) {
					model.markers[i].setMap(model.map);
				}
			}
			return self.locations(); 
		}
		// If the filter field is not empty,
		// return the array with the filter applyed.
		return self.locations().filter(function(location) {
			// Return true if the typed string is within the location title
			// And false otherwise
			console.log(filter);
			hasString = location.title.toLowerCase().indexOf(filter.toLowerCase()) > -1;
			if (!hasString) {
				model.markers[location.id].setMap(null);
			} else {
				model.markers[location.id].setMap(model.map);
			}
			return hasString;
		});
	}
};

ViewModel = new ViewModel()
ko.applyBindings(ViewModel);