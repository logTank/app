/// <reference path="interfaces.ts" />

module logtank {
	var r: IRethinkdbModule = Meteor.npmRequire('rethinkdb');
	
	export class RethinkDB {
		private static connectionOptions: rethinkdb.ConnectionOptions = {
			host: process.env.RETHINKDB_HOST || 'localhost',
			port: process.env.RETHINKDB_PORT || 28015,
			db: process.env.RETHINKDB_LOGTANK_DB || 'logtank_store',
			authKey: process.env.RETHINKDB_AUTH_KEY || null,
			timeout: process.env.RETHINKDB_TIMEOUT || 20
		};
		private connectionPromise: Promise<rethinkdb.Connection>;
		private connection: rethinkdb.Connection;
				
		constructor(private customerId: string) {} 
		
		public static getAllTagsForCustomer(customerId: string): Promise<string[]> {
			var rethink = new RethinkDB(customerId);
			
			return rethink.getAllTagsForCustomer().then(tags => {
				rethink.dispose();
				return tags;
			});
		}
		
		public static queryByTags(customerId: string, tags: string[], conditions: IQueryCondition[]) {
			var rethink = new RethinkDB(customerId);
			
			return rethink.queryByTags(tags, conditions).then(data => {
				rethink.dispose;
				return data;
			});
		}
			
		public getAllTagsForCustomer(): Promise<string[]> {
			var promise = this.getConnection();
			var seq = this.getTable().distinct(this.getTagIndex());
			
			return promise.then(conn => {
				return seq.run(conn);
			}).then(cursor => {
				return cursor.toArray();
			});
		}
		
		public queryByTags(tags: string[], conditions: IQueryCondition[]) {
			var promise = this.getConnection();
			var seq = this.getAllInArray(this.getTable(), tags, this.getTagIndex());
			
			seq = this.checkAllFieldsExists(seq, conditions);
			seq = this.applyConditionBasedFilter(seq, conditions);
			seq.limit(100);
			
			return promise.then(conn => {
				return seq.run(conn);
			}).then(cursor => {
				return cursor.toArray();
			});
		}
		
		public dispose() {
			if (this.connectionPromise) {
				this.connectionPromise.cancel();
			}
			if (this.connection) {
				this.connection.close();
			}
		}
		
		private getTable(): rethinkdb.Table {
			return r.table(this.customerId);
		}
		
		private getConnection(): Promise<rethinkdb.Connection> {
			if (!this.connectionPromise) {
				this.connectionPromise = r.connect(RethinkDB.connectionOptions);
				this.connectionPromise.then(conn => {
					this.connection = conn;
				});
			}
			return this.connectionPromise;
		}
		
		private getAllInArray(table: rethinkdb.Table, keys: any[], index: rethinkdb.Index): rethinkdb.Sequence {
			var getAllArgs: any[] = [];
			
			keys.forEach(key => getAllArgs.push(key));
			getAllArgs.push(index);
			
			return <rethinkdb.Sequence>table.getAll.apply(table, getAllArgs);
		}
		
		private checkAllFieldsExists(seq: rethinkdb.Sequence, conditions: IQueryCondition[]) {
			var requiredFields:Object = {};
			var atleastOneFieldChecked = false;
			
			conditions.forEach(c => {
				this.setPropertyOfStringPath(requiredFields, c.fieldName, true);
				atleastOneFieldChecked = true;
			});
			return seq.withFields(requiredFields);
		}
		
		private applyConditionBasedFilter(seq: rethinkdb.Sequence, conditions: IQueryCondition[]) {
			conditions.forEach(c => {
				seq = seq.filter(this.translateConditionToFilterExpression(c));
			});
			return seq;
		}		
		
		private translateConditionToFilterExpression(condition: IQueryCondition): rethinkdb.Expression<boolean>|any {
			var exp = this.getExpressionForStringPath(condition.fieldName);
			
			if (condition.type === QueryConditionType.RegExp) {
				return (<rethinkdb.ExpressionString>exp).match(<string>condition.value);				
			} else {
				return exp.eq(condition.value);
			}
		}
		
		private getExpressionForStringPath(expressionPath: string): rethinkdb.Expression<any> {
			var parts = expressionPath.split('.');
			var exp = r.row(parts[0]);
			
			for (var i = 1; i < parts.length; i++) {
				exp = exp(parts[i]);
			}
			
			return exp;
		}
		
		private setPropertyOfStringPath(baseObject:Object, propertiesPath: string, value: any): void {
			var parts = propertiesPath.split('.');
			var lastIndex = parts.length - 1;
			
			for (var i = 0; i < parts.length; i++) {
				var propertyName = parts[i];
				
				if (i === lastIndex) {
					baseObject[propertyName] = value;
				} else {
					if (this.isNotAnObject(baseObject[propertyName])) {
						baseObject[propertyName] = {};
					}
					baseObject = baseObject[propertyName];
				}
			}
		}

		private isNotAnObject(value: any): boolean {
			if (!value) {
				return true;
			} else if (typeof value !== 'object') {
				return true;
			} else {
				return false;
			}
		}
		
		private getTagIndex(): rethinkdb.Index {
			return {index: 'tag'};
		}
	}	
}