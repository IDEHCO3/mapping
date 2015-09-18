/**
 * Created by Rogério on 13/09/2015.
 */
/** initialization map and variables **/
var map = L.map('map', initializeContextMenuMap()).setView([-21.2858, -41.78682], 2);
var geoJsonLayers = [];
var actuallayer;
function initMapping() {
    mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    osmAdress = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    opts = {attribution: 'Map data &copy; ' + mapLink, maxZoom: 18};
    L.tileLayer(osmAdress, opts).addTo(map);
}



var geojsonFeature =[
    {
        "type": "Feature",
        "properties": {
            "name": "Coors Field",
            "amenity": "Baseball Stadium",
            "popupContent": "This is where the Rockies play!"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [-104.99404, 39.75621]
        }
    },
    {
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
    },
    {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
    }
];
function initializeContextMenuMap() {
    return {
        zoom: 15,
        contextmenu: true,
        contextmenuWidth: 140,
        contextmenuItems: [{
            text: 'Show coordinates',
            callback: showCoordinates
        }, {
            text: 'Center map here',
            callback: centerMap
        }, '-', {
            text: 'Zoom in',
            callback: zoomIn
        }, {
            text: 'Zoom out',
            callback: zoomOut
        }]
    }
}

function showCoordinates (e) {
    console.log(e.latlng);
}
function centerMap (e) {
    map.panTo(e.latlng);
}

function zoomIn (e) {
    map.zoomIn();
}

function zoomOut (e) {
    map.zoomOut();
}

/** end initialization map and variables **/

function loadGeoJson() {
    var aGeoJsonLayer = L.geoJson(geojsonFeature, {
       onEachFeature: onEachFeature
    }).addTo(map);
    geoJsonLayers.push(aGeoJsonLayer);

}
function onEachFeature(feature, layer) {
    layer.on('click', function() { clickOnLayer(feature, layer)});

}

function clickOnLayer(feature, layer ){
    console.log(feature.type == 'Feature');
    actuallayer = layer;
    binderMenuContextTo(layer);

}

function binderMenuContextTo(layer) {
    layer.bindContextMenu({
        contextmenu: true,
        contextmenuInheritItems: true,
        contextmenuItems: [
             {
                text: 'Edit attributes',
                callback: function () { editingAttributes(layer);  }
            }, {
                separator: true
            }]
    });

}
