Template.home.onCreated(function() {
    Session.set('route', 'home');
});

Template.home.onRendered(function() {
    // check whether Critical Role is live
    const now = new Date(),
        isThur = now.getDay() === 4,
        utc = now.getTime(),
        offset = -8,
        pstDate = new Date(utc + (3600000 * offset)),
        isTime = pstDate.getUTCHours() >= 19;

    if (isThur && isTime) {
        $.get('https://api.twitch.tv/kraken/streams/geekandsundry', function(channel) {
           if (channel.stream) {
               Session.set('isLive', true);
           } else {
               Session.set('isLive', false);
           }
        });
    } else {
        Session.set('isLive', false);
    }
});

Template.home.helpers({
    isLive: function() {
        return Session.get('isLive');
    },
    authedClass: function() {
        return typeof Meteor.userId() === 'String' ? '' : 'is-unauthed';
    },
    authed: function() {
        return Meteor.userId().length > 0;
    }
});

Template.home.events({
    'click [data-track=watch]': function() {
        mixpanel.track('Watch button click');
    },
    'click [data-track=stats]': function(e) {
        e.preventDefault(); // Remove for Stage 2
        mixpanel.track('Stats button click');
    },
    'click [data-track=me]': function() {
        mixpanel.track('Profile button click');
    },
    'click [data-track=login]': function() {
        mixpanel.track('Login button click');
    }
});