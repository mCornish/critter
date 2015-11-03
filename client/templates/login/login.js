Template.login.onRendered( function() {
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

        const $form = $('form');

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
                    // throw createUser error
                    return throwError(error.reason);
                } else {
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
                    mixpanel.track('login-failure', {
                        timestamp: Date.now(),
                        user: user._id,
                        type: 'facebook'});
                    // throw login error
                    return throwError(error.reason);
                } else {
                    const userID = Meteor.userId();
                    mixpanel.identify(userID);
                    mixpanel.people.set_once({
                        $email: user.profile.email,
                        gender: user.profile.gender,
                        locale: user.profile.locale
                    });
                    mixpanel.track('login', {
                        timestamp: Date.now(),
                        user: user._id,
                        type: 'email'});
                    Router.go('/');
                }
            });
        }
    },
    'click [data-hook=switch-state]': function(e) {
        e.preventDefault();

        throwError('You should already have beta credentials.');
        //const currentState = Session.get('creatingUser');
        //Session.set('creatingUser', !currentState);
    },
    'click [data-hook=facebook-login]': function(e) {
        e.preventDefault();

        throwError('Facebook login is disabled for the beta. Sorry!');

        //Meteor.loginWithFacebook(function(error) {
        //    if (error) {
        //        // clear errors
        //        Session.set('userSubmitErrors', {});
        //        mixpanel.track('login-failure', {
        //            timestamp: Date.now(),
        //            user: user._id,
        //            type: 'facebook'});
        //        // throw login error
        //        return throwError(error.reason);
        //    } else {
        //        const user = Meteor.user();
        //        mixpanel.identify(user._id);
        //        mixpanel.people.set_once({
        //            $email: user.profile.email,
        //            gender: user.profile.gender,
        //            locale: user.profile.locale
        //        });
        //        mixpanel.track('login', {
        //            timestamp: Date.now(),
        //            user: user._id,
        //            type: 'facebook'});
        //
        //        Router.go('/');
        //    }
        //});
    },
    'click [data-hook=twitch-login]': function() {
        Twitch.login({
            scope: ['user_read'],
            redirect_uri: 'http://localhost:3000'
        });
    },
    'click [data-hook=forgotten-password]': function(e) {
        e.preventDefault();

        const state = Session.get('forgottenPassword');
        // toggle the state
        Session.set('forgottenPassword', !state);
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
})