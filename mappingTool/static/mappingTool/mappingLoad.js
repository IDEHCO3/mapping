(function() {
    var app = angular.module("loadMap",['settingMap']);

    app.controller("loadDataOnMapController", ["$http","$rootScope","$scope","settingsMap", function($http,$rootScope,$scope,settingsMap){
        this.map = $rootScope.map;
        var that = this;
        $rootScope.drawControl = null;
        $rootScope.layers = [];
        $scope.layer_url = "";

        $rootScope.featureGroup = new L.featureGroup();
        var settings = new settingsMap();

        var initializeDrawControl = function(){
            var options = {
                position: 'topleft',
                draw: {
                    rectangle: false,
                    circle: false
                },
                edit: {
                    featureGroup: $rootScope.featureGroup
                }
            };

            $rootScope.drawControl = new L.Control.Draw(options);
            that.map.addControl($rootScope.drawControl);
            that.map.addLayer($rootScope.featureGroup);
        };

        var loadGeoJson = function(aGeoJson) {
            var geoJsonLayer = L.geoJson(aGeoJson, {onEachFeature: function(feature,layer){
                settings.onEachFeature(feature,layer);
                console.log("test123",feature,layer);
                $rootScope.featureGroup.addLayer(layer);
            }});
            //that.map.addLayer(geoJsonLayer);
            console.log("testandooooo: ", geoJsonLayer);
            /*if (geoJsonLayer instanceof L.FeatureGroup) {
                alert('Its a FeatureGroup object');
            }*/
            //$rootScope.featureGroup.addLayer(geoJsonLayer);
            /*if ($rootScope.drawControl != null)
                initializeDrawControl();*/

            return geoJsonLayer;
        };

        $rootScope.buttonLoadLayerClicked = function(){

            $http.get($scope.layer_url)
                .success(function(data){
                    var layer = { name: "", data: null, url: "", activated: true, schema: null, emptyProperties: null};

                    var aLayer = loadGeoJson(data);

                    layer.name = $rootScope.layer_url;
                    layer.url = $rootScope.layer_url;
                    layer.data = aLayer;

                    $rootScope.layers.push(layer);
                    $scope.layer_url = "";
                    $rootScope.editingLayer = layer;

                    if ($rootScope.drawControl == null) {
                        initializeDrawControl();
                    }
                })
                .error(function(){
                    console.log("Error to get layer!");
                });
        };

    }]);

})();