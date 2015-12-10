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
            const $outLeft = $('.out-left');
            const $inRight = $('.in-right');
            const $lift = $('[data-hook=login-container]');
            const outLeftDur = getDuration($outLeft) / 3;
            const inRightDur = getDuration($inRight);
            let delay = -outLeftDur;

            $outLeft.each(function () {
                setDelay($(this), delay += outLeftDur);
                $(this).addClass('is-active');
            });
            setDelay($inRight, delay += outLeftDur);
            $inRight.addClass('is-active');
            setDelay($lift, delay += inRightDur);
            $lift.removeClass('is-active');
        }
    },

    'click [data-hook=close-login]': function () {
        if (Session.get('loggingIn')) {
            Session.set('loggingIn', false);
            const $outLeft = $('.out-left');
            const $inRight = $('.in-right');
            const $lift = $('[data-hook=login-container]');
            const liftDur = getDuration($('.lift'));
            console.log(liftDur);
            const outLeftDur = getDuration($outLeft) / 3;
            let delay = 0;

            setDelay($lift, 0);
            $lift.addClass('is-active');
            setDelay($inRight, delay += liftDur);
            $inRight.removeClass('is-active');

            $outLeft.each(function () {
                setDelay($(this), delay += outLeftDur);
                $(this).removeClass('is-active');
            });
        }
    }
});

const getDuration = function($element) {
    return $element.css('transition-duration').slice(0, -1) * 1000;
};

const setDelay = function($element, delay) {
    $element.css('transition-delay', delay + 'ms');
    $element.css('-webkit-transition-delay', delay + 'ms');
    $element.css('-moz-transition-delay', delay + 'ms');
    $element.css('-o-transition-delay', delay + 'ms');
};