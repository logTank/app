/// <reference path="interfaces.ts" />

module logtank {
	var r = Meteor.npmRequire('rethinkdb');
	
	export class RethinkDB {
		private connectionPromise: Promise<rethinkdb.Connection>;
		
		public getConnection(): Promise<rethinkdb.Connection> {
			if (!this.connectionPromise) {
				this.connectionPromise = r.connect({db: 'logtank_store'}); 
			}
			return this.connectionPromise;
		}
		
		public getAllTagsForUser(userId: string): Promise<string[]> {
			return this.getConnection().then(conn => {
				return r.table(userId).distinct({index: 'tag'}).run(conn);
			}).then(cursor => {
				return cursor.toArray();
			})
		}
	}	
}