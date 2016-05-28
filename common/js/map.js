// JavaScript Document

/* Setting */
var default_geo_lat = 13.746829;
var default_geo_long = 100.534919;

var map_zoom = 11;
var txt_tweets_about = 'TWEETS ABOUT ';
var build_target_id = 'map_playground';
var inp_search_id = 'inp_search';

var tweets_text_area = '.tweets_area';
var tweets_distance  = 50;  //kg

var map_template = [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#120d19"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#fefefe"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#fefefe"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#efefef"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#f5f5f5"},{"lightness":21}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#dedede"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#7a7a7a"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#ffffff"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#7a7a7a"},{"lightness":25}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#7a7a7a"},{"lightness":70}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#f2f2f2"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#353535"}]}] ;

var jQ = jQuery.noConflict();
var inpLocation =  default_geo_lat+','+default_geo_long;
var map;
var markers = [];

function clearMarker(){

    for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
    }
    markers = [];
}

function addMarker(arr_marker){
	
	if (arr_marker.length){		
	
		var can = jQ("#"+build_target_id),
			wid = can.width(),
			hei = can.height(),
			numPlatforms = arr_marker.length,
			platWid = 50,
			platHei = 50,
			platforms = [],
			hash = {};
					
	    var infowindow = [];
		var marker = []
		
		clearMarker();
					
		for(var i = 0; i < numPlatforms; i++){
			  
			_pos_img = arr_marker[i][1];		 
		  
			var lat = parseFloat(arr_marker[i][4]);
			var long =  parseFloat(arr_marker[i][5]);
					
			infowindow[i] = new google.maps.InfoWindow({content: 'Tweet : '+arr_marker[i][2]+'<br/>When : '+arr_marker[i][3] });
			
			if (_pos_img != ''){
				_pos_img = 'images/?href='+_pos_img;	
			}
			
		 	marker[i] = new google.maps.Marker({ map: map, icon : _pos_img ,			
							    animation: google.maps.Animation.DROP, 
							    infoWindowIndex  : i , 
							    position: new google.maps.LatLng( parseFloat(arr_marker[i][4]),parseFloat(arr_marker[i][5]) )
							   });
				
			marker[i].addListener('click', function() {		
													  
				for (j = 0; j < numPlatforms ; j++){
					infowindow[j].close();
			  	}

                 		infowindow[this.infoWindowIndex].open(map, marker[this.infoWindowIndex]);
			 
			});

      		  	marker[i].setMap(map);
			markers.push( marker[i] );

		}
	}
}


function postMarker(getlocation){
	
	try {
				
		var infowindow = new google.maps.InfoWindow();
  		
		jQ.post("process/feed_twitter.php", {'inp_geocode' : getlocation , 
						     'distance' : tweets_distance }, function( json ) {
			
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
						}
					}
					addMarker(arr_marker);
				}
			}
	
		});
		
	}
	catch(err) {
	}
	
}

function template_resize(){
	var _win_height = jQ(window).height()
	var _footer_height = jQ('header').height();
	jQ('div.content,#'+build_target_id).height( _win_height - _footer_height);
	console.log( jQ('div.content,#'+build_target_id).height() );	
}

function responsive_template_setting(){
	google.maps.event.addDomListener(window, "resize", function() {
		var center = map.getCenter();
		google.maps.event.trigger(map, "resize");
		map.setCenter(center); 
	});
	
	/* view didload */
	template_resize();
	
	/* page config */
	jQ(window).resize( function(){
		template_resize();
	} );
}

jQ(document).ready( function(){
	
	/* view did load */		
	jQ(".box_search").find("input, button").filter(':submit').click(
	function(event) {
		event.preventDefault();
	});
	
	var myOptions = { center: new google.maps.LatLng(default_geo_lat,default_geo_long), 
	                  zoom: map_zoom,  
					  mapTypeId: google.maps.MapTypeId.ROADMAP ,
					  styles : map_template};
	
	var map_canvas = document.getElementById(build_target_id);
    map = new google.maps.Map(map_canvas,myOptions);
	
	/* get geolocation - optional */	
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
	/* end get geolocation - optional */
	
	jQ.post("http://maps.googleapis.com/maps/api/geocode/json?latlng="+inpLocation, function( json ) {
																							 
		if ( (json.results).length > 0){
		
		    place_id =   json.results[0].place_id;	
			
			address_list = json.results[0].address_components;
			
			if (address_list.length){
			
				for (i = 0 ; i < address_list.length ; i++){
					
					if ( address_list[i].types[0] ==  'locality'){						
						jQ(tweets_text_area).html( txt_tweets_about+address_list[i].long_name);
					}
				}
			}			
		}
	});
		
	postMarker(inpLocation);
	/* end view did load */
	
	/* search by click button */
	jQ('.btn_search').click( function(){
		if (jQ.trim( jQ('#'+inp_search_id).val()) != ''){
			
			txt_address = jQ.trim(jQ('#'+inp_search_id).val());
			
			jQ.post("http://maps.googleapis.com/maps/api/geocode/json?address="+txt_address, function( json ) {
										 
				if ( (json.results).length > 0){
				
					place_id =   json.results[0].place_id;	
					
					address_list = json.results[0].address_components;
					
					if (address_list.length){
						
            			map.setCenter({lat:json.results[0].geometry.location.lat , lng :json.results[0].geometry.location.lng });
						map.setZoom(map_zoom);
						
						inpLocation = json.results[0].geometry.location.lat + ',' +json.results[0].geometry.location.lng
						postMarker(inpLocation);
						
						for (i = 0 ; i < address_list.length ; i++){
							
							if ( (address_list[i].types[0] ==  'locality') || 
							     (address_list[i].types[0] ==  'administrative_area_level_1') ){
								
								jQ(tweets_text_area).html( txt_tweets_about+address_list[i].long_name);
	
							}
							
						}
					}					
				}
			});
		}	
	});
	/* end search by click button */
	

	/* search Location autocomplete - optional */
	var input = document.getElementById(inp_search_id);
	
	var options = {
        types: ['(cities)'],
        componentRestrictions: { country: 'th' }
    };
	
    var autocomplete = new google.maps.places.Autocomplete(input,options);
		
	autocomplete.bindTo('bounds', map);
	
	google.maps.event.addListener(autocomplete, 'place_changed', function() {
	  var place = autocomplete.getPlace();
	  if (place.geometry.viewport) {
		map.fitBounds(place.geometry.viewport);
	  } else {
		map.setCenter(place.geometry.location);
		map.setZoom(map_zoom);  		
	  }	  
	  	  
	  jQ(tweets_text_area).html( txt_tweets_about+place.name);
	  
	  inpLocation = place.geometry.location;
	  
	  var _replaceList = ['(',')',' '];	  
	  
	  for (i = 0 ; i < _replaceList.length ; i++){
		  inpLocation = inpLocation.toString().replace(_replaceList[i],''); 
	  }
	  
	  inpLocation = inpLocation.toString().replace('%2C',',');	  
	  postMarker(inpLocation);	  

     });
	/* end search location - optional */
	
	/* responsive page setting */
	responsive_template_setting();
	
}); //docReady
