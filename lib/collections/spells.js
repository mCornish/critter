Spells = new Mongo.Collection('spells');

Spells.allow({
    update: function(userId, spell) { return ownsDocument(userId, spell); },
    remove: function(userId, spell) { return ownsDocument(userId, spell); }
});

Spells.deny({
    update: function(userId, spell, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames).length > 0);
    }
});

//Spells.deny({
//    update: function(userId, spell, fieldNames, modifier) {
//        var errors = validateSpell(modifier.$set);
//        return;
//    }
//});

validateSpell = function(spell) {
    const errors = {};
    if (!spell)
        errors.error = 'spell';
    return errors;
};

Meteor.methods({
    spellInsert: function(spellAttributes) {
        check(Meteor.userId(), String);
        check(spellAttributes, {
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

        const errors = validateSpell(spellAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-spell', 'You must set a title and image for your image.');

        const user = Meteor.user();
        const spell = _.extend(spellAttributes, {
            userId: user._id,
            submitted: new Date()
        });
        const spellId = Spells.insert(spell);
        return {
            _id: spellId
        };
    }
});