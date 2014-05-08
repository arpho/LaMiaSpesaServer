'use strict';

angular.module('laMiaSpesaServerApp')
  .controller('LookingItemCtrl', function ($scope, $http) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
		console.log('looking item');
		$scope.awesomeThings = awesomeThings;
    });
  });
