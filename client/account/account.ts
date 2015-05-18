/// <reference path="../tsd.d.ts" />
/// <reference path="../lib/tsd.d.ts" />

module logtank{
    
    class AccountController {
        constructor() { }
    }
    
    class LoginController {
        constructor() { }
    }
    
    class SignupController {
        constructor() { }
    }
    
    angular.module('logtank')
        .controller('AccountController', AccountController)
        .controller('LoginController', LoginController)
        .controller('SignupController', SignupController)
        .config(['$stateProvider', '$urlRouterProvider',
            ($stateProvider: angular.ui.IStateProvider, $urlRouterProvider: angular.ui.IUrlRouterProvider) => {
                $stateProvider.state('account', {
                    url: '/account',
                    abstract: true,
                    templateUrl: 'client/account/index.ng.html',
                    controller: 'AccountController',
                    controllerAs: 'ctrl'
                }).state('account.login', {
                    url: '/login',
                    templateUrl: 'client/account/login.ng.html',
                    controller: 'LoginController',
                    controllerAs: 'ctrl'
                }).state('account.signup', {
                    url: '/signup',
                    templateUrl: 'client/account/signup.ng.html',
                    controller: 'SignupController',
                    controllerAs: 'ctrl'
                });
                $urlRouterProvider.when('/account', '/account/login');
            }]);
    
}