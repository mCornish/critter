Gifts = new Mongo.Collection('gifts');

Gifts.allow({
    update: function(userId, gift) { return ownsDocument(userId, gift); },
    remove: function(userId, gift) { return ownsDocument(userId, gift); }
});

Gifts.deny({
    update: function(userId, gift, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames, 'description', 'image', 'link', 'price', 'recipient', 'age', 'occasion').length > 0);
    }
});

Gifts.deny({
    update: function(userId, gift, fieldNames, modifier) {
        var errors = validateGift(modifier.$set);
        return errors.description || errors.image;
    }
});

validateGift = function(gift) {
    var errors = {};
    if (!gift.image)
        errors.image = 'Please choose an image';
    if (!gift.description)
        errors.title = 'Please include a description';
    return errors;
};

Meteor.methods({
    giftInsert: function(giftAttributes) {
        check(Meteor.userId(), String);
        check(giftAttributes, {
            image: String,
            description: String,
            link: String,
            price: Number,
            recipient: String,
            age: Number,
            occasion: String
        });

        var errors = validateGift(giftAttributes);
        if (errors.title || errors.image)
            throw new Meteor.Error('invalid-gift', 'You must set a title and image for your image.');

        var user = Meteor.user();
        var gift = _.extend(giftAttributes, {
            userId: user._id,
            userName: user.profile.username,
            userImage: user.profile.image,
            submitted: new Date(),
            commentsCounts: 0,
            wanters: [],
            wants: 0
        });
        var giftId = Gifts.insert(gift);
        return {
            _id: giftId
        };
    },

    want: function(giftId) {
        check(this.userId, String);
        check(giftId, String);

        var affected = Gifts.update({
            _id: giftId,
            wanters: {$ne: this.userId}
        }, {
            $addToSet: {wanters: this.userId},
            $inc: {wants: 1}
        });
        // TODO figure out when/why this throws an error for giftPage
        if (! affected) {
            throw new Meteor.Error('invalid', "You weren't able to want that gift.");
        }
    },

    unwant: function(giftId) {
        check(this.userId, String);
        check(giftId, String);

        var affected = Gifts.update({
            _id: giftId,
            wanters: this.userId
        }, {
            $pull: {wanters: this.userId},
            $inc: {wants: -1}
        });
        // TODO figure out when/why this throws an error for giftPage
        //if (! affected) {
        //    throw new Meteor.Error('invalid', "You weren't able to unwant that gift.")
        //}
    }
});