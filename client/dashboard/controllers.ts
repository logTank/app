/// <reference path="../tsd.d.ts" />
/// <reference path="../lib/tsd.d.ts" />

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
		public tags = {
			available: <string[]>[],
			selected: <string[]>[],
			currentTag: <string>null,
			searchText: ''
		}
	
		public conditions: {
			fieldName?: string;
			fieldType?: string;
			conditionValue?: string;
		}[] = [];
	
		constructor(private $meteor: any) {
			$meteor.call('listTags').then(tags => {
				this.tags.available = tags;
			});
			
			this.conditions.push({fieldName: 'LoggerLevel', fieldType: 'string', conditionValue: 'error'},
								{fieldName: 'location.host', fieldType: 'string', conditionValue: 'localhost'});
		}
		
		public filteredTags() {
			var query = this.tags.searchText;
			if (query && query.length) {
				var elementsMatchingQuery = this.tags.available.filter(createSimpleFilterFor(query));
				return except(elementsMatchingQuery, this.tags.selected);
			} else {
				return [];
			}
		}
		
		public appendCondition() {
			this.conditions.push({});
		}
		
		public removeCondition(index: number) {
			this.conditions.splice(index, 1);
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
				controllerAs: 'ctrl'
			}).state('dashboard.timestamps', {
				url: '/timestamps',
				templateUrl: 'client/dashboard/timestamps.ng.html',
				controller: 'SearchByTimestampsController',
				controllerAs: 'ctrl'
			});
			$urlRouterProvider.when('/dashboard', '/dashboard/tags');
		}]);
}