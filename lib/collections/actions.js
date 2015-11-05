Actions = new Mongo.Collection('actions');

Actions.allow({
    update: function (userId, action) {
        return ownsDocument(userId, action);
    },
    remove: function (userId, action) {
        return ownsDocument(userId, action);
    }
});

Actions.deny({
    update: function (userId, action, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames).length > 0);
    }
});

//Actions.deny({
//    update: function(userId, action, fieldNames, modifier) {
//        var errors = validateAction(modifier.$set);
//        return;
//    }
//});

validateAction = function (action) {
    const errors = {};
    if (!action)
        errors.error = 'action';
    return errors;
};

Meteor.methods({
    actionInsert: function (actionAttributes) {
        check(Meteor.userId(), String);
        check(actionAttributes, {
            episode: Number,
            character: String,
            name: String,
            roll: Match.Integer,
            action: String,
            success: Boolean,
            lethal: Boolean,
            type: String,
            diceCount: Match.Integer,
            diceVal: Match.Integer,
            time: {
                total: Match.Integer,
                hour: Match.Integer,
                minute: Match.Integer,
                second: Match.Integer
            }
        });

        const errors = validateAction(actionAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-action', 'You must set a title and image for your image.');

        const user = Meteor.user();
        const action = _.extend(actionAttributes, {
            userId: user._id,
            submitted: new Date()
        });
        const actionId = Actions.insert(action);
        return {
            _id: actionId
        };
    }
});