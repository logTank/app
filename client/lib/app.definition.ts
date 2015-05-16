/// <reference path="../tsd.d.ts" />

angular.module('logtank', ['angular-meteor', 'ngAnimate', 'ngMaterial', 'ui.router', 'ui.codemirror'])
	.config(['$mdThemingProvider', ($mdThemingProvider: angular.material.MDThemingProvider) => {
		$mdThemingProvider.theme('default')
			.primaryPalette('lime')
			.accentPalette('blue-grey', {'default':'500'});
	}]).config(['$urlRouterProvider', ($urlRouterProvider: angular.ui.IUrlRouterProvider) => {
		$urlRouterProvider.otherwise('/dashboard');
	}]).config(['$compileProvider', ($compileProvider: angular.ICompileProvider) => {
		$compileProvider.debugInfoEnabled(false);
	}]).directive('stopClick', () => {
		return {
			restrict: 'A',
			link: (scope: angular.IScope, element: angular.IAugmentedJQuery, attr) => {
				element.bind('click', e => e.stopPropagation());
			}
		}
	});
