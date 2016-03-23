(function() {
    var app = angular.module("loadMap",['settingMap']);

    app.controller("loadDataOnMapController", ["$http","$rootScope","$scope","settingsMap", function($http,$rootScope,$scope,settingsMap){
        this.map = $rootScope.map;
        var that = this;
        $rootScope.drawControl = null;
        $rootScope.layers = [];
        $scope.layer_url = "";
        $rootScope.currentLayer = null;
        $scope.currentLayerIndex = 0;

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
                $rootScope.featureGroup.addLayer(layer);
            }});

            return geoJsonLayer;
        };

        $scope.setCurrentLayer = function(layer){
            $rootScope.currentLayer = layer;
        };

        $scope.setVisibilityLayer = function(layer){
            if(layer.activated){
                layer.data.eachLayer(function(l){
                    $rootScope.featureGroup.addLayer(l);
                });
            }
            else{
                layer.data.eachLayer(function(l){
                    $rootScope.featureGroup.removeLayer(l);
                });
            }
        };

        $scope.buttonLoadLayerClicked = function(){

            $http.get($scope.layer_url)
                .success(function(data){
                    var layer = { name: "", data: null, url: "", activated: true, schema: null, emptyProperties: null};

                    var aLayer = loadGeoJson(data);

                    layer.name = "layer"+$rootScope.layers.length;
                    layer.url = $rootScope.layer_url;
                    layer.data = aLayer;

                    $rootScope.layers.push(layer);
                    $scope.currentLayerIndex = $rootScope.layers.length -1;
                    $rootScope.currentLayer = layer;
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