/// <reference path="../typings/tsd.d.ts" />
/// <reference path="lib/interfaces.ts" />

Meteor.startup(() => {
});

interface ITagsCache {
	_id: string;
	tags: string[];
}

var TagsCache = new Mongo.Collection<ITagsCache>('tags_cache'); 

Meteor.methods({
	listTags: (forceReload: boolean = false) => {
		var cached:ITagsCache;
		
		if (!forceReload) { cached = TagsCache.findOne('cz5xdocj'); }
		
		if (!cached) {
			console.log("Getting fresh tags");
			Async.runSync(done => {
				RethinkDB.getAllTagsForCustomer('cz5xdocj').done(tags => {
					cached = {_id: 'cz5xdocj', tags: tags};
					done();
				});
			});
			TagsCache.upsert({_id: cached._id}, {$set: {tags: cached.tags}});
		}
		
		return cached.tags;
	}
});