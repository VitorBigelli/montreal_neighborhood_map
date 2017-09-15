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
	// Creating observable objects
	this.locations = ko.observableArray([]); 
	this.filter = ko.observable("");
	this.nytArticles = ko.observableArray([]);
	this.nytHeader = ko.observable("");

	// Pushing the locations into an observableArray
	for (var i=0; i < locations.length; i++) {
		var location = locations[i];
		self.locations.push({
			title: location.title,
			position: location.position, 
			id: i
		});
	};

	// This function display all the markers
	this.displayAllMarkers = function() {
		for (var i=0; i < model.markers.length; i++) {
			self.displayMarker(model.markers[i]);
			model.bounds.extend(markers[i].position);
		}
	};

	// This function takes a marker as parameter
	// and display it on the map
	this.displayMarker = function(marker) {
		marker.setMap(model.map);
	};

	// This functio takes a marker id as paramenter
	// and removes that marker from the map
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
			} else {
				self.displayMarker(model.markers[location.id]);
			}
			return hasString;
		});
	});

	// This function takes a marker as parameter and 
	// stores it in the model
	this.storeMarker = function(marker) {
		model.markers.push(marker);
	};

	// This function is called by the initMap global function
	// It takes all the google.maps objects created and store them
	// in the model. Than call the displayMarkers() function
	this.initMap = function(map, markers, bounds, infowindow, streetViewService) {
		model.map = map; 
		model.markers = markers; 
		model.bounds = bounds;
		model.infowindow = infowindow; 
		model.streetViewService = streetViewService
		self.displayFilteredMarkers();
	};

	// This function returns the stored markers
	this.getMarkers = function() {
		return model.markers;
	};

	// This function display the markers based on the filteredLocations
	// computed array  
	this.displayFilteredMarkers = function() {
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

	// This function populates the infowindow with unique information
	// about the location
	this.populateInfoWindow = function(marker) {
		if (model.infowindow.marker != marker) {
			model.infowindow.marker = marker;
			marker.infowindow = model.infowindow;
			model.infowindow.setContent("<div class='infowindow'>" + marker.title + "</div><div id='pano'></div>");

			//Listener to close the NYTimes articles when the respective
			//infowindow is closed.
			model.infowindow.addListener("closeclick", function() {
				self.closeNytArticles();
				self.selectedMarker.setAnimation(null);
			});
		}
		self.showNytArticles(marker);
		self.displayInfoWindow(marker);
	};

	this.selectedMarker = null;

	// This function displays the infowindow
	this.displayInfoWindow = function(marker) {
		var id = marker.id;
		self.configStreetView(model.markers[id]);

		if (self.selectedMarker != marker && self.selectedMarker != null) {
			self.selectedMarker.setAnimation(null);
		}
			self.selectedMarker = marker;
			self.selectedMarker.setAnimation(google.maps.Animation.BOUNCE);
		model.infowindow.open(model.map, marker);
	};

	// This function update the bounds of the map when 
	// the filter button is clicked
	this.filterMarkers = function() {
		self.toggleShowClass();
		self.closeNytArticles();
 		model.bounds = new google.maps.LatLngBounds();
		self.displayFilteredMarkers();
	}

	// This function call the populateIndoWindow function
	// when a location is clicked on the list
	this.locationListListener = function(data) {
		var marker = model.markers[data.id];
		self.closeNytArticles();
		self.populateInfoWindow(marker, model.infowindow);
	};

	// This function configures the GoogleStreetView Service
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

	// This function show the New York Times articles for selected
	// location
	this.showNytArticles = function(marker) {
		var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
		url += "?" + $.param({
			'api-key': "2954f517830e4fcf9242caa8eef9f2be",
			'q': marker.title
		}); 

		$.getJSON(url, function(data) {
			self.nytHeader("New York Times articles about " + marker.title);
			self.nytArticles([]);
			var items = data.response.docs; 
			for (var i=0; i < items.length; i++) {
				self.nytArticles.push(ko.observable(items[i]));
			};
			if (!self.nytArticles().length) {
				var error = { 
					headline: { 
						main: "Not Found"
					},
					snippet: "New York Times Articles Could Not Be Loaded",
					web_url: "#"
				}

				self.nytArticles.push(ko.observable(error));
			}
		})

		$(document.getElementById("nyt-articles")).show();
	}

	// Change the visibility of the options-box
	this.toggleShowClass = function() {
		$(document.getElementById("options-box")).toggleClass("show");
	}

	// Change the visibility of the NYTImes
	this.closeNytArticles = function() {
		$(document.getElementById("nyt-articles")).hide();
	}
};

ViewModel = new ViewModel();
ko.applyBindings(ViewModel);


// This function is called when the Google Maps API is loaded
// It creates all the necessary google.maps objects and 
// call ViewModel functions to store them in the model
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
			id: locations[i].id,
		}); 
		marker.addListener("click", function(marker) {
			ViewModel.populateInfoWindow(this);
		});

		ViewModel.storeMarker(marker);
	}

	var markers = ViewModel.getMarkers();

	ViewModel.initMap(map, markers, bounds, infowindow, streetViewService); 
}

