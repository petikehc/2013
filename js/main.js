var map;

var currentZoom;


function zoomOut () {
	while (currentZoom>7) {
		map.setZoom(currentZoom);
		console.log("zoom out is " + currentZoom);
		currentZoom--;
	}
}

function zoomIn () {
	while (currentZoom<12) {
		map.setZoom(currentZoom);
		console.log("zoom in is " + currentZoom);
		currentZoom++;
	}

}


function mapRelocate (i) {
	var lat = photos[i].latlong[0];
	var lng = photos[i].latlong[1];
	var newLatLng = new google.maps.LatLng(lat,lng);
	map.panTo(newLatLng);
}


function scrollHandler (e) {
	var scrollUp = e.currentTarget.window.scrollY; // top of the visible area in the browser
	var scrollDown = $(window).height() + scrollUp; // bottom of the visible area in the browser

	currentZoom = map.getZoom();

	$("section").each(function(index) {
		var currentPos = $(this).position(); // image position on the rendered page
		var currentBottom = currentPos.top + $(this).height();

		var ratio = (scrollDown - currentPos.top)/$(this).height(); // the ratio of visibility that triggers the map
		
		if (scrollUp <= currentPos.top && scrollDown >= currentBottom) { // this is the option when only one image is fully visible
			// zoomOut();
			var timer = window.setTimeout(zoomOut, 2000);
			// clearInterval(timer);
			mapRelocate(index);
			// zoomIn();
			var timer2 = window.setTimeout(zoomIn, 2000);
			// clearInterval(timer2);
		}
		else if (scrollUp <= currentPos.top && scrollDown < currentBottom && ratio > 0.7) { // this is the option when an image is not compeletly visible, some parts get hidden
			mapRelocate(index);
		}
		
	})


}

function placeMarkers() {

	for (var i = 0, len = photos.length; i < len; i++) {
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(photos[i].latlong[0],photos[i].latlong[1]),
			map: map,
			icon: "img/marker-32.ico",
			title: photos[i].title
		});
	};
}

function firstMapLoad (currentPlace) {
	
	$("nav").height($(window).height());

	var MY_MAPTYPE_ID = 'custom_style';
	var featureOpts = [
		{
			"featureType": "water",
			"stylers": [
				{ "hue": "#00ffcc" },
				{ "saturation": -47 },
				{ "lightness": -24}
			]
		},{
			"featureType": "landscape",
			"stylers": [
				{ "hue": "#4cff00" },
				{ "lightness": -33},
				{ "gamma": 1.04 }
			]
		},{
			"featureType": "road",
			"stylers": [
				{ "hue": "#ffa200" },
				{ "weight": 0.4 }
			]
		},{
			"featureType": "poi",
			"elementType": "labels",
			"stylers": [
				{ "hue": "#00ff6f" },
				{ "lightness": -28 }
			]
		},{
			"featureType": "administrative",
			"stylers": [
				{ "hue": "#0077ff" },
				{ "lightness": -20 },
				{ "gamma": 1.33 }
			]
		}
	]
	
	var styledMapOptions = {
		name: 'Custom Style'
	};

	var mapOptions = {
		zoom: 12,
		center: new google.maps.LatLng(currentPlace[0],currentPlace[1]),
		panControl: false,
		zoomControl: false,
		mapTypeControl: false,
		scaleControl: false,
		streetViewControl: false,
		overviewMapControl: false,
		disableDoubleClickZoom: true,
		draggable: false,
		scrollwheel: false,
		mapTypeControlOptions: {
			mapTypeIds: [
				google.maps.MapTypeId.ROADMAP,
				MY_MAPTYPE_ID
			]
		},
		mapTypeId: MY_MAPTYPE_ID
	};

	var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
	placeMarkers();
}

function renderPhotos() {

	for (var i = 0, len = photos.length; i < len; i++) {
		var photoSec = document.createElement("section");
		$(photoSec).html("<img src='" + photos[i].url + "' alt= '" + photos[i].description + "'>")
		.attr("id", "sec"+i);
		var desc = document.createElement("div");
		$(desc).html(photos[i].title).addClass("photo-description");	
		$(desc).appendTo($(photoSec));			
		$(photoSec).appendTo($("#container"));
	};
}


function initialize() {
	renderPhotos();
	var placeInit = [-33.887054,151.198329];
	firstMapLoad(placeInit);
	$(window).resize(function() { 
		$("nav").height($(window).height()); 
		$("#map-canvas").css({"height":"100%", "width":"100%"});
	});
	$(window).scroll(scrollHandler);

	// var visi = checkVisibility($("#sec1"));
	// console.log(visi);


}
	
$(document).ready(initialize);
