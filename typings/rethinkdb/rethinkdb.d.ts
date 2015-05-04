// updated typedeclarations for Rethinkdb to match the needs of meteor,
// as well as RethinkDB's documentation for 2.0 drivers

/// <reference path="../bluebird/bluebird.d.ts" />

// Type definitions for Rethinkdb 1.10.0
// Project: http://rethinkdb.com/
// Definitions by: Sean Hess <https://seanhess.github.io/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// Reference: http://www.rethinkdb.com/api/#js
// TODO: Document manipulation and below

declare module rethinkdb {
  export function connect(host:ConnectionOptions, cb:(err:Error, conn:Connection)=>void);
  export function connect(host:string, cb:(err:Error, conn:Connection)=>void);
  export function connect(host:ConnectionOptions):Promise<Connection>;
  export function connect(host:string):Promise<Connection>;

  export function dbCreate(name:string):Operation<CreateResult>;
  export function dbDrop(name:string):Operation<DropResult>;
  export function dbList():Operation<string[]>;

  export function db(name:string):Db;
  export function table(name:string, options?:{useOutdated:boolean, identifierFormat?:string}):Table;

  export function asc(property:string):Sort;
  export function desc(property:string):Sort;

  export var count:Aggregator;
  export function sum(prop:string):Aggregator;
  export function avg(prop:string):Aggregator;

  export function row(name:string):Expression<any>;
  export function expr(stuff:any):Expression<any>;

  export function now():Time;

  // Control Structures
  export function branch(test:Expression<boolean>, trueBranch:Expression<any>, falseBranch:Expression<any>):Expression<any>;
  
  export var minval:any;
  export var maxval:any;

  interface EventEmitter {
    addListener(event:string, listener:Function);
    on(event:string, listener:Function);
    once(event:string, listener:Function);
    removeListener(event:string, listener:Function);
    removeAllListener(event?:string);
    setMaxListeners(n:number);
    listeners(event:string);
    emit(event:string, ...args:any[]);
  }
  
  interface Cursor extends EventEmitter {
    hasNext():boolean;
    each(cb:(err:Error, row:any)=>void, done?:()=>void);
    each(cb:(err:Error, row:any)=>boolean, done?:()=>void); // returning false stops iteration
    next(cb:(err:Error, row:any) => void);
    next():Promise<any>;
    toArray(cb:(err:Error, rows:any[]) => void);
    toArray():Promise<any[]>;
    close();
  }

  interface ConnectionOptions {
    /**
     * @default 'localhost'
     */
    host:string;
    /**
     * @default 28015
     */
    port:number;
    /**
     * @default 'test'
     */
    db?:string;
    /**
     * @default null
     */
    authKey?:string;
    /**
     * @default 20 (seconds)
     */
     timeout?:number;
  }
  
  interface CloseAndReconnectOptions {
    /**
     * By setting it to false, the connection will be closed immediately,
     * possibly aborting any outstanding noreply writes.
     * @default true
     */
    noreplyWait?: boolean;
  }

  interface Connection extends EventEmitter {
    close(options:CloseAndReconnectOptions, cb:(err:Error)=>void);
    close(cb:(err:Error)=>void);
    close(options?:CloseAndReconnectOptions):Promise<void>;
    
    reconnect(options:CloseAndReconnectOptions, cb:(err:Error, conn:Connection)=>void);
    reconnect(cb:(err:Error, conn:Connection)=>void);
    reconnect(options?:CloseAndReconnectOptions):Promise<Connection>;
    
    use(dbName:string);    
        
    noreplyWait(cb:Function);
    noreplyWait():Promise<void>
  }

  interface Db {
    tableCreate(name:string, options?:TableOptions):Operation<CreateResult>;
    tableDrop(name:string):Operation<DropResult>;
    tableList():Operation<string[]>;
    table(name:string, options?:GetTableOptions):Table;
  }

  interface TableOptions {
    /**
     * @default 'id'
     */
    primary_key?:string;
    /**
     * If set to soft, writes will be acknowledged by the server immediately and flushed to disk in the background.
     * @default 'hard'
     */
    durability?:string;
    /**
     * @default 1
     */
    shards?:number;
    /**
     * @default 1
     */
    replicas?:number|{[tag:string]:number};
    primaryReplicaTag?:string;
  }

  interface GetTableOptions {
    useOutdated: boolean;
  }

  interface Writeable {
    update(obj:Object, options?:UpdateOptions):Operation<WriteResult>;
    replace(obj:Object, options?:UpdateOptions):Operation<WriteResult>;
    replace(expr:ExpressionFunction<any>):Operation<WriteResult>;
    delete(options?:UpdateOptions):Operation<WriteResult>;
  }

  interface IndexOptions {
    multi?:boolean;
    geo?:boolean;
  }
  
