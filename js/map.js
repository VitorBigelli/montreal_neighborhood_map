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
	infowindow: null,
	bounds: null,
	streetViewService: null
};

var ViewModel = function() {
	var self = this;

	this.locations = ko.observableArray([]); 
	this.filter = ko.observable("");
	this.nytArticles = ko.observableArray([]);
	this.nytHeader = ko.observable("");

	for (var i=0; i < locations.length; i++) {
		var location = locations[i];
		self.locations.push({
			title: location.title,
			position: location.position, 
			id: i
		});
	};

	this.displayAllMarkers = function(data) {
		for (var i=0; i < model.markers.length; i++) {
			self.displayMarker(model.markers[i]);
			model.bounds.extend(markers[i].position);
		}
	};

	this.displayMarker = function(marker) {
		marker.setMap(model.map);
	};

	this.hideMarkerById = function(id) {
		var markers = model.markers;
		for (var i=0; i < markers.length; i++) {
			if (markers[i].id === id) {
				model.markers[i].setMap(null);
			}
		}
	};
	// Computed array to the locations that will be displayed
	// It uses the this.location array and the string typed 
	// by the user to define which locations to display
	this.filteredLocations = ko.computed(function getfilterLocations() {
		var filter = self.filter();
		// Check if the filter field is empty,
		// if so, return the full locations array.
		if (!filter) { 
			self.displayAllMarkers();
			return self.locations(); 
		}
		// If the filter field is not empty,
		// return the array with the filter applyed.
		return self.locations().filter(function(location) {
			// Return true if the typed string is within the location title
			// And false otherwise
			hasString = location.title.toLowerCase().indexOf(filter.toLowerCase()) > -1;
			if (!hasString) {
				self.hideMarkerById(location.id);
			}
			return hasString;
		});
	});

	this.storeMarker = function(marker) {
		model.markers.push(marker);
	};

	this.initMap = function(map, markers, bounds, infowindow, streetViewService) {
		model.map = map; 
		model.markers = markers; 
		model.bounds = bounds;
		model.infowindow = infowindow; 
		model.streetViewService = streetViewService
		self.displayMarkers();
	};

	this.getMarkers = function() {
		return model.markers;
	};

	this.displayMarkers = function() {
		markers = model.markers;
		for (var i=0; i < markers.length; i++) {
			for (var j=0; j < self.filteredLocations().length; j++) {
				if (markers[i].id === self.filteredLocations()[i].id);
				self.displayMarker(markers[i]);
				model.bounds.extend(markers[i].position)
			}
 			model.map.fitBounds(model.bounds);
		}
	};

	this.populateInfoWindow = function(marker) {
		if (model.infowindow.marker != marker) {
			model.infowindow.marker = marker;
			marker.infowindow = model.infowindow;
			model.infowindow.setContent("<div class='infowindow'>" + marker.title + "</div><div id='pano'></div>");

			//Listener to close the NYTimes articles when the respective
			//infowindow is closed.
			model.infowindow.addListener("closeclick", self.closeNytArticles);
		}
		self.showNytArticles(marker);
		self.displayInfoWindow(marker);
	};

	this.displayInfoWindow = function(marker) {
		var id = marker.id;
		self.configStreetView(model.markers[id]);
		model.infowindow.open(model.map, marker);
	};

	this.displayFilteredMarkers = function() {
		self.toggleShowClass();
		self.closeNytArticles();
		var markers = model.markers;
 		model.bounds = new google.maps.LatLngBounds();
		for (var i=0; i < markers.length; i++) {
			if (markers[i].map) {
				model.bounds.extend(markers[i].position);
			}
		}

		model.map.fitBounds(model.bounds);
	}

	this.locationListListener = function(data) {
		var marker = model.markers[data.id];
		self.closeNytArticles();
		self.populateInfoWindow(marker, model.infowindow);
	};

	this.configStreetView = function(marker) {
		function getStreetView(data, status) {
			if (status == google.maps.StreetViewStatus.OK) {
				var nearStreetViewLocation = data.location.latLng;

				var heading = google.maps.geometry.spherical.computeHeading(
					nearStreetViewLocation, marker.position);

				var panoramaOptions = {
					position: nearStreetViewLocation,
					pov: {
						heading: heading,
						pitch: 30
					}
				}; 
				var panorama = new google.maps.StreetViewPanorama(
					document.getElementById("pano"), panoramaOptions);
			}
			else {
				document.getElementById("pano").innerHTML = "No street view found";
			}
		} 
		
		return model.streetViewService.getPanoramaByLocation(marker.position, 30, getStreetView)
	};

	this.showNytArticles = function(marker) {
		var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
		url += "?" + $.param({
			'api-key': "2954f517830e4fcf9242caa8eef9f2be",
			'q': marker.title
		}); 

		$.getJSON(url, function(data) {
			self.nytHeader("Articles About " + marker.title);
			self.nytArticles([]);
			var items = data.response.docs; 
			for (var i=0; i < items.length; i++) {
				self.nytArticles.push(ko.observable(items[i]));
			};
		});
		$(document.getElementById("nyt-articles")).show();
	}

	this.toggleShowClass = function() {
		$(document.getElementById("options-box")).toggleClass("show");
	}

	this.closeNytArticles = function() {
		$(document.getElementById("nyt-articles")).hide();
	}
};

ViewModel = new ViewModel();
ko.applyBindings(ViewModel);

function initMap() {

	var bounds = new google.maps.LatLngBounds(); 
	var infowindow = new google.maps.InfoWindow(); 
	var streetViewService = new google.maps.StreetViewService();


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

	ViewModel.initMap(map, markers, bounds, infowindow, streetViewService); 
}

