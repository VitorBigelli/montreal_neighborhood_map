function initMap()  {
	model.map = new google.maps.Map(document.getElementById("map"), {
		center: {lat: 37.3875, lng: -122.0575}, 
		zoom: 13
	});
	
	var makeMarkerIcon = function(color) {
		var markerImage = new google.maps.MarkerImage(
			'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' +
			color + '|40|_|%E2%80%A2',
			new google.maps.Size(21,34), 
			new google.maps.Point(0,0),
			new google.maps.Point(10,34),
			new google.maps.Size(21,34));
			return markerImage;		
	};

	ViewModel.highlightedIcon = makeMarkerIcon("ffffff");
	ViewModel.defaultIcon = makeMarkerIcon("ee3333");
	populateMap();

	// Function to change marker color

}

function populateMap() {
	
	var locations = ViewModel.filteredLocations();
	var location;

	for (var i=0; i < locations.length; i++) {
	
		location = locations[i];

		marker = new google.maps.Marker({
			title: location.title,
			position: location.position,
			infowindow: new google.maps.InfoWindow(),
			location: location,
			icon: ViewModel.defaultIcon
		});
		
		model.markers.push(marker);
		
		marker.addListener("click", function() {
			ViewModel.displayInfoWindow(this.location);
		});
	}
	showLocations();
}

function showLocations() {
	var length = model.markers.length;
	model.bounds = new google.maps.LatLngBounds();
	var marker;
	
	for (var i=0; i < length; i++) {
		marker = model.markers[i]; 
		marker.setMap(model.map)
		model.bounds.extend(marker.position);
	}

	model.map.fitBounds(model.bounds);
}

document.getElementById("hamburger-menu").addEventListener("click", function(e) {
	$(document.getElementById("options-box")).toggleClass("hide");
	$(document.getElementById("map")).toggleClass("translate");
	$(document.getElementById("header")).toggleClass("translate");
});

