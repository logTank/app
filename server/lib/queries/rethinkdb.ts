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
				
		constructor(private customerId: string) {
			this.getConnection();
		} 
		
		public static getAllTagsForCustomer(customerId: string): Promise<string[]> {
			var rethink = new RethinkDB(customerId);
			
			return rethink.getAllTagsForCustomer().then(tags => {
				rethink.dispose();
				return tags;
			});
		}
		
		public static queryByTags(customerId: string, tags: string[], conditions: IQueryCondition[]): Promise<any[]> {
			var rethink = new RethinkDB(customerId);
			return <Promise<any[]>>rethink.queryByTags(tags, conditions);
		}
			
		public getAllTagsForCustomer(): Promise<string[]> {
			var seq = this.getTable().distinct(this.getTagIndex());
			
			return this.getConnection().then(conn => {
				return seq.run(conn);
			}).then(cursor => {
				return cursor.toArray();
			});
		}
		
		public queryByTags(tags: string[], conditions: IQueryCondition[], dataFeedCb?: (err, item) => void): Promise<any[]>|Function {
			var seq = this.getAllInArray(this.getTable(), tags, this.getTagIndex());
			
			seq = this.checkAllFieldsExist(seq, conditions);
			seq = this.applyConditionBasedFilter(seq, conditions);
			
			return this.runQueryAndReturnData(seq, dataFeedCb);
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
		
		private checkAllFieldsExist(seq: rethinkdb.Sequence, conditions: IQueryCondition[]) {
			var requiredFields:Object = {};
			var atleastOneFieldChecked = false;
			
			conditions.forEach(c => {
				this.setPropertyOfStringPath(requiredFields, c.fieldName, true);
				atleastOneFieldChecked = true;
			});
			return seq.hasFields(requiredFields);
		}
		
		private applyConditionBasedFilter(seq: rethinkdb.Sequence, conditions: IQueryCondition[]) {
			conditions.forEach(c => {
				seq = seq.filter(this.translateConditionToFilterExpression(c));
			});
			return seq;
		}		
		
		private runQueryAndReturnData(seq: rethinkdb.Sequence, dataFeedCb?: (err, item) => void): Promise<any[]>|Function {
			var cursors: { data?: rethinkdb.Cursor; feed?: rethinkdb.Cursor } = {};
			
			var promise = this.getConnection().then(conn => {
				var queryPromise = seq.limit(100).run(conn);
				
				if (dataFeedCb) { this.subscribeToFeed(seq, conn, cursors, dataFeedCb); }
				return queryPromise;
			}).then(cursor => {
				if (dataFeedCb) {
					cursors.data = cursor;
					cursor.each(dataFeedCb);
				} else {
					return cursor.toArray();
				}
			});
			
			if (dataFeedCb) {
				return this.getFeedSubscriptionDisposal(cursors);
			} else {
				return promise;
			}
		}
		
		private subscribeToFeed(seq: rethinkdb.Sequence, conn: rethinkdb.Connection, cursorCache: {feed?: rethinkdb.Cursor}, dataFeedCb: (err, item) => void) {
			seq.changes().run(conn).then(cursor => {
				cursorCache.feed = cursor;
				cursor.each((err, item) => {
					if (err) {
						dataFeedCb(err, null);
					} else if (item.new_val) {
						dataFeedCb(null, item.new_val);
					}
				});
			});
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
		
		private getFeedSubscriptionDisposal(cursors: { data?: rethinkdb.Cursor; feed?: rethinkdb.Cursor }) {
			return () => {
				if (cursors.feed) { cursors.feed.close(); }
				if (cursors.data) { cursors.data.close(); }
				this.dispose();
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