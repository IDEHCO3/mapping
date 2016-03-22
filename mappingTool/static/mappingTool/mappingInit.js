(function() {
    var app = angular.module("mapping",['editMap','loadMap']);

    app.controller("createMap",["$rootScope",function($rootScope){
        var that = this;
        $rootScope.map = null;

        var showCoordinates = function(e) {
            console.log(e.latlng);
        };

        var centerMap = function(e) {
            $rootScope.map.panTo(e.latlng);
        };

        var zoomIn = function(e) {
            $rootScope.map.zoomIn();
        };

        var zoomOut = function(e) {
            $rootScope.map.zoomOut();
        };

        var initializeMap = function(){
            var context = {
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
            };

            var map = L.map('map', context).setView([-22, -41],2);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            return map;
        };

        $rootScope.map = initializeMap();
    }]);
})();