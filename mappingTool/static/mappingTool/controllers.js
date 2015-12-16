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

