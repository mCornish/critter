Polls = new Mongo.Collection('polls');

Polls.allow({
    update: function(userId, poll) {
        return ownsDocument(userId, poll) || isAdmin(userId);
    },
    remove: function(userId, poll) {
        return ownsDocument(userId, poll) || isAdmin(userId);
    }
});

Polls.deny({
    update: function (userId, poll, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames, 'question', 'choices', 'resCount', 'responders').length > 0);
    }
});

//Characters.deny({
//    update: function(userId, characters, fieldNames, modifier) {
//        var errors = validateCharacter(modifier.$set);
//        return;
//    }
//});

validatePoll = function (poll) {
    var errors = {};
    if (!poll)
        errors = 'Please include a poll';
    return errors;
};

Meteor.methods({
    pollInsert: function (pollAttributes) {
        check(Meteor.userId(), String);
        check(pollAttributes, {
            question: String,
            choices: Object
        });

        const errors = validatePoll(pollAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-gift', 'You must set a title and image for your image.');

        const user = Meteor.user();
        const poll = _.extend(pollAttributes, {
            resCount: 0,
            responders: [],
            submittedBy: user._id,
            submitted: new Date()
        });
        const pollId = Polls.insert(poll);
        return {
            _id: pollId
        };
    }
});