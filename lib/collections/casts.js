Casts = new Mongo.Collection('casts');

Casts.allow({
    update: function(userId, cast) { return ownsDocument(userId, cast); },
    remove: function(userId, cast) { return ownsDocument(userId, cast); }
});

Casts.deny({
    update: function(userId, cast, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames).length > 0);
    }
});

//Casts.deny({
//    update: function(userId, cast, fieldNames, modifier) {
//        var errors = validateCast(modifier.$set);
//        return;
//    }
//});

validateCast = function(cast) {
    const errors = {};
    if (!cast)
        errors.error = 'cast';
    return errors;
};

Meteor.methods({
    castInsert: function(castAttributes) {
        check(Meteor.userId(), String);
        check(castAttributes, {
            character: String,
            name: String,
            success: Boolean,
            roll: Match.Integer,
            time: {
                hour: Match.Integer,
                minute: Match.Integer,
                second: Match.Integer
            }
        });

        const errors = validateCast(castAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-cast', 'You must set a title and image for your image.');

        const user = Meteor.user();
        const cast = _.extend(castAttributes, {
            userId: user._id,
            submitted: new Date()
        });
        const castId = Casts.insert(cast);
        return {
            _id: castId
        };
    }
});