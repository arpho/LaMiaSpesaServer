'use strict';

angular.module('laMiaSpesaServerApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'MainCtrl'
      }).when('/#/looking_item',{
		templateUrl: 'views/looking_item.html',
		controller: 'LookingItemCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