  interface IndexInfo {
    index:string;
    ready:boolean;
    multi:boolean;
    outdated:boolean;    
  }
  
  interface IndexStatus extends IndexInfo {
    blocks_processed?:number;
    blocks_total?:number;
    function:any;
    geo:boolean;
  }

  interface Table extends Sequence {
    indexCreate(name:string, index?:ExpressionFunction<any>|ExpressionFunction<any>[], options?:IndexOptions):Operation<CreateResult>;
    indexCreate(name:string, options?:IndexOptions):Operation<CreateResult>;
    indexDrop(name:string):Operation<DropResult>;
    indexList():Operation<string[]>;
    indexRename(oldName:string, newName:string, options?:{overwrite:boolean});
    indexStatus(...indexNames:string[]):Operation<IndexStatus[]>;
    indexWait(...indexNames:string[]):Operation<IndexInfo[]>;    

    insert(obj:any|any[], options?:InsertOptions):Operation<WriteResult>;
    sync():Operation<{synced:number}>;

    get(key:string):Sequence; // primary key
    getAll(key:string, ...keys:string[]):Sequence; // without index defaults to primary key
    getAll(key:string, key2:string, index?:Index):Sequence; // without index defaults to primary key
    getAll(key:string, key2:string, key3:string, index?:Index):Sequence; // without index defaults to primary key
    getAll(key:string, key2:string, key3:string, key4:string, index?:Index):Sequence; // without index defaults to primary key
    getAll(key:string, key2:string, key3:string, key4:string, key5:string, index?:Index):Sequence; // without index defaults to primary key
    getAll(key:string, key2:string, key3:string, key4:string, key5:string, key6:string, index?:Index):Sequence; // without index defaults to primary key
    getAll(key:string, key2:string, key3:string, key4:string, key5:string, key6:string, key7:string, index?:Index):Sequence; // without index defaults to primary key
    getAll(key:string, key2:string, key3:string, key4:string, key5:string, key6:string, key7:string, key8:string, index?:Index):Sequence; // without index defaults to primary key
    getAll(key:string, key2:string, key3:string, key4:string, key5:string, key6:string, key7:string, key8:string, key9:string, index?:Index):Sequence; // without index defaults to primary key

    between(lowerKey:any, upperKey:any, index?:Index):Sequence;
  }

  interface Sequence extends Operation<Cursor>, Writeable {

    filter(rql:ExpressionFunction<boolean>,options?:{default:boolean}):Sequence;
    filter(rql:Expression<boolean>,options?:{default:boolean}):Sequence;
    filter(obj:{[key:string]:any},options?:{default:boolean}):Sequence;

    // Join
    // these return left, right
    innerJoin(sequence:Sequence, join:JoinFunction<boolean>):Sequence;
    outerJoin(sequence:Sequence, join:JoinFunction<boolean>):Sequence;
    eqJoin(leftAttribute:string, rightSequence:Sequence, index?:Index):Sequence;
    eqJoin(leftAttribute:ExpressionFunction<any>, rightSequence:Sequence, index?:Index):Sequence;
    zip():Sequence;

    // Transform
    map(transform:ExpressionFunction<any>):Sequence;
    withFields(...selectors:any[]):Sequence;
    concatMap(transform:ExpressionFunction<any>):Sequence;
    orderBy(...keys:string[]):Sequence;
    orderBy(...sorts:Sort[]):Sequence;
    skip(n:number):Sequence;
    limit(n:number):Sequence;
    slice(start:number, end?:number):Sequence;
    nth(n:number):Expression<any>;
    indexesOf(obj:any):Sequence;
    isEmpty():Expression<boolean>;
    union(sequence:Sequence):Sequence;
    sample(n:number):Sequence;

    // Aggregate
    reduce(r:ReduceFunction<any>, base?:any):Expression<any>;
    count():Expression<number>;
    distinct():Sequence;
    groupedMapReduce(group:ExpressionFunction<any>, map:ExpressionFunction<any>, reduce:ReduceFunction<any>, base?:any):Sequence;
    groupBy(...aggregators:Aggregator[]):Expression<Object>; // TODO: reduction object
    contains(prop:string):Expression<boolean>;

    // Manipulation
    pluck(...props:string[]):Sequence;
    without(...props:string[]):Sequence;
  }

  interface ExpressionFunction<U> {
    (doc:Expression<any>):Expression<U>; 
  }

  interface JoinFunction<U> {
    (left:Expression<any>, right:Expression<any>):Expression<U>; 
  }

  interface ReduceFunction<U> {
    (acc:Expression<any>, val:Expression<any>):Expression<U>;
  }

  interface InsertOptions {
    durability?: string; // 'hard' (other option: 'soft')
    returnChanges?: boolean; // false
    conflict?: string; // 'error' (other options: 'replace', or 'update')
  }

