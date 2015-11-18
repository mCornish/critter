Characters = new Mongo.Collection('characters');

Characters.allow({
    update: function (userId, character) {
        return ownsDocument(userId, character);
    },
    remove: function (userId, character) {
        return ownsDocument(userId, character);
    }
});

Characters.deny({
    update: function (userId, character, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames, 'homeland', 'stats', 'live', 'imageURL').length > 0);
    }
});

//Characters.deny({
//    update: function(userId, characters, fieldNames, modifier) {
//        var errors = validateCharacter(modifier.$set);
//        return;
//    }
//});

validateChar = function (char) {
    var errors = {};
    if (!char)
        errors = 'Please include a character';
    return errors;
};

Meteor.methods({
    charInsert: function (charAttributes) {
        check(Meteor.userId(), String);
        check(charAttributes, {
            name: String,
            fullName: String,
            actor: String,
            race: String,
            class: String,
            homeland: String,
            stats: Object({
                level: Match.Integer,
                charisma: Match.Integer,
                constitution: Match.Integer,
                dexterity: Match.Integer,
                intelligence: Match.Integer,
                strength: Match.Integer,
                wisdom: Match.Integer
            }),
            imageURL: String,
            live: Boolean
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
    },

    setLive: function (charName, bool) {
        check(this.userId, String);
        check(charName, String);
        check(bool, Boolean);

        Characters.update({
            name: charName,
            live: !bool
        }, {
            $set: {live: bool}
        }, function (error, count) {
            if (error) {
                console.log(error);
            }
        });

        if (bool) {
            Stream.update({}, {$push: {epCast: charName}});
        } else {
            Stream.update({},{$pull: {epCast: charName}});
        }
    }
});