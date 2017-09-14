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

var ViewModel = function() {
	var self = this;

	this.locations = ko.observableArray([]); 
	this.filter = ko.observable("");

	for (var i=0; i < locations.length; i++) {
		var location = locations[i];
		self.locations.push({
			title: location.title,
			position: location.position, 
			id: i
		});
	}
	// Computed array to the locations that will be displayed
	// It uses the this.location array and the string typed 
	// by the user to define which locations to display
	this.filteredLocations = ko.computed(function getfilterLocations() {
		var filter = self.filter();
		// Check if the filter field is empty,
		// if so, return the full locations array.
		if (!filter) { 
			return self.locations(); 
		}
		// If the filter field is not empty,
		// return the array with the filter applyed.
		return self.locations().filter(function(location) {
			// Return true if the typed string is within the location title
			// And false otherwise
			console.log(filter);
			hasString = location.title.toLowerCase().indexOf(filter.toLowerCase()) > -1;
			return hasString;
		});
	});

	this.storeMarker = function(marker) {
		model.markers.push(marker);
	}

	this.initMap = function(map, markers, bounds, infowindow) {
		model.map = map; 
		model.markers = markers; 
		model.bounds = bounds;
		model.infowindow = infowindow; 

		self.displayMarkers();
	}

	this.getMarkers = function() {
		return model.markers;
	}

	this.displayMarkers = function() {
		markers = model.markers;
		bounds = model.bounds
		for (var i=0; i < markers.length; i++) {
			for (var j=0; j < self.filteredLocations().length; j++) {
				if (markers[i].id === self.filteredLocations()[i].id);
				markers[i].setMap(model.map);
				model.bounds.extend(markers[i].position)
			}
 		model.map.fitBounds(bounds);
		}
	}

	this.populateInfoWindow = function(marker) {
		if (model.infowindow.marker != marker) {
			model.infowindow.marker = marker;
			marker.infowindow = model.infowindow;
			model.infowindow.setContent("<div class='infowindow'>" + marker.title + "</div>");
		}

		self.displayInfoWindow(marker);
	}

	this.displayInfoWindow = function(marker) {
		var id = marker.id;
		model.infowindow.open(model.map, model.markers[id]);
	}

	this.locationListListener = function(location) {
		console.log(location);
		var marker = model.markers[location.id];
		self.populateInfoWindow(marker, model.infowindow);
	}

};

ViewModel = new ViewModel();
ko.applyBindings(ViewModel);

function initMap() {

	var bounds = new google.maps.LatLngBounds();
	var infowindow = new google.maps.InfoWindow(); 

	var map = new google.maps.Map(document.getElementById("map"), {
		center: {lat: 37.3700, lng: -122.0400}, 
		zoom: 13
	});

	var locations = ViewModel.locations();
	var marker; 

	for (var i=0; i < locations.length; i++) {
		marker = new google.maps.Marker({
			title: locations[i].title, 
			position: locations[i].position, 
			id: locations[i].id
		}); 

		marker.addListener("click", function(marker) {
			ViewModel.populateInfoWindow(this);
		});

		ViewModel.storeMarker(marker);
	}

	var markers = ViewModel.getMarkers();

	ViewModel.initMap(map, markers, bounds, infowindow); 

	document.getElementById("hamburger-menu").addEventListener("click", function() {
		$(document.getElementById("header")).toggleClass("translate");
		$(document.getElementById("options-box")).toggleClass("show");
	});

}

