Meteor.publish('stream', function() {
    return Stream.find();
});

Meteor.publish('characters', function(queries, options) {
    queries = typeof queries !== 'undefined' ? queries : {};

    if (options) {
        check(options, {
            sort: Object,
            limit: Number
        });
    } else {
        options = {};
    }

    return Characters.find(queries, options);
});

Meteor.publish('character', function(id) {
    check(id, String);
    return Characters.find(id);
});

Meteor.publish('episodes', function(queries, options) {
    queries = typeof queries !== 'undefined' ? queries : {};

    if (options) {
        check(options, {
            sort: Object,
            limit: Number
        });
    } else {
        options = {};
    }

    return Episodes.find(queries, options);
});

Meteor.publish('attacks', function(queries, options) {
    queries = typeof queries !== 'undefined' ? queries : {};

    if (options) {
        check(options, {
            sort: Object,
            limit: Number
        });
    } else {
        options = {};
    }

    return Attacks.find(queries, options);
});

Meteor.publish('casts', function(queries, options) {
    queries = typeof queries !== 'undefined' ? queries : {};

    if (options) {
        check(options, {
            sort: Object,
            limit: Number
        });
    } else {
        options = {};
    }

    return Checks.find(queries, options);
});

Meteor.publish('checks', function(queries, options) {
    queries = typeof queries !== 'undefined' ? queries : {};

    if (options) {
        check(options, {
            sort: Object,
            limit: Number
        });
    } else {
        options = {};
    }

    return Checks.find(queries, options);
});

Meteor.publish('saves', function(queries, options) {
    queries = typeof queries !== 'undefined' ? queries : {};

    if (options) {
        check(options, {
            sort: Object,
            limit: Number
        });
    } else {
        options = {};
    }

    return Checks.find(queries, options);
});

Meteor.publish('comments', function(giftId) {
    check(giftId, String);
    return Comments.find({giftId: giftId});
});

Meteor.publish('notifications', function() {
    return Notifications.find({userId: this.userId, read: false});
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