// ------- MODEL ------ //
var map; 
var markers; 
var polygon;
var infowindow;

function initMap() {
	var center = {lat: 37.3875, lng: -122.0575};
	map = new google.maps.Map(document.getElementById("map"), {
		center: center, 
		zoom: 13
	});
}


var ViewModel = function() {

}; 

ko.applyBindings(ViewModel);