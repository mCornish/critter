Template.me.onCreated(function () {
    Session.set('changingUsername', false);
    Session.set('changingEmail', false);
    Session.set('changingPassword', false);
});

Template.me.helpers({
    email: function() {
        // Find valid email address
        if (Meteor.user().emails.length === 1) {
            return typeof Meteor.user().emails[0] === 'string' ? Meteor.user().emails[0] : Meteor.user().emails[0].address;
        } else {
            const email1 = Meteor.user().emails[0].address;
            const email2 = Meteor.user().emails[1].address;
            const email3 = Meteor.user().emails[0];
            if (typeof email1 === 'string') {
                return email1;
            } else if (typeof email2 === 'string') {
                return email2;
            } else {
                return email3;
            }
        }
    },
    changingUsername: function() {
        return Session.get('changingUsername');
    },
    changingEmail: function() {
        return Session.get('changingEmail');
    },
    changingPassword: function() {
        return Session.get('changingPassword');
    }
});

Template.me.events({
    'click [data-hook=change-username]': function() {
        Session.set('changingUsername', true);
    },
    'click [data-hook=change-email]': function() {
        Session.set('changingEmail', true);
    },
    'click [data-hook=change-password]': function() {
        Session.set('changingPassword', true);
    },
    'click [data-hook=logout]': function() {
        Meteor.logout(function(error) {
            if (error) {
                throwError(error.reason);
            } else {
                Router.go('home');
            }
        });
    },
    'submit [data-hook=username-form]': function(e) {
        e.preventDefault();
        const username = $(e.target).find('[name=username]').val();
        Meteor.call('changeUsername', username, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('Username Updated');
                Session.set('changingUsername', false);
            }
        });
    },
    'submit [data-hook=email-form]': function(e) {
        e.preventDefault();
        const email = $(e.target).find('[name=email]').val();
        Meteor.call('changeEmail', email, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('Email Updated');
                Session.set('changingEmail', false);
            }
        });
    },
    'submit [data-hook=password-form]': function(e) {
        e.preventDefault();
        const password = $(e.target).find('[name=password]').val();
        const passwordAgain = $(e.target).find('[name=password-again]').val();
        if (!(password === passwordAgain)) {
            return throwError('Passwords do not match.');
        }
        const oldPassword = $(e.target).find('[name=old-password]').val();
        Meteor.call('changePassword', oldPassword, password, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('Password Updated');
                Session.set('changingPassword', false);
            }
        });
    }
});