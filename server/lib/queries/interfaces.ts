/// <reference path="../../../typings/tsd.d.ts" />

interface IRethinkdbModule {
  minval:any;
  maxval:any;
  
  connect(host:rethinkdb.ConnectionOptions, cb:(err:Error, conn:rethinkdb.Connection)=>void);
  connect(host:string, cb:(err:Error, conn:rethinkdb.Connection)=>void);
  connect(host:rethinkdb.ConnectionOptions): Promise<rethinkdb.Connection>;
  connect(host:string): Promise<rethinkdb.Connection>;
  
  dbCreate(name:string): rethinkdb.Operation<rethinkdb.CreateResult>;
  dbDrop(name:string): rethinkdb.Operation<rethinkdb.DropResult>;
  dbList():rethinkdb.Operation<string[]>;

  db(name:string):rethinkdb.Db;
  table(name:string, options?:{useOutdated:boolean, identifierFormat?:string}):rethinkdb.Table;

  asc(property:string):rethinkdb.Sort;
  desc(property:string):rethinkdb.Sort;

  count:rethinkdb.Aggregator;
  sum(prop:string):rethinkdb.Aggregator;
  avg(prop:string):rethinkdb.Aggregator;

  row(name:string):rethinkdb.Expression<any>;
  expr(stuff:any):rethinkdb.Expression<any>;

  now():rethinkdb.Time;

  // Control Structures
  branch(test:rethinkdb.Expression<boolean>, trueBranch:rethinkdb.Expression<any>, falseBranch:rethinkdb.Expression<any>):rethinkdb.Expression<any>;
}