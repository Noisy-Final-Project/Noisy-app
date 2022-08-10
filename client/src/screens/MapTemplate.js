import { MAPS_API_KEY, SERVER_URL } from '../../ENV.json'

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

        .popup {
            background: #ffffff;
            text-align: center;
        }

        .button-div {
            flex-direction: row;
        }

        .button {
            border: 0px solid #000000;
            border-radius: 10px;
            padding: 10px 10px 10px 10px;
            margin: 0px 10px 0px 10px;
            background-color: #2947FF;
            color: #FFFFFF;
            font-weight: bold;
            opacity: 1;
            transition: 1s;
        }

        .button:hover {
            background-color: #1D32B3;
            opacity: 1;
            transition: 1s;
        }
    </style>

</head>

<script language="javascript" type="text/javascript">
    function resizeIframe(obj) {
        obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
        obj.style.width = obj.contentWindow.document.body.scrollWidth + 'px';
    }
</script>

<body style="padding: 0; margin: 0;">
    <script src='https://api.tomtom.com/maps-sdk-for-web/cdn/6.x/6.20.0/services/services-web.min.js'></script>

    <div style="width:100vw; height: 100vh;" id='map'></div>

    <script id="mapScript">
        // Markers containers:
        let currentMarkers = {};
        let selfMarker = null;
        let tempMarker = null;
        let tempMarkerID = '';

        // Map Creation
        tt.setProductInfo('Noisy', '1.0');
        var map = tt.map({
            key: '${MAPS_API_KEY}',
            container: 'map',
            basePath: 'sdk/',
            center: [35.20326327116519, 32.10054427042954], // Ariel
            zoom: 15,
            theme: {
                style: 'buildings',
                layer: 'basic',
                source: 'vector'
            }
        });
        map.addControl(new tt.NavigationControl());
        map.doubleClickZoom.disable()
        if (window.ANDROID) {
            sendToApp('getLocation', {}); // Center to current location
        }

        /*
            ####### FUNCTIONS: #######
        */

        // Sends messages from the webview/iframe to main app:
        function sendToApp(type, jsonObject) {
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

        // Creates a marker on the map with the following parameters:
        function createMarker(icon, id, color, position, popup) {
            try {
                var markerElement = document.createElement('div');
                markerElement.className = id + '-marker';

                var markerContentElement = document.createElement('div');
                markerContentElement.className = 'marker-content';
                markerContentElement.style.backgroundColor = color;
                markerElement.appendChild(markerContentElement);

                var iconElement = document.createElement('div');
                iconElement.className = 'marker-icon';
                iconElement.style.backgroundImage = 'url(' + icon + ')'

                markerContentElement.appendChild(iconElement);

                // add marker to map
                marker = new tt.Marker({ element: markerElement, anchor: 'bottom' })
                    .setLngLat(position)
                    .setPopup(popup)
                    .addTo(map);

                return marker
            }
            catch (err) {
                alert(err)
            }

        }

        // Creates a popup for a location marker containing these details:
        function createPopup(placeDetails, numOfReviews) {
            var popupDOMElement = document.createElement('div');
            popupDOMElement.className = 'popup';
            popupDOMElement.innerHTML = "<h1>" + placeDetails.name + "</h1>" +
                "<p>" + placeDetails.address + "</p>" +
                "<p>" + numOfReviews + " Reviews</p>";

            var buttonDiv = document.createElement('div');
            buttonDiv.className = 'button-div';
            
            if (numOfReviews > 0) {
                const btnRead = document.createElement("button");
                btnRead.className = 'button'
                
                btnRead.innerHTML = "Read";
                btnRead.setAttribute("onclick", "sendToApp('getReviews'," + JSON.stringify(placeDetails) + ")")
                buttonDiv.appendChild(btnRead)
            }
            else {
                placeDetails.id = ''
            }
            
            const btnAdd = document.createElement("button");
            btnAdd.className = 'button'
            btnAdd.innerHTML = "Add";
            btnAdd.setAttribute("onclick", "sendToApp('addReview'," + JSON.stringify(placeDetails) + ")")
            buttonDiv.appendChild(btnAdd)


            popupDOMElement.appendChild(buttonDiv)

            var popup = new tt.Popup({ offset: 30 }).setDOMContent(popupDOMElement);

            return popup
        }

        // Creates a marker for a places that is not a POI
        function createTempMarker(placeDetails) {
            var popup = createPopup(placeDetails, 0)

            let icon = 'https://uxwing.com/wp-content/themes/uxwing/download/communication-chat-call/question-mark-icon.png'

            tempMarker = createMarker(icon, placeDetails.id, '#FF0000', placeDetails.lnglat, popup).togglePopup()
            tempMarkerID = (placeDetails.id) ? placeDetails.id : 'temp';
        }

        function removeTempMarker() {
            if (tempMarkerID != '') {
                tempMarkerID = '';
                tempMarker.remove();
                delete tempMarker;
            }
        }

        function removeSelfMarker() {
            alert('removing')
            if (selfMarker) {
                alert('removed')
                selfMarker.remove();
                delete tempMarker;
            }
        }

        /*
            ####### BINDERS: #######
        */
        // Add event listener for messages from main app
        window.addEventListener("message", messageHandler, false);

        // Bind map events with handlers:
        map.on('click', generalClickHandler)
        map.on('load', mapMoveHandler)
        map.on('moveend', mapMoveHandler)
        map.on('dblclick', unknownPlaceHandler)

        /*
            ####### HANDLERS: #######
        */
        function generalClickHandler(event) {
            var feature = map.queryRenderedFeatures(event.point)[0];

            if (feature.layer.id !== 'POI' || feature.properties.id !== tempMarkerID) {
                removeTempMarker()
            }

            if (feature.layer.id === 'POI') {
                if (feature.properties.id === tempMarkerID) {
                    return
                }
                tt.services.placeById({
                    key: '${MAPS_API_KEY}',
                    entityId: feature.properties.id,
                    language: 'he-IL'
                })
                    .then(function (response) {
                        const place = response.results[0]
                        if (!place || !place.poi) {
                            return;
                        }

                        const placeDetails = {
                            id: place.id,
                            name: place.poi.name,
                            address: place.address.freeformAddress,
                            lnglat: [place.position.lng, place.position.lat]
                        }

                        createTempMarker(placeDetails)
                    })
            }
        }

        // update the Noisy markers when the map moves
        function mapMoveHandler() {
            const bounds = map.getBounds()

            fetch('${SERVER_URL}' + 'locations?bounds=' + JSON.stringify(bounds))
                .then(httpresponse => httpresponse.json())
                .then((response) => {
                    try {
                        // Remove old markers
                        if (currentMarkers) {
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
                                    marker.getElement().className === p.id + '-marker')
                                if (alreadyAppear) {
                                    return
                                }
                            }

                            const placeDetails = {
                                id: p.id,
                                name: p.name,
                                address: p.address,
                                lnglat: p.lnglat
                            }

                            var popup = createPopup(placeDetails, p.numOfReviews)

                            const details = {
                                id: p.id,
                            }

                            const iconURL = 'https://uxwing.com/wp-content/themes/uxwing/download/controller-and-music/speaker-sound-icon.png'
                            currentMarkers[p.id] = createMarker(iconURL, p.id, '#41CEFE', p.lnglat, popup)
                        })
                    }
                    catch (err) {
                        alert(err)
                        console.error("Failed with marker creation! " + err)
                    }
                })
        }

        // Handles clicking on an unknown place (not POI)
        function unknownPlaceHandler(event) {
            var feature = map.queryRenderedFeatures(event.point)[0];

            if (feature.layer.id === 'POI') {
                return;
            }

            tt.services.reverseGeocode({
                key: '${MAPS_API_KEY}',
                position: event.lngLat,
                language: 'he-IL'
            })
                .then(function (response) {
                    let clickedAddress = (response.addresses.length > 0) ? response.addresses[0].address : '';

                    const placeDetails = {
                        id: '',
                        name: '',
                        address: (clickedAddress) ? clickedAddress.freeformAddress : '',
                        lnglat: event.lngLat
                    }

                    createTempMarker(placeDetails)
                })
        }

        // Handles messages from the app
        function messageHandler(event) {
            const message = event.data
            if (message.error) {
                alert(message.error)
                return
            }
            switch (message.type) {
                case 'center':
                    try {
                        const lnglat = message.body.lnglat
                        map.flyTo({ center: lnglat, zoom: 15 })
                        alert(window.ANDROID)
                        if (windows.ANDROID) {
                            removeSelfMarker()
                            selfMarker = createMarker('https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/person-profile-image-icon.png', 'self', '#41DB41', lnglat, '')
                        }

                    }
                    catch (err) {
                        alert(err.message)
                    }
                    break
                default:
                    break
            }
        }


    </script>
</body>

</html>





`