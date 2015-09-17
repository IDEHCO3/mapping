/**
 * Created by Rogério on 13/09/2015.
 */
var map = L.map('map').setView([-22, -41], 2);
var geoJsonObjects = [];
function initMapping() {
    mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    osmAdress =  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    opts = {attribution: 'Map data &copy; ' + mapLink, maxZoom: 18 };
    L.tileLayer( osmAdress, opts ).addTo(map);

}

var geojsonFeature = {
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
};

function loadGeoJson() {
    var aGeoJsonLayer = L.geoJson(geojsonFeature, {
       onEachFeature: onEachFeature
    }).addTo(map);
    geoJsonObjects.push(aGeoJsonLayer);
    console.log(geoJsonObjects);
}
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}