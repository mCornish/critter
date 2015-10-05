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
    const errors = {};
    if (!check)
        errors.error = 'check';
    return errors;
};

Meteor.methods({
    checkInsert: function(checkAttributes) {
        check(Meteor.userId(), String);
        check(checkAttributes, {
            character: String,
            roll: Match.Integer,
            success: Boolean,
            time: {
                hour: Match.Integer,
                minute: Match.Integer,
                second: Match.Integer
            }
        });

        const errors = validateCheck(checkAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-check', 'You must set a title and image for your image.');

        const user = Meteor.user();
        const checkObj = _.extend(checkAttributes, {
            userId: user._id,
            submitted: new Date()
        });
        const checkId = Checks.insert(checkObj);
        return {
            _id: checkId
        };
    }
});