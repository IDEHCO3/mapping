/**
 * Created by idehco3 on 14/12/15.
 */
var app = angular.module('app', [
   'ngStorage'
])
   .constant('urls', {
       BASE: 'http://127.0.0.1:8000/authentication',
       BASE_API: 'http://127.0.0.1:8000/v1'
   })
   .config(function($httpProvider){


    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function ($q, $location, $localStorage) {
        return {
            'request': function (config) {

                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.token;
                }
                return config;
            },
            'responseError': function (response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/signin');
                }
                return $q.reject(response);
            }
        };
    }]);
})

   
