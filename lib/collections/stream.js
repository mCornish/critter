Stream = new Mongo.Collection('stream');

Stream.allow({
    update: function() {
        return true;
    }
});

Stream.deny({
    update: function(userId, character, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames, 'subCount', 'subWinner', 'subGoal', 'live', 'liveContent').length > 0);
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
            $inc: {subCount: inc}
        });
    },

    incGoal: function(inc) {
        check(this.userId, String);

        Stream.update({
            subGoal: {$gt: 1}
        }, {
            $inc: {subGoal: inc}
        });
    },

    toggleStreamLive: function() {
        check(Meteor.userId(), String);

        const stream = Stream.findOne();
        const isLive = stream.live;
        const toggle = !isLive;
        console.log(toggle);
        Stream.update({},{$set: { live: toggle }}, function(error) {
            if (error) {
                console.log(error);
            }
        });
    }
});