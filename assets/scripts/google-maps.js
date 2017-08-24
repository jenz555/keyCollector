var googleMaps = function () {

  'use strict';

  var init = () => {
    var maps = document.querySelectorAll('.google-map');
    for (var i = 0; i < maps.length; i++) {
      createMap(maps[i], i);
    }
  };

  var createMap = (map, i) => {
          
    var mapId = `google-map-${i}`;
    var config = JSON.parse(map.innerText);
    var mapContainer = document.createElement('div');
    var map, street;

    this.renderMap = () => {
      map = new google.maps.Map(document.getElementById(mapId), config.mapOptions);
      if (config.locations && config.locations.length) {
        createMarkers();
      }
    };

    var renderStreet = () => {
      street = new google.maps.StreetViewPanorama(mapContainer, config.streetOptions);
    };

    var createMarkers = () => {
      if (config.allowClusters) {
        var markers = config.locations.map(function(location, i) {
          var marker = new google.maps.Marker({ position: location });
          if (config.infoWindowTemplateId) {
            createInfoWindow(marker, location);
          }
          return marker;
        });
        var markerCluster = new MarkerClusterer(map, markers,
          {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
      } else {
        config.locations.forEach((location) => {
          var marker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'map marker'
          });
          if (config.infoWindowTemplateId) {
            createInfoWindow(marker, location);
          }
        });
      }
    };

    var createInfoWindow = (marker, location) => {
      if (location.infoWindowContent) {
        
        String.prototype.template = template.asMethod;

        var infoWindowTemplate = document.querySelector(`#${config.infoWindowTemplateId}`).innerText;
        
        var infowindow = new google.maps.InfoWindow({
          content: infoWindowTemplate.template(location.infoWindowContent)
        });
        
        marker.addListener('click', function() {
          infowindow.open(map, marker);
        });
      }
    };

    mapContainer.id = mapId;
    mapContainer.style = `min-height: ${config.minHeight || '100%'}`;
    mapContainer.innerText = 'LOADING MAP...';
    map.parentNode.replaceChild(mapContainer, map);
    
    if (config.mapType === 'street') {
      renderStreet();
    } else {
      renderMap();
    }
  };

  return init();

};