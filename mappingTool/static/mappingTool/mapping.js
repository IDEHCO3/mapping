/**
 * Created by Rogério on 13/09/2015.
 */
function initMapping() {
    var map = L.map('map').setView([-22, -41], 4);

    mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    osmAdress =  'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    opts = {attribution: 'Map data &copy; ' + mapLink, maxZoom: 18 };
    L.tileLayer( osmAdress, opts ).addTo(map);

}
