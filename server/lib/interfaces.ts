/// <reference path="../../lib/tsd.d.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="queries/rethinkdb.ts" />


declare module Meteor {
	/**
	 * @deprecated use npmRequire instead
	 */
	export function require(name: string): any;
	export function npmRequire(name: string): any;
	
	/**
	 * @deprecated use Async.runSync instead
	 */
	export function sync(asyncFunction: (done: Function)=>void);
}

declare module Async {
	export function runSync(asyncFunction: (done: Function)=>void);
	
	export function wrap(asyncFunction: Function): Function;
	export function wrap(object: Object, functionName: string): Function;
	export function wrap(object: Object, functionNames: string[]): Object;
}