Template.layout.onCreated(function() {
    Session.set('loggingIn', false);

    const clientID = 'gnaco6mlplv9shlc9demh6dljdny4we';
    Twitch.init({clientId: clientID}, function(error, status) {
        if (error) {
            console.log(error);
        }
    });
    Twitch.getStatus(function(err, status) {
        if (status.authenticated) {
            Session.set('twitchToken', status.token);
            if (!Meteor.userId()) {

            }
        }
    });

    //Control whether feedback button shows up
    Session.set('testing', true);
});

Template.layout.onRendered(function() {
    if (Meteor.userId()) {
        Meteor.setTimeout(function() {
            if('emails' in Meteor.user() && (typeof Meteor.user().emails[0] === 'string')) {
                Meteor.call('fixEmail', Meteor.user().emails[0]);
            }
        }, 3000);
    }
});

Template.layout.helpers({
    homeUnauthed: function() {
        const unauthed = typeof Meteor.userId() !== 'string';
        const isHome = Router.current().route.path() === '/';

        return unauthed && isHome;
    },
    loggingIn: function () {
        return Session.get('loggingIn');
    },
    testing: function() {
        return Session.get('testing');
    }
});

Template.layout.events({
    'click [data-hook=login-button]': function (e) {
        Session.set('loggingIn', true);

        $('[data-hook=login-container]').removeClass('rotate-in').addClass('rotate-out').delay(200).queue(function(next) {
            $('[data-hook=headline-text]').removeClass('rotate-in').addClass('rotate-out').delay(300).queue(function (next) {
                $(this).hide(0);
                $('[data-hook=login]').attr('class', 'rotate-in');
                next();
            });
            next();
        });
    },
    'click [data-hook=close-login]': function () {
        $('[data-hook=login]').removeClass('rotate-in').addClass('rotate-out').delay(300).queue(function (next) {
            //$(this).addClass('is-rotated');
            $('[data-hook=headline-text]').show(0).removeClass('rotate-out').addClass('rotate-in').delay(100).queue(function(next) {
                $('[data-hook=login-container]').removeClass('rotate-out').addClass('rotate-in');
                Session.set('loggingIn', false);
                next();
            });
            next();
        });
    }
});