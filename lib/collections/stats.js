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
        check(statAttributes, {
            action: String,
            name: String,
            value: Number,
            valueCount: Match.Integer,
            character: String,
            episode: Number
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

    updateStat: function(statAttributes, value) {
        check(Meteor.userId(), String);
        check(statAttributes, {
            action: String,
            name: String,
            character: String,
            episode: Number
        });
        check(value, Match.Integer);

        const stat = Stats.findOne(statAttributes);

        const average = stat.value;
        const count = stat.valueCount;
        const sum = count * average;
        const newSum = sum + value;
        const newCount = count + 1;
        const newAverage = Math.round(newSum / newCount);

        Stats.update(stat._id, {$set: {value: newAverage, valueCount: newCount}});
    }
});