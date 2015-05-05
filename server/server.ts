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
	listTags: () => {
		var cached = TagsCache.findOne('cz5xdocj');
		
		if (!cached) {
			Async.runSync(done => {
				new RethinkDB().getAllTagsForUser('cz5xdocj').then(tags => {
					cached = {_id: 'cz5xdocj', tags: tags};
					TagsCache.upsert({_id: 'cz5xdocj'}, {$set: {tags: tags}});
					done();	
				});
			});
		} else {
			console.log('Got tags from cache');
		}
		
		return cached.tags;
	}
});