Stats = new Mongo.Collection('stats');

Stats.allow({
    update: function (userId, stat) {
        return ownsDocument(userId, stat);
    },
    remove: function (userId, stat) {
        return ownsDocument(userId, stat);
    }
});

Stats.deny({
    update: function (userId, stat, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames).length > 0);
    }
});

//Stats.deny({
//    update: function(userId, stat, fieldNames, modifier) {
//        var errors = validateStat(modifier.$set);
//        return;
//    }
//});

validateStat = function (stat) {
    const errors = {};
    if (!stat)
        errors.error = 'stat';
    return errors;
};

Meteor.methods({
    statInsert: function (statAttributes) {
        check(Meteor.userId(), String);

        // Check whether lethal values exist. if not, create dummy data
        statAttributes.lethal = typeof statAttributes.lethal === 'undefined' ? 0 : statAttributes.lethal;
        statAttributes.lethalCount = typeof statAttributes.lethalCount === 'undefined' ? 0 : statAttributes.lethalCount;

        check(statAttributes, {
            action: String,
            name: String,
            value: Number,
            valueCount: Match.Integer,
            success: Number,
            successCount: Match.Integer,
            character: String,
            episode: Number,
            time: Match.Integer,
            lethal: Number,
            lethalCount: Match.Integer
        });

        const errors = validateStat(statAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-stat', 'You must set a title and image for your image.');

        const user = Meteor.user();
        const stat = _.extend(statAttributes, {
            userId: user._id,
            submitted: new Date()
        });
        const statId = Stats.insert(stat);
        return {
            _id: statId
        };
    },

    updateStat: function(statAttributes, value, success, lethal) {
        check(Meteor.userId(), String);
        check(statAttributes, {
            action: String,
            name: String,
            character: String,
            episode: Number,
            time: Match.Integer()
        });
        check(value, Match.Integer);
        check(success, Boolean);
        if (lethal !== null) {
            check(lethal, Boolean);
        }

        const stat = Stats.findOne(statAttributes);

        // value update
        let average = stat.value;
        let count = stat.valueCount;
        let sum = average * count;
        let newSum = sum + value;
        const valCount = count + 1;
        const valAverage = Math.round(newSum / valCount);

        // success update
        const succVal = success ? 1 : 0;
        average = stat.success;
        count = stat.successCount;
        sum = average * count;
        newSum = sum + succVal;
        const succCount = count + 1;
        const succAverage = newSum / succCount;

        let lethalCount,
            lethalAverage;
        if (typeof lethal !== null) {
            // lethal update
            const lethalVal = lethal ? 1 : 0;
            average = stat.success;
            count = stat.lethalCount;
            sum = average * count;
            newSum = sum + lethalVal;
            lethalCount = count + 1;
            lethalAverage = newSum / lethalCount;
        } else {
            lethalCount = null;
            lethalAverage = null;
        }

        Stats.update(stat._id, {$set: {
            value: valAverage,
            valueCount: valCount,
            success: succAverage,
            successCount: succCount,
            lethal: lethalAverage,
            lethalCount: lethalCount
        }});
    }
});