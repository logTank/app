/// <reference path="tsd.d.ts" />
module logtank {
	export enum QueryConditionType {
		String, Number, Boolean, RegExp
	}
	
	export interface IQueryCondition {
		fieldName: string;
		type: QueryConditionType;
		value: string|number|boolean;
	}
	
	export interface IDictionary<T> extends IStringDictionary<T>, INumberDictionary<T> { }
	
	export interface IStringDictionary<T> { [key: string]: T; }
	export interface INumberDictionary<T> { [key: number]: T; }
}

