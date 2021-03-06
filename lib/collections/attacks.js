Attacks = new Mongo.Collection('attacks');

Attacks.allow({
    update: function(userId, attack) { return ownsDocument(userId, attack); },
    remove: function(userId, attack) { return ownsDocument(userId, attack); }
});

Attacks.deny({
    update: function(userId, attack, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames).length > 0);
    }
});

//Attacks.deny({
//    update: function(userId, characters, fieldNames, modifier) {
//        var errors = validateCharacter(modifier.$set);
//        return;
//    }
//});

validateAttack = function(attack) {
    var errors = {};
    if (!attack)
        errors = 'Please include an attack';
    return errors;
};

Meteor.methods({
    attackInsert: function(attackAttributes) {
        check(Meteor.userId(), String);
        check(attackAttributes, {
            character: String,
            name: String,
            roll: Match.Integer,
            hit: Boolean,
            lethal: Boolean,
            //damage: Number,
            type: String,
            diceCount: Match.Integer,
            diceValue: Match.Integer,
            time: {
                total: Match.Integer,
                hour: Match.Integer,
                minute: Match.Integer,
                second: Match.Integer
            }
        });

        var errors = validateAttack(attackAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-gift', 'You must set a title and image for your image.');

        var user = Meteor.user();
        var attack = _.extend(attackAttributes, {
            userId: user._id,
            submitted: new Date()
        });
        var attackId = Attacks.insert(attack);
        return {
            _id: attackId
        };
    }
});