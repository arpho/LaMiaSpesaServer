'use strict';

angular.module('laMiaSpesaServerApp')
  .factory('lookUpItem',function($http,$scope){
	return {
		getItem: function(upc){
			var url = 'http://192.168.52.60/item';
			return $http.get(url,upc);
			
		}
	};
		
  });
