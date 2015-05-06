/// <reference path="../tsd.d.ts" />

angular.module('logtank', ['angular-meteor', 'ngAnimate', 'ngMaterial', 'ui.router'])
	.config(['$mdThemingProvider', ($mdThemingProvider: angular.material.MDThemingProvider) => {
		$mdThemingProvider.theme('default')
			.primaryPalette('lime')
			.accentPalette('blue-grey', {'default':'500'});
	}]).config(['$urlRouterProvider', ($urlRouterProvider: angular.ui.IUrlRouterProvider) => {
		$urlRouterProvider.otherwise('/dashboard');
	}]);
