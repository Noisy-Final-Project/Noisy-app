import { MAPS_API_KEY } from '../../ENV.json'

export default `

<!DOCTYPE html>
<html class='use-all-space'>

<head>
    <meta http-equiv='X-UA-Compatible' content='IE=Edge' />
    <meta charset='UTF-8'>
    <title>Maps SDK for Web - Vector map</title>
    <meta name='viewport' content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no' />
    <link rel='stylesheet' type='text/css' href='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.20.0/maps/maps.css'>
    <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.20.0/maps/maps-web.min.js"></script>

    <style>
        .marker-icon {
            background-position: center;
            background-size: 22px 22px;
            border-radius: 50%;
            height: 22px;
            left: 4px;
            position: absolute;
            text-align: center;
            top: 3px;
            transform: rotate(45deg);
            width: 22px;
        }

        [class$="marker"] {
            height: 30px;
            width: 30px;
        }

        .marker-content {
            background: #c30b82;
            border-radius: 50% 50% 50% 0;
            height: 30px;
            left: 50%;
            margin: -15px 0 0 -15px;
            position: absolute;
            top: 50%;
            transform: rotate(-45deg);
            width: 30px;
        }

        .marker-content::before {
            background: #ffffff;
            border-radius: 50%;
            content: "";
            height: 24px;
            margin: 3px 0 0 3px;
            position: absolute;
            width: 24px;
        }

        .button {
            border: none;
            color: rgb(43, 199, 230);
            padding: 10px 23px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
        }
    </style>

</head>

<script language="javascript" type="text/javascript">
    function resizeIframe(obj) {
        obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
        obj.style.width = obj.contentWindow.document.body.scrollWidth + 'px';
    }
</script>

<body>
    <script src='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.20.0/services/services-web.min.js'></script>

    <div style="width:100vw; height: 100vh;" id='map'></div>

    <script id="mapScript">
        let currentMarkers = {}

        const sendToApp = async (type, jsonObject) => {
            const message = {
                type,
                body: jsonObject
            }
            if (window.ANDROID) {
                window.ReactNativeWebView.postMessage(JSON.stringify(message))
            }
            else {
                window.parent.postMessage(message)
            }
        }

        var map = tt.map({
            key: '${MAPS_API_KEY}',
            container: 'map',
            basePath: 'sdk/',
            center: [35.20326327116519, 32.10054427042954], // Ariel
            zoom: 5,
            theme: {
                style: 'buildings',
                layer: 'basic',
                source: 'vector'
            }
        });
        sendToApp('getLocation', {})

        map.addControl(new tt.NavigationControl());

        map.on('click', 'POI', handlePoiClick);
        map.on('click', (e) => console.log('CLICKED: ' + e.lngLat));
        map.on('idle', () => {
            fetch('http://192.168.31.236:3000/r/')
                .then(httpresponse => httpresponse.json())
                .then((response) => {
                    try {
                        // Remove old markers
                        if (currentMarkers) {
                            const bounds = map.getBounds()
                            Object.keys(currentMarkers).forEach(id => {
                                if (!bounds.contains(currentMarkers[id].getLngLat())) {
                                    currentMarkers[id].remove();
                                    delete currentMarkers[id];
                                }
                            })
                        }

                        // Create new places array and place markers on map
                        const places = response.places

                        places.forEach(p => {
                            if (currentMarkers) {
                                const alreadyAppear = Object.values(currentMarkers).some(marker =>
                                    marker.getElement().className === '{p.id}-marker')
                                if (alreadyAppear) {
                                    return
                                }
                            }

                            const popupHtml = '\
                                    <div class="popup">\
                                        <h1>' + p.name + '</h1>\
                                        <p>Number of reviews: ' + p.numOfReviews + '</p>\
                                        <button class="button">Reviews</button>\
                                    </div>'
                            currentMarkers[p.id] = createMarker('poi', p.id, p.coords, popupHtml)
                        })
                    }
                    catch (err) {
                        alert(err)
                        console.error("Failed with marker creation! " + err)
                    }
                })
        })

        const messageHandler = (event) => {
            const message = event.data
            if (message.error) {
                alert(message.error)
                return
            }
            switch (message.type) {
                case 'alert':
                    alert(message.body)
                    break
                case 'center':
                    try {
                        const lnglat = message.body.lnglat
                        map.setCenter(lnglat)
                        createMarker('self', self, lnglat, '');

                    }
                    catch (err) {
                        alert(err.message)
                    }
                    break

                default:
                    break
            }
        }

        window.addEventListener("message", messageHandler, false);

        function createMarker(icon, id, position, popupHTML) {
            try {
                var markerElement = document.createElement('div');
                markerElement.className = id + '-marker';
    
                var markerContentElement = document.createElement('div');
                markerContentElement.className = 'marker-content';
                markerContentElement.style.backgroundColor = (icon === 'poi') ? '#41CEFE' : '#41DB41';
                markerElement.appendChild(markerContentElement);
                
                const poiIcon ='url(https://uxwing.com/wp-content/themes/uxwing/download/controller-and-music/speaker-sound-icon.png)'
                const selfIcon = 'url(https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/person-profile-image-icon.png)'
    
                const oldPersonIcon = 'url(https://www.iconpacks.net/icons/1/free-user-icon-295-thumb.png)'
                var iconElement = document.createElement('div');
                iconElement.className = 'marker-icon';
                iconElement.style.backgroundImage = (icon === 'poi') ? poiIcon : selfIcon
    
                markerContentElement.appendChild(iconElement);
    
                if (popupHTML) {
                    var popup = new tt.Popup({ offset: 30 }).setHTML(popupHTML);    
                }
    
                // add marker to map
                marker = new tt.Marker({ element: markerElement, anchor: 'bottom' })
                    .setLngLat(position)
                    .setPopup(popup)
                    .addTo(map);

                return marker
            }
            catch (err){
                alert(err)
            }

        }

        function handlePoiClick(event) {
            var feature = map.queryRenderedFeatures(event.point)[0];

            // hideResult();

            if (feature.sourceLayer !== 'Point of Interest') {
                return
            }
            // const popupHtml = '<h1>'+feature.properties.name+'</h1>\
            //                     <h1>There</h1>'

            // createMarker('poi', 'temp', feature.geometry.coordinates, popupHtml)
            // errorHint.hide();
            // infoHint.hide();

            // if (feature.properties.id) {
            //     serviceCall(feature);
            // } else {
            //     infoHint.setMessage('There\'s no result found for this place ID');
            // }
        }




    </script>
</body>

</html>





`