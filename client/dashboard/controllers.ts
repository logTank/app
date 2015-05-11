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
		private result: {
			handle?: Meteor.SubscriptionHandle;
			logs?: angular.meteor.AngularMeteorCollection<{}>;
			serialized?: string;
		};
	
		constructor(private $scope: angular.meteor.IScope, private $meteor: angular.meteor.IMeteorService) {
			$meteor.call<string[]>('listTags').then(tags => {
				this.tags.available = tags;
			});
			
			$meteor.autorun($scope, () => {
				var result = $scope.getReactively('ctrl.result.logs');
				if (!this.result) return;
				
				if (result) { 
					this.result.serialized = JSON.stringify(result,  (key, value) => {
						if (key === '_$queryId') {
							return undefined;
						} else {
							return value;
						}
					}, 2);
				} else {
					this.result.serialized = '';
				}
			})
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
			
			if (this.result) {
				this.result.handle.stop();
				this.result.logs.remove();
				this.result.serialized = '';
				this.result = null;
			}
			this.$scope.subscribe('logs_by_tags', queryId, this.tags.selected, this.getTranslatedConditionsForServer()).then(subscriptionHandle => {
				this.result = { 
					handle: subscriptionHandle, 
					logs: this.$meteor.collection(() => collection.find({_$queryId: queryId})) 
				};
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
		.controller('SearchByTagsController', ['$scope', '$meteor', SearchByTagsController])
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