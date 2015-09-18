/**
 * Created by Rogério on 13/09/2015.
 */
// initialise map
var map = L.map('map',initializeContextMenuMap()).setView([-22, -41], 2);
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
osmAdress =  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
opts = {attribution: 'Map data &copy; ' + mapLink, maxZoom: 18 };
L.tileLayer( osmAdress, opts ).addTo(map);

var geoJsonLayers = [];
var actualLayer = null;

var geojsonFeature = [
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

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = null;

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
// end mapping initialize

// begins - functions to initialize load Layer(GeoJson)
function loadGeoJson() {

    var createdGeoJsonLayer = L.geoJson(geojsonFeature, {
       onEachFeature: onEachFeature

    }).addTo(map);

    geoJsonLayers.push(createdGeoJsonLayer);
    if(drawControl == null) drawControl = new L.Control.Draw(options(createdGeoJsonLayer));
        map.addControl(drawControl);
}

// called when a layers is load or created
function onEachFeature(feature, layer) {
    //
    layer.on('click', function() { clickOnLayer(feature, layer)});
    binderMenuContextTo(layer);
}

// called when a layer is clicked on the map
function clickOnLayer(feature, layer ){
    actuallayer = layer;
     console.log(actuallayer)
}

// called on onEachFeature to associate a context menu to a layer
function binderMenuContextTo(layer) {
    layer.bindContextMenu({
        contextmenu: true,
        contextmenuInheritItems: true,
        contextmenuItems: [
             {
                separator: true
            },
            {
                text: 'Edit attributes',
                callback: function () { editingAttributes(layer);  }
            }]
    });
}
function editingAttributes(layer){
    //populateModalWithFeature(layer);
    //$('#myModal').modal('show');
}
// ends - functions to initialize  load Layer(GeoJson)

// begins - draw functions

function options(editableLayer) {

        return {
            position: 'topleft',
            draw: {

                  rectangle: false,
                  circle: false

            },
            edit: {
                    featureGroup: editableLayer, //REQUIRED!!
                    remove: true
            }
       };
}

