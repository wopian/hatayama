// Google Maps
// Set default parameters as fail safe
// eslint-disable-next-line no-unused-vars
function initialize(latitude = 0, longitude = 0, mapZoom = 9) {
  const pos = new google.maps.LatLng(latitude, longitude),
        options = {
          // center map on latlng
          center:           pos,
          zoom:             mapZoom,
          disableDefaultUI: true,
          mapTypeId:        google.maps.MapTypeId.ROADMAP,
          // Override default styles
          // removes most labels, leaving just town/county names
          styles:           [
            {
              featureType: 'administrative.land_parcel',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'administrative.neighborhood',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'road',
              elementType: 'labels',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'water',
              elementType: 'labels.text',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            }
          ]
        },
        // eslint-disable-next-line no-unused-vars
        map = new google.maps.Map(document.getElementById('map'), options);
}
