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


var model = {
	map: null,
	markers: [],
	polygon: null,
	infowindow: null,
	bounds: null
};


var ViewModel = function() {
	var self = this;

	this.locations = ko.observableArray([]); 
	this.filter = ko.observable("");

	for (var i=0; i < locations.length; i++) {
			
			var location = {
				title: locations[i].title,
				position: locations[i].position,
				visible: true
			};

			self.locations.push(location);
	}

	this.filteredLocations = ko.computed( function() {
		var filter = self.filter();
		if (!filter) { 
			return self.locations(); 
		}

		return self.locations().filter( function(i) {
			return i.title.indexOf(filter) > -1;
		});
		
	});
};

ko.applyBindings(new ViewModel());