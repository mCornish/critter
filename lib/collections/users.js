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
    fixEmail: function(email) {
        check(Meteor.userId(), String);
        check(email, String);

        Meteor.users.update(Meteor.userId(), {$pop: {emails: 1}}, function(error) {
            if (error) {
                console.log('Fix Email error: ' + err.reason);
            } else {
                //Accounts.addEmail(Meteor.userId(), email);
                Meteor.users.update(Meteor.userId(), {$push: {emails: {
                    address: email,
                    verified: false
                }}});
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
    },

    changeUsername: function(username) {
        check(Meteor.userId(), String);
        check(username, String);

        Accounts.setUsername(Meteor.userId(), username);
    },

    changeEmail: function(newEmail) {
        check(Meteor.userId(), String);
        check(newEmail, String);

        let oldEmail = '';
        // Find valid current email address
        if (Meteor.user().emails.length === 1) {
            oldEmail = typeof Meteor.user().emails[0] === 'string' ? Meteor.user().emails[0] : Meteor.user().emails[0].address;
        } else {
            const email1 = Meteor.user().emails[0].address;
            const email2 = Meteor.user().emails[1].address;
            const email3 = Meteor.user().emails[0];
            if (typeof email1 === 'string') {
                oldEmail = email1;
            } else if (typeof email2 === 'string') {
                oldEmail = email2;
            } else {
                oldEmail = email3;
            }
        }

        Accounts.addEmail(Meteor.userId(), newEmail);
        Accounts.removeEmail(Meteor.userId(), oldEmail);


    },

    sendResetEmail: function(email) {
        check(email, String);

        let userId = null;
        const users = Meteor.users.find().fetch();
        console.log(users);
        users.forEach(function(user) {
            if ('emails' in user) {
                if (user.emails[0].address === email) {
                    userId = user._id;
                } else if (user.emails[0] === email) {
                    userId = user._id;
                }
            }
        });

        Accounts.sendResetPasswordEmail(userId);
    }
});