/// <reference path="../tsd.d.ts" />
/// <reference path="../lib/tsd.d.ts" />

module logtank {
	var collection = new Mongo.Collection<any>('logs_by_tags');
	var leftSidebarId = 'leftNavbar';
	
	interface IClientQueryCondition extends IQueryCondition {
		rawType: string;
		rawValue: string;
	}
	
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
	
		public conditions: IClientQueryCondition[] = [];
		
		public samplelogs;
	
		constructor(private $meteor: angular.meteor.IMeteorService) {
			$meteor.call<string[]>('listTags').then(tags => {
				this.tags.available = tags;
			});
			
//			this.conditions.push({fieldName: 'LoggerLevel', type: QueryConditionType.String, value: 'error'},
//								{fieldName: 'location.host', type: QueryConditionType.String, value: 'localhost'});
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
			this.conditions.push(<any>{});
		}
		
		public removeCondition(index: number) {
			this.conditions.splice(index, 1);
		}
		
		public runQuery() {
			var queryId = Random.id();
			this.$meteor.subscribe('logs_by_tags', queryId, this.tags.selected, this.conditions).then(subscriptionHandle => {
				this.samplelogs = this.$meteor.collection(collection);
			}, err => {
				console.error(err);
			});
		}
		
		private getTranslatedConditionsForServer() {
			var ret: IQueryCondition[] = [];
			
			if (this.conditions && this.conditions.length) {
				this.conditions.forEach(c => {
					ret.push({
						fieldName: c.fieldName,
						type: QueryConditionType[c.rawType],
						value: this.convertConditionValueProperly(c)
					});
				});
			}
			return ret;
		}
		
		private convertConditionValueProperly(condition: IClientQueryCondition): string|number|boolean {
			switch (QueryConditionType[condition.rawType]) {
				case QueryConditionType.Boolean: return !!condition.rawValue;
				case QueryConditionType.Number: return +condition.rawValue;
				case QueryConditionType.String:
				case QueryConditionType.RegExp: return condition.rawValue;
				default: throw new Error('Invalid QueryConditionType: ' + condition.rawType);
			}
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