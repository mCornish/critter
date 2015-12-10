Template.layout.onCreated(function () {
    Session.set('loggingIn', false);

    const clientID = 'gnaco6mlplv9shlc9demh6dljdny4we';
    Twitch.init({clientId: clientID}, function (error, status) {
        if (error) {
            console.log(error);
        }
    });
    Twitch.getStatus(function (err, status) {
        if (status.authenticated) {
            Session.set('twitchToken', status.token);
            if (!Meteor.userId()) {

            }
        }
    });

    //Control whether feedback button shows up
    Session.set('testing', true);
});

Template.layout.onRendered(function () {
    if (Meteor.userId()) {
        Meteor.setTimeout(function () {
            if ('emails' in Meteor.user() && (typeof Meteor.user().emails[0] === 'string')) {
                Meteor.call('fixEmail', Meteor.user().emails[0]);
            }
        }, 3000);
    }
});

Template.layout.helpers({
    homeUnauthed: function () {
        const unauthed = typeof Meteor.userId() !== 'string';
        const isHome = Router.current().route.path() === '/';

        return unauthed && isHome;
    },
    loggingIn: function () {
        return Session.get('loggingIn');
    },
    testing: function () {
        return Session.get('testing');
    }
});

Template.layout.events({
    'click [data-hook=login-button]': function (e) {
        if (!Session.get('loggingIn')) {
            Session.set('loggingIn', true);
            let delay = 0;
            $('.out-left:not([data-hook=headline-text])').each(function () {
                setTimeout(() => $(this).addClass('is-active'), delay);
                delay += 100;
            }).on('transitionend', function () {
                $('.out-left').off();
                $('.in-right').addClass('is-active').on('transitionend', function () {
                    $(this).off();
                    $('.lift').removeClass('is-active');
                });
            });
        }
    },

    'click [data-hook=close-login]': function () {
        if (Session.get('loggingIn')) {
            Session.set('loggingIn', false);
            let delay = 0;
            $('.lift').addClass('is-active').on('transitionend', function () {
                $(this).off();
                $('.in-right').removeClass('is-active').on('transitionend', function () {
                    $(this).off();
                    $('.out-left').each(function () {
                        setTimeout(() => $(this).removeClass('is-active'), delay);
                        delay += 100;
                    });
                });
            });
        }
    }
});