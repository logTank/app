/// <reference path="../typings/tsd.d.ts" />
/// <reference path="lib/interfaces.ts" />

module logtank {
	interface ITagsCache {
		_id: string;
		tags: string[];
	}
	
	var TagsCache = new Mongo.Collection<ITagsCache>('tags_cache'); 
	
	Meteor.methods({
		listTags: (forceReload: boolean = false) => {
			var cached:ITagsCache;
			
			if (!forceReload) { cached = TagsCache.findOne(customerId()); }
			
			if (!cached) {
				Async.runSync(done => {
					RethinkDB.getAllTagsForCustomer(customerId()).done(tags => {
						cached = {_id: customerId(), tags: tags};
						done();	
					});
				});
				TagsCache.upsert({_id: cached._id}, {$set: {tags: cached.tags}});
			}
			
			return cached.tags;
		}
	});	
	
	Meteor.publish('logs_by_tags', function(queryId: string, tags: string[], conditions: IQueryCondition[]) {
		var me = <Subscription>this;
		
		validateTagsQueryParams(queryId, tags, conditions);
		RethinkDB.queryByTags(customerId(), tags, conditions).done(data => {
			data.forEach(item => {
				item.$_queryId = queryId;
				me.added('logs_by_tags', item.id, item);
			});
		});
	});
	
	Meteor.startup(() => {
		console.log("Meteor started in main.ts")
	});
	
	function validateTagsQueryParams(queryId: string, tags: string[], conditions: IQueryCondition[]) {
		check(queryId, Match.String);
		
		if (tags && tags.length) {
			tags.forEach(t => check(t, Match.String));
		} else {
			throw new Meteor.Error("At least one tag has to be selected.");
		}
		
		if (conditions && conditions.length) {
			conditions.forEach(c => {
				check(c.fieldName, Match.String);
				check(c.type, Match.Integer);
				
				switch (c.type) {
					case QueryConditionType.Boolean:
						check(c.value, Match.Boolean);
						break;
					case QueryConditionType.Number:
						check(c.value, Match.Number);
						break;
					case QueryConditionType.String:
					case QueryConditionType.RegExp:
						check(c.value, Match.String);
						break;
					default:
						throw new Meteor.Error("Invalid condition-type selected.");
				}
			});
		}
	}
	
	function customerId() {
		return 'cz5xdocj';
	}
}