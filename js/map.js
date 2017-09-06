// ------- MODEL ------ //
var model = {
	map: null,
	markers: [],
	polygon: null,
	infowindow: null
};

var locations = [
	{title: "The Tech Museum of Innovation", location: {lat: 37.3316, lng: -121.8901}},
	{title: "Computer History Museum", location: {lat: 37.4143, lng: -122.0774}}, 
	{title: "Happy Hollow Park & Zoo", location: {lat: 37.3257, lng: -121.8614}}, 
	{title: "Children's Discovery Museum of San Jose", location: {lat: 37.3268, lng: -121.8925}}, 
	{title: "Googleplex", location: {lat: 37.4220, lng: -122.0841}}, 
	{title: "Facebook HQ", location: {lat: 37.4847, lng: -122.1477}}, 
	{title: "Tesla, Inc.", location: {lat: 37.394705, lng: --122.150325}}, 
	{title: "Nvidia", location: {lat: 37.370728, lng: -121.963739}}
];

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

