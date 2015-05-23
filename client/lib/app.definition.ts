/// <reference path="../tsd.d.ts" />
module logtank{
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

//Full Material icon set can be found here http://google.github.io/material-design-icons/    
var themeIcons = ['$mdIconProvider' , function ($mdIconProvider) {

$mdIconProvider
    .iconSet("social", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg")
    .iconSet("action", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg")
    .iconSet("communication", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg")
    .iconSet("content", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg")
    .iconSet("toggle", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg")
    .iconSet("navigation", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg")
    .iconSet("image", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg")
    .iconSet("maps", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-maps.svg");

}];

angular.module('logtank')
    .config(themeIcons);

}