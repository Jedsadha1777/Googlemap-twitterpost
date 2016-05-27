// JavaScript Document
var jQ = jQuery.noConflict();
var inpLocation = '13.746829,100.534919';
var map;
var markers = [];
var map_zoom = 11;

function clearMarker(){
    for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
     }
      markers = [];
}

function addMarker(arr_marker){
	
	if (arr_marker.length){	
	
		var can = jQ("#map_playground"),
			wid = can.width(),
			hei = can.height(),
			numPlatforms = arr_marker.length,
			platWid = 50,
			platHei = 50,
			platforms = [],
			hash = {};
	    var infowindow = [];
		  var marker = [];
		  clearMarker();
					
		for(var i = 0; i < numPlatforms; i++){
		
		  _pos_img = arr_marker[i][1];		 
			var lat = parseFloat(arr_marker[i][4]);
			var long =  parseFloat(arr_marker[i][5]);
			infowindow[i] = new google.maps.InfoWindow({content: 'Tweet : '+arr_marker[i][2]+'<br/>When : '+arr_marker[i][3] });
		 	marker[i] = new google.maps.Marker({map: map, icon : { url : _pos_img , shape:{type:'circle'},}, infoWindowIndex  : i});
			marker[i].setPosition(new google.maps.LatLng( parseFloat(arr_marker[i][4]),parseFloat(arr_marker[i][5]) ));

			console.log(_pos_img);
			
		  marker[i].addListener('click', function() {										   
				infowindow[this.infoWindowIndex].open(map, marker[this.infoWindowIndex]);
			});

      marker[i].setMap(map);
		  markers.push( marker[i] );
		}
	}
} // Add Marker

function postMarker(getlocation){
	
	try {
	
		jQ.post("process/feed_twitter.php", {'inp_geocode' : getlocation }, function( json ) {
			
			var data_feed  = jQ.parseJSON( json);
			var arr_marker = [];
			
			if (data_feed){
			
				if ( (data_feed.statuses).length > 0){
					
					for ( i = 0; i< (data_feed.statuses).length; i++){
						
						pos_msg = data_feed.statuses[i].text;
						pos_time = data_feed.statuses[i].created_at ;
						pos_profile_img = data_feed.statuses[i].user.profile_image_url;
						pos_name = data_feed.statuses[i].user.name ;
						
						if ( data_feed.statuses[i].place){
							var lat =  data_feed.statuses[i].place.bounding_box.coordinates[0][0][1];
							var long =  data_feed.statuses[i].place.bounding_box.coordinates[0][0][0];
							arr_marker.push([pos_name,pos_profile_img,pos_msg,pos_time,lat,long]);
						} //find place
						
					}
					addMarker(arr_marker);
				}
			}
		});
	}
	catch(err) {
		console.log(err.message);
	}
}

jQ(document).ready( function(){
				
	jQ(".box_search").find("input, button").filter(':submit').click(
	function(event) {
		event.preventDefault();
	});
	
	var myOptions = { center: new google.maps.LatLng(13.746829,100.534919), zoom: map_zoom,  mapTypeId: google.maps.MapTypeId.ROADMAP ,styles : [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#120d19"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#efefef"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#7a7a7a"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#7a7a7a"},{"lightness":25}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#7a7a7a"},{"lightness":70}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#353535"}]}]};
	var map_canvas = document.getElementById('map_playground');
  
  map = new google.maps.Map(map_canvas,myOptions);

	/* get geolocation */
	
	if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            
			inpLocation = position.coords.latitude+','+position.coords.longitude ;
          map.setCenter(pos);
      }, function() {
        //handleLocationError
      });
  } else {
      //handleLocationError
	}
	/* end get geolocation */	
	
	postMarker(inpLocation);
	
	/* search Location */
	var input = document.getElementById('inp_search');
  var autocomplete = new google.maps.places.Autocomplete(input);
	autocomplete.bindTo('bounds', map);
	
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
	  var place = autocomplete.getPlace();
	  if (place.geometry.viewport) {
		  map.fitBounds(place.geometry.viewport);
	  } else {
		  map.setCenter(place.geometry.location);
		  map.setZoom(map_zoom);  
	  }
	  
	  jQ('.tweets_area').html( 'TWEETS ABOUT '+place.name);
	  
	  inpLocation = place.geometry.location;
	  var _replaceList = ['(',')',' '];	  
	  
	  for (i = 0 ; i < _replaceList.length ; i++){
		  inpLocation = inpLocation.toString().replace(_replaceList[i],''); 
	  }
	  
	  inpLocation = inpLocation.toString().replace('%2C',',');
	  postMarker(inpLocation);
  });
	/* end search location */
	
}); //docReady
