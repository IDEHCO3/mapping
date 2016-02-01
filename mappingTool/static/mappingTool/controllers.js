/**
 * Created by idehco3 on 14/12/15.
 */

app.controller('HomeController', ['$rootScope', '$scope', '$location', '$localStorage', 'Auth',
       function ($rootScope, $scope, $location, $localStorage, Auth) {
           function successAuth(res) {
               $localStorage.token = res.token;
               window.location = "/";
           }

           function successLoadUser(res){
               $scope.user = res;
           }

           $scope.signin = function () {
               var formData = {
                   username: $scope.username,
                   password: $scope.password
               };

               Auth.signin(formData, successAuth, function () {
                   $rootScope.error = 'Invalid credentials.';
               })
           };

           $scope.signup = function () {
               var formData = {
                   username: $scope.username,
                   password: $scope.password
               };

               Auth.signup(formData, successAuth, function () {
                   $rootScope.error = 'Failed to signup';
               })
           };

           $scope.logout = function () {
               Auth.logout(function () {
                   window.location = "/"
               });
           };
           $scope.token = $localStorage.token;
           $scope.tokenClaims = Auth.getTokenClaims();
           console.log("token not:", $scope.tokenClaims);
}]);

app.controller('RestrictedController', ['$rootScope', '$scope', 'Data', function ($rootScope, $scope, Data) {
           Data.getRestrictedData(function (res) {
               $scope.data = res.data;
           }, function () {
               $rootScope.error = 'Failed to fetch restricted content.';
           });
           Data.getApiData(function (res) {
               $scope.api = res.data;
           }, function () {
               $rootScope.error = 'Failed to fetch restricted API content.';
           });
}]);

app.controller('MappingController',['$scope', '$http', function($scope, $http){

    $scope.layers = [];
    $scope.layer_url = "";
    $scope.editingLayer = null;
    $scope.currentLayer = null;

    this.notInitializedCRUD = true;
    var that = this;

    this.getEditingLayer = function(){
        return $scope.editingLayer;
    };

    this.convertToPropertiesFromOPTIONS = function(schema){
        var properties = {};

        for( var key in schema){
            if(!schema[key].read_only){
                switch (schema[key].type){
                    case 'string':
                        properties[key] = "empty";
                    case 'integer':
                        properties[key] = 0;
                    default:
                        properties[key] = null;
                }
            }
        }

        return properties;
    };

    this.getEmptyProperties = function(superLayer){
        if(superLayer == null) return;

        $http({
            method: "OPTIONS",
            url: superLayer.url
        }).success(function(data){
            if(data.actions && data.actions.POST){
                superLayer.schema = data.actions.POST
                superLayer.emptyProperties = that.convertToPropertiesFromOPTIONS(superLayer.schema);
            }

        }).error(function(){
            console.log("Error to load schema of layer!");
        });
    };

    this.created = function(e){
        var layer = e.layer;
        //var superLayer = null;
        actuallayer = layer;
        var geojson = e.layer.toGeoJSON();
        if($scope.editingLayer == null) return;

        if(Object.keys(geojson.properties).length == 0){
            geojson.properties = $scope.editingLayer.emptyProperties;
        }
        console.log(geojson);
        // Do whatever else you need to. (save to db, add to map etc)
        map.addLayer(layer);
        binderMenuContextTo(layer);
        console.log("trying to create a layer! Sorry! Not implemented!");
        return;
        $http.post($scope.editingLayer.url, geojson)
            .success(function(data){
                console.log("saved! ", data);
            })
            .error(function(){
                console.log("Error to create layer!");
            });
    };

    this.edited = function(e){
        var layers = e.layers;
        layers.eachLayer(function (layer) {

            var geojson = layer.toGeoJSON();
            var editingLayer = that.getEditingLayer();
            geojson.properties = editingLayer.emptyProperties;
            //do whatever you want, most likely save back to db
            console.log("trying to save the layers edited! Sorry! Not implemented!");

            //$http.put()
        });
    };

    this.deleted = function(e){
        var layers = e.layers;
        layers.eachLayer(function (layer) {
            //do whatever you want, most likely save back to db
            //delete the layer
            console.log("trying to delete the layer! Sorry! Not implemented!");

            var geojson = layer.toGeoJSON();
            var editingLayer = that.getEditingLayer();

            if(Object.keys(geojson.properties).length != 0) {
                var url = editingLayer.url;
                if (url.slice(-1) == '/') {
                    url += geojson.properties.id;
                }
                else {
                    url += "/" + geojson.properties.id;
                }

                /*$http.delete(editingLayer.url)
                 .success(function(data){
                 console.log("Success to delete data!");
                 })
                 .error(function(){
                 console.log("Error to delete data!");
                 });*/
            }
        });
    };

    this.initializeCRUD = function(){
        map.on('draw:created', that.created);
        map.on('draw:edited', that.edited);
        map.on('draw:deleted', that.deleted);
    };

    $scope.sideBarCheckboxChanged = function(layer){

        if (layer.activated)
            map.addLayer(layer.data);
        else
            map.removeLayer(layer.data);
    };

    $scope.sideBarRadioChanged = function(layer){
        $scope.editingLayer = layer;
    };

    //begins function  load layer sidebar
    $scope.buttonLoadLayerClicked = function(){

        $http.get($scope.layer_url)
            .success(function(data){
                var layer = { name: "", data: null, url: "", activated: true, schema: null, emptyProperties: null};

                var aLayer = loadGeoJson(data);
                actualLayer = aLayer;
                var aLayerName = layerNameCheckboxSideBar($scope.layer_url);

                layer.name = aLayerName;
                layer.url = $scope.layer_url;
                layer.data = aLayer;
                that.getEmptyProperties(layer);
                $scope.layers.push(layer);
                $scope.layer_url = "";

                $scope.editingLayer = layer;

                if (that.notInitializedCRUD) {
                    that.notInitializedCRUD = false;
                    console.log(actualLayer);
                    that.initializeCRUD();
                }
            })
            .error(function(){
                console.log("Error to get layer!");
            });
    }
}]);

