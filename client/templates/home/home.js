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
        return typeof Meteor.userId() === 'string' ? '' : 'is-unauthed';
    },
    authed: function() {
        return typeof Meteor.userId() === 'string';
    }
});

Template.home.events({
    'click [data-track=watch]': function() {
        analytics.track('Home Button: Watch');
    },
    'click [data-track=stats]': function(e) {
        e.preventDefault(); // Remove for Stage 2
        analytics.track('Home Button: Stats');
    },
    'click [data-track=me]': function() {
        analytics.track('Home Button: Me');
    },
    'click [data-track=login]': function() {
        analytics.track('Home Button: Login');
    }
});