(function() {
    var app = angular.module("formMap",[]);

    app.controller("mappingForm", ["$http","$rootScope","$scope", function($http,$rootScope,$scope){

        $scope.layer = null;
        $scope.groupLayer = null;
        $scope.properties = null;

        $scope.getProperties = function(layer){
            var prop = null;
            if(layer && layer.feature && layer.feature.properties){
                prop = layer.feature.properties;

                if(prop.properties){
                    prop = angular.fromJson(prop.properties);
                }
            }

            return prop;
        };

        $scope.fillForm = function(properties){
            console.log("that is the properties!!", properties);
        };

        $rootScope.showForm = function(layer, groupLayer){
            $scope.layer = layer;
            $scope.groupLayer = groupLayer;
            $scope.properties = $scope.getProperties(layer);
            $scope.fillForm($scope.properties);
            $("#propertiesForm").modal('show');
        };

        $scope.cancel = function() {
            if($scope.properties == null){
                $rootScope.featureGroup.removeLayer($scope.layer);
                $scope.groupLayer.data.removeLayer($scope.layer);
                $scope.groupLayer = null;
                $scope.layer = null;
            }
        };

        $scope.save = function(){

        };
    }]);

})();