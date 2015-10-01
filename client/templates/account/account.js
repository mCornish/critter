Template.account.onCreated( function() {
    Session.set('accountSubmitErrors', {});
    Session.set('emailChange', false);
    Session.set('passwordChange', false);
    Session.set('successMessage', null);
});

Template.account.helpers({
    facebookAuth: function() {
        return this.services.facebook;
    },
    errorMessage: function(field) {
        return Session.get('accountSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('accountSubmitErrors')[field] ? 'has-error' : '';
    },
    emailChange: function() {
        return Session.get('emailChange');
    },
    passwordChange: function() {
        return Session.get('passwordChange');
    },
    successMessage: function() {
        return Session.get('successMessage');
    }
});

Template.account.events({
    'submit form': function(e) {
        e.preventDefault();

        const
            email = $(e.target).find('[name=email]').val(),
            password = $(e.target).find('[name=password]').val(),
            newPassword = $(e.target).find('[name=new-password]').val(),
            passwordAgain = $(e.target).find('[name=password-again]').val();

        const userProperties = {
            email: email,
            password: password,
            newPassword: newPassword,
            passwordAgain: passwordAgain
        };

        const errors = validateUser(userProperties);
        if (errors.email || errors.password || errors.newPassword || errors.passwordAgain) {
            return Session.set('accountSubmitErrors', errors);
        }

        const user = {
            emails: [email],
            'profile.email':  email
        };

        // Update email on server if necessary
        if (Session.get('emailChange')) {
            Meteor.users.update(Meteor.userId(), {$set: user}, function (error) {
                if (error) {
                    alert(error.reason);
                } else {
                    Session.set('successMessage', 'Account updated');
                }
            });
        }

        // Change password on server if necessary
        if (Session.get('passwordChange')) {
            Accounts.changePassword(password, newPassword, function (error) {
                if (error) {
                    alert(error.reason);
                } else {
                    Session.set('successMessage', 'Account updated');
                }
            });
        }
    },
    'click [data-hook=change-email]': function(e) {
        e.preventDefault();
        Session.set('emailChange', true);
    },
    'click [data-hook=change-password]': function(e) {
        e.preventDefault();
        Session.set('passwordChange', true);
    },
    'click [data-hook=facebook]': function(e) {
        e.preventDefault();
        Meteor.loginWithFacebook(function(error) {
            if (error) {
                // clear errors
                Session.set('userSubmitErrors', {});
                // throw login error
                return throwError(error.reason);
            } else {
                Session.set('successMessage', 'Logged in with Facebook');
            }
        });
    }
});

var validateUser = function(user) {
    var errors = {};

    if (Session.get('emailChange')) {
        if (!user.email) {
            errors.email = 'Please enter an email';
        }
    }

    if (Session.get('passwordChange')) {
        if (!user.password) {
            errors.password = 'Please enter your password';
        }
        if (!user.newPassword) {
            errors.newPassword = 'Please enter a new password';
        }
        if (!user.passwordAgain) {
            errors.passwordAgain = 'Please re-enter new password';
        }
        if (user.newPassword !== user.passwordAgain) {
            errors.passwordAgain = 'Passwords do not match';
        }
    }

    return errors;
};