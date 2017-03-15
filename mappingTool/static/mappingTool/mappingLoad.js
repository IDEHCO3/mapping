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

        var regexToGetContext = function(){
            return new RegExp('<[^;]*>; *rel="http://www.w3.org/ns/json-ld#context"',"gi");
        };

        var regexToGetEntryPoint = function(){
            return new RegExp('<[^;]*>; *rel="http://schema.org/EntryPoint"',"gi");
        };

        var getLinkOfHeader = function(headers, regexOfLink){
            var links = headers('Link');
            var contextLink = null;
            var context_re = regexOfLink;
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
            var contextLink = getLinkOfHeader(headers, regexToGetContext());
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

        var isAEntryPoint = function(headers){
            return getLinkOfHeader(headers, regexToGetEntryPoint()) != null;
        };

        $scope.setCurrentLayer = function(layer){
            $rootScope.currentLayer = layer;
        };

        $scope.setVisibilityLayer = function(layer, index){
            if(layer.data == null){
                $http.get(layer.url)
                    .success(function(data, status, headers){
                        getContext(headers, layer);
                        var aLayer = loadGeoJson(data);
                        layer.data = aLayer;
                        layer.data.eachLayer(function(l){
                            $rootScope.featureGroup.addLayer(l);
                        });

                        $scope.currentLayerIndex = index;
                        $rootScope.currentLayer = layer;
                    })
                    .error(function(data){
                        console.log("Error to get layer!");
                    });
            }
            else{
                if(layer.activated){
                    $scope.currentLayerIndex = index;
                    $rootScope.currentLayer = layer;

                    layer.data.eachLayer(function(l){
                        $rootScope.featureGroup.addLayer(l);
                    });
                }
                else{
                    layer.data.eachLayer(function(l){
                        $rootScope.featureGroup.removeLayer(l);
                    });
                }
            }
        };

        $scope.buttonLoadLayerClicked = function(){
            $http.get($scope.layer_url)
                .success(function(data, status, headers){
                    if(isAEntryPoint(headers)){
                        for(var key in data){
                            var layer = {
                                name: key,
                                data: null,
                                url: data[key],
                                activated: false,
                                schema: null,
                                emptyProperties: null,
                                context: null};

                            $rootScope.layers.push(layer);
                            $scope.layer_url = "";
                        }
                    }
                    else{
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

                        var pieces = $scope.layer_url.split('/');
                        if(pieces[pieces.length-1] != "") {
                            layer.name = "layer_" + pieces[pieces.length - 1];
                        }
                        else{
                            layer.name = "layer_" + pieces[pieces.length - 2];
                        }

                        layer.url = $scope.layer_url;
                        layer.data = aLayer;

                        $rootScope.layers.push(layer);
                        $scope.currentLayerIndex = $rootScope.layers.length -1;
                        $rootScope.currentLayer = layer;
                        $scope.layer_url = "";
                        $rootScope.editingLayer = layer;
                    }
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