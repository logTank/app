/// <reference path="../tsd.d.ts" />

angular.module('logtank', ['angular-meteor', 'ngAnimate', 'ngMaterial', 'ui.router']);
	
angular.module('logtank').config(['$mdThemingProvider', ($mdThemingProvider: angular.material.MDThemingProvider) => {
	$mdThemingProvider.theme('default')
		.primaryPalette('pink')
		.accentPalette('orange');
}]);	
