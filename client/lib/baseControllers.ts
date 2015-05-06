/// <reference path="../tsd.d.ts" />

module logtank {
	export class SidebarEnabledController {
		public toggleLeft: Function;
		public toggleRight: Function;
		
		constructor(private $mdSidenav: angular.material.MDSidenavService, private $mdUtil: any, leftNavbarId?: string, rightNavbarId?: string) {
			if (leftNavbarId) { this.toggleLeft = this.buildToggler(leftNavbarId); }
			if (rightNavbarId) { this.toggleRight = this.buildToggler(rightNavbarId); }
		}
		
		private buildToggler(navID: string): Function {
			var debounceFn = this.$mdUtil.debounce(() => {
				this.$mdSidenav(navID).toggle()
			}, 300);
			return debounceFn;
		}
	}
	
	export class SidebarController {
		constructor(private navID: string, private $mdSidenav: angular.material.MDSidenavService) {	}
		
		public close() {
			this.$mdSidenav(this.navID).close();
		}
	}	
}