  interface UpdateOptions {
    nonAtomic?: boolean; // false
    durability?: string; // 'hard' (other option: 'soft')
    returnChanges?: boolean; // false    
  }

  interface WriteResult {
    inserted: number;
    replaced: number;
    unchanged: number;
    errors: number;
    deleted: number;
    skipped: number;
    first_error: Error;
    generated_keys: string[]; // only for insert
  }

  interface JoinResult {
    left:any;
    right:any;
  }

  interface CreateResult {
    created: number;
  }

  interface DropResult {
    dropped: number;
  }

  interface Index {
    index: string;
    leftBound?: string; // 'closed'
    rightBound?: string; // 'open'
  }

  interface Expression<T> extends Writeable, Operation<T> {
      (prop:string):Expression<any>; 
      merge(query:Expression<Object>):Expression<Object>;
      append(prop:string):Expression<Object>;
      contains(prop:string):Expression<boolean>;

      and(b:boolean):Expression<boolean>;
      or(b:boolean):Expression<boolean>;
      eq(v:any):Expression<boolean>;
      ne(v:any):Expression<boolean>;
      not():Expression<boolean>;

      gt(value:T):Expression<boolean>;
      ge(value:T):Expression<boolean>;
      lt(value:T):Expression<boolean>;
      le(value:T):Expression<boolean>;

      add(n:number):Expression<number>;
      sub(n:number):Expression<number>;
      mul(n:number):Expression<number>;
      div(n:number):Expression<number>;
      mod(n:number):Expression<number>;

      hasFields(...fields:string[]):Expression<boolean>;

      default(value:T):Expression<T>;
  }

  interface Options {
    /**
     * Whether or not outdated reads are OK.
     * @default false
     */
    useOutdated?: boolean;
    /**
     * Wat format to return times in (default: 'native'). 
     * Set this to 'raw' if you want times returned as JSON objects for exporting.
     * @default 'native'
     */
    timeFormat?: string;
    /**
     * Whether or not to return a profile of the query’s execution
     * @default false
     */
    profile?: boolean;
    /**
     * Possible values are 'hard' and 'soft'. 
     * In soft durability mode RethinkDB will acknowledge the write immediately after receiving it, 
     * but before the write has been committed to disk.
     */
    durability?: string;
    /**
     * What format to return grouped_data and grouped_streams in (default: 'native'). 
     * Set this to 'raw' if you want the raw pseudotype.
     * @default 'native'
     */
    groupFormat?: string;
    /**
     * Set to true to not receive the result object or cursor and return immediately.
     * @default false
     */
    noreply?: boolean;
    /**
     * The database to run this query against as a string. 
     * The default is the database specified in the db parameter to connect (which defaults to 'test'). 
     * The database may also be specified with the db command.
     */
    db?: string;
    /**
     * The maximum numbers of array elements that can be returned by a query. 
     * This affects all ReQL commands that return arrays. 
     * Note that it has no effect on the size of arrays being written to the database; 
     * those always have an upper limit of 100,000 elements.
     * @default 100,000 (100 thousand)
     */
    arrayLimit?: number;
    /**
     * What format to return binary data in (default: 'native'). 
     * Set this to 'raw' if you want the raw pseudotype.
     * @default 'native'
     */
    binaryFormat?: string;
    /**
     * Minimum number of rows to wait for before batching a result set (default: 8). 
     * This is an integer.
     * @default 8
     */
    minBatchRows?: number;
    /**
     * Maximum number of rows to wait for before batching a result set (default: unlimited). 
     * This is an integer.
     */
    maxBatchRows?: number;
    /**
     * Maximum number of bytes to wait for before batching a result set (default: 1024). 
     * This is an integer.
     * @default 1024
     */
    maxBatchBytes?: number;
    /**
     * Maximum number of seconds to wait before batching a result set (default: 0.5). 
     * This is a float (not an integer) and may be specified to the microsecond.
     * @default 0.5
     */
    maxBatchSeconds?: number;
    /**
     * Factor to scale the other parameters down by on the first batch (default: 4). 
     * For example, with this set to 8 and maxBatchRows set to 80, 
     * on the first batch maxBatchRows will be adjusted to 10 (80 / 8). 
     * This allows the first batch to return faster.
     * @default 4
     */
    firstBatchScaledownFactor?: number;
  }

  interface Operation<T> {
    run(conn:Connection, options:Options, cb:(err:Error, result:T)=>void); 
    run(conn:Connection, cb:(err:Error, result:T)=>void); 
    run(conn:Connection, options?:Options): Promise<T>; 
  }

  interface Aggregator {}
  interface Sort {}

  interface Time {}


  // http://www.rethinkdb.com/api/#js
  // TODO control structures
}