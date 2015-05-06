/// <reference path="interfaces.ts" />

var r: IRethinkdbModule = Meteor.npmRequire('rethinkdb');

class RethinkDBLogic {
	private static connectionOptions: rethinkdb.ConnectionOptions = {
		host: process.env.RETHINKDB_HOST || 'localhost',
		port: process.env.RETHINKDB_PORT || 28015,
		db: process.env.RETHINKDB_LOGTANK_DB || 'logtank_store',
		authKey: process.env.RETHINKDB_AUTH_KEY || null,
		timeout: process.env.RETHINKDB_TIMEOUT || 20
	};
	private connectionPromise: Promise<rethinkdb.Connection>;
	private connection: rethinkdb.Connection;
	
	public static getAllTagsForCustomer(customerId: string): Promise<string[]> {
		var rethink = new RethinkDBLogic();
		
		return rethink.getAllTagsForCustomer(customerId).then(tags => {
			rethink.dispose();
			return tags;
		});
	}
		
	public getAllTagsForCustomer(customerId: string): Promise<string[]> {
		return this.getConnection().then(conn => {
			return r.table(customerId).distinct({index: 'tag'}).run(conn);
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
	
	private getConnection(): Promise<rethinkdb.Connection> {
		if (!this.connectionPromise) {
			this.connectionPromise = r.connect(RethinkDBLogic.connectionOptions);
			this.connectionPromise.then(conn => {
				this.connection = conn;
			});
		}
		return this.connectionPromise;
	}
}

declare var RethinkDB: {
	new (): RethinkDBLogic;
	getAllTagsForCustomer(customerId: string): Promise<string[]>;
};
RethinkDB = RethinkDBLogic;