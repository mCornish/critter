Meteor.publish('gifts', function(queries, options) {
    queries = typeof queries !== 'undefined' ? queries : {};

    if (options) {
        check(options, {
            sort: Object,
            limit: Number
        });
    } else {
        options = {};
    }

    return Gifts.find(queries, options);
});

// giftPage publication
Meteor.publish('singleGift', function(id) {
    check(id, String);
    return Gifts.find(id);
});

Meteor.publish('comments', function(giftId) {
    check(giftId, String);
    return Comments.find({giftId: giftId});
});

Meteor.publish('notifications', function() {
    return Notifications.find({userId: this.userId, read: false});
});

Meteor.publish('recipients', function() {
    return Recipients.find();
});
Meteor.publish('recipientsByGender', function(gender) {
    gender = typeof gender !== 'undefined' ? gender : 'neutral';
    return Recipients.find( {$or: [ {gender: gender}, {gender: 'neutral'} ] });
});

Meteor.publish('occasions', function() {
    return Occasions.find();
});

Meteor.publish('users', function() {
    return Meteor.users.find();
});
Meteor.publish('singleUser', function(id, userId) {
    if (id === userId) {
        fields = {'profile': 1, 'services': 1};
    } else {
        fields = {'profile': 1};
    }

    return Meteor.users.find(id, {fields: fields});
});

Meteor.publish('images', function() {
    return Images.find();
});