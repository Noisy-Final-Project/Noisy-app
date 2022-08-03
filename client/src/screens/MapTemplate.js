export default `

<!DOCTYPE html>
<html class='use-all-space'>
<head>
    <meta http-equiv='X-UA-Compatible' content='IE=Edge' />
    <meta charset='UTF-8'>
    <title>Maps SDK for Web - Vector map</title>
    <meta name='viewport'
          content='width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'/>
    <link rel='stylesheet' type='text/css' href='https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.39.0/maps/maps.css'>
    <script src="https://api.tomtom.com/maps-sdk-for-web/cdn/5.x/5.39.0/maps/maps-web.min.js"></script>

</head>

<body>
    <div style="width:100vw; height: 100vh;" id='map'></div>
    
    <script id="mapScript">

        function android() {
            return /Android/i.test(navigator.userAgent);
        }
      
        var map = tt.map({
            key: '1AWfEKQa6LPihC3AZZichYxEGBRVUtyk',
            container: 'map',
            basePath: 'sdk/',
            center: [32.10054427042954, 35.20326327116519], // Ariel
            zoom: 12,
            theme: {
                style: 'buildings',
                layer: 'basic',
                source: 'vector'
            }
        });
        map.addControl(new tt.NavigationControl());
        
        map.on('click', function(event) {
            let center = event.lngLat;
            window.parent.postMessage('CLICKED! ' + center.lng.toFixed(3) + ", " + center.lat.toFixed(3));
        })

        const handleCenterEvent = (event) =>{
            const { lng, lat } = JSON.parse(event.data)
            console.log(lng)
            console.log(lat)

            map.setCenter([parseFloat(lng), parseFloat(lat)])
        }

        window.addEventListener("message", handleCenterEvent, false);
        

    </script>
</body>
</html>





`