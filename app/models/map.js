function initialize() {
  const pos = new google.maps.LatLng(51.333333, -1.916667),
        options = {
          center:           pos,
          zoom:             9,
          disableDefaultUI: true,
          mapTypeId:        google.maps.MapTypeId.ROADMAP,
          styles:           [
            {
              featureType: 'administrative',
              stylers:     [
                {
                  color: '#af2727'
                },
                {
                  visibility: 'simplified'
                }
              ]
            },
            {
              featureType: 'administrative',
              elementType: 'labels.text.fill',
              stylers:     [
                {
                  color: '#444444'
                }
              ]
            },
            {
              featureType: 'administrative.country',
              elementType: 'geometry.stroke',
              stylers:     [
                {
                  visibility: 'on'
                },
                {
                  weight: 0.5
                }
              ]
            },
            {
              featureType: 'administrative.locality',
              stylers:     [
                {
                  visibility: 'simplified'
                },
                {
                  weight: 0.5
                }
              ]
            },
            {
              featureType: 'administrative.province',
              elementType: 'geometry.stroke',
              stylers:     [
                {
                  visibility: 'on'
                },
                {
                  weight: 0.5
                }
              ]
            },
            {
              featureType: 'landscape',
              stylers:     [
                {
                  color: '#ebe4d8'
                },
                {
                  visibility: 'on'
                }
              ]
            },
            {
              featureType: 'landscape',
              elementType: 'labels',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'landscape.natural',
              elementType: 'geometry.fill',
              stylers:     [
                {
                  color: '#a6d0a7'
                },
                {
                  visibility: 'on'
                }
              ]
            },
            {
              featureType: 'landscape.natural.terrain',
              elementType: 'geometry.fill',
              stylers:     [
                {
                  color: '#a6d0a7'
                },
                {
                  visibility: 'on'
                }
              ]
            },
            {
              featureType: 'poi',
              stylers:     [
                {
                  color: '#e2d9c9'
                },
                {
                  visibility: 'simplified'
                }
              ]
            },
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'poi.park',
              stylers:     [
                {
                  color: '#a6d0a7'
                },
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers:     [
                {
                  color: '#a6d0a7'
                },
                {
                  visibility: 'simplified'
                }
              ]
            },
            {
              featureType: 'road',
              stylers:     [
                {
                  color: '#ffcfcf'
                },
                {
                  saturation: -100
                },
                {
                  lightness: 45
                },
                {
                  visibility: 'simplified'
                }
              ]
            },
            {
              featureType: 'road',
              elementType: 'labels.text',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'road.arterial',
              stylers:     [
                {
                  color: '#ffffff'
                },
                {
                  visibility: 'simplified'
                },
                {
                  weight: 0.5
                }
              ]
            },
            {
              featureType: 'road.arterial',
              elementType: 'geometry',
              stylers:     [
                {
                  visibility: 'simplified'
                }
              ]
            },
            {
              featureType: 'road.arterial',
              elementType: 'labels',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'road.highway',
              stylers:     [
                {
                  color: '#ffffff'
                },
                {
                  visibility: 'simplified'
                }
              ]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers:     [
                {
                  visibility: 'simplified'
                }
              ]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'road.highway.controlled_access',
              stylers:     [
                {
                  color: '#ffffff'
                },
                {
                  visibility: 'simplified'
                }
              ]
            },
            {
              featureType: 'road.highway.controlled_access',
              elementType: 'geometry',
              stylers:     [
                {
                  visibility: 'simplified'
                },
                {
                  weight: 0.5
                }
              ]
            },
            {
              featureType: 'road.highway.controlled_access',
              elementType: 'labels',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'road.local',
              stylers:     [
                {
                  hue: '#ff0000'
                },
                {
                  visibility: 'simplified'
                }
              ]
            },
            {
              featureType: 'road.local',
              elementType: 'geometry',
              stylers:     [
                {
                  visibility: 'simplified'
                },
                {
                  weight: 0.5
                }
              ]
            },
            {
              featureType: 'road.local',
              elementType: 'labels',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'transit',
              stylers:     [
                {
                  color: '#ffffff'
                },
                {
                  visibility: 'simplified'
                }
              ]
            },
            {
              featureType: 'transit',
              elementType: 'labels.text',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'transit.line',
              elementType: 'geometry',
              stylers:     [
                {
                  visibility: 'simplified'
                }
              ]
            },
            {
              featureType: 'transit.line',
              elementType: 'labels',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'transit.station',
              stylers:     [
                {
                  visibility: 'off'
                }
              ]
            },
            {
              featureType: 'water',
              stylers:     [
                {
                  color: '#75d9d1'
                },
                {
                  visibility: 'on'
                }
              ]
            }
          ]
        },
        // eslint-disable-next-line no-unused-vars
        map = new google.maps.Map(document.getElementById('map'), options);
}
google.maps.event.addDomListener(window, 'load', initialize);
