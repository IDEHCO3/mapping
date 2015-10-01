/**
 * Created by Rogério on 13/09/2015.
 */
// initialise map
var map = L.map('map',initializeContextMenuMap()).setView([-22, -41], 2);
mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
osmAdress =  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
opts = {attribution: 'Map data &copy; ' + mapLink, maxZoom: 18 };
L.tileLayer( osmAdress, opts ).addTo(map);
var dicUrlLayer = {"url": "", "layer": ""};
var arrOfDicUrlLayer = [];
var geoJsonLayers = [];
var actualLayer = null;
var geojsons = []

// INICIO DADOS PARA TESTES
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
    }
];
geojsons.push(geojsonFeature);
var geojsonFeature1 = [
    {
        "type": "LineString",
        "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
    },
    {
        "type": "LineString",
        "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
    }
];
geojsons.push(geojsonFeature1);
// FIM DADOS PARA TESTES

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
function loadGeoJson(aGeoJson) {

        var geoJsonLayer = L.geoJson(aGeoJson, {onEachFeature: onEachFeature});

        map.addLayer(geoJsonLayer);

        geoJsonLayers.push(geoJsonLayer);

        if (drawControl != null)
           map.removeControl(drawControl);

           drawControl = new L.Control.Draw(options(geoJsonLayer));
           map.addControl(drawControl);

}


function onEachFeature(feature, layer) {

    if (layer._layers)
        return onEachFeatureWithMultiGeometry(feature, layer);

    return onEachFeatureWithSingleGeommetry(feature, layer);



}
function onEachFeatureWithMultiGeometry(feature, layer){

        layer.eachLayer(function (l) {
            l.on('click', function() { clickOnLayer(feature, layer); });
            l.on('contextmenu', function (){clickOnLayer(feature, layer);})
            l.bindContextMenu({
                contextmenu: true,
                contextmenuItems: contextMenuItemsTo()
            });
        });

}

function onEachFeatureWithSingleGeommetry(feature, layer)
{

    layer.on('click', function() { clickOnLayer(feature, layer); });
    binderMenuContextTo(layer);
}
// called when a layers is load or created

function binderMenuContextTo(layer) {
    layer.bindContextMenu({
        contextmenu: true,
        contextmenuInheritItems: true,
        contextmenuItems: contextMenuItemsTo()
    });
}

function contextMenuItemsTo(){
    return [
        {
            separator: true
        },
        {
            text: 'Marker ',
            callback: function (e) { alert('Marker: ' + e);      }
        }, {
            text: 'Edit attributes',
            callback: function (e) { editingAttributes(e);  }
        }, {
            separator: true
        }
    ];
}

// called when a layer is clicked on the map
function clickOnLayer(feature, layer ){
    actuallayer = layer;

}

// called on onEachFeature to associate a context menu to a layer

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


function buttonLoadLayerClicked() {

    url_json = $("#loadLayerRest").val();

   $.getJSON( url_json, function(geoJsons) {
       aLayer = loadGeoJson(geoJsons);
       appendLayerListSidebar(url_json);


    }).done(function(data){

       dic =  dicUrlLayer;
       dic.url = url_json;
       dic.layer = data;
       arrOfDicUrlLayer.push(dic);

    }).fail(function(data){
        console.log("Fail to load geojson");
    });

}

function appendLayerListSidebar(url) {
    console.log(url);
    var htmlLi = '<li>' +
    '<a href="#" >' +
    '<input id="radio"  class="word-wrap: break-word" type="radio" onchange="radioChanged() " />' +
    '<label><input id="editable" type="checkbox" onchange="checkboxChanged()" />' + url+  '</label>' +
    '</a>' +
    '</li>'    ;

    $("#layerList").append(htmlLi);

}

function radioChanged() {
    alert('radio');
}
function checkboxChanged() {
    alert('checkboxChanged');
}

