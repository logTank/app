/// <reference path="../tsd.d.ts" />
/// <reference path="../lib/baseControllers.ts" />

var leftNavbarId = 'leftNavbar';
var rightNavbarId = 'rightNavbar';

module logtank {
	class MainController extends SidebarEnabledController {
		public availableTags: string[];
	
		constructor($mdSidenav: angular.material.MDSidenavService, $mdUtil: any, private $meteor: any) {
			super($mdSidenav, $mdUtil, leftNavbarId, rightNavbarId);
			$meteor.call('listTags').then(tags => {
				this.availableTags = tags;
			});
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
		.controller('MainController', ['$mdSidenav', '$mdUtil', '$meteor', MainController])
		.controller('LeftNavbarController', ['$mdSidenav', LeftNavbarController])
		.controller('RightNavbarController', ['$mdSidenav', RightNavbarController]);	
}
