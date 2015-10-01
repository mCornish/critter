Characters = new Mongo.Collection('characters');

Characters.allow({
    update: function(userId, character) { return ownsDocument(userId, character); },
    remove: function(userId, character) { return ownsDocument(userId, character); }
});

Characters.deny({
    update: function(userId, character, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames, 'stats').length > 0);
    }
});

//Characters.deny({
//    update: function(userId, characters, fieldNames, modifier) {
//        var errors = validateCharacter(modifier.$set);
//        return;
//    }
//});

validateChar = function(char) {
    var errors = {};
    if (!char)
        errors = 'Please include a character';
    return errors;
};

Meteor.methods({
    charInsert: function(charAttributes) {
        check(Meteor.userId(), String);
        check(charAttributes, {
            name: String,
            actor: String,
            race: String,
            class: String,
            stats: Object({
                charisma: Match.Integer,
                constitution: Match.Integer,
                dexterity: Match.Integer,
                intelligence: Match.Integer,
                strength: Match.Integer,
                wisdom: Match.Integer
            }),
            imageURL: String
        });

        var errors = validateChar(charAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-gift', 'You must set a title and image for your image.');

        var user = Meteor.user();
        var char = _.extend(charAttributes, {
            submittedBy: user._id,
            submitted: new Date()
        });
        var charId = Characters.insert(char);
        return {
            _id: charId
        };
    }
});