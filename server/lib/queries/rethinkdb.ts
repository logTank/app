/// <reference path="interfaces.ts" />

var r: IRethinkdbModule = Meteor.npmRequire('rethinkdb');
//var r = Meteor.npmRequire('rethinkdbdash')({
//		servers: [{host: 'localhost', port: 28015}]
//	});

class RethinkDBLogic {
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

declare var RethinkDB: new () => RethinkDBLogic;
RethinkDB = RethinkDBLogic;