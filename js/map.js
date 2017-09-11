// ------- MODEL ------ //
var model = {
	map: null,
	markers: [],
	polygon: null,
	infowindow: null,
	bounds: null
};

var ViewModel = function() {

	var bounds = new google.maps.LatLngBounds(); 

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

	function initMap() {
		
		var center = {lat: 37.3875, lng: -122.0575};
		model.map = new google.maps.Map(document.getElementById("map"), {
			center: center, 
			zoom: 13
		});
		
		var marker;

		var infowindow = new google.maps.InfoWindow();

		for (var i=0; i < locations.length; i++) {
			
			var location = locations[i];

			marker = new google.maps.Marker({
				title: location.title,
				position: location.position
			});
			
			model.markers.push(marker);
			
			marker.addListener("click", function() {
				displayInfoWindow(infowindow, this);
			});

			showLocations();

		}
	}
	

	function showLocations() {
		var length = model.markers.length;
	
		var marker;
		
		for (var i=0; i < length; i++) {
			marker = model.markers[i]; 
			marker.setMap(model.map)
			bounds.extend(marker.position);
		}
		model.map.fitBounds(bounds);
	}

	function displayInfoWindow(infowindow, marker) {
		if (infowindow.marker != marker) {
			infowindow.marker = marker;

			infowindow.addListener("closeclick", function() {
				this.setMarker(null);
			});

			infowindow.setContent("<strong>" + marker.title + "</strong>"); 
				infowindow.open(map, marker);
		} 
	}

	initMap();

	document.getElementById("hamburger-menu").addEventListener("click", function(e) {
		$(document.getElementById("options-box")).toggleClass("hide");
		$(document.getElementById("map")).toggleClass("translate");
		$(document.getElementById("header")).toggleClass("translate");
	});
}; 