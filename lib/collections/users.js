Meteor.users.allow({
    update: function(userId, user) {
        // allow update if current user is the user being updated, or current user is an owner
        if (userId === user._id) {
            return true;
        }
        if (typeof user.roles !== 'undefined') {
            return user.roles.indexOf('owner') > 0;
        }
    }
});

Meteor.users.deny({
    update: function(userId, user, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames, 'emails', 'profile', 'services').length > 0);
    }
});

Meteor.methods({
    userIsInRole: function(userId, role) {
        const user = Meteor.users.findOne(userId);
        if (typeof user.roles !== 'undefined') {
            return user.roles.indexOf(role) > -1;
        } else {
            return false;
        }
    },

    addUserToRole: function(userId, role) {
        check(this.userId, String);
        check(userId, String);
        check(role, String);

        Meteor.users.update(userId, {
            $push: {roles: role}
        }, function(error, docs) {
            if (error) {
                console.log(error);
            }
        });
    }
});