Stream = new Mongo.Collection('stream');

Stream.allow({
    update: function(userId, stream) {
        return ownsDocument(userId, stream) || isAdmin(userId);
    },
    remove: function(userId, stream) {
        return ownsDocument(userId, stream) || isAdmin(userId);
    }
});

Stream.deny({
    update: function(userId, character, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames, 'giveaway', 'live', 'liveContent', 'epNumber').length > 0);
    }
});

//Characters.deny({
//    update: function(userId, characters, fieldNames, modifier) {
//        var errors = validateCharacter(modifier.$set);
//        return;
//    }
//});

validateStream = function(stream) {
    var errors = {};
    if (!stream)
        errors = 'Please include a stream';
    return errors;
};

Meteor.methods({
    incSub: function(inc) {
        check(this.userId, String);

        Stream.update({
            subCount: {$gt: 1}
        }, {
            $inc: {'giveaway.subCount': inc}
        });
    },

    incGoal: function(inc) {
        check(this.userId, String);

        const stream = Stream.findOne();
        const currentGoal = stream.giveaway.subGoal;

        Stream.update({
            subGoal: {$gt: 1}
        }, {
            $inc: {'giveaway.subGoal': inc},
            $set: {'giveaway.prevGoal': currentGoal}
        });
    },

    toggleStreamLive: function() {
        check(Meteor.userId(), String);

        const stream = Stream.findOne();
        const isLive = stream.live;
        const toggle = !isLive;

        Stream.update({},{$set: { live: toggle }}, function(error) {
            if (error) {
                console.log(error);
            }
        });
    }
});