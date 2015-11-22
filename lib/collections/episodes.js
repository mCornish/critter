Episodes = new Mongo.Collection('episodes');

Episodes.allow({
    update: function(userId, episode) { return ownsDocument(userId, episode); },
    remove: function(userId, episode) { return ownsDocument(userId, episode); }
});

Episodes.deny({
    update: function(userId, episode, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames).length > 0);
    }
});

//Episodes.deny({
//    update: function(userId, episode, fieldNames, modifier) {
//        var errors = validateEpisode(modifier.$set);
//        return;
//    }
//});

validateEpisode = function(episode) {
    var errors = {};
    if (!episode)
        errors = 'episode';
    return errors;
};

Meteor.methods({
    episodeInsert: function(episodeAttributes) {
        check(Meteor.userId(), String);
        check(episodeAttributes, {
            number: Number,
            name: String,
            cast: [String],
            airDate: Date,
            videoId: String
        });

        var errors = validateEpisode(episodeAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-episode', 'You must set a title and image for your image.');

        var user = Meteor.user();
        var episode = _.extend(episodeAttributes, {
            userId: user._id,
            submitted: new Date()
        });
        var episodeId = Episodes.insert(episode);
        return {
            _id: episodeId
        };
    },

    episodeUpsert: function(episodeAttributes) {
        check(Meteor.userId(), String);
        check(episodeAttributes, {
            number: Number,
            cast: [String]
        });

        const epNumber = episodeAttributes.number;

        if (Episodes.find({number: epNumber}).count() > 0) {
            Episodes.update({number: epNumber}, {$set: episodeAttributes});
        } else {
            var episode = _.extend(episodeAttributes, {
                userId: Meteor.userId(),
                submitted: new Date()
            });

            Episodes.insert(episode);
        }
    }
});