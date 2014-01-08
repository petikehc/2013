var map;
var currentZoom = 12;
var isScreenSmallPortrait;

function windowResponsiveResize () {
	
	isScreenSmallPortrait = window.matchMedia("(orientation: portrait) and (max-width: 769px)").matches;
	
	if (!isScreenSmallPortrait) {
		console.log("nagy");
		$("nav").height($(window).height());
		$("div#container:last-child").css("margin-bottom", 0);
	}
	else {
		$("nav").height($(window).height()*0.263); 
		$("div#container:last-child").css("margin-bottom", $(window).height()*0.263);
	};

	$("#map-canvas").css({"height":"100%", "width":"100%"});
}

function mapRelocate (i) {
	console.log('maprelocate', i);
	var lat = (photos[i].latlong[0]);
	var lng = (photos[i].latlong[1]);
	var newLatLng = new google.maps.LatLng(lat,lng);
	map.panTo(newLatLng);
}

function scrollHandler (e) {
	
	var scrollUp = e.currentTarget.window.scrollY; // top of the visible area in the browser - source of IE bug
	var isScrolledToBottom = $("#container").height() == (scrollUp + $(window).height());
	var imageCount = $("section").length;
	var visibleImagesArray = [];

	// search for visible items based on rendered position:

	for (var i = 0; i < imageCount; i++) {
		var currentPos = $("#sec"+i).position();
		var currentTop = currentPos.top;
		var currentHeight = $("#sec" + i).height();
		var currentBottom = currentTop + currentHeight;

		var visible = ( !(currentBottom-scrollUp < 0 && currentTop-scrollUp < 0) &&
			!( currentBottom > (scrollUp + $(window).height()) && currentTop > (scrollUp + $(window).height()) ) )
		console.log(i, currentTop, currentBottom, scrollUp, scrollUp + $(window).height());
		if (visible) {
			var currentImg = {
				"index": i, 
				"top": currentTop, 
				"bottom": currentBottom, 
				"scrollTop": scrollUp, 
				"scrollBottom": (scrollUp + window.innerHeight)
			};

			visibleImagesArray.push(currentImg);
		}

	}

	console.log(visibleImagesArray[0].scrollBottom);
	
	// search for maximum visibility amongst visible items only:

	var maxPercentage = 0;
	var maxIndex = -1;
	for (var j = 0, len = visibleImagesArray.length; j < len; j++) {
		var height = $("#sec" + visibleImagesArray[j].index).height();
		var percentagePos = (visibleImagesArray[j].scrollBottom - visibleImagesArray[j].top) / height;
		var percentageNeg = (visibleImagesArray[j].bottom - visibleImagesArray[j].scrollTop) / height;

		var percentage = 0;

		if (percentageNeg < percentagePos) {
			percentage = percentageNeg;
		} 
		else {
			percentage = percentagePos;
		};

		if (percentage > maxPercentage) {
			maxPercentage = percentage;
			maxIndex = visibleImagesArray[j].index;
		};

		// console.log(maxIndex); //-1 always in IE??
	};

	mapRelocate(maxIndex);
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
	
	if (!isScreenSmallPortrait) {
		$("nav").height($(window).height());
	};
	

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
		zoom: currentZoom,
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

	if (isScreenSmallPortrait) {
		$("div#container:last-child").css("margin-bottom", $(window).height()*0.263);
	};
}


function initialize() {

	isScreenSmallPortrait = window.matchMedia("(orientation: portrait) and (max-width: 769px)").matches;

	renderPhotos();
	var placeInit = [-34.671529,150.861336];
	firstMapLoad(placeInit);
	console.log(photos[0].latlong[0]);
	$(window).resize(windowResponsiveResize);
	$(window).scroll(scrollHandler);

}
	
$(document).ready(initialize);
