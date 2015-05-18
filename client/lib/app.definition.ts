/// <reference path="../tsd.d.ts" />

angular.module('logtank', ['angular-meteor', 'ngAnimate', 'ngMaterial', 'ui.router', 'ui.codemirror'])
        .run(["$rootScope", "$state", ($rootScope: angular.IRootScopeService, $state: angular.ui.IStateService) => {
              $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
                // We can catch the error thrown when the $requireUser promise is rejected
                // and redirect the user back to the main page
                if (error === "AUTH_REQUIRED") {
                  $state.go('account.login');
                }
              });
            }])
	.config(['$mdThemingProvider', ($mdThemingProvider: angular.material.MDThemingProvider) => {
		$mdThemingProvider.theme('default')
			.primaryPalette('lime')
			.accentPalette('blue-grey', {'default':'500'});
	}]).config(['$urlRouterProvider', '$locationProvider', 
        ($urlRouterProvider: ng.ui.IUrlRouterProvider, $locationProvider: ng.ILocationProvider) => {
            
            $locationProvider.html5Mode(true); 
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
