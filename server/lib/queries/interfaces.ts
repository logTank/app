/// <reference path="../interfaces.ts" />

import Connection = rethinkdb.Connection;
import ConnectionOptions = rethinkdb.ConnectionOptions;
import Expression = rethinkdb.Expression;
import ExpressionFunction = rethinkdb.ExpressionFunction;
import Operation = rethinkdb.Operation;
import Sequence = rethinkdb.Sequence;
import CreateResult = rethinkdb.CreateResult;
import DropResult = rethinkdb.DropResult;
import Db = rethinkdb.Db;
import Table = rethinkdb.Table;
import Sort = rethinkdb.Sort;
import Aggregator = rethinkdb.Aggregator;
import Time = rethinkdb.Time;

interface IRethinkdbModule {
  minval:any;
  maxval:any;
  
  connect(host:ConnectionOptions, cb:(err:Error, conn:Connection)=>void);
  connect(host:string, cb:(err:Error, conn:Connection)=>void);
  connect(host:ConnectionOptions): Promise<Connection>;
  connect(host:string): Promise<Connection>;
  
  dbCreate(name:string): Operation<CreateResult>;
  dbDrop(name:string): Operation<DropResult>;
  dbList():Operation<string[]>;

  db(name:string):Db;
  table(name:string, options?:{useOutdated:boolean; identifierFormat?:string}):Table;

  asc(property:string):Sort;
  desc(property:string):Sort;

  count:Aggregator;
  sum(prop:string):Aggregator;
  avg(prop:string):Aggregator;

  row(name:string):Expression<any>;
  expr(stuff:any):Expression<any>;

  now():Time;

  // Control Structures
  branch(test:Expression<boolean>, trueBranch:Expression<any>, falseBranch:Expression<any>):Expression<any>;
  
  map(s:Sequence, transform:ExpressionFunction<any>):Sequence;
  map(s:Sequence, s2:Sequence, transform:ExpressionFunction<any>):Sequence;
  map(s:Sequence, s2:Sequence, s3:Sequence, transform:ExpressionFunction<any>):Sequence;
  map(s:Sequence, s2:Sequence, s3:Sequence, s4:Sequence, transform:ExpressionFunction<any>):Sequence;
  map(s:Sequence, s2:Sequence, s3:Sequence, s4:Sequence, s5:Sequence, transform:ExpressionFunction<any>):Sequence;
  map(s:Sequence, s2:Sequence, s3:Sequence, s4:Sequence, s5:Sequence, s6:Sequence, transform:ExpressionFunction<any>):Sequence;
  map(s:Sequence, s2:Sequence, s3:Sequence, s4:Sequence, s5:Sequence, s6:Sequence, s7:Sequence, transform:ExpressionFunction<any>):Sequence;
  map(s:Sequence, s2:Sequence, s3:Sequence, s4:Sequence, s5:Sequence, s6:Sequence, s7:Sequence, s8:Sequence, transform:ExpressionFunction<any>):Sequence;
  map(s:Sequence, s2:Sequence, s3:Sequence, s4:Sequence, s5:Sequence, s6:Sequence, s7:Sequence, s8:Sequence, s9:Sequence, transform:ExpressionFunction<any>):Sequence;
}