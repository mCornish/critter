Occasions = new Mongo.Collection('occasions');

Occasions.deny({
    update: function(userId, occasion, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames, 'name').length > 0);
    }
});

validateRecipient = function(occasion) {
    var errors = {};
    if (!occasion.name)
        errors.name = 'Please enter a name';
    return errors;
};

Meteor.methods({
    occasionInsert: function(occasionAttributes) {
        check(Meteor.userId(), String);
        check(occasionAttributes, {
            name: String
        });

        var errors = validateRecipient(occasionAttributes);
        if (errors.name)
            throw new Meteor.Error('invalid-occasion', 'You must set a name.');

        var user = Meteor.user();
        var occasion = _.extend(occasionAttributes, {
            createdBy: user._id,
            created: new Date(),
            giftCount: 0
        });
        var occasionId = Occasions.insert(occasion);
        return {
            _id: occasionId
        };
    }
});