Template.login_form.onCreated(function () {
    Session.set('creatingUser', false);
    Session.set('forgottenPassword', false);
});

Template.login_form.onRendered(function () {
    $('form').validate({
        rules: {
            'username': {
                required: true,
                email: true
            },
            'password': {
                required: true
            },
            'password-again': {
                required: true,
                equalTo: '[name=password]'
            }
        },
        messages: {
            username: {
                required: 'Please enter an email address.',
                email: 'Please enter a valid email address.'
            },
            password: {
                required: 'Please enter a password.'
            },
            'password-again': {
                required: "Please enter your password again.",
                equalTo: "Your passwords don't seem to match."
            }
        }
    });
});

Template.login_form.helpers({
    creatingUser: function () {
        return Session.get('creatingUser');
    }
});

Template.login_form.events({
    'click [data-hook=facebook-login]': function (e, template) {
        e.preventDefault();

        Meteor.loginWithFacebook(function (error) {
            if (error) {
                // clear errors
                Session.set('userSubmitErrors', {});
                analytics.track('Login Failure', {
                    error: error.reason,
                    service: 'facebook'
                });
                // throw login error
                throwError(error.reason);
            } else {
                const user = Meteor.user();
                analytics.track('Login', {
                    id: Meteor.userId(),
                    service: 'facebook'
                });
                Session.set('loggingIn', false);
                Router.go('/');
            }
        });
    },
    'submit form': function (e, template) {
        e.preventDefault();

        const $form = $(e.target);

        const
            password = $form.find('[data-hook=password]').val(),
            passwordAgain = $form.find('[data-hook=password-again]').val();

        let username = $form.find('[data-hook=username]').val();

        if (Session.get('creatingUser')) {
            // create new user
            const user = {
                username: username,
                password: password,
                passwordAgain: passwordAgain,
                profile: {
                    image: 'http://thesocietypages.org/socimages/files/2009/05/vimeo.jpg',
                    created: new Date(),
                    generosity: 0
                }
            };

            Accounts.createUser(user, function (error) {
                if (error) {
                    // clear errors
                    Session.set('userSubmitErrors', {});
                    analytics.track('Registration Failure', {
                        username: username,
                        profile: user.profile,
                        error: error.reason
                    });
                    // throw createUser error
                    return throwError(error.reason);
                } else {
                    analytics.track('Registration', {
                        username: username,
                        profile: user.profile,
                        service: 'email'
                    });
                    Router.go('home');
                }
            });
        } else if (Session.get('forgottenPassword')) {
            // send forgotten password email
            const email = $(e.target).find('[data-hook=email]').val();

            Accounts.forgotPassword({email: email}, function (error) {
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

            username = username.substr(0, username.indexOf('@'));

            Meteor.loginWithPassword(username, password, function (error) {
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
                        id: Meteor.userId(),
                        service: 'email'
                    });
                    Router.go('home');
                }
            });
        }
    },
    'click [data-hook=switch-state]': function (e) {
        e.preventDefault();
        const currentState = Session.get('creatingUser');
        if (!currentState) {
            $('[data-hook=form] .lift').addClass('is-active').on('transitionend', function (e) {
                $(e.target).off();
                $('.form-reveal').addClass('is-active').on('transitionend', function (e) {
                    $(e.target).off();
                    $('.input-reveal').addClass('is-active').on('transitionend', function(e) {
                        $(e.target).off();
                        $('[data-hook=form] .lift').removeClass('is-active');
                        Session.set('creatingUser', !currentState);
                    });
                });
            });
        } else {
            $('[data-hook=form] .lift').addClass('is-active').on('transitionend', function (e) {
                $(e.target).off();
                $('.input-reveal').removeClass('is-active').on('transitionend', function (e) {
                    $(e.target).off();
                    $('.form-reveal').removeClass('is-active').on('transitionend', function(e) {
                        $(e.target).off();
                        $('[data-hook=form] .lift').removeClass('is-active');
                        Session.set('creatingUser', !currentState);
                    });
                });
            });
        }
    },
    'click [data-hook=forgotten-password]': function (e, template) {
        e.preventDefault();
        const $lift = $('[data-hook=login-container]');
        const $flipFull = $('.flip-full');
        const $flip = $('.flip');
        const $flop = $('.flop');
        const liftDur = getDuration($('.lift'));
        const flipDur = getDuration($flipFull) / 2;
        let delay = 0;

        activate($lift, 0);
        activate($flipFull, delay += liftDur - 100);
        activate($flip, delay);
        activate($flop, delay + flipDur, function() {
            deactivate($lift, flipDur);
        });
    }
});