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

    $scope.sideBarCheckboxChanged = function(layer){

        if (layer.activated_checkbox)
            map.addLayer(layer.data);
        else
            map.removeLayer(layer.data);
    };

    $scope.sideBarRadioChanged = function(layer){
        console.log("layer:", layer);
    };

    //begins function  load layer sidebar
    $scope.buttonLoadLayerClicked = function(){

        $http.get($scope.layer_url)
            .success(function(data){
                var layer = { name: "", data: null, url: "", activated_radio: false, activated_checkbox: true};

                var aLayer = loadGeoJson(data);
                actualLayer = aLayer;
                var aLayerName = layerNameCheckboxSideBar($scope.layer_url);

                layer.name = aLayerName;
                layer.url = $scope.layer_url;
                layer.data = aLayer;
                $scope.layers.push(layer);
                $scope.layer_url = "";

                if (notInitializedCRUD) {
                    notInitializedCRUD = false;
                    console.log(actualLayer);
                    initializeCRUD();
                }
            })
            .error(function(){
                console.log("Error to get layer!");
            });
    }
}]);

