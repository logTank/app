/// <reference path="../tsd.d.ts" />

class DashboardController {
	
}

class SearchByTagController {
	constructor(private $meteor: any) {
	}
}

angular.module('logtank')
	.controller('SearchByTagController', ['$meteor', SearchByTagController])
	.config(['$stateProvider', '$urlRouterProvider', ($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
		$stateProvider.state('dashboard', {
			url: '/dashboard',
			abstract: true,
			templateUrl: 'client/dashboard/index.ng.html',
			controller: 'DashboardController',
			controllerAs: 'dashboard'
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
	}])