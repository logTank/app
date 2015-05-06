/// <reference path="../tsd.d.ts" />
/// <reference path="../lib/baseControllers.ts" />

module logtank {
	var leftSidebarId = 'leftNavbar';
	
	class DashboardController extends SidebarEnabledController {
		constructor($mdSidenav: angular.material.MDSidenavService, $mdUtil: any) {
			super($mdSidenav, $mdUtil, leftSidebarId);
		}
	}
	
	class LeftDashboardSidebarController extends SidebarController {
		constructor($mdSidenav: angular.material.MDSidenavService) {
			super(leftSidebarId, $mdSidenav)
		}
	}
	
	class SearchByTagsController {
		public availableTags: string[];
	
		constructor(private $meteor: any) {
			$meteor.call('listTags').then(tags => {
				this.availableTags = tags;
			});
		}
	}
	
	class SearchByTimestampsController {
		constructor() { }
	}
	
	angular.module('logtank')
		.controller('DashboardController', ['$mdSidenav', '$mdUtil', DashboardController])
		.controller('LeftDashboardSidebarController', ['$mdSidenav', LeftDashboardSidebarController])
		.controller('SearchByTagsController', ['$meteor', SearchByTagsController])
		.controller('SearchByTimestampsController', [SearchByTimestampsController])
		.config(['$stateProvider', '$urlRouterProvider', ($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
			$stateProvider.state('dashboard', {
				url: '/dashboard',
				abstract: true,
				views: {
					"": {
						templateUrl: 'client/dashboard/index.ng.html',
						controller: 'DashboardController',
						controllerAs: 'dashboard',
					},
					"leftSidebar@dashboard": {
						templateUrl: 'client/dashboard/sidebar.ng.html',
						controller: 'LeftDashboardSidebarController',
						controllerAs: 'leftNavbar'
					}
				}
			}).state('dashboard.tags', {
				url: '/tags',
				templateUrl: 'client/dashboard/tags.ng.html',
				controller: 'SearchByTagsController',
				controllerAs: 'searchByTags'
			}).state('dashboard.timestamps', {
				url: '/timestamps',
				templateUrl: 'client/dashboard/timestamps.ng.html',
				controller: 'SearchByTimestampsController',
				controllerAs: 'searchByTimestamps'
			});
			$urlRouterProvider.when('/dashboard', '/dashboard/tags');
		}]);
}