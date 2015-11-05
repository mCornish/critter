Meteor.users.allow({
    update: function(userId, user) {
        return ownsDocument(userId, user) || isAdmin(userId);
    },
    remove: function(userId, user) {
        return ownsDocument(userId, user) || isAdmin(userId);
    }
});

Meteor.users.deny({
    update: function(userId, user, fieldNames) {
        //may only edit accessible fields:
        return (_.without(fieldNames, 'emails', 'profile', 'services').length > 0);
    }
});

Meteor.methods({
    updateActivity: function() {
        check(Meteor.userId(), String);
        Meteor.users.update(Meteor.userId(), {$set: {'profile.lastActive': new Date()}}, function(error) {
            if (error) {
                console.log(error);
            }
        });
    },

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
    },

    createBetaUser: function(user) {
        const userId = Accounts.createUser(user);
        Meteor.users.update(userId, {$set: {roles: ['beta']}}, function(error) {
            if (error) {
                console.log(error);
            }
        });
        Accounts.sendEnrollmentEmail(userId);
    }
});