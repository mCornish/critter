Template.watch.onCreated(function () {
    Session.set('route', 'watch');
    Session.set('choosing', true);
    Session.set('watching', false)
});

Template.watch.helpers({
    choosing: function() {
        return Session.get('choosing');
    },
    authed: function() {
        return typeof Meteor.userId() === 'string';
    }
});

Template.watch.events({
    'click [data-hook=watch]': function () {
        Session.set('watching', true);
        Session.set('choosing', false);
        mixpanel.track('Watch Past button click');
    },
    'click [data-hook="live"]': function() {
        mixpanel.track('Watch Live button click');
    },
    'click [data-track="track"]': function(e) {
        e.preventDefault(); // Remove for Stage 2

        mixpanel.track('Track button click');
    },
    'click [data-track="login"]': function(e) {
        e.preventDefault(); // Remove for Stage 2

        mixpanel.track('Login button click');
    }
});