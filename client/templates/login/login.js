Template.login.onCreated( function() {
    if (typeof Meteor.userId() === 'string') {
        Router.go('home');
    }

    Session.set('creatingUser', false);
    Session.set('forgottenPassword', false);
    Session.set('userSubmitErrors', {});
    Session.set('headerIsSimple', true);
});

Template.login.helpers({
    creatingUser: function() {
        return Session.get('creatingUser');
    },
    forgottenPassword: function() {
        return Session.get('forgottenPassword');
    },
    twitchUrl: function() {
        return Session.get('twitchUrl');
    },
    errorMessage: function(field) {
        return Session.get('userSubmitErrors')[field];
    },
    errorClass: function(field) {
        return !!Session.get('userSubmitErrors')[field] ? 'has-error' : '';
    }
});

Template.login.events({
    'click [data-hook=submit]': function(e) {
        e.preventDefault();

        const $form = $('[data-hook=login-form]');

        const
            password = $form.find('[data-hook=password]').val(),
            passwordAgain = $form.find('[data-hook=password-again]').val();

        let username = $form.find('[data-hook=username]').val();

        if ( Session.get('creatingUser') ) {
            // create new user
            const user = {
                username: username,
                password: password,
                passwordAgain: passwordAgain,
                profile: {
                    created: new Date(),
                    points: 0
                }
            };

            const errors = validateUser(user);
            if (errors.username || errors.password || errors.passwordAgain)
                return Session.set('userSubmitErrors', errors);

            Accounts.createUser(user, function(error) {
                if (error) {
                    // clear errors
                    Session.set('userSubmitErrors', {});
                    analytics.track('Login Failure', {
                        user: username,
                        error: error.reason,
                        service: 'Email'
                    });
                    // throw createUser error
                    return throwError(error.reason);
                } else {
                    analytics.track('User Created', {
                        user: username
                    });
                    Router.go('/');
                }
            });
        } else if ( Session.get('forgottenPassword') ) {
            // send forgotten password email
            const email = $(e.target).find('[data-hook=email]').val();

            Accounts.forgotPassword({email: email}, function(error) {
                if (error) {
                    alert(error);
                } else {
                    alert('Password sent to your email.');
                }
            });
        } else {
            // log in
            const user = {
                username: username,
                password: password
            };

            const errors = validateUser(user);
            if (errors.username || errors.password)
                return Session.set('userSubmitErrors', errors);

            username = username.substr(0, username.indexOf('@'));

            Meteor.loginWithPassword(username, password, function(error) {
                if (error) {
                    // clear errors
                    Session.set('userSubmitErrors', {});
                    analytics.track('Login Failure', {
                        user: username,
                        error: error.reason,
                        service: 'email'
                    });
                    // throw login error
                    return throwError(error.reason);
                } else {
                    analytics.track('Login', {
                        user: Meteor.userId(),
                        service: 'email'
                    });
                    Router.go('/');
                }
            });
        }
    },
    'click [data-hook=switch-state]': function(e) {
        e.preventDefault();

        const currentState = Session.get('creatingUser');
        Session.set('creatingUser', !currentState);
    },
    'click [data-hook=facebook-login]': function(e) {
        e.preventDefault();

        Meteor.loginWithFacebook(function(error) {
            if (error) {
                // clear errors
                Session.set('userSubmitErrors', {});
                mixpanel.track('Login Failure', {
                    error: error.reason,
                    service: 'facebook'
                });
                // throw login error
                return throwError(error.reason);
            } else {
                analytics.track('Login', {
                    user: Meteor.userId(),
                    service: 'facebook'
                });
                Router.go('/');
            }
        });
    },
    'click [data-hook=twitch-login]': function() {
        Twitch.login({
            scope: ['user_read'],
            redirect_uri: 'http://localhost:3000'
        });
    },
    'click [data-hook=forgotten-password]': function(e) {
        e.preventDefault();
        // toggle the state
        const state = Session.get('forgottenPassword');
        Session.set('forgottenPassword', !state);
    },
    'submit [data-hook=forgot-pass-form]': function(e) {
        e.preventDefault();
        const email = $(e.target).find('[name=email]').val();

        Meteor.call('sendResetEmail', email, function(err) {
            if (err) {
                throwError(err.reason);
            } else {
                notify('Email sent to ' + email);
                // toggle the state
                const state = Session.get('forgottenPassword');
                Session.set('forgottenPassword', !state);
            }
        });
    },
    'click [data-hook=login-cancel]': function(e) {
        e.preventDefault();
        Router.go('home');
    },
    'click [data-hook=password-cancel]': function(e) {
        e.preventDefault();
        Session.set('forgottenPassword', false);
    }
});

var validateUser = function(user) {
    const errors = {};
    if (!user.username)
        errors.username = 'Please enter a username';
    if (!user.password)
        errors.password = 'Please enter a password';
    if (Session.get('creatingUser')) {
        if (!user.passwordAgain)
            errors.passwordAgain = 'Please re-enter password';
        if (user.password !== user.passwordAgain)
            errors.passwordAgain = 'Passwords do not match';
    }
    return errors;
};

Template.login.onDestroyed(function() {
    Session.set('headerIsSimple', false);
});