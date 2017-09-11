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
	var bounds = new google.maps.LatLngBounds();
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
			this.marker = null;
		});

		infowindow.setContent("<strong>" + marker.title + "</strong>"); 
			infowindow.open(map, marker);
	} 
}

document.getElementById("hamburger-menu").addEventListener("click", function(e) {
	$(document.getElementById("options-box")).toggleClass("hide");
	$(document.getElementById("map")).toggleClass("translate");
	$(document.getElementById("header")).toggleClass("translate");
});
