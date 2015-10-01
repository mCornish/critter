Recipients = new Mongo.Collection('recipients');

Recipients.deny({
    update: function(userId, recipient, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames, 'name', 'gender').length > 0);
    }
});

validateRecipient = function(recipient) {
    var errors = {};
    if (!recipient.name)
        errors.name = 'Please enter a name';
    if (!recipient.gender)
        errors.gender = 'Please select a gender';
    return errors;
};

Meteor.methods({
    recipientInsert: function(recipientAttributes) {
        check(Meteor.userId(), String);
        check(recipientAttributes, {
            name: String,
            gender: String
        });

        var errors = validateRecipient(recipientAttributes);
        if (errors.name || errors.gender)
            throw new Meteor.Error('invalid-recipient', 'You must set a name and gender.');

        var user = Meteor.user();
        var recipient = _.extend(recipientAttributes, {
            createdBy: user._id,
            created: new Date(),
            giftCount: 0
        });
        var recipientId = Recipients.insert(recipient);
        return {
            _id: recipientId
        };
    }
});