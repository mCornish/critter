Saves = new Mongo.Collection('saves');

Saves.allow({
    update: function(userId, save) { return ownsDocument(userId, save); },
    remove: function(userId, save) { return ownsDocument(userId, save); }
});

Saves.deny({
    update: function(userId, save, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames).length > 0);
    }
});

//Saves.deny({
//    update: function(userId, save, fieldNames, modifier) {
//        var errors = validateSave(modifier.$set);
//        return;
//    }
//});

validateSave = function(save) {
    const errors = {};
    if (!save)
        errors.error = 'save';
    return errors;
};

Meteor.methods({
    saveInsert: function(saveAttributes) {
        check(Meteor.userId(), String);
        check(saveAttributes, {
            character: String,
            type: String,
            roll: Match.Integer,
            success: Boolean,
            time: {
                hour: Match.Integer,
                minute: Match.Integer,
                second: Match.Integer
            }
        });

        const errors = validateSave(saveAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-save', 'You must set a title and image for your image.');

        const user = Meteor.user();
        const save = _.extend(saveAttributes, {
            userId: user._id,
            submitted: new Date()
        });
        const saveId = Saves.insert(save);
        return {
            _id: saveId
        };
    }
});