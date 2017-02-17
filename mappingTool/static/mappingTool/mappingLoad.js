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

        var getLinkOfContext = function(headers){
            var links = headers('Link');
            var contextLink = null;
            var context_re = new RegExp('<[^;]*>; *rel="http://www.w3.org/ns/json-ld#context"',"gi");
            var link_re = new RegExp("<.*>","ig");

            var link1 = context_re.exec(links);
            if(link1 != null){
                contextLink = link_re.exec(link1[0]);
                if(contextLink != null){
                    contextLink = contextLink[0].substring(1,contextLink[0].length-1);
                }
            }
            return contextLink;
        };

        var getContext = function(headers, layer){
            var contextLink = getLinkOfContext(headers);
            if(contextLink != null){
                $http.get(contextLink)
                    .success(function(data){
                        layer.context = data;
                        console.log("data:", data);
                    })
                    .error(function(data){
                        console.log("error:", data);
                    });
            }
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
                .success(function(data, status, headers){
                    var layer = {
                        name: "",
                        data: null,
                        url: "",
                        activated: true,
                        schema: null,
                        emptyProperties: null,
                        context: null};

                    getContext(headers, layer);

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