function initialize(latitude, longitude, mapZoom) {
  const pos = new google.maps.LatLng(latitude, longitude),
        options = {
          center:           pos,
          zoom:             mapZoom,
          disableDefaultUI: true,
          mapTypeId:        google.maps.MapTypeId.ROADMAP,
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
