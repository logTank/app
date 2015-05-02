/// <reference path="../tsd.d.ts" />

var leftNavbarId = 'leftNavbar';
var rightNavbarId = 'rightNavbar';

class MainController {
	public toggleLeft = this.buildToggler(leftNavbarId);
	public toggleRight = this.buildToggler(rightNavbarId);
	
	constructor(private $mdSidenav: angular.material.MDSidenavService, private $mdUtil: any) {
	}
	
	private buildToggler(navID: string): Function {
		var debounceFn = this.$mdUtil.debounce(() => {
			this.$mdSidenav(navID).toggle()
		}, 300);
		return debounceFn;
	}
}

class NavbarController {
	constructor(private navID: string, private $mdSidenav: angular.material.MDSidenavService) {	}
	
	public close() {
		this.$mdSidenav(this.navID).close();
	}
}

class LeftNavbarController extends NavbarController {
	constructor($mdSidenav: angular.material.MDSidenavService) {
		super(leftNavbarId, $mdSidenav)
	}
}

class RightNavbarController extends NavbarController {
	constructor($mdSidenav: angular.material.MDSidenavService) {
		super(rightNavbarId, $mdSidenav);
	}
}

angular.module('logtank')
	.controller('MainController', ['$mdSidenav', '$mdUtil', MainController])
	.controller('LeftNavbarController', ['$mdSidenav', LeftNavbarController])
	.controller('RightNavbarController', ['$mdSidenav', RightNavbarController]);