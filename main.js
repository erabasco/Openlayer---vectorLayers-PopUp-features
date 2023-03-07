const map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM()
        })
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([-3.70379, 40.41678]),
        zoom: 7
    })
});

const valenciaLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: 'url.geojson',
        format: new ol.format.GeoJSON(),
    }),
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 0, 0, 0.1)',
        }),
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 2,
        }),
    }),
});


const barcelonaLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        url: "url.geojson",
        format: new ol.format.GeoJSON(),
    }),
});

map.addLayer(valenciaLayer);
map.addLayer(barcelonaLayer);


// Define el popup
const popup = new ol.Overlay({
    element: document.getElementById('popup'),
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -50],
});
map.addOverlay(popup);

//boton cerra
const popupCloser = document.getElementById("popup-closer");
popupCloser.onclick = function () {
    popup.setPosition(undefined);
    popupCloser.blur();
    return false;
};

// Muestra información de ambas capas en el popup al hacer clic
map.on('click', function (evt) {
    const features = [];


    // Recorre las características de la capa de Valencia y agrega las que se encuentran en el punto clicado
    valenciaLayer.getSource().getFeaturesAtCoordinate(evt.coordinate).forEach(function (feature) {
        feature.set('layerName', 'Valencia'); //guardamos nombre de la capa
        features.push(feature);
    });

    // Recorre las características de la capa de Barcelona y agrega las que se encuentran en el punto clicado
    barcelonaLayer.getSource().getFeaturesAtCoordinate(evt.coordinate).forEach(function (feature) {
        feature.set('layerName', 'Barcelona');
        features.push(feature);
    });

    // Si hay características, muestra información de ambas capas en el popup
    if (features.length > 0) {
        let content = '';
        for (var i = 0; i < features.length; i++) {
            let layerName = features[i].get('layerName');

            //rescatamos las propiedades y se muestran
            const featureProps = features[i].getProperties();
            content += "<h2>" + layerName + "</h2>";
            content += "<ul>";
            for (var prop in featureProps) {
                //omitimos las features que sean geometry
                if (prop != 'geometry') {
                    content += "<li><strong>" + prop + ":</strong> " + featureProps[prop] + "</li>";
                }
            }
            content += "</ul>";


        }
        const coordinate = evt.coordinate;
        popup.setPosition(coordinate);
        document.getElementById('popup-content').innerHTML = content;
    }
    else {
        popup.setPosition(undefined);
    }
});

