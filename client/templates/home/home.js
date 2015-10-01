Template.home.onRendered(function() {
    // check whether Critical Role is live
    const now = new Date();
    const isThur = now.getDay() === 4;
    const utc = now.getTime();
    const offset = -8;
    const pstDate = new Date(utc + (3600000 * offset));
    const isTen = pstDate.getUTCHours() >= 22;

    if (isThur && isTen) {
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
    }
});

Template.home.events({
    'click [data-hook="live"]': function(e) {
        Router.go('companion');
    }
});