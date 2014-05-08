'use strict';

angular.module('laMiaSpesaServerApp').
directive('lookingItem',['createDialog',function(createDialogService){
    return {
		template:
			'<form novalidate class="looking-Item-form">'+
			'upc: <input type="text" ng-model="upc" /><br />'
			+'<button ng-click="getItem(upc)">cerca upc</button>'
		,
		restrict: 'A',
		replace:true,
		link: function(createDialog){}
		
	};
    }]);