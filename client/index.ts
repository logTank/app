/// <reference path="../typings/tsd.d.ts" />

console.log('angular is coming ...');
angular.module('logtank', ['angular-meteor', 'ngAnimate', 'ngMaterial', 'ui.router']);

angular.module('logtank').config(($mdThemingProvider: angular.material.MDThemingProvider) => {
	$mdThemingProvider.theme('default')
		.primaryPalette('pink')
		.accentPalette('orange');
})