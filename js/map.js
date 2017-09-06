// ------- MODEL ------ //
var model = {
	map: null,
	markers: [],
	polygon: null,
	infowindow: null
};

var locations = [];

var ViewModel = function() {



	function initMap() {
		var center = {lat: 37.3875, lng: -122.0575};
		model.map = new google.maps.Map(document.getElementById("map"), {
			center: center, 
			zoom: 13
		});
	}
	initMap();

	document.getElementById("hamburger-menu").addEventListener("click", function(e) {
		$(document.getElementById("options-box")).toggleClass("hide");
		$(document.getElementById("map")).toggleClass("translate");
		$(document.getElementById("header")).toggleClass("translate");
	});

}; 

