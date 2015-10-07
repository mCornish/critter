Content = new Mongo.Collection('content');

Content.allow({
    update: function(userId, content) { return ownsDocument(userId, content); },
    remove: function(userId, content) { return ownsDocument(userId, content); }
});

Content.deny({
    update: function(userId, content, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames).length > 0);
    }
});

//Content.deny({
//    update: function(userId, content, fieldNames, modifier) {
//        var errors = validateContent(modifier.$set);
//        return;
//    }
//});

validateContent = function(content) {
    const errors = {};
    if (!content)
        errors.error = 'content';
    return errors;
};

Meteor.methods({
    contentInsert: function(contentAttributes) {
        check(Meteor.userId(), String);
        check(contentAttributes, {
            episode: Number,
            type: String,  // text, link, tweet, yt, image
            text: String,  // message, link text, tweet text
            link: String,  // link url, yt video url
            from: String,   // text/link provider, tweeter
            time: {
                hour: Match.Integer,
                minute: Match.Integer,
                second: Match.Integer
            }
        });

        const errors = validateContent(contentAttributes);
        //if (errors.title || errors.image)
        //    throw new Meteor.Error('invalid-content', 'You must set a title and image for your image.');

        const user = Meteor.user();
        const content = _.extend(contentAttributes, {
            userId: user._id,
            submitted: new Date()
        });
        const contentId = Content.insert(content);
        return {
            _id: contentId
        };
    }
});