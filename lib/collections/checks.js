Checks = new Mongo.Collection('checks');

Checks.allow({
    update: function(userId, check) { return ownsDocument(userId, check); },
    remove: function(userId, check) { return ownsDocument(userId, check); }
});

Checks.deny({
    update: function(userId, check, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames).length > 0);
    }
});

//Checks.deny({
//    update: function(userId, check, fieldNames, modifier) {
//        var errors = validateCheck(modifier.$set);
//        return;
//    }
//});

validateCheck = function(check) {
    var errors = {};
    if (!check)
        errors = 'check';
    return errors;
};

Meteor.methods({
    checkInsert: function(checkAttributes) {
        check(Meteor.userId(), String);
        check(checkAttributes, {
            character: Meteor.Collection.ObjectID,
            roll: Match.Integer,
            success: Boolean,
            time: {
                hour: Match.Integer,
                minute: Match.Integer,
                second: Match.Integer
            }
        });

        var errors = validateCheck(checkAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-check', 'You must set a title and image for your image.');

        var user = Meteor.user();
        var check = _.extend(checkAttributes, {
            userId: user._id,
            submitted: new Date()
        });
        var checkId = Checks.insert(check);
        return {
            _id: checkId
        };
    }
});